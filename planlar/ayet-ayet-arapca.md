# Plan: Ayet Ayet Arapça (`docs/arapca/`, `apps.js` kimliği `arapca`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir, onları gevşetmez.

> **Durum (2026-11-20): 1–8. cüz yayında** (`docs/arapca/`, başlangıç dersi + 161 sayfa). Sonraki cüzler
> aşağıdaki "Dalgalar hâlinde üretim" ile, her biri ayrı yayın olarak hazırlanır. Uygulamanın dosyaları,
> üreticileri ve kaynakları: `docs/arapca/README.md`.

## Kararlar (2026-11-16)

Kullanıcının verdiği kararlar ve kararı verilmeyen sorularda uygulanan varsayılanlar:

- Ad: Ayet Ayet Arapça, `apps.js` kimliği `arapca`. Ses deposu: `hcguler/arapca-ses`.
- Anlatım yalnızca yetişkin profili (erkek sesi); çocuk teması yalnızca görünüm. Sesler ayrı depoda.
- Başvuru kaynakları: dünyada ve Türkiye'de en çok kabul gören, izin ve telif gerektirmeyen klasik
  eserler — kelime: Râgıb el-İsfahânî, el-Müfredât; E. W. Lane, An Arabic-English Lexicon; gramer:
  Birgivî, el-Avâmil ve İzhâr; İbn Hişâm, Katru'n-nedâ; W. Wright, A Grammar of the Arabic Language;
  çözümleme: Quranic Arabic Corpus (GNU GPL).
