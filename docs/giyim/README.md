# Giyim ve Görünüş

Erkek, kadın ve çocuk için kıyafet, örtünme, saç, sakal ve süs. Her konuda sıra aynıdır: önce Kur'an,
sonra Buhârî ve Müslim'den sahih hadis, ardından Diyanet'in ve mezheplerin görüşü.
Yayın adresi: https://hcguler.github.io/mektep/giyim/

## Bölümler

- **Rehber:** Dört bölüm (herkes için, erkek, kadın, çocuk), arama ve 20 konunun listesi. Okunan konular işaretlenir.
- **Konu sayfası:** Ad, hüküm etiketi (farz, sünnet, caiz, mekruh, haram, ilke), çizim, kısa açıklama, ayetler
  (Arapça ve anlam ayrı ayrı açılıp kapanır, Arapça yazı büyütülür), sahih hadisler, fıkıh (Diyanet ve mezhepler),
  Akılda kalsın, kaynak.
- **Örtünme:** Erkek ve kadın için örtülmesi farz olan yerler çizim üzerinde; Hanefî ile Şâfiî / Hanbelî farkı
  bir düğmeyle değişir.
- **Konular:** Kıyafet ve örtünme, saç, sakal ve bıyık, süs ve takı, temizlik, beden ve yaratılış.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `giyim.css`, `giyim.js` | Uygulama. Ortak stil temeli Kur'an Duaları'ndandır. |
| `data.js` | Bütün içerik: bölümler, konular, 20 öge (açıklama, ayet numaraları, hadisler, fıkıh, Akılda kalsın, kaynak). Elle düzenlenir. |
| `ayetler.js` | Ayet metinleri ve mealleri. **Elle düzenlenmez**; `node tools/giyim-uret.mjs` üretir. |
| `cizimler.js` | SVG çizimler. Renkler CSS değişkenlerinden gelir; iki tema ve açık / koyu renge uyar. |

Depo kökündeki `tools/giyim-uret.mjs` ayetleri üretir ve bütün künyeleri denetler; `tools/giyim-anlatim.mjs`
gizli anlatım metnini (`tools/giyim-anlatim.json`, tam + 20 durak + giriş) üretir. `data.js` değişince sırasıyla
`node tools/giyim-uret.mjs`, `node tools/giyim-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Kur'an:** Tanzil Quran Text (Simple), değiştirilmeden; meal Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet).
  14 ayet: Tîn 4, Teğâbün 3, A'râf 26, 31, 32, Nahl 81, Müddessir 4, Lokmân 18, Nûr 30, 31, 58, 59, Ahzâb 59, Tâhâ 94.
- **Hadis:** Yalnızca Buhârî ve Müslim. 25 hadis, 36 künye. Üretici her künyenin numarasını, kitap adını ve râvisini
  fawazahmed0/hadith-api metinleriyle karşılaştırır; uyuşmazlıkta durur. Müslim numarası M. Fuâd Abdülbâkî numarasıdır.
- **Hadis metinleri Türkçeye anlam olarak aktarılmıştır** (Diyanet'in hadis çevirisiyle kelime kelime karşılaştırılmadı).
- **Fıkıh:** Diyanet İşleri Başkanlığı esas: İlmihal, Din İşleri Yüksek Kurulu kararları (başörtüsü: 1980/77, 1993/6),
  Fetvalar (2018) ve Fetva Kurulu cevapları. Mezhep farkları TDV İslâm Ansiklopedisi'nin "Setr-i Avret", "Tesettür",
  "Sakal", "Saç" ve "Âkıl" maddelerinden; kimin görüşü olduğu her yerde yazılıdır.
- **Doğrudan açılamayanlar:** Diyanet İlmihali'nin ve bazı Din İşleri Yüksek Kurulu fetvalarının (saç boyama, saç uzatma,
  küpe, dövme, kaş aldırma) metni doğrudan açılamadı; bunlar basında ve Diyanet İlmihali'ni aktaran kaynaklarda
  yer alan ifadelerle karşılaştırıldı. Yayından sonra Diyanet'in kendi metniyle bir kez daha karşılaştırılmalıdır.
- **Çizimler:** Yüzsüz, genel figürlerdir. Peygamberlerin ve sahabenin yüzü, bedeni çizilmez; "Peygamberimizin görünüşü"
  konusunda yalnızca hilye düzeninde bir süsleme vardır.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (okunan konular, görünüm tercihleri,
mezhep ve cinsiyet seçimi) `giyim:v1` anahtarında saklanır.

## Sesli anlatım

Anlatım metni hazırdır (`tools/giyim-anlatim.json`); **ses henüz üretilmedi.** Ses yalnızca yerel modellerin
bulunduğu bilgisayarda `python3 tools/tts/seslendir.py giyim` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve
`anlatim/cocuk/` (kadın sesi). Yer tutucular sayfada hazırdır (ana ekranda `tam giris`, her konuda `NN-<id>`);
kayıtlar gelince oynatıcı kendiliğinden görünür. O zaman `apps.js`'teki özellik listesine "Sesli anlatım" eklenir.

## Bilinen eksikler

- Ses kayıtları yok (yukarıya bakın).
- Hadislerin Türkçe ifadesi Diyanet'in hadis çevirileriyle karşılaştırılmadı.
