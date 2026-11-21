// Kur'an'dan Mucizeler — sesli anlatım metni üretici
// --------------------------------------------------
// docs/mucizeler/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan
// Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu
// bilgisayarda üretilir. Arapça ayet metni, anahtar ifade ve okunuş seslendirilmez; meali okunur.
// "Hz." → "Hazreti"; sayılar yazıyla; parantez, simge ve emoji yok.
// Duraklar: giris · her mucize <sıra>-<id> (01-rum … 12-ayrilma) · olcu. Ayrıca tam.
// Kullanım:  node tools/mucizeler-anlatim.mjs   →  tools/mucizeler-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'mucizeler');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.MUCIZE_DATA, A = sb.window.MUCIZE_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const yuzler = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const sayi = (n) => { if (n === 0) return 'sıfır'; const k = Math.floor(n / 1000), r = n % 1000; return [k ? (k > 1 ? yuzler(k) + ' ' : '') + 'bin' : '', yuzler(r)].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
// Kısaltmalar, adlar ve okunuş işaretleri
const ac = (t) => String(t)
    .replace(/\bHz\.\s*/g, 'Hazreti ')
    .replace(/(\d{4})’lerde/g, (m, y) => sayi(+y).replace(/yirmi$/, 'yirmili') + ' yıllarda')
    .replace(/\bi‘câz/g, 'icaz')
    .replace(/\b(\d{1,4})’(?=[a-zçğıöşü])/g, (m, y) => sayi(+y))
    .replace(/ yılında \((\d{3,4})\)/g, (m, y) => ` yılında, yani ${sayi(+y)} yılında,`)
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
const liste = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' ve ' + a[a.length - 1] : a[0]);

const T = D.mucizeler.length;
const GRUP = Object.fromEntries(D.gruplar.map((g) => [g.id, g]));
const sayiliGrup = (g) => sayi(D.mucizeler.filter((m) => m.grup === g.id).length);
const duraklar = [{ dosya: 'giris', baslik: 'Kur’an’dan Mucizeler', tur: 'Giriş', parcalar: [
    ['Kur’an’dan Mucizeler.', 0.8],
    ...cumleler(D.giris),
    [`Önce ${sayiliGrup(D.gruplar[0])} haber, sonra ${sayiliGrup(D.gruplar[1])} ayet dinleyeceğiz.`, 0.6],
    'Her sayfada ayetin anlamını, ayetin ne bildirdiğini ve ardından ya gerçekleşen olayı ya da bugünkü bilgiyi öğreneceğiz.',
    'Ayetlerin anlamı, Diyanet İşleri Başkanlığı mealinden okunur.',
    ...cumleler(D.olcu)] }];
son(duraklar[0].parcalar, 1);
let onceki = null;
for (const [i, m] of D.mucizeler.entries()) {
    const p = [];
    if (m.grup !== onceki) { p.push([nokta(ac(GRUP[m.grup].ad)), 0.8]); onceki = m.grup; }
    const sureler = [...new Set(m.ayetler.map((r) => ac(A[r].sure)))];
    p.push([nokta(temiz(m.ad)), 0.7]);
    p.push(...cumleler(m.kisa));
    p.push(`Bu, ${liste(sureler)} ${sureler.length > 1 ? 'surelerinde' : 'suresinde'} anlatılır.`);
    son(p, 0.7);
    for (const r of m.ayetler) { const a = A[r]; p.push(ayetGiris(a), ...cumleler(a.meal)); son(p, 0.7); }
    p.push(['Ayet ne bildiriyor?', 0.5]);
    for (const x of m.aciklama) p.push(...cumleler(x));
    son(p, 0.7);
    if (m.grup === 'gelecek') {
        p.push(['Ne oldu?', 0.5]);
        for (const x of m.gerceklesme) p.push(...cumleler(x));
        son(p, 0.7);
    } else {
        p.push(['Bugün bildiğimiz.', 0.5]);
        for (const x of m.bugun) p.push(...cumleler(x));
        son(p, 0.6);
        p.push(['Yorum notu.', 0.4], ...cumleler(m.yorum));
        son(p, 0.7);
    }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(m.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + m.id, baslik: m.ad, tur: GRUP[m.grup].ad, parcalar: p });
}
{
    const p = [['Bu sayfalar nasıl okunmalı?', 0.8],
        'Birinci ölçü: yalnızca Kur’an. Mucizeler Kur’an ayetlerinden seçildi. Hadis rivayetlerine dayanan mucizeler bu uygulamada yer almaz.',
        'İkinci ölçü: gelecekten haberler. Bunlar, ayetin indiği gün henüz olmamış, sonra gerçekleşmiş olaylardır. Gerçekleşmeyi anlatan tarih bilgisi ayrıca verilir.',
        ['Üçüncü ölçü: o gün bilinmeyenler.', 0.3], ...cumleler(D.olcu),
        'Dördüncü ölçü: klasik tefsir de söylenir. Müfessirlerin ayeti nasıl anladığı yorum notunda yer alır; çağdaş yorumla ayrıldığı yer açıkça belirtilir.',
        'Türkiye Diyanet Vakfı İslâm Ansiklopedisi, Kur’an’ın benzerinin getirilemeyişini ve gelecekten verdiği haberleri icazın yönleri arasında sayar; bilimsel icazı ise yirminci yüzyılda öne çıkan, bazı âlimlerin benimsediği bir yorum olarak aktarır.'];
    son(p, 1);
    duraklar.push({ dosya: 'olcu', baslik: 'Ölçü', tur: 'Ölçü', parcalar: p });
}
// Denetim: kulak için yazılan metinde rakam, parantez, simge, kısaltma kalmasın
const kalan = [];
for (const d of duraklar) for (const x of d.parcalar) { const t = Array.isArray(x) ? x[0] : x; if (/[0-9()·“”"«»…‘āīū]|Hz\.| b\. |[؀-ۿ]/.test(t)) kalan.push(`${d.dosya}: ${t}`); }
if (kalan.length) { console.error('Anlatım metninde okunmaya uygun olmayan ifade kaldı:\n  ' + kalan.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(here, 'mucizeler-anlatim.json'), JSON.stringify({ _aciklama: 'Kur’an’dan Mucizeler sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt (giris, her mucize için <sıra>-<id>, olcu). Her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni, anahtar ifade ve okunuş seslendirilmez, meali okunur. Bu dosya tools/mucizeler-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Kur’an’dan Mucizeler' }), duraklar }, null, 1) + '\n');
console.log(`tools/mucizeler-anlatim.json yazıldı: ${duraklar.length} kayıt (${duraklar.map((d) => d.dosya).join(', ')}), ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
