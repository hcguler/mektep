// Zekât ve Sadaka Rehberi — ayetler, hadis denetimi ve içerik denetimi
// --------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/zekat/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir (Bakara 183-184 gibi).
//    Sekiz sınıf ekranı için Tevbe 60 her zaman üretilir.
// 2. Her hadis künyesini fawazahmed0/hadith-api ile denetler (eng-bukhari, eng-muslim): numara o kitapta var mı,
//    künyedeki kitap adı tutuyor mu, metinde râvinin adı geçiyor mu. Müslim numarası M. Fuâd Abdülbâkî numarasıdır
//    (arabicnumber; 979.01 gibi ondalıklı alt numaralar aynı hadise sayılır). Müslim'de aynı Abdülbâkî numarası
//    iki ayrı kitapta geçebildiği için kitap, hadisin sıra numarasının (hadithnumber) düştüğü bölümden bulunur
//    (tools/sahabe-uret.mjs ile aynı yöntem). Künyedeki her numara denetim listesinde (k) olmalıdır. Uyuşmazlıkta durur.
// 3. İçerik denetimi: zorunlu alanlar, bölüm/konu kimlikleri, hüküm türleri, Kavram Haritası kimlikleri, iç bağlantılar,
//    sekiz sınıf, "Verebilir miyim?" cevabının bağlı konunun hükmüyle (verilir | verilmez) aynı olması, yıllık
//    değerlerin tarih ve Diyanet adresiyle tutulması.
// 4. Oruç Rehberi ile ortak metin: oruç fidyesi ve kefaretinin açıklaması, akılda kalsın cümlesi ve kaynağı;
//    fitrenin ilk iki paragrafı ve hadisi; fitre ve fidye tutarı, tarihi ve adresi docs/oruc/data.js ile aynı olmalıdır.
// Kullanım:  node tools/zekat-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'zekat');
const dir = process.argv[2];
const load = (file, name) => { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), sb); return sb.window[name]; };
const D = load(path.join(root, 'data.js'), 'ZEKAT_DATA');
const KAV = load(path.join(here, '..', 'docs', 'kavram', 'data.js'), 'KAVRAM_DATA');
const ORUC = load(path.join(here, '..', 'docs', 'oruc', 'data.js'), 'ORUC_DATA');

// ---- içerik denetimi
const hata = [];
const BOL = new Set(D.bolumler.map((b) => b.id));
const BY = Object.fromEntries(D.konular.map((k) => [k.id, k]));
const KAVRAM = new Set(KAV.kavramlar.map((k) => k.id));
const OYUN = ['verilir', 'verilmez'];
if (Object.keys(BY).length !== D.konular.length) hata.push('konu kimliği iki kez kullanılmış');
for (const [id, h] of Object.entries(D.hukumler)) {
    if (!h.ad || !h.tam || !h.cumle) hata.push(`hüküm ${id}: ad, tam ya da cümle eksik`);
    if (h.kavram && !KAVRAM.has(h.kavram)) hata.push(`hüküm ${id}: Kavram Haritası'nda "${h.kavram}" yok`);
}
const icBag = (href, yer) => {
    const m = /^#\/(k\/([\w-]+)|siniflar|hesapla|kim|paylas)$/.exec(href);
    if (href.startsWith('../oruc/#/k/')) { const id = href.slice(12); if (!ORUC.konular.some((k) => k.id === id)) hata.push(`${yer}: Oruç Rehberi'nde "${id}" konusu yok`); return; }
    if (!m) { hata.push(`${yer}: bağlantı tanınmıyor (${href})`); return; }
    if (m[2] && !BY[m[2]]) hata.push(`${yer}: bağlantıdaki konu yok (${m[2]})`);
};
for (const k of D.konular) {
    for (const f of ['ad', 'emo', 'kisa', 'akilda']) if (!k[f]) hata.push(`${k.id}: "${f}" boş`);
    if (!Array.isArray(k.aciklama) || k.aciklama.length < 1 || k.aciklama.length > 4) hata.push(`${k.id}: açıklama 1–4 paragraf olmalı`);
    if (!Array.isArray(k.kaynak) || !k.kaynak.length) hata.push(`${k.id}: kaynak yok`);
    if (!BOL.has(k.bolum)) hata.push(`${k.id}: bölüm bilinmiyor (${k.bolum})`);
    if (k.hukum && !D.hukumler[k.hukum]) hata.push(`${k.id}: hüküm türü bilinmiyor (${k.hukum})`);
    for (const c of k.kavramlar || []) if (!KAVRAM.has(c)) hata.push(`${k.id}: Kavram Haritası'nda "${c}" yok`);
    if (k.deger && !D.degerler[k.deger]) hata.push(`${k.id}: değer bilinmiyor (${k.deger})`);
    if (k.mezhep && !/^Şâfiî/.test(k.mezhep)) hata.push(`${k.id}: mezhep notu "Şâfiî …" diye başlamalı`);
    if (k.baglanti) { if (!k.baglanti.ad || !k.baglanti.alt) hata.push(`${k.id}: bağlantı adı ya da açıklaması eksik`); icBag(k.baglanti.href, k.id); }
}
for (const b of D.bolumler) if (!D.konular.some((k) => k.bolum === b.id)) hata.push(`bölüm ${b.id}: konu yok`);

