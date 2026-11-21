# Kur'an'da Hayvanlar

Kur'an'da adı geçen ya da kıssasında yer alan on beş hayvan: hangi surede ve hangi olayda geçtikleri, ayetin ne
anlattığı, varsa ilgili sahih hadis ve bize bıraktıkları ders; ayrıca hayvanlara merhamet üzerine Buhârî ve Müslim
hadisleri ve iki oyun. Yayın adresi: https://hcguler.github.io/mektep/hayvanlar/
Plan: `planlar/kuran-hayvanlar.md` (kullanıcının 16.11.2026 cevapları bağlayıcıdır).

## Bölümler

- **Hayvanlar (`#/`):** Üç grupta on beş kart (Peygamber kıssalarında; Kur'an'ın anlattığı olaylarda; örnek ve
  ibretlerde). Her kartta hayvanın çizimi ve geçtiği sure.
- **Hayvan sayfası (`#/h/<id>`):** Çizim, ad, Arapça adı (ayetin Tanzil metninden), okunuş ve anlam (Arapça / Okunuş /
  Anlam ayrı ayrı açılıp kapanır, ayetlere de uygulanır), Peygamberler Yolculuğu (`../peygamberler/#/p/<id>`) ve Sureler
  Atlası (`../sureler/#/s/<no>`) bağlantıları, ayetler (Arapça + meal), "Ayet ne anlatıyor?", görüş farkı ve not,
  hadis, Akılda kalsın, çocuk temasında davranış dersi, kaynak.
- **Merhamet (`#/merhamet`):** Hayvanlara iyilik ve eziyet yasağı üzerine yedi hadis (susamış köpek, kediyi aç bırakan
  kadın, karınca yuvası, kuşun yediği ekin, yolculukta develerin hakkı, hayvanı rahat ettirerek kesmek, canlıyı hedef
  yapmamak).
- **Oyunlar (`#/oyun`):** "Hangi surede?" (`#/oyun/sure`, hayvan → sure, on beş hayvandan on soru) ve "Kimin hikâyesi?"
  (`#/oyun/kissa`, yalnızca kıssası olan on bir hayvan → peygamber / kıssa). Hafıza kartları ve "Biliyor muydun?"
  kartları bu sürümde yoktur (kullanıcı kararı).

## Hayvanlar

