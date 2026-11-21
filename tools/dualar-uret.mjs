// Kur'an Duaları — dua metinleri üretici ve okunuş denetimi
// --------------------------------------------------------
// 1. Her duanın Arapçasını Tanzil (Simple) metninden alır; elle yazılmaz, hareke eklenip çıkarılmaz.
//    Dua ayetin bir parçasıysa "bas" / "son" (harekesiz Arapça kelime) ile kelime sınırından kesilir.
// 2. Meali Diyanet İşleri mealinden (Tanzil, tr.diyanet) alır. Bu mealde birleşik yazılmış ayet grupları
//    kendiliğinden bulunur ve bütünüyle alınır; dua kısmı "mealBas" / "mealSon" işaretleriyle kesilir.
//    İşaret bulunamazsa üretici durur.
// 3. Okunuşu denetler: Arapça metinden ünsüz iskeleti çıkarılır (harekeler, uzatma harfleri, ayın ve
//    hemze düşer; şemsî harflerde lâm düşer; şedde ve aynı harf tekrarları teke iner) ve data.js'teki
//    okunuşun iskeletiyle karşılaştırılır. Uyuşmazlık varsa üretici durur ve farkı gösterir.
//    Ünlüler ve uzatmalar bu denetimin dışındadır.
// Çıktı: docs/dualar/metinler.js (window.DUA_METIN)
// Kullanım:  node tools/dualar-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { edition, parseRef, SURE } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'dualar');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.DUA_DATA;

const [ar, tr] = await Promise.all([edition('ara-quransimple', dir), edition('tur-diyanetisleri', dir)]);
const idx = (list) => Object.fromEntries(list.map((x) => [x.chapter + ':' + x.verse, x.text.trim()]));
const A = idx(ar), T = idx(tr);
const BESMELE = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';

