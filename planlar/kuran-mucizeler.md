# Kur'an'dan Mucizeler — plan

> **Durum:** 1. sürüm yayında (20.11.2026). Uygulama: `docs/mucizeler/`, kimlik `mucizeler`.

## Amaç

Kur'an'ın önceden haber verip sonra gerçekleşen haberlerini ve indiği gün bilinmeyen, bugün bilimin ortaya
koyduğu bilgilerle birlikte düşünülen ayetleri, kaynak kesinliğinden ödün vermeden anlatmak.

## Kullanıcıya sorulanlar ve cevaplar (20.11.2026)

Kullanıcı örnek olarak şunları verdi: Ebu Cehil'in Müslüman olmayacağının bildirilmesi, Ay'ın yörüngesinin kuru
hurma dalına benzetilmesi, Persilerin Bizans'a "9 ay ya da 9 yıl" içinde yenileceği, ana rahminde et–kemik–et
sırası, dağların hareketi. "Bilimsel olarak ispatlanmış, Kur'an'ın geldiği zamanda bilinmeyen gerçekler ve
gelecekten haberler; Kur'an dışına çıkılmadan."

Kur'an metniyle karşılaştırınca şu öneriler yapıldı; kullanıcı "mevcut önerilerini birebir uygula" diye onayladı:

1. Müslüman olmayacağı bildirilen kişi Ebu Leheb'dir (Tebbet 111:1-5); Ebu Cehil için böyle bir ayet yoktur.
2. Yâsîn 36:39'daki kuru hurma dalı Ay'ın görünüşünü (hilal) anlatır; yörünge 36:40'tadır. İkisi tek ögede.
3. Rûm 30:2-4'te "bid‘ı sinîn" = birkaç (üç ile dokuz) yıl; "ay" anlamı yoktur.
4. Neml 27:88 klasik tefsirlerin çoğunda kıyamet bağlamındadır; Dünya'nın hareketi "çağdaş yorum" notuyla verilir.
5. "Kur'an dışına çıkmamak": hadise dayanan mucizeler alınmaz; gerçekleşmeyi anlatan kısa tarih bilgisi eklenir.
6. On iki öge (aşağıda). Her öge: ayet + Diyanet meali, açıklama, "Akılda kalsın", kaynak; bilimsel bilgi "bugün
   bildiğimiz" diye, yorumun kime ait olduğu belirtilerek.
7. Görseller: yetişkin temasında çizgi simge, çocuk temasında emoji. Oyun: "Hangi surede?".
8. Ses üretilmez, yalnızca anlatım metni hazırlanır. (21.11.2026: kullanıcı sesin üretilmesini istedi; iki profil
   bu bilgisayarda üretildi.)

## 1. sürüm (12 öge)

Gelecekten haberler: Rumların zaferi (30:2-5) · Ebu Leheb (111:1-5) · Bedir'deki bozgun (54:44-45) · Mescid-i
Haram'a giriş (48:27) · Kur'an'ın korunması (15:9) · Benzeri getirilemez (2:23-24, 17:88).

O gün bilinmeyenler: Ana rahminde yaratılış (23:12-14) · Ay'ın evreleri ve yörüngeler (36:38-40) · Dağların
hareketi (27:87-88) · Evrenin genişlemesi (51:47) · İki deniz arasındaki engel (55:19-20, 25:53) · Göklerin ve
yerin ayrılması (21:30).

## Ölçüler

- Ayetler yalnızca `tools/mucizeler-uret.mjs` ile (Tanzil + Diyanet meali); anahtar Arapça ifade de ayetin Tanzil
  metninden alınır.
- Bilim ögelerinde üç ayrı katman: ayetin meali, bugünkü bilgi, yorum notu (klasik tefsir + çağdaş yorum).
  "Kesin kanıt" dili kullanılmaz.
- Tarih bilgisi TDV İslâm Ansiklopedisi ile karşılaştırılır; doğrulanamayan bilgi README'de "Doğrulanmadı" altında.

## Sonraki sürüm için adaylar

- Firavun'un bedeninin ibret olarak bırakılması (Yûnus 10:92), parmak uçları (Kıyâme 75:3-4), demirin
  indirilmesi (Hadîd 57:25): yorum farkları büyük olduğu için kullanıcıya sorulmadan eklenmez.
