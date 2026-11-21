// Esmâ-ül Hüsnâ — sesli anlatım metni üretici
// --------------------------------------------
// docs/esma/data.js ve ayetler.js içeriğinden, ekranda gösterilmeyen ve seslendirilmek
// üzere hazırlanan Türkçe anlatım metnini üretir (CLAUDE.md, 6. bölüm). Ses tools/tts/seslendir.py ile yalnızca bu bilgisayarda üretilir.
// İsmin kendisi okunuşuyla söylenir; Arapça ayet metni seslendirilmez, meali okunur.
// Biçim tools/namaz-anlatim.json ile aynıdır.
// Kullanım:  node tools/esma-anlatim.mjs   →  tools/esma-anlatim.json
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tamAnlatim } from './lib/tam-anlatim.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'esma');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'ayetler.js'), 'utf8'), sb);
const D = sb.window.ESMA_DATA, A = sb.window.ESMA_AYETLER;

const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
const sayi = (n) => { const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10; return [y ? (y > 1 ? BIR[y] + ' ' : '') + 'yüz' : '', ON[o], BIR[b]].filter(Boolean).join(' '); };
const SIRA = { bir: 'birinci', iki: 'ikinci', üç: 'üçüncü', dört: 'dördüncü', beş: 'beşinci', altı: 'altıncı', yedi: 'yedinci', sekiz: 'sekizinci', dokuz: 'dokuzuncu', on: 'onuncu', yirmi: 'yirminci', otuz: 'otuzuncu', kırk: 'kırkıncı', elli: 'ellinci', altmış: 'altmışıncı', yetmiş: 'yetmişinci', seksen: 'sekseninci', doksan: 'doksanıncı', yüz: 'yüzüncü' };
const sira = (n) => { const w = sayi(n).split(' '); w[w.length - 1] = SIRA[w[w.length - 1]]; return w.join(' '); };
const temiz = (t) => String(t).replace(/^\(\d+\)\s*/, '').replace(/([^.!?])\s*\(\d+\)\s*/g, '$1. ').replace(/\s*\(([^)]*)\)/g, ', $1,').replace(/,\s*([.,;:!?])/g, '$1').replace(/[«»“”"]/g, '').replace(/\b(\d{1,3})\b/g, (m) => sayi(+m)).replace(/\s+/g, ' ').replace(/,\s*$/, '').trim();
const nokta = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const cumleler = (t) => temiz(t).split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜÂÎÛ])/).map((s) => s.trim()).filter(Boolean);
const ayetGiris = (a) => { const [x, y] = String(a.no).split('-').map(Number); return y ? `${a.sure} Suresi, ${sira(x)} ve ${sira(y)} ayetlerin anlamı şöyledir.` : `${a.sure} Suresi, ${sira(x)} ayetin anlamı şöyledir.`; };

const duraklar = [{
    dosya: 'giris', baslik: 'Esmâ-ül Hüsnâ', tur: 'Giriş',
    parcalar: [['Esmâ-ül Hüsnâ. Allah’ın güzel isimleri.', 0.8], 'Peygamberimiz şöyle buyurmuştur.', ...cumleler(D.hadisler.sahih.metin), ['Bu hadisi Buhârî ve Müslim rivayet etmiştir.', 0.6],
        ...cumleler(`İsimlerin sırası Tirmizî’nin rivayetindeki listeye göredir. ${D.hadisler.liste.not}`).map((t, i, a) => (i === a.length - 1 ? [t, 1] : t))]
}];
for (const [i, x] of D.isimler.entries()) {
    const p = [[`${sira(i + 1).charAt(0).toLocaleUpperCase('tr') + sira(i + 1).slice(1)} isim. ${temiz(x.o)}.`, 0.7], nokta(`Anlamı: ${temiz(x.a).toLocaleLowerCase('tr')}`), ...cumleler(x.t)];
    p[p.length - 1] = [p[p.length - 1], 0.6];
    if (x.ayet) {
        const a = A[x.ayet];
        p.push(ayetGiris(a), ...cumleler(nokta(a.meal)));
        if (x.tur === 'fiil') p.push('Bu isim ayette isim olarak değil, aynı kökten bir fiil ya da kelime olarak geçer.');
        if (x.not) p.push(...cumleler(x.not));
    } else p.push('Bu isim Kur’an’da bu kalıpta geçmez; Tirmizî’nin rivayet ettiği listede yer alır.');
    p[p.length - 1] = [Array.isArray(p[p.length - 1]) ? p[p.length - 1][0] : p[p.length - 1], 0.6];
    p.push(['Akılda kalsın.', 0.5], [nokta(temiz(x.y)), 1]);
    duraklar.push({ dosya: String(i + 1).padStart(2, '0') + '-' + x.o.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’']/g, '').replace(/[^a-z0-9ıçğöşü]+/g, '-').replace(/^-|-$/g, ''), baslik: x.o, tur: 'İsim', parcalar: p });
}
fs.writeFileSync(path.join(here, 'esma-anlatim.json'), JSON.stringify({ _aciklama: 'Esmâ-ül Hüsnâ sesli anlatım metinleri. Yalnızca seslendirme için yazılmıştır; uygulamada gösterilmez. Ses yalnızca bu bilgisayarda, yerel modellerle tools/tts/seslendir.py ile üretilir (yetişkin profili erkek sesi, çocuk profili kadın sesi); bulut TTS kullanılmaz. tam: bütün duraklar sırayla tek kayıtta; duraklar: her durak ayrı kayıt. Biçim tools/namaz-anlatim.json ile aynıdır: her kayıt sırayla seslendirilen parçalardan oluşur; parça ya bir metindir ya da [metin, duraklama] çiftidir (saniye). İsim okunuşuyla söylenir; Arapça ayet metni seslendirilmez, meali okunur. Bu dosya tools/esma-anlatim.mjs ile üretilir; elle düzenlemeyin.', tam: tamAnlatim(duraklar, { baslik: 'Esmâ-ül Hüsnâ' }), duraklar }, null, 1) + '\n');
console.log(`tools/esma-anlatim.json yazıldı: ${duraklar.length} kayıt, ${duraklar.reduce((n, d) => n + d.parcalar.length, 0)} parça`);