const HAREKE = /[ً-ْٰٓ-ٕۖ-ۭـ]/g;
const bare = (w) => w.replace(HAREKE, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
const isWord = (w) => /[ء-ي]/.test(w);

// ---- Arapça kesit
function arKesit(d) {
    const { s, a, b } = parseRef(d.ayet);
    let words = [];
    const tam = [];
    for (let v = a; v <= b; v++) {
        let t = A[`${s}:${v}`];
        if (!t) throw new Error(`${d.id}: ayet yok ${s}:${v}`);
        if (v === 1 && s !== 1 && s !== 9 && t.startsWith(BESMELE)) t = t.slice(BESMELE.length);
        tam.push(t);
        words = words.concat(t.split(/\s+/));
        if (v < b) words.push(`﴿${v.toLocaleString('ar-EG')}﴾`);
    }
    const tamMetin = tam.join(' ۝ ');
    let i = 0, j = words.length - 1;
    if (d.bas) { let n = d.basNo || 1; i = words.findIndex((w) => (bare(w) === d.bas || bare(w).replace(/^[وف]/, '') === d.bas) && --n === 0); if (i < 0) throw new Error(`${d.id}: "${d.bas}" bulunamadı`); }
    if (d.son) { j = words.findIndex((w, k) => k >= i && bare(w) === d.son); if (j < 0) throw new Error(`${d.id}: "${d.son}" bulunamadı`); }
    const parca = words.slice(i, j + 1).filter((w) => isWord(w) || /^[ۖۗۚۛۙۘ]$/.test(w) || /^﴿.*﴾$/.test(w));
    while (parca.length && !isWord(parca[parca.length - 1])) parca.pop();
    return { ar: parca.join(' '), tam: a === b ? tamMetin : tam.map((t, k) => `${t} ﴿${(a + k).toLocaleString('ar-EG')}﴾`).join(' ') };
}

// ---- Meal kesiti (birleşik grupları bütün alarak)
function mealKesit(d) {
    const { s, a, b } = parseRef(d.ayet);
    let x = a, y = b;
    while (T[`${s}:${x - 1}`] && T[`${s}:${x - 1}`] === T[`${s}:${x}`]) x--;
    while (T[`${s}:${y + 1}`] && T[`${s}:${y + 1}`] === T[`${s}:${y}`]) y++;
    const bloklar = [];
    for (let v = x; v <= y; v++) if (!bloklar.length || bloklar[bloklar.length - 1].text !== T[`${s}:${v}`]) bloklar.push({ v, text: T[`${s}:${v}`] });
    // birden çok meal bloğu varsa her birinin başına ayet numarası konur: (40) … (41) …
    const tam = bloklar.length > 1 ? bloklar.map((q) => `(${q.v}) ${q.text}`).join(' ') : bloklar[0].text;
    let i = 0, j = tam.length;
    if (d.mealBas) { i = tam.indexOf(d.mealBas); if (i < 0) throw new Error(`${d.id}: meal işareti bulunamadı: "${d.mealBas}"`); }
    if (d.mealSon) { const k = tam.indexOf(d.mealSon, i); if (k < 0) throw new Error(`${d.id}: meal son işareti bulunamadı: "${d.mealSon}"`); j = k + d.mealSon.length; }
    let m = tam.slice(i, j).trim().replace(/^[-"“\s]+/, '').replace(/[\s"”-]+$/, '');
    m = m.replace(/(\S)\s+\((\d+)\)\s/g, '$1 ($2) ').replace(/^\(\d+\)\s*/, '').trim();
    // tek tırnak dengesini koru
    if ((m.match(/"/g) || []).length % 2) m = m.replace(/"/g, '');
    return { meal: m, tam, grup: x === a && y === b ? null : `${s}:${x}-${y}` };
}

// ---- Okunuş denetimi: ünsüz iskeleti
const HARF = { 'ب': 'b', 'ت': 't', 'ث': 's', 'ج': 'c', 'ح': 'h', 'خ': 'h', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'ş', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'غ': 'g', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h' };
const FATHA = 'َ', DAMMA = 'ُ', KASRA = 'ِ', SUKUN = 'ْ', SEDDE = 'ّ', TANVIN = /[ً-ٍ]/;
function arIskelet(metin) {
    // durak: metnin sonu ya da ardından vakıf işareti gelen kelime (tenvin okunmaz, tâ-i merbûta "h" okunur)
    const tum = metin.split(/\s+/);
    const kelimeler = tum.map((k, i) => ({ k, durak: i === tum.length - 1 || (tum[i + 1] && !isWord(tum[i + 1])) })).filter((x) => isWord(x.k));
    let out = '';
    kelimeler.forEach(({ k, durak: son }) => {
        // harfleri işaretleriyle grupla
        const g = [];
        for (const ch of k) {
            if (/[ء-يٱ]/.test(ch)) g.push({ h: ch, m: '' });
            else if (g.length) g[g.length - 1].m += ch;
        }
        g.forEach((x, i) => {
            const prev = g[i - 1], next = g[i + 1];
            const hareke = /[َ-ْ]/.test(x.m) || x.m.includes(SEDDE);
            if (x.h === 'ل' && !hareke && prev && /[اٱ]/.test(prev.h) && next && next.m.includes(SEDDE)) return; // şemsî harf: lâm okunmaz
            if (x.h === 'و') { if (!hareke && prev && (prev.m.includes(DAMMA) || !next)) return; out += 'v'; }
            else if (x.h === 'ي') { if (!hareke && prev && prev.m.includes(KASRA)) return; out += 'y'; }
            else if (x.h === 'ة') out += son ? 'h' : 't';
            else if (HARF[x.h]) out += HARF[x.h];
            if (TANVIN.test(x.m) && !son) out += 'n';
        });
    });
    return out.replace(/(.)\1+/g, '$1');
}
const trIskelet = (okunus) => okunus.toLocaleLowerCase('tr').replace(/ğ/g, 'g').replace(/[^bcçdfghjklmnprsştvyz]/g, '').replace(/(.)\1+/g, '$1');

const out = {}, hata = [];
for (const d of D.dualar) {
    try {
        const a = arKesit(d), m = mealKesit(d);
        const { s, a: v1, b: v2 } = parseRef(d.ayet);
        const ai = arIskelet(a.ar), ti = trIskelet(d.ok);
        // Arapça son kelimesi tâ-i merbûta ise okunuşta sondaki h kabul edilir
        const ti2 = ti;
        if (ai !== ti && ai !== ti2) hata.push(`${d.id}: okunuş iskeleti tutmuyor\n    Arapça : ${ai}\n    okunuş : ${ti}`);
        out[d.id] = { sure: SURE[s], no: v1 === v2 ? String(v1) : `${v1}-${v2}`, ar: a.ar, meal: m.meal, arTam: a.tam, mealTam: m.tam, mealGrup: m.grup };
    } catch (e) { hata.push(e.message); }
}
if (hata.length) { console.error('Hata:\n  ' + hata.join('\n  ')); process.exit(1); }
fs.writeFileSync(path.join(root, 'metinler.js'), `// Bu dosya tools/dualar-uret.mjs ile üretilir; elle düzenlemeyin.
// Arapça: Tanzil Quran Text (Simple), değiştirilmeden. Meal: Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet).
// ar / meal: duanın kendisi · arTam / mealTam: ayetin tamamı (meal birleşik gruptaysa grubun tamamı)
window.DUA_METIN = ${JSON.stringify(out, null, 1)};
`);
console.log(`docs/dualar/metinler.js: ${Object.keys(out).length} dua · okunuşların hepsi Arapça iskeletle uyumlu`);
