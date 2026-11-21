# Oruç Rehberi

Ramazan orucunun ve nafile oruçların hükümleri: kime farzdır, niyet, imsak ve iftar, orucu bozan ve bozmayan
durumlar, ruhsatlar, kaza, kefaret ve fidye, nafile oruçlar, oruç tutulmayan günler, Ramazan'ın ibadetleri.
`apps.js` kimliği `ramazan`. Yayın adresi: https://hcguler.github.io/mektep/oruc/
Plan: `docs/planlar/oruc-rehberi.md`.

## Ekranlar

- `#/` **Rehber:** hero (`data-anlatim="tam giris"`), "Bozar mı?" ve çizelge girişleri, arama, 11 bölüm kartı.
- `#/b/<bölüm>` **Bölüm:** konuların listesi (hüküm rozetiyle).
- `#/k/<konu>` **Konu:** ad, hüküm rozeti (Kavram Haritası'na bağlantı), kısa açıklama, örnek, Şâfiî farkı,
  sağlık uyarısı, Diyanet'in tarihli değeri (fidye, fitre), dua (Arapça / okunuş / anlam ayrı açılır), ayetler
  (Arapça / anlam), sahih hadis, Ebû Dâvûd / Tirmizî rivayeti (sıhhatiyle), Kavram Haritası bağlantıları,
  Akılda kalsın, kaynak; `data-anlatim="NN-<konu>"`.
- `#/bozar-mi` **Bozar mı?** oyunu: 20 sorudan rastgele 10; üç seçenek (Bozmaz / Bozar, kaza / Bozar, kaza ve
  kefaret); cevaptan sonra açıklama, kaynak ve konuya bağlantı. Yanlışta azarlamaz; çocuk temasında cesaretlendirir.
- `#/nafile` **Çizelge:** nafile oruçlar ve oruç tutulmayan günler, hicrî aylara göre.
- Kaynaklar penceresi ve görünüm penceresi (tema + renk).

Namaz ve imsak vakti hesaplanmaz; yalnızca https://namazvakitleri.diyanet.gov.tr/ bağlantısı verilir.
Takip ya da sayaç yoktur; `oruc:v1` yalnızca görünüm tercihlerini (Arapça / okunuş / anlam, yazı boyutu) tutar.

## Hüküm rozetleri

Her yerde aynı renk ve kelime: Farz · Sünnet · Mekruh · Bozar · kaza · Bozar · kaza + kefaret · Bozmaz · Ruhsat
(konu sayfasında uzun hâli: "Orucu bozar, kaza gerekir" gibi). Bilgi konularında (Ramazan ayı, kefaret, fidye,
çocuk, bayram günleri, Kadir Gecesi, fitre) rozet yoktur; bayram günleri için metin "tahrîmen mekruh / haram"
der ve Kavram Haritası'na bağlanır.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `oruc.css`, `oruc.js` | Uygulama. Ortak stil temeli Giyim ve Görünüş'ten. |
| `data.js` | Bütün içerik: 11 bölüm, 52 konu, 20 soru, çizelge, yıllık değerler, kaynaklar. Elle düzenlenir. |
| `ayetler.js` | Ayet metinleri ve mealleri. **Elle düzenlenmez**; `node tools/oruc-uret.mjs` üretir. |
| `kunye.js` | İftar duasının Arapçası (Ebû Dâvûd 2357, hadith-api) ve derecesi. **Elle düzenlenmez.** |

`data.js` değişince sırasıyla `node tools/oruc-uret.mjs`, `node tools/oruc-anlatim.mjs`, `node tools/pwa-surum.mjs`.
Üretici şunları denetler ve uyuşmazlıkta durur: ayet aralıkları (Bakara 183–184 birleşik meal), her hadis künyesi
(numara, kitap adı, râvi), Ebû Dâvûd / Tirmizî derecesi (hadith-api `grades`), zorunlu alanlar, Kavram Haritası
kimlikleri, "Bozar mı?" cevabının bağlı konunun hükmüyle aynı olması, çizelge bağlantıları, yıllık değerlerin
tarih ve Diyanet adresiyle tutulması.

## Kaynaklar ve doğrulama

- **Kur'an:** Bakara 183–184, 185, 186, 187 ve Kadr 1–5. Tanzil Simple, değiştirilmeden; meal Diyanet İşleri (tr.diyanet).
- **Hadis:** Buhârî "Savm" (ve Bed'ü'l-vahy 1, Zekât 1503, Salâtü't-terâvîh 2009, Fazlü leyleti'l-kadr 2017,
  İ'tikâf 2026) ile Müslim "Sıyâm" (ve Hayz 335, İ'tikâf 1172). 50 künye otomatik denetlendi. Müslim numarası
  M. Fuâd Abdülbâkî numarasıdır. Hadis metinleri hadith-api İngilizce ve Türkçe (tur-bukhari) metinleriyle
  karşılaştırılarak anlam olarak aktarılmıştır; Diyanet'in hadis çevirisiyle kelime kelime karşılaştırılmadı.
- **Diğer rivayetler (sıhhatiyle):** Ebû Dâvûd 2356 (iftarda hurma, su; Elbânî "hasen sahih"), Ebû Dâvûd 2357
  (iftar duası; Elbânî ve Şuayb el-Arnaût "hasen"), Tirmizî 747 (pazartesi-perşembe; Elbânî "sahih"),
  Tirmizî 761 (ayın 13–15'i; Elbânî "hasen sahih"). "Allahümme leke sumtu…" (Ebû Dâvûd 2358) zayıf olduğu için
  hadis olarak verilmedi; yalnızca bu durum not edildi ve İlmihal'in örnek duası Türkçe olarak aktarıldı.
- **Fıkıh:** Diyanet İşleri Başkanlığı, *Oruç: Sıkça Sorulanlar* (DİYK, 8. baskı, 2020; konularda "SSS, soru …"),
  *İlmihal I: İman ve İbadetler*, "Oruç" bölümü; DİYK kararı 22.09.2005/155 (muayene ve tedavi yöntemleri).
  Şâfiî farkı yalnızca önemli yerlerde: niyet vakti, boğaza su kaçması, yeme içmede kefaret, yolculukta niyetli
  orucu bozmak, kazanın gelecek Ramazan'a kadar tutulması.
- **Fidye ve fitre:** 240 TL, DİYK 07.01.2026 kararı (duyuru 13.01.2026,
  kurul.diyanet.gov.tr), 2026 Ramazan'ından 2027 Ramazan'ına kadar; `data.js` → `degerler`.
  Zekât ve Sadaka Rehberi aynı değeri ve aynı kaynağı kullanır.

## Doğrulanmadı / dikkat

- Plan "İlmihal II" diyor; Diyanet İlmihali'nde oruç bölümü **I. cilttedir** (İman ve İbadetler). Kaynak buna göre yazıldı.
- İlmihal metni bir müftülük sitesindeki PDF'ten (2008 baskısı, 2015 güncellemesi) okundu; sayfa numarası verilmedi.
- Sigaranın kefaret gerektirmesi DİYK'nın kendi sayfasında açılamadı (bağlantı hatası); SSS 28 + İlmihal'in genel
  kuralı ("kasıtlı yeme içme kaza ve kefaret") + Afyonkarahisar Dinar Müftülüğü sayfasıyla doğrulandı.
- Şâfiî mezhebinde yeme içmenin yalnız kaza gerektirmesi Bartın Amasra Müftülüğü sayfasından; TDV İslâm
  Ansiklopedisi ile ayrıca karşılaştırılmadı.

## Sesli anlatım

Anlatım metni hazırdır (`tools/oruc-anlatim.json`: tam + giriş + 52 durak); **ses henüz üretilmedi.** Ses yalnızca
yerel modellerin bulunduğu bilgisayarda `python3 tools/tts/seslendir.py oruc` ile üretilir. Yer tutucular sayfada
hazırdır (ana ekranda `tam giris`, her konuda `NN-<konu>`).

## Bilinen eksikler

- Ses kayıtları yok.
- Zekât ve Sadaka Rehberi (`../zekat/`) henüz yayında değil; fitre konusundaki bağlantı o yayınlanınca çalışır.
- Takip ve kaza sayacı sonraki sürüme bırakıldı (plan).
