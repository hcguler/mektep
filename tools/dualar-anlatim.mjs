// Kur'an Duaları — sesli anlatım metni üretici
// --------------------------------------------
// docs/dualar/data.js ve metinler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere
// hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir.
// Arapça metin ve okunuş seslendirilmez (kıraat yalnızca gerçek kâri kaydından çalınır); duanın anlamı okunur.
// Kullanım:  node tools/dualar-anlatim.mjs   →  tools/dualar-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'dualar');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'metinler.js'), 'utf8'), sb);
const D = sb.window.DUA_DATA, A = sb.window.DUA_METIN;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ') || 'sıfır'; };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
const ac = (t) => String(t).replace(/\s*\(s\.a\.v\.\)/g, ' sallallahu aleyhi ve sellem').replace(/\bHz\.\s*/g, 'Hazreti ').replace(/ b\. /g, ' bin ');
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

const GR = Object.fromEntries(D.gruplar.map((g) => [g.id, g]));
const ayetSoz = (m) => { const [x, y] = String(m.no).split('-').map(Number); return y ? `${m.sure} Suresi, ${sira(x)} ${y - x === 1 ? 've' : 'ile'} ${sira(y)} ayetler` : `${m.sure} Suresi, ${sira(x)} ayet`; };
const duraklar = [{ dosya: 'giris', baslik: "Kur'an Duaları", tur: 'Giriş', parcalar: [
    ["Kur'an Duaları.", 0.8], ['Kur’an’da peygamberlerin ve müminlerin ettiği kırk üç dua.', 0.6],
    'Her duanın kim tarafından, hangi durumda edildiğini ve anlamını dinleyeceksiniz.', ['Arapçasını ve okunuşunu ekranda bulabilirsiniz.', 1]] }];
let onceki = null;
for (const [i, d] of D.dualar.entries()) {
    const m = A[d.id];
    const p = [];
    if (d.grup !== onceki) { p.push([`${GR[d.grup].ad}.`, 0.8]); onceki = d.grup; }
    // Okunuş ve Arapça anlatıma girmez; duanın adı yerine konusu söylenir.
    p.push([`${buyuk(sira(i + 1))} dua. ${nokta(temiz(d.konu))}`, 0.6]);
    const kimSoz = d.p === 'muhammed' ? 'Allah bu duayı Peygamberimize öğretmiştir.' : d.kim === 'Kur’an’ın öğrettiği dua' ? 'Bu duayı Kur’an öğretir.' : `Bu duayı ${temiz(d.kim)} etmiştir.`;
    p.push(kimSoz, ...cumleler(d.baglam)); son(p, 0.8);
    p.push(`${ayetSoz(m)}. Duanın anlamı şöyledir.`, ...cumleler(nokta(m.meal))); son(p, 1);
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(d.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + d.id, baslik: d.ad, tur: GR[d.grup].ad, parcalar: p });
}
fs.writeFileSync(path.join(here, 'dualar-anlatim.json'), JSON.stringify({ _aciklama: "Kur'an Duaları sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça metin ve okunuş seslendirilmez, duanın Diyanet meali okunur. Bu dosya tools/dualar-anlatim.mjs ile üretilir; elle düzenlemeyin.", tam: tamAnlatim(duraklar, { baslik: "Kur'an Duaları" }), duraklar }, null, 1) + '\n');
console.log(`tools/dualar-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
