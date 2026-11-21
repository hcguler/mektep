# Esmâ-ül Hüsnâ

Allah'ın doksan dokuz güzel ismi: Arapçası, okunuşu, anlamı, kısa açıklaması, Kur'an'da geçtiği ayet
ve kula yansımasıyla. Kart kart keşfedilir ve ezberlenir.
Yayın adresi: https://hcguler.github.io/mektep/esma/

## Bölümler

- **İsimler:** Günün ismi, sahih hadis, arama ve süzgeçle (hepsi / kalan / ezber) 99 isim.
- **İsim sayfası:** Arapça (Tirmizî metninden), okunuş, anlam, açıklama, ayet (Arapça ve anlam ayrı
  ayrı açılıp kapanır), Akılda kalsın, kaynak.
- **Kartlar:** Arapça isim önde, anlam arkada; "Biliyorum" ezberler, "Tekrar" desteye geri koyar.
- **Ezberim:** İlerleme ve ezberlenen isimler.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `esma.css`, `esma.js` | Uygulama. |
| `data.js` | Türkçe içerik: okunuş, anlam, açıklama, Akılda kalsın, ayet numarası, kök. Elle düzenlenir. |
| `isimler.js`, `ayetler.js` | Arapça isimler ve ayetler. **Elle düzenlenmez**; `node tools/esma-uret.mjs` üretir. |

`tools/esma-anlatim.mjs` gizli anlatım metnini (tam + parçalı, `tools/esma-anlatim.json`) üretir.
İçerik değişince sırasıyla `node tools/esma-uret.mjs`, `node tools/esma-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Doksan dokuz isim hadisi:** Buhârî, Şurût, 2736; Tevhîd, 7392; Müslim, Zikir, 2677 (sahih).
- **İsimlerin listesi ve sırası:** Tirmizî, Daavât, 3507. Arapça isimler bu rivayetin metninden
  (fawazahmed0/hadith-api, ara-tirmidhi) değiştirilmeden alınır; üretici sıranın `data.js` ile aynı olduğunu
  denetler. **Sıhhat:** Tirmizî rivayeti garîb olarak niteler; Ahmed Şâkir, Elbânî ve Zübeyr Ali Zâî zayıf
  sayar; isimlerin bir ravi tarafından derlenmiş olabileceği belirtilir. Uygulamada bu durum açıkça yazılır.
- **Ayetler:** Tanzil (Simple) ve Diyanet İşleri meali (Tanzil, tr.diyanet), `tools/lib/tanzil-ayetler.mjs`
  ile; birleşik mealler aralık olarak gösterilir. Üretici, her ayetin ilgili ismin kökünü içerdiğini metin
  üzerinde denetler. 91 isim ayetle gösterilir (isim ya da aynı kökten fiil/kelime olarak); 8 isim Kur'an'da
  bu kalıpta geçmez: el-Hâfıd, el-Vâcid, el-Mâcid, el-Muksit, el-Mâni', en-Nâfi', er-Reşîd, es-Sabûr.
- **Anlam ve açıklamalar:** Yaygın Türkçe açıklamalara göre kısa tutulmuştur; Diyanet ve TDV kaynaklarıyla
  çevrimiçi karşılaştırılamamıştır.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (ezberlenenler, görünüm
tercihleri, süzgeç, deste) `esma:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py esma` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
