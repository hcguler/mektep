# Sureler Atlası

Kur'an'ın 114 suresi bir atlasta: adı, Mekkî/Medenî oluşu, iniş sırası, ayet sayısı, cüz ve sayfa; 114 surenin
hepsinde konu özeti, öne çıkan ayet ve "Akılda kalsın". Yayın adresi: https://hcguler.github.io/mektep/sureler/

## Bölümler

- **Atlas** (`#/`): 114 surelik ızgara. Renk Mekkî/Medenî/görüş farkı, alt çizgi ayet sayısı, nokta (çocuk
  temasında simge) konu özeti olduğunu gösterir. Arama (ad, numara, ad anlamı; tek sonuçta Enter açar),
  sıralama (mushaf, iniş, ayet sayısı), süzme (Mekkî, Medenî, konusu anlatılan).
- **Sure sayfası** (`#/s/<no>`): künye (Tanzil verisi, kesik çizgili kutu) ile yorum (kaynaklı özet) ayrı
  gösterilir. Görüş farkı notu, konu, temalar, öne çıkan ayet (Arapça ve anlam ayrı açılıp kapanır), varsa
  hadis, Akılda kalsın, kaynak, önceki/sonraki sure. Ezberler'de bulunan 23 surede "Ezberle" düğmesi
  (`../ezberler/#/o/<id>`; kimlikler Ezberler'in `data.js`'inden üreticiyle alınır). Özeti olmayan surede
  "Konu özeti hazırlanıyor".
- **Harita** (`#/harita`): Mekke'de inenler, Medine'de inenler ve görüş farkı olanlar kümeleri; kare
  büyüklüğü ayet sayısına göre.
- **İniş** (`#/inis`, `#/inis/<no>`): iniş sırası şeridi (114 çubuk, hicret çizgisi) ve dönemlere ayrılmış
  liste; hicret satırı Siyer Çizelgesi'ne (`../siyer/#/o/hicret`) bağlanır.
- **Oyunlar** (`#/oyun`): "Mekkî mi, Medenî mi?" (5 Mekkî + 5 Medenî) ve "Hangisi daha önce indi?" (yalnızca
  iniş sırası en az 20 farklı olan çiftler). Görüş farkı olan 23 sure (belirgin ya da zayıf) oyunlara girmez.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `sureler.css`, `sureler.js` | Uygulama (iskelet ve CSS tabanı Siyer Çizelgesi ile ortak). |
| `kunye.js` | 114 surenin künyesi. **Elle düzenlenmez**; `node tools/sureler-uret.mjs` üretir. |
| `data.js` | Konu özetleri, temalar, Mekkî/Medenî görüş farkları, hadis künyeleri. Elle düzenlenir. |
| `ayetler.js` | Öne çıkan ayetler. **Elle düzenlenmez**; aynı üretici (`tools/lib/tanzil-ayetler.mjs`). |

