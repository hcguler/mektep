// Sahabe Hayatları — ayetler, hadis denetimi, Siyer tutarlılığı
// -------------------------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/sahabe/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir.
// 2. Her hadis künyesini fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler:
//    numara o kitapta var mı, künyedeki kitap adı (bölüm) tutuyor mu, metinde ravinin adı geçiyor mu.
//    Bölüm, hadisin sıra numarasından (hadithnumber) bulunur; böylece aynı Abdülbâkî numarası iki kitapta
//    geçen Müslim rivayetleri (ör. 1748) doğru bölümle eşleşir. Kesitlerin `kaynak` alanında geçen
//    "Buhârî, <kitap>, <no>" biçimindeki künyeler de (ravi dışında) aynı biçimde denetlenir.
// 3. Siyer bağlantısı: kesitteki `siyer` kimliği docs/siyer/data.js'te var mı, kesitin yılı olayın
//    yılıyla çelişiyor mu (olayın tarihinde geçen yıllar ve `t` ile karşılaştırılır).
// 4. Yapı ve dil denetimi: 3-5 kesit, en az bir hadis, her kesitte kaynak, abartılı karşılaştırma yok.
// 5. docs/sahabe/siyer-baglanti.js: Siyer olayından sahabi sayfasına geri bağlantı için olay → sahabiler listesi.
// Kullanım:  node tools/sahabe-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'sahabe');
const dir = process.argv[2];
const yukle = (f, ad) => { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(f, 'utf8'), sb); return sb.window[ad]; };
const D = yukle(path.join(root, 'data.js'), 'SAHABE_DATA');
const S = yukle(path.join(here, '..', 'docs', 'siyer', 'data.js'), 'SIYER_DATA');
const hata = [];

// ---- yapı ve dil
const GRUP = new Set(D.gruplar.map((g) => g.id));
const ids = new Set();
const YASAK = [/en büyüğ/i, /en üstün/i, /en faziletli/i, /fitne/i, /cemel|sıffîn|hâric/i];
for (const s of D.sahabiler) {
    if (ids.has(s.id)) hata.push(`${s.id}: kimlik iki kez kullanılmış`);
    ids.add(s.id);
    if (!/^Hz\. /.test(s.ad)) hata.push(`${s.id}: ad "Hz. …" biçiminde değil`);
    if (!GRUP.has(s.grup)) hata.push(`${s.id}: grup yok (${s.grup})`);
    for (const k of ['dogum', 'musluman', 'vefat', 'kisa', 'erdem', 'cocuk', 'akilda']) if (!s[k]) hata.push(`${s.id}: ${k} boş`);
    if (!s.kaynak || !s.kaynak.some((k) => /TDV İslâm Ansiklopedisi/.test(k))) hata.push(`${s.id}: TDV İA maddesi kaynakta yok`);
    if (!(s.yil && s.yil.islam <= s.yil.vefat)) hata.push(`${s.id}: yil.islam / yil.vefat hatalı`);
    if (s.hayat.length < 3 || s.hayat.length > 5) hata.push(`${s.id}: ${s.hayat.length} kesit (3-5 olmalı)`);
    if (!s.hayat.some((h) => h.hadis)) hata.push(`${s.id}: hiç hadis yok`);
    for (const h of s.hayat) {
        if (!h.hadis && !h.kaynak && !(h.ayetler && h.ayetler.length)) hata.push(`${s.id} / ${h.baslik}: kaynak yok`);
        if (h.ayetler && h.ayetler.length && !h.ayetNot) hata.push(`${s.id} / ${h.baslik}: ayetin sahabiyle bağı (ayetNot) yazılmamış`);
    }
    const metin = JSON.stringify(s);
    for (const r of YASAK) if (r.test(metin)) hata.push(`${s.id}: yasaklı ifade ${r}`);
}

// ---- ayetler
const refs = D.sahabiler.flatMap((s) => s.hayat.flatMap((h) => h.ayetler || []));
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'SAHABE_AYETLER', srcDir: dir });

