# Kur'an'dan Davranış Modeli

Bir Müslümanın gün boyu karşılaştığı durumlarda nasıl davranacağını ayetlerle anlatan,
temelden ayrıntıya keşfederek öğrenilen statik uygulama.
Yayın adresi: https://hcguler.github.io/mektep/davranis/

## Model

1. **Çatı:** Nahl 90 — adalet, iyilik ve yakınlara bakmak emredilir; hayasızlık, fenalık ve haddi aşmak yasaklanır.
2. **Dört temel ilke:** takva (Haşr 18), ihlas (Beyyine 5), adalet (Mâide 8), ihsan (Bakara 83).
3. **Yedi halka, içten dışa:** Kalbim (Allah ile) · Nefsim (kendimle) · Dilim · Ailem · İnsanlar · Kazancım · Yeryüzü.
4. **72 davranış:** Her biri "yap" ya da "yapma" olarak işaretli; açıklama, ayet(ler), günlük bir durum,
   günün saatleri ve "Akılda kalsın" cümlesiyle.
5. **Günün 24 saati:** Uyanıştan gece muhasebesine on durak; her durakta o an karşılaşılan davranışlar.

## Bölümler

- **Model:** Günün davranışı, çatı ayeti, dört ilke, halka şeması.
- **Günüm:** On duraklı zaman çizelgesi. Davranış sayfasındaki "Bugün buna dikkat ettim" işaretleri burada sayılır; gece yarısı sıfırlanır.
- **Davranışlar:** Arama ve "yap / yapma" süzgeciyle bütün liste.
- **Ne yapardın?:** Günlük durumlardan 10 soruluk test; seçenekler aynı yöndeki başka davranışlardır.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `davranis.css`, `davranis.js` | Uygulama. Derleme adımı yoktur. |
| `data.js` | Bütün içerik: ilkeler, halkalar, saatler, davranışlar, hadisler. Elle düzenlenir. |
| `ayetler.js` | Ayet metinleri ve mealleri. **Elle düzenlenmez**; `node tools/davranis-ayetler.mjs` üretir. |

Depo kökündeki `tools/` klasöründe `davranis-ayetler.mjs` (ayet metinleri), `davranis-anlatim.mjs` ve
`davranis-anlatim.json` (gizli anlatım metni: tam + parçalı) bulunur. `data.js` değişince sırasıyla
`node tools/davranis-ayetler.mjs`, `node tools/davranis-anlatim.mjs` ve `node tools/pwa-surum.mjs` çalıştırılır.

## Kaynaklar ve doğrulama

- **Kur'an metni:** Tanzil Quran Text (Simple), değiştirilmeden; **meal:** Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet).
  İkisi de `tools/lib/tanzil-ayetler.mjs` ile üretilir.
- **Birleşik mealler:** Bu mealde bazı ayet grupları tek metin hâlindedir (ör. Mutaffifîn 1-3, Kalem 10-14,
  Hümeze 1-2, Mâûn 2-3, Bakara 204-205, Ahzâb 70-71). Üretici böyle bir ayet tek başına verilirse durur;
  bu ayetler aralık olarak gösterilir.
- **Ayet seçimi:** Her davranış, mealinde o davranışı açıkça bildiren bir ayete dayanır. Ayetin konusu daha
  özelse (ör. Hucurât 2: Peygamber'in huzurunda ses; Mâide 32: İsrailoğullarına yazılan hüküm) davranış
  sayfasında not olarak belirtilir.
- **Hadisler:** Yalnızca Kaynaklar panelinde, üç tane: Müslim, Salâtü'l-müsâfirîn, 746; Buhârî, Edeb, 6035 /
  Müslim, Fezâil, 2321; Buhârî, Îmân, 10 / Müslim, Îmân, 40. Numara, ravi ve kitap adı Buhârî ve Müslim
  metinleriyle (fawazahmed0/hadith-api) karşılaştırılmıştır.
- **Kapsam:** Liste Kur'an'ın açıkça emrettiği ya da yasakladığı başlıca ahlaki davranışları içerir; ibadetlerin
  ayrıntıları diğer uygulamalarda anlatılır. Yedi halkalı düzen, öğrenmeyi kolaylaştırmak için hazırlanmış bir sınıflandırmadır.

## Tema

Tema (çocuk / yetişkin) `apps:tema`, renk (açık / koyu) `theme` anahtarındadır. Uygulamanın kendi durumu
(okunanlar, görünüm tercihleri, en iyi test sonucu, günün işaretleri) `davranis:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py davranis` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