// Sekiz sınıf (Tevbe 60): tam sekiz, sırası ayetteki gibi
const SINIF = ['fakir', 'miskin', 'amil', 'muellefe', 'rikab', 'garim', 'fisebilillah', 'ibnussebil'];
if (D.siniflar.map((s) => s.id).join() !== SINIF.join()) hata.push('sınıflar Tevbe 60 sırasıyla sekiz olmalı: ' + SINIF.join(', '));
for (const s of D.siniflar) {
    for (const f of ['ad', 'meal', 'emo', 'aciklama', 'bugun', 'kaynak']) if (!s[f]) hata.push(`sınıf ${s.id}: "${f}" boş`);
    if (s.konu && !BY[s.konu]) hata.push(`sınıf ${s.id}: konu bilinmiyor (${s.konu})`);
    if (s.mezhep && !/^Şâfiî/.test(s.mezhep)) hata.push(`sınıf ${s.id}: mezhep notu "Şâfiî …" diye başlamalı`);
}

// Verebilir miyim? oyunu
const kisiIds = new Set();
for (const s of D.kisiler) {
    if (kisiIds.has(s.id)) hata.push(`kişi ${s.id}: kimlik iki kez`);
    kisiIds.add(s.id);
    const k = BY[s.konu];
    if (!k) { hata.push(`kişi ${s.id}: konu bilinmiyor (${s.konu})`); continue; }
    if (!OYUN.includes(s.cevap)) hata.push(`kişi ${s.id}: cevap türü oyunda yok (${s.cevap})`);
    if (k.hukum !== s.cevap) hata.push(`kişi ${s.id}: cevap "${s.cevap}" ↔ konu ${k.id} hükmü "${k.hukum}"`);
    if (!s.ad || !s.emo || !s.aciklama) hata.push(`kişi ${s.id}: ad, emoji ya da açıklama boş`);
}
if (D.kisiler.length < 10) hata.push('Verebilir miyim? için en az on kişi gerekir');

