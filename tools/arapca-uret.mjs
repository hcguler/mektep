// Ayet Ayet Arapça — veri üretici
// --------------------------------------------
// Yayındaki cüzlerin ders paketlerini (docs/arapca/veri/cNN.json) ve bütün mushafın dizinini
// (docs/arapca/veri/indeks.json) üretir. Plan: planlar/ayet-ayet-arapca.md
//
// Kaynaklar (indirilir, tools/arapca/.onbellek/ içinde saklanır; depoya alınmaz):
//   Arapça metin  Tanzil Quran Text (Simple), değiştirilmeden         fawazahmed0/quran-api: ara-quransimple
//   Meal          Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet)       fawazahmed0/quran-api: tur-diyanetisleri
//   Kelime        quran.com API v4 (QUL): sayfa, satır, transliterasyon, Türkçe kelime meali (QUL kaynak 99)
//   Zamanlama     quran.com API v4 tilavet 10 (QUL kaynak 107): Suûd eş-Şüreym, kelime zamanlaması
//   Çözümleme     Quranic Arabic Corpus v0.4 morfolojisi (GNU GPL), furqan.co düzeltmeleriyle
//                 (github.com/mustafa0x/quran-morphology)
// Elle yazılanlar (tools/arapca/):
//   ogeler.json      ekler, edatlar, kalıplar, deyimler, dil bilgisi konuları
//   sozluk.json      öğretilen kelimelerin (lemma) Türkçe anlamı ve Türkçedeki akrabaları
//   duzeltmeler.json kelime meali düzeltmeleri (İngilizce kalan ya da kaymış karşılıklar)
//   sayfalar.json    sayfa özeti ve "Akılda kalsın"
//
// Kullanım:
//   node tools/arapca-uret.mjs            yayındaki cüzleri üretir, eksik elle içerik varsa durur
//   node tools/arapca-uret.mjs --taslak   eksikleri tools/arapca/.onbellek/eksik-cNN.json'a yazar, durmaz
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SURE } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.join(here, '..');
const EL = path.join(here, 'arapca');
const ON = path.join(EL, '.onbellek');
const CIKTI = path.join(KOK, 'docs', 'arapca', 'veri');
const TASLAK = process.argv.includes('--taslak');
const YAYINDA = [1, 2, 3, 4, 5, 6, 7, 8];               // ders paketi üretilen cüzler
const DERS_KELIME = 8;             // sayfa başına en çok yeni kelime (lemma)
const DERS_YAPI = 3;               // sayfa başına en çok yeni ek/edat/kalıp (otomatik bulunanlar)
const EN_AZ = 3;                   // Kur'an'da bundan az geçen kelime öğretilmez (yalnızca dokun-gör)
const KARI = { ad: 'Suûd eş-Şüreym', kok: 'https://verses.quran.com/', tilavet: 10 };

const oku = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const dur = (m) => { console.error('arapca-uret: ' + m); process.exit(1); };

// ---------- İndirme (önbellekli) ----------
async function al(url, dosya, json = true) {
    const yol = path.join(ON, dosya);
    if (fs.existsSync(yol)) return json ? oku(yol) : fs.readFileSync(yol, 'utf8');
    fs.mkdirSync(path.dirname(yol), { recursive: true });
    for (let i = 0; i < 3; i++) {
        const r = await fetch(url).catch(() => null);
        if (r && r.ok) { const t = await r.text(); fs.writeFileSync(yol, t); return json ? JSON.parse(t) : t; }
        await new Promise((ok) => setTimeout(ok, 1500));
    }
    dur('indirilemedi: ' + url);
}
const QC = 'https://api.quran.com/api/v4/';
const qcSure = (c) => al(`${QC}verses/by_chapter/${c}?words=true&language=tr&per_page=300&word_fields=text_imlaei`, `qc/${c}.json`);
const qcSes = (c) => al(`${QC}recitations/${KARI.tilavet}/by_chapter/${c}?per_page=300&fields=segments`, `seg/${c}.json`);

