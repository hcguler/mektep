// Giyim ve Görünüş — sesli anlatım metni üretici
// --------------------------------------------
// docs/giyim/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan
// Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu
// bilgisayarda üretilir. Arapça metin anlatıma girmez; ayetin Diyanet meali okunur.
// Kullanım:  node tools/giyim-anlatim.mjs   →  tools/giyim-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'giyim');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.GIYIM_DATA, A = sb.window.GIYIM_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ') || 'sıfır'; };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const ac = (t) => String(t).replace(/\bHz\.\s*/g, 'Hazreti ').replace(/ b\. /g, ' bin ').replace(/Resûlullah/g, 'Resûlullah sallallahu aleyhi ve sellem').replace(/kaz‘/g, 'kaza');
// Kaynak parantezleri (ör. "(TDV İslâm Ansiklopedisi, “Saç”)") kulak için okunmaz; diğer parantezler virgüle döner.
const temiz = (t) => ac(t).replace(/\s*\((?:TDV|Diyanet)[^)]*\)/g, '').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1')
    .replace(/[«»“”"…]/g, '').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s*·\s*/g, ', ').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhârî ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhârî'; };
const BOL = Object.fromEntries(D.bolumler.map((b) => [b.id, b]));

const duraklar = [{ dosya: 'giris', baslik: 'Giyim ve Görünüş', tur: 'Giriş', parcalar: [
    ['Giyim ve Görünüş.', 0.8], ['Erkek, kadın ve çocuk için kıyafet, örtünme, saç ve sakal.', 0.6],
    'Her konuda önce ayeti, sonra Peygamberimizin sahih hadisini, ardından Diyanet’in ve mezheplerin görüşünü dinleyeceksiniz.',
    ['Çizimleri ve kaynakları ekranda bulabilirsiniz.', 1]] }];
let onceki = null;
for (const [i, o] of D.ogeler.entries()) {
    const p = [];
    if (o.bolum !== onceki) { p.push([`${BOL[o.bolum].ad}.`, 0.8]); onceki = o.bolum; }
    p.push([nokta(temiz(o.ad)), 0.5], [`Hükmü: ${nokta(temiz(o.hukum.ad))}`, 0.6]);
    p.push(...cumleler(o.aciklama)); son(p, 0.8);
    for (const r of o.ayetler || []) {
        const a = A[r]; if (!a) continue;
        p.push(`${a.sure} Suresi, ${sira(+a.no)} ayetin anlamı şöyledir.`, ...cumleler(nokta(a.meal))); son(p, 0.8);
    }
    for (const h of o.hadisler || []) {
        p.push(`${kitaplar(h.k)} rivayet eder. Râvi ${temiz(h.ravi)}.`, ...cumleler(nokta(h.metin))); son(p, 0.8);
    }
    if (o.fikih) { p.push('Fıkıhta.', ...cumleler(o.fikih.metin)); son(p, 0.8); }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(o.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + o.id, baslik: o.ad, tur: BOL[o.bolum].ad, parcalar: p });
}
fs.writeFileSync(path.join(here, 'giyim-anlatim.json'), JSON.stringify({ _aciklama: 'Giyim ve Görünüş sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça metin seslendirilmez, ayetin Diyanet meali okunur. Bu dosya tools/giyim-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Giyim ve Görünüş' }), duraklar }, null, 1) + '\n');
console.log(`tools/giyim-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
