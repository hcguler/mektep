// Kur'an'da Hayvanlar — ayetler, Arapça adlar, hadis ve bağlantı denetimi
// -----------------------------------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/hayvanlar/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir.
// 2. Her hayvanın Arapça adını "adAyet" ayetinin Tanzil (Simple) metninden harekeleriyle alır (adlar.js);
//    elle yazılmaz. Kelimenin başındaki ve / fe / bi / li bitişik harfleri ayrılır.
// 3. Her hadis künyesini fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler: numara o kitapta
//    var mı, künyedeki kitap adı (bölüm) tutuyor mu, metinde ravinin adı geçiyor mu. Bölüm, hadisin sıra
//    numarasından (hadithnumber) bulunur; böylece aynı Abdülbâkî numarası iki kitapta geçen Müslim
//    rivayetleri (ör. 2242) doğru bölümle eşleşir (tools/sahabe-uret.mjs ile aynı yöntem).
// 4. Peygamber kıssası bağlantıları: kissa.p kimliği docs/peygamberler/data.js'te var mı; sure numaraları
//    (Sureler Atlası bağlantısı) 1-114 arasında mı.
// 5. Yapı ve dil denetimi: zorunlu alanlar, kaynak, ayetin söylemediği ayrıntıların (köpeğin adı vb.) yazılmaması.
// Kullanım:  node tools/hayvanlar-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler, edition, parseRef, SURE } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'hayvanlar');
const dir = process.argv[2];
const yukle = (f, ad) => { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(f, 'utf8'), sb); return sb.window[ad]; };
const D = yukle(path.join(root, 'data.js'), 'HAYVAN_DATA');
const P = yukle(path.join(here, '..', 'docs', 'peygamberler', 'data.js'), 'PEYGAMBER_DATA');
const hata = [];

// ---- yapı ve dil
const GRUP = new Set(D.gruplar.map((g) => g.id));
const PID = new Set(P.peygamberler.map((p) => p.id));
const ids = new Set();
// Ayette olmayan, rivayetlerden gelen ayrıntılar metne girmez (adlar yalnızca "Kur'an ... vermez" notunda geçebilir).
const YASAK = [/kıtmîr|kitmir/i, /\bmahmud\b/i, /ya[‘']?fûr|yafur/i, /balina/i, /köpek ?balığı/i, /kraliçe/i, /belkıs/i, /ninova/i, /kudâr/i];
for (const h of D.hayvanlar) {
    if (ids.has(h.id)) hata.push(`${h.id}: kimlik iki kez kullanılmış`);
    ids.add(h.id);
    if (!GRUP.has(h.grup)) hata.push(`${h.id}: grup yok (${h.grup})`);
    for (const k of ['ad', 'renk', 'b', 'adAyet', 'okunus', 'anlam', 'kisa', 'cocuk', 'akilda']) if (!h[k]) hata.push(`${h.id}: ${k} boş`);
    if (!h.ayetler || !h.ayetler.length) hata.push(`${h.id}: ayet yok`);
    if (!h.aciklama || h.aciklama.length < 2 || h.aciklama.length > 4) hata.push(`${h.id}: açıklama 2-4 paragraf olmalı`);
    if (!Array.isArray(h.kaynak)) hata.push(`${h.id}: kaynak dizisi yok`);
    if (h.hadis && !D.hadisler[h.hadis]) hata.push(`${h.id}: hadis "${h.hadis}" yok`);
    if (h.kissa) {
        if (h.kissa.p && !PID.has(h.kissa.p)) hata.push(`${h.id}: peygamber kimliği "${h.kissa.p}" docs/peygamberler/data.js içinde yok`);
        if (h.kissa.sure && !(h.kissa.sure >= 1 && h.kissa.sure <= 114)) hata.push(`${h.id}: sure numarası geçersiz`);
        if (h.grup === 'kissa' && !h.kissa.p) hata.push(`${h.id}: peygamber kıssası grubunda ama peygamber bağlantısı yok`);
    } else if (h.grup !== 'ornek') hata.push(`${h.id}: kıssa bilgisi yok`);
    const metin = JSON.stringify(h);
    for (const r of YASAK) if (r.test(metin)) hata.push(`${h.id}: ayette olmayan ayrıntı ${r}`);
}
for (const id of D.merhamet.sira) if (!D.hadisler[id] || !D.hadisler[id].merhamet) hata.push(`merhamet: "${id}" hadisi yok ya da merhamet işaretli değil`);

// ---- ayetler
const refs = D.hayvanlar.flatMap((h) => h.ayetler);
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'HAYVAN_AYETLER', srcDir: dir });
for (const h of D.hayvanlar) {
    const { s, a } = parseRef(h.adAyet);
    if (!h.ayetler.some((r) => { const p = parseRef(r); return p.s === s && p.a <= a && a <= p.b; })) hata.push(`${h.id}: adAyet ${h.adAyet} sayfadaki ayetlerin içinde değil`);
}

