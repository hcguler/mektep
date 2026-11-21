// Sahabe Hayatları — sesli anlatım metni üretici
// ----------------------------------------------
// docs/sahabe/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan
// Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu
// bilgisayarda üretilir. Arapça ayet metni seslendirilmez; meali okunur. Hadis anlamı ve kaynağı söylenir.
// "Hz." → "Hazreti", "b." → "bin"; sahabinin adından sonra "radıyallahu anh / anhâ" söylenir; tarih ve sayılar yazıyla.
// Kullanım:  node tools/sahabe-anlatim.mjs   →  tools/sahabe-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'sahabe');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.SAHABE_DATA, A = sb.window.SAHABE_AYETLER;
const KADIN = new Set(['hatice', 'aise', 'fatima']);

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const yuzler = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const sayi = (n) => { if (n === 0) return 'sıfır'; const k = Math.floor(n / 1000), r = n % 1000; return [k ? (k > 1 ? yuzler(k) + ' ' : '') + 'bin' : '', yuzler(r)].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
const AYLAR = 'Muharrem|Safer|Rebîülevvel|Rebîülâhir|Cemâziyelevvel|Cemâziyelâhir|Recep|Şâban|Ramazan|Şevval|Zilkade|Zilhicce';
// Kısaltmalar ve adlar
const ac = (t) => String(t)
    .replace(/Sa[‘’']d\b/g, 'Saad') // okunuş: ayn atılınca "Sad" okunuyordu
    .replace(/\bHz\.\s*/g, 'Hazreti ')
    .replace(/ b\. /g, ' bin ')
    .replace(/TDV İslâm Ansiklopedisi|TDV İA/g, 'Türkiye Diyanet Vakfı İslâm Ansiklopedisi')
    .replace(/(^|[\s(“])‘(.*?)’(?=[\s.,;:!?”]|$)/g, '$1$2')
    .replace(/‘/g, '');
// Tarihler: "22 Cemâziyelâhir 13 (23 Ağustos 634)" → "hicrî on üç yılı, yirmi iki Cemâziyelâhir, milâdî yirmi üç Ağustos altı yüz otuz dört"
const tarih = (t) => String(t)
    .replace(new RegExp(`\\b(\\d{1,2}) (${AYLAR}) (\\d{1,3})\\b`, 'g'), (m, g, a, y) => `hicrî ${sayi(+y)} yılı, ${sayi(+g)} ${a}`)
    .replace(new RegExp(`\\b(${AYLAR}) (\\d{1,3})\\b`, 'g'), (m, a, y) => `hicrî ${sayi(+y)} yılının ${a} ayı`)
    .replace(/Hicrî (\d+)/g, (m, y) => `hicrî ${sayi(+y)}`)
    .replace(/\(((?:\d|Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)[^)]*)\)/g, (m, x) => `, milâdî ${x},`)
    .replace(/\b(\d{3,4})[–-](\d{3,4})\b/g, (m, a, b) => `${sayi(+a)} ya da ${sayi(+b)}`);
const temiz = (t) => tarih(ac(t))
    .replace(/\.”\s+(?=[a-zçğıöşü])/g, ',” ')
    .replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ')
    .replace(/\s*\(([^)]*)\)/g, ', $1,')
    .replace(/\s*·\s*/g, ', ')
    .replace(/[«»“”"…]/g, '')
    .replace(/\b(\d{1,4})’(?=[a-zçğıöşü])/g, (m, n) => sayi(+n) + '’')
    .replace(/\b(\d{1,4})\b/g, (m) => sayi(+m))
    .replace(/\s+,/g, ',').replace(/,\s*([.,;:!?])/g, '$1').replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => nokta(s.trim())).filter((s) => s.length > 1);
const ayetGiris = (a) => { const [x, y] = String(a.no).split('-').map(Number); return y ? `${ac(a.sure)} Suresi, ${sira(x)} ile ${sira(y)} ayetler arasının anlamı şöyledir.` : `${ac(a.sure)} Suresi, ${sira(x)} ayetin anlamı şöyledir.`; };
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhârî ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhârî'; };
const radi = (s) => (KADIN.has(s.id) ? 'radıyallahu anhâ' : 'radıyallahu anh');

const T = D.sahabiler.length;
const duraklar = [{ dosya: 'giris', baslik: 'Sahabe Hayatları', tur: 'Giriş', parcalar: [
    ['Sahabe Hayatları.', 0.8],
    `Peygamberimizin ${sayi(T)} arkadaşını tanıyacağız.`,
    'Sahabe, Peygamberimizi görüp ona inanan ve Müslüman olarak vefat eden kişilerdir.',
    [`Sahabileri ${sayi(D.gruplar.length)} bölümde tanıyacağız: ${D.gruplar.map((g) => ac(g.ad)).join(', ')}.`, 0.6],
    'Her birinin hayatından birkaç kesit anlatacağız.',
    'Kesitler, Buhârî ve Müslim’deki sahih hadislere, ilgili ayetlere ve Türkiye Diyanet Vakfı İslâm Ansiklopedisi’ne dayanır.',
    ['Tarihlerde farklı rivayetler varsa ayrıca belirteceğiz.', 1]] }];
const GRUP = Object.fromEntries(D.gruplar.map((g) => [g.id, g]));
let onceki = null;
for (const [i, s] of D.sahabiler.entries()) {
    const p = [];
    if (s.grup !== onceki) { p.push([`${GRUP[s.grup].ad}.`, 0.8]); onceki = s.grup; }
    p.push([`${ac(s.ad)}, ${radi(s)}.`, 0.7]);
    p.push(...cumleler(s.kisa)); son(p, 0.6);
    p.push(nokta(`Doğumu: ${temiz(s.dogum)}`), nokta(`Müslüman oluşu: ${temiz(s.musluman)}`), nokta(`Vefatı: ${temiz(s.vefat)}`)); son(p, 0.8);
    for (const [j, h] of s.hayat.entries()) {
        p.push([`${buyuk(sira(j + 1))} kesit. ${nokta(temiz(h.baslik))}`, 0.6]);
        p.push(...cumleler(h.metin)); son(p, 0.7);
        for (const r of h.ayetler || []) { const a = A[r]; p.push(ayetGiris(a), ...cumleler(a.meal)); son(p, 0.6); }
        if (h.ayetNot) { p.push(...cumleler(h.ayetNot)); son(p, 0.7); }
        if (h.hadis) { p.push(`${temiz(h.hadis.ravi)} anlatıyor.`, ...cumleler(h.hadis.metin), `Bu hadisi ${kitaplar(h.hadis.k)} rivayet etmiştir.`); son(p, 0.8); }
    }
    p.push(['Örnek davranış.', 0.5], ...cumleler(s.erdem)); son(p, 0.7);
    if (s.gorusFarki) { p.push(['Bir not.', 0.4], ...cumleler(s.gorusFarki)); son(p, 0.7); }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(s.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + s.id, baslik: s.ad, tur: GRUP[s.grup].ad, parcalar: p });
}
// Denetim: kulak için yazılan metinde rakam, parantez, simge kalmasın
const kalan = [];
for (const d of duraklar) for (const x of d.parcalar) { const t = Array.isArray(x) ? x[0] : x; if (/[0-9()·“”"«»…‘]|Hz\.| b\. /.test(t)) kalan.push(`${d.dosya}: ${t}`); }
if (kalan.length) { console.error('Anlatım metninde okunmaya uygun olmayan ifade kaldı:\n  ' + kalan.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(here, 'sahabe-anlatim.json'), JSON.stringify({ _aciklama: 'Sahabe Hayatları sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt (giris ve her sahabi için <sıra>-<id>). Her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni seslendirilmez, meali okunur. Bu dosya tools/sahabe-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Sahabe Hayatları' }), duraklar }, null, 1) + '\n');
console.log(`tools/sahabe-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
