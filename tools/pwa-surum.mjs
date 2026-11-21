// Uygulamalar PWA — sürüm üretici
// --------------------------------------------
// docs/sw.js içindeki ONBELLEK listesindeki dosyaların (ve manifest ile ikonların) içeriğinden
// kısa bir özet üretir ve SURUM sabitini günceller. İçerik değişmediyse dosyaya dokunmaz.
// docs/ altında bir şey değiştiğinde, yayından (main'e göndermeden) önce çalıştırılır:
//
//   node tools/pwa-surum.mjs
//
// SURUM değişince kullanıcılar "Yeni sürüm hazır" penceresini görür (docs/pwa.js).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const apps = path.join(here, '..', 'docs');
const swPath = path.join(apps, 'sw.js');
const sw = fs.readFileSync(swPath, 'utf8');

const list = sw.match(/const ONBELLEK = \[([\s\S]*?)\];/);
if (!list) throw new Error('sw.js içinde ONBELLEK listesi bulunamadı');
const entries = [...list[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const files = new Set();
for (const e of entries) {
    let p = path.join(apps, e);
    if (e.endsWith('/')) p = path.join(p, 'index.html');
    files.add(p);
}
for (const f of fs.readdirSync(path.join(apps, 'icons'))) files.add(path.join(apps, 'icons', f));
files.add(path.join(apps, 'manifest.webmanifest'));

const hash = crypto.createHash('sha256');
const missing = [];
for (const f of [...files].sort()) {
    if (!fs.existsSync(f)) { missing.push(path.relative(apps, f)); continue; }
    hash.update(path.relative(apps, f) + '\0');
    hash.update(fs.readFileSync(f));
}
if (missing.length) throw new Error('ONBELLEK listesinde olup diskte bulunmayan dosyalar: ' + missing.join(', '));
const digest = hash.digest('hex').slice(0, 8);

const cur = sw.match(/const SURUM = '([^']+)';/);
if (!cur) throw new Error('sw.js içinde SURUM bulunamadı');
if (cur[1].endsWith('-' + digest)) {
    console.log(`SURUM değişmedi: ${cur[1]}`);
} else {
    const d = new Date();
    const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    const next = `${date}-${digest}`;
    fs.writeFileSync(swPath, sw.replace(cur[0], `const SURUM = '${next}';`));
    console.log(`SURUM: ${cur[1]} → ${next} (${files.size} dosya)`);
}
