// Ayet Ayet Arapça — sesli anlatım metni üretici
// --------------------------------------------
// docs/arapca/veri/ ders paketlerinden, ekranda gösterilmeyen ve seslendirilmek üzere hazırlanan Türkçe
// anlatım metnini üretir (CLAUDE.md, 6. bölüm; plan: planlar/ayet-ayet-arapca.md).
// - Yalnızca yetişkin profili (erkek sesi); çocuk teması yalnızca görünümdür.
// - Sesler ayrı depoya yazılır: ayarlar.cikis (../arapca-ses), yayın adresi /arapca-ses/.
// - Her sayfa bir kayıttır (c01/s002); ayetler kayıt içinde bölümdür ({ "bolum": "2:2" }), ayet kartı
//   o bölümü çalar. Satır anlatımı yapılmaz. Bütün uygulama için tek "tam" kayıt yoktur.
// - Arapça metin ve ayetin okunuşu seslendirilmez; Arapçanın sesi yalnızca kâri kaydından gelir.
//   Anlatımda Türkçe meal, kelimenin anlamı, Türkçedeki akrabaları ve dil bilgisi açıklaması okunur.
// Kullanım:  node tools/arapca-anlatim.mjs   →  tools/arapca-anlatim.json
//            python3 tools/tts/seslendir.py arapca   (yalnızca bu bilgisayarda)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const VERI = path.join(here, '..', 'docs', 'arapca', 'veri');
const oku = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const IDX = oku(path.join(VERI, 'indeks.json'));
const sureAd = (s) => IDX.sureler[s - 1];

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const yuzler = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const sayi = (n) => { if (!n) return 'sıfır'; const b = Math.floor(n / 1000), k = n % 1000; return [b ? (b > 1 ? yuzler(b) + ' ' : '') + 'bin' : '', yuzler(k)].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü', bin: 'bininci' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const ARAPCA = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
// Ekrandaki metni kulak için temizler: parantez virgüle, sayılar yazıya, tırnak ve simgeler dışarı.
const ROMA = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10 };
const ac = (t) => String(t).replace(/\b(I{1,3}|IV|VI{0,3}|IX|X)\. kalıp/g, (m, r) => sira(ROMA[r]) + ' kalıp').replace(/\s+\/\s+/g, ' ya da ').replace(/\s*\(s\.a\.v\.\)/g, ' sallallahu aleyhi ve sellem').replace(/\bHz\.\s*/g, 'Hazreti ');
const temiz = (t) => ac(t).replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/\s*\[([^\]]*)\]/g, ', $1,')
    .replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"…‘’]/g, (c) => (c === '‘' || c === '’' ? "'" : '')).replace(/\s*[·•]\s*/g, ', ')
    .replace(/\b(\d{1,4})\b/g, (m) => sayi(+m)).replace(/\s*;\s*/g, ', ').replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ'])/).map((s) => nokta(s.trim())).filter((s) => s.length > 1);
const buyuk = (t) => t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
const ilk = (s) => String(s || '').split(';')[0].trim();
const liste = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' ve ' + a[a.length - 1] : a[0]);
const TUR = { edat: 'Edat', ek: 'Ek', kalip: 'Kalıp', deyim: 'Deyim', dilbilgisi: 'Dil bilgisi' };

function ogeAnlatim(o) {
    const p = [[`${TUR[o.tur]}. ${nokta(temiz(o.ad))}`, 0.5], ...cumleler(o.aciklama)];
    p.push(['Akılda kalsın.', 0.4], [nokta(temiz(o.akilda)), 0.9]);
    return p;
}
function kelimeAnlatim(l, ilkMi) {
    // Arapça yazı içeren anlam parçası (ör. "dişil biçimi …") seslendirilmez
    const anlamlar = String(l.anlam).replace(/\s*\([^)]*\)/g, '').split(/[;,]/).filter((x) => !ARAPCA.test(x)).map((x) => temiz(x)).filter(Boolean);
    // Kısa tutulur (iki cümle): ses hacmi. Not ve ayrıntı ekrandaki kelime kartındadır.
    const ek = anlamlar.slice(1, 3);
    const akr = (l.akraba || []).filter((x) => !ARAPCA.test(x)).map(temiz).slice(0, 3);
    return [
        [`${ilkMi ? 'Yeni kelime' : 'Bir yeni kelime daha'}: ${anlamlar[0]}${ek.length ? ', ayrıca ' + liste(ek) : ''}.`, 0.3],
        [`${l.tur === 'V' ? 'Fiildir' : 'İsimdir'}, Kur'an'da ${sayi(l.sayi)} kez geçer${akr.length ? '. Türkçedeki akrabaları: ' + liste(akr) : ''}.`, 0.8]
    ];
}

const duraklar = [{
    dosya: 'giris', baslik: 'Ayet Ayet Arapça', tur: 'Giriş', parcalar: [
        ['Ayet Ayet Arapça.', 0.8],
        "Bu uygulamada Kur'an'ı mushaf sırasıyla, sayfa sayfa okurken Arapçayı öğreneceksiniz.",
        ['Her sayfanın dersi beş adımdan oluşur.', 0.5],
        'Önce sayfanın tamamını kâriden dinlersiniz. Sonra ayetleri kelime kelime okur, her kelimeye dokunarak anlamını, kökünü ve eklerini görürsünüz.',
        "Üçüncü adımda o sayfada Kur'an'da ilk kez geçen kelimeler, ekler ve dil bilgisi konuları öğretilir. Dördüncü adımda kısa bir alıştırma yaparsınız. Son adımda sayfanın anlam özetini dinlersiniz.",
        'Öğrendikleriniz aralıklı tekrarla, birinci, üçüncü, yedinci, on altıncı ve otuz beşinci günlerde yeniden sorulur.',
        ["Arapça kelimelerin sesi bu anlatımda okunmaz. Arapçayı her zaman kârinin kendi okuyuşundan dinlersiniz.", 0.6],
        ['Başlamadan önce başlangıç dersini okumanızı öneririz. Hayırlı dersler.', 1]
    ]
}];

