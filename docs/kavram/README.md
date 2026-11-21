# İslam'da Kavram Haritası

Dinî hükümlerin temel kavramlarını (farz, vacip, sünnet, müstehab, mubah, mekruh, haram, helal,
şüpheli), kaynaklarını (Kur'an, Sünnet, İcmâ, Kıyas) ve uygulama ilkelerini (niyet, asıl serbestlik,
güç yetirme, ruhsat, zaruret) tanımı, delili ve günlük hayattan örnekleriyle anlatan statik uygulama.
Yayın adresi: https://hcguler.github.io/mektep/kavram/

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `kavram.css`, `kavram.js` | Uygulama. Derleme adımı yoktur. |
| `data.js` | Bütün içerik: kavramlar, hadisler, örnekler, mezhep notları, kaynaklar. Elle düzenlenir. |
| `ayetler.js` | Ayet metinleri ve mealleri. **Elle düzenlenmez**; `tools/kavram-ayetler.mjs` üretir. |

Depo kökündeki `tools/` klasöründe:

| Dosya | Görev |
| --- | --- |
| `tools/kavram-ayetler.mjs` | `data.js`'te geçen ayetlerin Arapça metnini (Tanzil, Simple) ve mealini (Diyanet İşleri, Tanzil tr.diyanet) `ayetler.js`'e yazar: `node tools/kavram-ayetler.mjs` |
| `tools/kavram-anlatim.mjs` | Gizli anlatım metnini üretir: `node tools/kavram-anlatim.mjs` |
| `tools/kavram-anlatim.json` | Her kavram için anlatım metni (tam + parçalı). Uygulamada gösterilmez. |

`data.js`'e yeni bir ayet eklenince sırasıyla `node tools/kavram-ayetler.mjs`,
`node tools/kavram-anlatim.mjs` ve `node tools/pwa-surum.mjs` çalıştırılır.

## Bölümler

- **Harita:** Kaynaklar → hüküm terazisi (helal alanı, yasak alanı ve aradaki şüpheli bölge) → ilkeler.
- **Hükümler:** Sekiz dereceli terazi ve kavram listesi.
- **Temeller:** Kaynaklar ve ilkeler.
- **Kendini dene:** Kavram sayfalarındaki örneklerden 10 soruluk test. Vacip farzla, müstehab sünnetle
  birlikte sorulur; mezhebe göre hükmü değişen örnekler sorulmaz ya da Hanefî mezhebine göre sorulur.

Her kavram sayfası: ad ve Arapça terim, açıklama, (hükümlerde) yapana ve yapmayana sonucu,
deliller (ayet: Arapça ve anlam ayrı ayrı açılıp kapanır; hadis: anlam ve künye), günlük hayattan
örnekler, mezhep notu, "Akılda kalsın", kaynak, ilgili kavramlar.

## Kaynaklar ve doğrulama

- **Kur'an metni:** Tanzil Quran Text (Simple), değiştirilmeden. Metin, fawazahmed0/quran-api
  deposundaki Tanzil kopyasından alınmış ve Ezberler'deki Tanzil metniyle karşılaştırılmıştır.
- **Meal:** Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet), aynı depodan. Her ayetin
  mealinin kendi ayetine ait olduğu tek tek kontrol edilmiştir (bu mealde bazı ayetler komşu
  ayetle birleşiktir; örneğin Nahl 43, bu yüzden kullanılmamıştır).
- **Hadisler:** Yalnızca Buhârî ve Müslim. Numaralar Buhârî için genel hadis numarası, Müslim için
  M. Fuâd Abdülbâkî numarasıdır. Her künye fawazahmed0/hadith-api deposundaki Buhârî ve Müslim
  metinleriyle numara, ravi ve kitap adı bakımından karşılaştırılmıştır. Hadisler anlam olarak aktarılmıştır.
- **Tanımlar:** Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler; TDV İslâm Ansiklopedisi.
  Bu eserler çevrimiçi karşılaştırılamamıştır; tanımlar fıkıh usulünün yerleşik bilgisine dayanır.
- **Mezhep:** Hüküm terazisinde Hanefî sıralaması esas alınır; diğer mezheplerin kullanımı her
  kavramda ayrıca belirtilir.

## Tema

Tema (çocuk / yetişkin) `apps:tema`, renk (açık / koyu) `theme` anahtarındadır; ikisi de diğer
uygulamalarla ortaktır. Uygulamanın kendi durumu (okunan kavramlar, görünüm tercihleri,
en iyi test sonucu) `kavram:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py kavram` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
