// Oruç Rehberi — ayetler, hadis/rivayet denetimi ve içerik denetimi
// --------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/oruc/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir (Bakara 183-184 gibi).
// 2. Her hadis künyesini fawazahmed0/hadith-api ile denetler (eng-bukhari, eng-muslim, eng-abudawud, eng-tirmidhi):
//    numara o kitapta var mı, künyedeki kitap adı (bölüm) tutuyor mu, metinde râvinin adı geçiyor mu.
//    Müslim numarası M. Fuâd Abdülbâkî numarasıdır (arabicnumber). Uyuşmazlıkta durur.
// 3. Buhârî ve Müslim dışındaki rivayetlerin (Ebû Dâvûd, Tirmizî) derecesini hadith-api "grades" ile karşılaştırır.
// 4. Dua metnini (Ebû Dâvûd 2357) ara-abudawud'dan alıp docs/oruc/kunye.js dosyasına yazar; Arapça elle yazılmaz.
// 5. İçerik denetimi: zorunlu alanlar, bölüm/konu kimlikleri, hüküm türleri, Kavram Haritası kimlikleri,
//    "Bozar mı?" sorularının cevabının bağlı konunun hükmüyle aynı olması, çizelgedeki konu bağlantıları,
//    yıllık değerlerin (fidye, fitre) tarih ve kaynakla tutulması.
// Kullanım:  node tools/oruc-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'oruc');
const dir = process.argv[2];
const load = (file, name) => { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), sb); return sb.window[name]; };
const D = load(path.join(root, 'data.js'), 'ORUC_DATA');
const KAV = load(path.join(here, '..', 'docs', 'kavram', 'data.js'), 'KAVRAM_DATA');

