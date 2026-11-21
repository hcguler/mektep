# Siyer Çizelgesi

Peygamberimizin (s.a.v.) doğumundan vefatına otuz olay; her biri tarihi, yeri, ilgili ayet ya da sahih hadisle ve
bugüne bıraktığı dersle. Yayın adresi: https://hcguler.github.io/mektep/siyer/

## Bölümler

- **Çizelge:** 571–632 hayat çizgisi (peygamberlikten önce, Mekke, Medine) ve üç döneme ayrılmış otuz olay;
  okunan olaylar işaretlenir.
- **Olay sayfası:** Tarih, yaş (yalnızca yaygın kabul görenler), yer; "Ne oldu?", ilgili ayetler (Arapça ve
  anlam ayrı ayrı açılıp kapanır), hadis ve künyesi, varsa görüş farkı notu, Akılda kalsın, kaynak.
- **Harita:** Şematik harita; bir yere dokununca orada yaşanan olaylar listelenir. Mekke ve Medine'ye çok
  yakın yerler (Hira, Akabe, Hudeybiye, Arafat, Uhud) kendi şehirlerinin altında gösterilir.
- **Hangisi önce?:** İki olaydan hangisinin önce olduğunu soran on soruluk sıralama oyunu. Süreye yayılan ya
  da tarihi tartışmalı olaylar (`oyun: false`: koyun gütme, baskı yılları, İsrâ ve Mi'râc) ve aynı yıl
  içindeki olay çiftleri oyuna girmez.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `siyer.css`, `siyer.js` | Uygulama. |
| `data.js` | Olaylar, dönemler, yerler, hadis künyeleri. Elle düzenlenir. |
| `ayetler.js` | Ayetler. **Elle düzenlenmez**; `node tools/siyer-uret.mjs` üretir. |

`tools/siyer-anlatim.mjs` gizli anlatım metnini (tam + parçalı, `tools/siyer-anlatim.json`) üretir.
İçerik değişince sırasıyla `node tools/siyer-uret.mjs`, `node tools/siyer-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Ayetler:** Tanzil (Simple) ve Diyanet İşleri meali (Tanzil, tr.diyanet), `tools/lib/tanzil-ayetler.mjs`
  ile; birleşik mealler aralık olarak gösterilir (Fîl 1-5, Alak 1-5, Ankebût 2-3, Fetih 18-19, Nasr 1-3).
  Ayet ya olayın kendisini anlatır ya da konusuyla doğrudan ilgilidir; sebeb-i nüzul olmayan ayetler için
  (Zümer 10) sayfada not vardır.
- **Hadisler:** Yalnızca Buhârî ve Müslim. Otuz olayın hepsinde ayet ya da hadis vardır (28 olayda hadis, 22 olayda ayet).
  `tools/siyer-uret.mjs` 35 künyenin her birini fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile
  denetler: numara var mı, kitap adı (bölüm) tutuyor mu, metinde ravinin adı geçiyor mu. Müslim numarası
  Abdülbâkî numarasıdır. Hadisler anlam olarak, kısaltılarak aktarılır; Türkçe ifadeler İngilizce ve Türkçe
  (tur-bukhari) çevirilerle karşılaştırılmıştır.
- **Tarih, yer, yaş:** Siyer kaynaklarındaki yaygın bilgidir (İbn Hişâm ve sonraki siyer eserleri; TDV İslâm
  Ansiklopedisi). **Bu kaynaklarla çevrimiçi karşılaştırılamamıştır.** Görüş farkı olan yerlerde (doğum
  yılı, İsrâ ve Mi'râc'ın tarihi, Hendek'in yılı) sayfada not vardır. Hacerü'l-esved hakemliği gibi yalnızca
  siyer kaynaklarında geçen bilgiler sayfada bu kaynağa bağlanır.
- **Harita:** Şematik; kıyılar ve konumlar yaklaşıktır (Huneyn'in yeri özellikle yaklaşıktır).
- **Doğrulanmadı:** "Akılda kalsın" cümleleri yorum cümleleridir.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (okunan olaylar, son olay, görünüm
tercihleri, harita seçimi, en iyi sonuç) `siyer:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py siyer` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
