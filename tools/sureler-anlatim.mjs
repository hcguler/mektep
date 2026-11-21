// Sureler Atlası — sesli anlatım metni üretici
// --------------------------------------------
// docs/sureler/kunye.js, data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek
// üzere hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py
// ile yalnızca bu bilgisayarda üretilir. Duraklar: giris + konu özeti yazılmış her sure (001-fatiha).
// Arapça ayet metni seslendirilmez; meali okunur. Sure adları okunuşa göre yazılır (şapka ve uzatma
// işaretleri kaldırılır). Tam anlatım yalnızca özeti yazılmış sureleri içerir.
// Kullanım:  node tools/sureler-anlatim.mjs   →  tools/sureler-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'sureler');
const sb = { window: {} };
for (const f of ['kunye.js', 'data.js', 'ayetler.js']) vm.runInNewContext(fs.readFileSync(path.join(root, f), 'utf8'), sb);
const K = sb.window.SURE_KUNYE, D = sb.window.SURE_DATA, A = sb.window.SURE_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ') || 'sıfır'; };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
// Okunuş: ayn (‘) ve kelime sonundaki hemze (’) işaretleri kaldırılır; sure adlarında şapka (â î û) ve
// uzatma (ā ī ū) işaretleri de kaldırılır. Arapça okunuş geçen ifadeler sözlükle Türkçesine çevrilir.
const OKUNUS = { 'Âyetü’l-kürsî': 'Ayetel Kürsi', 'Ashâb-ı Kehf': 'Ashab-ı Kehf', '“Elhamdü lillâhi rabbi’l-âlemîn”, yani Fâtiha suresi': 'Fatiha suresi', 'Âl-i İmrân': 'Ali İmran', 'Mü’minûn': 'Müminun', 'Mü’min': 'Mümin', 'Hel etâ': 'Hel eta' };
const sozluk = (t) => { let s = String(t); for (const [a, b] of Object.entries(OKUNUS)) s = s.split(a).join(b); return s.replace(/‘/g, '').replace(/’(?!\p{L})/gu, ''); };
const oku = (t) => sozluk(t).normalize('NFD').replace(/[\u0302\u0304]/g, '').normalize('NFC');
const ad = (k) => oku(k.ad).replace(/’$/, '');
const ac = (t) => sozluk(t).replace(/\bHz\.\s*/g, 'Hazreti ').replace(/ b\. /g, ' bin ');
const temiz = (t) => ac(t).replace(/\.”\s+(?=[a-zçğıöşü])/g, ',” ').replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"…]/g, '').replace(/([.!?])\.+/g, '$1').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(nokta(t)).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const ayetGiris = (a, k) => { const [x, y] = String(a.no).split('-').map(Number); return y ? `${ad(k)} Suresi, ${sira(x)} ${y - x === 1 ? 've' : 'ile'} ${sira(y)} ${y - x === 1 ? 'ayetlerin' : 'ayetler arasının'} anlamı şöyledir.` : `${ad(k)} Suresi, ${sira(x)} ayetin anlamı şöyledir.`; };
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhari ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhari'; };
const slug = (s) => s.toLocaleLowerCase('tr').replace(/[’‘'`]/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ozetli = K.filter((k) => D.ozetler[k.no]);
const guclu = Object.values(D.ihtilaf).filter((x) => x.derece === 'guclu').length;
const duraklar = [{ dosya: 'giris', baslik: 'Sureler Atlası', tur: 'Giriş', parcalar: [
    ['Sureler Atlası.', 0.8],
    'Kur’an-ı Kerim’de yüz on dört sure vardır.', ['Toplam ayet sayısı altı bin iki yüz otuz altıdır.', 0.6],
    'Bu atlasta her surenin adını, Mekke’de mi Medine’de mi indiğini, iniş sırasını ve ayet sayısını bulacaksınız.',
    [ozetli.length === K.length ? 'Her surenin konusunu, öne çıkan bir ayetini ve akılda kalacak bir cümlesini anlatacağız.' : `${buyuk(sayi(ozetli.length))} surenin konusunu, öne çıkan bir ayetini ve akılda kalacak bir cümlesini anlatacağız.`, 0.6],
    'İniş yeri ve iniş sırası Tanzil verisine göredir. İniş sırası geleneksel bir listeye dayanır, yaklaşık kabul edilmelidir.',
    [`${buyuk(sayi(guclu))} surenin Mekke’de mi Medine’de mi indiği konusunda âlimler arasında belirgin bir görüş farkı vardır.`, 1]] }];

for (const k of ozetli) {
    const o = D.ozetler[k.no], ih = D.ihtilaf[k.no], p = [];
    p.push([`${ad(k)} Suresi.`, 0.7]);
    p.push(`Adının anlamı: ${temiz(o.anlam).toLocaleLowerCase('tr')}.`);
    const ay = `${buyuk(sayi(k.ayet))} ayettir`, sr = `iniş sırasına göre ${sira(k.inis)} suredir`;
    if (ih && ih.derece === 'guclu') p.push('Mekke’de mi Medine’de mi indiği konusunda âlimler arasında farklı görüş vardır.', `${ay}, ${sr}.`);
    else p.push(`${k.tur === 'mekki' ? 'Mekke’de' : 'Medine’de'} inmiştir. ${ay}, ${sr}.`);
    son(p, 0.7);
    p.push(...cumleler(o.konu)); son(p, 0.8);
    const a = A[o.oneCikan];
    p.push(ayetGiris(a, k), ...cumleler(a.meal)); son(p, 0.8);
    if (o.hadis) {
        const h = o.hadis;
        p.push(h.soz ? `${temiz(h.ravi)} rivayet ediyor. Peygamberimiz şöyle buyurmuştur.` : `${temiz(h.ravi)} anlatıyor.`, ...cumleler(h.metin), `Bu hadisi ${kitaplar(h.k)} rivayet etmiştir.`); son(p, 0.8);
    }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(o.akilda)), 1]);
    duraklar.push({ dosya: String(k.no).padStart(3, '0') + '-' + slug(k.ad), baslik: `${k.ad} Suresi`, tur: `${buyuk(sira(k.cuz[0]))} cüz`, parcalar: p });
}
// Metin denetimi: rakam, parantez, emoji ve kısaltma kalmasın
const hata = [];
for (const d of duraklar) for (const x of d.parcalar) { const t = Array.isArray(x) ? x[0] : x; if (/[0-9()\[\]{}]|\p{Extended_Pictographic}|\bHz\.|\bb\. /u.test(t)) hata.push(`${d.dosya}: ${t}`); }
if (hata.length) { console.error('Anlatım metninde okunmayacak işaret:\n  ' + hata.join('\n  ')); process.exit(1); }

fs.writeFileSync(path.join(here, 'sureler-anlatim.json'), JSON.stringify({ _aciklama: 'Sureler Atlası sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. Bu uygulamada tek tam kayıt yoktur (114 sure 1,5–2 saat sürerdi; kullanıcı kararı 16.11.2026); ana ekranda giriş çalar, sureler “sırayla dinle” ile arka arkaya çalar. duraklar: giriş ve konu özeti yazılmış her sure ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça ayet metni seslendirilmez, meali okunur. Bu dosya tools/sureler-anlatim.mjs ile üretilir; elle düzenlemeyin.', duraklar }, null, 1) + '\n');
console.log(`tools/sureler-anlatim.json yazıldı: ${duraklar.length} kayıt (giriş + ${ozetli.length} sure), ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