// Değerler: tutarlı olanlar tarih + Diyanet adresiyle; nisap gramla ve kaynakla
for (const [ad, v] of Object.entries(D.degerler)) {
    if ('gram' in v) { if (!(v.gram > 0) || !v.kaynak || !v.olcu) hata.push(`değer ${ad}: gram, ölçü ve kaynak gerekli`); continue; }
    if (v.tutar == null) continue; // doğrulanamadıysa null kalır; ekranda "Diyanet'in açıklamasına bakın"
    if (!v.tarih || !v.kaynak || !v.donem || !/^https:\/\/([a-z]+\.)?diyanet\.gov\.tr\//.test(v.url || '')) hata.push(`değer ${ad}: tarih, dönem, kaynak ve Diyanet adresi gerekli`);
}
if (D.degerler.nisapAltin?.gram !== 80.18) hata.push('altın nisabı 80,18 gram olmalı (DİYK)');
if (D.degerler.nisapGumus?.gram !== 561.2) hata.push('gümüş nisabı 561,2 gram olmalı (DİYK, İlmihal I)');

// ---- Oruç Rehberi ile ortak metin
const OBY = Object.fromEntries(ORUC.konular.map((k) => [k.id, k]));
const esit = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let ortak = 0;
for (const k of D.konular.filter((x) => x.oruc)) {
    const o = OBY[k.oruc];
    if (!o) { hata.push(`${k.id}: Oruç Rehberi'nde "${k.oruc}" yok`); continue; }
    if (!esit(k.aciklama, o.aciklama)) hata.push(`${k.id}: açıklama Oruç Rehberi "${o.id}" ile aynı değil`);
    if (k.akilda !== o.akilda) hata.push(`${k.id}: akılda kalsın Oruç Rehberi ile aynı değil`);
    if (k.kisa !== o.kisa) hata.push(`${k.id}: kısa açıklama Oruç Rehberi ile aynı değil`);
    // Oruç Rehberi'ndeki "SSS" Oruç SSS'dir; burada "Oruç SSS" diye yazılır. İlmihal aynı cilttir (İlmihal I).
    const kay = o.kaynak.map((s) => s.replace(/^SSS,/, 'Oruç SSS,').replace(/^İlmihal,/, 'İlmihal I,'));
    if (!esit(k.kaynak, kay)) hata.push(`${k.id}: kaynak Oruç Rehberi ile aynı değil (${kay.join('; ')})`);
    if (!esit(k.ayetler || [], o.ayetler || [])) hata.push(`${k.id}: ayetler Oruç Rehberi ile aynı değil`);
    if (!esit((k.hadisler || []).map((h) => [h.metin, h.kaynak]), (o.hadisler || []).map((h) => [h.metin, h.kaynak]))) hata.push(`${k.id}: hadis Oruç Rehberi ile aynı değil`);
    if (k.deger !== o.deger) hata.push(`${k.id}: değer Oruç Rehberi ile aynı değil`);
    ortak++;
}
{
    const z = BY['fitir-sadakasi'], o = OBY['fitir-sadakasi'];
    if (!z || !o) hata.push('fitir-sadakasi iki uygulamada da bulunmalı');
    else {
        if (!esit(z.aciklama.slice(0, 2), o.aciklama.slice(0, 2))) hata.push('fitir-sadakasi: ilk iki paragraf Oruç Rehberi ile aynı değil');
        if (z.kisa !== o.kisa || z.akilda !== o.akilda) hata.push('fitir-sadakasi: kısa açıklama ya da akılda kalsın Oruç Rehberi ile aynı değil');
        if (!esit(z.hadisler.map((h) => [h.metin, h.kaynak]), o.hadisler.map((h) => [h.metin, h.kaynak]))) hata.push('fitir-sadakasi: hadis Oruç Rehberi ile aynı değil');
        ortak++;
    }
    for (const ad of ['fitre', 'fidye']) {
        const a = D.degerler[ad], b = ORUC.degerler[ad];
        for (const f of ['tutar', 'birim', 'tarih', 'duyuru', 'url', 'kaynak', 'donem', 'not', 'ne']) if (a?.[f] !== b?.[f]) hata.push(`değer ${ad}.${f}: Oruç Rehberi ile aynı değil (${a?.[f]} ↔ ${b?.[f]})`);
    }
}

// ---- ayetler (Tevbe 60 sekiz sınıf ekranında her zaman gösterilir)
const refs = [...D.konular.flatMap((k) => k.ayetler || []), '9:60'];
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'ZEKAT_AYETLER', srcDir: dir });

