# Plan: Zekât ve Sadaka Rehberi (`docs/zekat/`, `apps.js` kimliği `zekat`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir.

## Amaç

Zekâtı, fıtır sadakasını, fidyeyi, kefareti ve gönüllü sadakayı kaynağıyla öğretmek ve zekât miktarını
yaklaşık hesaplamaya yardım etmek. Kullanıcı "Bana zekât düşüyor mu?", "Ne kadar?", "Kime verebilirim?",
"Fitre ile zekât farkı ne?" sorularının cevabını bulabilmeli.

## Kapsam

**1. sürüm:**

1. Zekât: anlamı, farz oluşu (Bakara 43, Tevbe 103 vb.), kime farzdır (şartlar: Müslüman, akıl, buluğ,
   nisap, aslî ihtiyaç ve borç dışında olma, üzerinden bir yıl geçme).
2. Nisap: altın ve gümüş ölçüsü; Diyanet'in esas aldığı ölçü ve güncel değer (`data.js`, tarihli).
3. Zekâta tabi mallar: para ve döviz, altın-gümüş, ticaret malı, alacaklar, hayvanlar (özet), toprak
   ürünleri (öşür, özet).
4. Zekât verilecek sekiz sınıf (Tevbe 60) ve günümüzdeki karşılığı (Diyanet'e göre).
5. Zekât verilemeyecek kişiler: usûl ve fürû, eş, zengin; Hanefî ile Şâfiî farkı not olarak.
6. Fıtır sadakası (fitre): kime vacip, ne zaman, tutar (`data.js`, tarihli ve kaynaklı).
7. Fidye ve kefaret: oruç fidyesi ve kefareti (Oruç Rehberi'ne bağlantı), yemin kefareti.
8. Sadaka ve infak: gönüllü sadaka, sadaka-i câriye, adak; ilgili ayetler ve sahih hadisler.
9. **Hesaplayıcı:** zekât miktarını yaklaşık hesaplar (aşağıda).

**Kapsam dışı:** hayvan ve toprak ürünleri zekâtının ayrıntılı hesabı (yalnızca açıklama), şirket/hisse
senedi zekâtında ayrıntılı fetva (Diyanet kararı varsa özetlenir, yoksa "müftülüğe danışın"), bağış toplama,
ödeme, banka/kurum yönlendirmesi.

## Kaynaklar

1. Kur'an: Bakara 43, 177, 261–274; Tevbe 34–35, 60, 103 (üreticiyle; ayet aralıkları denetlenir).
2. Sahih hadis: Buhârî "Kitâbü'z-zekât", Müslim "Kitâbü'z-zekât"; künyeler hadith-api ile denetlenir.
3. Diyanet İşleri Başkanlığı: İlmihal (II. cilt, "Zekât" bölümü), Din İşleri Yüksek Kurulu kararları,
   `fetva.diyanet.gov.tr` "Zekât" ve "Fıtır Sadakası" başlıkları, her yıl açıklanan fitre ve fidye tutarı.
4. Nisap değeri ve altın/gümüş ölçüsü: Diyanet'in açıkladığı ölçü kaynakla yazılır; gram değeri koda gömülmez.

## Kullanıcıya sorulacaklar

1. Hesaplayıcıda nisap için kullanıcı güncel altın gram fiyatını kendisi mi girsin (öneri: evet; uygulama
   internetten fiyat çekmez), yoksa `data.js`'te tarihli bir değer mi dursun?
2. Gümüş nisabı gösterilsin mi, yalnızca altın mı?
3. Fitre ve fidye tutarı için hangi yılın Diyanet açıklaması kullanılacak; her yıl kim güncelleyecek?
4. Hesaplayıcı 1. sürümde olsun mu, yoksa önce yalnızca rehber mi yayınlansın?

**Kullanıcının cevapları (16.11.2026):**

1. Altın gram fiyatını kullanıcı kendisi girer; uygulama internetten fiyat çekmez.
2. Gümüş nisabı bilgi olarak gösterilir; hesaplayıcıda isteğe bağlıdır.
3. Fitre ve fidye: 2026 (hicrî 1447) yılı Diyanet açıklaması, tarih ve kaynakla; doğrulanamazsa değer boş
   bırakılır ve "Diyanet'in açıklamasına bakın" yazar. Yıllık güncellemeyi kullanıcı ister.
4. Hesaplayıcı 1. sürümde vardır.

## Veri modeli (`docs/zekat/data.js`)

```js
window.ZEKAT_DATA = {
  bolumler: [{ id: 'zekat', ad: 'Zekât' }, { id: 'fitre', ad: 'Fıtır sadakası' }, …],
  konular: [{ id: 'nisap', bolum: 'zekat', ad: 'Nisap', kisa: '…', aciklama: ['2–4 cümle'],
              mezhep: '…', ayetler: [], hadisler: [], akilda: '…', kaynak: ['Diyanet İlmihal II, s. …'] }],
  siniflar: [{ id: 'fakir', ad: 'Fakirler', aciklama: '…' }, …],          // Tevbe 60, sekiz sınıf
  degerler: {                                                             // yıllık değerler: tarih + kaynak
    nisapAltinGram: { deger: null, kaynak: null },
    fitre: { tutar: null, yil: null, kaynak: null },
    fidye: { tutar: null, yil: null, kaynak: null }
  }
};
```

`null` değer ekranda "Güncel tutar için Diyanet'in açıklamasına bakın" olarak görünür; tahmin yazılmaz.

## Hesaplayıcı (`#/hesapla`)

- **Girdiler (TL):** nakit ve banka, döviz (TL karşılığı), altın (gram + gram fiyatı), gümüş (isteğe bağlı),
  ticaret malı, tahsili umulan alacaklar; düşülecekler: vadesi gelmiş borçlar.
- **Hesap:** net varlık = varlıklar − borçlar; nisap = altın gram ölçüsü × kullanıcının girdiği gram fiyatı;
  net varlık ≥ nisap ise zekât = net varlık × 1/40 (%2,5). Tek bir saf fonksiyon (`hesapla(girdi)`), DOM'dan
  ayrı; `tools/zekat-test.mjs` ile örnek durumlar sınanır (nisap altı, tam nisap, borç fazlası, boş girdi).
- **Sunum:** sonuç "yaklaşık" etiketiyle; hangi kalemlerin dahil edildiği ve "üzerinden bir yıl geçmiş
  olmalı" şartı yazılır; "Kişisel durumunuz için müftülüğe danışın" notu her zaman görünür.
- **Gizlilik:** girilen tutarlar cihazdan çıkmaz; ağ isteği yok; `localStorage`'a yalnızca kullanıcı
  "hatırla" derse yazılır, tek dokunuşla silinir.
- Sayı girişi `inputmode="decimal"`, Türkçe virgül ve nokta kabul edilir; para `Intl.NumberFormat('tr-TR')`.

## Ekranlar

- `#/` Ana ekran: hero (`data-anlatim="tam giris"`), bölüm kartları, "Hesapla" ve "Kime verilir?" girişleri.
- `#/b/<bolum>`, `#/k/<id>` Bölüm ve konu sayfaları (`data-anlatim="<dosya>"`).
- `#/siniflar` Sekiz sınıf: Tevbe 60 ve her sınıfın açıklaması.
- `#/hesapla` Hesaplayıcı.
- `#/kim` "Verebilir miyim?" oyunu: kişi kartı (anne, kardeş, komşu, öğrenci…) → verilebilir / verilemez,
  açıklama ve kaynak.

## Taktikler

- **Hüküm ile hesap ayrı:** rehber metni hüküm verir, hesaplayıcı yalnızca aritmetik yapar; hesaplayıcı
  sonucu hiçbir zaman "zekâtınız budur" diye kesin sunulmaz.
- **Yıllık değer disiplini:** her yıllık değer tarih + kaynakla birlikte; tarihi bir yıldan eskiyse ekranda
  "güncel olmayabilir" uyarısı.
- **Çocuk teması:** hesaplayıcı yerine "Paylaşmak" anlatımı: sadaka, gülümsemenin sadaka oluşu gibi sahih
  hadisler; zekât kuralları basitleştirilmeden ama kısaltılarak.
- **Oruç Rehberi ile ortak konu:** fidye ve oruç kefareti metni iki uygulamada çelişmez; tek kaynaktan
  (aynı kaynak ve ifade) yazılır.

## Anlatım

- `tools/zekat-anlatim.mjs`: `giris` + her konu; hesaplayıcı anlatıma girmez. Yüzde ve kesirler yazıyla
  ("kırkta bir, yani yüzde iki buçuk").
- `python3 tools/tts/seslendir.py zekat` (yalnızca bu bilgisayarda).

## Kabul ölçütleri

- `node tools/zekat-test.mjs` geçer; hesaplayıcı nisap altı, eşit, üstü ve borçlu durumlarda doğru.
- Hiçbir yıllık değer kaynaksız ya da tarihsiz değil; ağ isteği yok.
- Her konunun kaynağı var; hadis künyeleri denetimden geçti; Hanefî/Şâfiî farkları notla yazılı.

## Durum: yayınlandı

1. sürüm yayınlandı (16.11.2026): `docs/zekat/` (8 bölüm, 43 konu), sekiz sınıf, yaklaşık hesaplayıcı (`hesap.js`, `node tools/zekat-test.mjs`), "Verebilir miyim?" oyunu, çocuk temasında "Paylaşmak". Oruç Rehberi ile ortak fidye/kefaret/fitre metni üreticide denetlenir. Fitre/fidye 2026: 240 TL; her yıl Diyanet açıklamasıyla `data.js` güncellenir. Doğrulanamayanlar: `docs/zekat/README.md`. Ses kullanıcı onayından sonra.
