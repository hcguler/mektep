# Plan: Oruç Rehberi (`docs/oruc/`, `apps.js` kimliği `ramazan`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir.

## Amaç

Ramazan orucunu ve nafile oruçları doğru tutmak isteyen yetişkine ve oruca yeni başlayan çocuğa, orucun
hükümlerini kaynağıyla, sade ve güvenilir biçimde öğretmek. Kullanıcı şu soruların cevabını bulabilmeli:
"Orucum bozuldu mu?", "Kaza mı, kefaret mi?", "Hastayım, yolcuyum; ne yapmalıyım?", "Hangi günler oruç
tutulmaz?"

## Kapsam

**1. sürüm (yayın için yeterli):**

1. Giriş: orucun anlamı ve farz oluşu (Bakara 183–185; ayet aralıkları üreticiyle denetlenir).
2. Orucun farzları ve şartları: kime farz, niyet ve niyet vakti, imsak ve iftar.
3. Sahur ve iftar: sünnetleri, ilgili sahih hadisler.
4. Orucu bozan durumlar: yalnız kaza gerektirenler, kaza ve kefaret gerektirenler.
5. Orucu bozmayan durumlar: unutarak yeme içme, kusma türleri, diş fırçalama, iğne vb. güncel sorular
   (Diyanet Din İşleri Yüksek Kurulu kararlarına göre).
6. Mekruh olanlar.
7. Ruhsatlar: yolcu, hasta, hamile ve emzikli, yaşlı (fidye), çocuk.
8. Kaza, kefaret ve fidye: tanımları ve nasıl yerine getirildiği (fidye tutarı `data.js`'te tarihli değer).
9. Nafile oruçlar: Şevval'de altı gün, Arefe, Aşure (Muharrem 9–10 / 10–11), pazartesi-perşembe, ayın
   ortası; her biri sahih hadisiyle.
10. Oruç tutulmayan günler: bayram günleri ve diğerleri.
11. Ramazan'ın ibadetleri: teravih, itikâf, Kadir Gecesi, fıtır sadakası (Zekât ve Sadaka Rehberi'ne bağlantı).

**Sonraki sürümler:** 30 günlük Ramazan takibi (`localStorage`), kaza orucu sayacı.

**Kapsam dışı:** namaz/imsak vakitlerini hesaplamak (konuma göre vakit = dış veri; yalnızca
`namazvakitleri.diyanet.gov.tr` bağlantısı verilir), kişiye özel fetva, tartışmalı güncel meselelerde
Diyanet dışı görüşler.

## Kaynaklar (öncelik sırasıyla)

1. Kur'an: Bakara 183–187 (Tanzil metni + Diyanet meali; `tools/lib/tanzil-ayetler.mjs`).
2. Sahih hadis: Buhârî "Kitâbu's-savm", Müslim "Kitâbu's-sıyâm"; künyeler hadith-api ile denetlenir.
   Ebû Dâvûd, Tirmizî gibi kaynaklardan alınan rivayette (ör. iftar duası) sıhhat durumu açıkça yazılır;
   doğrulanamıyorsa kullanılmaz.
3. Diyanet İşleri Başkanlığı: İlmihal (II. cilt, "Oruç" bölümü), Din İşleri Yüksek Kurulu'nun oruçla ilgili
   kararları ve `fetva.diyanet.gov.tr` "Oruç" başlığı. Her hüküm için hangi sayfa/karar olduğu `kaynak`
   alanına yazılır.
4. Mezhep farkı: Hanefî ana metin; Şâfiî farkı varsa tek cümlelik notla ("Şâfiî mezhebine göre …").

## Kullanıcıya sorulacaklar (başlamadan önce)

1. Uygulamanın adı "Oruç Rehberi" mi kalsın, "Ramazan Rehberi" mi? (Kart şu an "Oruç Rehberi".)
2. Şâfiî farkları hep gösterilsin mi, yalnızca önemli yerlerde mi?
3. Güncel sorular (ilaç, iğne, sprey, diş tedavisi, kan tahlili) ne kadar ayrıntılı olsun?
4. Fidye tutarı gösterilsin mi; gösterilecekse hangi yılın Diyanet açıklaması kullanılsın?
5. 1. sürüme takip/sayaç girsin mi?

**Kullanıcının cevapları (16.11.2026):**

1. Ad "Oruç Rehberi" kalır.
2. Şâfiî farkı yalnızca önemli yerlerde gösterilir.
3. Güncel sorular: Din İşleri Yüksek Kurulu kararındaki başlıca durumlar (iğne, ilaç, sprey, diş tedavisi,
   kan tahlili, göz/kulak damlası), kısa.
4. Fidye tutarı Zekât ve Sadaka Rehberi ile aynı tarihli değerdir (aynı kaynak).
5. Takip/sayaç 1. sürüme girmez.

## Veri modeli (`docs/oruc/data.js`)