// ---- hadis denetimi
async function hadith(name) {
    const f = dir && path.join(dir, name + '.json');
    if (f && fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
    const r = await fetch(`https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${name}.json`);
    if (!r.ok) throw new Error(name + ' indirilemedi: ' + r.status);
    return r.json();
}
// hadith-api bölüm adları → künyede kullanılan Türkçe kitap adları
const KITAP = {
    b: { 'Obligatory Charity Tax (Zakat)': 'Zekât', 'Fasting': 'Savm', 'Oaths and Vows': 'Eymân ve’n-nüzûr' },
    m: { 'The Book of Zakat': 'Zekât', 'The Book of Fasting': 'Sıyâm', 'The Book of Wills': 'Vasiyyet',
        'The Book of Virtue, Enjoining Good Manners, and Joining of the Ties of Kinship': 'Birr', 'The Book of Vows': 'Nezr' }
};
const AD = { b: 'Buhârî', m: 'Müslim' };
const KOD = { Buhârî: 'b', Müslim: 'm' };
const ed = { b: await hadith('eng-bukhari'), m: await hadith('eng-muslim') };
const bul = (k, no) => ed[k].hadiths.filter((h) => Math.floor(+(k === 'm' ? h.arabicnumber : h.hadithnumber)) === no);
function bolumAdi(k, h) {
    const E = ed[k];
    for (const [id, x] of Object.entries(E.metadata.section_details)) if (id !== '0' && h.hadithnumber >= x.hadithnumber_first && h.hadithnumber <= x.hadithnumber_last) return E.metadata.sections[id].trim();
    return '';
}
// "Buhârî, Zekât, 1503; Müslim, Zekât, 984" → [{ k, kitap, nolar }]
function kunyeler(s) {
    const out = [];
    const re = /(Buhârî|Müslim), ([^,;]+), (\d+(?:[–-]\d+)?)/g;
    let m;
    while ((m = re.exec(s))) {
        const [a, b] = m[3].split(/[–-]/).map(Number);
        const nolar = []; for (let i = a; i <= (b || a); i++) nolar.push(i);
        out.push({ k: KOD[m[1]], kitap: m[2].trim(), nolar });
    }
    return out;
}
let say = 0;
for (const kn of D.konular) for (const h of kn.hadisler || []) {
    const yer = `${kn.id} / ${h.kaynak}`;
    if (!h.metin || !h.ravi || !h.kaynak || !(h.k || []).length) { hata.push(`${yer}: hadis alanları eksik`); continue; }
    const kun = kunyeler(h.kaynak);
    for (const [k, no, ravi] of h.k) {
        say++;
        const kk = kun.find((x) => x.k === k && x.nolar.includes(no));
        if (!kk) { hata.push(`${yer}: künye içinde ${AD[k]} ${no} yok`); continue; }
        const hs = bul(k, no);
        if (!hs.length) { hata.push(`${yer}: ${AD[k]} ${no} bulunamadı`); continue; }
        const uyan = hs.filter((x) => KITAP[k][bolumAdi(k, x)] === kk.kitap);
        if (!uyan.length) { hata.push(`${yer}: ${AD[k]} ${no} kitabı "${kk.kitap}" değil (${[...new Set(hs.map((x) => bolumAdi(k, x)))].join(' / ')})`); continue; }
        if (!uyan.some((x) => x.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${yer}: ${AD[k]} ${no} metninde "${ravi}" geçmiyor`);
    }
    const kNo = new Set(h.k.map(([k, no]) => k + no));
    for (const x of kun) for (const no of x.nolar) if (!kNo.has(x.k + no)) hata.push(`${yer}: künyedeki ${AD[x.k]} ${no} denetim listesinde (k) yok`);
}
// Konu kaynak listesindeki Buhârî/Müslim künyeleri de denetlenir (kitap adı ve numara)
let ekKunye = 0;
for (const kn of D.konular) for (const s of kn.kaynak) for (const x of kunyeler(s)) for (const no of x.nolar) {
    ekKunye++;
    const hs = bul(x.k, no);
    if (!hs.length) { hata.push(`${kn.id} (kaynak): ${AD[x.k]} ${no} bulunamadı`); continue; }
    if (!hs.some((h) => KITAP[x.k][bolumAdi(x.k, h)] === x.kitap)) hata.push(`${kn.id} (kaynak): ${AD[x.k]} ${no} kitabı "${x.kitap}" değil`);
}
// "Müslim, Zekât, 1005 ve 1009; Birr, 2626" gibi kısaltılmış kaynak yazımı da denetlenir
for (const kn of D.konular) for (const s of kn.kaynak) {
    const m = /^Müslim, Zekât, (\d+) ve (\d+); Birr, (\d+)$/.exec(s);
    if (!m) continue;
    for (const [no, kitap] of [[+m[1], 'Zekât'], [+m[2], 'Zekât'], [+m[3], 'Birr']]) {
        ekKunye++;
        if (!bul('m', no).some((h) => KITAP.m[bolumAdi('m', h)] === kitap)) hata.push(`${kn.id} (kaynak): Müslim ${no} kitabı "${kitap}" değil`);
    }
}

if (hata.length) { console.error('Denetim başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }
console.log(`docs/zekat/ayetler.js: ${n} ayet · ${D.konular.length} konu · ${say} hadis künyesi (+${ekKunye} kaynak künyesi) denetlendi · ${D.siniflar.length} sınıf · ${D.kisiler.length} "Verebilir miyim?" kartı konu hükmüyle tutarlı · Oruç Rehberi ile ${ortak} ortak konu ve fitre/fidye değeri aynı`);
