// Kur'an'dan Davranış Modeli — ayet metinleri üretici
// docs/davranis/data.js içindeki ayet numaralarından docs/davranis/ayetler.js dosyasını üretir.
// Arapça: Tanzil (Simple), meal: Diyanet İşleri (Tanzil, tr.diyanet). Ayrıntı: tools/lib/tanzil-ayetler.mjs
// Kullanım:  node tools/davranis-ayetler.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'davranis');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const D = sb.window.DAVRANIS_DATA;
const refs = [D.cati.ayet, ...D.ilkeler.map((i) => i.ayet), ...D.davranislar.flatMap((d) => d.ayetler)];
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'DAVRANIS_AYETLER', srcDir: process.argv[2] });
console.log(`docs/davranis/ayetler.js yazıldı: ${n} ayet`);
