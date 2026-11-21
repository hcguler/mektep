# Zekât ve Sadaka Rehberi

Zekât, nisap, zekâta tabi mallar, zekâtın verileceği ve verilmeyeceği kimseler, fıtır sadakası, fidye, kefaret ve
gönüllü sadaka; yaklaşık zekât hesaplayıcı ve "Verebilir miyim?" oyunu. `apps.js` kimliği `zekat`.
Yayın adresi: https://hcguler.github.io/mektep/zekat/ · Plan: `docs/planlar/zekat-sadaka-rehberi.md`.

## Ekranlar

- `#/` **Rehber:** hero (`data-anlatim="tam giris"`), güncel değerler şeridi (nisap, fitre, fidye, oran), girişler
  (Hesapla / çocuk temasında Paylaşmak, Verebilir miyim?, Sekiz sınıf), arama, 8 bölüm kartı.
- `#/b/<bölüm>` **Bölüm**, `#/k/<konu>` **Konu:** ad, hüküm rozeti (Farz · Vacip · Verilebilir · Verilemez; Kavram
  Haritası'na bağlantı), kısa açıklama, örnek, Şâfiî farkı, Diyanet'in tarihli değeri (bir yıldan eskiyse "güncel
  olmayabilir" uyarısı), "müftülüğe danışın" notu, bağlantı (hesaplayıcı, Oruç Rehberi), ayetler (Arapça / anlam ayrı
  açılır), sahih hadis, Akılda kalsın, kaynak; `data-anlatim="NN-<konu>"`.
- `#/siniflar` **Sekiz sınıf:** Tevbe 60 (ayetler.js) ve her sınıfın anlamı, Diyanet'e göre bugünkü karşılığı.
- `#/hesapla` **Hesaplayıcı:** gram altın fiyatını kullanıcı girer (ağ isteği yok); nakit, döviz, altın (gram),
  ticaret malı, alacak, bu yıl ödenecek borç; gümüş isteğe bağlı (gram + gram fiyatı; gümüş nisabı yalnız bilgi).
  Sonuç her zaman "yaklaşık"; "bir kamerî yıl" ve "müftülüğe danışın" notları hep görünür. Tutarlar yalnızca
  "Bu cihazda hatırla" seçilirse `localStorage` `zekat:hesap` içinde tutulur; "Tutarları sil" ile silinir.
  `inputmode="decimal"`, Türkçe virgül/nokta, `Intl.NumberFormat('tr-TR')`. Hesaplayıcı anlatıma girmez.
- `#/kim` **Verebilir miyim?:** 21 kişi kartından rastgele 10; Verilebilir / Verilemez; cevaptan sonra açıklama,
  Şâfiî farkı, kaynak ve konuya bağlantı.
- `#/paylas` **Paylaşmak:** çocuk temasında alt çubukta hesaplayıcının yerini alır; sadaka hadisleri (güler yüz,
  güzel söz, yarım hurma…). Hesaplayıcıya buradan ve adresinden yine gidilir.
- Kaynaklar ve görünüm (tema + renk) pencereleri. `zekat:v1` yalnızca görünüm tercihlerini tutar.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `zekat.css`, `zekat.js` | Uygulama. Ortak stil temeli Oruç Rehberi'nden. |
| `data.js` | Bütün içerik: 8 bölüm, 43 konu, 8 sınıf, 21 oyun kartı, değerler, kaynaklar. Elle düzenlenir. |
| `hesap.js` | Saf hesap fonksiyonları (`ZekatHesap.hesapla`, `sayiOku`); DOM yok. |
| `ayetler.js` | Ayet metinleri ve mealleri. **Elle düzenlenmez**; `node tools/zekat-uret.mjs` üretir. |

`data.js` değişince: `node tools/zekat-uret.mjs`, `node tools/zekat-test.mjs`, `node tools/zekat-anlatim.mjs`,
`node tools/pwa-surum.mjs`.

Üretici şunları denetler ve uyuşmazlıkta durur: ayet aralıkları (birleşik meal: Bakara 183–184), her hadis künyesi
(numara, kitap adı, râvi; Müslim'de Abdülbâkî numarası ve kitap hadisin sıra numarasından), konu kaynaklarındaki
künyeler, zorunlu alanlar, Kavram Haritası kimlikleri, iç bağlantılar, sekiz sınıfın Tevbe 60 sırası,
"Verebilir miyim?" cevabının bağlı konunun hükmüyle aynı olması, değerlerin tarih ve Diyanet adresiyle tutulması ve
**Oruç Rehberi ile ortak metin** (oruç fidyesi ve kefaretinin açıklaması, kısa açıklaması, akılda kalsın cümlesi,
kaynağı ve hadisi; fitrenin ilk iki paragrafı ve hadisi; fitre ve fidye tutarı, tarihi, dönemi ve adresi).
`tools/zekat-test.mjs` hesaplayıcıyı sınar: boş, eksik, hatalı girdi, nisap altı, tam nisap, nisap üstü, borç
düşümü, borç fazlası, gümüş nisabı (bilgi), kuruş yuvarlama, Türkçe sayı yazımı.

## Kaynaklar ve doğrulama

- **Kur'an:** Bakara 43, 177, 183–184, 261, 262, 264, 267, 270, 271, 273, 274; Âl-i İmrân 92; Mâide 89; En‘âm 141;
  Tevbe 34–35, 60, 103. Tanzil Simple, değiştirilmeden; meal Diyanet İşleri (tr.diyanet).
- **Hadis:** Buhârî ve Müslim "Zekât" (ayrıca Buhârî Savm, Eymân ve'n-nüzûr; Müslim Sıyâm, Vasiyyet, Birr, Nezr).
  28 künye ve konu kaynaklarındaki 4 künye otomatik denetlendi. Metinler hadith-api İngilizce ve Türkçe (tur-bukhari,
  tur-muslim) metinleriyle karşılaştırılarak anlam olarak aktarıldı; Diyanet'in hadis çevirisiyle kelime kelime
  karşılaştırılmadı.
- **Fıkıh:** DİYK, *Zekât: Sıkça Sorulanlar* (webdosya.diyanet.gov.tr PDF; "SSS, soru …"); Diyanet *İlmihal I*,
  "Zekât" bölümü (nisap 80,18 g altın / 561,2 g gümüş, sarf yerleri, verilmeyecek kimseler, âdâb, fıtır sadakası,
  mezhep farkları); *İlmihal II*, "Kefâretler" ve "Adak ve Yeminler"; DİYK fetvaları (kurul.diyanet.gov.tr):
  "Zekât kimlere verilir?" (19.03.2025), "Zekât kimlere verilmez?" (12.07.2017), "fî sebîlillâh … okullar"
  (12.03.2025), "Maaş ve ücret gibi gelirlerin zekâtı" (26.11.2025), "Fitre, yemin keffâreti ve oruç fidyesinin
  askıda ekmek…" (09.04.2025); *Hadislerle İslâm*, "Zekâta Tabi Mallar ve Zekât Nisabı"; Cuma Hutbesi
  "Sadaka-i Câriye" (17.08.2018).
- **Fitre ve fidye:** 240 TL, DİYK 07.01.2026 toplantısı, duyuru 13.01.2026, 2026 Ramazan'ından 2027 Ramazan'ına
  kadar (kurul.diyanet.gov.tr; sayfa açılıp doğrulandı). Oruç Rehberi ile aynı değer ve kaynak.
- **Yemin kefareti:** 2026 duyurusunda ayrı tutar yoktur; yazılmadı. DİYK fetvasına göre bir yoksula verilecek
  miktar bir fitre miktarıdır (ekranda TL yazılmaz).

## Doğrulanmadı / dikkat

- İlmihal metni bir müftülük sitesindeki PDF'ten okundu; sayfa numarası verilmedi, bölüm adları yazıldı.
- *Zekât: Sıkça Sorulanlar* PDF'inin baskı yılı dosyada yazmıyor (webdosya'ya 2017'de yüklenmiş); kaynakta yıl verilmedi.
- *Hadislerle İslâm* bölümünün cilt numarası doğrulanmadı; yalnız bölüm adı yazıldı.
- Kadının fakir kocasına zekât vermesinde yalnız Ebû Hanîfe'nin görüşü (veremez) yazıldı; diğer mezheplerin görüşü
  Diyanet kaynağında açıkça bulunamadığı için yazılmadı.
- Hz. Peygamber'in yakınlarına zekât verilmemesi İlmihal I'den; "yakınların kimler olduğu" konusundaki görüşler
  ayrıntılandırılmadı.

## Sesli anlatım

Anlatım metni hazırdır (`tools/zekat-anlatim.json`: tam + giriş + 43 durak); **ses henüz üretilmedi.** Ses yalnızca
yerel modellerin bulunduğu bilgisayarda `python3 tools/tts/seslendir.py zekat` ile üretilir. Yer tutucular sayfada
hazırdır (ana ekranda `tam giris`, her konuda `NN-<konu>`).

## Bilinen eksikler

- Ses kayıtları yok.
- Hayvan ve toprak ürünlerinin ayrıntılı zekât hesabı ve şirket zekâtı hesabı kapsam dışı (yalnız açıklama).
- Hesaplayıcı farklı ayardaki altınları ayrı değerlemez; toplam gram tek fiyatla çarpılır (ekranda "yaklaşık").
