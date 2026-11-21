// Sureler Atlası — künye, öne çıkan ayetler ve hadis denetimi
// -----------------------------------------------------------
// 1. Künye (docs/sureler/kunye.js) otomatik üretilir, elle yazılmaz:
//    Tanzil Quran Metadata 1.0 (tanzil.net/res/text/metadata/quran-data.js, CC BY 3.0):
//    ayet sayısı, iniş türü (Meccan/Medinan), iniş sırası, cüz ve sayfa (Medine mushafı) sınırları.
//    Aynı bilgiler fawazahmed0/quran-api info.json ile karşılaştırılır (ayet sayısı, iniş yeri,
//    her surenin ilk ve son ayetinin cüzü ve sayfası); uyuşmazlıkta üretici durur.
//    Türkçe adlar tools/lib/tanzil-ayetler.mjs → SURE; Ezberler'deki sureler docs/ezberler/data.js'ten.
// 2. Testler: 114 sure, 6236 ayet, iniş sırası 1–114 eksiksiz ve tekrarsız, 86 Mekkî / 28 Medenî,
//    Mekkî surelerin iniş sırası 1–86 (Medenî 87–114), TDV İslâm Ansiklopedisi'nde geçen iniş sırası
//    bilgileriyle karşılaştırma; data.js'teki özet ve görüş farkı kayıtlarının biçimi.
// 3. Öne çıkan ayetler ortak üreticiyle docs/sureler/ayetler.js'e yazılır (Tanzil Simple + Diyanet meali);
//    birleşik mealler aralık olarak istenir.
// 4. Hadis künyeleri fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetlenir: numara var mı,
//    kitap adı (bölüm) tutuyor mu, metinde ravinin adı geçiyor mu. Müslim numarası Abdülbâkî numarasıdır.
// Kullanım:  node tools/sureler-uret.mjs [indirilmiş dosyaların klasörü]
//   (klasörde quran-data.js, info.json, eng-bukhari.json, eng-muslim.json, ara-quransimple.json,
//    tur-diyanetisleri.json varsa onlar kullanılır; yoksa indirilir)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler, SURE } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'sureler');
const dir = process.argv[2];
const hata = [];
const test = (ok, msg) => { if (!ok) hata.push(msg); };

async function indir(ad, url, json) {
    const f = dir && path.join(dir, ad);
    if (f && fs.existsSync(f)) { const t = fs.readFileSync(f, 'utf8'); return json ? JSON.parse(t) : t; }
    const r = await fetch(url);
    if (!r.ok) throw new Error(ad + ' indirilemedi: ' + r.status);
    return json ? r.json() : r.text();
}

// ---- Tanzil metadata: betik çalıştırılmaz, diziler metinden okunur
const tanzil = await indir('quran-data.js', 'https://tanzil.net/res/text/metadata/quran-data.js');
const SURA_RE = /\[(\d+), (\d+), (\d+), (\d+), '([^']*)', "([^"]*)", '((?:[^'\\]|\\.)*)', '(Meccan|Medinan)'\]/g;
const sura = [...tanzil.matchAll(SURA_RE)].map((m) => ({ bas: +m[1], ayet: +m[2], inis: +m[3], ar: m[5], tur: m[8] === 'Meccan' ? 'mekki' : 'medeni' }));
function ciftler(ad) {
    const i = tanzil.indexOf(`QuranData.${ad} = [`);
    if (i < 0) throw new Error('Tanzil verisinde ' + ad + ' yok');
    const blok = tanzil.slice(i, tanzil.indexOf('];', i));
    // Son öge [115, 1] bitiş işaretidir; başlangıç listesine alınmaz.
    return [...blok.matchAll(/\[(\d+), (\d+)\]/g)].map((m) => [+m[1], +m[2]]).filter((p) => p[0] <= 114);
}
const JUZ = ciftler('Juz'), PAGE = ciftler('Page');
test(sura.length === 114, `Tanzil: ${sura.length} sure okundu (114 olmalı)`);
test(JUZ.length === 30, `Tanzil: ${JUZ.length} cüz okundu (30 olmalı)`);
test(PAGE.length === 604, `Tanzil: ${PAGE.length} sayfa okundu (604 olmalı)`);
// (sure, ayet) hangi cüzde / sayfada: başlangıç listesinde kendisinden önceki son başlangıç
const once = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]);
const bul = (liste, s, a) => { let n = 0; liste.forEach((p, i) => { if (once(p, [s, a])) n = i + 1; }); return n; };

// ---- Ezberler'deki sureler (Ezberler'in kimliği → "Ezberle" bağlantısı)
const ez = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(here, '..', 'docs', 'ezberler', 'data.js'), 'utf8'), ez);
const EZBER = {};
for (const b of ez.window.EZBER_DATA.bolumler) for (const o of b.ogeler) if (o.tur === 'sure') EZBER[o.no] = { id: o.id, yer: o.yer };