// ---- hadis denetimi
async function hadith(name) {
    const f = dir && path.join(dir, name + '.json');
    if (f && fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
    const r = await fetch(`https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${name}.json`);
    if (!r.ok) throw new Error(name + ' indirilemedi: ' + r.status);
    return r.json();
}
// hadith-api bölüm adları → künyede kullanılan Türkçe kitap adları (Siyer Çizelgesi ile aynı yazım)
const KITAP = {
    b: { 'Revelation': 'Bed’ü’l-vahy', 'Knowledge': 'İlim', 'Ablutions (Wudu\')': 'Vudû', 'Prayers (Salat)': 'Salât',
        'Call to Prayers (Adhaan)': 'Ezân', 'Prayer at Night (Tahajjud)': 'Teheccüd', 'Funerals (Al-Janaa\'iz)': 'Cenâiz',
        'Fighting for the Cause of Allah (Jihaad)': 'Cihâd', 'Virtues and Merits of the Prophet (pbuh) and his Companions': 'Menâkıb',
        'Companions of the Prophet': 'Fezâilü ashâbi’n-nebî', 'Merits of the Helpers in Madinah (Ansaar)': 'Menâkıbü’l-ensâr',
        'Military Expeditions led by the Prophet (pbuh) (Al-Maghaazi)': 'Meğâzî',
        'Prophetic Commentary on the Qur\'an (Tafseer of the Prophet (pbuh))': 'Tefsîr', 'Virtues of the Qur\'an': 'Fezâilü’l-Kur’ân',
        'To make the Heart Tender (Ar-Riqaq)': 'Rikāk' },
    m: { 'The Book of the Merits of the Companions': 'Fezâilü’s-sahâbe', 'The Book of Wills': 'Vasiyyet',
        'The Book of Prayer - Funerals': 'Cenâiz', 'The Book of Jihad and Expeditions': 'Cihâd', 'The Book of Zakat': 'Zekât' }
};
const AD = { b: 'Buhârî', m: 'Müslim' };
const KOD = { Buhârî: 'b', Müslim: 'm' };
const ed = { b: await hadith('eng-bukhari'), m: await hadith('eng-muslim') };
const bul = (k, no) => ed[k].hadiths.filter((h) => Math.floor(+(k === 'm' ? h.arabicnumber : h.hadithnumber)) === no);
// Bölüm, hadisin sıra numarasının (hadithnumber) düştüğü aralıktan bulunur; Müslim'de aynı Abdülbâkî
// numarası iki ayrı kitapta geçebildiği için arabicnumber aralığı kullanılmaz.
function bolumAdi(k, h) {
    const E = ed[k];
    for (const [id, x] of Object.entries(E.metadata.section_details)) if (id !== '0' && h.hadithnumber >= x.hadithnumber_first && h.hadithnumber <= x.hadithnumber_last) return E.metadata.sections[id].trim();
    return '';
}
// "Buhârî, Menâkıb, 3623–3624; Müslim, Fezâilü’s-sahâbe, 2450" → [{k, kitap, nolar}]
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
function denetle(yer, k, no, kitap, ravi) {
    const hs = bul(k, no);
    if (!hs.length) { hata.push(`${yer}: ${AD[k]} ${no} bulunamadı`); return; }
    const uyan = hs.filter((h) => KITAP[k][bolumAdi(k, h)] === kitap);
    if (!uyan.length) { hata.push(`${yer}: ${AD[k]} ${no} kitabı "${kitap}" değil (${[...new Set(hs.map((h) => bolumAdi(k, h)))].join(' / ')})`); return; }
    if (ravi && !uyan.some((h) => h.text.toLowerCase().includes(ravi.toLowerCase()))) hata.push(`${yer}: ${AD[k]} ${no} metninde "${ravi}" geçmiyor`);
}
let say = 0, ekKunye = 0;
const kitapliHadis = new Set();
for (const s of D.sahabiler) {
    for (const h of s.hayat) {
        const yer = `${s.id} / ${h.baslik}`;
        if (h.hadis) {
            const kun = kunyeler(h.hadis.kaynak);
            for (const [k, no, ravi] of h.hadis.k) {
                say++;
                const kk = kun.find((x) => x.k === k && x.nolar.includes(no));
                if (!kk) { hata.push(`${yer}: künye "${h.hadis.kaynak}" içinde ${AD[k]} ${no} yok`); continue; }
                denetle(yer, k, no, kk.kitap, ravi);
                if (/^Fezâil/.test(kk.kitap)) kitapliHadis.add(s.id);
            }
            const kNo = new Set(h.hadis.k.map(([k, no]) => k + no));
            for (const x of kun) for (const no of x.nolar) if (!kNo.has(x.k + no)) hata.push(`${yer}: künyedeki ${AD[x.k]} ${no} denetim listesinde (k) yok`);
        }
        for (const x of kunyeler(h.kaynak || '')) for (const no of x.nolar) { ekKunye++; denetle(`${yer} (kaynak)`, x.k, no, x.kitap, null); }
    }
}

// ---- Siyer bağlantısı ve tarih tutarlılığı
const OLAY = Object.fromEntries(S.olaylar.map((o) => [o.id, o]));
const olayYillari = (o) => { const y = (String(o.tarih).match(/\b\d{3,4}\b/g) || []).map(Number).filter((x) => x >= 500); y.push(Math.floor(o.t)); return [Math.min(...y), Math.max(...y)]; };
let bag = 0;
const geri = {};
for (const s of D.sahabiler) {
    for (const h of s.hayat) {
        if (!h.siyer) continue;
        const yer = `${s.id} / ${h.baslik}`;
        const o = OLAY[h.siyer];
        if (!o) { hata.push(`${yer}: Siyer olayı "${h.siyer}" yok`); continue; }
        bag++;
        if (h.yil !== undefined) {
            const [a, b] = Array.isArray(h.yil) ? h.yil : [h.yil, h.yil];
            const [x, y] = olayYillari(o);
            if (b < x || a > y) hata.push(`${yer}: yıl ${a === b ? a : a + '-' + b} ↔ Siyer "${o.baslik}" ${o.tarih}`);
        }
        (geri[h.siyer] = geri[h.siyer] || []).push({ id: s.id, ad: s.ad, baslik: h.baslik });
    }
    // vefat yılı Siyer'le: vefat Peygamberimizden önceyse olay da bağlı olmalı
}

if (hata.length) { console.error('Sahabe denetimi başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }

// ---- Siyer geri bağlantısı (Siyer Çizelgesi bu dosyayı yükleyip olay sayfasında sahabileri gösterebilir)
const sirali = Object.fromEntries(S.olaylar.filter((o) => geri[o.id]).map((o) => [o.id, geri[o.id]]));
fs.writeFileSync(path.join(root, 'siyer-baglanti.js'), `// Bu dosya tools/sahabe-uret.mjs ile üretilir; elle düzenlemeyin.
// Siyer Çizelgesi olay kimliği → o olayla ilgili kesiti bulunan sahabiler (sahabi sayfası: ../sahabe/#/s/<id>).
window.SAHABE_SIYER = ${JSON.stringify(sirali, null, 1)};
// Sahabi sayfasındaki "Siyer Çizelgesi'nde" bağlantısı için olayların başlığı ve tarihi (docs/siyer/data.js'ten).
window.SAHABE_SIYER_OLAY = ${JSON.stringify(Object.fromEntries(Object.keys(sirali).map((id) => [id, { baslik: OLAY[id].baslik, tarih: OLAY[id].tarih }])), null, 1)};
`);
const eksikFez = D.sahabiler.filter((s) => !kitapliHadis.has(s.id)).map((s) => s.id);
console.log(`docs/sahabe/ayetler.js: ${n} ayet · ${say} hadis künyesi + ${ekKunye} ek künye denetlendi · ${bag} Siyer bağlantısı tutarlı`);
if (eksikFez.length) console.log(`Not: Fezâil bölümünden hadisi olmayan sahabiler: ${eksikFez.join(', ')}`);
