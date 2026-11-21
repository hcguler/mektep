# Plan: Kur'an'da Hayvanlar (`docs/hayvanlar/`, `apps.js` kimliği `hayvanlar`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir.

## Amaç

Kur'an'da adı geçen ya da kıssasında yer alan hayvanları, çocuğun ilgisini çekecek biçimde ama kaynağına
sadık kalarak tanıtmak. Çocuk her hayvanın hangi surede ve hangi olayda geçtiğini, o ayetin ne anlattığını ve
kendi hayatına alabileceği bir dersi öğrenmeli. Yetişkin teması aynı içeriği aile içinde birlikte okumak
için sade bir dille sunar.

## Kapsam

**1. sürüm (12–15 hayvan, öneri):**

| Hayvan | Ayet (üreticiyle denetlenir) | Bağlam |
| --- | --- | --- |
| Karınca | Neml 18–19 | Hz. Süleyman ve karıncanın uyarısı |
| Hüdhüd kuşu | Neml 20–28 | Hz. Süleyman'a Sebe' haberini getirmesi |
| Arı | Nahl 68–69 | Allah'ın arıya "vahyi", baldaki şifa |
| Örümcek | Ankebût 41 | Örümcek evinin zayıflığı benzetmesi |
| Fil | Fîl 1–5 | Fil sahipleri ve Kâbe'nin korunması |
| Ebâbîl kuşları | Fîl 3–4 | Fil sahiplerine taş atan kuşlar |
| Balık | Sâffât 139–148, Enbiyâ 87–88 | Hz. Yûnus ve balık |
| Dişi deve | Şems 11–15, A'râf 73 | Hz. Sâlih'in devesi |
| İnek | Bakara 67–71 | İsrâiloğulları ve kesilmesi emredilen inek |
| Köpek | Kehf 18, 22 | Ashâb-ı Kehf'in köpeği |
| Karga | Mâide 31 | Âdem'in oğluna kardeşini gömmeyi göstermesi |
| Kurt | Yûsuf 13–17 | Kardeşlerin "kurt yedi" yalanı |
| Sivrisinek | Bakara 26 | Allah'ın küçük bir şeyi örnek vermesi |
| Deve | Gāşiye 17 | "Deveye bakmazlar mı, nasıl yaratılmış?" |
| Kuşlar (dört kuş) | Bakara 260 | Hz. İbrâhim ve ölülerin diriltilmesi |

Her hayvan için ek olarak, hayvanlara iyilik ve merhamet üzerine Buhârî/Müslim'den sahih hadisler
(ör. susamış köpeğe su veren adam, kediye eziyet eden kadın, karınca yuvası) konusuna uygun olanlarla.

**Sonraki sürümler:** Hz. Mûsâ ile balık (Kehf 61–63), Uzeyr'in eşeği (Bakara 259), sinek (Hac 73),
at ve binek hayvanları (Nahl 8), Nûh'un gemisindeki çiftler (Hûd 40), hayvanlarla ilgili "Biliyor muydun?"
kartları.

**Kapsam dışı:** ceza bağlamında geçen hayvan benzetmeleri (maymun, domuz) çocuk temasında; hayvanların
yaratılışı üzerine bilimsel "mucize" iddiaları; kaynağı zayıf hikâyeler (ör. hayvanların adları üzerine
İsrâiliyat), peygamberlerin çizimi.

## Kaynaklar

1. **Kur'an:** Tanzil metni + Diyanet meali, `tools/lib/tanzil-ayetler.mjs` ile (`tools/hayvanlar-uret.mjs`).
2. **Tefsir bağlamı:** Diyanet "Kur'an Yolu" (kuran.diyanet.gov.tr) ve TDV İslâm Ansiklopedisi'nin ilgili
   maddeleri (ör. "Ashâb-ı Kehf", "Ashâbü'l-fîl", "Sâlih"). Müfessirler arasında görüş farkı olan yerlerde
   (ör. Âdiyât'taki koşanların at mı deve mi olduğu, Ashâb-ı Kehf'in sayısı) "müfessirlere göre" denir ve
   farklı görüş notu düşülür; tartışmalı ögeler 1. sürüme alınmaz.
3. **Sahih hadis:** Buhârî ve Müslim; künyeler hadith-api ile otomatik denetlenir.
4. **Hayvan bilgisi** ("Biliyor muydun?"): yalnızca genel kabul görmüş, basit biyoloji bilgisi; dinî bir
   iddia gibi sunulmaz.

## Kullanıcıya sorulacaklar

1. 1. sürümdeki hayvan listesi (öneri yukarıda) uygun mu; çıkarılacak ya da eklenecek var mı?
2. Uygulama çocuk odaklı mı kalsın (açılışta çocuk teması önerilir), yoksa diğerleri gibi varsayılan
   yetişkin mi?
3. Görseller: sade çizgi simgeler (diğer uygulamalarla aynı) mı, yoksa çocuklar için renkli düz
   (flat) SVG çizimler mi?