// ---------- Okunuş: transliterasyondan Türkçe harflerle ----------
// Kaynak: quran.com kelime transliterasyonu (Corpus yazımı). Harf karşılıkları sabittir; kısa ünlüler
// kalın harflerin yanında a/u/ı, ötekilerde e/ü/i yazılır (Türkçe okunuş geleneğine yaklaşık uyum).
// Belirlilik takısı önceki kelimeye bitiştirilir; güneş harflerinde çift okunur; ayet sonunda durak yapılır.
const KALIN = new Set(['ṣ', 'ḍ', 'ṭ', 'ẓ', 'q', 'G', 'X']);          // her iki yanda kalınlaştırır
const KALIN_AU = new Set(['ḥ', 'ʿ', 'r']);                           // önceki ünsüz olarak a/u'yu kalınlaştırır
const GUNES = new Set(['t', 'T', 'd', 'D', 'r', 'z', 's', 'S', 'ṣ', 'ḍ', 'ṭ', 'ẓ', 'l', 'n']);
const HARF = { T: 's', D: 'z', S: 'ş', X: 'h', G: 'ğ', 'ṣ': 's', 'ḍ': 'd', 'ṭ': 't', 'ẓ': 'z', 'ḥ': 'h', q: 'k', j: 'c', w: 'v', 'ʿ': "'", H: "'" };
const MUKATTAA = { alif: 'Elif', lam: 'Lâm', laam: 'Lâm', meem: 'Mîm', mim: 'Mîm', ra: 'Râ', kaf: 'Kâf', qaf: 'Kâf', ha: 'Hâ', ya: 'Yâ', ain: 'Ayn', ayn: 'Ayn', sad: 'Sâd', saad: 'Sâd', ta: 'Tâ', sin: 'Sîn', seen: 'Sîn', nun: 'Nûn', noon: 'Nûn' };
const UNLU = 'aiuāīū';
function kelimeOkunus(tr, sonda) {
    const p = tr.toLowerCase().split('-');
    if (p.length > 1 && p.every((x) => MUKATTAA[x])) return { metin: p.map((x) => MUKATTAA[x]).join(' '), takı: null };
    let s = tr.toLowerCase().replace(/th/g, 'T').replace(/dh/g, 'D').replace(/sh/g, 'S').replace(/kh/g, 'X').replace(/gh/g, 'G');
    // kesme işareti: iki ünsüz arasında hece ayıracı (atılır), başka yerde hemze (H)
    s = s.replace(/'/g, (m, i) => (i > 0 && !UNLU.includes(s[i - 1]) && s[i + 1] && !UNLU.includes(s[i + 1]) ? '' : 'H'));
    let taki = null;   // 'gunes' | 'ay': belirlilik takısı önceki kelimeye bağlanır
    let on = '';       // ayrı söylenen önekler: wa, fa, a (soru), yā (nida)
    const onEk = (re, out) => { const m = re.exec(s); if (m) { on += out; s = s.slice(m[0].length); return true; } return false; };
    onEk(/^wa-?(?=.)/, 've ') || onEk(/^fa-(?=.)/, 'fe ');
    onEk(/^a-(?=.)/, 'e ');
    onEk(/^yā(?=a)/, 'yâ ');
    s = s.replace(/^(bil|lil|kal)-/, '$1');
    const ml = /^l-(.)/.exec(s);
    if (ml) { taki = GUNES.has(ml[1]) ? 'gunes' : 'ay'; s = GUNES.has(ml[1]) ? ml[1] + s.slice(2) : 'l' + s.slice(2); }
    s = s.replace(/^al-(.)/, (m, h) => (GUNES.has(h) ? 'a' + h + h : 'al' + h)).replace(/-/g, '');
    s = s.replace(/^(\w*?)llah(?=[uia]|$)/, '$1llāh');   // Allah adında uzun a (yalnızca çift lam)
    if (sonda) s = s.replace(/atun$|atin$|ata$|atu$|ati$/, 'ah').replace(/(un|in)$/, '').replace(/an$/, 'ā').replace(/([^aiuāīū])[aiu]$/, '$1');
    const ch = [...s];
    let out = '';
    const unsuz = (c) => c && !UNLU.includes(c);
    for (let i = 0; i < ch.length; i++) {
        const c = ch[i];
        if ('aiu'.includes(c)) {
            const once = unsuz(ch[i - 1]) ? ch[i - 1] : null, sonra = unsuz(ch[i + 1]) ? ch[i + 1] : null;
            const kalin = KALIN.has(once) || KALIN.has(sonra) || (c !== 'i' && (KALIN_AU.has(once) || sonra === 'ḥ'));
            out += c === 'a' ? (kalin ? 'a' : 'e') : c === 'u' ? (kalin ? 'u' : 'ü') : (kalin ? 'ı' : 'i');
        } else if (c === 'ā') out += 'â';
        else if (c === 'ī') out += 'î';
        else if (c === 'ū') out += 'û';
        else out += HARF[c] !== undefined ? HARF[c] : c;
    }
    out = out.replace(/^'/, '');
    return { metin: (on + out).replace(/ '/g, ' '), takı: taki };
}
// Kelime tek başına gösterilirken takı yazılır: "lkitâbü" → "el-kitâbü", "rrahmâni" → "er-rahmâni"
const tekOkunus = (k) => {
    if (!k.takı) return k.metin;
    if (/^llâh/.test(k.metin)) return 'A' + k.metin;          // Allah lafzı
    return ('e' + k.metin.charAt(0) + '-' + k.metin.slice(1)).replace(/-'/, '-');
};
function ayetOkunus(kelimeler) {
    let s = '';
    for (const k of kelimeler) {
        if (!s) { s = k.metin; continue; }
        if (k.takı) {
            // takıdan önce uzun ünlü kısalır (sükûnlu harfle karşılaşma)
            s = s.replace(/â$/, 'e').replace(/î$/, 'i').replace(/û$/, 'ü') + k.metin;
        } else s += ' ' + k.metin;
    }
    return s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
}

// ---------- Morfoloji ----------
function morfoloji(metin) {
    const M = {};
    for (const satir of metin.split('\n')) {
        if (!satir) continue;
        const [yer, bicim, tur, etiket] = satir.split('\t');
        const [s, a, w] = yer.split(':');
        const t = etiket.split('|');
        const liste = (M[`${s}:${a}:${w}`] ||= []);
        const seg = { b: bicim, ham: bicim.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/ى/g, 'ي'), tur, t, lem: null, kok: null, i: liste.length };
        for (const x of t) { if (x.startsWith('LEM:')) seg.lem = x.slice(4).normalize('NFC'); if (x.startsWith('ROOT:')) seg.kok = x.slice(5); }
        liste.push(seg);
    }
    return M;
}
const var_ = (seg, e) => seg.t.includes(e);
const ISLEV = ['PRON', 'DEM', 'REL'];
// Kelimenin ana parçası: zamir eki ve önek olmayan ilk isim/fiil; yoksa son edat
function anaParca(segs) {
    return segs.find((g) => (g.tur === 'N' || g.tur === 'V') && !var_(g, 'SUFF') && !var_(g, 'PREF') && g.lem)
        || [...segs].reverse().find((g) => g.lem && !var_(g, 'SUFF')) || segs[0];
}
const lemmaAnahtar = (g) => `${g.tur}:${g.lem}`;
const ogretilir = (g) => (g.tur === 'N' || g.tur === 'V') && !ISLEV.some((e) => var_(g, e)) && !var_(g, 'PN');

const KISI = { '1S': '1. tekil', '1P': '1. çoğul', '2MS': '2. tekil eril', '2FS': '2. tekil dişil', '2D': '2. ikil', '2MD': '2. ikil eril', '2FD': '2. ikil dişil', '2MP': '2. çoğul eril', '2FP': '2. çoğul dişil', '3MS': '3. tekil eril', '3FS': '3. tekil dişil', '3D': '3. ikil', '3MD': '3. ikil eril', '3FD': '3. ikil dişil', '3MP': '3. çoğul eril', '3FP': '3. çoğul dişil' };
const SAYI = { MS: 'eril tekil', FS: 'dişil tekil', MD: 'eril ikil', FD: 'dişil ikil', MP: 'eril çoğul', FP: 'dişil çoğul', M: 'eril', F: 'dişil', D: 'ikil', P: 'çoğul' };
const HAL = { NOM: 'merfû (yalın hâl)', ACC: 'mansûb (-i hâli)', GEN: 'mecrûr (tamlayan / edat sonrası)' };
const BAB = { 1: 'I. kalıp (sülâsî)', 2: 'II. kalıp (tef‘îl)', 3: 'III. kalıp (mufâale)', 4: 'IV. kalıp (if‘âl)', 5: 'V. kalıp (tefa‘‘ul)', 6: 'VI. kalıp (tefâ‘ul)', 7: 'VII. kalıp (infiâl)', 8: 'VIII. kalıp (iftiâl)', 9: 'IX. kalıp (if‘ilâl)', 10: 'X. kalıp (istif‘âl)' };
function tanim(g) {
    const t = g.t, p = [];
    if (g.tur === 'V') {
        p.push(var_(g, 'PERF') ? 'fiil, mâzî (geçmiş zaman)' : var_(g, 'IMPF') ? 'fiil, muzâri (şimdiki / geniş zaman)' : var_(g, 'IMPV') ? 'fiil, emir' : 'fiil');
        if (var_(g, 'PASS')) p.push('edilgen (meçhul)');
    } else if (g.tur === 'N') {
        p.push(var_(g, 'PN') ? 'özel isim' : var_(g, 'PRON') ? 'zamir' : var_(g, 'DEM') ? 'işaret ismi' : var_(g, 'REL') ? 'ilgi zamiri (ism-i mevsûl)'
            : var_(g, 'ACT_PCPL') ? 'ism-i fâil (yapan)' : var_(g, 'PASS_PCPL') ? 'ism-i mef‘ûl (yapılan)' : var_(g, 'VN') ? 'masdar (fiil ismi)'
                : var_(g, 'ADJ') ? 'sıfat' : var_(g, 'T') ? 'zaman zarfı' : var_(g, 'LOC') ? 'yer zarfı' : 'isim');
    } else p.push('harf (edat)');
    const vf = t.find((x) => x.startsWith('VF:'));
    if (vf && +vf.slice(3) > 1) p.push(BAB[+vf.slice(3)]);
    const k = t.find((x) => KISI[x]); if (k) p.push(KISI[k]);
    else { const s = t.find((x) => SAYI[x]); if (s && g.tur !== 'P') p.push(SAYI[s]); }
    const h = t.find((x) => HAL[x]); if (h) p.push(HAL[h]);
    if (var_(g, 'MOOD:SUBJ')) p.push('mansûb');
    if (var_(g, 'MOOD:JUS')) p.push('meczûm');
    return p.join(', ');
}

// ---------- Elle yazılan içerik ----------
const OGELER = oku(path.join(EL, 'ogeler.json'));
for (const o of OGELER.ogeler) if (o.eslesme && o.eslesme.lem) o.eslesme.lem = o.eslesme.lem.normalize('NFC');
const SOZLUK = oku(path.join(EL, 'sozluk.json'));
const DUZELT = oku(path.join(EL, 'duzeltmeler.json'));
const SAYFA_METIN = oku(path.join(EL, 'sayfalar.json'));
// eşleşme: tur (N/V/P), lem (Corpus lemması), etiket (hepsi), yok (hiçbiri), bicim (harekesiz biçim, düzenli ifade),
// bitisik (true: kelimenin ilk parçası değil; false: ilk parçası)
const eslesir = (seg, e) => (!e.tur || seg.tur === e.tur) && (!e.lem || seg.lem === e.lem) && (!e.etiket || e.etiket.every((x) => seg.t.includes(x)))
    && (!e.yok || !e.yok.some((x) => seg.t.includes(x))) && (!e.bicim || new RegExp(e.bicim).test(seg.ham)) && (e.bitisik === undefined || (seg.i > 0) === e.bitisik);

// ---------- Ana akış ----------
const [arS, trD, morf] = await Promise.all([
    al('https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/ara-quransimple.json', 'ara-quransimple.json'),
    al('https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/tur-diyanetisleri.json', 'tur-diyanetisleri.json'),
    al('https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt', 'quran-morphology.txt', false)
]);
const AR = {}, MEAL = {};
for (const x of arS.quran) AR[`${x.chapter}:${x.verse}`] = x.text.trim();
for (const x of trD.quran) MEAL[`${x.chapter}:${x.verse}`] = x.text.trim();
const BESMELE = AR['1:1'];
const M = morfoloji(morf);
// Corpus çözümlemesindeki doğrulanmış hatalar: "sure:ayet:kelime:parça" → doğru etiket dizisi
for (const [yer, etiket] of Object.entries(oku(path.join(EL, 'morfoloji-duzeltme.json')).duzeltme)) {
    const [s, a, w, i] = yer.split(':'); const seg = (M[`${s}:${a}:${w}`] || [])[i - 1];
    if (!seg) dur('morfoloji düzeltmesi: parça yok ' + yer);
    seg.t = etiket.split('|');
}

// Bütün sureler: sayfa, cüz, kelimeler
const SURELER = [];
for (let c = 1; c <= 114; c++) SURELER[c] = await qcSure(c);
const AYETLER = [];   // mushaf sırası
for (let c = 1; c <= 114; c++) {
    const j = SURELER[c];
    if (j.verses.length !== j.pagination.total_records) dur(`${c}. sure eksik indirildi`);
    for (const v of j.verses) AYETLER.push({ k: v.verse_key, s: c, a: v.verse_number, sayfa: v.page_number, cuz: v.juz_number, w: v.words.filter((x) => x.char_type_name === 'word') });
}
if (AYETLER.length !== 6236) dur('ayet sayısı 6236 değil: ' + AYETLER.length);

// Lemma sıklığı ve ilk geçtiği yer (mushaf sırası)
const LEM = new Map();   // anahtar -> { no, ar, kok, tur, sayi, ilk, ilkSayfa, seg }
for (const ay of AYETLER) for (const w of ay.w) {
    const segs = M[`${ay.k}:${w.position}`]; if (!segs) dur('morfoloji yok: ' + ay.k + ':' + w.position);
    const g = anaParca(segs); if (!g.lem) continue;
    const key = lemmaAnahtar(g);
    if (!LEM.has(key)) LEM.set(key, { no: LEM.size + 1, ar: g.lem, kok: g.kok, tur: g.tur, sayi: 0, ilk: ay.k, ilkSayfa: ay.sayfa, ogret: ogretilir(g), tanim: tanim(g) });
    LEM.get(key).sayi++;
}
const lid = (key) => 'l' + LEM.get(key).no;

// Ögelerin (ek, edat, kalıp) ilk geçtiği yer
const OGE = Object.fromEntries(OGELER.ogeler.map((o) => [o.id, o]));
const ogeIlk = {};
for (const ay of AYETLER) for (const w of ay.w) for (const seg of M[`${ay.k}:${w.position}`]) for (const o of OGELER.ogeler) {
    if (o.eslesme && !ogeIlk[o.id] && eslesir(seg, o.eslesme)) ogeIlk[o.id] = { k: ay.k, sayfa: ay.sayfa, w: w.position };
}
const sayfaOf = Object.fromEntries(AYETLER.map((a) => [a.k, a.sayfa]));
for (const o of OGELER.ogeler) {
    if (o.ornek) { if (!sayfaOf[o.ornek]) dur(`${o.id}: örnek ayet yok ${o.ornek}`); }
    else if (!o.eslesme) dur(`${o.id}: ne eşleşme ne örnek`);
    else if (!ogeIlk[o.id]) dur(`${o.id}: Kur'an'da eşleşme bulunamadı`);
}

// Sayfa → ayetler; tanzil kelimeleri ile corpus kelimelerinin hizalanması
const SAYFA = {};
for (const ay of AYETLER) (SAYFA[ay.sayfa] ||= []).push(ay);
function tanzilKelimeler(ay) {
    let t = AR[ay.k];
    if (ay.a === 1 && ay.s !== 1 && ay.s !== 9 && t.startsWith(BESMELE + ' ')) t = t.slice(BESMELE.length + 1);
    const ham = t.split(/\s+/);
    const tok = [];
    let bas = '';   // ayet başındaki hizip işareti (۞) sonraki kelimeye eklenir
    for (const x of ham) {
        if (/^[ۖ-ۭ]+$/.test(x)) { if (tok.length) tok[tok.length - 1] += ' ' + x; else bas += x + ' '; }
        else { tok.push(bas + x); bas = ''; }
    }
    // nida ünlemi "يَا" (ve "هَا"; önünde و/ف olabilir) Corpus'ta sonraki kelimeyle tek kelimedir
    let out = tok;
    for (let i = 0; out.length > ay.w.length && i < out.length - 1; i++) {
        const yalin = out[i].replace(/^[ۖ-ۭ]+ /, '');
        if (/^(?:وَ|فَ)?(?:يَا|هَا)$/.test(yalin)) out = [...out.slice(0, i), out[i] + ' ' + out[i + 1], ...out.slice(i + 2)];
    }
    if (out.length !== ay.w.length) dur(`${ay.k}: Tanzil (${out.length}) ile Corpus (${ay.w.length}) kelime sayısı tutmuyor`);
    return { metin: t, kelimeler: out };
}

// Zamanlama
const SES = {};
async function sesYukle(c) {
    if (SES[c]) return;
    const j = await qcSes(c);
    for (const a of j.audio_files) SES[a.verse_key] = { url: a.url, seg: a.segments || [] };
}

const eksik = { duzeltme: [], sozluk: [], sayfa: [] };
const indeks = { surum: 1, kari: KARI.ad, besmele: BESMELE, cuzler: [], sayfalar: [], sureler: SURE.slice(1) };
for (let c = 1; c <= 30; c++) {
    const ays = AYETLER.filter((a) => a.cuz === c);
    indeks.cuzler.push({ no: c, ilk: ays[0].k, son: ays[ays.length - 1].k, sayfa: [ays[0].sayfa, ays[ays.length - 1].sayfa], yayinda: YAYINDA.includes(c) });
}
for (let p = 1; p <= 604; p++) {
    const a = SAYFA[p]; if (!a) dur('sayfa boş: ' + p);
    indeks.sayfalar.push([a[0].k, a[a.length - 1].k, a[0].cuz]);
}

// Öğretim sırası: sayfa sayfa, mushaf sırasıyla; bir sonraki uygun sayfaya kaydırma
const ogretilen = new Set(), bekleyen = new Map(); // lemma -> ilk görüldüğü sayfa
const ogeBekleyen = [];
const ogeYer = {};   // otomatik ögenin öğretildiği sayfadaki örneği
function sayfaDersi(p) {
    const ays = SAYFA[p];
    const buradakiler = new Set();
    for (const ay of ays) for (const w of ay.w) { const g = anaParca(M[`${ay.k}:${w.position}`]); if (g.lem && ogretilir(g)) buradakiler.add(lemmaAnahtar(g)); }
    const aday = [...buradakiler].filter((k) => !ogretilen.has(k) && LEM.get(k).sayi >= EN_AZ);
    aday.sort((x, y) => LEM.get(y).sayi - LEM.get(x).sayi || LEM.get(x).no - LEM.get(y).no);
    const kelime = aday.slice(0, DERS_KELIME);
    kelime.forEach((k) => ogretilen.add(k));
    // ögeler: el ile sayfası belli olanlar (örnek ayetin sayfası) + otomatik bulunanlar (sınırlı)
    const elle = OGELER.ogeler.filter((o) => o.sayfa === undefined && o.ornek && sayfaOf[o.ornek] === p).map((o) => o.id);
    const oto = OGELER.ogeler.filter((o) => o.sayfa === undefined && !o.ornek && ogeIlk[o.id] && ogeIlk[o.id].sayfa === p).map((o) => o.id);
    ogeBekleyen.push(...oto);
    const yapilar = [];
    for (const id of [...ogeBekleyen]) {
        if (yapilar.length >= DERS_YAPI) break;
        // kaydırılan öge bu sayfada da geçiyorsa öğretilir
        let yer = null;
        for (const ay of ays) { const w = ay.w.find((x) => M[`${ay.k}:${x.position}`].some((s) => eslesir(s, OGE[id].eslesme))); if (w) { yer = `${ay.k}:${w.position}`; break; } }
        if (yer) { yapilar.push(id); ogeYer[id] = yer; ogeBekleyen.splice(ogeBekleyen.indexOf(id), 1); }
    }
    return { kelime, ogeler: [...elle, ...yapilar] };
}

const yayindaSayfalar = new Set(indeks.cuzler.filter((c) => c.yayinda).flatMap((c) => Array.from({ length: c.sayfa[1] - c.sayfa[0] + 1 }, (_, i) => c.sayfa[0] + i)));
const paket = {};
let sonSayfa = Math.max(...yayindaSayfalar);
for (let p = 1; p <= sonSayfa; p++) {
    const ders = sayfaDersi(p);
    const cuz = SAYFA[p][0].cuz;
    if (!yayindaSayfalar.has(p)) continue;
    const pk = (paket[cuz] ||= { _aciklama: '', cuz, kari: { ad: KARI.ad, kok: KARI.kok }, kaynaklar: OGELER.kaynaklar, sayfalar: [], ayetler: {}, sozluk: {}, ogeler: {} });
    for (const ay of SAYFA[p]) await sesYukle(ay.s);
    const ayetler = [];
    for (const ay of SAYFA[p]) {
        const tz = tanzilKelimeler(ay);
        const okler = ay.w.map((w, i) => kelimeOkunus(w.transliteration.text || '', i === ay.w.length - 1));
        // Tanzil'de ayrı yazılan nida "يَا" (ve "هَا") okunuşta da ayrı: "yâkavmi" → "yâ kavmi"
        tz.kelimeler.forEach((x, i) => {
            const m = /^(?:[ۖ-ۭ]+ )?(وَ|فَ)?(يَا|هَا) /.exec(x);
            if (!m) return;
            const ek = { 'وَ': 've', 'فَ': 'fe' }[m[1]] || '', on = m[2] === 'يَا' ? 'yâ' : 'hâ';
            let met = okler[i].metin;
            if (ek) { if (!met.startsWith(ek)) return; met = met.slice(ek.length).replace(/^ /, ''); }
            if (met.startsWith(on) && met[on.length] !== ' ') okler[i].metin = (ek ? ek + ' ' : '') + on + ' ' + met.slice(on.length).replace(/^'/, '');
        });
        const kel = ay.w.map((w, i) => {
            const yer = `${ay.k}:${w.position}`;
            const segs = M[yer];
            const g = anaParca(segs);
            let tr = w.translation && w.translation.text;
            let tk = 'q';
            if (DUZELT[yer] !== undefined) { tr = DUZELT[yer]; tk = 'd'; }
            else if (!w.translation || w.translation.language_name !== 'turkish') eksik.duzeltme.push({ yer, ar: tz.kelimeler[i], en: tr, meal: MEAL[ay.k] });
            const lkey = g.lem ? lemmaAnahtar(g) : null;
            if (lkey) {
                const L = LEM.get(lkey);
                const id = lid(lkey);
                if (!pk.sozluk[id]) pk.sozluk[id] = { ar: L.ar, kok: L.kok, tur: L.tur, sayi: L.sayi, ilk: L.ilk, ilkSayfa: L.ilkSayfa, ...(L.ogret ? {} : { og: 0 }) };
            }
            const parca = segs.map((s) => {
                const o = OGELER.ogeler.find((x) => x.eslesme && eslesir(s, x.eslesme));
                return [s.b, var_(s, 'PREF') ? 'on' : var_(s, 'SUFF') ? 'son' : 'gv', o ? o.id : '', tanim(s)];
            });
            const out = { ar: tz.kelimeler[i], ok: tekOkunus(okler[i]), tr, l: lkey ? lid(lkey) : '', p: parca, t: tanim(g), sat: w.line_number };
            if (tk !== 'q') out.tk = tk;
            return out;
        });
        // birleşik meal: komşu ayet aynı meali taşıyorsa grup başı yazılır
        let mg = null;
        const onceki = `${ay.s}:${ay.a - 1}`;
        if (MEAL[onceki] && MEAL[onceki] === MEAL[ay.k]) { mg = onceki; while (MEAL[`${ay.s}:${+mg.split(':')[1] - 1}`] === MEAL[ay.k]) mg = `${ay.s}:${+mg.split(':')[1] - 1}`; }
        const ses = SES[ay.k];
        let seg = null;
        if (ses && ses.seg.length === ay.w.length && ses.seg.every((x, i) => x[1] === i + 1 && x[3] > x[2]) && ses.seg.every((x, i) => i === 0 || x[2] >= ses.seg[i - 1][2])) seg = ses.seg.map((x) => [x[2], x[3]]);
        pk.ayetler[ay.k] = {
            s: ay.s, a: ay.a, ar: tz.metin, ok: ayetOkunus(okler), meal: MEAL[ay.k], ...(mg ? { mg } : {}),
            ses: ses ? ses.url : `Shuraym/mp3/${String(ay.s).padStart(3, '0')}${String(ay.a).padStart(3, '0')}.mp3`, ...(seg ? { seg } : {}),
            satir: [ay.w[0].line_number, ay.w[ay.w.length - 1].line_number], k: kel
        };
        ayetler.push(ay.k);
    }
    for (const k of ders.kelime) {
        const id = lid(k), L = LEM.get(k), el = SOZLUK[k];
        if (!el) eksik.sozluk.push({ anahtar: k, id, ar: L.ar, kok: L.kok, sayi: L.sayi, ilk: L.ilk, tanim: L.tanim });
        // örnek: bu sayfada lemmanın geçtiği ilk kelime
        let ornek = null;
        for (const ay of SAYFA[p]) { const i = ay.w.findIndex((w) => lemmaAnahtar(anaParca(M[`${ay.k}:${w.position}`])) === k); if (i >= 0) { ornek = `${ay.k}:${i + 1}`; break; } }
        Object.assign(pk.sozluk[id], { anlam: el ? el.anlam : '', ...(el && el.akraba && el.akraba.length ? { akraba: el.akraba } : {}), ...(el && el.not ? { not: el.not } : {}), ...(el && el.simge ? { simge: el.simge } : {}), ders: p, ornek });
    }
    for (const id of ders.ogeler) {
        const o = OGE[id];
        pk.ogeler[id] = { ...o, ders: p, ornek: o.ornek || ogeYer[id] };
        delete pk.ogeler[id].eslesme;
    }
    const sm = SAYFA_METIN[String(p)];
    if (!sm || !sm.ozet || !sm.akilda) eksik.sayfa.push(p);
    pk.sayfalar.push({ no: p, ayetler, kelime: ders.kelime.map(lid), ogeler: ders.ogeler, ozet: sm ? sm.ozet : '', akilda: sm ? sm.akilda : '' });
}

// Başlangıç dersi (sayfa 0): elle seçilen ögeler, ilk cüz paketinde
if (paket[1]) {
    const bas = OGELER.ogeler.filter((o) => o.sayfa === 0);
    for (const o of bas) { paket[1].ogeler[o.id] = { ...o, ders: 0, ornek: o.ornek || `${ogeIlk[o.id].k}:${ogeIlk[o.id].w}` }; delete paket[1].ogeler[o.id].eslesme; }
    const sm = SAYFA_METIN['0'];
    paket[1].baslangic = { ogeler: bas.map((o) => o.id), ozet: sm ? sm.ozet : '', akilda: sm ? sm.akilda : '' };
}

const toplam = eksik.duzeltme.length + eksik.sozluk.length + eksik.sayfa.length;
if (toplam) {
    for (const c of YAYINDA) fs.writeFileSync(path.join(ON, `eksik-c${String(c).padStart(2, '0')}.json`), JSON.stringify(eksik, null, 1));
    const msg = `eksik elle içerik: ${eksik.duzeltme.length} kelime meali düzeltmesi, ${eksik.sozluk.length} sözlük, ${eksik.sayfa.length} sayfa metni (tools/arapca/.onbellek/eksik-*.json)`;
    if (!TASLAK) dur(msg);
    console.warn('UYARI ' + msg);
}

fs.mkdirSync(CIKTI, { recursive: true });
const ACIKLAMA = "Ayet Ayet Arapça ders paketi. tools/arapca-uret.mjs ile üretilir; elle düzenlemeyin. Arapça: Tanzil Quran Text (Simple), değiştirilmeden. Meal: Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet). Kelime çözümlemesi: Quranic Arabic Corpus v0.4 (GNU GPL), furqan.co düzeltmeleriyle. Sayfa, satır, transliterasyon ve Türkçe kelime meali: quran.com / QUL. Kıraat ve kelime zamanlaması: Suûd eş-Şüreym, quran.com.";
for (const [c, pk] of Object.entries(paket)) {
    pk._aciklama = ACIKLAMA;
    fs.writeFileSync(path.join(CIKTI, `c${String(c).padStart(2, '0')}.json`), JSON.stringify(pk));
}
fs.writeFileSync(path.join(CIKTI, 'indeks.json'), JSON.stringify(indeks));

// Denetim özeti
for (const [c, pk] of Object.entries(paket)) {
    const n = Object.keys(pk.ayetler).length, seg = Object.values(pk.ayetler).filter((a) => a.seg).length;
    const kel = pk.sayfalar.reduce((t, s) => t + s.kelime.length, 0), og = Object.keys(pk.ogeler).length;
    console.log(`c${c}: ${pk.sayfalar.length} sayfa, ${n} ayet (${seg} ayette kelime zamanlaması), ${kel} öğretilen kelime, ${og} öge, ${Object.keys(pk.sozluk).length} sözlük kaydı, ${Math.round(JSON.stringify(pk).length / 1024)} KB`);
}
