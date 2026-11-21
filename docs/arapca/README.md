# Ayet Ayet Arapça

Kur'an'ı mushaf sırasıyla, sayfa sayfa okurken Arapça öğreten uygulama. Her sayfada o sayfada ilk kez
geçen kelimeler, ekler, kalıplar, deyimler ve dil bilgisi konuları öğretilir; ardından aralıklı tekrar.
Yayın adresi: https://hcguler.github.io/mektep/arapca/ · Plan: `docs/planlar/ayet-ayet-arapca.md`

Yayında: başlangıç dersi, **1. cüz** (21 sayfa, Fâtiha ve Bakara 1–141) **2. cüz** (20 sayfa, Bakara 142–252) **3. cüz** (21 sayfa, Bakara 253 – Âl-i İmrân 100; 62. sayfa 3:92 ile başladığı için tamamı bu cüzdedir), **4. cüz** (19 sayfa, Âl-i İmrân 101 – Nisâ 23), **5. cüz** (20 sayfa, Nisâ 24–147) **6. cüz** (20 sayfa, Nisâ 148 – Mâide 83; 121. sayfa 5:78 ile başladığı için 5:82–83 de bu cüzdedir), **7. cüz** (20 sayfa, Mâide 84 – En'âm 110) ve **8. cüz** (20 sayfa, En'âm 111 – A'râf 87). Öteki cüzler "Hazırlanıyor".

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `index.html`, `arapca.css`, `arapca.js` | Uygulama (ekranlar, kıraat oynatıcısı, aralıklı tekrar, alıştırmalar). Derleme adımı yoktur. |
| `simgeler.js` | Somut kelimeler için elle çizilmiş çizgi simgeler. |
| `veri/indeks.json` | Bütün mushafın dizini: 604 sayfa → ilk/son ayet ve cüz, 30 cüz, sure adları. **Üretilir.** |
| `veri/c01.json` … `veri/c08.json` | Cüz başına ders paketi: sayfalar, ayetler (metin, okunuş, meal, kelimeler, kelime zamanlaması), sözlük, ögeler. **Üretilir.** |

Depo kökündeki `tools/` klasöründe:

| Dosya | Görev |
| --- | --- |
| `tools/arapca-uret.mjs` | Kaynakları indirir (`tools/arapca/.onbellek/`, depoya alınmaz), birleştirir, `veri/` dosyalarını yazar. Elle içerik eksikse durur (`--taslak` ile eksik listesini yazar). |
| `tools/arapca/ogeler.json` | Elle: edat, ek, kalıp, deyim ve dil bilgisi ögeleri (açıklama, Akılda kalsın, örnek ayet). |
| `tools/arapca/sozluk.json` | Elle: öğretilen kelimelerin Türkçe anlamı, Türkçedeki akrabaları, simgesi. |
| `tools/arapca/duzeltmeler.json` | Elle: QUL kelime mealinin düzeltmeleri (İngilizce kalanlar, komşu kelimeye kaymış anlamlar). |
| `tools/arapca/morfoloji-duzeltme.json` | Elle: Quranic Arabic Corpus çözümlemesinde ayetin anlamıyla açıkça çelişen etiketlerin düzeltmesi. |
| `tools/arapca/sayfalar.json` | Elle: sayfa özeti ve "Akılda kalsın" (Diyanet mealine dayanır). |
| `tools/arapca-anlatim.mjs` → `tools/arapca-anlatim.json` | Sesli anlatım metni (sayfa başına bir kayıt, ayetler bölüm). |

Veri değişince: `node tools/arapca-uret.mjs`, ardından `node tools/arapca-anlatim.mjs` ve ses.

## Kaynaklar

- Kur'an metni: Tanzil Quran Text (Simple), değiştirilmeden.
- Meal: Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet). Birleşik meal grupları (2:26–27 gibi) bir kez gösterilir.
- Kelime çözümlemesi (kök, lemma, tür, ekler, i'râb): Quranic Arabic Corpus v0.4 (GNU GPL), furqan.co
  düzeltmeleriyle (github.com/mustafa0x/quran-morphology).
- Sayfa, satır, transliterasyon ve Türkçe kelime meali: quran.com API / Quranic Universal Library
  (QUL kaynak 99). Kelime mealinin 1. cüzdeki 2.522 kelimesinden 656'sı bu uygulamada düzeltildi
  (`tools/arapca/duzeltmeler.json`); düzeltilen kelime, kelime panelinde belirtilir.
- Kıraat ve kelime zamanlaması: Suûd eş-Şüreym, quran.com tilavet 10 (QUL kaynak 107). Ses dosyaları
  `verses.quran.com` adresinden çalınır, önbelleğe alınmaz. 1. cüzün 148 ayetinin hepsinde, 2. cüzün 111 ayetinin 110, 3. cüzün 134 ayetinin 132, 4. cüzün 123 ayetinin 122, 5. cüzün 124 ayetinin 123, 6. cüzün 112 ayetinin 112, 7. cüzün 147 ayetinin 146, 8. cüzün 142 ayetinin 141 tanesinde zamanlama var.
- Okunuş: transliterasyondan kural tabanlı Türkçe harflere çevrilir; yaklaşıktır.
- Kelime anlamları: Râgıb el-İsfahânî, el-Müfredât; E. W. Lane, An Arabic-English Lexicon (anlam
  ayetteki Diyanet mealiyle karşılaştırılır).
- Dil bilgisi: Birgivî, el-Avâmil ve İzhâr; İbn Hişâm, Katru'n-nedâ; W. Wright, A Grammar of the Arabic
  Language. Ayetteki çözümleme Corpus etiketleriyle denetlenir.

## Sesli anlatım

- Yalnızca yetişkin profili (erkek sesi, Antalia-2 Mini); çocuk teması yalnızca görünümdür
  (`<html data-anlatim-profil="yetiskin">`).
- Ses bu bilgisayarda `python3 tools/tts/seslendir.py arapca` ile üretilir ve **ayrı depoya** yazılır:
  `github.com/hcguler/arapca-ses` → `https://hcguler.github.io/arapca-ses/` (`data-anlatim-kok`).
  Ana depo bir git worktree'sinde açıksa: `ANLATIM_CIKIS=<arapca-ses klasörü> python3 tools/tts/seslendir.py arapca`.
- Her sayfa bir kayıttır (`c01/s002`); ayet kartı, kaydın o ayete ait bölümünü çalar (`c01/s002#2:2`).
- Arapça metin ve okunuş anlatıma girmez; Arapçanın sesi yalnızca kâri kaydından gelir.
- Ses hacmi için: yeni kelime iki cümleyle anlatılır, sayfa özeti seslendirilmez (yalnızca "Akılda kalsın"),
  kayıtlar 24 kbps'tir (`ayarlar.kbps`).

## Durum ve görünüm

- `localStorage` anahtarı `arapca:v1`: tamamlanan sayfalar, tekrar kutuları (Leitner 1, 3, 7, 16, 35 gün),
  gösterim ayarları. Yedek dosyası indirilip geri yüklenebilir.
- Tema (`apps:tema`) ve renk (`theme`) diğer uygulamalarla ortaktır.

## Bilinen eksikler

- 9–30. cüzler hazırlanmadı.
- 2:240, 2:270, 2:286, 3:124, 4:37, 6:57 ve 6:145 ayetlerinde kelime zamanlaması yok (kaynakta eksik ya da kelime sayısı tutmuyor); o ayette kelime vurgusu ve kelime sesi gösterilmez.
- Okunuş kural tabanlıdır; ses uyumu ve hemze yer yer eksiktir.
- Kelime mealinin düzeltilmeyen kısmı QUL verisidir; yazarı ve telif bilgisi kaynakta belirtilmemiştir.
- Gramer ve sözlük açıklamaları anılan klasik kaynakların yerleşik bilgisine dayanılarak yazıldı; satır
  satır karşılaştırması yapılmadı.
