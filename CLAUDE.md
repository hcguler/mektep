# Mektep — uygulama standartları

Bu klasördeki uygulamalar (Namaz Yolculuğu, Ezberler ve sonradan eklenecekler) aynı çerçeveye uyar.
Yeni bir uygulama eklerken ya da var olanı değiştirirken aşağıdaki kurallar geçerlidir.

Örnek alınacak uygulama: `namaz.html`. Yapı, kaynak kesinliği, içerik kalıbı, tema, yerleşim ve kalite
bakımından yeni uygulamalar Namaz Yolculuğu ile aynı yaklaşımla ve aynı özenle hazırlanır.
Tek fark sesli anlatımdadır: her uygulama için tam ve parçalı anlatım metni yazılır, ses bu
bilgisayarda yerel modellerle `tools/tts/seslendir.py` ile üretilir (bkz. 6. bölüm).

> **Sesli anlatım yalnızca bu bilgisayarda üretilir.** Bulut TTS servisi, yapay zekâ ses API'si,
> başka bir makine, CI ya da bulut/uzak oturum ile ses üretilmez; anlatım metni hiçbir dış servise
> gönderilmez. `~/tts-shorts` içindeki yerel modeller bulunamıyorsa ses üretilmez, başka bir yol
> denenmez; durum kullanıcıya bildirilir.

## 1. Yapı

- Düz HTML/CSS/JS. Derleme adımı, paket yöneticisi, çatı (framework) yok; dosya açılınca çalışır.
- Tek dosyalık uygulama `docs/<ad>.html`, çok dosyalı uygulama `docs/<ad>/index.html` olur.
- Her uygulama `docs/apps.js` listesine bir kayıtla eklenir; ana ekran (`docs/index.html`) kartı kendisi üretir.
  Karttaki özellik listesine yalnızca gerçekten yayında olan özellikler yazılır.
- "Yakında" kartı (`soon: true`) eklenirken `planlar/<ad>.md` çalışma planı yazılır ve kayda `plan` alanı
  konur. Uygulamaya başlamadan önce o plan ve `planlar/README.md` (ortak yöntem) okunur; plandaki
  "Kullanıcıya sorulacaklar" sorulmadan içerik yazılmaz.
- Çok dosyalı uygulamada kısa bir `README.md` bulunur: dosyalar, veri kaynağı, bilinen eksikler.
- Dış bağımlılık en azda tutulur; yazı tipleri dışında uzak betik yüklenmez.

## 2. Kaynak kesinliği

Dinî içerikte hata kabul edilmez. Emin olunmayan bilgi yazılmaz.

- Kur'an metni Tanzil'den değiştirilmeden alınır; elle yazılmaz, hareke eklenip çıkarılmaz.
  Ayet metni ve meal `tools/lib/tanzil-ayetler.mjs` ile üretilir (Arapça: Tanzil Simple, meal: Diyanet İşleri,
  Tanzil tr.diyanet). Bu mealde bazı ayet grupları tek metin hâlindedir; üretici böyle bir ayet tek başına
  verilirse durur ve aralığın (ör. `83:1-3`) yazılmasını ister. Bir ayete, ona ait olmayan bir anlam yüklenmez.
- Anlam (meal) Diyanet yayınlarından alınır ve hangi yayından alındığı belirtilir.
- Hadis yalnızca sahih kaynaklardan (öncelikle Buhârî ve Müslim) ve kitap/bölüm adı ile numarasıyla verilir.
  Başka kaynaktan alınan rivayette kaynak ve sıhhat durumu açıkça yazılır.
- Dua ve zikirler yalnızca doğrulanmış kaynaklardan alınır. Her ögenin `kaynak` alanı doludur.
- Âlim görüşü aktarılırken kimin görüşü olduğu söylenir; mezhep farkı varsa belirtilir.
- Hafızadan yazılan içerik yayınlanmadan önce kaynağıyla karşılaştırılır.
  Karşılaştırılamayan içerik kullanıcıya "doğrulanmadı" diye bildirilir.