Karınca (Neml 18-19) · Hüdhüd kuşu (Neml 20-28) · Dört kuş (Bakara 260) · Balık (Sâffât 139-148, Enbiyâ 87-88) ·
Dişi deve (Şems 11-15, A'râf 73) · İnek (Bakara 67-73) · Kurt (Yûsuf 13-18) · Köpek (Kehf 18, 22) · Karga (Mâide 27-31) ·
Fil (Fîl 1-5) · Ebâbîl kuşları (Fîl 3-4) · Arı (Nahl 68-69) · Örümcek (Ankebût 41) · Sivrisinek (Bakara 26-27) ·
Deve (Gāşiye 17-20).

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `hayvanlar.css`, `hayvanlar.js` | Uygulama. CSS iskeleti Sahabe Hayatları / Siyer Çizelgesi ile ortaktır. |
| `data.js` | Hayvanlar, açıklamalar, hadisler, Merhamet sırası. Elle düzenlenir. |
| `cizimler.js` | Her hayvanın renkli düz SVG çizimi (`HAYVAN_CIZ(id)`). Çocuk temasında hayvanın kendi paleti, yetişkin temasında tek renk (altın). İnsan ve peygamber çizimi yoktur. |
| `ayetler.js` | Ayetler. **Elle düzenlenmez**; `node tools/hayvanlar-uret.mjs` üretir. |
| `adlar.js` | Hayvanın Arapça adı, `adAyet` ayetinin Tanzil metninden harekeleriyle. **Elle düzenlenmez**; aynı üretici yazar. |

İçerik değişince sırasıyla `node tools/hayvanlar-uret.mjs`, `node tools/hayvanlar-anlatim.mjs`, `node tools/pwa-surum.mjs`.

## Kaynaklar ve doğrulama

- **Ayetler:** Tanzil (Simple) + Diyanet İşleri meali, `tools/lib/tanzil-ayetler.mjs`; birleşik mealler aralık olarak
  verilmiştir (ör. Neml 20-21 ve 22-26, Şems 11-12, Fîl 3-4, Gāşiye 17-20, Bakara 26-27). Üretici 19 ayet kaydı yazar.
- **Hadisler:** Yalnızca Buhârî ve Müslim. `tools/hayvanlar-uret.mjs` 18 künyeyi fawazahmed0/hadith-api (eng-bukhari,
  eng-muslim) ile denetler: numara var mı, kitap adı tutuyor mu (bölüm sıra numarasından bulunur; Müslim 2242 gibi iki
  kitapta geçen numaralar doğru eşleşir), metinde ravinin adı geçiyor mu. Hadisler anlam olarak, kısaltılarak aktarılır;
  Türkçe ifadeler İngilizce metinle ve tur-bukhari / tur-muslim çevirileriyle karşılaştırıldı (Buhârî 2434'teki "fil"
  ifadesi Arapça metinden de denetlendi).
- **Tefsir bağlamı:** TDV İslâm Ansiklopedisi maddeleri (16.11.2026'da okundu): "Neml Sûresi", "Hüdhüd", "Yûnus",
  "Sâlih" (peygamber), "Bakara Sûresi", "Ashâb-ı Kehf", "Hâbil ve Kābil", "Fîl Sûresi", "Ebrehe", "Nahl Sûresi",
  "Ankebût Sûresi", "Gāşiye Sûresi". Diyanet Kur'an Yolu sitesi (kuran.diyanet.gov.tr) otomatik erişime kapalı olduğu
  için okunamadı.
- **Dört kuş görüş farkı:** Abdurrahman Ateş, "Ölülerin Nasıl Diriltildiğinin Kuşlar Üzerinden Hz. İbrahim'e
  Gösterilmesi", İÜ İlahiyat Fakültesi Dergisi 7/1 (2016), s. 9-34 (Ebû Müslim el-İsfahânî'nin "alıştırma" görüşü;
  Taberî'nin "kesme" tercihi; makaleye göre Kur'an Yolu, I, 414 de kelimeyi farklı anlama çekmeyi gereksiz bulur).
- **Peygamber bağlantıları:** `kissa.p` kimliği `docs/peygamberler/data.js`'te yoksa üretici durur.
- **Ayette olmayan ayrıntı:** Üretici "Kıtmîr", "Ya'fûr", "Belkıs", "Ninova", "balina", "kraliçe" gibi rivayet
  ayrıntılarını metinde yakalar. Hâbil ve Kâbil adları yalnızca "Kur'an adlarını vermez" notunda geçer.

### Doğrulanmadı / dikkat

- "Akılda kalsın", çocuk teması davranış dersleri ve hadislerin altındaki "Bu hadisten" cümleleri yorum cümleleridir.
- Gāşiye sayfasındaki "Her gün görülen bir hayvan bile, dikkatle bakana bir ders verir" ve Sivrisinek sayfasındaki
  "Küçük görünen bir canlı da insana düşündürecek bir örnek olabilir" cümleleri yorumdur; bir tefsirle birebir
  karşılaştırılmadı.
- Ebâbîl için 105:3-4 kullanıldı: Diyanet mealinde 3. ve 4. ayetler tek metindir ama 1-2 ve 5'ten ayrıdır; üretici bu
  aralığı kabul eder. Surenin tamamı (105:1-5) Fil sayfasındadır.
- Arı sayfasında sağlık notu vardır ("hastalıkta tedavi için doktora danışılır").

## Tema

Tema `apps:tema`, renk `theme` anahtarındadır; tema zorlanmaz. Uygulamanın kendi durumu (okunan hayvanlar, son
hayvan, Arapça / Okunuş / Anlam görünümü, yazı boyutu, iki oyunda en iyi sonuç) `hayvanlar:v1` anahtarında saklanır.

## Sesli anlatım

Metin: `node tools/hayvanlar-anlatim.mjs` → `tools/hayvanlar-anlatim.json` (`giris`, her hayvan `01-karinca` …
`15-deve`, `merhamet`, ayrıca `tam`). Ses bu bilgisayarda `python3 tools/tts/seslendir.py hayvanlar` ile üretilir
(henüz üretilmedi). Ana ekranda `data-anlatim="tam giris"`, her hayvan sayfasında `data-anlatim="<sıra>-<id>"`, Merhamet
sayfasında `data-anlatim="merhamet"` yer tutucusu vardır. Ses dosyaları önbelleğe alınmaz.

## Bilinen eksikler

- Ses kayıtları henüz üretilmedi; karttaki "Sesli anlatım" özelliği ses üretilince eklenecek.
- Peygamberler Yolculuğu ve Sureler Atlası tarafında bu uygulamaya geri bağlantı yok.
- Gerçek telefonda deneme yapılmadı.
