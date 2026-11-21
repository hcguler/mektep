// Peygamberler Yolculuğu — sesli anlatım metni üretici
// ----------------------------------------------------
// docs/peygamberler/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek
// üzere hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir.
// Arapça ayet metni seslendirilmez; yalnızca meali okunur.
// Biçim tools/namaz-anlatim.json ile aynıdır.
// Kullanım:  node tools/peygamberler-anlatim.mjs   →  tools/peygamberler-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'peygamberler');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.PEYGAMBER_DATA, A = sb.window.PEYGAMBER_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
const ac = (t) => String(t).replace(/\s*\(s\.a\.v\.\)/g, ' sallallahu aleyhi ve sellem').replace(/\bHz\.\s*/g, 'Hazreti ');
const temiz = (t) => ac(t).replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"]/g, '').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const ayetGiris = (a) => { const [x, y] = String(a.no).split('-').map(Number); return y ? `${a.sure} Suresi, ${sira(x)} ${y - x === 1 ? 've' : 'ile'} ${sira(y)} ${y - x === 1 ? 'ayetlerin' : 'ayetler arasının'} anlamı şöyledir.` : `${a.sure} Suresi, ${sira(x)} ayetin anlamı şöyledir.`; };
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const dosyaAd = (t) => ac(t).replace('Hazreti ', '').replace(/ sallallahu.*$/, '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’']/g, '').replace(/[^a-z0-9ıçğöşü]+/g, '-').replace(/^-|-$/g, '');

const giris = [['Peygamberler Yolculuğu.', 0.8], 'Kur’an’da adı geçen yirmi beş peygamberi, Kur’an’ın anlattığı biçimde tanıyacağız.', ['Her bilgi bir ayete dayanır.', 0.6]];
for (const g of D.giris) { const a = A[g.ayet]; giris.push(...cumleler(nokta(g.metin)), ayetGiris(a), ...cumleler(nokta(a.meal))); son(giris, 0.8); }
giris.push(['Sıralama, Hazreti Âdem’den Peygamberimize kadar yaygın sıralamadır. Kur’an bütün peygamberler için kesin bir tarih sırası vermez.', 1]);
const duraklar = [{ dosya: 'giris', baslik: 'Peygamberler Yolculuğu', tur: 'Giriş', parcalar: giris }];

for (const [i, x] of D.peygamberler.entries()) {
    const p = [[`${buyuk(sira(i + 1))} durak. ${temiz(x.ad)}.`, 0.7], nokta(temiz(x.kisa))];
    if (x.kavim) p.push(nokta(`Kavmi: ${temiz(x.kavim.metin)}`));
    if (x.yer) p.push(nokta(`Kur’an’da anılan yer: ${temiz(x.yer.metin)}`));
    son(p, 0.6);
    p.push('Kur’an’a göre.', ...cumleler(x.ozet)); son(p, 0.8);
    p.push(['Kur’an’dan olaylar.', 0.5]);
    x.olaylar.forEach((o, j) => { p.push(`${buyuk(sira(j + 1))} olay.`, ...cumleler(nokta(o.metin))); son(p, 0.6); });
    if (x.not) { p.push(...cumleler(x.not)); son(p, 0.6); }
    const a = A[x.ayet];
    p.push('Öne çıkan ayet.', ayetGiris(a), ...cumleler(nokta(a.meal))); son(p, 0.8);
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(x.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + dosyaAd(x.ad), baslik: x.ad, tur: 'Peygamber', parcalar: p });
}
fs.writeFileSync(path.join(here, 'peygamberler-anlatim.json'), JSON.stringify({ _aciklama: 'Peygamberler Yolculuğu sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni seslendirilmez, meali okunur. Bu dosya tools/peygamberler-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Peygamberler Yolculuğu' }), duraklar }, null, 1) + '\n');
console.log(`tools/peygamberler-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
