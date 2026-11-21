// İslam'da Kavram Haritası — sesli anlatım metni üretici
// --------------------------------------------
// docs/kavram/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve
// seslendirilmek üzere hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm).
// Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir. Arapça metin seslendirilmez; ayetlerin yalnızca meali okunur.
//
// Biçim tools/namaz-anlatim.json ve tools/ezberler-anlatim.json ile aynıdır: her kayıt
// sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da
// [metin, duraklama] çiftidir (duraklama: parçadan sonraki sessizlik, saniye).
//
// Kullanım:  node tools/kavram-anlatim.mjs
// Çıktı:     tools/kavram-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'kavram');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sandbox);
const DATA = sandbox.window.KAVRAM_DATA;
const AYET = sandbox.window.KAVRAM_AYETLER;

// ---- Sayıları yazıya çevirme (0-999) ----
const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
function sayi(n) {
    if (n === 0) return 'sıfır';
    const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10;
    return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ');
}

const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
function sira(n) { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); }

// Kulak için temizlik: parantez, tırnak ve simgeler kaldırılır; sayılar yazıya çevrilir.
function temiz(t) {
    return String(t)
        .replace(/^\(Allah buyurur:\)\s*/, 'Allah buyurur ki: ')
        .replace(/\s*\(([^)]*)\)/g, ', $1,')
        .replace(/,\s*([.,;:!?])/g, '$1')
        .replace(/[«»“”"]/g, '')
        .replace(/\b(\d{1,3})\b/g, (m) => sayi(Number(m)))
        .replace(/\s+/g, ' ')
        .replace(/,\s*$/, '')
        .trim();
}
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ“])/).map((s) => s.trim()).filter(Boolean);
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const kucuk = (t) => t.charAt(0).toLocaleLowerCase('tr') + t.slice(1);
function rivayet(k) {
    const n = [];
    if (/Buhârî/.test(k)) n.push('Buhârî');
    if (/Müslim/.test(k)) n.push('Müslim');
    return n.length ? `Bu hadisi ${n.join(' ve ')} rivayet etmiştir.` : '';
}

const grupAd = Object.fromEntries(DATA.gruplar.map((g) => [g.id, g.ad]));
const duraklar = DATA.kavramlar.map((k) => {
    const p = [];
    p.push([nokta(`${temiz(k.ad)}. ${temiz(k.kisa)}`), 0.7]);
    p.push(...cumleler(k.tanim));
    if (k.yaparsan) {
        p.push(nokta(`Yaparsan, ${kucuk(temiz(k.yaparsan))}`));
        p.push([nokta(`Yapmazsan, ${kucuk(temiz(k.yapmazsan))}`), 0.6]);
    }
    p.push(['Delilleri şöyledir.', 0.6]);
    for (const d of k.deliller || []) {
        if (d.ayet) {
            const a = AYET[d.ayet];
            const [ilk, son] = String(a.no).split('-').map(Number);
            p.push(son ? `${a.sure} Suresi, ${sira(ilk)} ve ${sira(son)} ayetlerin anlamı şöyledir.` : `${a.sure} Suresi, ${sira(ilk)} ayetin anlamı şöyledir.`);
            p.push(...cumleler(nokta(a.meal)));
        } else {
            const h = DATA.hadisler[d.hadis];
            p.push('Peygamberimiz şöyle buyurmuştur.');
            p.push(...cumleler(h.metin));
            const r = rivayet(h.kaynak);
            if (r) p.push(r);
        }
        if (d.not) p.push(...cumleler(d.not));
        p[p.length - 1] = [Array.isArray(p[p.length - 1]) ? p[p.length - 1][0] : p[p.length - 1], 0.6];
    }
    p.push(['Günlük hayattan örnekler.', 0.6]);
    for (const o of k.ornekler || []) p.push(nokta(temiz(o.metin)));
    if (k.mezhep) { p.push(['Mezhep notu.', 0.4]); p.push(...cumleler(k.mezhep)); }
    p.push(['Akılda kalsın.', 0.6]);
    p.push([nokta(temiz(k.akilda)), 1]);
    return { dosya: k.id, baslik: k.ad, tur: grupAd[k.grup], parcalar: p };
});

const out = {
    _aciklama: "İslam'da Kavram Haritası sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt, sırayla seslendirilen parçalardan oluşur. Parça ya bir metindir ya da [metin, duraklama] çiftidir; duraklama o parçadan sonraki sessizliktir (saniye). Arapça metin seslendirilmez; ayetlerin meali okunur. Bu dosya tools/kavram-anlatim.mjs ile docs/kavram/data.js ve ayetler.js içeriğinden üretilir; elle düzenlemeyin.",
    tam: tamAnlatim(duraklar, { baslik: "İslam'da Kavram Haritası", acilis: [["İslam'da Kavram Haritası.", 1.2]] }),
    duraklar
};
fs.writeFileSync(path.join(here, 'kavram-anlatim.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`tools/kavram-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
