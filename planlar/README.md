# "Yakında" uygulamalarının planları

`docs/apps.js` içinde `soon: true` olan her kaydın `plan` alanı buradaki bir dosyayı gösterir; yayınlanan uygulamaların planları da burada kalır.
Plan, uygulama **yapılmaya başlanmadan önce** okunacak çalışma talimatıdır (prompt): amaç, kapsam, kaynaklar,
veri modeli, ekranlar, anlatım, doğrulama ve yayın adımları.

| Uygulama | `apps.js` kimliği | Plan | Durum |
| --- | --- | --- | --- |
| Oruç Rehberi | `ramazan` | [oruc-rehberi.md](oruc-rehberi.md) | 1. sürüm yayında (16.11.2026) |
| Sureler Atlası | `sureler` | [sureler-atlasi.md](sureler-atlasi.md) | 2. sürüm yayında: 114 surede konu özeti (16.11.2026) |
| Sahabe Hayatları | `sahabe` | [sahabe-hayatlari.md](sahabe-hayatlari.md) | 1. sürüm yayında (16.11.2026) |
| Zekât ve Sadaka Rehberi | `zekat` | [zekat-sadaka-rehberi.md](zekat-sadaka-rehberi.md) | 1. sürüm yayında (16.11.2026) |
| Kur'an'da Hayvanlar | `hayvanlar` | [kuran-hayvanlar.md](kuran-hayvanlar.md) | 1. sürüm yayında (16.11.2026) |
| Ayet Ayet Arapça | `arapca` | [ayet-ayet-arapca.md](ayet-ayet-arapca.md) | Cüz cüz yayında |
| Kur'an'dan Mucizeler | `mucizeler` | [kuran-mucizeler.md](kuran-mucizeler.md) | 1. sürüm yayında (20.11.2026) |

Yayınlanan uygulamanın planı silinmez: sonraki sürümler ve kaynak kararları için başvuru olarak kalır.

## Kullanım

Yeni oturumda şöyle başlanır:

> `planlar/<plan>.md` dosyasındaki planı uygula. Önce `CLAUDE.md`, `planlar/README.md`
> ve plandaki "Başlamadan önce" bölümünü oku; "Kullanıcıya sorulacaklar" listesini bana sor, cevapları
> almadan içerik yazma.

## Ortak yöntem (her plan için geçerli)

Her plan bu yöntemi izler; plandaki özel kurallar bunlara eklenir, bunları gevşetmez.

### 1. Başlamadan önce

1. `CLAUDE.md` baştan sona okunur. Örnek alınacak uygulama `docs/namaz.html`; yapı olarak en yakın çok
   dosyalı örnek plan içinde belirtilir (çoğunlukla `docs/siyer/` ya da `docs/dualar/`).
2. Örnek uygulamanın `index.html`, `<ad>.css`, `<ad>.js`, `data.js`, `README.md` dosyaları ve
   `tools/<ad>-uret.mjs`, `tools/<ad>-anlatim.mjs` üreticileri okunur. Yeni uygulama aynı iskeleti kullanır:
   üst çubuk, alt sekme çubuğu (geniş ekranda yan menü), görünüm penceresi (tema + renk), kaynaklar penceresi,
   hash yönlendirme (`#/`, `#/<tür>/<id>`), `localStorage` anahtarı `<ad>:v1`.
3. Plandaki "Kullanıcıya sorulacaklar" listesi kullanıcıya sorulur. Cevaplar gelmeden içerik yazılmaz.
4. Kapsam küçük bir ilk sürümle başlar (plandaki "1. sürüm"); geri kalanı sonraki dalgalara bırakılır.

### 2. İçerik ve kaynak

- Kaynak kesinliği (`CLAUDE.md`, 2. bölüm) kesindir. Hafızadan yazılan her bilgi kaynağıyla
  karşılaştırılır; karşılaştırılamayan bilgi yazılmaz ya da kullanıcıya "doğrulanmadı" diye bildirilir.
- Ayet metni ve meali yalnızca `tools/lib/tanzil-ayetler.mjs` ile üretilir (`tools/<ad>-uret.mjs`).
- Hadis künyesi (kitap, bölüm, numara) `tools/siyer-uret.mjs`'teki gibi fawazahmed0/hadith-api ile otomatik
  denetlenir; numara tutmazsa üretici durur. Buhârî ve Müslim dışındaki rivayette kaynak ve sıhhat yazılır.