4. Oyunlar: "Hangi surede?" (hayvan → sure), "Kimin hikâyesi?" (hayvan → peygamber/kıssa), hafıza kartları;
   hangileri 1. sürüme girsin?
5. "Biliyor muydun?" biyoloji kartları 1. sürümde olsun mu?

**Kullanıcının cevapları (16.11.2026):**

1. Önerilen 15 hayvanın hepsi 1. sürüme girer (merhamet hadisleriyle birlikte).
2. Tema ortaktır: diğer uygulamalar gibi kullanıcının seçtiği tema; çocuk teması zorlanmaz.
3. Görseller renkli düz (flat) SVG çizimlerdir; yetişkin temada tek renge iner.
4. Oyunlar: "Hangi surede?" ve "Kimin hikâyesi?". Hafıza kartları sonraki sürüme kalır.
5. "Biliyor muydun?" kartları 1. sürüme girmez.

## Veri modeli (`docs/hayvanlar/data.js`)

```js
window.HAYVAN_DATA = {
  meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
  gruplar: [{ id: 'kissa', ad: 'Peygamber kıssalarında' }, { id: 'ornek', ad: 'Örnek ve benzetmelerde' }, …],
  hayvanlar: [{
    id: 'karinca', ad: 'Karınca', ar: 'النمل', okunus: 'en-neml', grup: 'kissa', emo: '🐜',
    sure: 'Neml', ayetler: ['27:18-19'], peygamber: 'Hz. Süleyman',
    kisa: 'Tek cümle tanıtım',
    aciklama: ['2–4 cümle: ayet ne anlatıyor'],
    hadis: { metin: '…', ravi: '…', kaynak: 'Buhârî, …, no', k: [['b', 0, 'ravi']] },
    biliyor: 'basit hayvan bilgisi (isteğe bağlı)',
    akilda: 'tek cümle', gorusFarki: null,
    kaynak: ['Kur\'an Yolu, IV, s. …', 'TDV İA, "Neml Sûresi"']
  }]
};
```

`ayetler.js` üretilir; hadis künyeleri denetlenir (`node tools/hayvanlar-uret.mjs`).

## Ekranlar

- `#/` Ana ekran: hero (`data-anlatim="tam giris"`), hayvan kartları ızgarası (simge, ad, sure).
- `#/h/<id>` Hayvan sayfası: içerik kalıbı (ad, Arapça adı ve okunuşu, ayet Arapça/anlam aç-kapa, açıklama,
  hadis, Akılda kalsın, kaynak), ilgili peygamber kıssasına bağlantı (`../peygamberler/`),
  `data-anlatim="<dosya>"`.
- `#/oyun` Seçilen oyunlar.
- Kaynaklar penceresi.

## Taktikler

- **Peygamber kıssası bağlantısı:** `docs/peygamberler/` verisindeki peygamber kimliklerine bağlanır; üretici
  kimliklerin var olduğunu denetler.
- **Hikâye uydurulmaz:** ayetin söylemediği ayrıntı (köpeğin adı, balığın türü, hüdhüdün konuşmasının
  ayrıntısı) eklenmez.
- **Çocuk teması:** her hayvandan bir davranış dersi ("Karınca gibi arkadaşlarını uyar"), büyük simgeler,
  kısa cümleler; oyunlar öne çıkar.

## Anlatım

- `tools/hayvanlar-anlatim.mjs`: `giris` + her hayvan (`<NN>-<id>`).
- `python3 tools/tts/seslendir.py hayvanlar` (yalnızca bu bilgisayarda).

## Kabul ölçütleri

- Her hayvanın en az bir ayeti üreticiden geliyor ve kaynağı yazılı; hadis künyeleri denetimden geçti.
- Ayetin söylemediği hiçbir ayrıntı metinde yok; görüş farkı olan yerlerde not var.
- 320/390/1280 piksel, iki tema, açık/koyu denendi; anlatım iki profilde her hayvan için var.

## Durum: yayınlandı

1. sürüm yayınlandı (16.11.2026): `docs/hayvanlar/` (15 hayvan, Merhamet sayfası, "Hangi surede?" ve "Kimin hikâyesi?"
oyunları, renkli düz SVG çizimler), `tools/hayvanlar-uret.mjs` (19 ayet kaydı, 15 Arapça ad, 18 hadis künyesi ve
peygamber kimliği denetimi). Diyanet meali yalnızca Fîl 3-4'ü birleşik verir; Ebâbîl sayfası 105:3-4, Fil sayfası 105:1-5
kullanır. Kur'an Yolu otomatik erişime kapalı olduğundan tefsir bağlamı TDV İA ile karşılaştırıldı. Ayrıntı ve
doğrulanamayanlar: `docs/hayvanlar/README.md`. Ses kullanıcı onayından sonra.
Sonraki sürüm: hafıza kartları, "Biliyor muydun?" kartları, plandaki ek hayvanlar.