// ---- içerik denetimi
const hata = [];
const BOL = new Set(D.bolumler.map((b) => b.id));
const BY = Object.fromEntries(D.konular.map((k) => [k.id, k]));
const KAVRAM = new Set(KAV.kavramlar.map((k) => k.id));
const OYUN = ['bozmaz', 'bozar-kaza', 'bozar-kefaret'];
if (Object.keys(BY).length !== D.konular.length) hata.push('konu kimliği iki kez kullanılmış');
for (const [id, h] of Object.entries(D.hukumler)) {
    if (!h.ad || !h.cumle) hata.push(`hüküm ${id}: ad ya da cümle eksik`);
    if (h.kavram && !KAVRAM.has(h.kavram)) hata.push(`hüküm ${id}: Kavram Haritası'nda "${h.kavram}" yok`);
}
for (const k of D.konular) {
    for (const f of ['ad', 'emo', 'kisa', 'akilda']) if (!k[f]) hata.push(`${k.id}: "${f}" boş`);
    if (!Array.isArray(k.aciklama) || k.aciklama.length < 1 || k.aciklama.length > 4) hata.push(`${k.id}: açıklama 1–4 cümle/paragraf olmalı`);
    if (!Array.isArray(k.kaynak) || !k.kaynak.length) hata.push(`${k.id}: kaynak yok`);
    if (!BOL.has(k.bolum)) hata.push(`${k.id}: bölüm bilinmiyor (${k.bolum})`);
    if (k.hukum && !D.hukumler[k.hukum]) hata.push(`${k.id}: hüküm türü bilinmiyor (${k.hukum})`);
    for (const c of k.kavramlar || []) if (!KAVRAM.has(c)) hata.push(`${k.id}: Kavram Haritası'nda "${c}" yok`);
    if (k.deger && !D.degerler[k.deger]) hata.push(`${k.id}: değer bilinmiyor (${k.deger})`);
    if (k.dua && (!k.dua.kunye || !k.dua.okunus || !k.dua.anlam)) hata.push(`${k.id}: dua alanları eksik`);
    if (k.mezhep && !/^Şâfiî/.test(k.mezhep)) hata.push(`${k.id}: mezhep notu "Şâfiî …" diye başlamalı`);
}
for (const b of D.bolumler) if (!D.konular.some((k) => k.bolum === b.id)) hata.push(`bölüm ${b.id}: konu yok`);
const soruIds = new Set();
for (const s of D.sorular) {
    if (soruIds.has(s.id)) hata.push(`soru ${s.id}: kimlik iki kez`);
    soruIds.add(s.id);
    const k = BY[s.konu];
    if (!k) { hata.push(`soru ${s.id}: konu bilinmiyor (${s.konu})`); continue; }
    if (!OYUN.includes(s.cevap)) hata.push(`soru ${s.id}: cevap türü oyunda yok (${s.cevap})`);
    if (k.hukum !== s.cevap) hata.push(`soru ${s.id}: cevap "${s.cevap}" ↔ konu ${k.id} hükmü "${k.hukum}"`);
    if (!s.soru || !s.aciklama) hata.push(`soru ${s.id}: soru metni ya da açıklaması boş`);
}
for (const a of D.cizelge) for (const r of a.satirlar) if (!BY[r.konu]) hata.push(`çizelge ${a.ay}: konu bilinmiyor (${r.konu})`);
for (const [ad, v] of Object.entries(D.degerler)) {
    if (v.tutar == null) continue; // doğrulanamadıysa null kalır; ekranda "Diyanet'in açıklamasına bakın"
    if (!v.tarih || !v.kaynak || !/^https:\/\/([a-z]+\.)?diyanet\.gov\.tr\//.test(v.url || '')) hata.push(`değer ${ad}: tarih, kaynak ve Diyanet adresi gerekli`);
}

// ---- ayetler
const refs = D.konular.flatMap((k) => k.ayetler || []);
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'ORUC_AYETLER', srcDir: dir });

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
    b: { 'Revelation': 'Bed’ü’l-vahy', 'Fasting': 'Savm', 'Praying at Night in Ramadaan (Taraweeh)': 'Salâtü’t-terâvîh',
        'Virtues of the Night of Qadr': 'Fazlü leyleti’l-kadr', 'Retiring to a Mosque for Remembrance of Allah (I\'tikaf)': 'İ‘tikâf',
        'Obligatory Charity Tax (Zakat)': 'Zekât' },
    m: { 'The Book of Fasting': 'Sıyâm', 'The Book of Menstruation': 'Hayz', 'The Book of I\'tikaf': 'İ‘tikâf' },
    d: { 'Fasting (Kitab Al-Siyam)': 'Savm' },
    t: { 'The Book on Fasting': 'Savm' }
};
const AD = { b: 'Buhârî', m: 'Müslim', d: 'Ebû Dâvûd', t: 'Tirmizî' };
const EDITION = { b: 'eng-bukhari', m: 'eng-muslim', d: 'eng-abudawud', t: 'eng-tirmidhi' };
const ed = {};
for (const [k, name] of Object.entries(EDITION)) ed[k] = await hadith(name);
const key = (k) => (k === 'm' ? 'arabicnumber' : 'hadithnumber');
const bul = (k, no) => ed[k].hadiths.filter((h) => Math.floor(+h[key(k)]) === no);
function bolum(k, no) {
    const det = ed[k].metadata.section_details, x0 = key(k);
    for (const [id, x] of Object.entries(det)) if (no >= x[x0 + '_first'] && no <= x[x0 + '_last'] && id !== '0') return ed[k].metadata.sections[id].trim();
    return '';
}
let say = 0;
function kunyeDenetle(sahip, h, izinli) {
    if (!h.metin || !h.ravi || !h.kaynak || !(h.k || []).length) { hata.push(`${sahip}: hadis alanları eksik`); return; }
    for (const [k, no, ravi] of h.k) {
        say++;
        if (!izinli.includes(k)) { hata.push(`${sahip}: ${AD[k] || k} bu bölümde kullanılamaz`); continue; }
        const hs = bul(k, no);
        if (!hs.length) { hata.push(`${sahip}: ${AD[k]} ${no} bulunamadı`); continue; }
        const b = bolum(k, no), tr = KITAP[k][b];
        if (!tr) hata.push(`${sahip}: ${AD[k]} ${no} bölümü (${b}) sözlükte yok`);
        else if (!h.kaynak.includes(`${AD[k]}, ${tr}, ${no}`) && !new RegExp(`${AD[k]}, ${tr}, [\\d–-]*${no}`).test(h.kaynak) && !new RegExp(`${AD[k]}, ${tr}, ${no}[–-]`).test(h.kaynak)) hata.push(`${sahip}: künye "${h.kaynak}" ↔ ${AD[k]}, ${tr}, ${no}`);
        if (!hs.some((x) => x.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${sahip}: ${AD[k]} ${no} metninde "${ravi}" geçmiyor`);
    }
}
const derece = {};
for (const k of D.konular) {
    for (const h of k.hadisler || []) kunyeDenetle(k.id, h, ['b', 'm']);
    for (const r of k.rivayetler || []) {
        kunyeDenetle(k.id, r, ['d', 't']);
        if (!r.sihhat || !r.derece) { hata.push(`${k.id}: rivayetin sıhhati yazılmamış`); continue; }
        for (const [kk, no] of r.k) {
            const g = bul(kk, no).flatMap((x) => x.grades || []);
            for (const [alim, dr] of Object.entries(r.derece)) {
                if (!g.some((x) => x.name === alim && x.grade === dr)) hata.push(`${k.id}: ${AD[kk]} ${no} için ${alim} derecesi "${dr}" değil (${g.map((x) => x.name + ': ' + x.grade).join('; ')})`);
            }
            derece[kk + no] = g;
        }
    }
}

// ---- dua metni: Ebû Dâvûd Arapça metninden, tırnak içindeki söz
const duaKunye = {};
const duaVar = D.konular.filter((k) => k.dua);
if (duaVar.length) {
    const ara = await hadith('ara-abudawud');
    for (const k of duaVar) {
        const m = /^d(\d+)$/.exec(k.dua.kunye);
        if (!m) { hata.push(`${k.id}: dua künyesi "d<numara>" olmalı`); continue; }
        const h = ara.hadiths.find((x) => Math.floor(+x.hadithnumber) === +m[1]);
        const q = h && /"\u200f?\s*([^"]+?)\s*\u200f?"/.exec(h.text);
        if (!q) { hata.push(`${k.id}: Ebû Dâvûd ${m[1]} Arapça metninde dua bulunamadı`); continue; }
        duaKunye[k.dua.kunye] = { kaynak: `Ebû Dâvûd, Savm, ${m[1]}`, ar: q[1].replace(/\u200f/g, '').trim(), derece: (derece['d' + m[1]] || []).map((x) => ({ alim: x.name, derece: x.grade })) };
    }
}

if (hata.length) { console.error('Denetim başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }
fs.writeFileSync(path.join(root, 'kunye.js'), `// Bu dosya tools/oruc-uret.mjs ile üretilir; elle düzenlemeyin.
// Dua metni fawazahmed0/hadith-api (ara-abudawud) Arapça metninden değiştirilmeden alınır;
// derece (grades) aynı veri kümesinin İngilizce baskısındandır (eng-abudawud).
window.ORUC_KUNYE = ${JSON.stringify(duaKunye, null, 1)};
`);
const soruSay = D.sorular.length;
console.log(`docs/oruc/ayetler.js: ${n} ayet · ${D.konular.length} konu · ${say} hadis künyesi denetlendi · ${soruSay} "Bozar mı?" sorusu konu hükmüyle tutarlı · kunye.js: ${Object.keys(duaKunye).length} dua`);
