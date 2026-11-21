// Oruç Rehberi — sesli anlatım metni üretici
// --------------------------------------------
// docs/oruc/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan
// Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu
// bilgisayarda üretilir. Arapça metin ve okunuş anlatıma girmez; ayetin Diyanet meali ve duanın anlamı okunur.
// Hüküm rozeti cümleye çevrilir ("Bu durum orucu bozar ve kaza gerektirir.").
// Kullanım:  node tools/oruc-anlatim.mjs   →  tools/oruc-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'oruc');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.ORUC_DATA, A = sb.window.ORUC_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const yuzler = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const sayi = (n) => { const b = Math.floor(n / 1000), r = n % 1000; return [b ? (b > 1 ? yuzler(b) + ' ' : '') + 'bin' : '', yuzler(r)].filter(Boolean).join(' ') || 'sıfır'; };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const tarih = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${sayi(d)} ${AYLAR[m - 1]} ${sayi(y)}`; };
// Okunuş: Sa‘d → Saad (ayn atılınca "Sad" okunuyordu); kalan ayn işareti (Rebî‘) okunmaz.
const ac = (t) => String(t).replace(/Sa[‘’']d\b/g, 'Saad').replace(/‘/g, '').replace(/\bHz\.\s*/g, 'Hazreti ').replace(/ b\. /g, ' bin ').replace(/Resûlullah/g, 'Resûlullah sallallahu aleyhi ve sellem')
    .replace(/\bDİYK\b/g, 'Din İşleri Yüksek Kurulu').replace(/(^|\s)TL(?=[\s.,;]|$)/g, '$1Türk lirası');
const temiz = (t) => ac(t).replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1')
    .replace(/[«»“”"…]/g, '').replace(/\b(\d{1,4})\b/g, (m) => sayi(+m)).replace(/\s*·\s*/g, ', ').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?][”"’]*$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const son = (p, s) => { const x = p[p.length - 1]; p[p.length - 1] = [Array.isArray(x) ? x[0] : x, s]; };
const kitaplar = (k) => { const s = [...new Set(k.map((x) => x[0]))]; return s.length > 1 ? 'Buhârî ve Müslim' : s[0] === 'm' ? 'Müslim' : 'Buhârî'; };
const ESER = { d: 'Ebû Dâvûd', t: 'Tirmizî' };
const BOL = Object.fromEntries(D.bolumler.map((b) => [b.id, b]));

const duraklar = [{ dosya: 'giris', baslik: 'Oruç Rehberi', tur: 'Giriş', parcalar: [
    ['Oruç Rehberi.', 0.8],
    ['Ramazan orucunu ve nafile oruçları, kaynağıyla birlikte öğreneceğiz.', 0.6],
    'Her konuda önce hükmü, sonra kısa açıklamayı, varsa ayetin mealini ve Peygamberimizin sahih hadisini dinleyeceksiniz.',
    'Hükümler Diyanet İşleri Başkanlığının yayınlarına ve Din İşleri Yüksek Kurulunun kararlarına dayanır.',
    ['Kendi durumunuz için müftülüğe, sağlıkla ilgili konularda doktorunuza danışın.', 1]] }];
let onceki = null;
for (const [i, k] of D.konular.entries()) {
    const p = [];
    if (k.bolum !== onceki) { p.push([`${BOL[k.bolum].ad}.`, 0.8]); onceki = k.bolum; }
    p.push([nokta(temiz(k.ad)), 0.5]);
    if (k.hukum) p.push([D.hukumler[k.hukum].cumle, 0.6]);
    k.aciklama.forEach((a) => p.push(...cumleler(a)));
    son(p, 0.8);
    if (k.ornek) { p.push(`Örnek: ${nokta(temiz(k.ornek))}`); son(p, 0.6); }
    if (k.mezhep) { p.push(...cumleler(k.mezhep)); son(p, 0.6); }
    if (k.saglik) { p.push('Sağlıkla ilgili durumlarda doktorunuza ve müftülüğe danışın.'); son(p, 0.6); }
    if (k.deger) {
        const v = D.degerler[k.deger];
        p.push(v && v.tutar != null
            ? `Din İşleri Yüksek Kurulu, ${tarih(v.tarih)} tarihinde ${temiz(v.ne)} için en az ${sayi(v.tutar)} Türk lirası belirledi. Bu tutar ${temiz(v.donem)} geçerlidir.`
            : 'Güncel tutar için Diyanetin açıklamasına bakın.');
        son(p, 0.6);
    }
    for (const r of k.ayetler || []) {
        const a = A[r]; if (!a) continue;
        const [x, y] = a.no.split('-').map(Number);
        p.push(`${a.sure} Suresi, ${y ? `${sira(x)} ve ${sira(y)} ayetlerin` : `${sira(x)} ayetin`} anlamı şöyledir.`, ...cumleler(nokta(a.meal.replace(/\(\d+\)\s*/g, ''))));
        son(p, 0.8);
    }
    for (const h of k.hadisler || []) {
        p.push(`${kitaplar(h.k)} rivayet eder. Râvi ${temiz(h.ravi)}.`, ...cumleler(nokta(h.metin))); son(p, 0.8);
    }
    if (k.dua) { p.push('Duanın anlamı şöyledir.', nokta(temiz(k.dua.anlam))); son(p, 0.8); }
    for (const r of k.rivayetler || []) {
        if (k.dua && r.k.some(([kk, no]) => k.dua.kunye === kk + no)) { p.push(`Bu dua ${ESER[r.k[0][0]]} tarafından rivayet edilmiştir.`, cumleler(r.sihhat)[0]); son(p, 0.8); continue; }
        p.push(`${ESER[r.k[0][0]]} rivayet eder. Râvi ${temiz(r.ravi)}.`, ...cumleler(nokta(r.metin)), cumleler(r.sihhat)[0]); son(p, 0.8);
    }
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(k.akilda)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + k.id, baslik: k.ad, tur: BOL[k.bolum].ad, parcalar: p });
}
// Kulak için denetim: rakam, parantez ya da Arapça harf kalmamalı.
for (const d of duraklar) for (const x of d.parcalar) {
    const t = Array.isArray(x) ? x[0] : x;
    if (/[0-9()\[\]«»“”]/.test(t) || /[؀-ۿ]/.test(t)) { console.error(`${d.dosya}: okunamayan karakter: ${t}`); process.exit(1); }
}
fs.writeFileSync(path.join(here, 'oruc-anlatim.json'), JSON.stringify({ _aciklama: 'Oruç Rehberi sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). Arapça metin ve okunuş seslendirilmez; ayetin Diyanet meali ve duanın anlamı okunur. Bu dosya tools/oruc-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Oruç Rehberi' }), duraklar }, null, 1) + '\n');
console.log(`tools/oruc-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
