// Peygamberler Yolculuğu — Arapça adlar ve ayetler üretici
// --------------------------------------------
// 1. Her peygamberin Arapça adını "adAyet" ayetinin Tanzil (Simple) metninden alır; elle yazılmaz.
//    Kelimenin başındaki ve / fe / bi / li bitişik harfleri ayrılır; ad, harekeleriyle Kur'an'daki gibidir.
// 2. data.js'te geçen bütün ayetleri (giriş, olaylar, öne çıkan ayet, kavim, yer, aile) ortak üreticiyle
//    docs/peygamberler/ayetler.js dosyasına yazar; birleşik mealler aralık olarak istenir.
// Kullanım:  node tools/peygamberler-uret.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler, edition, parseRef } from './lib/tanzil-ayetler.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'peygamberler');
const dir = process.argv[2];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.PEYGAMBER_DATA;

const DIAC = /[ً-ٰٟۖ-ۭـ]/g;
const bare = (w) => w.replace(DIAC, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي');
const ar = await edition('ara-quransimple', dir);
const A = Object.fromEntries(ar.map((x) => [x.chapter + ':' + x.verse, x.text]));

function extract(ref, name) {
    const { s, a, b: son } = parseRef(ref);
    let words = [];
    for (let v = a; v <= son; v++) words = words.concat(A[`${s}:${v}`].split(/\s+/));
    const target = bare(name).split(' ');
    for (let i = 0; i + target.length <= words.length; i++) {
        const seg = words.slice(i, i + target.length);
        const b = seg.map(bare);
        // ilk kelimenin başındaki bitişik harf (و ف ب ل) varsa ayır
        for (const pre of ['', 'و', 'ف', 'ب', 'ل', 'وب', 'ول']) {
            if (b[0] === pre + target[0] && b.slice(1).join(' ') === target.slice(1).join(' ')) {
                let w = seg[0];
                // önekteki her harfi harekeleriyle birlikte at
                for (let k = 0; k < pre.length; k++) w = w.replace(/^.[ً-ٰٟ]*/, '');
                return [w, ...seg.slice(1)].join(' ');
            }
        }
    }
    throw new Error(`${ref} ayetinde "${name}" bulunamadı`);
}

const names = {};
for (const p of D.peygamberler) names[p.id] = extract(p.adAyet, p.b);
fs.writeFileSync(path.join(root, 'adlar.js'), `// Bu dosya tools/peygamberler-uret.mjs ile üretilir; elle düzenlemeyin.
// Her ad, data.js'teki "adAyet" ayetinin Tanzil (Simple) metninden harekeleriyle alınmıştır.
window.PEYGAMBER_ADLAR = ${JSON.stringify(names, null, 1)};
`);
const refs = [...D.giris.map((g) => g.ayet)];
for (const p of D.peygamberler) {
    refs.push(p.ayet, ...p.olaylar.map((o) => o.ayet), ...(p.aile || []).map((x) => x.ayet));
    if (p.kavim) refs.push(p.kavim.ayet);
    if (p.yer) refs.push(p.yer.ayet);
}
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'PEYGAMBER_AYETLER', srcDir: dir });
console.log(`docs/peygamberler/adlar.js: ${Object.keys(names).length} ad · docs/peygamberler/ayetler.js: ${n} ayet`);
console.log(Object.entries(names).map(([k, v]) => `${k}: ${v}`).join(' | '));