- Fıkhî hükümde Diyanet İşleri Başkanlığı esas alınır (İlmihal, Din İşleri Yüksek Kurulu kararları,
  `fetva.diyanet.gov.tr`). Hanefî görüş ana metin; Şâfiî (ve gerekiyorsa diğer mezhepler) farkı ayrı notla.
- Yıllık değişen değerler (nisap, fitre, fidye tutarı, takvim tarihleri) koda yazılmaz; `data.js` içinde
  tarih ve kaynakla tutulur, ekranda "şu tarihte Diyanet'in açıkladığı değer" diye gösterilir.
- Her ögenin `kaynak` alanı doludur. İçerik kalıbı: ad · (varsa) Arapça, okunuş, anlam · 2–4 cümle açıklama ·
  "Akılda kalsın" · kaynak.
- Peygamberlerin ve sahabenin yüzü, bedeni çizilmez; görseller simge, harita, desen ve yazıyla sınırlıdır.

### 3. Dalgalar hâlinde üretim

İçerik 8–12 ögelik dalgalarla yazılır. Her dalgada:

1. Ögeler `data.js`'e yazılır (taslak).
2. Üretici çalışır (`node tools/<ad>-uret.mjs`): ayetler ve hadis künyeleri denetlenir.
3. Her öge kaynağıyla tek tek karşılaştırılır; çelişki varsa sessizce düzeltilmez, kullanıcıya sorulur.
4. Dalganın özeti kullanıcıya gösterilir (öge adları, kullanılan kaynaklar, doğrulanamayanlar).

### 4. Ekran ve kalite

- Önce telefon: 320 piksel genişlikte yatay taşma olmaz; 390 ve 1280 pikselde de denenir. İki tema (çocuk,
  yetişkin), açık ve koyu renk. Dokunma hedefi en az 44 piksel, klavyeyle gezilebilir, `aria-*` dolu,
  `prefers-reduced-motion` uyulur.
- Çocuk teması: sıcak renk, yuvarlak yazı, emoji, kısa ve cesaretlendiren cümleler; içerik aynıdır.

### 5. Sesli anlatım (yalnızca bu bilgisayarda)

1. `tools/<ad>-anlatim.mjs` yazılır: `data.js`'ten kulak için anlatım üretir; `tam` kaydı
   `tools/lib/tam-anlatim.mjs` ile, `duraklar` her öge için (`giris` + ögeler). Sayılar yazıyla, kısaltma
   açık, parantez/simge/emoji yok, Arapça metin ve okunuş okunmaz.
2. `python3 tools/tts/seslendir.py <ad>`: yetişkin = erkek sesi, çocuk = kadın sesi. Ses yalnızca bu
   bilgisayarda yerel modellerle üretilir; bulut TTS yasaktır. Model yoksa ses üretilmez, kullanıcıya söylenir.
3. Oynatıcı: `../anlatim.css` + `../anlatim.js` yüklenir; ana ekranda `data-anlatim="tam giris"`, her ögenin
   sayfasında `data-anlatim="<dosya>"`. Her ögenin kaydı olduğu denetlenir.
4. Birkaç kayıt kullanıcıya dinletilir; yanlış okunan kelime anlatım üreticisinde okunuşa göre düzeltilir.

### 6. Yayın

1. `docs/apps.js` kaydında `soon` ve `plan` kaldırılır; `href`, `features` (yalnızca yayındaki özellikler,
   "Sesli anlatım" dahil) eklenir.
2. `docs/sw.js` → `ONBELLEK` listesine uygulama dosyaları; `manifest.webmanifest` → `shortcuts`.
3. Sayfaya manifest bağlantısı, `apple-touch-icon`, `apple-mobile-web-app-title` ve en sonda `../pwa.js`.
4. `docs/<ad>/README.md`: dosyalar, kaynaklar, doğrulama, bilinen eksikler.
5. `node tools/pwa-surum.mjs`; tarayıcıda son deneme; plan dosyası "yayınlandı" notuyla bırakılır.
