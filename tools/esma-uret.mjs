// Esmâ-ül Hüsnâ — Arapça isimler ve ayetler üretici
// --------------------------------------------
// 1. İsimleri Tirmizî, Daavât, 3507'nin Arapça metninden (fawazahmed0/hadith-api, ara-tirmidhi)
//    harekeleriyle alır: "Allah" lafzı ve er-Rahmân'dan es-Sabûr'a 98 isim, toplam 99.
// 2. Sıranın docs/esma/data.js ile aynı olduğunu harekesiz karşılaştırmayla denetler.
// 3. Her ismin "ayet" alanındaki ayetin, "kok" alanındaki kelimeyi gerçekten içerdiğini
//    Tanzil metninde arar; içermiyorsa durur.
// 4. docs/esma/isimler.js ve (ortak üreticiyle) docs/esma/ayetler.js yazar.
//
// Kullanım:  node tools/esma-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler, edition, parseRef } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'esma');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.ESMA_DATA;

const strip = (w) => w.replace(/[ً-ٰٟۖ-ۭـ‎‏"“”]/g, '').replace(/[ٱأإآ]/g, (c) => (c === 'آ' ? 'ا' : 'ا')).trim();
const loose = (w) => strip(w).replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');

async function tirmizi() {
    let j;
    if (dir && fs.existsSync(path.join(dir, 'ara-tirmidhi.json'))) j = JSON.parse(fs.readFileSync(path.join(dir, 'ara-tirmidhi.json'), 'utf8'));
    else { const r = await fetch('https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-tirmidhi.json'); if (!r.ok) throw new Error('Tirmizî indirilemedi'); j = await r.json(); }
    const h = j.hadiths.find((x) => String(x.hadithnumber) === '3507');
    const words = h.text.split(/\s+/);
    const bare = words.map(strip);
    const a = bare.indexOf('الرحمن'), b = bare.indexOf('الصبور');
    const allah = words[bare.indexOf('الله', bare.indexOf('هو'))];
    const seg = words.slice(a, b + 1), sb2 = bare.slice(a, b + 1);
    const names = [allah];
    for (let i = 0; i < seg.length;) {
        if (sb2[i] === 'مالك') { names.push(seg[i] + ' ' + seg[i + 1]); i += 2; continue; }
        if (sb2[i] === 'ذو') { names.push(seg.slice(i, i + 3).join(' ')); i += 3; continue; }
        names.push(seg[i]); i += 1;
    }
    return names;
}

const names = await tirmizi();
if (names.length !== 99 || D.isimler.length !== 99) throw new Error(`İsim sayısı 99 değil: Tirmizî ${names.length}, data.js ${D.isimler.length}`);
names.forEach((n, i) => { if (loose(n) !== loose(D.isimler[i].b)) throw new Error(`${i + 1}. isim uyuşmuyor: Tirmizî ${strip(n)}, data.js ${D.isimler[i].b}`); });

const ar = await edition('ara-quransimple', dir);
const A = Object.fromEntries(ar.map((x) => [x.chapter + ':' + x.verse, x.text]));
let checked = 0;
for (const [i, x] of D.isimler.entries()) {
    if (!x.ayet) { if (x.tur !== 'yok') throw new Error(`${i + 1}. ${x.o}: ayet yok ama tur "${x.tur}"`); continue; }
    const { s, a, b } = parseRef(x.ayet);
    let text = '';
    for (let v = a; v <= b; v++) text += ' ' + A[`${s}:${v}`];
    if (!loose(text).includes(loose(x.kok))) throw new Error(`${i + 1}. ${x.o}: ${x.ayet} ayetinde "${x.kok}" bulunamadı`);
    checked++;
}
fs.writeFileSync(path.join(root, 'isimler.js'), `// Bu dosya tools/esma-uret.mjs ile üretilir; elle düzenlemeyin.
// Kaynak: Tirmizî, Daavât, 3507 (Arapça metin, değiştirilmeden). Sıra data.js ile aynıdır.
window.ESMA_ARAPCA = ${JSON.stringify(names, null, 1)};
`);
const n = await buildAyetler({ refs: D.isimler.filter((x) => x.ayet).map((x) => x.ayet), outFile: path.join(root, 'ayetler.js'), globalName: 'ESMA_AYETLER', srcDir: dir });
console.log(`docs/esma/isimler.js: 99 isim (Tirmizî ile aynı sıra) · ${checked} isim ayetinde doğrulandı · docs/esma/ayetler.js: ${n} ayet`);