- QUL / quran.com verileri (kelime zamanlaması, sayfa-satır, transliterasyon, kelime meali) kaynak
  gösterilerek kullanılır; atıf ana işlevin önüne geçmeyecek yerde (Kaynaklar penceresi, kelime paneli)
  yazılır. Kelime mealinin İngilizce kalan ve komşu kelimeye kaymış karşılıkları elle düzeltilir
  (`tools/arapca/duzeltmeler.json`; 1. cüzde 2.522 kelimeden 656'sı).
- Varsayılanlar (kullanıcı aksini söyleyene kadar): Medine mushafı düzeni (604 sayfa); okunuş kural
  tabanlı (quran.com transliterasyonundan) ve "yaklaşık" diye belirtilir; ders başına 8 kelime + en çok 3
  otomatik öge (ek, edat, kalıp) + o sayfaya bağlanan elle yazılmış konu ve deyimler; dil bilgisi
  defterinde açılmamış konular kilitli (adı görünür); simgeler yalnızca elle çizilmiş SVG; 1. cüzün
  paketi (`veri/c01.json`, ~0,75 MB) çevrimdışı önbellekte; birleşik çalma (anlatım içinde kıraat
  kesiti) yapılmadı.
- Anlatımda ayetin Arapçası ve okunuşu okunmaz. Ögelerin adları ve dil bilgisi terimleri (inne, mâzî,
  izafet gibi) Türkçe harflerle yazılmış terim olarak okunur; Arapça harf içeren parça seslendirilmez.

## Amaç

Kullanıcı Kur'an'ı baştan sona, mushaf sırasıyla okurken Arapçayı da öğrenir. Her sayfada önünde
Suûd eş-Şüreym kıraati, Arapça metin, okunuş ve Diyanet meali vardır; uygulama o sayfada **ilk kez
karşılaşılan** kelimeleri, kökleri, ekleri, bağlaçları, kalıpları, deyimleri ve dil bilgisi konularını
öğretir, sonra onları aralıklı tekrarla kalıcı hâle getirir. Hatim bittiğinde kullanıcı Kur'an'da geçen
kelimelerin büyük bölümünü tanır, sık geçen yapıları çözümleyebilir.

Temel ilke: **müfredatı mushaf belirler.** Ayrı bir ders kitabı sırası yoktur; bir bilgi, Kur'an'da ilk
geçtiği sayfada öğretilir, sonraki her geçişinde hatırlatılır ve pekiştirilir. Bir derste, henüz
okunmamış bir sayfadan örnek verilmez.

## Ölçek (neden parça parça)

- 114 sure, 6236 ayet, 604 sayfa (Medine mushafı düzeni), 30 cüz, yaklaşık 77 bin kelime.
  Corpus verisinde yaklaşık 1.700 kök ve birkaç bin lemma (sözlük biçimi) bulunur; kesin sayılar üretici
  çalışınca `README.md`'ye yazılır, plana ezbere yazılmaz.
- İçeriğin bir kısmı makineden gelir (metin, meal, sayfa düzeni, kelime çözümlemesi), bir kısmı elle
  yazılır ve denetlenir (Türkçe anlamın sadeleştirilmesi, dil bilgisi anlatımı, "Akılda kalsın", görsel
  seçimi, anlatım metni). Elle yazılan kısım cüz cüz ilerler; bu yüzden yayın da cüz cüz olur.

## Önerilen ilerleme birimi

| Birim | Rolü | Gerekçe |
| --- | --- | --- |
| **Sayfa** (604) | **Ders.** Kullanıcının bir oturumda bitirdiği iş; ilerleme, istatistik ve anlatım kaydı sayfa başınadır. | Mushafla birebir; günde bir sayfa ile hatim yaklaşık 20 ay, günde iki sayfa ile 10 ay. Sayfanın yükü kabaca eşittir (ayet sayısı değil satır sayısı sabittir). |
| **Ayet** | Dersin adımı. Kelime çözümlemesi, meal, ayet anlatımı ayet başınadır. | Anlam ve dil bilgisi ayetle bütündür; Diyanet mealinin birleşik ayet grupları (`83:1-3` gibi) tek adım sayılır. |
| **Cüz** (30) | **Bölüm ve yayın dalgası.** Ana ekranda cüz ızgarası; her cüz ayrı veri ve anlatım paketi. | Bir cüz (~20 sayfa) elle içerik, denetim ve ses üretimi için yönetilebilir bir iş paketidir. |
| **Satır** (15/sayfa) | Yalnızca görünüm ve kıraat dinleme seçeneği (satır satır takip). | Satır çoğu zaman ayetin ortasında kesilir; satır başına öğretim ve anlatım anlam bütünlüğünü bozar. Bu yüzden satır anlatımı **önerilmez**. |

Kullanıcı hatim sırasının dışında bir yerden başlayabilir (ör. 30. cüz). Ders içeriği yine mushaf
sırasına göre yazılır; o sayfada "önceki sayfalarda öğretilmiş ama sen henüz görmediğin N bilgi var"
uyarısı ve onları gösteren bir düğme çıkar (öğe durumları kişiye göre tutulduğu için bu mümkündür).

## Öğretilen bilgi türleri

Her öge bir türe aittir; her türün kendi kartı ve alıştırması vardır.

| Tür | Kimlik | Örnek | Not |
| --- | --- | --- | --- |
| Kelime (lemma) | `l:<lemma>` | hamd, rab, âlem | Sözlük biçimi; çekimli hâlleri ona bağlanır. |
| Kök | `k:<kök>` | ح م د · ع ل م | Kök ağacı: kökten türeyen ve o ana kadar okunmuş kelimeler. |
| Ek | `e:<ek>` | el- takısı, -hu / -hum / -nâ zamir ekleri, bi- / li- / ke- bitişik harfleri, çoğul ve ikil ekleri | Kelime görselinde renkli parça olarak işaretlenir. |
| Bağlaç ve edat | `b:<id>` | ve, fe, sümme, inne, lâ, mâ, min, fî, alâ | Sık geçer; her geçişte küçük işaretle hatırlatılır. |
| Kalıp (vezin) | `v:<vezin>` | fa'ale, ef'ale (IV), istef'ale (X); fâil, mef'ûl, masdar | "Bu kalıbı tanırsan yeni kelimeyi tahmin edersin." |
| Deyim / ifade kalıbı | `d:<id>` | "yâ eyyühellezîne âmenû", "lâ raybe fîh", "inna'llâhe alâ külli şey'in kadîr" | Tekrar eden ifadeler bütün olarak öğretilir. |
| Dil bilgisi konusu | `g:<id>` | isim cümlesi (mübteda-haber), fiil cümlesi, izafet, sıfat tamlaması, inne ve kardeşleri, kâne ve kardeşleri, i'rab hâlleri | Konunun ilk açık örneğinin bulunduğu sayfada açılır; sonra o ana kadar okunmuş ayetlerden yeni örnekler eklenir. |

Örnek terimler (vezin adları, gramer terimleri) Türk geleneğindeki yazımıyla verilir; Arapça terim
parantez değil ikinci satır olarak gösterilir.

## Öğretim motoru

1. **İlk görülme dizini (üretilir).** `tools/arapca-uret.mjs`, Corpus çözümlemesinden her kelimeyi
   lemma, kök, ekler ve vezne ayırır; her ögenin mushaf sırasındaki ilk geçtiği yeri, toplam geçme
   sayısını ve geçtiği yerlerin listesini çıkarır.
2. **Sayfa dersinin yeni ögeleri.** Bir sayfada ilk kez geçen ögeler, Kur'an'daki sıklığına göre
   sıralanır. Ders başına üst sınır vardır (öneri: 8 kelime + 2 dil bilgisi/kalıp/ek + 1 deyim). Sınırın
   dışında kalanlar:
   - Kur'an'da tekrar edenler bir sonraki uygun sayfaya kaydırılır (üretici kaydırmayı yazar).
   - Tek geçenler (hapax) ve çok seyrekler öğretilmez; yalnızca dokununca anlamı görünür.
   İlk sayfalar (Fâtiha, Bakara'nın başı) çok yeni öge içerdiği için bu kaydırma en çok orada çalışır.
3. **Dokun-gör (her zaman açık).** Sayfadaki her kelimeye dokununca anlamı, kökü ve eklerine ayrılmış
   hâli görünür; öğretilmiş olsun olmasın.
4. **Aralıklı tekrar (SRS).** Sayfa tamamlanınca dersin yeni ögeleri tekrar kuyruğuna girer. Leitner
   kutuları: 1, 3, 7, 16, 35 gün; yanlış cevap ögeyi 1. kutuya döndürür. Ayrıca okunan her yeni sayfada
   geçen eski ögeler "doğal tekrar" sayılır (kullanıcı o kelimeye dokunmadıysa küçük bir artı).
   Günlük tekrar sınırı ayarlanabilir (öneri: 20).
5. **Kapsama göstergesi.** "Bu sayfadaki kelimelerin %… tanıdığın kelimeler." Bilinen lemmalar
   üzerinden hesaplanır; motivasyon ve kendini ölçme içindir, puan ya da yarış yoktur.

## Ekranlar ve akış

İskelet `docs/siyer/` ile aynıdır: üst çubuk, alt sekme çubuğu (1000 pikselden geniş ekranda yan menü),
görünüm penceresi (tema + renk), kaynaklar penceresi, hash yönlendirme, `localStorage` anahtarı
`arapca:v1`. Alt sekmeler: **Ana · Ders · Tekrar · Sözlük · Dil bilgisi.**

### `#/` Ana ekran

- Hero: uygulamanın adı, kısa açıklama, `data-anlatim="tam giris"`.
- "Devam et" kartı: kalınan sayfa, sure adı ve ayet aralığı, tahmini süre.
- Hatim çubuğu (604 sayfa) ve 30 cüzlük ızgara: yayında olan cüzler açık, hazırlanan cüzler
  "Hazırlanıyor" (tıklanınca yalnızca metin, meal ve kıraat; ders yok).
- Bugün: bekleyen tekrar sayısı, bu hafta okunan sayfa, öğrenilen kelime/kök sayısı.

### `#/c/<cüz>` Cüz

Sayfa listesi (sayfa no, sure ve ayet aralığı, durum: okunmadı / okundu / tekrarda), cüzün yeni
ögelerinin özeti ("Bu cüzde 120 yeni kelime, 6 yeni dil bilgisi konusu").

### `#/s/<sayfa>` Sayfa dersi (ana ekran akışı)

Ders beş adımdır; her adım tek ekran, ileri/geri düğmeli, adımlar üstte nokta göstergesiyle:

1. **Dinle.** Sayfanın tamamı Şüreym kıraatiyle, ayet ayet; çalan ayet ve (zamanlama verisi varsa)
   çalan kelime vurgulanır. Görünüm: ayet ayet (varsayılan) ya da mushaf satırları.
2. **Ayetler.** Her ayet bir kart: Arapça metin (her kelime dokunulabilir), okunuş, meal; üçü ayrı
   ayrı açılıp kapanır (içerik kalıbı, `CLAUDE.md` 3). "Kelime kelime" düğmesi ayeti satır altı
   çözümlemeye açar: her kelimenin altında okunuşu, Türkçe anlamı, kökü; ekler renkli.
   Ayet kartında `data-anlatim="<ayet kaydı>"`.
3. **Yeni bilgiler.** Bu sayfanın yeni ögeleri, tür sırasıyla kart kart: kelime kartı, ek kartı,
   kalıp kartı, deyim kartı, dil bilgisi kartı. Her kart sayfadaki ayetten örnekle başlar, sonra
   açıklar; "Akılda kalsın" tek cümle; kaynak.
4. **Alıştır.** 5–10 kısa soru, yalnızca bu sayfanın yeni ögeleri ve tekrar zamanı gelmiş eski
   ögelerle (aşağıdaki alıştırma türleri).
5. **Özet.** Sayfanın anlam özeti (2–4 cümle, Diyanet mealine ve Kur'an Yolu tefsirine dayanarak),
   kapsama göstergesi, "Sayfayı tamamladım". Sayfanın tam ders anlatımı
   `data-anlatim="<sayfa kaydı>"` burada ve hero altında.

### `#/a/<sure>/<ayet>` Ayet görünümü

Ders dışından (arama, sözlükteki örnek, paylaşılan bağlantı) bir ayete doğrudan gelmek için.
Satır altı çözümleme açık gelir; ayetin bulunduğu sayfa dersine bağlantı.

### Kelime kartı (`#/k/<lemma>`, alt sayfa olarak da açılır)

Kelime (Arapça, okunuş), Türkçe anlam(lar), kökü ve vezni, Türkçedeki akrabaları (ilim → âlim,
malum, muallim; yalnızca gerçekten aynı kökten gelenler), Kur'an'da geçme sayısı, ilk geçtiği ayet,
kullanıcının okuduğu sayfalardan en fazla üç örnek ayet, görsel (varsa), kıraatten kelime kesiti
(zamanlama verisi varsa). Bir kelimenin anlamı, örnek ayetteki Diyanet mealiyle çelişemez; ayette
farklı anlam taşıyorsa o ayete özgü anlam ayrıca yazılır.

### `#/kok/<kök>` Kök ağacı

Kökten türeyen ve kullanıcının o ana kadar gördüğü kelimeler, vezinleriyle; görülmeyenler "ileride".

### `#/tekrar` Tekrar

Zamanı gelen ögeler; tür karışık, en fazla günlük sınır kadar. Bitince "Bugünlük bu kadar".

### `#/sozluk` Sözlüğüm

Öğrenilen ögeler: tür, kutu, ilk görüldüğü sayfa. Arama (Türkçe anlam, okunuş, Arapça), filtre.

### `#/dilbilgisi` Dil bilgisi defteri

Konular açıldıkları sayfa sırasıyla; açılmamış konular gizli (ya da kilitli, sorulacak). Her konu
sayfası: kısa anlatım, okunmuş ayetlerden örnekler, ilgili kalıp ve ekler.

### Alıştırma türleri

| Alıştırma | Ne sorar |
| --- | --- |
| Anlamı seç | Arapça kelime (ayetteki hâliyle) → dört Türkçe anlamdan biri |
| Ayette bul | Türkçe anlam → ayetteki kelimeye dokun |
| Parçalarına ayır | Kelimeyi ön ek / gövde / son ek olarak böl (ör. فَسَيَكْفِيكَهُمُ) |
| Kökü bul | Çekimli kelime → üç harfli kök |
| Dinle ve seç | Şüreym kesiti (yalnızca zamanlama verisi varsa) → hangi kelime |
| Kalıbı tanı | Kelime → vezin (fâil mi, mef'ûl mü, masdar mı) |
| Türkçe akraba | Arapça kelime → Türkçede kullandığımız akrabası |
| Ayeti diz | Kısa ayetin kelimeleri karışık → sırayla diz (kısa ayetlerde) |

Çocuk temasında soru sayısı azalır (3–5), "Ayeti diz" ve "Türkçe akraba" öne çıkar, emoji ve
cesaretlendiren kısa cümleler kullanılır. İçerik aynıdır.

## Görseller

- Amaç: somut kelimeyi akılda tutmak (su, dağ, güneş, ay, yıldız, ağaç, hurma, üzüm, deve, kitap,
  kalem, ev, kapı, yol, yağmur, deniz…).
- Biçim: uygulama içinde **kendi çizdiğimiz tek renkli çizgi SVG simge seti** (tema rengine uyar,
  boyutu küçüktür, çevrimdışı çalışır). Çocuk temasında simgenin yanında emoji.
- Kesin sınırlar: Allah'a dair hiçbir tasvir; melek, peygamber, sahabe, insan yüzü; cennet, cehennem,
  kıyamet sahneleri çizilmez (`planlar/README.md` 2). Soyut kavramlarda (takva, iman, rahmet) görsel
  yerine Türkçe akraba kelime köprüsü ve kök ağacı kullanılır.
- Görsel üretimi için yapay zekâ görsel servisi kullanılıp kullanılmayacağı sorulur (öneri: kullanılmaz;
  yalnızca elle çizilmiş SVG).

## Kaynaklar

| İçerik | Kaynak | Durum |
| --- | --- | --- |
| Arapça metin | Tanzil Quran Text (Simple), `tools/lib/tanzil-ayetler.mjs` ile, değiştirilmeden | Mevcut altyapı |
| Meal | Diyanet İşleri Başkanlığı (Tanzil `tr.diyanet`), birleşik ayet grubu kuralıyla | Mevcut altyapı |
| Sayfa, cüz, hizip sınırları | Tanzil Quran metadata (Medine mushafı sayfa düzeni) | Diyanet mushafının sayfa düzeniyle fark sorulacak |
| Satır düzeni | Medine mushafı 15 satır kelime→satır eşlemesi (QUL / Tarteel "Quranic Universal Library" mushaf düzeni) | Lisans ve doğruluk denetlenecek |
| Okunuş | Seçenekler: (a) Diyanet Kur'an Portalı Türkçe okunuşu (izin gerekir), (b) Ezberler'deki yazım kurallarıyla kural tabanlı üretim + elle denetim | Sorulacak |
| Kelime çözümlemesi (kök, lemma, tür, ek, i'rab etiketi) | Quranic Arabic Corpus (corpus.quran.com) morfoloji verisi | GNU GPL; atıf ve "değiştirilmeden" koşulu okunacak |
| Kelimenin Türkçe anlamı | Elle yazılır (lemma başına + ayete özgü anlam) ve ayetin Diyanet mealiyle karşılaştırılır. QUL "Turkish wbw translation" (kaynak 99) yalnızca iç karşılaştırma taslağıdır, yayınlanmaz (bkz. "İnceleme sonuçları") | İncelendi |
| Dil bilgisi anlatımı | Kendi cümlelerimiz; terimler ve örnek çözümlemeler kullanıcının belirleyeceği bir Türkçe başvuru gramerinden denetlenir; Corpus etiketleriyle tutarlılık testi | Sorulacak |
| Sayfa özeti | Diyanet meali + Kur'an Yolu Türkçe Meal ve Tefsir (Diyanet) | — |
| Kıraat | Suûd eş-Şüreym, EveryAyah ayet kayıtları (Ezberler ile aynı klasör) | Mevcut |
| Kelime zamanlaması | QUL / quran.com "Saud Al-Shuraim, Ayah by Ayah, with segments" (QUL kaynak 107, quran.com tilavet 10): 6236 ayetin 6223'ünde tam; yaklaşık 40 ayet elle denetlenir (bkz. "İnceleme sonuçları") | İncelendi |

Kurallar:

- Bir kelimeye, geçtiği ayette taşımadığı bir anlam yüklenmez (`CLAUDE.md` 2'nin kelime düzeyi).
- Corpus'un çözümlemesi tartışmalı olan yerlerde (i'rab ihtilafı, kök farkı) "farklı görüş vardır" notu
  yazılır; tek görüş kesin bilgi gibi sunulmaz.
- Kelime telaffuzu **yalnızca gerçek kâri kaydından** çalınır; Arapça kelime hiçbir zaman TTS ile
  seslendirilmez.

## Veri modeli ve dosyalar

Veri (üretilen) ile yorum (elle yazılan) ayrı tutulur; üretici ikisini birleştirip cüz paketleri yazar.

```text
docs/arapca/
  index.html  arapca.css  arapca.js     uygulama (iskelet, yönlendirme, ekranlar)
  motor.js                              ders seçimi, SRS, kapsama hesabı
  simgeler.js                           SVG simge seti
  veri/indeks.json                      ÜRETİLİR: sayfa→cüz, sure başları, cüz yayın durumu
  veri/c01.json … c30.json              ÜRETİLİR: cüz paketi (sayfalar, ayetler, kelimeler, ögeler)
  (anlatım sesleri bu depoda değil: ayrı `arapca-ses` deposu, bkz. "Ses deposu")
  README.md
tools/
  arapca-uret.mjs                       Tanzil + Corpus + elle içerik → veri/
  arapca/icerik/c01.json …              ELLE: Türkçe anlamlar, Akılda kalsın, dil bilgisi, deyim, görsel
  arapca/dilbilgisi.json                ELLE: dil bilgisi konuları (açılış sayfası üreticiden denetlenir)
  arapca-anlatim.mjs                    veri/ → tools/arapca-anlatim/c01.json …
```

Cüz paketi örneği (kısaltılmış):

```js
{
  "cuz": 1,
  "sayfalar": [{ "no": 2, "ayetler": ["2:1", "2:2", "2:3", "2:4", "2:5"], "yeni": ["l:kitab", "k:ktb", "g:isim-cumlesi"] }],
  "ayetler": { "2:2": { "ar": "…", "okunus": "…", "meal": "…", "satir": [2, 3],
                        "kelimeler": [{ "ar": "ذَٰلِكَ", "okunus": "zâlike", "anlam": "işte o", "lemma": "l:dhalika",
                                        "parcalar": [{ "t": "ذَٰلِ", "r": "govde" }, { "t": "كَ", "r": "ek", "id": "e:ke-hitap" }] }] } },
  "ogeler": { "l:kitab": { "ar": "كِتَاب", "okunus": "kitâb", "anlam": ["kitap", "yazılı hüküm"], "kok": "k:ktb",
                          "vezin": "v:fial", "turkce": ["kitap", "kâtip", "mektup"], "sayi": 230, "ilk": "2:2",
                          "simge": "kitap", "akilda": "…", "kaynak": ["Corpus 2:2:2", "Diyanet meali 2:2"] } }
}
```

(Sayı ve okunuşlar örnektir; gerçek değerler üreticiden gelir.)

Boyut tahmini: kelime başına ~150 bayt ile bütün Kur'an ~11 MB JSON, cüz başına ~400 KB (sıkıştırılmış
~80 KB). Cüz paketi yalnızca açılınca yüklenir.

`localStorage` (`arapca:v1`): kalınan sayfa, tamamlanan sayfalar, öge durumları
(`{ id: { kutu, sonraki, dogru, yanlis } }`), gösterim ayarları (okunuş / meal / kelime anlamı aç-kapa,
Arapça yazı boyutu, görünüm: ayet / satır), günlük tekrar sınırı. Ayarlar penceresinde ilerlemeyi
JSON dosyası olarak **dışa ve içe aktarma** vardır (telefon değişince kaybolmasın).

## PWA ve çevrimdışı

- Uygulama dosyaları (`index.html`, `.css`, `.js`, `simgeler.js`, `veri/indeks.json`) `sw.js` `ONBELLEK`
  listesine girer.
- Cüz paketleri ONBELLEK'e girmez (toplam büyük); açılan cüz paketinin çalışma anında önbelleğe
  alınması için `sw.js`'e küçük bir kural gerekir. Bu ortak altyapı değişikliğidir, kullanıcıya sorulur.
- Kıraat ve anlatım sesleri önbelleğe alınmaz (`CLAUDE.md` 7).

## Sesli anlatım

**Karar (2026-11-16): bu uygulamada anlatım yalnızca yetişkin profiliyle (erkek sesi, Antalia-2 Mini)
üretilir.** Çocuk teması yalnızca görünümü değiştirir; çocuk temasında da aynı yetişkin kaydı çalar
(`anlatim.js`'e uygulama başına profil sabitleme: ör. `<html data-anlatim-profil="yetiskin">`).
`tools/arapca-anlatim/*.json` içinde `cocuk/<dosya>` metni yazılmaz; `seslendir.py arapca`
yalnızca `--profil yetiskin` ile çalışır.

Ses **yalnızca bu bilgisayarda**, `tools/tts/seslendir.py` ile yerel modellerle üretilir; bulut TTS,
`speechSynthesis`, CI ya da uzak oturum kullanılmaz; model yoksa yalnızca metin hazırlanır.

### Üç ses katmanı

1. **Kıraat (Şüreym):** ayet, satır ve (zamanlama varsa) kelime. Arapçanın tek sesi budur.
2. **Türkçe anlatım (yerel TTS):** ders anlatımı. Arapça metin ve okunuş anlatıma girmez
   (`CLAUDE.md` 6.3). Kelimeye Türkçedeki karşılığıyla atıf yapılır: "Sayfanın ilk yeni kelimesi
   hamd. Türkçede de kullandığımız bu kelime, övgü ve şükür demektir. Kökü, ha, mim, dal harfleridir."
   Türkçeye geçmiş kelimelerin (hamd, rab, âlem, kitap, takva) Türkçe söylenişiyle anlatımda geçmesi
   bu kuralın yorumudur; kullanıcıya sorulur.
3. **Birleşik çalma (öneri):** anlatımın içinde "şimdi kâriden dinleyelim" noktasında Şüreym kesiti
   çalınır, sonra anlatım sürer. Anlatım dosyasında bir parça `{ "kiraat": "2:2" }` (ya da kelime
   `"2:2:3"`) olur; `seslendir.py` o noktada sessizlik değil işaret bırakır, `anlatim.js` sırayla
   anlatım kaydını ve kıraat kesitini çalar. Ortak oynatıcıya ek olduğu için sorulur.

### Anlatım birimleri

| Kayıt | İçerik | Uzunluk (tahmin) |
| --- | --- | --- |
| `giris` | Uygulama nasıl kullanılır, yöntem | 1–2 dk |
| `c01-giris` … | Cüze giriş: hangi sureler, kaç yeni bilgi | 30–60 sn |
| `s002` … (sayfa dersi) | Sayfanın anlam özeti, yeni ögeler sırayla, dil bilgisi konusu, Akılda kalsın | 2–4 dk |
| Ayet anlatımı | Ayetin meali ve o ayetteki yeni ögeler | 20–40 sn |

Ayet anlatımı ayrı dosya **olmaz**: sayfa dersi kaydı ayet sırasıyla kurulur ve `kayitlar.json`'a her
ayetin başlangıç ve bitiş saniyesi yazılır; ayet kartındaki oynatıcı sayfa kaydının o bölümünü çalar.
Böylece ses iki kez üretilmez ve yer kaplamaz. Bunun için `seslendir.py` (bölüm süreleri) ve
`anlatim.js` (bölüm çalma, `data-anlatim="s002#2:2"` gibi) genişletilir. Satır anlatımı yapılmaz.

`tam` kaydı (bütün uygulama tek kayıt) bu uygulamada anlamsızdır (saatlerce sürer). Standart şöyle
uyarlanır: her cüzün anlatım dosyası `tools/arapca-anlatim/c01.json`, `tam` = o cüzün giriş kaydı; ana
ekrandaki `tam giris` yalnızca uygulama girişidir. Bu uyarlama `CLAUDE.md` 6'ya not olarak eklenir.

### Ses hacmi (kritik kısıt)

Ayrıntılı ölçüm "İnceleme sonuçları" bölümündedir. Özet:

- Yerel motor cümle başına ~1 sn. Yeni öge sayısı mushafın başında yüksek, sonunda çok düşüktür; bu
  yüzden ders uzunluğu sayfadan sayfaya değişir (1. cüzde 3–4 dk, son cüzlerde ~1 dk).
- Yalnızca yetişkin profiliyle bütün hatim anlatımı ≈ 23–28 saat ses ≈ **330–400 MB** (32 kbps).
- Sitenin bugünkü boyutu 264 MB; beş "Yakında" uygulaması iki profille ≈ +175 MB. Arapça uygulaması bu
  depoya eklenirse toplam ≈ 785–855 MB olur; GitHub Pages sitesi için üst sınır 1 GB'tır. Sığar ama pay
  kalmaz ve her yeniden üretim depo geçmişini büyütür.
- **Karar (2026-11-16): anlatım sesleri ayrı bir depoda tutulur.** Ayrıntı aşağıda ("Ses deposu").
- Ayrı iyileştirmeler (Arapça uygulamasından bağımsız, karar bekliyor):
  1. **Mevcut uygulamalarda `tam.mp3` kaldırılır:** tam anlatım, durak kayıtlarının arka arkaya çalınmasıyla
     sağlanır (`anlatim.js`'e çalma listesi). Bugünkü ses ≈ 243 MB'ın yaklaşık yarısı (≈ 122 MB) `tam.mp3`
     kopyalarıdır; gelecekteki uygulamalarda da aynı kazanç olur.
  2. Konuşma için 24 kbps: yaklaşık %25 daha az yer; ses kalitesi dinlenerek karar verilir.

### Ses deposu

- Depo: GitHub'da ayrı, herkese açık proje deposu `arapca-ses` (ad kesinleşmedi); GitHub Pages `main`
  dalından, kök klasörden yayınlanır → `https://hcguler.github.io/arapca-ses/`. Depo, ilk ses üretiminden
  önce (sürüm 1.0) kullanıcının onayıyla açılır.
- Aynı köken (`hcguler.github.io`): `fetch` ve `<audio>` için CORS gerekmez; ana sitede `/arapca-ses/`
  klasörü bulunmamalıdır (yol çakışması olur).
- İçerik yalnızca üretilmiş dosyalardır: `.nojekyll`, kısa `README.md` (kaynak, nasıl üretildiği, ana
  depoya bağlantı), `yetiskin/c01/s002.mp3 …`, `yetiskin/c01/kayitlar.json`, `yetiskin/giris.mp3`,
  `yetiskin/kayitlar.json`. Anlatım metni ve üretici betikler ana depoda kalır; ses deposunda elle
  düzenleme yapılmaz.
- Yerel çalışma: ses deposu ana deponun yanına klonlanır (ör. `../arapca-ses`). `seslendir.py` çıktı
  kökünü ortam değişkeni ya da seçenekle alır (`--cikis ../arapca-ses`); varsayılan yine `docs/<ad>/anlatim/`
  olduğundan diğer uygulamalar etkilenmez.
- Uygulama tarafı: `anlatim.js` kayıt kökünü sayfadan okur
  (`<html data-anlatim-kok="/arapca-ses/" data-anlatim-profil="yetiskin">`); öznitelik yoksa bugünkü
  `anlatim/<profil>/` yolu kullanılır. Cüz kayıtları için `kayitlar.json` cüz klasöründen yüklenir.
- Yerelde denerken (`localhost`) `/arapca-ses/` bulunmaz: geliştirme sunucusu ses deposunu aynı yola
  bağlar ya da oynatıcı kaydı göstermez (bugünkü "kaydı olmayan satırı göstermez" davranışı).
- Sesler service worker önbelleğine alınmaz (`sw.js` ses isteklerine dokunmaz); `kayitlar.json` aynı
  kökenden geldiği için öteki uygulamalarınki gibi önbelleğe alınıp arka planda yenilenir.
- Yayın sırası: önce ses deposu itilir ve Pages yayını görülür, sonra ana depoda cüz açılır; böylece
  kayıtsız ders yayına çıkmaz.
- Depo büyümesi: aynı kayıt yeniden üretilirse geçmiş büyür. Toplam 1 GB'a yaklaşılırsa geçmiş
  sıkıştırılır (tek commit'e indirme) — bu yalnızca ses deposunda ve kullanıcı onayıyla yapılır.

### Akış

1. `node tools/arapca-anlatim.mjs c01` → `tools/arapca-anlatim/c01.json`.
2. `python3 tools/tts/seslendir.py arapca --cuz 1 --profil yetiskin --cikis ../arapca-ses`
   (eklenecek seçenekler) → `../arapca-ses/yetiskin/c01/`.
3. Her cüzde birkaç sayfa kaydı kullanıcıya dinletilir; yanlış okunan kelime üreticideki okunuş
   sözlüğüyle düzeltilir (Türkçeleşmiş Arapça kelimeler, sure ve özel adlar).

## İnceleme sonuçları (2026-11-16)

Veri quran.com API v4 ile 114 surenin tamamı için indirilip bu bilgisayarda sayıldı (betik ve ham veri
depoya alınmadı).

### Türkçe kelime meali (QUL "Turkish wbw translation", kaynak 99; quran.com `language=tr`)

- 77.429 kelimenin 70.539'u (%91,1) Türkçe; **6.890'ı (%8,9) Türkçe karşılık yerine İngilizce**
  ("before you", "He begets"). 6236 ayetin **3.624'ünde** (%58) en az bir İngilizce kelime var.
- Türkçe söz dizimi yüzünden anlam yanlış kelimeye kaymış örnekler var: 112:3 لَمْ = "doğurmamıştır",
  يَلِدْ = "He begets"; 2:4 مِن = "senden önce", قَبْلِكَ = "before you".
- QUL sayfasında yazar yok; lisans bölümünde "telif bilgisi bulunmuyor" yazıyor.
- Sonuç: kaynak kuralını (`CLAUDE.md` 2: yazarı ve yayını belli kaynak) karşılamıyor. **Yayınlanmaz.**
  Yalnızca bu bilgisayarda, elle yazılan anlamları karşılaştırmak için iç taslak olarak kullanılabilir
  (kullanıcı onayıyla).
- Elle yazılacak iş: kelime başına değil **lemma başına** anlam (kaba gövde sayımıyla Kur'an'da iki ve daha
  fazla geçen ~5.000 gövde; gerçek lemma sayısı Corpus ile çıkarılınca daha az olur) + ayete özgü anlam
  gereken yerler. Çekimli hâlin anlamı ("kulluk ederiz") lemma anlamı ve Corpus'un çekim bilgisinden
  (kişi, sayı, zaman) kalıpla üretilir, sonra ayetin Diyanet mealiyle karşılaştırılır.
- Diyanet Kur'an Portalı'ndaki "Kur'an Sözlüğü" bir kelime meali değil, Kur'an ilimleri terimleri
  sözlüğüdür (âyet, cüz, hatim…). Portalda kelime meali ya da Türkçe okunuş bulunamadı.

### Şüreym kıraati ve kelime zamanlaması

- QUL kaynak 107 = quran.com tilavet 10 "Sa`ud ash-Shuraym", ayet ayet, kelime zamanlamalı. Ses dosyası
  `https://verses.quran.com/Shuraym/mp3/SSSAAA.mp3` (Ezberler'in yedek kaynağıyla aynı).
- 6236 ayetin **6223'ünde** zamanlama kelime sayısıyla birebir; 1 ayette zamanlama yok (12:76); 12 ayette
  kelime sayısı tutmuyor (3:124, 8:61, 10:41, 12:53, 24:35, 24:45, 37:130, 40:54, 70:31, 78:40, 91:14, 96:7).
  Son kelimenin bitişi ayet süresiyle 27 ayette tutarsız (ör. 78:40, 81:17, 91:14). Toplam **~40 ayet** (%0,6)
  dinlenerek elle düzeltilir ya da o ayette kelime vurgusu kapatılır; üretici bu listeyi her çalışmada yazar.
- Zamanlama verisi quran.com dosyalarına göredir. EveryAyah 64 kbps dosyaları aynı kayıttır ama ~70 ms
  kaymalıdır; kelime vurgusu ve kelime kesiti için **quran.com dosyası** kullanılır.
- Toplam kıraat süresi ~17,5 saat; ses dosyaları depoya alınmaz, uzaktan çalınır (Ezberler gibi).
- QUL lisans bölümü bu kaynak için de "telif bilgisi bulunmuyor" diyor. Kayıt zaten Ezberler'de
  kullanılıyor; zamanlama verisi (milisaniye listesi) kullanıcı onayıyla alınır, kaynak olarak yazılır.

### Sayfa ve satır düzeni

quran.com verisinde her kelimenin sayfa ve satır numarası var: 604 sayfa, 8.817 satır. Satır görünümü için
ayrıca bir veri kaynağı gerekmez (lisans durumu QUL ile aynı; kullanıcı onayı).

### Öğretim yükü (kaba gövde sayımı)

Önek/sonek kabaca atılarak sayılan gövdeler (gerçek lemma sayımı Corpus ile yapılacak):

| Sayfalar | Sayfa başına yeni ve tekrar eden gövde (ort.) |
| --- | --- |
| 1–21 (1. cüz) | 42 |
| 22–101 | 18 |
| 102–301 | 9 |
| 302–501 | 3 |
| 502–604 | 1,6 |

En sık 100 gövde metnin %42'sini, 300 gövde %58'ini, 1.000 gövde %74'ünü kapsar. Sonuç: ders başına üst
sınır ve kaydırma (motor 2) ilk 100 sayfada zorunludur; son 300 sayfada dersler kısa, ağırlık tekrardadır.
İlk cüzlerin yükünü azaltmak için sık bağlaç ve edatların (ve, fe, min, fî, alâ, inne, lâ, mâ) bir
"başlangıç" dersinde (Fâtiha'dan önce) toplu verilmesi önerilir.

### Boyut (bugün ve tahmin)

| Kalem | Boyut |
| --- | --- |
| Sitenin bugünkü boyutu (depodaki dosyalar) | 264 MB |
| — bunun içinde anlatım sesleri (7 uygulama, iki profil) | 243 MB (yetişkin 128, çocuk 115) |
| — bunun içinde `tam.mp3` kopyaları | ≈ 122 MB |
| — Namaz Yolculuğu kayıtları | 17 MB |
| Depo geçmişi (`.git` paketi) | 229 MB |
| Beş "Yakında" uygulaması (iki profil, bugünkü ortalamayla) | + ≈ 175 MB |
| Arapça: veri (cüz paketleri) | + ≈ 12–15 MB |
| Arapça: anlatım, yalnızca yetişkin | + ≈ 330–400 MB |
| **Toplam, hepsi bu depoda** | **≈ 785–855 MB / 1 GB** |
| Toplam, `tam.mp3` kopyaları kaldırılırsa | ≈ 575–645 MB |
| Toplam, Arapça sesi ayrı depoda | ≈ 455 MB (ana depo) + 330–400 MB (ses deposu) |

Ölçüm: 32 kbps MP3 = 4,0 KB/sn (bütün mevcut kayıtlarda ölçüldü). Arapça anlatım tahmini: sayfa başına
45–60 sn sabit (özet, giriş, Akılda kalsın) + öğretilen öge başına 10–12 sn + dil bilgisi konusu başına 30 sn.

### Ses ölçümü (1. ve 2. cüz yayınından sonra)

Gerçek kayıtlar tahminden uzun çıktı, çünkü her ayetin Diyanet meali de okunuyor: 1. cüz 125 dk / 29 MB,
2. cüz 104 dk / 24 MB (sayfa başına ~5 dk, 32 kbps). Bu hızla bütün hatim ≈ 50 saat ≈ 720 MB eder; ses
deposunun 1 GB sınırına sığar ama pay azdır ve yeniden üretimler depo geçmişini büyütür. Sınıra
yaklaşmadan önce seçenekler: konuşma için 24 kbps (≈ %25 daha az), ayet meallerinin anlatımdan çıkarılıp
yalnızca yeni bilgilerin okunması, ya da ikinci bir ses deposu (ör. `arapca-ses-2`, 16–30. cüzler).

**Karar (2026-11-16, kullanıcı: "önce boyutu küçült"):** ayet mealleri anlatımda kalır (ayet bazında
dinlemenin özü). Küçültme üç yoldan yapıldı: (1) yeni kelime anlatımı iki cümleye indi (anlam, tür, sıklık,
Türkçedeki akrabalar; not ve ayrıntı ekranda); (2) sayfa özeti seslendirilmez, yalnızca "Akılda kalsın"
okunur (özet ekranda); (3) ses 24 kbps (`ayarlar.kbps`, yalnızca bu uygulama). 1. ve 2. cüz bu ayarla
yeniden üretildi: 1. ve 2. cüz 229 dk / 53 MB → 173 dk / 30 MB (%43 daha az; sayfa başına ~4 dk,
~0,73 MB). Bu hızla bütün hatim ≈ 40 saat ≈ 440 MB; sonraki cüzlerde yeni kelime azaldığı için daha az
olması beklenir. Ses deposunun 1 GB sınırının yarısının altında kalır.

## Dalgalar hâlinde üretim

İş paketi = 1 cüz; cüz içinde 4 dalga × ~5 sayfa. Her dalgada:

1. Üretici çalışır: sayfaların metni, meali, kelime çözümlemesi, yeni öge listesi.
2. Yeni ögelerin elle kısmı yazılır (`tools/arapca/icerik/cNN.json`): sade Türkçe anlam, Türkçe akraba,
   Akılda kalsın, simge, dil bilgisi anlatımı, sayfa özeti.
3. Denetim: her kelime anlamı örnek ayetin Diyanet mealiyle; her dil bilgisi örneği Corpus etiketiyle;
   çelişki sessizce düzeltilmez, kullanıcıya sorulur.
4. Dalga özeti kullanıcıya gösterilir: sayfalar, yeni ögeler, doğrulanamayanlar.
5. Cüz bitince anlatım metni ve ses; dinletme; yayın.

## Yol haritası

| Sürüm | İçerik | Bitme ölçütü |
| --- | --- | --- |
| 0 — Altyapı | Üretici (Tanzil + Corpus + sayfa/satır), ilk görülme dizini, motor, bütün ekranlar, SRS, dışa/içe aktarma, `anlatim.js` (kayıt kökü, profil sabitleme, bölüm çalma) ve `seslendir.py` (`--cuz`, `--cikis`, bölüm süreleri) uzantıları; `arapca-ses` deposu (kullanıcı onayıyla) | 604 sayfa metin + meal + kıraatle okunabiliyor (ders yok), testler geçiyor |
| 1.0 — Pilot | Sayfa 1–5 (Fâtiha ve Bakara'nın başı) tam ders + anlatım | Kullanıcı birkaç gün kullanır; yöntem, ders yükü, alıştırmalar gözden geçirilir |
| 1.1 | 1. cüzün tamamı | Yayın: "Yakında" kartı kalkar, 1. cüz açık, diğerleri "Hazırlanıyor" |
| 1.2 … 1.30 | Her biri bir cüz | Her cüz ayrı yayın; `apps.js` özellik listesi güncel |
| Sonra | Kök haritası (bütün kökler), haftalık özet, sure başına "bu surede öğrendiklerin" | — |

## Kullanıcıya sorulacaklar

1. Uygulamanın adı: "Ayet Ayet Arapça" mı, başka bir ad mı? (`apps.js` kimliği `arapca`.)
2. İlerleme birimi: önerilen yapı (sayfa = ders, cüz = bölüm ve yayın, ayet = adım, satır yalnızca
   görünüm) uygun mu? Satır başına anlatım isteniyor mu (önerilmez)?
3. Mushaf düzeni: Medine mushafı (604 sayfa, Tanzil verisi) mi, Diyanet mushafının sayfa düzeni mi?
4. Okunuş kaynağı: Diyanet Kur'an Portalı (izin gerekir) mi, kural tabanlı üretim + elle denetim mi?
   Yazım Ezberler'deki gibi mi olacak (ör. "Elhamdü lillâhi rabbil'âlemîn")?
5. Hazır Türkçe kelime meali yayınlanamayacağı için anlamlar elle yazılacak: denetimde esas alınacak
   basılı başvuru kaynağı (bir Türkçe kelime meali ya da Kur'an sözlüğü) ve bir Arapça gramer kitabı
   hangisi?
6. Quranic Arabic Corpus (GPL) kullanılabilir mi? Lisans koşulları uygunsa uygulamanın README'sine ve
   kaynaklar penceresine atıf yazılır.
7. Ders başına yeni öge üst sınırı: 8 kelime + 2 yapı + 1 deyim uygun mu?
8. Anlatımda Türkçeleşmiş Arapça kelimeler (hamd, rab, kitap) Türkçe söylenişiyle geçebilir mi?
   Anlatımın içinde Şüreym kesiti çalınması (birleşik çalma) istensin mi?
9. Ses hacmi — karar verildi: yalnızca yetişkin profili, sesler ayrı depoda. Açık kalan: ses deposunun adı
   (`arapca-ses` mı?) ve mevcut uygulamalardaki `tam.mp3` kopyalarının kaldırılması (ayrı iş).
10. QUL / quran.com verileri (Şüreym kelime zamanlaması, sayfa-satır düzeni) telif bilgisi belirtilmeden
    yayınlanmış; kaynak gösterilerek kullanılsın mı? Türkçe kelime meali yalnızca iç taslak olarak
    (yayınlanmadan) kullanılabilir mi?
11. Görseller: yalnızca elle çizilmiş SVG simgeler mi (öneri), başka kaynak (açık lisanslı simge seti)
    kullanılabilir mi?
12. Cüz paketlerinin çevrimdışı kullanım için önbelleğe alınması (`sw.js`'e çalışma anı önbelleği
    kuralı) yapılsın mı?
13. Dil bilgisi defterinde henüz açılmamış konular gizli mi, kilitli (adı görünür) mi olsun?

## Taktikler ve riskler

- **Kelime bölme uyumu:** Tanzil Simple metni boşluktan bölününce çıkan kelimeler, Corpus'un kelime
  konumlarıyla her ayette sayıca ve sırayla eşleşmeli. Corpus Uthmani metne dayandığı için yazım farkı
  olabilir; üretici eşleşmeyen ayette durur, ayet listesi kullanıcıya gösterilir. Ekranda her zaman
  Tanzil Simple metni gösterilir; Corpus'tan yalnızca çözümleme alınır.
- **İlk sayfaların yükü:** Fâtiha ve Bakara'nın ilk sayfaları çok yeni öge içerir; kaydırma kuralı
  (motor 2) ve "dokun-gör" bu yükü dağıtır. Pilot bu yüzden ilk beş sayfadır.
- **İleri bilgi sızıntısı:** dersin örnekleri yalnızca o sayfaya kadar olan ayetlerden seçilir; üretici
  bunu test eder.
- **Kaynak kesinliği ölçek altında:** ögelerin çoğu makineden gelir; makine verisi ile elle yazılan
  yorum ekranda görsel olarak ayrılır, her elle ögenin `kaynak` alanı doludur.
- **Performans:** sayfa ekranı en fazla ~150 kelime çizer; cüz paketi tek istekle gelir, sayfa
  geçişleri ağsız olur.
- **Arapça yazı:** Amiri yazı tipi (mevcut); kelime parçalarının renklendirilmesi bitişik harf
  biçimlerini bozabilir. Parçalar ayrı `span` yerine alt çizgi ve renkli altlıkla gösterilir; 320
  pikselde ve iOS Safari'de denenir.
- **Kişinin ilerlemesi yalnızca cihazdadır:** dışa/içe aktarma zorunlu özellik; ilk açılışta bir kez
  hatırlatılır.

## Kabul ölçütleri

- Üretici testleri: 6236 ayet, 604 sayfa, 30 cüz; her sayfanın ayetleri kesintisiz ve sırayla; her
  kelimenin lemması ve (varsa) kökü var; Tanzil ↔ Corpus kelime eşleşmesi tam; her yeni ögenin ilk
  görülme sayfası ≤ ders sayfası; ders başına üst sınır aşılmıyor; elle her ögenin `kaynak` alanı dolu.
- Her ayet kartının, her sayfa dersinin anlatım kaydı (ya da kayıt bölümü) var
  (yer tutucu anahtarı ↔ `kayitlar.json`).
- 320 / 390 / 1280 piksel, iki tema, açık/koyu; Arapça metin ve satır altı çözümleme taşmıyor.
- Kıraat ile anlatım aynı anda çalmıyor (`apps:ses` olayı).
- Pilot (sayfa 1–5) kullanıcı tarafından denendi ve onaylandı; geri bildirim bu plana işlendi.