// ---- Arapça adlar (Tanzil metninden)
const DIAC = /[\u064B-\u0670\u065F\u06D6-\u06ED\u0640]/g;
const bare = (w) => w.replace(DIAC, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
const ar = await edition('ara-quransimple', dir);
const AR = Object.fromEntries(ar.map((x) => [x.chapter + ':' + x.verse, x.text]));
function extract(ref, name) {
    const { s, a, b: son } = parseRef(ref);
    let words = [];
    for (let v = a; v <= son; v++) words = words.concat(AR[`${s}:${v}`].split(/\s+/));
    const target = bare(name);
    for (const w of words) {
        const b = bare(w);
        for (const pre of ['', 'و', 'ف', 'ب', 'ل']) {
            if (b === pre + target) {
                let x = w;
                for (let k = 0; k < pre.length; k++) x = x.replace(/^.[\u064B-\u0670]*/, '');
                return x;
            }
        }
    }
    hata.push(`${ref} ayetinde "${name}" bulunamadı`);
    return '';
}
const adlar = {};
for (const h of D.hayvanlar) adlar[h.id] = extract(h.adAyet, h.b);

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
    b: { 'Distribution of Water': 'Müsâkât', 'Fighting for the Cause of Allah (Jihaad)': 'Cihâd', 'Medicine': 'Tıb',
        'Lost Things Picked up by Someone (Luqatah)': 'Lukata', 'Prophets': 'Ehâdîsü’l-enbiyâ', 'Agriculture': 'Hars ve müzâraa',
        'Hunting, Slaughtering': 'Zebâih ve sayd' },
    m: { 'The Book of Greetings': 'Selâm', 'The Book of Pilgrimage': 'Hac', 'The Book of Hunting, Slaughter, and what may be Eaten': 'Sayd ve zebâih',
        'The Book on Government': 'İmâre', 'The Book of Musaqah': 'Müsâkât', 'The Book of Zuhd and Softening of Hearts': 'Zühd' }
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
let say = 0;
for (const [id, h] of Object.entries(D.hadisler)) {
    for (const f of ['baslik', 'metin', 'ravi', 'kaynak', 'ders']) if (!h[f]) hata.push(`hadis ${id}: ${f} boş`);
    const kun = kunyeler(h.kaynak);
    for (const [k, no, ravi] of h.k) {
        say++;
        const kk = kun.find((x) => x.k === k && x.nolar.includes(no));
        if (!kk) { hata.push(`hadis ${id}: künye "${h.kaynak}" içinde ${AD[k]} ${no} yok`); continue; }
        denetle(`hadis ${id}`, k, no, kk.kitap, ravi);
    }
    const kNo = new Set(h.k.map(([k, no]) => k + no));
    for (const x of kun) for (const no of x.nolar) if (!kNo.has(x.k + no)) hata.push(`hadis ${id}: künyedeki ${AD[x.k]} ${no} denetim listesinde (k) yok`);
}

if (hata.length) { console.error('Hayvanlar denetimi başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(root, 'adlar.js'), `// Bu dosya tools/hayvanlar-uret.mjs ile üretilir; elle düzenlemeyin.
// Her ad, data.js'teki "adAyet" ayetinin Tanzil (Simple) metninden harekeleriyle alınmıştır.
window.HAYVAN_ADLAR = ${JSON.stringify(adlar, null, 1)};
`);
const sureler = [...new Set(D.hayvanlar.flatMap((h) => h.ayetler.map((r) => SURE[parseRef(r).s])))];
console.log(`docs/hayvanlar/ayetler.js: ${n} ayet · adlar.js: ${Object.keys(adlar).length} ad · ${say} hadis künyesi denetlendi · ${D.hayvanlar.filter((h) => h.kissa && h.kissa.p).length} peygamber bağlantısı tutarlı`);
console.log('Sureler: ' + sureler.join(', '));
console.log(Object.entries(adlar).map(([k, v]) => `${k}: ${v}`).join(' | '));