const kunye = sura.map((x, i) => {
    const no = i + 1;
    const k = { no, ad: SURE[no], ar: x.ar, ayet: x.ayet, tur: x.tur, inis: x.inis,
        cuz: [bul(JUZ, no, 1), bul(JUZ, no, x.ayet)], sayfa: [bul(PAGE, no, 1), bul(PAGE, no, x.ayet)] };
    if (EZBER[no]) k.ezber = EZBER[no].id;
    return k;
});

// ---- Testler
const toplam = kunye.reduce((n, k) => n + k.ayet, 0);
test(toplam === 6236, `toplam ayet ${toplam} (6236 olmalı)`);
const sira = kunye.map((k) => k.inis).sort((a, b) => a - b);
test(sira.every((v, i) => v === i + 1), 'iniş sırası 1–114 eksiksiz ve tekrarsız değil');
const mekki = kunye.filter((k) => k.tur === 'mekki'), medeni = kunye.filter((k) => k.tur === 'medeni');
test(mekki.length === 86 && medeni.length === 28, `Mekkî ${mekki.length} / Medenî ${medeni.length} (86 / 28 olmalı)`);
test(Math.max(...mekki.map((k) => k.inis)) === 86 && Math.min(...medeni.map((k) => k.inis)) === 87, 'Mekkî sureler iniş sırasında 1–86, Medenî sureler 87–114 aralığında değil');
test(kunye.every((k) => SURE[k.no] && k.cuz[0] >= 1 && k.cuz[1] <= 30 && k.sayfa[0] >= 1 && k.sayfa[1] <= 604), 'cüz/sayfa aralık dışında');
test(kunye[0].sayfa[0] === 1 && kunye[113].sayfa[1] === 604 && kunye[113].cuz[0] === 30, 'mushaf sınırları (Fâtiha s.1, Nâs s.604, 30. cüz) tutmuyor');
// Ezberler'deki iniş yeri ile Tanzil aynı mı
for (const [no, e] of Object.entries(EZBER)) {
    const t = kunye[no - 1].tur === 'mekki' ? 'Mekke' : 'Medine';
    test(!e.yer || e.yer === t, `Ezberler ${e.id}: yer "${e.yer}", Tanzil "${t}"`);
}
// TDV İslâm Ansiklopedisi'nin sure maddelerinde geçen iniş sırası bilgileri (a, b'den hemen sonra indi; ya da sıra numarası)
const TDV_SONRA = [[18, 88], [82, 79], [95, 85], [89, 92], [101, 106], [100, 103], [108, 100], [109, 107], [111, 1], [4, 60], [94, 93], [14, 71], [20, 19], [27, 26], [28, 27], [37, 6], [42, 41], [43, 42], [45, 44], [46, 45], [50, 77], [53, 112], [54, 86], [75, 101], [31, 37], [32, 23], [34, 31], [11, 10], [17, 28], [26, 56]];
for (const [a, b] of TDV_SONRA) test(kunye[a - 1].inis === kunye[b - 1].inis + 1, `iniş sırası: ${SURE[a]} ${SURE[b]}'den hemen sonra değil (TDV İA)`);
test(kunye[96].inis === 25 && kunye[93].inis === 12, 'iniş sırası: Kadr 25., İnşirâh 12. değil (TDV İA)');

// ---- quran-api info.json ile karşılaştırma
const info = await indir('info.json', 'https://raw.githubusercontent.com/fawazahmed0/quran-api/1/info.json', true);
test(info.verses.count === 6236, 'info.json ayet sayısı 6236 değil');
for (const c of info.chapters) {
    const k = kunye[c.chapter - 1], v = c.verses, ilk = v[0], son = v[v.length - 1];
    test(v.length === k.ayet, `${k.ad}: ayet ${k.ayet} ↔ info.json ${v.length}`);
    test((c.revelation === 'Mecca' ? 'mekki' : 'medeni') === k.tur, `${k.ad}: iniş yeri Tanzil ↔ info.json farklı`);
    test(ilk.juz === k.cuz[0] && son.juz === k.cuz[1], `${k.ad}: cüz ${k.cuz} ↔ info.json ${ilk.juz}-${son.juz}`);
    test(ilk.page === k.sayfa[0] && son.page === k.sayfa[1], `${k.ad}: sayfa ${k.sayfa} ↔ info.json ${ilk.page}-${son.page}`);
}

// ---- data.js (elle yazılan yorum) denetimi
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.SURE_DATA;
const TEMA = new Set(D.temalar.map((t) => t.id));
for (const [no, x] of Object.entries(D.ihtilaf)) {
    test(+no >= 1 && +no <= 114, `ihtilaf: geçersiz sure ${no}`);
    test(['guclu', 'zayif'].includes(x.derece) && x.not && x.kaynak, `ihtilaf ${no}: derece/not/kaynak eksik`);
}
const cumle = (t) => (String(t).match(/[.!?](\s|$)/g) || []).length;
for (const [no, o] of Object.entries(D.ozetler)) {
    const ad = SURE[no];
    test(+no >= 1 && +no <= 114, `özet: geçersiz sure ${no}`);
    test(o.anlam && o.akilda && o.cocuk && o.emo, `${ad}: anlam/akilda/cocuk/emo eksik`);
    test(cumle(o.konu) >= 2 && cumle(o.konu) <= 4, `${ad}: konu özeti 2–4 cümle değil (${cumle(o.konu)})`);
    test(Array.isArray(o.kaynak) && o.kaynak.length > 0, `${ad}: kaynak yok`);
    test(o.tema.length && o.tema.every((t) => TEMA.has(t)), `${ad}: tanımsız tema`);
    test(new RegExp(`^${no}:`).test(o.oneCikan), `${ad}: öne çıkan ayet başka sureden (${o.oneCikan})`);
}

