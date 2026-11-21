// Siyer Çizelgesi — sesli anlatım metni üretici
// ----------------------------------------------
// docs/siyer/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere
// hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir.
// Arapça ayet metni seslendirilmez; meali okunur. Hadis anlamı ve kaynağı söylenir.
// Kullanım:  node tools/siyer-anlatim.mjs   →  tools/siyer-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'siyer');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.SIYER_DATA, A = sb.window.SIYER_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ') || 'sıfır'; };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
// Okunuş: Sa‘d → Saad (ayn atılınca "Sad" okunuyordu); kalan ayn işareti (Rebî‘) okunmaz.
const ac = (t) => String(t).replace(/Sa[‘’']d\b/g, 'Saad').replace(/‘/g, '').replace(/\bHz\.\s*/g, 'Hazreti ').replace(/ b\. /g, ' bin ');
const temiz = (t) => ac(t).replace(/\.”\s+(?=[a-zçğıöşü])/g, ',” ').replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"…]/g, '').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const ayetGiris = (a) => { const [x, y] = String(a.no).split('-').map(Number); return y ? `${a.sure} Suresi, ${sira(x)} ${y - x === 1 ? 've' : 'ile'} ${sira(y)} ${y - x === 1 ? 'ayetlerin' : 'ayetler arasının'} anlamı şöyledir.` : `${a.sure} Suresi, ${sira(x)} ayetin anlamı şöyledir.`; };
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
// "610–613" → "altı yüz on ile altı yüz on üç arası" · "Hicrî 2" → "hicretin ikinci yılı"
const yilSoz = (n) => (n >= 1000 ? 'bin ' + sayi(n - 1000) : sayi(n));
const tarihSoz = (t) => String(t)
    .replace(/Hicrî (\d+)–(\d+)/g, (m, a, b) => `hicretin ${sira(+a)} ile ${sira(+b)} yılları arası`)
    .replace(/Hicrî (\d+)/g, (m, a) => `hicretin ${sira(+a)} yılı`)
    .replace(/(\d{3,4})–(\d{3,4})/g, (m, a, b) => `${yilSoz(+a)} ile ${yilSoz(+b)} arası`)
    .replace(/(\d{3,4}) ve (\d{3,4})/g, (m, a, b) => `${yilSoz(+a)} ve ${yilSoz(+b)}`)
    .replace(/\b(\d{3,4})\b/g, (m) => yilSoz(+m))
    .replace(/\s*·\s*/g, ', ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*,/g, ',').replace(/,\s*$/, '').replace(/\s+/g, ' ').trim();
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhârî ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhârî'; };

const g = A[D.giris.ayet];
const duraklar = [{ dosya: 'giris', baslik: 'Siyer Çizelgesi', tur: 'Giriş', parcalar: [
    ['Siyer Çizelgesi.', 0.8], 'Peygamberimizin doğumundan vefatına otuz olay.', ['Her olayı tarihi, yeri ve ilgili ayet ya da sahih hadisle anlatacağız.', 0.6],
    ayetGiris(g), ...cumleler(nokta(g.meal)).map((t, i, a) => (i === a.length - 1 ? [t, 0.8] : t)),
    ['Tarihler, siyer kaynaklarındaki yaygın kabule göredir. Bazı olayların tarihi hakkında farklı görüşler vardır.', 1]] }];
const DON = Object.fromEntries(D.donemler.map((d) => [d.id, d]));
const YER = Object.fromEntries(D.yerler.map((y) => [y.id, y]));
let onceki = null;
for (const [i, o] of D.olaylar.entries()) {
    const p = [];
    if (o.d !== onceki) { p.push([`${DON[o.d].ad}.`, 0.8]); onceki = o.d; }
    p.push([`${buyuk(sira(i + 1))} olay. ${temiz(o.baslik)}.`, 0.7]);
    const bilgi = [/\d/.test(o.tarih) ? `Tarih: ${tarihSoz(o.tarih)}.` : `Zaman: ${o.tarih.toLocaleLowerCase('tr')}.`];
    if (typeof o.yas === 'number') bilgi.push(`Peygamberimiz ${String(o.yas).replace(/\d+/g, (m) => sayi(+m))} yaşındaydı.`);
    if (o.yer) bilgi.push(`Yer: ${YER[o.yer].ad}.`);
    p.push(...bilgi); son(p, 0.6);
    p.push(...cumleler(o.metin)); son(p, 0.8);
    for (const r of o.ayetler || []) { const a = A[r]; p.push(ayetGiris(a), ...cumleler(nokta(a.meal))); son(p, 0.8); }
    if (o.hadis) {
        p.push(`${temiz(o.hadis.ravi)} anlatıyor.`, ...cumleler(nokta(o.hadis.metin)), `Bu hadisi ${kitaplar(o.hadis.k)} rivayet etmiştir.`); son(p, 0.8);
    }
    if (o.not) { p.push(...cumleler(o.not)); son(p, 0.6); }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(o.ders)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + o.id, baslik: o.baslik, tur: DON[o.d].ad, parcalar: p });
}
fs.writeFileSync(path.join(here, 'siyer-anlatim.json'), JSON.stringify({ _aciklama: 'Siyer Çizelgesi sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni seslendirilmez, meali okunur. Bu dosya tools/siyer-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Siyer Çizelgesi' }), duraklar }, null, 1) + '\n');
console.log(`tools/siyer-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
