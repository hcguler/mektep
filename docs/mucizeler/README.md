# Kur'an'dan Mucizeler

Kur'an'ın önceden haber verip sonra gerçekleşen altı haberi ve indiği gün bilinmeyen, bugün bilimle birlikte
düşünülen altı ayet. Yayın adresi: https://hcguler.github.io/mektep/mucizeler/
Plan: `planlar/kuran-mucizeler.md` (kullanıcının 20.11.2026 kararları bağlayıcıdır).

## Bölümler

- **Mucizeler (`#/`):** İki grupta on iki kart: Gelecekten haberler; O gün bilinmeyenler.
- **Mucize sayfası (`#/m/<id>`):** Simge, ad, ayetten anahtar ifade (Arapça / Okunuş / Anlam ayrı ayrı açılıp
  kapanır, ayetlere de uygulanır), Sureler Atlası bağlantısı, ayetler (Arapça + meal), "Ayet ne bildiriyor?",
  gelecek haberlerinde "Ne oldu?", bilim ayetlerinde "Bugün bildiğimiz" ve "Yorum notu" (klasik tefsir + çağdaş
  yorum), Akılda kalsın, kaynak.
- **Ölçü (`#/olcu`):** Sayfaların nasıl okunacağı: yalnızca Kur'an, gelecek haberleri, bilimsel yorumun yeri,
  klasik tefsir.
- **Oyun (`#/oyun/sure`):** "Hangi surede?" (mucize → sure, on iki mucizeden on soru).

## Mucizeler

Gelecekten haberler: Rumların zaferi (Rûm 2-5) · Ebu Leheb (Tebbet 1-5) · Bedir'deki bozgun (Kamer 44-45) ·
Mescid-i Haram'a giriş (Fetih 27) · Kur'an'ın korunması (Hicr 9) · Benzeri getirilemez (Bakara 23-24, İsrâ 88).

O gün bilinmeyenler: Ana rahminde yaratılış (Mü'minûn 12-14) · Ay'ın evreleri ve yörüngeler (Yâsîn 38, 39, 40) ·
Dağların hareketi (Neml 87, 88) · Evrenin genişlemesi (Zâriyât 47) · İki deniz arasındaki engel (Rahmân 19-20,
Furkān 53) · Göklerin ve yerin ayrılması (Enbiyâ 30).

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `mucizeler.css`, `mucizeler.js` | Uygulama. İskelet Kur'an'da Hayvanlar ile ortaktır. |
| `data.js` | Mucizeler, açıklamalar, gerçekleşme, bugünkü bilgi, yorum notları, kaynaklar. Elle düzenlenir. |
| `ayetler.js` | Ayetler. **Elle düzenlenmez**; `node tools/mucizeler-uret.mjs` üretir. |
| `ifadeler.js` | Sayfa başındaki Arapça ifade, ayetin Tanzil metninden harekeleriyle. **Elle düzenlenmez**; aynı üretici yazar. |

İçerik değişince sırasıyla `node tools/mucizeler-uret.mjs`, `node tools/mucizeler-anlatim.mjs`, `node tools/pwa-surum.mjs`.
Üretici ayet kaynağına ulaşamazsa, fawazahmed0/quran-api deposundaki `editions/ara-quransimple.json` ve
`editions/tur-diyanetisleri.json` dosyalarının bulunduğu klasör argüman olarak verilir.

## Kaynaklar ve doğrulama

- **Ayetler:** Tanzil (Simple) + Diyanet İşleri meali, `tools/lib/tanzil-ayetler.mjs`. Diyanet mealinde birleşik
  olan Rûm 2-5, Tebbet 1-5 ve Rahmân 19-20 aralık olarak verilmiştir; üretici 17 ayet kaydı yazar ve birleşik meal
  denetiminden geçer.
- **Kullanıcı kararı:** Kur'an dışına çıkılmaz; hadis rivayetine dayanan mucizeler alınmaz. Üretici metinde hadis
  kaynağı geçerse durur.
- **Tarih (20.11.2026'da okundu):** TDV İslâm Ansiklopedisi "Rûm Sûresi", "Ebû Leheb" (ölümü 2/624, Bedir'den
  birkaç gün sonra), "Kamer Sûresi" (45. ayetin Bedir'le ilişkisi), "Umretü'l-kazâ" (7/629, Fetih 27'deki rüyanın
  gerçekleşmesi), "Mushaf" (Hz. Ebû Bekir ve Hz. Osman dönemleri), "İ'câzü'l-Kur'ân" (tehaddî, gaybî haberler,
  bilimsel i'câzın 20. yüzyılda öne çıkan bir yorum olması). Bizans–Sâsânî savaşı tarihleri (613 Antakya, 614 Kudüs,
  622 Herakleios'un seferi, 627 Ninova, 628 barış): Wikipedia, "Byzantine–Sasanian War of 602–628".
- **Klasik tefsir:** İbn Kesîr (Mü'minûn 12-14, Yâsîn 37-40, Zâriyât 47, Rahmân 19-20, Enbiyâ 30), İngilizce
  çevirisinden (surahquran.com) okundu. Neml 88 için Kur'an Yolu Tefsiri, IV, 210 ve Celal Kırca, *Kur'ân-ı
  Kerîm'de Fen Bilimleri*, s. 76; ikisi de ikincil kaynaktan (sorularlaislamiyet.com) aktarıldı.

### Doğrulanmadı / dikkat

- "Bugün bildiğimiz" paragrafları genel bilimsel bilgidir (embriyoloji evreleri, Güneş'in galaksideki hızı yaklaşık
  230 km/sn, levha hareketi yılda birkaç cm, evrenin genişlemesi 1920'ler, evrenin yaşı yaklaşık 13,8 milyar yıl,
  Cebelitarık'taki Akdeniz suyu); birer kaynak eseriyle tek tek karşılaştırılmadı.
- Kur'an Yolu Tefsiri ve Celal Kırca'nın kitabı doğrudan okunmadı (ikincil kaynaktan).
- "Akılda kalsın", "Kısaca" ve çocuk teması cümleleri yorum cümleleridir.
- Kamer suresinin iniş zamanı TDV maddesinde "Mekke döneminin ilk yılları" olarak geçer; sayfada yalnızca "Mekke'de
  indi" yazılmıştır.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır; tema zorlanmaz. Yetişkin temasında çizgi simge, çocuk temasında
emoji gösterilir. Uygulamanın kendi durumu (okunan sayfalar, son sayfa, Arapça / Okunuş / Anlam görünümü, yazı
boyutu, oyunda en iyi sonuç) `mucizeler:v1` anahtarında saklanır.

## Sesli anlatım

Metin: `node tools/mucizeler-anlatim.mjs` → `tools/mucizeler-anlatim.json` (`giris`, her mucize `01-rum` …
`12-ayrilma`, `olcu`, ayrıca `tam`). Ses bu bilgisayarda `python3 tools/tts/seslendir.py mucizeler` ile üretilir;
kayıtlar `docs/mucizeler/anlatim/<profil>/` altındadır (yetişkin: erkek sesi, çocuk: kadın sesi). Ana ekranda `data-anlatim="tam giris"`, her mucize sayfasında `data-anlatim="<sıra>-<id>"`, Ölçü
sayfasında `data-anlatim="olcu"` yer tutucusu vardır; kayıt yokken oynatıcı satırı görünmez.

## Bilinen eksikler

- Sureler Atlası tarafında bu uygulamaya geri bağlantı yok.
- Gerçek telefonda deneme yapılmadı.
