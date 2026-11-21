// Ezberler — sesli anlatım metni üretici
// --------------------------------------------
// docs/ezberler/data.js içindeki her ezber için, ekranda gösterilmeyen ve ses
// üreticisine verilmek üzere hazırlanmış Türkçe anlatım metnini üretir:
// ad + anlam + kısa tefsir. Arapça metin ve okunuş seslendirilmez.
//
// Çıktı biçimi tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla
// seslendirilen parçalardan oluşur; parça ya bir metindir ya da
// [metin, duraklama] çiftidir (duraklama: parçadan sonraki sessizlik, saniye).
//
// Kullanım:  node tools/ezberler-anlatim.mjs
// Çıktı:     tools/ezberler-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'ezberler');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sandbox);
const DATA = sandbox.window.EZBER_DATA;

// ---- Sayıları yazıya çevirme (0-999) ----
const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
function sayi(n) {
    if (n === 0) return 'sıfır';
    const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10;
    return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' ');
}
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
function sira(n) {
    const w = sayi(n).split(' ');
    w[w.length - 1] = SIRA[w[w.length - 1]];
    return w.join(' ');
}

// ---- Konuşma diline uygun hâle getirme ----
function konus(t) {
    return String(t)
        .replace(/\bHz\.\s*/g, 'Hazreti ')
        .replace(/\sb\.\s/g, ' bin ')
        .replace(/(\d+)\.(?=\s+\p{Ll})/gu, (_, d) => sira(Number(d)))   // "19. ayet" → "on dokuzuncu ayet"
        .replace(/\d+/g, (d) => sayi(Number(d)))
        .replace(/[()“”"]/g, '')
        .replace(/\s*;\s*/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();
}
const cumle = (t) => {
    t = konus(t);
    t = t.charAt(0).toLocaleUpperCase('tr') + t.slice(1);
    return /[.!?]$/.test(t) ? t : t.replace(/[,:]$/, '') + '.';
};
// İçinde Arapça ifade alıntılanan notlar seslendirilmez.
const notOku = (o) => o.not && !/["“”]/.test(o.not);

// Bir paragrafı cümlelere böler; her cümle ayrı bir parçadır.
const cumleler = (t) => cumle(t).split(/(?<=[.!?])\s+/).filter(Boolean);

const duraklar = [];
for (const bolum of DATA.bolumler) {
    for (const o of bolum.ogeler) {
        const p = [];
        const giris = o.tur === 'sure'
            ? [`Kur'an-ı Kerim'in ${sira(o.no)} suresidir.`,
               `${o.yer}'de inmiştir ve ${sayi(o.ayetSayisi)} ayettir.`,
               `Adı, ${konus(o.anlam).toLocaleLowerCase('tr')} anlamına gelir.`]
            : cumleler(o.nezaman);
        // Ad tek başına bir parça olmaz: ses modeli iki üç kelimelik parçaları aceleyle ve bozuk okuyor;
        // ilk cümleyle aynı parçada olunca doğru okunuyor.
        p.push(`${cumle(o.ad)} ${giris[0]}`, ...giris.slice(1));
        if (notOku(o)) p.push(...cumleler(o.not));
        p.push(['Anlamı şöyledir.', 0.6]);
        if (o.tur === 'sure' && o.no !== 1) p.push(konus(DATA.besmele.meal));
        o.satirlar.forEach((s) => p.push(konus(s.meal)));      // her ayet / satır ayrı parça
        p[p.length - 1] = [cumle(p[p.length - 1]), 0.8];
        p.push([o.tur === 'sure' ? 'Kısa tefsiri şöyledir.' : 'Kısa açıklaması şöyledir.', 0.6]);
        p.push(...cumleler(o.tefsir));
        p[p.length - 1] = [p[p.length - 1], 0.8];
        p.push(['Akılda kalsın.', 0.5]);
        p.push(...cumleler(o.akilda));
        duraklar.push({ dosya: o.id, baslik: o.ad, tur: o.tur, parcalar: p });
    }
}

const out = {
    _aciklama: "Ezberler sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt, sırayla seslendirilen parçalardan oluşur. Parça ya bir metindir ya da [metin, duraklama] çiftidir; duraklama o parçadan sonraki sessizliktir (saniye). Arapça metin ve okunuş seslendirilmez. Bu dosya tools/ezberler-anlatim.mjs ile docs/ezberler/data.js içeriğinden üretilir; elle düzenlemeyin.",
    tam: tamAnlatim(duraklar, { baslik: 'Ezberler', acilis: [['Ezberler.', 0.8], ['Kısa sureler, namaz duaları ve zikirler.', 1.2]] }),
    duraklar
};
fs.writeFileSync(path.join(here, 'ezberler-anlatim.json'), JSON.stringify(out, null, 1) + '\n');
const adet = duraklar.reduce((a, d) => a + d.parcalar.length, 0);
console.log(`tools/ezberler-anlatim.json yazıldı: ${duraklar.length} kayıt, ${adet} parça`);
