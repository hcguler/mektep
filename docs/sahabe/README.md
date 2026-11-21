# Sahabe Hayatları

Peygamberimizin (s.a.v.) on iki arkadaşı: künyeleri, hayatlarından sahih kaynaklı 4-5 kesit, ilgili ayet ve hadisler,
bugüne bıraktıkları örnek davranış. Yayın adresi: https://hcguler.github.io/mektep/sahabe/
Plan: `planlar/sahabe-hayatlari.md`.

## Bölümler

- **Sahabiler (`#/`):** Dört grupta on iki kart (dört halife; Peygamberimizin ev halkı; Mekke'nin ilk Müslümanları;
  Kur'an ve hadis öğretmenleri). Görselde yüz yoktur: her sahabi bir renk ve baş harfle (çocuk temasında simgeyle) gösterilir.
- **Sahabi sayfası (`#/s/<id>`):** Künye (doğum, Müslüman oluşu, vefat, kabri), hayatından kesitler (her biri kendi
  kartında: ayet ve ayetin sahabiyle bağı, hadis ve künyesi, Siyer Çizelgesi bağlantısı, kaynak), örnek davranış,
  Akılda kalsın, görüş farkı notu, kaynak.
- **Zaman şeridi (`#/zaman`):** Her sahabinin İslam'a girişinden vefatına uzanan çizgi; Siyer Çizelgesi'nin dönem
  renkleri (Mekke, Medine) ve "Peygamberimizden sonra". Giriş yılı kesin olmayanlar içi boş noktayla gösterilir.
- **Kim yaptı? (`#/oyun`):** Bir kesitten ipucu (`ipucu` alanı; ad geçmez) ve dört sahabi; on soru.

## Sahabiler

Hz. Ebû Bekir, Hz. Ömer, Hz. Osman, Hz. Ali · Hz. Hatice, Hz. Âişe, Hz. Fâtıma · Hz. Bilâl, Hz. Mus‘ab bin Umeyr,
Hz. Sa‘d bin Ebû Vakkās · Hz. Abdullah bin Mes‘ûd, Hz. Ebû Hüreyre.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `sahabe.css`, `sahabe.js` | Uygulama. CSS iskeleti Siyer Çizelgesi ile ortaktır. |
| `data.js` | Sahabiler, kesitler, hadis künyeleri. Elle düzenlenir. |
| `ayetler.js` | Ayetler. **Elle düzenlenmez**; `node tools/sahabe-uret.mjs` üretir. |
| `siyer-baglanti.js` | Siyer olayı → sahabiler listesi ve olay başlıkları. **Elle düzenlenmez**; aynı üretici yazar. |

İçerik değişince sırasıyla `node tools/sahabe-uret.mjs`, `node tools/sahabe-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Künye ve hadis dışı bilgiler:** TDV İslâm Ansiklopedisi'nin her sahabi için ilgili maddesi
  (islamansiklopedisi.org.tr; "Ebû Bekir", "Ömer", "Osman", "Ali", "Hatice", "Âişe", "Fâtıma", "Bilâl-i Habeşî",
  "Mus‘ab b. Umeyr", "Abdullah b. Mes‘ûd", "Ebû Hüreyre", "Sa‘d b. Ebû Vakkās"); tarihler 16.11.2026'da bu maddelerle
  karşılaştırıldı. Rivayet farkı olan yerlerde sayfada "Görüş farkı" notu vardır.
- **Hadisler:** Yalnızca Buhârî ve Müslim; öncelik "Fezâilü ashâbi'n-nebî" ve "Fezâilü's-sahâbe" bölümleri (Hz. Mus‘ab
  dışında her sahabinin bu bölümlerden en az bir rivayeti var; Hz. Mus‘ab'ınkiler Menâkıbü'l-ensâr ve Cenâiz'dendir).
  `tools/sahabe-uret.mjs` her künyeyi fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler: numara var mı,
  kitap adı tutuyor mu (bölüm, hadisin sıra numarasından bulunur; aynı Abdülbâkî numarası iki kitapta geçen Müslim
  1748 gibi rivayetler de doğru eşleşir), metinde ravinin adı geçiyor mu. Kesitlerin `kaynak` alanındaki künyeler de
  denetlenir. Hadisler anlam olarak, kısaltılarak aktarılır; Türkçe ifadeler İngilizce (ve Buhârî için tur-bukhari)
  metinle karşılaştırılmıştır.
- **Ayetler:** Tanzil (Simple) + Diyanet İşleri meali, `tools/lib/tanzil-ayetler.mjs`. Yalnızca hakkında indiği
  sahih rivayette ya da tefsirde açıkça belirtilen ayetler: Tevbe 40, Nûr 22 (Hz. Ebû Bekir), Bakara 125 (Hz. Ömer),
  Mâide 6, Nûr 11 (Hz. Âişe), En‘âm 52 (Hz. Abdullah bin Mes‘ûd, Hz. Bilâl, Hz. Sa‘d), Ankebût 8 ve Lokmân 15 (Hz. Sa‘d).
  Bağlantı her ayetin altında yazılıdır.
- **Siyer tutarlılığı:** Kesitlerin `siyer` alanı `docs/siyer/data.js` olay kimliklerine bağlıdır; üretici olayın
  varlığını ve kesit yılının olayın tarihindeki yıllarla çelişmediğini denetler.
- **Doğrulanmadı / dikkat:**
  - Hz. Hatice'nin vefat yılı: TDV İA 10 Ramazan (19 Nisan 620) verir; Siyer Çizelgesi "Hüzün yılı"nı 619 gösterir.
    Sayfada "619 ya da 620" yazılı ve not düşülmüştür.
  - Hz. Bilâl'in işkence ve fetih günü Kâbe'de ezan okuması TDV İA'ya (siyer kaynaklarına) dayanır; Buhârî ve
    Müslim'den denetlenmemiştir.
  - Zaman şeridinde yılı kesin olmayan İslam'a giriş yılları (Hz. Osman, Hz. Bilâl, Hz. Mus‘ab, Hz. Sa‘d,
    Hz. Abdullah bin Mes‘ûd) 611 olarak yaklaşık çizilir.
  - "Akılda kalsın" ve "Örnek davranış" cümleleri yorum cümleleridir.

## Saygı ve ölçü

Ad biçimi her yerde "Hz. Ebû Bekir". Sahabiler arasında karşılaştırma yapılmaz; sahih hadisteki ifade aynen aktarılır.
Zayıf menkıbe yoktur. Peygamberimizden sonraki siyasi olaylar anlatılmaz; şehadetler yalnızca vefat yeri ve tarihiyle
anılır. Üretici "fitne", "en büyüğü" gibi ifadeleri yakalar.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (okunan sahabiler, son sahabi, ayet görünümü,
oyunda en iyi sonuç) `sahabe:v1` anahtarında saklanır. Çocuk temasında "Peygamberimizin arkadaşları" dili, her sahabiden
bir davranış (`cocuk` alanı) öne çıkar; içerik aynıdır.

## Sesli anlatım

Metin: `node tools/sahabe-anlatim.mjs` → `tools/sahabe-anlatim.json` (`giris` + her sahabi `01-ebubekir` … `12-ebuhureyre`,
ayrıca `tam`). Ses bu bilgisayarda `python3 tools/tts/seslendir.py sahabe` ile üretilir (henüz üretilmedi).
Ana ekranda `data-anlatim="tam giris"`, her sahabi sayfasında `data-anlatim="<sıra>-<id>"` yer tutucusu vardır.
Ses dosyaları önbelleğe alınmaz.

## Bilinen eksikler

- Ses kayıtları henüz üretilmedi; karttaki "Sesli anlatım" özelliği ses üretilince eklenecek.
- Siyer Çizelgesi tarafındaki geri bağlantı (olay sayfasından sahabi sayfasına) henüz yok; `siyer-baglanti.js` hazır.
- Gerçek telefonda deneme yapılmadı.