- İçerik değişikliği gerektiren bir tutarsızlık bulunursa sessizce düzeltilmez; kullanıcıya sorulur.
- Bu kurallar anlatım metinleri için de aynen geçerlidir.

## 3. İçerik kalıbı

Her öge (sure, dua, zikir, namazın bir adımı, bir nafile namaz) aynı sırayla sunulur:

1. **Ad** ve varsa Arapça adı.
2. **Arapça metin**, **okunuş** ve **anlam**. Kullanıcı üçünü ayrı ayrı açıp kapatabilir.
3. **Kısa açıklama / tefsir**: 2–4 cümle. Ne zaman okunur ya da yapılır, ne anlatır.
4. **Hikmet** ("Akılda kalsın"): tek cümle. Ögenin özünü akılda tutacak biçimde söyler.
5. **Kaynak**: ayet numarası ya da hadis künyesi.

Dil sade, doğru ve saygılıdır; süslü ya da abartılı anlatım kullanılmaz.

## 4. Tema

- İki tema vardır: **çocuk** ve **yetişkin**. İçerik iki temada aynıdır; yalnızca ton ve görünüm değişir.
  - Yetişkin: samimi ve ciddi. Zümrüt ve altın tonları, serifli başlıklar, çizgi ikonlar, sade yüzeyler.
  - Çocuk: sıcak renkler, yuvarlak yazı tipi, emoji vurguları, cesaretlendiren kısa cümleler.
- Her temanın açık ve koyu rengi bulunur.
- Tema ana ekranda (`docs/`) seçilir ve uygulamaya taşınır; uygulamanın içinden de değiştirilebilir.
- Ortak `localStorage` anahtarları (bütün uygulamalar bunları okur ve yazar):
  - `apps:tema` → `cocuk` | `yetiskin` (varsayılan `yetiskin`)
  - `apps:ses` → `erkek` | `kadin` (anlatım sesi; varsayılan `erkek`). Yalnızca uygulamada
    yayında olan anlatım kaydı varsa kullanılır; kayıt yoksa ses seçimi gösterilmez.
    Üretilen kayıtlarda ses temaya bağlıdır: yetişkin = erkek sesi, çocuk = kadın sesi (6. bölüm).
  - `theme` → `dark` | `light` (sitenin geneliyle ortak)
- Renkler ve ölçüler CSS değişkenleriyle (token) tanımlanır; tema değişimi yalnızca değişkenleri değiştirir.

## 5. Yerleşim ve erişilebilirlik

- Önce telefon: 320 piksel genişlikte yatay taşma olmaz. 390 ve 1280 pikselde de denenir.
- Kart içerikleri ortalıdır; geniş ekranda alt çubuk yerine yan menü kullanılır.
- Dokunma hedefleri en az 44 piksel; klavye ile gezilebilir; `aria-*` etiketleri doludur.
- Geçişler akıcıdır ama `prefers-reduced-motion` ayarına uyar.
- Sayfalar arası geçiş için `@view-transition { navigation: auto; }` kullanılır.

## 6. Sesli anlatım: metin + yalnızca bu bilgisayarda üretilen ses

Her uygulama için seslendirmeye hazır iki anlatım hazırlanır ve sesi bu bilgisayarda yerel
modellerle üretilir. Bu bir stüdyo değildir (Herbadex Studio gibi arayüz, sunucu, yayın işi
yapılmaz); yalnızca metin ve ondan üretilen ses dosyaları vardır.

### 6.1 Yerel üretim kuralı (kesin)

