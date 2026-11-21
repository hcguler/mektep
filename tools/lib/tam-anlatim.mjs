// Tam anlatım kaydı (CLAUDE.md, 6. bölüm)
// --------------------------------------------
// Bir uygulamanın bütün durakları, sırayla, tek kayıtta. Metin duraklardan türetilir; yeni bilgi
// eklenmez. İsteğe bağlı `acilis` parçaları başa eklenir (giriş durağı olmayan uygulamalar için
// yalnızca uygulamanın adı ve konusu). Duraklar arasında en az `ara` saniye sessizlik bırakılır.
// Tema kayıtları (`cocuk/…` gibi) tam anlatıma girmez; çocuk profili aynı metni kadın sesle okur.

export function tamAnlatim(duraklar, { baslik, acilis = [], ara = 1.6 }) {
    const liste = duraklar.filter((d) => !d.dosya.includes('/'));
    const parcalar = [...acilis];
    liste.forEach((d, n) => d.parcalar.forEach((p, i) => {
        if (i < d.parcalar.length - 1 || n === liste.length - 1) return parcalar.push(p);
        const [metin, sure = 0] = Array.isArray(p) ? p : [p];
        parcalar.push([metin, Math.max(sure, ara)]);
    }));
    return { dosya: 'tam', baslik: `${baslik}: tam anlatım`, tur: 'Tam anlatım', duraklar: liste.map((d) => d.dosya), parcalar };
}
