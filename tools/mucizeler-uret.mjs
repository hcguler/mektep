// Kur'an'dan Mucizeler — ayetler, anahtar ifadeler ve yapı denetimi
// -----------------------------------------------------------------
// 1. data.js'te geçen bütün ayetleri ortak üreticiyle docs/mucizeler/ayetler.js dosyasına yazar
//    (Tanzil Simple + Diyanet İşleri meali); birleşik mealler aralık olarak istenir (ör. Rûm 2-5, Tebbet 1-5).
// 2. Her mucizenin anahtar ifadesini ("ifade.b", harekesiz) "ifade.ref" ayetinin Tanzil (Simple) metninde
//    ardışık kelimeler olarak arar ve harekeleriyle olduğu gibi alır (ifadeler.js); Arapça elle yazılmaz.
// 3. Yapı ve dil denetimi: zorunlu alanlar, grup alanları (gelecek: gerceklesme; bilim: bugun + yorum),
//    kaynak, hadis kaynağı kullanılmaması (kullanıcı kararı: Kur'an dışına çıkılmaz).
// Kullanım:  node tools/mucizeler-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler, edition, parseRef, SURE } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'mucizeler');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.MUCIZE_DATA;
const hata = [];

// ---- yapı ve dil
const GRUP = new Set(D.gruplar.map((g) => g.id));
const ids = new Set();
const YASAK = [/Buhârî|Müslim,|Tirmizî|Ebû Dâvûd|hadis/i, /\bayın yarılması\b/i];
for (const m of D.mucizeler) {
    if (ids.has(m.id)) hata.push(`${m.id}: kimlik iki kez kullanılmış`);
    ids.add(m.id);
    if (!GRUP.has(m.grup)) hata.push(`${m.id}: grup yok (${m.grup})`);
    for (const k of ['ad', 'renk', 'emo', 'ikon', 'kisa', 'akilda', 'cocuk']) if (!m[k]) hata.push(`${m.id}: ${k} boş`);
    if (!m.ayetler || !m.ayetler.length) hata.push(`${m.id}: ayet yok`);
    if (!m.ifade || !m.ifade.ref || !m.ifade.b || !m.ifade.okunus || !m.ifade.anlam) hata.push(`${m.id}: ifade eksik`);
    if (!m.aciklama || m.aciklama.length < 1 || m.aciklama.length > 4) hata.push(`${m.id}: açıklama 1-4 paragraf olmalı`);
    if (!Array.isArray(m.kaynak) || !m.kaynak.length) hata.push(`${m.id}: kaynak yok`);
    if (m.grup === 'gelecek' && !(m.gerceklesme && m.gerceklesme.length)) hata.push(`${m.id}: gerçekleşme yok`);
    if (m.grup === 'bilim' && !(m.bugun && m.bugun.length && m.yorum)) hata.push(`${m.id}: bugünkü bilgi ya da yorum notu yok`);
    if (m.grup === 'bilim' && !/çağdaş|i‘câz/.test(m.yorum)) hata.push(`${m.id}: yorum notu yorumun kime ait olduğunu söylemiyor`);
    const metin = JSON.stringify(m);
    for (const r of YASAK) if (r.test(metin)) hata.push(`${m.id}: Kur'an dışı rivayet kaynağı ${r}`);
}

// ---- ayetler
const refs = D.mucizeler.flatMap((m) => m.ayetler);
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'MUCIZE_AYETLER', srcDir: dir });
for (const m of D.mucizeler) {
    const { s, a } = parseRef(m.ifade.ref);
    if (!m.ayetler.some((r) => { const p = parseRef(r); return p.s === s && p.a <= a && a <= p.b; })) hata.push(`${m.id}: ifade ayeti ${m.ifade.ref} sayfadaki ayetlerin içinde değil`);
}

// ---- anahtar ifadeler (Tanzil metninden, harekeleriyle)
const DIAC = /[\u064B-\u0670\u065F\u06D6-\u06ED\u0640]/g;
const bare = (w) => w.replace(DIAC, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
const ar = await edition('ara-quransimple', dir);
const AR = Object.fromEntries(ar.map((x) => [x.chapter + ':' + x.verse, x.text]));
const ifadeler = {};
for (const m of D.mucizeler) {
    const words = AR[m.ifade.ref].split(/\s+/).filter(Boolean);
    const hedef = m.ifade.b.split(/\s+/).map(bare);
    let bulundu = '';
    for (let i = 0; i + hedef.length <= words.length && !bulundu; i++) {
        if (hedef.every((h, k) => bare(words[i + k]) === h)) bulundu = words.slice(i, i + hedef.length).join(' ');
    }
    if (!bulundu) hata.push(`${m.id}: "${m.ifade.b}" ${m.ifade.ref} ayetinde bulunamadı`);
    ifadeler[m.id] = bulundu;
}

if (hata.length) { console.error('Mucizeler denetimi başarısız:\n  ' + hata.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(root, 'ifadeler.js'), `// Bu dosya tools/mucizeler-uret.mjs ile üretilir; elle düzenlemeyin.
// Her ifade, data.js'teki "ifade.ref" ayetinin Tanzil (Simple) metninden harekeleriyle, değiştirilmeden alınmıştır.
window.MUCIZE_IFADELER = ${JSON.stringify(ifadeler, null, 1)};
`);
const sureler = [...new Set(refs.map((r) => SURE[parseRef(r).s]))];
console.log(`docs/mucizeler/ayetler.js: ${n} ayet kaydı · ifadeler.js: ${Object.keys(ifadeler).length} ifade`);
console.log('Sureler: ' + sureler.join(', '));
console.log(Object.entries(ifadeler).map(([k, v]) => `${k}: ${v}`).join('\n'));
