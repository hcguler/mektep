# Ezberler

Kısa sureler (Fâtiha, Duhâ → Nâs), namaz duaları ve zikirler için statik ezber uygulaması.
Yayın adresi: https://hcguler.github.io/mektep/ezberler/

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `ezberler.css`, `ezberler.js` | Uygulama. Derleme adımı yoktur. |
| `data.js` | Bütün içerik: Arapça metin, okunuş, anlam, kısa tefsir, kaynak. Elle düzenlenebilir. |
| `audio/` | Ayet ses dosyaları (`SSSAAA.mp3`) ve `manifest.json`. |

Depo kökündeki `tools/` klasöründe:

| Dosya | Görev |
| --- | --- |
| `tools/ezberler-anlatim.json` | Her ezber için sesli anlatım metni (ad + anlam + kısa tefsir; tam + parçalı). Ekranda gösterilmez; biçimi `tools/namaz-anlatim.json` ile aynıdır. |
| `tools/ezberler-anlatim.mjs` | `data.js` değişince anlatım metnini yeniden üretir: `node tools/ezberler-anlatim.mjs` |
| `tools/ezberler-ses-indir.py` | Suûd eş-Şüreym ayet kayıtlarını `audio/` altına indirir ve `audio/manifest.json` yazar. |

## Ses

Uygulama yalnızca Suûd eş-Şüreym kıraatini çalar. `audio/manifest.json` içinde listelenen
dosyalar siteden, listelenmeyenler EveryAyah.com üzerinden çalınır.

Dosyaları depoya almak için bilgisayarda `python3 tools/ezberler-ses-indir.py` çalıştırıp
`docs/ezberler/audio` klasörünü commit edin. Ardından `node tools/pwa-surum.mjs` çalıştırın.

## Anlatım metinleri

Her ezber için seslendirmeye uygun anlatım metni `tools/ezberler-anlatim.json` içinde tutulur.
Bu metinler yalnızca manuel seslendirme sürecinde kullanılmak üzere hazırlanır; uygulama içinde
gösterilmez ve otomatik ses dönüşümü yapılmaz. `data.js` değişince metni yeniden üretmek için:

```sh
node tools/ezberler-anlatim.mjs
```

Arapça metin ve okunuş otomatik seslendirilmez. Kıraat oynatıcısı yalnızca Suûd eş-Şüreym
kayıtlarını kullanır. Manuel olarak hazırlanan anlatım kayıtları uygulamaya bağlanmadan önce
kalite ve içerik açısından ayrıca denetlenmelidir.

## Görünüm

Görsel dil Namaz Yolculuğu ile ortaktır (bkz. `CLAUDE.md`): yetişkin teması gece yeşili, altın
ve parşömen; çocuk teması sıcak renkler ve yuvarlak yazı. Her temanın açık ve koyu rengi vardır.

- Tema (çocuk / yetişkin) `localStorage` içindeki `apps:tema`, renk (açık / koyu) `theme` anahtarındadır.
  İkisi de uygulama ana ekranı ve diğer uygulamalarla ortaktır; üst çubuktaki "Görünüm" panelinden değiştirilir.
- Uygulamanın kendi durumu (ezberlenenler, gösterilen metinler, Arapça yazı boyutu, tekrar modu,
  son açılan ezber) `ezberler:v1` anahtarında saklanır.
- Telefonda alt çubuk, 1000 pikselden geniş ekranda yan menü kullanılır.
- Yazı tipleri Namaz Yolculuğu ile aynıdır (Google Fonts): Cormorant Garamond, Inter, Nunito, Amiri.

Her ezber sayfası aynı sırayı izler: ad, Arapça metin / okunuş / anlam (ayrı ayrı açılıp kapanır),
kısa tefsir ya da açıklama, "Akılda kalsın", kaynak.

## Kaynaklar

- Kur'an metni: Tanzil Quran Text (Simple), tanzil.net — değiştirilmeden.
- Kıraat: Suûd eş-Şüreym, EveryAyah.com ayet kayıtları.
- Kısa tefsirler: Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı), Elmalılı M. Hamdi Yazır, İbn Kesîr esas alınarak özetlenmiştir.
- Dua ve zikirler: Diyanet İlmihali ve `data.js` içinde her ögenin `kaynak` alanında belirtilen hadis kaynakları.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py ezberler` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve `anlatim/cocuk/` (kadın sesi), her birinde `tam.mp3` + durak başına bir MP3 (bkz. `tools/tts/README.md`).
Ana ekranda tam anlatım (ve varsa giriş), her durağın sayfasında o durağın kaydı `../anlatim.js` ile çalınır;
ses temadan gelir. Ses dosyaları önbelleğe alınmaz.
