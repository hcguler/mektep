// Kur'an'da Hayvanlar — sesli anlatım metni üretici
// -------------------------------------------------
// docs/hayvanlar/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan
// Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu
// bilgisayarda üretilir. Arapça ayet metni ve okunuş seslendirilmez; meali okunur. Hadis anlamı ve kaynağı söylenir.
// "Hz." → "Hazreti"; sayılar yazıyla; parantez, simge ve emoji yok.
// Duraklar: giris · her hayvan <sıra>-<id> (01-karinca … 15-deve) · merhamet. Ayrıca tam.
// Kullanım:  node tools/hayvanlar-anlatim.mjs   →  tools/hayvanlar-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'hayvanlar');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.HAYVAN_DATA, A = sb.window.HAYVAN_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const yuzler = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const sayi = (n) => { if (n === 0) return 'sıfır'; const k = Math.floor(n / 1000), r = n % 1000; return [k ? (k > 1 ? yuzler(k) + ' ' : '') + 'bin' : '', yuzler(r)].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
// Kısaltmalar, adlar ve okunuş işaretleri
const ac = (t) => String(t)
    .replace(/\bHz\.\s*/g, 'Hazreti ')
    .replace(/ b\. /g, ' bin ')
    .replace(/TDV İslâm Ansiklopedisi|TDV İA/g, 'Türkiye Diyanet Vakfı İslâm Ansiklopedisi')
    .replace(/ā/g, 'a').replace(/ī/g, 'i').replace(/ū/g, 'u')
    .replace(/(^|[\s(“])‘(.*?)’(?=[\s.,;:!?”]|$)/g, '$1$2')
    .replace(/‘/g, '');
const temiz = (t) => ac(t)
    .replace(/\.”\s+(?=[a-zçğıöşü])/g, ',” ')
    .replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(\d+\)\s*/g, ' ')
    .replace(/\s*\(([^)]*)\)/g, ', $1,')
    .replace(/\s*·\s*/g, ', ')
    .replace(/[«»“”"…]/g, '')
    .replace(/\b(\d{1,4})\b/g, (m) => sayi(+m))
    .replace(/\s+,/g, ',').replace(/,\s*([.,;:!?])/g, '$1').replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => nokta(s.trim())).filter((s) => s.length > 1);
const ayetGiris = (a) => {
    const [x, y] = String(a.no).split('-').map(Number);
    const sure = ac(a.sure);
    return y ? `${sure} Suresi, ${sira(x)} ${y - x === 1 ? 've' : 'ile'} ${sira(y)} ${y - x === 1 ? 'ayetlerin' : 'ayetler arasının'} anlamı şöyledir.` : `${sure} Suresi, ${sira(x)} ayetin anlamı şöyledir.`;
};
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhârî ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhârî'; };
const liste = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' ve ' + a[a.length - 1] : a[0]);
function hadisParcalari(id, baslik) {
    const h = D.hadisler[id], p = [];
    p.push([baslik ? nokta(temiz(h.baslik)) : 'Bir hadis.', 0.5]);
    p.push(...cumleler(h.metin), `Bu hadisi ${kitaplar(h.k)} rivayet etmiştir.`);
    son(p, 0.5);
    p.push(...cumleler(h.ders)); son(p, 0.8);
    return p;
}

const T = D.hayvanlar.length;
const duraklar = [{ dosya: 'giris', baslik: 'Kur’an’da Hayvanlar', tur: 'Giriş', parcalar: [
    ['Kur’an’da Hayvanlar.', 0.8],
    `Kur’an’da adı geçen ${sayi(T)} hayvanı tanıyacağız.`,
    [`Onları ${sayi(D.gruplar.length)} bölümde dinleyeceğiz: ${liste(D.gruplar.map((g) => (/^Kur/.test(g.ad) ? ac(g.ad) : ac(g.ad).charAt(0).toLocaleLowerCase('tr') + ac(g.ad).slice(1))))}.`, 0.6],
    'Her hayvanın hangi surede geçtiğini, ayetin ne anlattığını ve bize bıraktığı dersi öğreneceğiz.',
    'Ayetlerin anlamı, Diyanet İşleri Başkanlığı mealinden okunur.',
    'Ayetin söylemediği ayrıntıları anlatmayacağız; müfessirlerin farklı görüşleri olan yerlerde bunu ayrıca belirteceğiz.',
    ['Sonunda, hayvanlara merhamet üzerine Peygamberimizin hadislerini dinleyeceğiz.', 1]] }];
const GRUP = Object.fromEntries(D.gruplar.map((g) => [g.id, g]));
let onceki = null;
for (const [i, h] of D.hayvanlar.entries()) {
    const p = [];
    if (h.grup !== onceki) { p.push([`${ac(GRUP[h.grup].ad)}.`, 0.8]); onceki = h.grup; }
    const sureler = [...new Set(h.ayetler.map((r) => ac(A[r].sure)))];
    p.push([`${h.ad}.`, 0.7]);
    p.push(...cumleler(h.kisa));
    p.push(`${h.ad}, ${liste(sureler)} ${sureler.length > 1 ? 'surelerinde' : 'suresinde'} geçer.`);
    if (h.kissa) p.push(nokta(`Bu, ${temiz(h.kissa.ad)} ${/^Hz\./.test(h.kissa.ad) ? 'kıssasıdır' : 'ile ilgili olaydır'}`));
    son(p, 0.7);
    for (const r of h.ayetler) { const a = A[r]; p.push(ayetGiris(a), ...cumleler(a.meal)); son(p, 0.7); }
    p.push(['Ayet ne anlatıyor?', 0.5]);
    for (const x of h.aciklama) p.push(...cumleler(x));
    son(p, 0.7);
    if (h.gorusFarki) { p.push(['Görüş farkı.', 0.4], ...cumleler(h.gorusFarki)); son(p, 0.7); }
    if (h.not) { p.push(['Bir not.', 0.4], ...cumleler(h.not)); son(p, 0.7); }
    if (h.hadis) p.push(...hadisParcalari(h.hadis, false));
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(h.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + h.id, baslik: h.ad, tur: GRUP[h.grup].ad, parcalar: p });
}
{
    const p = [['Hayvanlara merhamet.', 0.8], ...cumleler(D.merhamet.giris)];
    son(p, 0.8);
    for (const id of D.merhamet.sira) p.push(...hadisParcalari(id, true));
    son(p, 1);
    duraklar.push({ dosya: 'merhamet', baslik: 'Hayvanlara merhamet', tur: 'Hadisler', parcalar: p });
}
// Denetim: kulak için yazılan metinde rakam, parantez, simge, kısaltma kalmasın
const kalan = [];
for (const d of duraklar) for (const x of d.parcalar) { const t = Array.isArray(x) ? x[0] : x; if (/[0-9()·“”"«»…‘āīū]|Hz\.| b\. |[؀-ۿ]/.test(t)) kalan.push(`${d.dosya}: ${t}`); }
if (kalan.length) { console.error('Anlatım metninde okunmaya uygun olmayan ifade kaldı:\n  ' + kalan.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(here, 'hayvanlar-anlatim.json'), JSON.stringify({ _aciklama: 'Kur’an’da Hayvanlar sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt (giris, her hayvan için <sıra>-<id>, merhamet). Her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni ve okunuş seslendirilmez, meali okunur. Bu dosya tools/hayvanlar-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Kur’an’da Hayvanlar' }), duraklar }, null, 1) + '\n');
console.log(`tools/hayvanlar-anlatim.json yazıldı: ${duraklar.length} kayıt (${duraklar.map((d) => d.dosya).join(', ')}), ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