if (hata.length) { console.error('Denetim başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }

// ---- kunye.js
fs.writeFileSync(path.join(root, 'kunye.js'), `// Bu dosya tools/sureler-uret.mjs ile üretilir; elle düzenlemeyin.
// Kaynak: Tanzil Quran Metadata 1.0 (tanzil.net, CC BY 3.0); fawazahmed0/quran-api info.json ile karşılaştırılmıştır.
// ayet: Kûfe sayımı · tur: mekki | medeni (Tanzil) · inis: geleneksel iniş sırası (Tanzil) ·
// cuz: [ilk, son] · sayfa: [ilk, son] Medine mushafı (604 sayfa) · ezber: Ezberler'deki kimlik
window.SURE_KUNYE = [
${kunye.map((k) => ' ' + JSON.stringify(k)).join(',\n')}
];
`);

// ---- ayetler.js
const n = await buildAyetler({ refs: Object.values(D.ozetler).map((o) => o.oneCikan), outFile: path.join(root, 'ayetler.js'), globalName: 'SURE_AYETLER', srcDir: dir });

// ---- hadis denetimi
const KITAP = {
    b: { 'Revelation': 'Bed’ü’l-vahy', 'Call to Prayers (Adhaan)': 'Ezân', 'Military Expeditions led by the Prophet (pbuh) (Al-Maghaazi)': 'Meğâzî',
        'Prophetic Commentary on the Qur\'an (Tafseer of the Prophet (pbuh))': 'Tefsîr', 'Virtues of the Qur\'an': 'Fezâilü’l-Kur’ân' },
    m: { 'The Book of Prayers': 'Salât', 'The Book of Prayer - Travellers': 'Salâtü’l-müsâfirîn', 'The Book of Prayer - Friday': 'Cum‘a' }
};
const AD = { b: 'Buhârî', m: 'Müslim' };
const ed = {
    b: await indir('eng-bukhari.json', 'https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-bukhari.json', true),
    m: await indir('eng-muslim.json', 'https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-muslim.json', true)
};
// Müslim'de arabicnumber "807.01" biçimindedir (aynı hadisin rivayet yolları); tam kısmı numaradır.
const numara = (k, h) => Math.floor(+(k === 'm' ? h.arabicnumber : h.hadithnumber));
const hadisBul = (k, no) => ed[k].hadiths.filter((h) => numara(k, h) === no);
function bolum(k, no) {
    const det = ed[k].metadata.section_details, key = k === 'm' ? 'arabicnumber' : 'hadithnumber';
    for (const [id, x] of Object.entries(det)) if (id !== '0' && no >= Math.floor(x[key + '_first']) && no <= Math.floor(x[key + '_last'])) return ed[k].metadata.sections[id].trim();
    return '';
}
let say = 0;
for (const [no, o] of Object.entries(D.ozetler)) {
    if (!o.hadis) continue;
    for (const [k, hn, ravi] of o.hadis.k) {
        say++;
        const hs = hadisBul(k, hn), ad = SURE[no];
        if (!hs.length) { hata.push(`${ad}: ${AD[k]} ${hn} bulunamadı`); continue; }
        const b = bolum(k, hn), tr = KITAP[k][b];
        if (!tr) hata.push(`${ad}: ${AD[k]} ${hn} bölümü (${b}) sözlükte yok`);
        else if (!o.hadis.kaynak.includes(`${AD[k]}, ${tr}, ${hn}`)) hata.push(`${ad}: künye "${o.hadis.kaynak}" ↔ ${AD[k]}, ${tr}, ${hn}`);
        if (!hs.some((h) => h.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${ad}: ${AD[k]} ${hn} metninde "${ravi}" geçmiyor`);
    }
}
if (hata.length) { console.error('Hadis denetimi başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }

const ih = Object.values(D.ihtilaf);
console.log(`docs/sureler/kunye.js: 114 sure · ${toplam} ayet · iniş sırası 1–114 · Mekkî ${mekki.length} / Medenî ${medeni.length} · info.json ile aynı · Ezberler'de ${Object.keys(EZBER).length} sure`);
console.log(`docs/sureler/ayetler.js: ${n} öne çıkan ayet · ${Object.keys(D.ozetler).length} konu özeti · ${say} hadis künyesi denetlendi · görüş farkı: ${ih.filter((x) => x.derece === 'guclu').length} belirgin, ${ih.filter((x) => x.derece === 'zayif').length} zayıf rivayet`);