- Ses **yalnızca bu bilgisayarda**, `tools/tts/seslendir.py` ile üretilir. Motor `tools/tts/neural_tts.py`
  (Herbadex Studio'daki betiğin aynısı); modeller `~/tts-shorts` içindedir ve çevrimdışı
  (`HF_HUB_OFFLINE=1`) okunur. Kurulum: `tools/tts/README.md`.
- Yapılmayanlar: bulut TTS servisi (ElevenLabs, Google, Azure, OpenAI vb.), yapay zekâ ses API'si,
  tarayıcıda TTS (`speechSynthesis`), başka bir makinede, CI'da (GitHub Actions) ya da bulut/uzak
  oturumda ses üretimi, anlatım metnini bir dış servise göndermek, ses indirmek.
- Yerel modeller bulunamıyorsa (ör. başka bir makinede ya da bulut oturumunda çalışılıyorsa) ses
  üretilmez, başka bir yol denenmez; yalnızca metin hazırlanır ve kullanıcıya bildirilir.
- Yeni motor ancak kullanıcı isterse eklenir; yerel çalışmalı ve lisansı ticari kullanıma açık olmalıdır.

### 6.2 Profil ve ses

| Profil (`apps:tema`) | Ses | Motor |
| --- | --- | --- |
| `yetiskin` | erkek | Antalia-2 Mini |
| `cocuk` | kadın | EMA Lightning |

İçerik iki profilde aynıdır. Çocuk profili için tonu farklı bir metin gerekirse o durak için
`cocuk/<dosya>` kaydı yazılır (Namaz'daki gibi); `seslendir.py` o profilde onu okur.

### 6.3 Anlatım metni: tam + parçalı

- Metinler depo kökündeki `tools/<ad>-anlatim.json` dosyasında tutulur. Biçim ortaktır:
  - `_aciklama`: dosyanın ne olduğu, nasıl üretildiği.
  - `tam` (**tam anlatım**): bütün duraklar sırayla, tek kayıt → `tam.mp3`. `tools/lib/tam-anlatim.mjs`
    → `tamAnlatim(duraklar, { baslik, acilis })` ile duraklardan türetilir; yeni bilgi eklenmez.
    Giriş durağı olmayan uygulamada `acilis` yalnızca uygulamanın adı ve konusudur.
  - `duraklar` (**parçalı anlatım**): her durak için bir kayıt → `dosya` (kaydın adı), `baslik`, `tur`, `parcalar`.
  - `parcalar`: sırayla seslendirilen parçalar. Parça ya bir metindir ya da `[metin, duraklama]` çiftidir;
    duraklama o parçadan sonraki sessizliktir (saniye).
- İçerik uygulama verisinden üretilir: üretici betik `tools/<ad>-anlatim.mjs` (`node tools/<ad>-anlatim.mjs`);
  veri değişince metin yeniden üretilir, JSON elle düzenlenmez.
- Anlatım metni uygulamada gösterilmez. Sayfaya gömülmez, uygulama tarafından yüklenmez.
- Metin ekrandaki metnin kopyası değildir; kulak için yazılır:
  - Kısa, tek fikirli cümleler; yer yer duraklama.
  - Sayılar yazıyla ("yedi ayet"), kısaltmalar açık ("sallallahu aleyhi ve sellem"), parantez, simge ve
    emoji yoktur. Ayet/hadis numarası gerekiyorsa söylenecek biçimde yazılır.
  - Arapça metin ve okunuş anlatıma girmez; kıraat yalnızca gerçek kâri kaydından çalınır.
- Kaynak kesinliği (2. bölüm) anlatım metninde de geçerlidir; ekrandaki içerikle çelişen bir şey söylenmez.

### 6.4 Ses dosyaları

- Komut: `python3 tools/tts/seslendir.py <ad>` (ya da `--hepsi`). İki profil, tam + parçalı anlatım.
  Metni değişmeyen kayıt yeniden üretilmez; metin değişince komut yeniden çalıştırılır.
- Çıktı: `docs/<ad>/anlatim/<profil>/tam.mp3`, `docs/<ad>/anlatim/<profil>/<dosya>.mp3` ve
  süreleri tutan `docs/<ad>/anlatim/<profil>/kayitlar.json` (elle düzenlenmez).
  Ses: mono MP3, 24 kHz, 32 kbps, −18 LUFS.
- Ses dosyaları `sw.js` önbelleğine eklenmez (7. bölüm).
- Yeni uygulama da aynı yolu izler: önce `tools/<ad>-anlatim.mjs` (tam + duraklar), sonra `seslendir.py`.
- Üretilen ses yayından önce kullanıcıya dinletilir: içerik ve telaffuz kontrol edilir. Yanlış okunan
  kelime metinde okunuşa göre düzeltilir (üreticide), ses yeniden üretilir.
- Oynatıcı ortaktır: `docs/anlatim.js` + `docs/anlatim.css` (`sw.js` önbelleğinde). Sayfa ikisini yükler
  (`../anlatim.css` uygulama stilinden sonra; `../medya.js` ve hemen ardından `../anlatim.js` uygulama
  betiğinden önce) ve yer tutucu koyar:
  - Ana ekranın hero bölümünde, `lead` paragrafından sonra: `<div data-anlatim="tam giris"></div>`
    (giriş durağı yoksa `tam`).
  - Her durağın sayfasında, aynı yerde: `<div data-anlatim="<dosya>"></div>`; dosya adı numarayla
    başlıyorsa ve ad uygulamada yoksa `"05-*"` gibi önek yazılır.
  Oynatıcı yer tutucuyu kendisi doldurur; kaydı olmayan satırı göstermez. Ses temadan gelir (yetişkin:
  `yetiskin/` erkek, çocuk: `cocuk/` kadın), ayrı ses seçimi yoktur; tema değişince çalan anlatım durur.
  Çalan kaydın satırı sayfada yoksa altta küçük oynatıcı görünür. Tam anlatımda kalınan yer hatırlanır.
  Duraklar sırayla çalar ve kilit ekranından yönetilir (6.5).
- Uygulamanın başka bir sesi varsa (Ezberler kıraati) iki ses aynı anda çalmaz: o ses başlayınca
  `window` üzerinde `apps:ses` olayı gönderilir, anlatım başlayınca gelen `apps:ses` olayında durdurulur.
- Yeni uygulamada her durağın bir kaydı olduğu denetlenir (yer tutucu anahtarı ↔ `kayitlar.json`);
  karttaki özellik listesine "Sesli anlatım" ancak oynatıcı bağlanınca yazılır.
- Namaz Yolculuğu'ndaki mevcut kayıtlar (`docs/namaz-audio/`) olduğu gibi kalır; tek dosyalık uygulama
  olduğundan `seslendir.py` onu üretmez.
- Uygulamaya özel ayar (Ayet Ayet Arapça): anlatım dosyasında `ayarlar.profiller` (ör. yalnızca
  `yetiskin`), `ayarlar.kbps` (MP3 bit hızı; varsayılan 32, bu uygulamada 24) ve `ayarlar.cikis` (kayıtların ayrı ses deposuna yazılması, `../arapca-ses`); sayfada
  `<html data-anlatim-kok="/arapca-ses/" data-anlatim-profil="yetiskin">`. Kayıt adı alt klasör içerebilir
  (`c01/s002`), `{ "bolum": "2:2" }` parçası kayıt içinde bölüm işaretler, `data-anlatim="c01/s002#2:2"`
  o bölümü çalar. Bu uygulamada bütün uygulama için tek `tam` kayıt yoktur (saatler sürerdi); ana ekranda
  `giris` çalınır. Ayrıntı: `planlar/ayet-ayet-arapca.md`.

### 6.5 Kilit ekranı ve bildirim paneli oynatıcısı (sıralı çalma)

Ses çalan her oynatıcı (anlatım, kıraat ve sonradan eklenecek her ses), ekran kilitliyken ya da
uygulama arka plandayken telefonun bildirim panelinde ve kilit ekranında müzik çalar gibi görünür ve
sıradaki kayda kendiliğinden geçer. Bu iş yalnızca ortak `docs/medya.js` (Media Session API) ile yapılır;
`navigator.mediaSession` başka bir dosyada doğrudan kullanılmaz.

- **Yükleme:** ses çalan her sayfa `medya.js`'i, onu kullanan betiklerden önce yükler
  (`<script src="../medya.js"></script>`; tek dosyalık uygulamada `medya.js`). `sw.js` önbelleğindedir.
- **Bağlama:** oynatıcı her parça başladığında ve parça değiştiğinde
  `AppsMedya.ayarla('<sahip>', { audio, baslik, sanatci, album, oynat, duraklat, kapat, onceki, sonraki, git, konum })`
  çağırır; kapanınca `AppsMedya.birak('<sahip>')`. Sahip adları: `anlatim`, `kiraat`, `namaz`; yeni ses
  türü kendi adını alır. Sayfada tek oturum vardır, son çalmaya başlayan ses sahibidir. Oturum,
  `apps:ses` olayı gönderildikten **sonra** alınır (önce gönderilirse diğer oynatıcının `birak` çağrısı
  oturumu silebilir).
- **Bildirimde görünen metin:** `baslik` = kaydın/ayetin adı, `sanatci` = uygulama adı ve ses ("erkek
  sesi") ya da kâri adı, `album` = tür ve sıra ("Sesli anlatım · 3 / 12"). Kapak `docs/icons/` içindeki
  uygulama simgesidir; başka görsel verilmez.
- **Sıra:** `onceki` / `sonraki` yalnızca o yönde kayıt varsa verilir (yoksa düğme pasif kalır).
  "Önceki", parçanın üçüncü saniyesinden sonra basılırsa parçanın başına döner. Anlatımda sıra
  `kayitlar.json` sırasıdır (tam anlatım ve bölüm kayıtları `kayıt#bölüm` sıraya girmez); kıraatte sure /
  sayfanın ayet sırası; Namaz'da durak sırası.
- **Sırayla dinle:** ortak ayar `localStorage` `apps:anlatim-sirali` (`1` | `0`, varsayılan açık).
  Anlatımda durak satırındaki düğmeyle, Namaz'da Sesli Rehber panelindeki anahtarla değiştirilir.
- **Kesin kurallar (iOS ve Android'de kesintisiz çalması için):**
  - Oynatıcı başına **tek** ses öğesi kullanılır; parça değişince aynı öğenin `src`'i değişir. Her parça
    için yeni `new Audio()` açılmaz.
  - Parça bitince (`ended`) sıradaki parça **aynı olay içinde hemen** başlatılır. `setTimeout` ile
    beklenecekse yalnızca sayfa görünürken beklenir (`document.hidden` ise beklemeden geçilir).
  - Önceki/sonraki varken 10 sn ileri/geri sarma tanımlanmaz (iOS ikisinden yalnızca birini gösterir);
    `medya.js` bunu kendisi yapar. Konum ve hız `setPositionState` ile kilit ekranına yazılır.
  - Ses `speechSynthesis` ile çalınmaz (kilit ekranında durur; 6.1 zaten yasaklar), yalnızca dosyadan çalınır.
  - 5 saniyeden kısa sesler (Arapça'da tek kelime) oturum almaz: `birak` çağrılır.
- **Deneme:** yeni ya da değişen oynatıcıda tarayıcıda şu denetlenir: `AppsMedya.sahip()` doğru, başlık
  ve sıra doğru, son parçada `nexttrack` yok, parça bitince sıradaki başlıyor, iki ses arasında geçişte
  oturum el değiştiriyor, kapatınca `playbackState` `none`. Gerçek telefonda kilit ekranı denenemediyse
  bu açıkça bildirilir.
- **Bilinen sınırlar (kullanıcıya söylenecekler):** WhatsApp / Instagram gibi uygulamaların içindeki
  tarayıcı bildirim oynatıcısını göstermez; bağlantı Chrome / Safari'de açılmalı ya da uygulama ana
  ekrana eklenmelidir. Bazı Android markalarında (Xiaomi, Huawei vb.) pil tasarrufu arka plandaki sekmeyi
  kapatabilir.

## 7. PWA: ana ekrana ekleme ve güncelleme

`docs/` tek bir kurulabilir uygulamadır (PWA). Adı **Mektep**: manifest `name`/`short_name`, her sayfadaki
`apple-mobile-web-app-title`, ana ekran başlığı ve `pwa.js` metinleri bu adı kullanır ("Uygulamalar" denmez;
uygulamaların listesi için ara başlık olarak kullanılabilir). Kapsam `/mektep/`; ana ekrana eklenince ana ekran
(`docs/index.html`) açılır, uygulamalar oradan açılır.

- Dosyalar: `docs/manifest.webmanifest`, `docs/sw.js` (service worker), `docs/pwa.js`, `docs/icons/`.
- Her sayfa (`docs/` altındaki her uygulama) şunları içerir:
  `<link rel="manifest">`, `<link rel="apple-touch-icon">`, `apple-mobile-web-app-title` ve en sonda `pwa.js`.
  Yollar sayfanın konumuna göredir (ör. `docs/<ad>/index.html` için `../manifest.webmanifest`, `../pwa.js`).
- Uygulamanın yerel dosyaları `sw.js` içindeki `ONBELLEK` listesine eklenir; böylece çevrimdışı açılır.
  Ses kayıtları ve başka sitelerden gelen dosyalar önbelleğe alınmaz.
- `apps.js` içinde yayımlanan bir uygulama (`soon` olmayan, `href`'i olan) kullanıcıya bir kez bildirilir:
  yeni sürüm penceresinde ve ana ekrandaki "Yeni uygulama" penceresinde adıyla gösterilir.
- **Yayından önce her seferinde** `node tools/pwa-surum.mjs` çalıştırılır. Komut önbellekteki dosyaların
  içeriğinden `SURUM` üretir; sürüm değişmezse kullanıcılar güncellemeyi görmez.
- Manifest'teki `shortcuts` yayımlanan uygulamalarla güncel tutulur.
- Uygulama olarak yüklendiğinde (standalone / tam ekran) `docs/index.html` telefon ana ekranı gibi açılır
  (`launcher.js`, `launcher.css`; tarayıcıda önizleme: `docs/index.html` + `?launcher`). Simge ızgarası `apps.js`'ten çizilir;
  her kayıtta simgenin altındaki kısa ad için `short` alanı bulunur. Tarayıcıdaki görünüm değişmez.
- **Favoriler** (yalnızca ana ekranda, `docs/index.html`): `docs/favori.js` + `docs/favori.css`. Kayıt
  `localStorage` `apps:favoriler` (kimlik dizisi; sıra = gösterim sırası); tarayıcı görünümü (`hub.js`: kart
  yıldızı + "Favorilerim" şeridi) ve yüklü uygulama görünümü (`launcher.js`: "Favoriler" ızgarası, panelde
  "Favorilere ekle", uzun basınca düzenleme) aynı kaydı kullanır. Düzenlemede sürükle-bırak (`AppsFav.sortable`,
  Pointer Events), ok tuşlarıyla taşıma, Delete / × / − ile çıkarma vardır; her değişiklik `aria-live` ile duyurulur.
  Yalnızca yayımlanan uygulama favori olabilir; `apps.js`'e eklenen uygulama kendiliğinden yıldız alır.
- Sayfa içi tasarım `pwa.js` pencerelerine dokunmaz; pencereler kendi stilini taşır ve
  sayfanın açık/koyu rengine uyar.

## 8. Çalışma biçimi

- Değişiklik tarayıcıda denenmeden gönderilmez: iki tema, açık/koyu, 320/390/1280 piksel.
  Ses çalan bir şey değiştiyse 6.5'teki kilit ekranı denetimi de yapılır.
- Anlatım metni değiştiyse JSON'un geçerli olduğu ve her ögenin bir kaydı bulunduğu denetlenir;
  ardından ses bu bilgisayarda `python3 tools/tts/seslendir.py <ad>` ile yeniden üretilir.
- Denenemeyen şey (gerçek cihaz, canlı site) açıkça bildirilir.
- `docs/` altında bir şey değiştiyse göndermeden önce `node tools/pwa-surum.mjs` çalıştırılır.
- Biten iş `main` dalına gönderilir; site GitHub Pages ile oradan yayınlanır.
