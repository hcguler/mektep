// İslam'da Kavram Haritası — ayet metinleri üretici
// docs/kavram/data.js içindeki ayet numaralarından docs/kavram/ayetler.js dosyasını üretir.
// Arapça: Tanzil (Simple), meal: Diyanet İşleri (Tanzil, tr.diyanet). Ayrıntı: tools/lib/tanzil-ayetler.mjs
// Kullanım:  node tools/kavram-ayetler.mjs [indirilmiş dosyaların klasörü]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildAyetler } from './lib/tanzil-ayetler.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'kavram');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
const refs = sb.window.KAVRAM_DATA.kavramlar.flatMap((k) => (k.deliller || []).filter((d) => d.ayet).map((d) => d.ayet));
const n = await buildAyetler({ refs, outFile: path.join(root, 'ayetler.js'), globalName: 'KAVRAM_AYETLER', srcDir: process.argv[2] });
console.log(`docs/kavram/ayetler.js yazıldı: ${n} ayet`);