for (const c of IDX.cuzler.filter((x) => x.yayinda)) {
    const pk = oku(path.join(VERI, `c${String(c.no).padStart(2, '0')}.json`));
    const cz = `c${String(c.no).padStart(2, '0')}`;
    if (pk.baslangic) {
        const p = [['Başlangıç dersi.', 0.8], ...cumleler(pk.baslangic.ozet)];
        p[p.length - 1] = [p[p.length - 1], 0.9];
        for (const id of pk.baslangic.ogeler) p.push(...ogeAnlatim(pk.ogeler[id]));
        p.push(['Akılda kalsın.', 0.4], [nokta(temiz(pk.baslangic.akilda)), 1]);
        duraklar.push({ dosya: `${cz}/s000`, baslik: 'Başlangıç dersi', tur: `${c.no}. cüz`, parcalar: p });
    }
    for (const s of pk.sayfalar) {
        const ilkA = pk.ayetler[s.ayetler[0]], sonA = pk.ayetler[s.ayetler[s.ayetler.length - 1]];
        const aralik = ilkA.s === sonA.s ? `${sureAd(ilkA.s)} Suresi, ${sira(ilkA.a)} ile ${sira(sonA.a)} ayetler` : `${sureAd(ilkA.s)} Suresi ${sira(ilkA.a)} ayetten ${sureAd(sonA.s)} Suresi ${sira(sonA.a)} ayete kadar`;
        const p = [[`${buyuk(sira(s.no))} sayfa.`, 0.5], [`${aralik}.`, 0.8]];
        // yeni ögeler örneklerinin geçtiği ayetin ardından anlatılır
        const ayetinde = {};
        for (const id of s.kelime) (ayetinde[pk.sozluk[id].ornek.split(':').slice(0, 2).join(':')] ||= []).push(id);
        for (const id of s.ogeler) (ayetinde[pk.ogeler[id].ornek.split(':').slice(0, 2).join(':')] ||= []).push(id);
        for (const k of s.ayetler) {
            const a = pk.ayetler[k];
            p.push({ bolum: k });
            if (a.a === 1) p.push([`${sureAd(a.s)} Suresi.`, 0.6]);
            p.push([`${buyuk(sira(a.a))} ayet.`, 0.4]);
            if (a.mg) p.push(['Bu ayetin meali, önceki ayetle birlikte verilmiştir.', 0.6]);
            else { const m = cumleler(a.meal); m[m.length - 1] = [m[m.length - 1], 0.9]; p.push(...m); }
            let ilkMi = true;
            for (const id of ayetinde[k] || []) {
                if (id[0] === 'l') { p.push(...kelimeAnlatim(pk.sozluk[id], ilkMi)); ilkMi = false; }
                else p.push(...ogeAnlatim(pk.ogeler[id]));
            }
        }
        // Sayfa özeti seslendirilmez (ayetlerin meali zaten okundu; özet ekranda); yalnızca Akılda kalsın.
        p.push({ bolum: 'akilda' }, ['Bu sayfadan akılda kalsın.', 0.4], [nokta(temiz(s.akilda)), 1]);
        duraklar.push({ dosya: `${cz}/s${String(s.no).padStart(3, '0')}`, baslik: `${s.no}. sayfa`, tur: `${c.no}. cüz`, parcalar: p });
    }
}

// Denetim: Arapça harf, rakam, parantez ve simge kalmamalı
for (const d of duraklar) for (const x of d.parcalar) {
    if (x && !Array.isArray(x) && typeof x === 'object') continue;
    const t = Array.isArray(x) ? x[0] : x;
    if (ARAPCA.test(t) || /[0-9()[\]{}<>#*_|]/.test(t)) { console.error(`arapca-anlatim: ${d.dosya}: seslendirilemeyecek metin: ${t}`); process.exit(1); }
}

const cikti = {
    _aciklama: "Ayet Ayet Arapça sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modelle tools/tts/seslendir.py ile üretilir; bu uygulamada yalnızca yetişkin profili (erkek sesi) vardır, çocuk teması yalnızca görünümdür. Kayıtlar ayrı ses deposuna yazılır (ayarlar.cikis; yayın adresi /arapca-ses/). Her sayfa bir kayıttır; { bolum } işaretleri ayetlerin kayıttaki yerini kayitlar.json'a yazdırır. Arapça metin ve okunuş seslendirilmez; Diyanet meali, kelimenin anlamı ve dil bilgisi açıklaması okunur; sayfa özeti okunmaz (ekranda). Ses 24 kbps (ayarlar.kbps). Bu dosya tools/arapca-anlatim.mjs ile üretilir; elle düzenlemeyin.",
    ayarlar: { profiller: ['yetiskin'], cikis: '../arapca-ses', kbps: 24 },
    duraklar
};
fs.writeFileSync(path.join(here, 'arapca-anlatim.json'), JSON.stringify(cikti, null, 1) + '\n');
const cumle = duraklar.reduce((t, d) => t + d.parcalar.filter((x) => typeof x === 'string' || Array.isArray(x)).length, 0);
console.log(`tools/arapca-anlatim.json: ${duraklar.length} kayıt, ${cumle} cümle`);
