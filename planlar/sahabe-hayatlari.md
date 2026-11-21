# Plan: Sahabe Hayatları (`docs/sahabe/`, `apps.js` kimliği `sahabe`)

Bu dosya uygulama yapılmadan önce okunacak çalışma talimatıdır. Önce `planlar/README.md`
(ortak yöntem) ve `CLAUDE.md` okunur; buradaki kurallar onlara eklenir.

## Amaç

Peygamberimizin (s.a.v.) arkadaşlarını, hayatlarından güvenilir kaynakla aktarılan kısa kesitler ve
bugüne bıraktıkları örnek davranışlarla tanıtmak. Kullanıcı her sahabinin kim olduğunu, Peygamberimizle
ilişkisini, İslam'a katkısını ve kendi hayatına alabileceği bir dersi öğrenmeli.

## Kapsam

**1. sürüm (10–12 sahabi):** Dört halife (Hz. Ebû Bekir, Hz. Ömer, Hz. Osman, Hz. Ali) ve
Hz. Hatice, Hz. Âişe, Hz. Fâtıma, Hz. Bilâl, Hz. Mus'ab bin Umeyr, Hz. Abdullah bin Mes'ûd,
Hz. Ebû Hüreyre gibi hayatı sahih kaynakta iyi belgelenmiş kişiler. Liste kullanıcıyla kesinleştirilir.

**Sonraki sürümler:** Aşere-i mübeşşerenin kalanı, Ensar'dan örnekler, kadın sahabiler, genç sahabiler
(çocuk teması için), 8–12 kişilik dalgalarla.

**Kapsam dışı:** sahabe arasındaki siyasi olaylar ve fitne dönemi tartışmaları (yalnızca "vefatı" bilgisi
olarak, yorum yapmadan), mezhep/fırka tartışmaları, kerametler ve sahih olmayan menkıbeler, sahabenin
yüzünü ya da bedenini gösteren görsel.

## Kaynaklar

1. **Sahih hadis:** Buhârî "Fedâilü ashâbi'n-nebî", Müslim "Fedâilü's-sahâbe" bölümleri; künyeler
   hadith-api ile otomatik denetlenir. Her sahabi için en az bir sahih rivayet hedeflenir.
2. **Kur'an:** sahabeyle ilgili ayetler (ör. Tevbe 40, Tevbe 100, Fetih 18, Fetih 29) yalnızca hakkında
   indiği ya da kapsadığı tefsirlerde açıkça belirtilenler; bağlantı "müfessirlere göre" diye kurulur.
3. **Biyografik bilgi (doğum, vefat, kabile, Müslüman olma sırası):** TDV İslâm Ansiklopedisi'nin ilgili
   maddesi (birincil); gerekirse İbn Hacer, "el-İsâbe" ve İbn Sa'd, "et-Tabakāt" (TDV İA üzerinden).
   Tarihlerde rivayet farkı varsa "yaygın kabule göre" denir ve farklı görüş notu düşülür.
4. **Siyer bağlantısı:** `docs/siyer/data.js` olaylarıyla tutarlılık denetlenir (aynı olay iki uygulamada
   farklı tarihle anlatılamaz).
5. "Aşere-i mübeşşere" hadisi Buhârî/Müslim'de değil, Tirmizî ve Ebû Dâvûd'dadır; kullanılacaksa kaynak ve
   sıhhat durumu açıkça yazılır.

## Kullanıcıya sorulacaklar

1. 1. sürümdeki sahabi listesi (öneri yukarıda); kadın sahabiler 1. sürümde kaç kişi olsun?
2. Ad yazımı: "Hz. Ebû Bekir" mi, "Ebû Bekir (r.a.)" mı? Uygulama içinde tek biçim kullanılır.
3. Fitne dönemi ve şehadetler nasıl anılsın? (Öneri: yalnızca vefat bilgisi ve tarih, ayrıntısız.)
4. Siyer Çizelgesi'ne karşılıklı bağlantı verilsin mi?

**Kullanıcının cevapları (16.11.2026):**

1. 12 sahabi: dört halife, Hz. Hatice, Hz. Âişe, Hz. Fâtıma, Hz. Bilâl, Hz. Mus'ab bin Umeyr,
   Hz. Abdullah bin Mes'ûd, Hz. Ebû Hüreyre, Hz. Sa'd bin Ebû Vakkâs (3 kadın sahabi).
2. Ad yazımı: "Hz. Ebû Bekir".
3. Fitne dönemi ve şehadetler: yalnızca vefat yeri ve tarihi, ayrıntısız.
4. Siyer Çizelgesi'ne karşılıklı bağlantı verilir.

