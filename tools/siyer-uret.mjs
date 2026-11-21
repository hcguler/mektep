// Siyer Çizelgesi — ayetler ve hadis denetimi
// --------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/siyer/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir.
// 2. Her hadis künyesini fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler:
//    numara o kitapta var mı, künyedeki kitap adı (bölüm) tutuyor mu, metinde ravinin adı geçiyor mu.
//    Müslim numarası M. Fuâd Abdülbâkî numarasıdır (arabicnumber). Uyuşmazlıkta durur.
// Kullanım:  node tools/siyer-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'siyer');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.SIYER_DATA;

// ---- ayetler
const refs = [D.giris.ayet, ...D.olaylar.flatMap((o) => o.ayetler || [])];
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'SIYER_AYETLER', srcDir: dir });

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
    b: { 'Revelation': 'Bed’ü’l-vahy', 'Belief': 'Îmân', 'Prayers (Salat)': 'Salât', 'Funerals (Al-Janaa\'iz)': 'Cenâiz', 'Hajj (Pilgrimage)': 'Hac',
        'Hiring': 'İcâre', 'Conditions': 'Şurût', 'Fighting for the Cause of Allah (Jihaad)': 'Cihâd', 'Beginning of Creation': 'Bed’ü’l-halk',
        'Virtues and Merits of the Prophet (pbuh) and his Companions': 'Menâkıb', 'Companions of the Prophet': 'Fezâilü ashâbi’n-nebî',
        'Merits of the Helpers in Madinah (Ansaar)': 'Menâkıbü’l-ensâr', 'Military Expeditions led by the Prophet (pbuh) (Al-Maghaazi)': 'Meğâzî',
        'Prophetic Commentary on the Qur\'an (Tafseer of the Prophet (pbuh))': 'Tefsîr' },
    m: { 'The Book of Jihad and Expeditions': 'Cihâd', 'The Book of the Merits of the Companions': 'Fezâilü’s-sahâbe' }
};
const AD = { b: 'Buhârî', m: 'Müslim' };
const ed = { b: await hadith('eng-bukhari'), m: await hadith('eng-muslim') };
const bul = (k, no) => ed[k].hadiths.filter((h) => +(k === 'm' ? h.arabicnumber : h.hadithnumber) === no);
function bolum(k, no) {
    const det = ed[k].metadata.section_details, key = k === 'm' ? 'arabicnumber' : 'hadithnumber';
    for (const [id, x] of Object.entries(det)) if (no >= x[key + '_first'] && no <= x[key + '_last'] && id !== '0') return ed[k].metadata.sections[id].trim();
    return '';
}
const hata = [];
let say = 0;
for (const o of D.olaylar) {
    if (!o.hadis) continue;
    for (const [k, no, ravi] of o.hadis.k) {
        say++;
        const hs = bul(k, no);
        if (!hs.length) { hata.push(`${o.id}: ${AD[k]} ${no} bulunamadı`); continue; }
        const b = bolum(k, no), tr = KITAP[k][b];
        if (!tr) hata.push(`${o.id}: ${AD[k]} ${no} bölümü (${b}) sözlükte yok`);
        else if (!o.hadis.kaynak.includes(`${AD[k]}, ${tr}, ${no}`) && !new RegExp(`${AD[k]}, ${tr}, [\\d–-]*${no}`).test(o.hadis.kaynak)) hata.push(`${o.id}: künye "${o.hadis.kaynak}" ↔ ${AD[k]}, ${tr}, ${no}`);
        if (!hs.some((h) => h.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${o.id}: ${AD[k]} ${no} metninde "${ravi}" geçmiyor`);
    }
}
if (hata.length) { console.error('Hadis denetimi başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }
console.log(`docs/siyer/ayetler.js: ${n} ayet · ${say} hadis künyesi denetlendi`);
