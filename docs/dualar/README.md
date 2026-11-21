# Kur'an Duaları

Kur'an'da peygamberlerin ve müminlerin ettiği kırk üç dua: Arapçası, okunuşu, anlamı, kimin hangi
durumda ettiği ve ayetiyle. Duruma göre dua bulunur, kartlarla ezberlenir.
Yayın adresi: https://hcguler.github.io/mektep/dualar/

## Bölümler

- **Dualar:** Günün duası, arama, süzgeç (hepsi / kalan / ezber) ve iki grup: peygamberlerin duaları
  (24) ve müminlerin duaları (19).
- **Dua sayfası:** Arapça, okunuş ve anlam (üçü ayrı ayrı açılıp kapanır, Arapça yazı büyütülür),
  "Ne zaman, kim söyledi?", ayetin tamamı, duruma ve Peygamberler Yolculuğu'ndaki durağa bağlantı,
  Akılda kalsın, Ezberledim, kaynak.
- **Duruma göre:** On durum (tövbe, sıkıntı, sabır, aile, ilim, şükür, tevekkül, korunma, iman, ahiret).
- **Kartlar:** Önde Arapça; arkada okunuş, anlam ve kaynak. "Biliyorum" ezberler, "Tekrar" desteye koyar.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `dualar.css`, `dualar.js` | Uygulama. |
| `data.js` | Dua listesi: ad, kim, durum, ayet ve kesit işaretleri, okunuş, bağlam, Akılda kalsın. Elle düzenlenir. |
| `metinler.js` | Arapça ve meal. **Elle düzenlenmez**; `node tools/dualar-uret.mjs` üretir. |

`tools/dualar-anlatim.mjs` gizli anlatım metnini (tam + parçalı, `tools/dualar-anlatim.json`) üretir;
Arapça ve okunuş anlatıma girmez. İçerik değişince sırasıyla `node tools/dualar-uret.mjs`,
`node tools/dualar-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Arapça:** Tanzil (Simple), değiştirilmeden. Dua ayetin bir parçasıysa üretici `bas` / `basNo` / `son`
  (harekesiz kelime) ile kelime sınırından keser; birden çok ayetse ayet sonları ﴿n﴾ ile gösterilir.
- **Meal:** Diyanet İşleri meali (Tanzil, tr.diyanet), değiştirilmeden. Dua kısmı `mealBas` / `mealSon`
  işaretleriyle kesilir; işaret bulunmazsa üretici durur. Bu mealde birlikte çevrilmiş ayet grupları
  (Âl-i İmrân 16-17, A'râf 125-126, Yûnus 85-86, Tâhâ 25-35, Furkān 65-66, Şuarâ 75-89) bütün alınır
  ve "Ayetin tamamı"nda gösterilir.
- **Okunuş:** Türkçe harflerle elle yazılmıştır; hazır bir Türkçe okunuş kaynağı yoktur. Üretici her
  okunuşun **ünsüz iskeletini** Arapça metinden çıkarılan iskeletle karşılaştırır (harekeler, uzatma
  harfleri, ayın ve hemze düşer; şemsî harflerde lâm düşer; durakta tenvin okunmaz, tâ-i merbûta "h"
  okunur). 43 okunuşun hepsi bu denetimden geçer. **Ünlüler ve uzatmalar (â, î, û) denetlenmez.**
- **Bağlam:** Yalnızca ayetin kendisinden ve yakın ayetlerden; Kur'an'da geçmeyen ad ya da olay yazılmaz
  (ör. Firavun'un eşi, Âdem'in eşi adlarıyla anılmaz).
- **Doğrulanmadı:** "Akılda kalsın" cümleleri yorum cümleleridir.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (ezberler, görünüm tercihleri,
süzgeç, deste, son dua) `dualar:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py dualar` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