`tools/sureler-anlatim.mjs` gizli anlatım metnini (giriş + her sure, `tools/sureler-anlatim.json`; 114 sure 1,5–2 saat süreceği için tek tam kayıt yoktur) üretir:
`giris` + özeti olan her sure (`001-fatiha` … `114-nas`; sayfadaki `data-anlatim` adıyla aynı kural).
İçerik değişince sırasıyla `node tools/sureler-uret.mjs`, `node tools/sureler-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Künye:** Tanzil Quran Metadata 1.0 (`tanzil.net/res/text/metadata/quran-data.js`, CC BY 3.0): ayet sayısı,
  Meccan/Medinan, iniş sırası, cüz ve sayfa başlangıçları. Betik çalıştırılmaz, diziler metinden okunur.
  Üretici testleri: 114 sure, 6236 ayet (Kûfe sayımı), iniş sırası 1–114 eksiksiz ve tekrarsız, Mekkî 86 /
  Medenî 28, Mekkî sureler iniş sırasında 1–86; her surenin ayet sayısı, iniş yeri, ilk/son cüzü ve sayfası
  fawazahmed0/quran-api `info.json` ile aynı; Ezberler'deki iniş yerleri Tanzil ile aynı; TDV İslâm
  Ansiklopedisi maddelerinde geçen 32 iniş sırası bilgisi (ör. "Kehf, Gāşiye'den sonra indi", "Kadr 25.")
  Tanzil sırasıyla aynı. Sayfa numarası Medine mushafına (604 sayfa) göredir.
- **Mekkî/Medenî görüş farkı:** 114 surenin TDV İslâm Ansiklopedisi maddesi tek tek okunmuştur.
  Belirgin görüş farkı (9): Ra'd, Hac, Rahmân, İnsân (dördü Tanzil'de Medenî, madde Mekkî görüşe meyleder),
  Beyyine, Zilzâl, İhlâs, Felak, Nâs. Zayıf görülen farklı rivayet (14): Fâtiha, Yâsîn, Sâd, Necm, Hadîd, Saf,
  Cuma, Mutaffifîn, Fecr, Kadr, Âdiyât, Tekâsür, Mâûn, Kevser. Yalnızca birkaç ayetinin farklı yerde indiği
  söylenen sureler (En'âm, Kehf, Vâkıa, Hucurât vb.) işaretlenmez.
- **Konu özetleri (114):** 1. sürümde 30. cüzün 37 suresi + Fâtiha, Bakara, Kehf, Yâsîn, Fetih, Hucurât,
  Rahmân, Vâkıa, Cuma, Mülk (47); 2. sürümde kalan 67 sure mushaf sırasıyla yedi dalgada (Âl-i İmrân–Yûsuf,
  Ra'd–Mü'minûn, Nûr–Ahzâb, Sebe'–Duhân, Câsiye–Mücâdele, Haşr–Kalem, Hâkka–Mürselât). Kendi cümlelerimizle;
  her biri TDV İslâm Ansiklopedisi'nin ilgili sure maddesiyle karşılaştırılmıştır (Mücâdele için madde adı
  "Mücâdile Sûresi"). Meal ifadeleri Diyanet mealiyle karşılaştırılmıştır. Görüş farkı olan surelerde
  (Ra'd, Hac, İnsân) özet iniş yeri hakkında hüküm vermez; Hadîd, Saf, Teğâbün için "çoğunluğa göre Medine'de"
  denir.
- **Öne çıkan ayetler:** Tanzil Simple + Diyanet meali, ortak üreticiyle; birleşik mealler aralık olarak
  (Meryem 30-33, Kasas 76-77, Secde 15-16, Şûrâ 36-38, Duhân 2-3, Talâk 2-3, Meâric 22-27, İnsân 8-10,
  İnfitâr 6-8, A'lâ 14-15, Gāşiye 17-20, Hümeze 1-2, Mâûn 1-3, Felak 1-5, Nâs 1-6 …).
- **Hadisler (27 sure, 28 künye):** yalnızca Buhârî ve Müslim. `tools/sureler-uret.mjs` numarayı, kitap adını
  ve ravinin adını fawazahmed0/hadith-api (eng-bukhari, eng-muslim) ile denetler; Müslim numarası Abdülbâkî
  numarasıdır (`807.01` gibi rivayet yolları aynı numaraya sayılır). Türkçe ifadeler İngilizce metinle
  karşılaştırılmıştır; anlam olarak, kısaltılarak aktarılır. Fazilet hadisi yalnızca sahih olanlardan (Fâtiha,
  Bakara'nın son iki ayeti, Âl-i İmrân, Kehf'in ilk on ayeti, İhlâs, Felak-Nâs); diğerleri surenin okunduğu
  yeri ya da iniş ortamını anlatır (Nisâ, Lokmân, Secde, Kāf, Tûr, Necm, Kamer, Münâfikûn, Cin, Müddessir,
  İnsân, Mürselât). Yâsîn, Mülk, Vâkıa, Hûd, Zümer, Duhân, Haşr gibi sureler için anılan fazilet rivayetleri
  Buhârî/Müslim'de olmadığından ya da TDV İslâm Ansiklopedisi'nde zayıf/mevzû sayıldığından konmamıştır.
- **Doğrulanmadı:**
  - Diyanet "Kur'an Yolu" sure girişleri (kuran.diyanet.gov.tr) çevrimiçi açılamadı (içerik şifreli API ile
    yükleniyor; 2. sürümde yeniden denendi, sayfa yalnızca portal başlığını veriyor); özetler ve Mekkî/Medenî
    bilgisi yalnızca TDV İslâm Ansiklopedisi ile karşılaştırıldı.
  - Tanzil'in iniş sırası listesinin Diyanet mushafındaki listeyle bire bir aynı olduğu karşılaştırılamadı;
    ekranda "geleneksel liste, yaklaşık" diye belirtilir.
  - "Akılda kalsın" cümleleri ve çocuk teması cümleleri yorum cümleleridir.

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır. Uygulamanın kendi durumu (sıralama, süzgeç, açılan sureler,
son sure, ayet görünümü, oyunlarda en iyi sonuç) `sureler:v1` anahtarında saklanır.

## Sesli anlatım

Ses bu bilgisayarda `python3 tools/tts/seslendir.py sureler` ile üretilir: `anlatim/yetiskin/` (erkek sesi) ve
`anlatim/cocuk/` (kadın sesi). Ana ekranda `giris` (tam kayıt yok), özeti olan her sure sayfasında o surenin kaydı
`../anlatim.js` ile çalınır. Sure adları anlatımda şapka/uzatma işaretsiz okunuşla yazılır. Ses dosyaları
önbelleğe alınmaz.

## Bilinen eksikler

- Sesli anlatım kayıtları henüz üretilmedi.