## Veri modeli (`docs/sahabe/data.js`)

```js
window.SAHABE_DATA = {
  gruplar: [{ id: 'halifeler', ad: 'Dört halife' }, { id: 'ehlibeyt', ad: 'Ehl-i beyt' }, …],
  sahabiler: [{
    id: 'ebubekir', ad: 'Hz. Ebû Bekir', lakap: 'es-Sıddîk', grup: 'halifeler', emo: '🤝',
    dogum: '573 civarı', vefat: '634, Medine', musluman: 'İlk Müslüman olan hür erkeklerden',
    kisa: 'Tek cümle tanıtım',
    hayat: [{ baslik: 'Hicret yolculuğu', metin: ['2–4 cümle'], ayetler: ['9:40'], hadis: { kaynak: '…', metin: '…' },
              siyer: 'hicret' }],
    erdem: 'Örnek davranış (ör. sadakat)', akilda: 'tek cümle',
    gorusFarki: 'tarih ya da rivayet farkı notu (varsa)',
    kaynak: ['TDV İA, "Ebû Bekir" maddesi', 'Buhârî, Fedâilü ashâbi\'n-nebî, …']
  }]
};
```

`ayetler.js` üretilir (`node tools/sahabe-uret.mjs`), hadis künyeleri denetlenir.

## Ekranlar

- `#/` Ana ekran: hero (`data-anlatim="tam giris"`), gruplara ayrılmış sahabi kartları (ad, lakap, simge,
  tek cümle). Görselde yüz yok; her sahabiye bir simge/renk.
- `#/s/<id>` Sahabi sayfası: künye (doğum, vefat, Müslüman oluşu), hayattan kesitler (her biri kendi kartı),
  ayet/hadis, örnek davranış, Akılda kalsın, görüş farkı notu, kaynak; Siyer bağlantısı;
  `data-anlatim="<dosya>"`.
- `#/zaman` Zaman şeridi: sahabilerin İslam'a giriş ve vefat yılları, Siyer dönemleriyle aynı renklerle.
- `#/oyun` "Kim söyledi / kim yaptı?": bir kesit gösterilir, dört sahabiden doğrusu seçilir.

## Taktikler

- **Saygılı dil:** her sahabi adı tek biçimde yazılır; abartılı övgü ve karşılaştırma ("en büyüğü") yapılmaz,
  sahih hadiste geçen ifade aynen aktarılır.
- **Kesit yaklaşımı:** tam biyografi yerine 3–5 doğrulanmış kesit; her kesit tek bir derse bağlanır.
  Doğrulanamayan meşhur hikâye (kaynağı zayıf menkıbe) yazılmaz; kullanıcı isterse "zayıf rivayet" notuyla.
- **Tutarlılık testi:** üretici, `siyer` alanındaki olay kimliklerinin `docs/siyer/data.js`'te var olduğunu ve
  tarihlerin çelişmediğini denetler.
- **Çocuk teması:** "Peygamberimizin arkadaşları" dili; her sahabiden bir davranış ("Bilâl gibi sabırlı ol"),
  oyun öne çıkar; vefat ve şehadet anlatımı yumuşak ve kısa.

## Anlatım

- `tools/sahabe-anlatim.mjs`: `giris` + her sahabi (`<NN>-<id>`). "Hz." → "Hazreti", "(r.a.)" →
  "radıyallahu anh/anhâ" açılır; tarihler yazıyla.
- `python3 tools/tts/seslendir.py sahabe` (yalnızca bu bilgisayarda).

## Kabul ölçütleri

- Her sahabinin en az bir sahih kaynağı ve TDV İA maddesi kaynakta yazılı; hadis künyeleri denetimden geçti.
- Siyer ile tarih çelişkisi yok (üretici testi).
- Fitne ve siyasi tartışma içeren cümle yok; görselde yüz yok.

## Durum: yayınlandı

1. sürüm yayınlandı (16.11.2026): `docs/sahabe/` (12 sahabi, 54 kesit), zaman şeridi, "Kim yaptı?" oyunu, Siyer Çizelgesi ile karşılıklı bağlantı (`siyer-baglanti.js`). Hz. Hatice'nin vefatı kullanıcı kararıyla TDV İA'ya göre 620 (Siyer'de Hüzün yılı ve Tâif de 620'ye çekildi). Doğrulanamayanlar: `docs/sahabe/README.md`. Ses kullanıcı onayından sonra.
Sonraki sürümler: Aşere-i mübeşşerenin kalanı, Ensar, kadın ve genç sahabiler (8–12 kişilik dalgalar).
