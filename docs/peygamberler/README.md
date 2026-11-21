# Peygamberler Yolculuğu

Kur'an'da adı geçen yirmi beş peygamber: Kur'an'daki kıssaları, kavimleri, hayatlarından olaylar ve
bıraktıkları ders; her bilgi bir ayete dayanır. Ana kaynak Kur'an'dır.
Yayın adresi: https://hcguler.github.io/mektep/peygamberler/

## Bölümler

- **Yolculuk:** Giriş ayetleri (Nisâ 164-165, Bakara 285, Yûsuf 111) ve Hz. Âdem'den Hz. Muhammed'e
  yirmi beş duraklı yol; gezilen duraklar işaretlenir.
- **Peygamber sayfası:** Kur'an'daki yazılışıyla Arapça ad, kavim ve yer (yalnızca Kur'an'da geçiyorsa),
  Kur'an'a göre kısa özet, ayetiyle olaylar (Arapça ve anlam ayrı ayrı açılıp kapanır), öne çıkan ayet,
  aile bağları, Akılda kalsın, kaynak.
- **Aile:** Yalnızca Kur'an'ın açıkça bildirdiği baba, oğul ve kardeş bağları; her bağ ayetiyle.
- **Bil bakalım:** Olaylardan sorular, üç seçenek; cevaptan sonra ilgili ayetin anlamı gösterilir.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `peygamberler.css`, `peygamberler.js` | Uygulama. |
| `data.js` | Türkçe içerik: özet, olaylar, sorular, aile bağları, Akılda kalsın ve ayet numaraları. Elle düzenlenir. |
| `adlar.js`, `ayetler.js` | Arapça adlar ve ayetler. **Elle düzenlenmez**; `node tools/peygamberler-uret.mjs` üretir. |

`tools/peygamberler-anlatim.mjs` gizli anlatım metnini (tam + parçalı, `tools/peygamberler-anlatim.json`) üretir.
İçerik değişince sırasıyla `node tools/peygamberler-uret.mjs`, `node tools/peygamberler-anlatim.mjs`,
`node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Ayetler:** Tanzil (Simple) ve Diyanet İşleri meali (Tanzil, tr.diyanet), `tools/lib/tanzil-ayetler.mjs`
  ile; birleşik mealler aralık olarak gösterilir. Olaylardaki tırnaklı sözler mealin kendi ifadeleridir;
  olay metinleri üretilen meallerle tek tek karşılaştırılmıştır.
- **Arapça adlar:** Her peygamberin adının geçtiği ayetten (`adAyet`), Tanzil metninden değiştirilmeden
  alınır; üretici adın o ayette bulunduğunu denetler (ön ekler و ف ب ل ayrılır, hareke korunur).
- **Kapsam:** Kur'an dışı tarih, yaş, mezar yeri ya da soy bilgisi verilmez. Sıralama yaygın sıralamadır;
  Kur'an bütün peygamberler için kesin bir tarih sırası vermez. Üzeyr, Lokmân ve Zülkarneyn'in
  peygamberliği tartışmalı olduğu için yirmi beşe katılmamıştır; bu durum Kaynaklar panelinde yazılıdır.
- **Notlar:** Hz. İsmâil sayfasındaki Sâffât 102-107 notu (kurban edilmek istenen oğlun ayette adının
  geçmediği) ve Hz. Muhammed sayfasındaki ilk inen ayetler notu âlimlerin çoğunluğunun görüşüdür.
- **Doğrulanmadı:** "Akılda kalsın" cümleleri ve kısa özetler ayetlerden yazılmış yorum cümleleridir;
  Diyanet ya da TDV yayınlarıyla çevrimiçi karşılaştırılamamıştır.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (gezilen duraklar, son durak,
görünüm tercihleri, en iyi sonuç) `peygamberler:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py peygamberler` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
