// Ortak ayet üretici: Tanzil Arapça metni (Simple) ve Diyanet İşleri meali (Tanzil, tr.diyanet)
// --------------------------------------------
// Bir uygulamanın data.js dosyasındaki ayet numaralarından ayetler.js üretir.
// Numara "sure:ayet" ya da aralık "sure:ilk-son" olabilir.
//
// Bu mealde bazı ayet grupları tek metin hâline getirilmiştir (ör. Mutaffifîn 1-3 için
// üç ayette de aynı meal yazar). Böyle bir ayet tek başına verilirse üretici durur ve
// aralığın tamamının yazılmasını ister; böylece bir ayete, ona ait olmayan bir anlam yüklenmez.
//
// Kaynak dosyalar fawazahmed0/quran-api deposunun GitHub aynasından indirilir:
//   ara-quransimple (Tanzil Simple) · tur-diyanetisleri (Tanzil tr.diyanet)
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/';
const BESMELE = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
export const SURE = ['', 'Fâtiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide', 'En‘âm', 'A‘râf', 'Enfâl', 'Tevbe', 'Yûnus', 'Hûd', 'Yûsuf', 'Ra‘d', 'İbrâhîm', 'Hicr', 'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâhâ', 'Enbiyâ', 'Hac', 'Mü’minûn', 'Nûr', 'Furkān', 'Şuarâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm', 'Lokmân', 'Secde', 'Ahzâb', 'Sebe’', 'Fâtır', 'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü’min', 'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye', 'Ahkāf', 'Muhammed', 'Fetih', 'Hucurât', 'Kāf', 'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân', 'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine', 'Saf', 'Cuma', 'Münâfikūn', 'Teğâbün', 'Talâk', 'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Meâric', 'Nûh', 'Cin', 'Müzzemmil', 'Müddessir', 'Kıyâme', 'İnsân', 'Mürselât', 'Nebe’', 'Nâziât', 'Abese', 'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikāk', 'Bürûc', 'Târık', 'A‘lâ', 'Gāşiye', 'Fecr', 'Beled', 'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn', 'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât', 'Kāria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl', 'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr', 'Tebbet', 'İhlâs', 'Felak', 'Nâs'];

export async function edition(name, dir) {
    if (dir && fs.existsSync(path.join(dir, name + '.json'))) return JSON.parse(fs.readFileSync(path.join(dir, name + '.json'), 'utf8')).quran;
    const res = await fetch(BASE + name + '.json');
    if (!res.ok) throw new Error(name + ' indirilemedi: ' + res.status);
    return (await res.json()).quran;
}

export function parseRef(ref) {
    const m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(ref);
    if (!m) throw new Error('Geçersiz ayet numarası: ' + ref);
    return { s: +m[1], a: +m[2], b: +(m[3] || m[2]) };
}

export async function buildAyetler({ refs, outFile, globalName, srcDir }) {
    const [ar, tr] = await Promise.all([edition('ara-quransimple', srcDir), edition('tur-diyanetisleri', srcDir)]);
    const idx = (list) => Object.fromEntries(list.map((x) => [x.chapter + ':' + x.verse, x.text.trim()]));
    const A = idx(ar), T = idx(tr);
    const out = {};
    const sorted = [...new Set(refs)].sort((x, y) => { const p = parseRef(x), q = parseRef(y); return p.s - q.s || p.a - q.a; });
    for (const ref of sorted) {
        const { s, a, b } = parseRef(ref);
        // Birleşik meal denetimi: aralığın dışındaki komşu ayet aynı meali taşıyorsa dur.
        const before = T[`${s}:${a - 1}`], after = T[`${s}:${b + 1}`];
        if ((before && before === T[`${s}:${a}`]) || (after && after === T[`${s}:${b}`])) {
            let x = a, y = b;
            while (T[`${s}:${x - 1}`] === T[`${s}:${a}`]) x--;
            while (T[`${s}:${y + 1}`] === T[`${s}:${b}`]) y++;
            throw new Error(`${ref}: bu mealde ${s}:${x}-${y} tek metin hâlindedir; data.js içinde "${s}:${x}-${y}" yazın.`);
        }
        const arParts = [], mealParts = [];
        for (let v = a; v <= b; v++) {
            const k = `${s}:${v}`;
            if (!A[k] || !T[k]) throw new Error('Ayet bulunamadı: ' + k);
            let t = A[k];
            if (v === 1 && s !== 1 && s !== 9) t = besmelesiz(t);
            arParts.push(`${t} ﴿${v.toLocaleString('ar-EG')}﴾`);
            if (!mealParts.length || mealParts[mealParts.length - 1].text !== T[k]) mealParts.push({ v, text: T[k] });
        }
        out[ref] = { sure: SURE[s], no: a === b ? String(a) : `${a}-${b}`, ar: a === b ? (a === 1 && s !== 1 && s !== 9 ? besmelesiz(A[`${s}:${a}`]) : A[`${s}:${a}`]) : arParts.join(' '), meal: mealParts.length > 1 ? mealParts.map((m) => `(${m.v}) ${m.text}`).join(' ') : mealParts[0].text };
    }
    const body = `// Bu dosya tools/lib/tanzil-ayetler.mjs ile üretilir; elle düzenlemeyin.
// Arapça: Tanzil Quran Text (Simple), değiştirilmeden. Meal: Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet).
window.${globalName} = ${JSON.stringify(out, null, 1)};
`;
    fs.writeFileSync(outFile, body);
    return Object.keys(out).length;
}
// Kaynakta harekelerin sırası (şedde + fetha) Unicode NFC sırasından farklıdır; karşılaştırma NFC ile yapılır.
// Yalnızca sıra farklı olduğundan uzunluk aynıdır; kaynak metin değiştirilmeden baştaki besmele kesilir.
function besmelesiz(t) { return t.normalize('NFC').startsWith(BESMELE.normalize('NFC')) ? t.slice(BESMELE.length) : t; }
