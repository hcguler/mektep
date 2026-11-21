# Plan: Sureler Atlası (`docs/sureler/`, `apps.js` kimliği `sureler`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir.

## Amaç

Kur'an'ın 114 suresini bir atlas gibi tanıtmak: her surenin adı ve anlamı, Mekkî/Medenî oluşu, iniş sırası,
ayet sayısı, ana konusu ve öne çıkan bir ayeti. Kullanıcı Kur'an'ın bütününü bir haritada görmeli, bir sureyi
okumaya başlamadan önce "neyi anlatıyor?" sorusunun cevabını bulmalı.

## Kapsam

**1. sürüm:** 114 surenin tamamı için künye (otomatik veri) + 30. cüzün ve sık okunan surelerin
(Fâtiha, Bakara'nın son iki ayeti bağlamında Bakara, Kehf, Yâsîn, Mülk, Rahmân, Vâkıa …) konu özeti.
Konu özeti olmayan sure sayfasında yalnızca künye ve "Konu özeti hazırlanıyor" yazar.

**2. ve sonraki sürümler:** kalan surelerin konu özetleri, 8–12 surelik dalgalarla.

**Kapsam dışı:** tefsir (ayet ayet açıklama), tam sure metni ve meali (yalnızca öne çıkan ayet),
kıraat sesi (Ezberler'e bağlantı verilir), sure faziletleri hakkında zayıf rivayetler.

## Kaynaklar

1. **Künye verisi (otomatik):** Tanzil Quran metadata (`quran-data`): sure adı, ayet sayısı, iniş türü
   (Mekkî/Medenî), iniş sırası, cüz ve hizip sınırları. `tools/sureler-uret.mjs` indirir ve `data.js`'teki
   künye alanlarını üretir; elle yazılmaz. Ayet sayısı Kûfe sayımıyla (toplam 6236) Diyanet mushafıyla
   karşılaştırılır.
2. **Türkçe sure adları:** `tools/lib/tanzil-ayetler.mjs` → `SURE` listesi (diğer uygulamalarla aynı yazım).
3. **İniş türü ve sırası:** Tanzil verisi Diyanet'in "Kur'an Yolu" tefsiri ve Diyanet meali sure girişleriyle
   karşılaştırılır. Mekkî/Medenî oluşunda görüş farkı bulunan sureler (ör. Rahmân, Hac, Ra'd) `ihtilaf`
   alanıyla işaretlenir ve ekranda "Âlimler arasında farklı görüş vardır" notu gösterilir.
4. **Konu özeti:** Diyanet İşleri Başkanlığı "Kur'an Yolu Türkçe Meal ve Tefsir" sure giriş bölümleri ve
   TDV İslâm Ansiklopedisi'nin ilgili sure maddesi. Özet kendi cümlelerimizle yazılır, kaynak belirtilir.
5. **Öne çıkan ayet:** Diyanet meali, `tools/lib/tanzil-ayetler.mjs` ile; birleşik meal kuralına uyulur.
6. **Fazilet:** yalnızca Buhârî/Müslim'deki sahih hadislerle (künye hadith-api ile denetlenir). Başka
   kaynaktaki rivayet ancak sıhhati açıkça yazılarak ve kullanıcı onayıyla girer.

## Kullanıcıya sorulacaklar

1. 1. sürümde hangi sureler konu özetiyle gelsin (öneri: 30. cüz + 10 sık okunan sure)?
2. Sıralama seçenekleri: mushaf sırası ve iniş sırası yeterli mi, ayet sayısına göre de olsun mu?
3. "Harita" görünümü: Mekke/Medine kümelenmesi mi, iniş sırasına göre zaman şeridi mi, ikisi de mi?
4. Ezberler'deki surelere bağlantı verilsin mi (sure sayfasından "Ezberle" düğmesi)?

**Kullanıcının cevapları (16.11.2026):**

1. Konu özeti: 30. cüzün bütün sureleri + Fâtiha, Bakara, Kehf, Yâsîn, Rahmân, Vâkıa, Mülk, Cuma,
   Hucurât, Fetih.
2. Sıralama: mushaf sırası, iniş sırası, ayet sayısı.
3. Harita: ikisi de (Mekke/Medine kümelenmesi ve iniş sırası zaman şeridi).
4. Ezberler'deki surelere "Ezberle" bağlantısı verilir.

## Veri modeli

```js
// docs/sureler/kunye.js — ÜRETİLİR (tools/sureler-uret.mjs), elle düzenlenmez
window.SURE_KUNYE = [{ no: 1, ad: 'Fâtiha', ayet: 7, tur: 'mekki', inis: 5, cuz: [1], sayfa: 1 }, …];

// docs/sureler/data.js — elle yazılır
window.SURE_DATA = {
  ozetler: { 1: { anlam: 'Açılış', konu: ['2–4 cümle'], tema: ['dua', 'tevhid'],
                  oneCikan: '1:5', akilda: 'tek cümle', ihtilaf: null,
                  kaynak: ['Kur\'an Yolu, I, s. …', 'TDV İA, "Fâtiha" maddesi'] } },
  temalar: [{ id: 'tevhid', ad: 'Tevhid' }, …]
};
```

`ayetler.js` (öne çıkan ayetler) de üretilir.

## Ekranlar

- `#/` Atlas: 114 sure ızgarası (her hücre: numara, ad, ayet sayısı; renk Mekkî/Medenî, büyüklük ayet
  sayısına göre). Sıralama: mushaf / iniş. Arama (ad ve numara). Hero'da `data-anlatim="tam giris"`.
- `#/s/<no>` Sure sayfası: künye kartları (Mekkî/Medenî, iniş sırası, ayet, cüz), anlam, konu özeti,
  öne çıkan ayet (Arapça/anlam aç-kapa), temalar, Akılda kalsın, kaynak, önceki/sonraki sure;
  `data-anlatim="<dosya>"`.
- `#/inis` Zaman şeridi: sureler iniş sırasıyla; Mekke ve Medine dönemi ayrılır (Siyer'e bağlantı:
  hicret).
- `#/oyun` İki oyun: "Mekkî mi, Medenî mi?" ve "Hangisi daha önce indi?". İhtilaflı sureler oyuna girmez
  (Siyer'deki `oyun: false` gibi).

## Taktikler

- **Veri ile yorum ayrı tutulur:** künye üreticiden gelir ve test edilir (114 sure, 6236 ayet, iniş sırası
  1–114 tekrarsız); yorum (özet) elle yazılır ve kaynaklanır. Ekranda ikisi görsel olarak ayrılır.
- **Boş özet dürüstçe gösterilir:** konu özeti yoksa uydurma kısa metin yazılmaz.
- **Büyük ızgara performansı:** 114 hücre tek seferde çizilir, görsel ağırlık CSS ile; görüntü yok.
- **Çocuk teması:** her sure için bir emoji/simge ve tek cümlelik "Bu sure ne anlatıyor?"; oyunlar öne çıkar.
- **Anlatım uzunluğu:** (16.11.2026 kullanıcı kararı) 114 sure özetlendiği için tek tam kayıt yoktur; ana ekranda `giris` çalar; künye cümlesi kısa tutulur
  ("Mekke'de inmiştir, yedi ayettir, iniş sırasına göre beşincidir.").

## Anlatım

- `tools/sureler-anlatim.mjs`: `giris` + özeti olan her sure (`<NNN>-<ad>`, ör. `001-fatiha`).
  Sayılar yazıyla, sure adı okunuşa uygun ("Âl-i İmrân" → "Ali İmran" gibi okunuş sözlüğü).
- `python3 tools/tts/seslendir.py sureler` (yalnızca bu bilgisayarda).

## Kabul ölçütleri

- Üretici testleri: 114 sure, toplam 6236 ayet, iniş sırası 1–114 eksiksiz ve tekrarsız, Mekkî 86 /
  Medenî 28 (Tanzil sayımı; Diyanet ile fark varsa kullanıcıya sorulur ve README'de yazılır).
- Her konu özetinin en az bir kaynağı var; öne çıkan ayetler üreticiden.
- Izgara 320 pikselde taşmıyor; arama ve sıralama klavyeyle kullanılabiliyor.

## Durum: yayınlandı

1. sürüm yayınlandı (16.11.2026): `docs/sureler/`, 114 surenin künyesi, 47 surede konu özeti (30. cüz + 10 sure), Mekke–Medine haritası, iniş şeridi, iki oyun, Ezberler bağlantısı. Künye Tanzil Quran Metadata'dan üretilir ve quran-api `info.json` ile karşılaştırılır. Mekkî/Medenî görüş farkı TDV İslâm Ansiklopedisi'ne göre 9 belirgin + 14 zayıf rivayet (oyuna girmez). Kur'an Yolu girişleri çevrimiçi açılamadığından karşılaştırma TDV İA ile yapıldı. Ayrıntı: `docs/sureler/README.md`. Ses kullanıcı onayından sonra.
2. sürüm hazır (16.11.2026, yayın ana oturumda): kalan 67 surenin konu özeti mushaf sırasıyla yedi dalgada yazıldı (toplam 114). Her özet TDV İslâm Ansiklopedisi'nin sure maddesiyle karşılaştırıldı; Kur'an Yolu yeniden denendi, açılmadı. Öne çıkan ayetler üreticiden (birleşik meal aralıkları dahil), hadis künyesi 28 (27 sure, yalnızca Buhârî/Müslim, hadith-api ile denetlendi). Anlatım metni 115 kayıt (giriş + 114 sure); ses henüz üretilmedi.