```js
window.ORUC_DATA = {
  surum: '…', meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
  bolumler: [{ id: 'farz', ad: 'Orucun farzları', alt: '…', emo: '🌙' }, …],
  konular: [{
    id: 'niyet', bolum: 'farz', ad: 'Niyet', emo: '🤲',
    kisa: 'Tek cümle özet',
    aciklama: ['2–4 cümle'],
    hukum: 'farz' | 'sunnet' | 'mekruh' | 'bozar-kaza' | 'bozar-kefaret' | 'bozmaz' | 'ruhsat',
    mezhep: 'Şâfiî farkı (varsa)',
    ayetler: ['2:187'], hadisler: [{ kaynak: 'Buhârî, Savm, 1923', metin: 'anlamı' }],
    akilda: 'tek cümle',
    kaynak: ['Diyanet İlmihal II, s. …', 'DİYK kararı …']
  }],
  sorular: [{ id: 'dis-fircalama', soru: 'Oruçluyken diş fırçalamak orucu bozar mı?', cevap: 'bozmaz',
              aciklama: '…', kaynak: '…' }],
  degerler: { fidye: { tutar: null, tarih: null, kaynak: null } }
};
```

`ayetler.js` elle yazılmaz: `node tools/oruc-uret.mjs` üretir ve hadis künyelerini denetler.

## Ekranlar

- `#/` Ana ekran: hero (başlık, açıklama, `data-anlatim="tam giris"`), bölüm kartları, "Bozar mı?" girişi.
- `#/b/<bolum>` Bölüm: o bölümün konuları.
- `#/k/<id>` Konu sayfası: içerik kalıbı + hüküm rozeti (renkli: farz, sünnet, mekruh, bozar–kaza,
  bozar–kaza+kefaret, bozmaz) + `data-anlatim="<dosya>"`.
- `#/bozar-mi` Oyun: soru kartı, üç seçenek (Bozmaz / Bozar, kaza gerekir / Bozar, kaza ve kefaret gerekir);
  cevaptan sonra açıklama ve kaynak. Yanlış cevapta azarlamaz; çocuk temasında cesaretlendirir.
- `#/nafile` Nafile oruçlar ve oruç tutulmayan günler çizelgesi (hicrî aylara göre).
- Kaynaklar penceresi: bütün kaynakların listesi ve "Kişisel durumunuz için Diyanet'e danışın" notu.

## Taktikler

- **Hüküm rozeti** her yerde aynı renk ve kelimeyle kullanılır; kullanıcı bir bakışta "bozar mı" görür.
- **Hassas uyarılar:** sağlık konularında (diyabet, hamilelik, ilaç) "doktorunuza ve müftülüğe danışın"
  cümlesi konu sayfasında görünür; uygulama tıbbi tavsiye vermez.
- **Örnek olaylar:** her bozan/bozmayan konuda bir günlük hayat örneği ("Abdest alırken boğazına su kaçtı").
  Örnek, hükmü değiştirmeyecek kadar net seçilir.
- **Bozar mı? oyunu** `sorular` listesinden gelir; her soru bir konuya bağlıdır, cevap konu sayfasına götürür.
- **Çocuk teması:** "Ben de oruç tutuyorum" dili; çocuğa oruç farz olmadığı, alıştırma olduğu açıkça
  söylenir; ruhsat bölümü öne çıkar.
- **Kavram Haritası bağlantısı:** hüküm terimleri (farz, vacip, mekruh) `../kavram/#/k/<id>` sayfasına
  bağlanır.

## Anlatım

- `tools/oruc-anlatim.mjs`: `giris` + her konu bir durak (`<NN>-<id>`); hüküm rozeti cümleye çevrilir
  ("Bu durum orucu bozar ve kaza gerektirir."). `tam` kaydı bölüm sırasıyla.
- `python3 tools/tts/seslendir.py oruc` (yalnızca bu bilgisayarda).

## Kabul ölçütleri

- Her konunun en az bir kaynağı var; her hadis künyesi otomatik denetimden geçiyor.
- "Bozar mı?" oyunundaki her cevap, bağlı konunun hükmüyle aynı (üretici bunu denetler).
- Fidye ve benzeri değerler tarih ve kaynakla gösteriliyor ya da hiç gösterilmiyor.
- 320/390/1280 piksel, iki tema, açık/koyu denendi; anlatım iki profilde her konu için var.

## Durum: yayınlandı

1. sürüm yayınlandı (16.11.2026): `docs/oruc/` (11 bölüm, 52 konu, 20 "Bozar mı?" sorusu, nafile oruç çizelgesi). Ayrıntı ve doğrulanamayanlar: `docs/oruc/README.md`. Sesli anlatım metni hazır; ses kullanıcı dinleyip onaylayınca yayına girer.
Sonraki sürüm: 30 günlük Ramazan takibi, kaza orucu sayacı.
