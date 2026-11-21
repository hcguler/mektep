// Giyim ve Görünüş — ayetler ve hadis denetimi
// --------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/giyim/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir.
// 2. Her hadis künyesini fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler:
//    numara o kitapta var mı, künyedeki kitap adı (bölüm) tutuyor mu, metinde râvinin adı geçiyor mu.
//    Müslim numarası M. Fuâd Abdülbâkî numarasıdır (arabicnumber). Uyuşmazlıkta durur.
// 3. Her ögenin zorunlu alanlarını (ad, aciklama, akilda, kaynak, hukum) ve bölüm/konu kimliklerini denetler.
// Kullanım:  node tools/giyim-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'giyim');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.GIYIM_DATA;

// ---- alan denetimi
const hata = [];
const BOL = new Set(D.bolumler.map((b) => b.id)), KON = new Set(D.konular.map((k) => k.id));
const ids = new Set();
for (const o of D.ogeler) {
    if (ids.has(o.id)) hata.push(`${o.id}: kimlik iki kez kullanılmış`);
    ids.add(o.id);
    for (const f of ['ad', 'ozet', 'aciklama', 'akilda', 'kaynak', 'cizim']) if (!o[f]) hata.push(`${o.id}: "${f}" boş`);
    if (!o.hukum || !o.hukum.ad || !D.hukumler[o.hukum.tur]) hata.push(`${o.id}: hüküm eksik ya da türü bilinmiyor`);
    if (!BOL.has(o.bolum)) hata.push(`${o.id}: bölüm bilinmiyor (${o.bolum})`);
    for (const k of o.konu || []) if (!KON.has(k)) hata.push(`${o.id}: konu bilinmiyor (${k})`);
    if (!(o.ayetler || []).length && !(o.hadisler || []).length && !o.fikih) hata.push(`${o.id}: kaynak (ayet, hadis ya da fıkıh) yok`);
    if (o.fikih && (!o.fikih.metin || !o.fikih.kaynak)) hata.push(`${o.id}: fıkıh metni ya da kaynağı eksik`);
}

// ---- ayetler
const refs = D.ogeler.flatMap((o) => o.ayetler || []);
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'GIYIM_AYETLER', srcDir: dir });

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
    b: { 'Dress': 'Libâs', 'Ablutions (Wudu\')': 'Vudû', 'Virtues and Merits of the Prophet (pbuh) and his Companions': 'Menâkıb',
        'Prophetic Commentary on the Qur\'an (Tafseer of the Prophet (pbuh))': 'Tefsîr' },
    m: { 'The Book of Clothes and Adornment': 'Libâs', 'The Book of Purification': 'Tahâret', 'The Book of Faith': 'Îmân',
        'The Book of Virtues': 'Fezâil', 'The Book of Menstruation': 'Hayz' }
};
const AD = { b: 'Buhârî', m: 'Müslim' };
const ed = { b: await hadith('eng-bukhari'), m: await hadith('eng-muslim') };
const bul = (k, no) => ed[k].hadiths.filter((h) => Math.floor(+(k === 'm' ? h.arabicnumber : h.hadithnumber)) === no);
function bolum(k, no) {
    const det = ed[k].metadata.section_details, key = k === 'm' ? 'arabicnumber' : 'hadithnumber';
    for (const [id, x] of Object.entries(det)) if (no >= x[key + '_first'] && no <= x[key + '_last'] && id !== '0') return ed[k].metadata.sections[id].trim();
    return '';
}
let say = 0;
for (const o of D.ogeler) {
    for (const h of o.hadisler || []) {
        if (!h.metin || !h.ravi || !h.kaynak || !(h.k || []).length) { hata.push(`${o.id}: hadis alanları eksik`); continue; }
        for (const [k, no, ravi] of h.k) {
            say++;
            const hs = bul(k, no);
            if (!hs.length) { hata.push(`${o.id}: ${AD[k]} ${no} bulunamadı`); continue; }
            const b = bolum(k, no), tr = KITAP[k][b];
            if (!tr) hata.push(`${o.id}: ${AD[k]} ${no} bölümü (${b}) sözlükte yok`);
            else if (!h.kaynak.includes(`${AD[k]}, ${tr}, ${no}`)) hata.push(`${o.id}: künye "${h.kaynak}" ↔ ${AD[k]}, ${tr}, ${no}`);
            if (!hs.some((x) => x.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${o.id}: ${AD[k]} ${no} metninde "${ravi}" geçmiyor`);
        }
    }
}
if (hata.length) { console.error('Denetim başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }
console.log(`docs/giyim/ayetler.js: ${n} ayet · ${D.ogeler.length} öge · ${say} hadis künyesi denetlendi`);
