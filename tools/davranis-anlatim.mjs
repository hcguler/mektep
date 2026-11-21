// Kur'an'dan Davranış Modeli — sesli anlatım metni üretici
// --------------------------------------------
// docs/davranis/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve
// seslendirilmek üzere hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm).
// Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir. Arapça metin seslendirilmez; ayetlerin yalnızca meali okunur.
// Biçim tools/namaz-anlatim.json ile aynıdır: parça ya bir metindir ya da [metin, duraklama].
//
// Kullanım:  node tools/davranis-anlatim.mjs
// Çıktı:     tools/davranis-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'davranis');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.DAVRANIS_DATA, A = sb.window.DAVRANIS_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { if (n === 0) return 'sıfır'; const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const temiz = (t) => String(t).replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(\d+\)\s*/g, ' ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"]/g, '').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
function ayetGiris(ref) {
    const a = A[ref]; const [x, y] = String(a.no).split('-').map(Number);
    return y ? `${a.sure} Suresi, ${sira(x)} ve ${sira(y)} ayetlerin anlamı şöyledir.` : `${a.sure} Suresi, ${sira(x)} ayetin anlamı şöyledir.`;
}
const ayetParca = (ref) => [ayetGiris(ref), ...cumleler(nokta(A[ref].meal))];
const son = (p, s) => { p[p.length - 1] = [Array.isArray(p[p.length - 1]) ? p[p.length - 1][0] : p[p.length - 1], s]; };

const duraklar = [];
// Giriş: çatı, ilkeler, halkalar
{
    const p = [['Kur’an’dan Davranış Modeli.', 0.8], 'Bütün davranışların çatısı Nahl Suresi’ndeki şu ayettir.', ...ayetParca(D.cati.ayet)];
    son(p, 0.8);
    p.push(['Her davranışın arkasında dört temel ilke vardır.', 0.5]);
    for (const i of D.ilkeler) { p.push(nokta(`${i.ad}. ${temiz(i.kisa)}`)); p.push(...cumleler(i.aciklama)); son(p, 0.5); }
    p.push(['Davranışlar kalpten başlar ve dışa doğru yedi halkada genişler.', 0.5]);
    p.push(nokta(D.alanlar.map((a) => `${a.ad}, ${a.alt.toLocaleLowerCase('tr')}`).join('; ')));
    son(p, 1);
    duraklar.push({ dosya: 'giris', baslik: 'Model', tur: 'Giriş', parcalar: p });
}
for (const d of D.davranislar) {
    const alan = D.alanlar.find((a) => a.id === d.alan);
    const p = [[nokta(temiz(d.ad)), 0.5], nokta(`${d.tur === 'yap' ? 'Kur’an’ın öğüttüğü bir davranış' : 'Kur’an’ın sakındırdığı bir davranış'}: ${temiz(d.kisa).toLocaleLowerCase('tr')}`)];
    son(p, 0.6);
    p.push(...cumleler(d.aciklama)); son(p, 0.6);
    for (const r of d.ayetler) { p.push(...ayetParca(r)); son(p, 0.6); }
    if (d.not) { p.push(...cumleler(d.not)); son(p, 0.6); }
    p.push('Günlük hayattan bir durum.'); p.push([nokta(temiz(d.durum)), 0.6]);
    p.push(['Akılda kalsın.', 0.5]); p.push([nokta(temiz(d.akilda)), 1]);
    duraklar.push({ dosya: d.id, baslik: d.ad, tur: alan.ad, parcalar: p });
}
const out = {
    _aciklama: "Kur'an'dan Davranış Modeli sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (duraklama: parçadan sonraki sessizlik, saniye). Arapça metin seslendirilmez; ayetlerin meali okunur. Bu dosya tools/davranis-anlatim.mjs ile docs/davranis/data.js ve ayetler.js içeriğinden üretilir; elle düzenlemeyin.",
    tam: tamAnlatim(duraklar, { baslik: "Kur'an'dan Davranış Modeli" }),
    duraklar
};
fs.writeFileSync(path.join(here, 'davranis-anlatim.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`tools/davranis-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, x) => n + x.parcalar.length, 0)} parça`);
