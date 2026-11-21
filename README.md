# Mektep

**Kur'an ve sahih sünnet merkezli, çocuklar ve yetişkinler için hazırlanmış, çevrimdışı çalışan Türkçe eğitim uygulamaları.**

Canlı adres: **https://hcguler.github.io/mektep/**

Mektep tek bir kurulabilir web uygulamasıdır (PWA). İçinde namaz rehberinden Esmâ-ül Hüsnâ'ya, siyerden
zekât hesabına kadar on altı küçük uygulama bulunur. Derleme adımı, paket yöneticisi ya da çatı (framework)
yoktur: düz HTML, CSS ve JavaScript'tir; bir statik sunucuyla açılır ve telefona ana ekran uygulaması olarak
eklenir.

> *English summary:* Mektep is a static, offline-first PWA bundling sixteen Turkish-language Islamic
> learning apps (prayer guide, 99 Names, Prophets, Seerah, Zakat calculator, Quran supplications and more).
> Plain HTML/CSS/JS, no build step, deployed from `/docs` with GitHub Pages. Every religious text is
> generated from a cited source and verified by scripts; narration audio is produced locally with
> on-device TTS models.

---

## İçindekiler

1. [Amaç ve ilkeler](#amaç-ve-ilkeler)
2. [Uygulamalar](#uygulamalar)
3. [Üretim mantığı](#üretim-mantığı)
4. [Tema yapısı](#tema-yapısı)
5. [Depo yapısı](#depo-yapısı)
6. [Yerel çalıştırma](#yerel-çalıştırma)
7. [Yeni içerik ekleme](#yeni-içerik-ekleme)
8. [Yayın](#yayın)
9. [Katkı](#katkı)
10. [Kaynaklar, atıf ve lisans](#kaynaklar-atıf-ve-lisans)

---

## Amaç ve ilkeler

Amaç, dinî bilgiyi **doğru, sade ve güzel** bir biçimde, internet olmasa da açılan bir uygulamada sunmaktır.
Aynı içerik iki ayrı tonla anlatılır: çocuk için sıcak ve oyunlu, yetişkin için ciddi ve sakin.

Tasarım ilkeleri:

- **Kaynak kesinliği.** Dinî içerikte hata kabul edilmez; emin olunmayan bilgi yazılmaz. Ayet metni elle
  yazılmaz, hadis künyesi elle girilmez; ikisi de betiklerle kaynaktan alınır ve doğrulanır.
- **Çevrimdışı ve hafif.** Derleme yok, çatı yok, uzak betik yok (yazı tipleri hariç). Service worker her
  şeyi önbelleğe alır.
- **Önce telefon.** 320 px genişlikte yatay taşma yoktur; dokunma hedefleri en az 44 px; klavye ve ekran
  okuyucuyla gezilebilir; `prefers-reduced-motion` dikkate alınır.
- **Gizlilik.** Hesap, izleme ya da sunucu yoktur. Kullanıcı verisi (favoriler, ezber ilerlemesi, tema)
  yalnızca tarayıcının `localStorage`'ında durur.
- **Yerel ses.** Sesli anlatım yalnızca geliştiricinin bilgisayarında, yerel modellerle üretilir. Metin hiçbir
  bulut servisine gönderilmez.

## Uygulamalar

| Uygulama | Yol | Ne sunar |
| --- | --- | --- |
| Namaz Yolculuğu | `docs/namaz.html` | 11 durakta adım adım namaz, nafile namazlar, rekât çizelgesi |
| Ezberler | `docs/ezberler/` | Sureler, namaz duaları ve zikirler; kâri sesiyle |
| İslam'da Kavram Haritası | `docs/kavram/` | Helal, haram, mubah, müstehab ve dahası |
| Kur'an'dan Davranış Modeli | `docs/davranis/` | Günün yirmi dört saati için Kur'an'dan davranışlar |
| Esmâ-ül Hüsnâ | `docs/esma/` | 99 isim: Arapçası, anlamı, ayeti, kula yansıması |
| Peygamberler Yolculuğu | `docs/peygamberler/` | Kur'an'da adı geçen 25 peygamber |
| Siyer Çizelgesi | `docs/siyer/` | Peygamberimizin hayatı yıl yıl |
| Ayet Ayet Arapça | `docs/arapca/` | Kur'an'ı okurken Arapça öğrenme |
| Zekât ve Sadaka Rehberi | `docs/zekat/` | Hesapla, öğren, ver |
| Oruç Rehberi | `docs/oruc/` | Orucu doğru tutmak için |
| Kur'an Duaları | `docs/dualar/` | "Rabbenâ" ile başlayan 43 dua |
| Giyim ve Görünüş | `docs/giyim/` | Kur'an ve sahih sünnetle |
| Kur'an'da Hayvanlar | `docs/hayvanlar/` | Çocuklar için keşif |
| Sureler Atlası | `docs/sureler/` | 114 sure, bir bakışta |
| Sahabe Hayatları | `docs/sahabe/` | Peygamberimizin arkadaşları |
| Kur'an'dan Mucizeler | `docs/mucizeler/` | Gelecekten haberler, o gün bilinmeyenler |

Kayıt listesi `docs/apps.js` dosyasındadır; ana ekran kartları ve ana ekran simgeleri bu listeden üretilir.
Her çok dosyalı uygulamanın kendi `README.md` dosyası vardır (dosyalar, veri kaynağı, bilinen eksikler).

## Üretim mantığı

İçerik elle HTML yazılarak değil, **veriden betikle üretilerek** hazırlanır. Her uygulama aynı boru hattını
izler:

```
 data.js  ──►  tools/<ad>-uret.mjs  ──►  ayetler.js / metinler.js   (Arapça + meal, doğrulanmış)
 (elle yazılan Türkçe içerik)                      │
                                                   ▼
                              tools/<ad>-anlatim.mjs ──► tools/<ad>-anlatim.json   (tam + parçalı anlatım metni)
                                                   │
                                                   ▼
                              tools/tts/seslendir.py ──► docs/<ad>/anlatim/<profil>/*.mp3  (yerel TTS)
                                                   │
                                                   ▼
                              tools/pwa-surum.mjs    ──► docs/sw.js içinde yeni SURUM
```

**1. Elle yazılan içerik: `data.js`.** Her uygulamada Türkçe içerik (okunuş, açıklama, "Akılda kalsın",
bağlam) ve ayet/hadis *numaraları* elle yazılır. Metnin kendisi buraya girmez.

**2. Üretilen içerik: `ayetler.js`, `metinler.js`, `isimler.js`.** Bu dosyalar **elle düzenlenmez**.
`tools/lib/tanzil-ayetler.mjs` Arapça metni (Tanzil Simple) ve Diyanet İşleri mealini (Tanzil `tr.diyanet`)
değiştirmeden alır. Mealde birleşik duran ayet grupları (ör. `83:1-3`) tek ayet olarak istenirse üretici
durur ve aralığı ister; böylece bir ayete ona ait olmayan bir anlam yüklenmez. Hadis künyeleri
(`tools/siyer-uret.mjs` gibi) `fawazahmed0/hadith-api` ile denetlenir; numara, kitap adı ve ravi tutmazsa
üretici hata verip durur.

**3. Sesli anlatım metni.** `tools/<ad>-anlatim.mjs`, uygulama verisinden kulak için yazılmış bir metin
üretir: kısa cümleler, sayılar yazıyla, kısaltmalar açık, Arapça yok. Çıktı `tools/<ad>-anlatim.json`'dur
(`tam` = bütün duraklar tek kayıt, `duraklar` = her durak ayrı kayıt). Bu metin ekranda gösterilmez.

**4. Yerel ses üretimi.** `tools/tts/seslendir.py` metni `~/tts-shorts` içindeki çevrimdışı modellerle
seslendirir: yetişkin profili için erkek ses (Antalia-2 Mini), çocuk profili için kadın ses (EMA Lightning).
Çıktı mono MP3'tür (24 kHz, 32 kbps, −18 LUFS). Metni değişmeyen kayıt yeniden üretilmez. Bulut TTS, başka
makine ya da CI ile ses **üretilmez**; modeller yoksa betik durur. Ayrıntı: [tools/tts/README.md](tools/tts/README.md).

**5. PWA sürümü.** `tools/pwa-surum.mjs`, service worker önbelleğindeki dosyaların içeriğinden bir özet
çıkarıp `docs/sw.js` içindeki `SURUM` sabitini günceller. Kullanıcılar bir sonraki açılışta "Yeni sürüm hazır"
penceresini görür.

Ses dosyaları depoda tutulur (şu an yaklaşık 1.260 MP3, `docs` toplamı yaklaşık 470 MB) ve service worker
tarafından önbelleğe **alınmaz**; yalnızca çalındığında ağdan okunur.

Kaynak ve içerik kuralları [CLAUDE.md](CLAUDE.md) dosyasında ayrıntılıdır (kaynak kesinliği, içerik kalıbı,
tema, erişilebilirlik, anlatım, PWA). Yeni bir şey yazmadan önce o dosya okunmalıdır.

## Tema yapısı

İki bağımsız eksen vardır.

| Eksen | Değerler | Nasıl uygulanır | `localStorage` |
| --- | --- | --- | --- |
| **Profil** | `yetiskin` (varsayılan), `cocuk` | `<html data-theme="cocuk">`; yetişkin değeri `:root` varsayılanıdır | `apps:tema` |
| **Görünüm** | `dark`, `light` | `<html data-mode="dark|light">` | `theme` |
| **Anlatım sesi** | `erkek`, `kadin` | Profile bağlıdır: yetişkin = erkek, çocuk = kadın | `apps:ses` |

- **Yetişkin:** zümrüt ve altın tonları, serifli başlıklar, çizgi ikonlar, sade yüzeyler.
- **Çocuk:** sıcak renkler, yuvarlak yazı tipi, emoji vurguları, cesaretlendiren kısa cümleler.
- İçerik iki profilde **aynıdır**; yalnızca ton ve görünüm değişir. Bir durağın çocuk metni gerçekten
  farklıysa `cocuk/<dosya>` kaydı ayrıca yazılır.
- Renkler ve ölçüler CSS değişkenleriyle (token) tanımlanır. Her uygulamanın CSS'inde şu kalıp vardır:
  `:root` / `[data-mode="dark"]` (koyu), `[data-mode="light"]` (açık), `[data-theme="cocuk"]` ve
  `[data-theme="cocuk"][data-mode="dark"]` (çocuk). Tema değişimi yalnızca değişkenleri değiştirir.
- Tema ana ekranda (`docs/index.html`) seçilir ve bütün uygulamalara taşınır; her uygulamanın üst
  çubuğundaki "Görünüm" penceresinden de değiştirilir.

Ortak oynatıcı (`docs/anlatim.js` + `docs/anlatim.css`) sesi temadan seçer; kilit ekranı ve bildirim
paneli kontrolü `docs/medya.js` (Media Session API) üzerinden yapılır.

## Depo yapısı

```
.
├── docs/                    Yayınlanan site (GitHub Pages kaynağı)
│   ├── index.html           Ana ekran (kart ızgarası; PWA olarak telefon ana ekranı görünümü)
│   ├── apps.js              Uygulama kayıt listesi
│   ├── namaz.html           Tek dosyalık uygulama (örnek alınan uygulama)
│   ├── <ad>/                Çok dosyalı uygulamalar: index.html, <ad>.css, <ad>.js, data.js, README.md,
│   │                        üretilen ayetler.js / metinler.js ve anlatim/<profil>/*.mp3
│   ├── manifest.webmanifest PWA bildirimi
│   ├── sw.js, pwa.js        Service worker ve kayıt/güncelleme arayüzü
│   ├── hub.js, launcher.*,  Ana ekran davranışı, uygulama gibi açılan ana ekran, favoriler
│   │   favori.*
│   ├── anlatim.*, medya.js  Ortak ses oynatıcı ve kilit ekranı kontrolü
│   └── css/, js/, assets/   Ana ekranın kullandığı ortak stil, betik ve simgeler
├── tools/                   Üreticiler ve ses araçları (yalnızca geliştirme; yayınlanmaz)
│   ├── <ad>-uret.mjs        Arapça + meal üretimi ve doğrulama
│   ├── <ad>-anlatim.mjs/.json  Anlatım metni
│   ├── lib/                 Ortak kütüphaneler (Tanzil, tam anlatım)
│   ├── tts/                 Yerel ses üretimi
│   └── pwa-surum.mjs        Service worker sürümü
├── planlar/                 Uygulama çalışma planları ve ortak yöntem
├── CLAUDE.md                Uygulama standartları (kaynak, içerik kalıbı, tema, ses, PWA)
└── README.md
```

## Yerel çalıştırma

Gereken: bir statik sunucu. Node.js yalnızca üreticiler için, Python ve `ffmpeg` yalnızca ses üretimi için.

```bash
python3 -m http.server 8080 --directory docs
```

Ardından http://localhost:8080/ açılır. `file://` ile açmayın: service worker ve ses dosyaları HTTP ister.
Aynı dosyalar hem `localhost:8080/` hem de `/mektep/` altında çalışır, çünkü bütün yollar göreli yazılmıştır.

Tarayıcıda "uygulama gibi açılan ana ekran" görünümünü önizlemek için `http://localhost:8080/?launcher`.

## Yeni içerik ekleme

### A. Var olan bir uygulamaya öge eklemek

Örnek: Kur'an Duaları'na yeni bir dua.

1. `docs/<ad>/data.js` içine ögeyi ekleyin. Ayet numarasını `sure:ayet` ya da `sure:ilk-son` biçiminde yazın;
   Arapça metni ve meali **yazmayın**.
2. Her ögenin `kaynak` alanını doldurun. Hadis ise kitap, bölüm ve numarasıyla yazın.
3. Arapça ve mealı üretin (üretici numarayı doğrular, uyuşmazlıkta durur):
   ```bash
   node tools/<ad>-uret.mjs
   ```
4. Anlatım metnini yeniden üretin ve doğrulayın:
   ```bash
   node tools/<ad>-anlatim.mjs
   ```
5. Sesi bu bilgisayarda yeniden üretin (yalnızca metni değişen kayıtlar yenilenir) ve **dinleyin**:
   ```bash
   python3 tools/tts/seslendir.py <ad>
   ```
   Yanlış okunan kelimeyi üreticide okunuşa göre düzeltip yeniden üretin.
6. Service worker sürümünü güncelleyin:
   ```bash
   node tools/pwa-surum.mjs
   ```
7. Tarayıcıda deneyin (aşağıdaki [kontrol listesine](#göndermeden-önce-kontrol-listesi) bakın).

### B. Yeni bir uygulama eklemek

1. **Planı yazın ya da okuyun.** "Yakında" kartı için `planlar/<ad>.md` yazılır (amaç, kapsam, kaynaklar,
   veri modeli, ekranlar, anlatım, doğrulama). Başlamadan önce [CLAUDE.md](CLAUDE.md) ve
   [planlar/README.md](planlar/README.md) okunur; plandaki "Kullanıcıya sorulacaklar" cevaplanmadan içerik
   yazılmaz.
2. **İskeleti kopyalayın.** En yakın çok dosyalı örnekten (çoğunlukla `docs/siyer/` ya da `docs/dualar/`)
   başlayın: `index.html`, `<ad>.css`, `<ad>.js`, `data.js`, `README.md`. Ortak iskelet: üst çubuk, alt sekme
   çubuğu (geniş ekranda yan menü), "Görünüm" penceresi (tema + renk), "Kaynaklar" penceresi, hash
   yönlendirme (`#/`, `#/<tür>/<id>`), `localStorage` anahtarı `<ad>:v1`.
3. **Veriyi yazın.** `data.js` içine içeriği, içerik kalıbıyla yazın: ad · Arapça/okunuş/anlam · 2–4 cümle
   açıklama · "Akılda kalsın" · kaynak. İçeriği 8–12 ögelik dalgalarla ekleyin; her dalgayı üretip doğrulayın.
4. **Üreticiyi yazın.** `tools/<ad>-uret.mjs` (ayet ve meal için `buildAyetler` kullanın) ve
   `tools/<ad>-anlatim.mjs` (tam + durak anlatımı).
5. **Temayı bağlayın.** CSS'te `:root`, `[data-mode="light"]`, `[data-theme="cocuk"]` ve
   `[data-theme="cocuk"][data-mode="dark"]` değişkenlerini tanımlayın; sayfaya ortak oynatıcıyı ekleyin:
   ```html
   <link rel="stylesheet" href="../anlatim.css">
   <script src="../medya.js"></script>
   <script src="../anlatim.js"></script>
   <div data-anlatim="tam giris"></div>   <!-- hero bölümünde -->
   ```
6. **Kaydedin.** `docs/apps.js` listesine kayıt ekleyin (`id`, `href`, `short`, `colors`, `langs`, `name`,
   `tagline`, `description`, `features`). Özellik listesine yalnızca gerçekten yayında olanı yazın;
   "Sesli anlatım" ancak oynatıcı bağlanınca yazılır.
7. **PWA'ya ekleyin.** Her sayfada `<link rel="manifest">`, `apple-touch-icon`,
   `apple-mobile-web-app-title` ve en sonda `pwa.js` bulunur. Uygulamanın yerel dosyalarını
   `docs/sw.js` içindeki `ONBELLEK` listesine, kısayolunu `manifest.webmanifest` içindeki `shortcuts`
   alanına ekleyin. Ses dosyalarını önbelleğe **eklemeyin**.
8. **Sesi üretin ve dinleyin**, `node tools/pwa-surum.mjs` çalıştırın, uygulamanın `README.md` dosyasını yazın.

### Göndermeden önce kontrol listesi

- Her ögenin kaynağı dolu; hafızadan yazılan bilgi kaynağıyla karşılaştırıldı.
- İki profil (çocuk / yetişkin) ve iki görünüm (açık / koyu) denendi.
- 320, 390 ve 1280 px genişlikte yatay taşma yok.
- Klavyeyle gezilebiliyor, `aria-*` etiketleri dolu, dokunma hedefleri en az 44 px.
- Ses çalan bir şey değiştiyse: doğru başlık, sıradaki kayda geçiş, kilit ekranı oturumu denendi.
- `node tools/pwa-surum.mjs` çalıştırıldı.
- Denenemeyen şey (gerçek cihaz, canlı site) açıkça not edildi.

## Yayın

Site `main` dalındaki **`/docs`** klasöründen GitHub Pages ile yayınlanır
(Settings → Pages → *Deploy from a branch* → `main` / `/docs`). `docs/.nojekyll` Jekyll işlemesini kapatır.
Yayından önce her seferinde `node tools/pwa-surum.mjs` çalıştırılır.

## Katkı

Hata bildirimi ve düzeltme önerileri için [Issues](https://github.com/hcguler/mektep/issues) kullanılır.
Dinî içerikte bir yazım, anlam ya da kaynak hatası görürseniz kaynağıyla birlikte bildirin; içerik
düzeltmeleri sessizce değil, kaynak gösterilerek yapılır.

Kod ya da yeni içerik göndermeden önce [CLAUDE.md](CLAUDE.md) dosyasını okuyun. Özellikle:

- Üretilen dosyalar (`ayetler.js`, `metinler.js`, `isimler.js`, `tools/*-anlatim.json`, `kayitlar.json`)
  elle düzenlenmez; kaynağı ve üreticisi değiştirilip yeniden üretilir.
- Ses dosyaları yalnızca yerel modellerle üretilir; bulut TTS ile üretilmiş ses kabul edilmez.
- Peygamberlerin ve sahabenin yüzü ya da bedeni çizilmez; görseller simge, harita, desen ve yazıyla sınırlıdır.

## Kaynaklar, atıf ve lisans

İçerik şu kaynaklardan alınır; her biri kendi koşullarına tabidir:

- **Kur'an metni:** [Tanzil](https://tanzil.net) (Simple), değiştirilmeden.
- **Meal:** Diyanet İşleri Başkanlığı meali (Tanzil `tr.diyanet`).
- **Hadis:** Öncelikle Buhârî ve Müslim; künye denetimi için `fawazahmed0/hadith-api`. Ayet ve meal dosyaları
  `fawazahmed0/quran-api`'nin GitHub aynasından indirilir.
- **Fıkhî hükümler:** Diyanet İşleri Başkanlığı (İlmihal, Din İşleri Yüksek Kurulu kararları). Hanefî görüş
  ana metindir; mezhep farkı ayrıca belirtilir.
- **Kıraat (Ezberler):** Suûd eş-Şüreym, [EveryAyah.com](https://everyayah.com) ayet kayıtları; ayrıntı
  `docs/ezberler/README.md` içindedir.
- **Sentetik ses:** Antalia-2 Mini ve EMA Lightning (Apache-2.0), yerelde çalıştırılır.

**Lisans.** İki lisans uygulanır; dosya kapsamları [LICENSE](LICENSE) içinde listelenir.

| Kapsam | Lisans |
| --- | --- |
| **Kod:** `tools/`, `docs/` altındaki HTML, CSS ve JavaScript | [MIT](LICENSE) |
| **İçerik:** uygulama metinleri ve verisi, anlatım metinleri, sesli anlatım kayıtları, simgeler, `planlar/`, dokümanlar | [CC BY-NC 4.0](LICENSE-CONTENT) (atıf gerekir, ticari kullanım yok) |

Yukarıdaki üçüncü taraf kaynakların (Tanzil, Diyanet meali, EveryAyah kıraat kayıtları) kendi kullanım
koşulları geçerlidir ve bu deponun lisansları onları kapsamaz.
