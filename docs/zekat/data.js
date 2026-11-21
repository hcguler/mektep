// ============================================
// Zekât ve Sadaka Rehberi — içerik
// --------------------------------------------
// Fıkıh: Diyanet İşleri Başkanlığı esas alınır. Hanefî görüş ana metindir; Şâfiî farkı önemli yerlerde tek
// cümleyle "mezhep" alanında verilir. Her konunun "kaynak" alanı hangi Diyanet yayını, soru ya da Din İşleri
// Yüksek Kurulu (DİYK) fetvası olduğunu söyler. Kısaltmalar:
//   SSS       = Din İşleri Yüksek Kurulu, "Zekât: Sıkça Sorulanlar" (Diyanet İşleri Başkanlığı); "Sadaka-i Fıtır" soruları ayrı numaralıdır
//   Oruç SSS  = Din İşleri Yüksek Kurulu, "Oruç: Sıkça Sorulanlar" (8. baskı, Ankara 2020); Oruç Rehberi ile ortak
//   İlmihal I = Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler, "Zekât" bölümü
//   İlmihal II = Diyanet İşleri Başkanlığı, İlmihal II, "Kefâretler" ve "Adak ve Yeminler" bölümleri
//   DİYK fetvası = kurul.diyanet.gov.tr "Fetvalar › Zekât ve Sadaka" (soru adı ve tarihiyle)
//
// Ayet metinleri burada yazılmaz; yalnızca "sure:ayet" verilir. Arapça (Tanzil Simple) ve meal (Diyanet İşleri,
// Tanzil tr.diyanet) tools/zekat-uret.mjs ile ayetler.js dosyasına üretilir.
// Hadis metinleri Türkçeye anlam olarak aktarılmıştır; her künye (kitap, bölüm, numara, râvi) üretici tarafından
// fawazahmed0/hadith-api metinleriyle otomatik denetlenir. Müslim numarası M. Fuâd Abdülbâkî numarasıdır.
//   k: [[kitap (b: Buhârî | m: Müslim), numara, metinde geçen râvi adı (İngilizce yazımıyla)]]
//
// Oruç Rehberi ile ortak metin (kesin): "oruc-fidyesi" ve "oruc-kefareti" konularının açıklaması, akılda kalsın
// cümlesi ve kaynağı apps/oruc/data.js içindeki "fidye" ve "kefaret" konularıyla aynıdır; "fitir-sadakasi"nın ilk
// iki paragrafı Oruç Rehberi'ndeki "fitir-sadakasi" ile aynıdır; fitre ve fidye tutarı aynı değer ve kaynaktır.
// Üretici bunu denetler; Oruç Rehberi'nde metin değişirse burada da değiştirilir.
//
// Konu alanları: id · bolum · ad · emo · kisa (tek cümle) · aciklama [1–4 paragraf] · hukum (hukumler'den ya da yok)
//   · ornek (isteğe bağlı) · mezhep (Şâfiî farkı, isteğe bağlı) · danis (müftülüğe danışın notu) · ayetler · hadisler
//   · kavramlar (../kavram/ kimlikleri) · baglanti { href, ad, alt } · deger · akilda · kaynak []
// "kisiler" Verebilir miyim? oyunudur: cevap, bağlı konunun hükmüyle (verilir | verilmez) aynı olmalıdır (üretici denetler).
// ============================================
window.ZEKAT_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',

    // Hüküm rozetleri: her yerde aynı renk ve kelime. "cumle" anlatımda okunur.
    hukumler: {
        farz: { ad: 'Farz', tam: 'Farz', aciklama: 'Yapılması kesin olarak istenen', kavram: 'farz', cumle: 'Hükmü: farzdır.' },
        vacip: { ad: 'Vacip', tam: 'Vacip', aciklama: 'Yapılması gerekli; Hanefîlere göre farz kadar kesin olmayan delille sabit', kavram: 'vacip', cumle: 'Hükmü: vaciptir.' },
        verilir: { ad: 'Verilebilir', tam: 'Zekât verilebilir', aciklama: 'Zekât ve fitre verilebilir', cumle: 'Hükmü: zekât ve fitre verilebilir.' },
        verilmez: { ad: 'Verilemez', tam: 'Zekât verilemez', aciklama: 'Zekât ve fitre verilemez', cumle: 'Hükmü: zekât ve fitre verilemez.' }
    },

    bolumler: [
        { id: 'zekat', ad: 'Zekât', alt: 'Anlamı, farz oluşu ve şartları', emo: '🪙' },
        { id: 'nisap', ad: 'Nisap ve oran', alt: 'Altın ve gümüş ölçüsü, kırkta bir', emo: '⚖️' },
        { id: 'mallar', ad: 'Zekâta tabi mallar', alt: 'Para, altın, ticaret, alacak, hayvan, ürün', emo: '📦' },
        { id: 'kime', ad: 'Kimlere verilir?', alt: 'Sekiz sınıf, akraba ve âdâb', emo: '🤝' },
        { id: 'verilmez', ad: 'Kimlere verilmez?', alt: 'Usûl ve fürû, eş, zengin', emo: '🚫' },
        { id: 'fitre', ad: 'Fıtır sadakası', alt: 'Kime vacip, ne zaman, ne kadar', emo: '🎁' },
        { id: 'fidye', ad: 'Fidye ve kefaret', alt: 'Oruç fidyesi, oruç ve yemin kefareti', emo: '🍞' },
        { id: 'sadaka', ad: 'Sadaka ve infak', alt: 'Gönüllü sadaka, sadaka-i câriye, adak', emo: '💚' }
    ],

    konular: [
        // ---------------- 1. Zekât ----------------
        { id: 'zekat-nedir', bolum: 'zekat', ad: 'Zekât nedir?', emo: '🪙', hukum: 'farz',
          kisa: 'Dinen zengin sayılan müslümanın malından belli bir payı ihtiyaç sahibine vermesidir.',
          aciklama: [
              'Zekât sözlükte artma, çoğalma, arınma ve bereket demektir. Dinî terim olarak, dinen zenginlik ölçüsü kabul edilen miktarda (nisap) mala sahip olan kimsenin Allah rızası için belli kişilere vermesi gereken belli miktardır.',
              'Zekât İslam’ın beş temel esasından biridir; Medine döneminde, hicretin ikinci yılında farz kılınmıştır. Kur’an’da çoğu yerde namazla birlikte anılır: namaz bedenî, zekât malî bir ibadettir.',
              'Ayette zekât, malı ve sahibini temizleyip arıtan bir sadaka olarak anılır. Peygamberimiz de Muâz’ı Yemen’e gönderirken zekâtın zenginlerden alınıp fakirlere verileceğini öğretmiştir.'
          ],
          ayetler: ['2:43', '9:103'],
          hadisler: [{ metin: 'Peygamberimiz Muâz’ı Yemen’e gönderirken şöyle dedi: “Onları Allah’tan başka ilah olmadığına ve benim Allah’ın elçisi olduğuma şahitlik etmeye davet et… Kabul ederlerse onlara, Allah’ın mallarında zekâtı farz kıldığını, bunun zenginlerinden alınıp fakirlerine verileceğini bildir.”', ravi: 'Abdullah b. Abbas', kaynak: 'Buhârî, Zekât, 1395', k: [['b', 1395, 'Ibn `Abbas']] }],
          kavramlar: ['farz'],
          akilda: 'Zekât, malın içindeki ihtiyaç sahibinin hakkıdır.',
          kaynak: ['Bakara 43; Tevbe 103', 'SSS, soru 1', 'İlmihal I, “Mahiyeti ve Önemi”'] },

        { id: 'zekat-vermemek', bolum: 'zekat', ad: 'Zekâtı vermemek', emo: '⚠️',
          kisa: 'Kur’an ve sahih hadis, zekâtı verilmeyen malın sahibini ağır bir sonuçla uyarır.',
          aciklama: [
              'Ayet, altın ve gümüşü biriktirip Allah yolunda harcamayanları uyarır; o mallar ateşte kızdırılıp sahiplerinin alınları, böğürleri ve sırtları onlarla dağlanacaktır.',
              'Abdullah b. Ömer, bu ayetlerin zekât ayetlerinden önce indiğini; zekât farz kılınınca Allah’ın onu malı temizleyen bir şey yaptığını söylemiştir. Yani zekâtı verilen mal, ayetteki kınanan birikim değildir.',
              'Peygamberimiz, Allah’ın mal verdiği hâlde zekâtını vermeyen kimsenin malının kıyamet günü bir yılan suretinde boynuna dolanacağını bildirmiştir.'
          ],
          ayetler: ['9:34-35'],
          hadisler: [
              { metin: 'Allah’ın kendisine mal verdiği hâlde zekâtını vermeyen kimsenin malı kıyamet günü gözlerinin üstünde iki siyah benek bulunan zehirli bir yılan suretine sokulur. Yılan onun boynuna dolanır, çenelerinden yakalar ve “Ben senin malınım, ben senin hazinenim” der.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Zekât, 1403', k: [['b', 1403, 'Abu Huraira']] },
              { metin: 'Abdullah b. Ömer’e “Altın ve gümüşü biriktirenler” ayeti soruldu. “Kim onları biriktirip zekâtını vermezse yazık ona. Bu ayetler zekât ayetlerinden önce inmişti; zekât ayetleri inince Allah zekâtı mallar için bir temizlik kıldı” dedi.', ravi: 'Hâlid b. Eslem', kaynak: 'Buhârî, Zekât, 1404', k: [['b', 1404, 'Umar']] }
          ],
          akilda: 'Zekâtı verilen mal temizlenir; verilmeyen mal sahibine yük olur.',
          kaynak: ['Tevbe 34–35', 'İlmihal I, “Mahiyeti ve Önemi”'] },

        { id: 'kime-farz', bolum: 'zekat', ad: 'Kime farzdır?', emo: '🧑', hukum: 'farz',
          kisa: 'Borcundan ve aslî ihtiyaçlarından fazla nisap miktarı malı olan, akıllı ve ergen müslümana.',
          aciklama: [
              'Zekâtın farz olması için kişinin müslüman, akıllı, ergenlik çağına girmiş ve hür olması gerekir.',
              'Malla ilgili şartlar şunlardır: mal tam mülk olmalı; nisap miktarına ulaşmalı; bir yıllık borcundan ve aslî ihtiyaçlarından fazla olmalı; artıcı (nâmî) olmalı, yani gelir, kâr ya da fayda sağlayabilecek nitelikte bulunmalı; üzerinden bir kamerî yıl geçmelidir.',
              'Aslî ihtiyaçlar; barınma, yiyecek, giyecek, sağlık, ulaşım, eğitim, ev eşyası, meslek aletleri, kitaplar ve elektrik, su, yakıt, aidat gibi cari giderlerdir. Bunlar zekât hesabına girmez.',
              'Hanefîlere göre zengin de olsa ergenlik çağına girmemiş çocuğun malından zekât gerekmez; yalnız çocuğa ait tarım ürünlerinin öşrü verilir.'
          ],
          mezhep: 'Şâfiî mezhebine göre zekât için akıl ve ergenlik şart değildir; çocuğun ve akıl hastasının malından da zekâtı velisi verir.',
          kavramlar: ['farz'],
          akilda: 'Nisap, ihtiyaç fazlası ve bir yıl: zekâtın üç ölçüsü.',
          kaynak: ['SSS, soru 1, 2, 3 ve 5', 'İlmihal I, “Zekâtın Şartları”'] },

        { id: 'borclar', bolum: 'zekat', ad: 'Borçlar düşülür mü?', emo: '🧾', danis: true,
          kisa: 'O yıl ödenecek borçlar zekâta tabi maldan düşülür; uzun vadeli borcun tamamı düşülmez.',
          aciklama: [
              'Zekât vermekle yükümlü olan kişi, zekâta tabi malından kul hakkı olan borçlarını düşer; borcu çıktıktan sonra kalan nisaba ulaşmıyorsa zekât gerekmez.',
              'Kamu, TOKİ, kooperatif ve kredi gibi on, yirmi yıla yayılan borçların tamamı zekât malından düşülmemelidir. Din İşleri Yüksek Kurulu’na göre yalnızca o zekât yılına ait birikmiş borçlar ile vadesi o yıl içinde dolmuş ya da dolacak borçlar düşülür; çünkü zekât yıllık bir ibadettir.',
              'Hanefî mezhebinin genel görüşünde vadesi gelmiş ve gelmemiş borçlar aynı hükümdedir; bazı Hanefî âlimlere göre ise yalnız vadesi gelmiş ve istenen borç düşülür.'
          ],
          mezhep: 'Şâfiî mezhebinin meşhur görüşüne göre hiçbir borç zekâta tabi maldan düşülmez; borçlu olmak zekâta engel değildir.',
          ornek: 'Konut kredisinin bu yıl ödenecek taksitleri düşülür; gelecek yılların taksitleri düşülmez.',
          akilda: 'Bu yılın borcu düşülür, yılların borcu düşülmez.',
          kaynak: ['SSS, soru 16', 'İlmihal I, “Mal ile İlgili Şartlar”'] },

        { id: 'yil', bolum: 'zekat', ad: 'Bir yıl şartı ve zamanı', emo: '📅',
          kisa: 'Nisaba ulaşan malın üzerinden bir kamerî yıl geçince zekât verilir; geciktirilmez.',
          aciklama: [
              'Nisap miktarı mala sahip olunduğu gün zekât yılı başlar; üzerinden bir kamerî yıl geçtiğinde nisap hâlâ varsa malın kırkta biri zekât olarak verilir. Yıl içindeki artış ve azalışlara bakılmaz.',
              'Maaş ve ücret gibi yıl içinde gelen paralar mevcut birikime katılır ve yıl sonunda hepsinin zekâtı birlikte verilir; paranın yılın sonuna doğru gelmesi bu hükmü değiştirmez.',
              'Zekâtın belli bir ayı yoktur; Ramazan’ı beklemek gerekmez. Farz olduğu andan itibaren en kısa zamanda verilmelidir. Dileyen yıl dolmadan önceden de verebilir; peşin ödeme imkânı yoksa bir yıl içinde taksitle verebilir.'
          ],
          mezhep: 'Şâfiî mezhebine göre miras ya da hibe gibi yollarla ayrıca elde edilen para mevcut birikime katılmaz; her biri kendi kamerî yılını doldurunca zekâtı verilir.',
          akilda: 'Nisap gününden bir kamerî yıl sonra: zekât günü.',
          kaynak: ['SSS, soru 2 ve 38', 'DİYK fetvası, “Maaş ve ücret gibi gelirlerin zekâtı nasıl hesaplanır ve ne zaman verilir?” (26.11.2025)'] },

        { id: 'niyet-temlik', bolum: 'zekat', ad: 'Niyet ve temlik', emo: '🤲',
          kisa: 'Zekât niyetle verilir ve ihtiyaç sahibinin mülküne geçirilir.',
          aciklama: [
              'Zekât bir ibadet olduğu için niyetsiz verilmez. Ayrıca zekâtın fakire teslim edilip onun mülküne geçirilmesi (temlik) şarttır.',
              'Bu yüzden sofra kurup yemek yedirmek zekât yerine geçmez; belediye, dernek ya da aşevlerinin hazırladığı iftar yemekleri de zekât sayılmaz. Aynı yemek zekât niyetiyle fakire teslim edilirse zekât verilmiş olur.',
              'Daha önce borç verilmiş paranın sonradan zekât niyetiyle bağışlanması da zekât olmaz; dört mezhep âlimleri bu görüştedir. Zekât elden, vekil aracılığıyla ya da havale ile verilebilir; önemli olan hak sahibine ulaşmasıdır.'
          ],
          kavramlar: ['niyet'],
          akilda: 'Zekât, niyetle ve ihtiyaç sahibinin eline vererek olur.',
          kaynak: ['SSS, soru 2, 18, 35 ve 38', 'İlmihal I, “Geçerlilik Şartları”'] },

        // ---------------- 2. Nisap ve oran ----------------
        { id: 'nisap', bolum: 'nisap', ad: 'Nisap', emo: '⚖️', deger: 'nisapAltin',
          kisa: 'Dinen zengin sayılmanın alt sınırı: 80,18 gram altın ya da değeri.',
          aciklama: [
              'Nisap, zekâtla yükümlü olmak için esas alınan zenginlik ölçüsüdür. Peygamberimiz beş ukıyyeden, yani iki yüz dirhemden az gümüşte zekât olmadığını bildirmiş; altının nisabı yirmi miskal olarak belirlenmiştir.',
              'Din İşleri Yüksek Kurulu, yirmi miskal altını 80,18 gram, iki yüz dirhem gümüşü 561,2 gram olarak esas alır. Hayvanlarda nisap devede beş, sığırda otuz, koyun ve keçide kırk adettir.',
              'Para, döviz, altın, gümüş ve ticaret malı birlikte nisaba ulaşabilir. Nisabın parayla karşılığı altının o günkü fiyatına göre değişir; bu yüzden uygulama gram fiyatı yazmaz, siz girersiniz.'
          ],
          mezhep: 'Şâfiî ve Hanbelî mezheplerine göre altın ve gümüş, nisabı tamamlamak için birbirine eklenmez; Hanefîlere göre eklenir.',
          hadisler: [{ metin: 'Beş ukıyyeden az gümüşte, beş deveden az devede ve beş veskten az hurma ve tahılda zekât yoktur.', ravi: 'Ebû Saîd el-Hudrî', kaynak: 'Buhârî, Zekât, 1405; Müslim, Zekât, 979', k: [['b', 1405, 'Abu Sa`id'], ['m', 979, 'Abu Sa\'id']] }],
          baglanti: { href: '#/hesapla', ad: 'Hesapla', alt: 'Gram fiyatını girin, nisabı ve zekâtı yaklaşık hesaplayın.' },
          akilda: 'Nisap: ihtiyaç fazlası 80,18 gram altın ya da değeri.',
          kaynak: ['SSS, soru 1', 'İlmihal I, “Altın ve Gümüş”', 'Hadislerle İslâm, “Zekâta Tabi Mallar ve Zekât Nisabı”'] },

        { id: 'gumus-nisabi', bolum: 'nisap', ad: 'Gümüş nisabı', emo: '🥈', deger: 'nisapGumus',
          kisa: 'İki yüz dirhem, yani 561,2 gram gümüş; bugün bilgi olarak bilinir, ölçü olarak altın esas alınır.',
          aciklama: [
              'Peygamberimiz döneminde altın ve gümüş nisapları aşağı yukarı aynı değerdeydi. Bugün iki yüz dirhem gümüş ile yirmi miskal altın arasında büyük bir değer farkı vardır.',
              'Diyanet İlmihali, zamanımızda gümüşün değeri çok düştüğü için 561,2 gram gümüşün parasal karşılığının nisap sayılamayacağını, altının esas alınması gerektiğini söyler. Hadislerle İslâm da altının ekonomik değerini koruduğunu belirterek altının esas alınmasını daha isabetli bulur.',
              'Gümüşün kendisi zekâta tabidir: elinizdeki gümüşün değeri diğer mallarınıza eklenir ve toplam altın nisabına ulaşırsa kırkta biri verilir.'
          ],
          akilda: 'Gümüş zekâta tabidir; nisap ölçüsü olarak bugün altın esas alınır.',
          kaynak: ['İlmihal I, “Altın ve Gümüş” ve “Zekâtın Sarf Yerleri”', 'Hadislerle İslâm, “Zekâta Tabi Mallar ve Zekât Nisabı”'] },

        { id: 'kirkta-bir', bolum: 'nisap', ad: 'Kırkta bir', emo: '➗',
          kisa: 'Nisaba ulaşan para, altın, gümüş ve ticaret malının zekâtı kırkta birdir, yani yüzde iki buçuk.',
          aciklama: [
              'Altın, gümüş, para ve ticaret malının zekâtı kırkta birdir, yani yüzde iki buçuk. Nisabı aşan kısım da aynı oranda hesaplanır.',
              'Toprak ürünlerinde oran farklıdır (onda bir ya da yirmide bir); hayvanların zekâtı ise sayıya göre belirlenir.',
              'Farklı ayarlarda altını olan kişi, nisap için bütün altınlarının ağırlığını toplar; zekâtı ise her ayarın kendi değeri üzerinden hesaplar.'
          ],
          ornek: 'Borçları düşüldükten sonra 400.000 TL’lik birikimi olan ve bu tutar nisabın üzerinde olan kimse, yıl dolunca 10.000 TL zekât verir.',
          baglanti: { href: '#/hesapla', ad: 'Hesapla', alt: 'Kırkta biri yaklaşık hesaplayın.' },
          akilda: 'Kırkta bir: yüz liranın iki buçuk lirası.',
          kaynak: ['SSS, soru 7 ve 11', 'İlmihal I, “Altın ve Gümüş”'] },

        // ---------------- 3. Zekâta tabi mallar ----------------
        { id: 'para', bolum: 'mallar', ad: 'Para ve döviz', emo: '💵',
          kisa: 'Kâğıt para ve döviz altın gibidir; nisaba ulaşınca yıl sonunda kırkta biri verilir.',
          aciklama: [
              'Günümüzde kâğıt para, altın ve gümüşün mübadele aracı olarak gördüğü işi görmektedir. Bu yüzden madenî ve kâğıt paralar altın, gümüş ve ticaret malı hükmündedir.',
              'Nakit, banka hesabı ve döviz, tek başına ya da altın, gümüş ve ticaret malıyla birlikte nisaba ulaşınca, üzerinden bir yıl geçtiğinde kırkta biri zekât olarak verilir. Döviz, zekât günündeki Türk lirası karşılığıyla hesaplanır.'
          ],
          akilda: 'Para da altın gibidir: nisap, yıl ve kırkta bir.',
          kaynak: ['İlmihal I, “Madenî ve Kâğıt Paraların Zekâtı”', 'DİYK fetvası, “Maaş ve ücret gibi gelirlerin zekâtı nasıl hesaplanır ve ne zaman verilir?” (26.11.2025)'] },

        { id: 'altin-ziynet', bolum: 'mallar', ad: 'Altın, gümüş ve takılar', emo: '💍',
          kisa: 'Hanefîlere göre altın ve gümüş takılar da zekâta tabidir.',
          aciklama: [
              'Altın ve gümüş, külçe ya da para olarak bulunsun, nisaba ulaşınca zekâta tabidir.',
              'Hanefîlere göre altın ve gümüşten yapılmış bilezik, kolye gibi takılar da diğer şartları taşıyorsa zekâta tabidir: 80,18 gram ya da daha fazla olup üzerinden bir yıl geçmişse kırkta biri verilir.',
              'Altın ve gümüş dışındaki maden ve taşlardan yapılan takılar zekâta tabi değildir. Ayarı farklı altınların ağırlıkları nisap için toplanır.'
          ],
          mezhep: 'Şâfiî, Mâlikî ve Hanbelî âlimlerine göre kadının normal olarak takıp kullandığı takı aslî ihtiyaç sayılır ve zekâta tabi değildir; Şâfiîlere göre israf derecesindeki takının zekâtı verilir.',
          akilda: 'Takı da altındır: Hanefîlere göre zekâtı verilir.',
          kaynak: ['SSS, soru 10 ve 11', 'İlmihal I, “Altın ve Gümüşten Yapılan Ziynet Eşyası”'] },

        { id: 'ticaret', bolum: 'mallar', ad: 'Ticaret malı', emo: '🏪', danis: true,
          kisa: 'Kâr amacıyla alınıp satılan malın zekâtı, zekât günündeki maliyet değeri üzerinden kırkta birdir.',
          aciklama: [
              'Kâr amacıyla alınıp satılan mallara ticaret malı denir. Nisap değerinde ticaret malı olan kişi, nisaba sahip olmasının üzerinden bir yıl geçince kırkta birini verir.',
              'İleride elde edilecek kâr hesaba katılmaz; zekâtın verileceği tarihteki maliyet değeri esas alınır. Zekât parayla verilebileceği gibi malın kendi cinsinden de verilebilir.',
              'Alıp satmak ya da değerlenince satmak için tutulan arsa, ev gibi taşınmazlar da zekâta tabidir; bunların zekâtı her yıl piyasa değeri üzerinden verilir. Oturmak, dükkân, tarla ya da bağ bahçe yapmak için alınan arsa zekâta tabi değildir.'
          ],
          akilda: 'Satmak için tutulan mal, ticaret malıdır.',
          kaynak: ['SSS, soru 7, 8, 12 ve 13', 'İlmihal I, “Ticaret Malları”'] },

        { id: 'hisse', bolum: 'mallar', ad: 'Şirket ve hisse senedi', emo: '📈', danis: true,
          kisa: 'Ortak, şirketteki payına düşen dönen varlığın; hisse sahibi, hissenin amacına göre zekâtını verir.',
          aciklama: [
              'Şirketin kendisi değil, ortaklardan her birinin payı zekâta tabidir. Bina, makine, alet gibi duran varlıklar zekâttan muaftır; borçlar ve giderler çıktıktan sonra dönen varlıklar (stok, hammadde, nakit, çek, alacak) kârla birlikte kırkta bir oranında zekâta tabidir.',
              'Hisse senedi alıp satmak için tutuluyorsa ticaret malıdır; piyasa değeri üzerinden zekâtı verilir. Kâr payı için elde tutuluyorsa, alınan kâr payı nisaba ulaşıp üzerinden bir yıl geçince zekâta tabidir.',
              'Şirket hesabı ayrıntılı bir konudur; kendi şirketiniz ya da hisseleriniz için müftülüğe danışın.'
          ],
          akilda: 'Satmak için tutulan hisse ticaret malıdır.',
          kaynak: ['SSS, soru 14 ve 15', 'İlmihal I, “Sınaî Servet, Yatırım ve Üretim Araçları”'] },

        { id: 'alacak', bolum: 'mallar', ad: 'Alacaklar', emo: '🤝', danis: true,
          kisa: 'Tahsil edilmesi umulan alacağın zekâtı her yıl verilir.',
          aciklama: [
              'Borç olarak verilen para ve ticaret malının bedeli gibi kuvvetli alacaklar, borçlu kabul ediyor ya da kesin delil varsa, her yıl diğer mallarla birlikte zekâta tabidir. Önceki yılların zekâtı verilmemişse alacak tahsil edilince verilir.',
              'Ev kirası gibi alacaklarda da geçmiş yılların zekâtı doğar; ancak ödeme için en az nisap miktarı tahsil edilmiş olmalıdır. Mehir, vasiyet ve diyet gibi alacaklar ise tahsil edilip üzerinden bir yıl geçince zekâta tabi olur.',
              'Borçlunun inkâr ettiği ya da geri alınması umulmayan alacak için her yıl zekât gerekmez; sonradan tahsil edilirse yalnız o yılın zekâtı verilir.'
          ],
          akilda: 'Alınması umulan alacak, elde gibidir.',
          kaynak: ['SSS, soru 17', 'İlmihal I, “Alacağın Zekâtı”'] },

        { id: 'hayvan', bolum: 'mallar', ad: 'Hayvanların zekâtı', emo: '🐑',
          kisa: 'Devede beş, sığırda otuz, koyun ve keçide kırk baştan itibaren zekât vardır (özet).',
          aciklama: [
              'Hayvanlarda nisap devede beş, sığırda otuz, koyun ve keçide kırk adettir. Zekâtın miktarı hayvanın sayısına göre belirlenir.',
              'Hayvanların zekâtı kendi cinsinden verilebileceği gibi değeri üzerinden parayla da verilebilir; fakirin yararına olanı tercih etmek daha uygundur.',
              'Ayrıntılı hesap bu uygulamanın kapsamı dışındadır; hayvan sahipleri hesabı müftülükten öğrenmelidir.'
          ],
          akilda: 'Beş deve, otuz sığır, kırk koyun.',
          kaynak: ['SSS, soru 1 ve 9', 'İlmihal I, “Hayvanlar”'] },

        { id: 'osur', bolum: 'mallar', ad: 'Toprak ürünleri: öşür', emo: '🌾',
          kisa: 'Kendiliğinden sulanan üründe onda bir, emekle sulanan üründe yirmide bir (özet).',
          aciklama: [
              'Öşür sözlükte onda bir demektir; tarım ürünlerinden verilen zekâtın adıdır. Ayet, ürünün devşirildiği gün hakkının verilmesini emreder.',
              'Peygamberimiz yağmur ve nehir sularıyla sulanan üründe onda bir, emek ve masrafla sulanan üründe yirmide bir öşür belirlemiştir. Din İşleri Yüksek Kurulu’na göre gübre, ilaç, mazot gibi masraflar çıkarıldıktan sonra nisaba ulaşan ürünün onda biri verilir; masraflar çıkarılmazsa yirmide biri verilir.',
              'Saklanabilir ürünlerde nisap beş vesktir; bu, ürüne göre 653 ile 1000 kilogram arasındadır, buğdayda 653 kilogramdır. Ayrıntılı hesap kapsam dışıdır.'
          ],
          ayetler: ['6:141'],
          hadisler: [{ metin: 'Yağmurun ve pınarların suladığı ya da kendiliğinden sulanan üründe onda bir; kuyudan (emekle) sulananda ise onda birin yarısı zekât vardır.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Zekât, 1483', k: [['b', 1483, 'Salim']] }],
          akilda: 'Toprak da zekât verir: onda bir ya da yirmide bir.',
          kaynak: ['En‘âm 141', 'SSS, soru 20 ve 21', 'İlmihal I, “Toprak Ürünleri”'] },

        { id: 'muaf', bolum: 'mallar', ad: 'Zekât gerekmeyen mallar', emo: '🏠',
          kisa: 'Oturulan ev, ev eşyası, binek, meslek aletleri ve kullanılan eşya zekâta tabi değildir.',
          aciklama: [
              'Aslî ihtiyaç sayılan mallar zekâta tabi değildir: oturulan ev, ev eşyası, giyecek, kullanılan araç, kitaplar ve kişinin mesleğinde kullandığı alet, makine ve malzemeler.',
              'Kişinin kendi mesleği için değil de ticaret için ürettiği ya da alıp sattığı alet ve makineler ise ticaret malıdır ve zekâta tabidir.',
              'Gayrimeşru yolla elde edilen kazancın zekâtı olmaz; sahibi belliyse ona iade edilir, belli değilse karşılığında sevap beklenmeden yoksullara ya da hayır kurumlarına verilerek elden çıkarılır.'
          ],
          akilda: 'Kullandığın eşya değil, biriktirdiğin servet zekâta tabidir.',
          kaynak: ['SSS, soru 5, 6 ve 24', 'İlmihal I, “Mal ile İlgili Şartlar”'] },

        // ---------------- 4. Kimlere verilir? ----------------
        { id: 'sekiz-sinif', bolum: 'kime', ad: 'Sekiz sınıf', emo: '8️⃣', hukum: 'verilir',
          kisa: 'Zekâtın verileceği yerleri Allah, Tevbe suresinin altmışıncı ayetinde bildirmiştir.',
          aciklama: [
              'Zekât; fakirlere, miskinlere, zekât toplamakla görevli memurlara, kalpleri İslam’a ısındırılmak istenenlere, hürriyetine kavuşmaya çalışan kölelere, borçlulara, Allah yolunda olanlara ve yolda kalmışlara verilir.',
              'Borçlu, kul hakkı olarak borcu olan ve borcunu ödeyecek maldan başka nisap miktarı malı bulunmayan kimsedir. Yolda kalmış, memleketinde malı olsa bile yolculukta parasız kalıp parasına ulaşamayan kimsedir; bugün banka kartıyla parasına ulaşabilen yolcuya zekât verilmez.',
              'Hanefîlere göre zekât bu sınıflardan yalnız birine de verilebilir. Zekâtın en başta gelen hak sahipleri fakir ve miskinlerdir.'
          ],
          mezhep: 'Şâfiî mezhebine göre zekâtı sahibi ya da vekili dağıtıyorsa, zekât memurları dışında bulunabilen yedi sınıfa eşit olarak ve her sınıftan en az üç kişiye verilmelidir.',
          ayetler: ['9:60'],
          baglanti: { href: '#/siniflar', ad: 'Sekiz sınıf', alt: 'Her sınıf ve bugünkü karşılığı.' },
          akilda: 'Zekâtın adresini Allah belirlemiştir.',
          kaynak: ['Tevbe 60', 'SSS, soru 25', 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025)', 'İlmihal I, “Zekâtın Dağıtım Usulü”'] },

        { id: 'fakir-miskin', bolum: 'kime', ad: 'Fakir kimdir?', emo: '🫶', hukum: 'verilir',
          kisa: 'Temel ihtiyaçları dışında nisap miktarı malı olmayan kimse; maaşlı da olsa.',
          aciklama: [
              'Fakir ve miskin, temel ihtiyaçları dışında nisap miktarı mala sahip olmayan kimsedir. Hanefîlere göre fakirin az da olsa malı vardır; miskinin ise hiçbir şeyi yoktur.',
              'Bir geliri olduğu hâlde temel ihtiyaçlarını karşılayamayan ya da temel ihtiyaçlarından sonra elinde 80,18 gram altın değerinde malı kalmayan kişiye zekât verilebilir; memur, esnaf ya da işsiz olması fark etmez.',
              'Bununla birlikte, kendisinin ve bakmakla yükümlü olduklarının ihtiyacını karşılayabilene zekât verilemeyeceğini söyleyen âlimler de olduğu için daha yoksul olanlara öncelik verilmesi uygundur. Durumunu kimseye açmayan iffetli yoksullar araştırılıp bulunmalıdır.'
          ],
          mezhep: 'Şâfiî mezhebinde ölçü nisap değil yeterliliktir (kifâye): malı ve kazancı kendisine ve ailesine yetmeyen kimse, nisabın üstünde malı olsa da zekât alabilir.',
          ayetler: ['2:273'],
          akilda: 'İhtiyacını söyleyemeyen yoksulu bul.',
          kaynak: ['Bakara 273', 'SSS, soru 25 ve 30', 'İlmihal I, “Fakirler ve Miskinler”'] },

        { id: 'akraba', bolum: 'kime', ad: 'Kardeş ve diğer akrabalar', emo: '👨‍👩‍👧', hukum: 'verilir',
          kisa: 'Fakir kardeşe, amcaya, teyzeye, gelin ve damada zekât verilebilir; hatta daha faziletlidir.',
          aciklama: [
              'Usûl (anne, baba, dede, nine) ve fürû (çocuk, torun) dışındaki akrabalara, zengin değillerse zekât, fitre ve fidye verilebilir: kardeş, amca, hala, dayı, teyze ve onların çocukları, gelin, damat, kayınpeder ve kayınvalide.',
              'Üvey anne, üvey baba ve üvey çocuklarla süt anne ve süt babaya da fakir iseler zekât verilebilir; çünkü aralarında usûl ve fürû ilişkisi yoktur ve kişi normal durumlarda onlara bakmakla yükümlü değildir.',
              'Zekâtın, kendisine zekât verilebilecek akrabaya verilmesi daha faziletlidir: önce muhtaç kardeşlere, sonra onların çocuklarına, sonra amca, hala ve diğer akrabalara, komşulara.'
          ],
          akilda: 'Zekât önce yakındaki ihtiyaç sahibine.',
          kaynak: ['SSS, soru 27, 28 ve 29; Sadaka-i Fıtır, soru 5', 'İlmihal I, “Zekât Vermenin Âdâbı”'] },

        { id: 'kurumlar', bolum: 'kime', ad: 'Cami, okul ve kurumlar', emo: '🏗️', hukum: 'verilmez',
          kisa: 'Zekât cami, okul, yol, çeşme gibi hayır işlerine harcanmaz; kurum ancak aracı olabilir.',
          aciklama: [
              'Zekâtın sahih olması için zekât alması caiz olan gerçek kişilere temlik edilmesi gerekir. Bu yüzden zekât ve fitrenin cami, köprü, yol, okul, yurt, çeşme gibi yerlere harcanması caiz değildir; okullar, Kur’an kursları ve camiler “Allah yolunda” sınıfına girmez.',
              'Zekâtı fakirlere ulaştıran güvenilir bir hayır kurumu aracı olabilir; zekâtı inşaat, aydınlatma, büro masrafı gibi genel giderlerde kullanacak kuruluşa zekât verilmez.',
              'Bu kurumlar zekât dışındaki gönüllü bağışlarla desteklenir; böyle kalıcı hayırlar sadaka-i câriyedir.'
          ],
          baglanti: { href: '#/k/sadaka-i-cariye', ad: 'Sadaka-i câriye', alt: 'Cami, okul, çeşme gibi kalıcı hayırlar.' },
          akilda: 'Zekât yoksulun hakkıdır; cami ve okula sadaka verilir.',
          kaynak: ['SSS, soru 32 ve 34', 'DİYK fetvası, “Zekât âyetinde geçen fî sebîlillâhın kapsamına okullar, Kur’ân kursları, camiler ve benzeri hayır kurumları girer mi?” (12.03.2025)'] },

        { id: 'verme-adabi', bolum: 'kime', ad: 'Zekât vermenin âdâbı', emo: '🌿',
          kisa: 'Helal maldan, iyisinden, başa kakmadan ve alanı incitmeden vermek.',
          aciklama: [
              'Zekât yalnız Allah rızası için, başa kakmadan ve incitmeden verilir. Helal kazançtan verilir; mal olarak veriliyorsa, kişinin kendisine verilmesini istemeyeceği değersiz şeyler verilmez.',
              'Hanefîlere göre zekâtın, alanın onurunu korumak için gizlice verilmesi daha iyidir. Zekât geciktirilmez; öncelikle malın bulunduğu yerdeki fakirlere verilir.',
              'Verirken “bu zekâttır” demek gerekmez; alanı incitebileceği için söylememek daha iyidir. Zekât güvenilir bir vekil aracılığıyla da verilebilir.'
          ],
          mezhep: 'Şâfiî ve Hanbelî mezheplerine göre, insanları bu ibadete teşvik etmek için zekâtın açıkça verilmesi daha uygundur; nafile sadakayı gizli vermek ise bütün fakihlere göre daha faziletlidir.',
          ayetler: ['2:267', '2:271'],
          akilda: 'Verdiğini helalinden, iyisinden ve incitmeden ver.',
          kaynak: ['Bakara 267 ve 271', 'İlmihal I, “Zekât Vermenin Âdâbı”'] },

        // ---------------- 5. Kimlere verilmez? ----------------
        { id: 'usul-furu', bolum: 'verilmez', ad: 'Anne baba, çocuk ve torun', emo: '👪', hukum: 'verilmez',
          kisa: 'Kişi zekâtını usûlüne (anne, baba, dede, nine) ve fürûuna (çocuk, torun) veremez.',
          aciklama: [
              'Hanefîlere göre kişi zekâtını, fitresini ve fidyesini anne, baba, büyük anne ve büyük babalarına; oğul, kız ve onların çocuklarına veremez.',
              'Zekât veren, verdiği zekâttan hiçbir şekilde yararlanmamalıdır. Bu yakınlara verilen zekât nafaka borcundan kurtulma ya da miras gibi yollarla dolaylı olarak kendisine döner; temlik tam gerçekleşmez.',
              'Bu kimselere zekât dışındaki maldan yardım etmek, bakmak ve ihtiyaçlarını karşılamak ise ayrıca bir görevdir.'
          ],
          mezhep: 'Şâfiî, Mâlikî ve Hanbelî mezheplerinde ölçü nafakadır: kişi, nafakasını sağlamakla hukuken yükümlü olduğu akrabasına zekât veremez.',
          akilda: 'Anne babaya ve çocuğa zekât değil, nafaka verilir.',
          kaynak: ['SSS, soru 26 ve 29', 'DİYK fetvası, “Zekât kimlere verilmez?” (12.07.2017)', 'İlmihal I, “Zekât Verilmeyecek Kimseler”'] },

        { id: 'es', bolum: 'verilmez', ad: 'Eş', emo: '💑', hukum: 'verilmez',
          kisa: 'Eşler birbirine zekât, fitre ve fidye veremez.',
          aciklama: [
              'Hanefîlere göre kişi zekâtını eşine veremez; çünkü aralarında bakma yükümlülüğü ilişkisi vardır ve verilen zekât dolaylı olarak kendisine döner.',
              'Ebû Hanîfe’ye göre kadın da zekâtını fakir kocasına veremez. Diyanet’in yayınlarında eşlerin birbirine zekât, fitre ve fidye veremeyeceği açıkça yazılıdır.'
          ],
          akilda: 'Eşler birbirinin zekâtını alamaz.',
          kaynak: ['SSS, soru 26; Sadaka-i Fıtır, soru 5', 'İlmihal I, “Zekât Verilmeyecek Kimseler”'] },

        { id: 'zengin', bolum: 'verilmez', ad: 'Zengin', emo: '💼', hukum: 'verilmez',
          kisa: 'Aslî ihtiyaçları dışında nisap miktarı malı olana ve zengin babanın küçük çocuğuna zekât verilmez.',
          aciklama: [
              'Hanefîlere göre aslî ihtiyaçları dışında, artıcı olsun olmasın, nisap miktarı malı olan kimse zengindir; ona zekât verilmez. Bu kişi zekât vermekle yükümlü olmasa bile zekât alamaz; fitre vermesi ve kurban kesmesi gerekir.',
              'Babası zengin olan ve ergenlik çağına girmemiş çocuğa da zekât verilmez. Zengin bir kişinin fakir olan babasına, büyük çocuğuna ya da eşine ise başkası zekât verebilir; çünkü onlar babanın ya da eşin servetiyle zengin sayılmaz.'
          ],
          mezhep: 'Şâfiî, Mâlikî ve Hanbelî mezheplerinde zenginliğin ölçüsü nisap değil yeterliliktir (kifâye); malı kendisine ve ailesine yetmeyen kimse nisabın üstünde malı olsa da zekât alabilir.',
          akilda: 'Nisabı olan zekât verir, zekât almaz.',
          kaynak: ['SSS, soru 25 ve 26', 'İlmihal I, “Fakirler ve Miskinler” ve “Zekât Verilmeyecek Kimseler”'] },

        { id: 'gayrimuslim', bolum: 'verilmez', ad: 'Müslüman olmayan', emo: '🕊️', hukum: 'verilmez',
          kisa: 'Zekât müslüman fakirlerin hakkıdır; müslüman olmayana zekât verilmez.',
          aciklama: [
              'Zekât ibadet içerikli bir yükümlülük olduğu için fakihlerin ittifakıyla müslüman olmayana verilmez. Dört mezhep imamının da aralarında bulunduğu çoğunluğa göre İslam toplumundaki gayrimüslim vatandaşa da zekât verilemez.',
              'Fitrede Ebû Hanîfe, İslam ülkesinin gayrimüslim vatandaşına fitre verilebileceğini söylemiştir; Ebû Yûsuf ve fakihlerin çoğunluğuna göre verilemez. Hanefî mezhebinde fetva Ebû Yûsuf’un görüşüne göredir.',
              'Gayrimüslim komşuya zekât dışındaki maldan yardım etmek, ona iyilik etmek ise güzeldir.'
          ],
          akilda: 'Zekât müslüman yoksulun; iyilik herkesin hakkıdır.',
          kaynak: ['SSS, soru 26; Sadaka-i Fıtır, soru 5', 'İlmihal I, “Zekât Verilmeyecek Kimseler” ve “Fitre Verilebilecek Kimseler”'] },

        { id: 'peygamber-ailesi', bolum: 'verilmez', ad: 'Peygamberimizin yakınları', emo: '🌙', hukum: 'verilmez',
          kisa: 'Peygamberimiz zekâtı kendisine ve yakınlarına yasaklamıştır.',
          aciklama: [
              'Peygamberimiz, torunu Hasan zekât hurmalarından birini ağzına alınca onu çıkarttırmış ve zekât malını kendilerinin yemediğini söylemiştir. Başka hadislerde de zekâtın Peygamberimize ve yakınlarına verilmeyeceği bildirilmiştir.',
              'Diyanet İlmihali, fakihlerin Peygamberimizin yakınlarının kimler olduğu konusunda farklı görüşler ileri sürdüğünü belirtir. Bu yasağın bir hikmeti, Peygamberimizin kendisini ve yakınlarını her türlü töhmetten uzak tutmak istemesidir.'
          ],
          hadisler: [{ metin: 'Hasan b. Ali, zekât hurmalarından birini alıp ağzına koydu. Peygamberimiz “Çıkar onu! Bilmiyor musun, biz sadaka (zekât) olarak verilen şeyi yemeyiz” buyurdu.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Zekât, 1491', k: [['b', 1491, 'Abu Huraira']] }],
          akilda: 'Peygamberimiz zekâtı kendisine ve ailesine almadı.',
          kaynak: ['İlmihal I, “Zekât Verilmeyecek Kimseler”'] },

        { id: 'yanilma', bolum: 'verilmez', ad: 'Yanlış kişiye verilirse', emo: '🔎',
          kisa: 'Araştırıp verdiyse zekâtı geçerlidir; araştırmadan verdiyse ve yanlışsa yeniden verir.',
          aciklama: [
              'Zekât veren kişi, kime verdiğini araştırmalıdır. Araştırıp zekât verilebilecek biri olduğu kanaatine vardığı kişiye verir de sonra onun zengin olduğu anlaşılırsa zekâtı geçerlidir.',
              'Araştırmadan verir de sonradan kişinin zekât verilebilecek biri olduğu anlaşılırsa zekâtı yine geçerlidir; ama öyle olmadığı anlaşılırsa zekâtı geçerli olmaz, yeniden vermesi gerekir.'
          ],
          mezhep: 'Şâfiî mezhebindeki yerleşik görüşe göre zekât ehline ulaşmadıkça, borç başkasına ödenmiş gibi, zekât borcu düşmez.',
          akilda: 'Araştırarak ver; gerisini Allah bilir.',
          kaynak: ['SSS, soru 37', 'İlmihal I, “Zekât Vermede Yanılma”'] },

        // ---------------- 6. Fıtır sadakası ----------------
        { id: 'fitir-sadakasi', bolum: 'fitre', ad: 'Fıtır sadakası (fitre)', emo: '🎁', hukum: 'vacip', deger: 'fitre',
          kisa: 'Bayrama ulaşan, dinen zengin müslümanın vermesi vacip olan sadaka.',
          aciklama: [
              'Halk arasında fitre denen fıtır sadakası, dinen zengin olup Ramazan’ın sonuna ulaşan müslümanın vermesi vacip olan sadakadır. Kişi kendisinin ve küçük çocuklarının fitresini verir.',
              'Bayram namazından önce verilmesi müstehaptır; Ramazan’ın ilk günlerinde vermek de caizdir. Kişinin bakmakla yükümlü olduğu yakınlarına ve eşine verilmez.',
              'Fitre, insan olarak yaratılmanın ve Ramazan orucunu tutup bayrama ulaşmanın şükrüdür; fakirin bayram sevincine katılmasını sağlar. Ölçüsü, kişinin bir günlük normal gıda ihtiyacıdır; Din İşleri Yüksek Kurulu her yıl en az tutarı açıklar.'
          ],
          mezhep: 'Şâfiî mezhebine göre fitre farzdır ve nisap şartı yoktur; bayram günü ve gecesine yetecek azığı olan her müslüman fitre verir.',
          hadisler: [{ metin: 'Peygamberimiz köle ya da hür, erkek ya da kadın, küçük ya da büyük her müslümana fıtır sadakası olarak bir sâ‘ hurma ya da bir sâ‘ arpa vermeyi farz kıldı ve insanlar bayram namazına çıkmadan önce verilmesini emretti.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Zekât, 1503', k: [['b', 1503, 'Ibn `Umar']] }],
          kavramlar: ['vacip'],
          baglanti: { href: '../oruc/#/k/fitir-sadakasi', ad: 'Oruç Rehberi’nde fitre', alt: 'Ramazan’ın ibadetleri arasında fıtır sadakası.' },
          akilda: 'Fitre, bayram sevincini yoksulla paylaşmaktır.',
          kaynak: ['SSS, Sadaka-i Fıtır, soru 1', 'Oruç SSS, soru 23 ve 24', 'DİYK, 2026 yılı fitre miktarı kararı (07.01.2026)', 'İlmihal I, “Fıtır Sadakası”'] },

        { id: 'fitre-kim-verir', bolum: 'fitre', ad: 'Kim fitre verir?', emo: '🧑‍🤝‍🧑', hukum: 'vacip',
          kisa: 'Temel ihtiyaçları ve borçları dışında nisap miktarı malı olan müslüman; yıl ve artıcılık şartı aranmaz.',
          aciklama: [
              'Ramazan Bayramı’na kavuşan, temel ihtiyaçlarının ve bir yıllık borçlarının dışında nisap miktarı (80,18 gram altın ya da değeri) mala sahip olan müslüman fitre vermekle yükümlüdür.',
              'Zekâttan farklı olarak bu malın artıcı olması ve üzerinden bir yıl geçmesi gerekmez.',
              'Kişi kendisinin ve ergenlik çağına girmemiş çocuklarının fitresini verir. Anne babası, büyük çocukları, eşi ve kardeşleri için vermesi gerekmez; ama onlar adına verirse geçerli olur.'
          ],
          mezhep: 'Şâfiî mezhebine göre fitre için nisap gerekmez; varlıklı kimse, bakmakla yükümlü olduğu müslüman eşi, çocukları, anne babası ve diğer yakınları için de fitre verir.',
          kavramlar: ['vacip'],
          akilda: 'Fitrede nisap yeter; yıl beklenmez.',
          kaynak: ['SSS, Sadaka-i Fıtır, soru 2', 'İlmihal I, “Fıtır Sadakasıyla Mükellefiyet”'] },

        { id: 'fitre-zamani', bolum: 'fitre', ad: 'Fitre ne zaman verilir?', emo: '🕰️',
          kisa: 'Ramazan içinde verilebilir; bayram namazından önce vermek müstehaptır.',
          aciklama: [
              'Hanefîlere göre fitre, Ramazan Bayramı’nın birinci günü tan yeri ağarınca vacip olur. Bununla birlikte Ramazan ayı içinde de verilebilir; fakirlerin bayram ihtiyacını karşılaması için bayramdan önce vermek daha faziletlidir.',
              'Peygamberimizin uygulamasına uyarak bayram namazına gitmeden önce vermek müstehaptır. Bayram sabahına kadar verilmemişse bayram günlerinde, o da olmazsa ilk fırsatta verilir; borç düşmez.'
          ],
          mezhep: 'Şâfiî mezhebine göre fitre Ramazan’ın son günü güneş batınca vacip olur; meşru bir mazeret olmadan bayramın birinci günü güneş batışından sonraya bırakmak haramdır.',
          akilda: 'Fitreyi bayramdan önce ver ki yoksul da bayram etsin.',
          kaynak: ['SSS, Sadaka-i Fıtır, soru 1 ve 4', 'İlmihal I, “Ödeme Vakti”'] },

        { id: 'fitre-kime', bolum: 'fitre', ad: 'Fitre kime verilir?', emo: '📮',
          kisa: 'Zekât verilebilen herkese; bir kişiye bir fitreden az verilmemeli.',
          aciklama: [
              'Fitre, zekâtın verildiği kimselere verilir; zekât verilemeyen kimseye fitre de verilemez. Kişi fitresini dinen zengin sayılana, usûlüne (anne, baba, dede, nine), fürûuna (çocuk, torun) ve eşine veremez.',
              'Fitreler bir fakire verilebileceği gibi birkaç fakire de dağıtılabilir; ancak bir kişiye verilen miktar bir fitreden az olmamalıdır. Birkaç kişi de fitrelerini aynı fakire verebilir.',
              'Fitre buğday, arpa, hurma ya da üzüm olarak verilebileceği gibi değeri para olarak da verilebilir; fakirin yararına olanı tercih etmek daha uygundur. Askıda ekmek uygulamasıyla verilen ekmek fitre yerine geçmez; çünkü fitre verilebilecek kişiye ulaştığı bilinemez.'
          ],
          akilda: 'Fitre de zekâtın yoluna gider.',
          kaynak: ['SSS, Sadaka-i Fıtır, soru 1, 3 ve 5', 'DİYK fetvası, “Fitre, yemin keffâreti ve oruç fidyesinin askıda ekmek uygulaması yoluyla verilmesi caiz midir?” (09.04.2025)', 'İlmihal I, “Fitre Verilebilecek Kimseler”'] },

        { id: 'fitre-zekat', bolum: 'fitre', ad: 'Fitre ile zekât farkı', emo: '🔀',
          kisa: 'Zekât malın, fitre canın sadakasıdır.',
          aciklama: [
              'Zekât farzdır; fitre Hanefîlere göre vaciptir. Zekât malın kırkta biridir; fitre kişi başına belli bir tutardır, ölçüsü bir günlük gıda ihtiyacıdır.',
              'Zekât için nisap miktarı malın artıcı olması ve üzerinden bir kamerî yıl geçmesi gerekir; fitre için nisap yeterlidir, artıcılık ve yıl şartı yoktur.',
              'Zekât nisaba ulaşılan günden bir yıl sonra verilir; fitre Ramazan’da ya da bayram sabahı verilir. İkisi de aynı kimselere verilir.'
          ],
          akilda: 'Zekât malın şükrü, fitre canın şükrüdür.',
          kaynak: ['SSS, soru 1 ve 2; Sadaka-i Fıtır, soru 1 ve 2', 'İlmihal I, “Fıtır Sadakası”'] },

        // ---------------- 7. Fidye ve kefaret ----------------
        // Metin Oruç Rehberi'nden (apps/oruc/data.js "fidye" ve "kefaret") aynen alınmıştır; üretici denetler.
        { id: 'oruc-fidyesi', bolum: 'fidye', ad: 'Oruç fidyesi', emo: '🍞', deger: 'fidye', oruc: 'fidye',
          kisa: 'Oruca hiç gücü yetmeyen yaşlı ve iyileşmeyecek hastanın her gün için verdiği bedel.',
          aciklama: [
              'Fidye, oruç tutmaya gücü yetmeyen yaşlılar ile iyileşme ümidi olmayan hastaların tutamadıkları her gün için verdikleri bedeldir. Bir günün fidyesi bir fıtır sadakası kadardır, yani bir kişiyi bir gün doyuracak yiyecek ya da bunun parasıdır.',
              'Fidye Ramazan’ın başında, içinde ya da sonunda verilebilir; hepsi bir yoksula topluca ya da ayrı ayrı yoksullara verilebilir. Kişinin anne babası, dede ve ninesi, çocukları ve torunları ile eşine verilmez.',
              'Gücü yettiği hâlde oruç tutmayan ya da geçici bir mazeretle tutamayan kimse için fidye yoktur; o, orucunu kaza eder. Fidye veren kimse sonradan oruç tutabilecek duruma gelirse Hanefîlere göre tutamadığı oruçları kaza eder ve verdiği fidye sadaka sayılır.',
              'Fidye verecek gücü olmayan kimse Allah’tan bağışlanma diler.'
          ],
          ayetler: ['2:183-184'],
          baglanti: { href: '../oruc/#/k/fidye', ad: 'Oruç Rehberi’nde fidye', alt: 'Kaza, kefaret ve fidye bölümü.' },
          akilda: 'Fidye, oruca gücü hiç yetmeyenin kolaylığıdır.',
          kaynak: ['Bakara 184', 'Oruç SSS, soru 5, 24, 25, 26 ve 27', 'İlmihal I, “Fidye”', 'DİYK, 2026 yılı fitre miktarı kararı (07.01.2026)'] },

        { id: 'oruc-kefareti', bolum: 'fidye', ad: 'Oruç kefareti', emo: '⚖️', oruc: 'kefaret',
          kisa: 'Altmış gün ara vermeden oruç; gücü yetmeyene altmış yoksulu doyurmak.',
          aciklama: [
              'Oruç kefareti, Ramazan orucunu mazeretsiz ve bilerek bozan kimsenin yerine getirmesi gereken telafidir.',
              'Kefaret, iki kamerî ay ya da altmış gün ara vermeden oruç tutmaktır; buna gücü yetmeyen altmış yoksulu bir gün ya da bir yoksulu altmış gün doyurur. Hanefîlere göre bu sıraya uyulur.',
              'Kefaretin yanında bozulan günün kazası ve tövbe de gerekir. Kadının âdet ve lohusalık hâli kefaret orucunun ardı ardınalığını bozmaz; temizlenince kaldığı yerden devam eder.',
              'Aynı Ramazan’da birden fazla gün bozulmuşsa bir kefaret yeterli görülmüştür.'
          ],
          hadisler: [{ metin: 'Ramazan’da orucunu bozan adama Peygamberimiz sırasıyla köle azat etmeyi, iki ay peş peşe oruç tutmayı ve altmış yoksulu doyurmayı sordu.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1936; Müslim, Sıyâm, 1111', k: [['b', 1936, 'Abu Huraira'], ['m', 1111, 'Abu Huraira']] }],
          baglanti: { href: '../oruc/#/k/kefaret', ad: 'Oruç Rehberi’nde kefaret', alt: 'Orucu bozan durumlar ve kefaret.' },
          akilda: 'Kefaret: altmış gün oruç ya da altmış yoksula yemek.',
          kaynak: ['Oruç SSS, soru 31', 'İlmihal I, “Kefâret Orucu”'] },

        { id: 'yemin-kefareti', bolum: 'fidye', ad: 'Yemin kefareti', emo: '🤚',
          kisa: 'Bozulan yemin için on yoksulu doyurmak ya da giydirmek; gücü yetmeyene üç gün oruç.',
          aciklama: [
              'Bilerek ettiği yemini bozan kimse kefaret öder: on yoksulu sabahlı akşamlı doyurur ya da onları orta seviyede giydirir. Ayette köle azat etmek de sayılır. Bu seçeneklerden dilediğini sıraya uymadan seçebilir.',
              'Bunlara gücü yetmeyen üç gün oruç tutar; Hanefîlere göre bu üç gün ardı ardına tutulmalıdır.',
              'On yoksul bir günde doyurulabileceği gibi bir yoksul on gün doyurulabilir; yemek yerine bedeli de verilebilir. Din İşleri Yüksek Kurulu’na göre bir yoksula verilecek yemin kefareti miktarı bir fitre miktarıdır.',
              'Ağızdan kasıtsız çıkıveren yeminler için kefaret gerekmez.'
          ],
          ayetler: ['5:89'],
          akilda: 'Sözünü tutamadıysan on yoksulu doyur.',
          kaynak: ['Mâide 89', 'İlmihal II, “Kefâretler: Yemin Kefâreti”', 'DİYK fetvası, “Fitre, yemin keffâreti ve oruç fidyesinin askıda ekmek uygulaması yoluyla verilmesi caiz midir?” (09.04.2025)'] },

        // ---------------- 8. Sadaka ve infak ----------------
        { id: 'infak', bolum: 'sadaka', ad: 'Allah yolunda harcamak', emo: '🌾',
          kisa: 'Allah yolunda verilen, yedi başak veren tane gibi kat kat artar.',
          aciklama: [
              'İnfak, Allah’ın verdiği maldan Allah rızası için harcamaktır; zekât, fitre ve gönüllü sadakanın hepsi infaktır.',
              'Kur’an, Allah yolunda harcananı her başağında yüz tane olan yedi başak veren bir taneye benzetir. Başka bir ayet, insanın sevdiği şeylerden harcamadıkça iyiliğe erişemeyeceğini bildirir.',
              'Peygamberimiz her gün iki meleğin indiğini; birinin infak edene karşılığını vermesi, ötekinin cimrinin malını telef etmesi için dua ettiğini haber vermiştir.'
          ],
          ayetler: ['2:261', '3:92'],
          hadisler: [{ metin: 'Kulların sabaha çıktığı her gün iki melek iner. Biri “Allah’ım, infak edene karşılığını ver” der; öteki “Allah’ım, (malını) tutana telef ver” der.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Zekât, 1442; Müslim, Zekât, 1010', k: [['b', 1442, 'Abu Huraira'], ['m', 1010, 'Abu Huraira']] }],
          akilda: 'Verilen eksilmez, kat kat artar.',
          kaynak: ['Bakara 261; Âl-i İmrân 92'] },

        { id: 'sadaka', bolum: 'sadaka', ad: 'Gönüllü sadaka', emo: '💚',
          kisa: 'Helal kazançtan verilen, yarım hurma da olsa değerli olan iyilik.',
          aciklama: [
              'Sadaka, farz olan zekât ve vacip olan fitre dışında, Allah rızası için gönüllü olarak verilen her şeydir. Belli bir miktarı ve zamanı yoktur.',
              'Allah yalnız helal ve temiz olanı kabul eder. Helal kazançtan verilen bir hurma kadar sadaka bile Allah katında büyür. Yarım hurmayla bile olsa sadaka vererek cehennemden korunmak istenmiştir.',
              'Gece gündüz, gizli ve açık sadaka verenlerin mükâfatını Rableri verecektir.'
          ],
          ayetler: ['2:274'],
          hadisler: [
              { metin: 'Kim helal kazancından bir hurma kadar sadaka verirse —Allah ancak helali kabul eder— Allah onu kabul eder, sonra sizden birinin tayını büyüttüğü gibi onu sahibi için büyütür; sonunda dağ gibi olur.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Zekât, 1410; Müslim, Zekât, 1014', k: [['b', 1410, 'Abu Huraira'], ['m', 1014, 'Abu Huraira']] },
              { metin: 'Yarım hurmayla da olsa kendinizi ateşten koruyun.', ravi: 'Adî b. Hâtim', kaynak: 'Buhârî, Zekât, 1417; Müslim, Zekât, 1016', k: [['b', 1417, 'Hatim'], ['m', 1016, 'Hatim']] }
          ],
          akilda: 'Az da olsa ver; helalinden ver.',
          kaynak: ['Bakara 274', 'İlmihal I, “Mahiyeti ve Önemi”'] },

        { id: 'her-iyilik', bolum: 'sadaka', ad: 'Her iyilik sadakadır', emo: '😊',
          kisa: 'Güzel söz, güler yüz, yardım etmek, yoldan taşı kaldırmak: hepsi sadakadır.',
          aciklama: [
              'Sadaka yalnız para değildir. Peygamberimiz her iyiliğin sadaka olduğunu bildirmiştir.',
              'İki kişinin arasını bulmak, birinin yükünü hayvanına yüklemesine yardım etmek, güzel bir söz, namaza giderken atılan her adım ve yoldan insanlara eziyet veren bir şeyi kaldırmak sadakadır.',
              'Hiçbir iyiliği küçük görmemek gerekir; kardeşini güler yüzle karşılamak bile bir iyiliktir. Malı olmayan da böylece sadaka verebilir.'
          ],
          hadisler: [
              { metin: 'Her iyilik sadakadır.', ravi: 'Huzeyfe', kaynak: 'Müslim, Zekât, 1005', k: [['m', 1005, 'Hudhaifa']] },
              { metin: 'Güneşin doğduğu her gün insanın her eklemi için bir sadaka gerekir. İki kişinin arasında adaletle hükmetmek sadakadır; birine hayvanına binmesinde ya da yükünü yüklemesinde yardım etmek sadakadır; güzel söz sadakadır; namaza giderken atılan her adım sadakadır; yoldan eziyet veren şeyi kaldırmak sadakadır.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Zekât, 1009', k: [['m', 1009, 'Abu Huraira']] },
              { metin: 'İyilikten hiçbir şeyi küçük görme; kardeşini güler yüzle karşılamak bile olsa.', ravi: 'Ebû Zer', kaynak: 'Müslim, Birr, 2626', k: [['m', 2626, 'Abu Dharr']] }
          ],
          akilda: 'Gülümsemek de bir iyiliktir; iyiliğin küçüğü olmaz.',
          kaynak: ['Müslim, Zekât, 1005 ve 1009; Birr, 2626'] },

        { id: 'sadaka-adabi', bolum: 'sadaka', ad: 'Başa kakmadan, gizlice', emo: '🤫',
          kisa: 'Sadaka başa kakılınca ve incitilince boşa gider; gizli verilen daha faziletlidir.',
          aciklama: [
              'Malını Allah yolunda harcayıp ardından başa kakmayan ve incitmeyenlerin mükâfatı Rableri katındadır. Başa kakmak ve incitmek sadakayı, üzerindeki toprağı yağmurla akıp giden çıplak bir kaya gibi boşa çıkarır.',
              'Gönüllü sadakayı gizli vermek bütün fakihlere göre daha faziletlidir. Peygamberimiz, sağ elinin verdiğini sol eli bilmeyecek kadar gizli sadaka vereni, kıyamet günü Allah’ın gölgelendireceği yedi kişiden saymıştır.'
          ],
          ayetler: ['2:262', '2:264'],
          hadisler: [{ metin: 'Allah’ın gölgesinden başka gölgenin bulunmadığı günde Allah’ın gölgelendireceği yedi kişiden biri de sağ elinin verdiğini sol eli bilmeyecek kadar gizli sadaka veren kimsedir.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Zekât, 1423; Müslim, Zekât, 1031', k: [['b', 1423, 'Abu Huraira'], ['m', 1031, 'Abu Huraira']] }],
          akilda: 'Sağ elin verdiğini sol el bilmesin.',
          kaynak: ['Bakara 262 ve 264', 'İlmihal I, “Zekât Vermenin Âdâbı”'] },

        { id: 'once-yakinlar', bolum: 'sadaka', ad: 'Önce yakınlar', emo: '🏡',
          kisa: 'Veren el alan elden üstündür; vermeye bakmakla yükümlü olduklarından başla.',
          aciklama: [
              'Peygamberimiz veren elin alan elden üstün olduğunu, vermeye bakmakla yükümlü olunan kimselerden başlanmasını ve en hayırlı sadakanın ihtiyaç fazlasından verilen olduğunu bildirmiştir.',
              'Kişinin Allah rızasını umarak ailesi için yaptığı harcama da onun için sadakadır.',
              'Ayet, asıl iyiliğin imanla birlikte Allah sevgisiyle yakınlara, yetimlere, düşkünlere, yolculara, yoksullara ve köleler uğrunda mal vermek olduğunu bildirir.'
          ],
          ayetler: ['2:177'],
          hadisler: [
              { metin: 'Üstteki el alttaki elden hayırlıdır. (Vermeye) bakmakla yükümlü olduğun kimselerden başla. Sadakanın hayırlısı ihtiyaç fazlasından verilendir. Kim istemekten sakınırsa Allah onu korur; kim yetinirse Allah onu zengin kılar.', ravi: 'Hakîm b. Hizâm', kaynak: 'Buhârî, Zekât, 1427; Müslim, Zekât, 1034', k: [['b', 1427, 'Hizam'], ['m', 1034, 'Hizam']] },
              { metin: 'Müslüman, sevabını Allah’tan umarak ailesine harcama yaptığında bu onun için sadaka olur.', ravi: 'Ebû Mes‘ûd', kaynak: 'Müslim, Zekât, 1002', k: [['m', 1002, 'Abu Mas\'ud']] }
          ],
          akilda: 'İyilik evden başlar.',
          kaynak: ['Bakara 177'] },

        { id: 'sadaka-i-cariye', bolum: 'sadaka', ad: 'Sadaka-i câriye', emo: '⛲',
          kisa: 'Faydası ölümden sonra da süren hayır: cami, okul, çeşme, kütüphane gibi.',
          aciklama: [
              'Sadaka-i câriye, “akan, süren sadaka” demektir: ardından nesiller boyu yararlanılacak bir hayır bırakmaktır. Peygamberimiz, insan ölünce amelinin kesildiğini, yalnız üç şeyin devam ettiğini bildirmiştir.',
              'Cami, çeşme, hastane, kütüphane, köprü ve okul gibi eserler sadaka-i câriyenin örnekleridir.',
              'Zekât bu tür yerlere harcanmaz; çünkü zekât fakirin hakkıdır. Kalıcı hayırlar zekât dışındaki gönüllü bağışlarla yapılır.'
          ],
          hadisler: [{ metin: 'İnsan ölünce ameli kesilir; yalnız üç şey müstesna: sadaka-i câriye, yararlanılan ilim ve kendisine dua eden hayırlı evlat.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Vasiyyet, 1631', k: [['m', 1631, 'Abu Huraira']] }],
          baglanti: { href: '#/k/kurumlar', ad: 'Cami, okul ve kurumlar', alt: 'Zekât neden bu yerlere verilmez?' },
          akilda: 'Ardında akan bir hayır bırak.',
          kaynak: ['Diyanet İşleri Başkanlığı, Cuma Hutbesi “Sadaka-i Câriye” (17.08.2018)', 'SSS, soru 32'] },

        { id: 'adak', bolum: 'sadaka', ad: 'Adak', emo: '🐑', hukum: 'vacip',
          kisa: 'Allah’a ibadet olarak adanan şeyi yerine getirmek vaciptir; günah olan şey adanmaz.',
          aciklama: [
              'Adak (nezir), kişinin dinen yükümlü olmadığı, farz ya da vacip cinsinden bir ibadeti kendisine borç kılmasıdır: namaz kılmak, oruç tutmak, sadaka vermek ya da kurban kesmek gibi. Allah’a isyan içeren bir şey adanmaz; adanmışsa yerine getirilmez.',
              'Peygamberimiz adağın kaderi değiştirmediğini, onunla ancak cimriden mal çıkarıldığını söylemiştir. Dünyevî bir dileğe bağlanan adak bir pazarlık gibi görülebileceği için hoş karşılanmamıştır; ama yapılmışsa yerine getirilmesi vaciptir.',
              'Türbelerde mum yakmak, bez bağlamak, horoz kesmek, şeker ve helva dağıtmak gibi adetlerin İslam’da yeri yoktur. Adak kurbanının etinden adayan ve bakmakla yükümlü olduğu kimseler yiyemez.'
          ],
          mezhep: 'Şâfiî mezhebine ve Ahmed b. Hanbel’e göre adak adamak mekruhtur; Hanefîler Allah’a ibadet kabilinden adağı mubah görür. Yapılan adağı yerine getirmek ise hepsine göre gereklidir.',
          ayetler: ['2:270'],
          hadisler: [
              { metin: 'Kim Allah’a itaat etmeyi adarsa ona itaat etsin; kim Allah’a isyan etmeyi adarsa ona isyan etmesin.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Eymân ve’n-nüzûr, 6696', k: [['b', 6696, 'Aisha']] },
              { metin: 'Peygamberimiz adak adamayı yasakladı ve “Adak hiçbir şeyi geri çeviremez; onunla ancak cimriden mal çıkarılır” buyurdu.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Eymân ve’n-nüzûr, 6693; Müslim, Nezr, 1639', k: [['b', 6693, 'Umar'], ['m', 1639, 'Umar']] }
          ],
          kavramlar: ['vacip'],
          akilda: 'Adak Allah’la pazarlık değil, verilmiş bir sözdür.',
          kaynak: ['Bakara 270', 'İlmihal II, “Adak ve Yeminler: Adak”'] }
    ],

    // Tevbe 60: zekâtın verileceği sekiz sınıf. "meal" ayetteki Diyanet meali kelimesidir; "bugun" Diyanet'e göre
    // bugünkü karşılığıdır.
    siniflar: [
        { id: 'fakir', ad: 'Fakirler', meal: 'yoksullar', emo: '🫶',
          aciklama: 'Temel ihtiyaçları dışında nisap miktarı malı olmayan kimse. Hanefîlere göre fakirin az da olsa malı vardır.',
          bugun: 'Geliri olsa da temel ihtiyaçlarını karşılayamayan ya da ihtiyaçlarından sonra 80,18 gram altın değerinde malı kalmayan kişi: memur, esnaf, işsiz fark etmez.',
          mezhep: 'Şâfiî ve Hanbelîlere göre fakir, miskinden daha muhtaçtır; ölçü nisap değil yeterliliktir.',
          konu: 'fakir-miskin', kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); SSS, soru 30' },
        { id: 'miskin', ad: 'Miskinler', meal: 'düşkünler', emo: '🤲',
          aciklama: 'Hanefîlere göre hiçbir malı ve geliri olmayan kimse. Din İşleri Yüksek Kurulu fakir ve miskini aynı ölçüyle tanımlar: temel ihtiyaçları dışında nisap miktarı malı olmayan.',
          bugun: 'Hiçbir geliri ve malı olmayan, en muhtaç kimseler; durumunu söylemeyen iffetli yoksullar da araştırılıp bulunur.',
          konu: 'fakir-miskin', kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “Fakirler ve Miskinler”' },
        { id: 'amil', ad: 'Zekât memurları', meal: 'onu toplayan memurlar', emo: '🧮',
          aciklama: 'Müslüman devlet başkanı tarafından zekât toplamakla görevlendirilen memurlar (âmiller). Fakir olmaları şart değildir; emeklerinin karşılığını alırlar.',
          bugun: 'Devlet başkanınca zekât memuru olarak atanmayan kişiler ve sivil kuruluşlar bu sınıfa girmez.',
          kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “Âmiller”' },
        { id: 'muellefe', ad: 'Kalpleri ısındırılacaklar', meal: 'kalbleri Müslümanlığa ısındırılacaklar', emo: '💞',
          aciklama: 'Müellefe-i kulûb: kalpleri İslam’a ısındırılmak istenen kimseler. Peygamberimiz bu kimselere zekâttan ve devlet gelirlerinden pay vermiştir.',
          bugun: 'Hulefâ-i Râşidîn döneminde şartları ortadan kalktığı gerekçesiyle bu sınıfa zekât verilmemiştir. Bir kısım müçtehit bu uygulamayı benimser; bu sınıfa zekât verilebileceğini söyleyenler de bunu devlet yetkililerinin takdirine bağlar.',
          kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “Müellefe-i Kulûb”' },
        { id: 'rikab', ad: 'Köleler', meal: 'kölelerin (uğrunda)', emo: '🔓',
          aciklama: 'Rikab: hürriyetine kavuşmak için belli bir bedel üzerine anlaşma yapmış ve bu yüzden yardıma muhtaç köleler. Zekâttan bu pay, köleliğin kaldırılmasına yardım için ayrılmıştır.',
          bugun: 'Kölelik bugün kalkmıştır. Diyanet İlmihali, âlimlerin bu payı savaş esirlerine ya da ağır borç altındakilere ayırmak gibi görüşler ileri sürdüğünü belirtir.',
          kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “Rikab”' },
        { id: 'garim', ad: 'Borçlular', meal: 'borçluların (uğrunda)', emo: '🧾',
          aciklama: 'Kul hakkı olarak borcu olan ve borcunu ödeyecek maldan başka nisap miktarı malı bulunmayan kimse.',
          bugun: 'Borcunu ödeyemeyen kimseye borcu kadar zekât verilebilir; haram ya da israf yüzünden borçlanmış olmamalıdır.',
          mezhep: 'Şâfiî, Mâlikî ve Hanbelî mezhepleri, iki taraf arasını bulmak gibi toplumun yararı için borçlananı da bu sınıfta sayar.',
          konu: 'sekiz-sinif', kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “Borçlular”' },
        { id: 'fisebilillah', ad: 'Allah yolunda olanlar', meal: 'Allah yolunda olanların (uğrunda)', emo: '🛡️',
          aciklama: 'Fî sebîlillâh: orduyla birlikte savaşa gitmek istediği hâlde maddi imkân bulamayan mücahitler. Hac yoluna çıkıp fakir düşen hacıları da bu kapsamda sayanlar vardır.',
          bugun: 'Din İşleri Yüksek Kurulu’na göre okullar, Kur’an kursları, camiler ve benzeri hayır kurumları bu sınıfa girmez.',
          konu: 'kurumlar', kaynak: 'DİYK fetvası, “fî sebîlillâhın kapsamına okullar… girer mi?” (12.03.2025)' },
        { id: 'ibnussebil', ad: 'Yolda kalmışlar', meal: 'yolda kalanların (uğrunda)', emo: '🧳',
          aciklama: 'İbnüssebîl: memleketinde malı olsa bile yolculukta parasız kalıp parasına ulaşamayan kimse. Malına ulaşıncaya kadar yetecek kadar zekât verilir.',
          bugun: 'Banka kartıyla ya da başka bir yolla parasına ulaşabilen yolcuya zekât verilmez.',
          mezhep: 'Şâfiîlere göre bu sınıf, yolculuk yapmak isteyip imkân bulamayan kimseyi de kapsar; artan zekât geri alınır.',
          konu: 'sekiz-sinif', kaynak: 'DİYK fetvası, “Zekât kimlere verilir?” (19.03.2025); İlmihal I, “İbnüssebîl”' }
    ],

    // Verebilir miyim? oyunu: cevap bağlı konunun hükmüyle aynıdır (verilir | verilmez).
    kisiler: [
        { id: 'anne', emo: '👩', ad: 'Fakir annem', konu: 'usul-furu', cevap: 'verilmez', aciklama: 'Anne, baba, dede ve nine kişinin usûlüdür; onlara zekât verilmez. Onlara zekât dışındaki maldan bakılır.' },
        { id: 'dede', emo: '👴', ad: 'Fakir dedem', konu: 'usul-furu', cevap: 'verilmez', aciklama: 'Dede ve nine de usûldendir; zekât verilmez.' },
        { id: 'kiz', emo: '👰', ad: 'Evli ve fakir kızım', konu: 'usul-furu', cevap: 'verilmez', aciklama: 'Çocuk ve torunlar fürûdur; evli de olsalar onlara zekât verilmez.' },
        { id: 'torun', emo: '🧒', ad: 'Torunum', konu: 'usul-furu', cevap: 'verilmez', aciklama: 'Torun fürûdandır; zekât verilmez.' },
        { id: 'es', emo: '💑', ad: 'Eşim', konu: 'es', cevap: 'verilmez', aciklama: 'Eşler birbirine zekât, fitre ve fidye veremez. Ebû Hanîfe’ye göre kadın da fakir kocasına veremez.' },
        { id: 'kardes', emo: '🧑‍🤝‍🧑', ad: 'Fakir kardeşim', konu: 'akraba', cevap: 'verilir', aciklama: 'Kardeş usûl ve fürûdan değildir; zengin değilse zekât verilebilir, hatta önceliklidir.' },
        { id: 'amca', emo: '👨', ad: 'Fakir amcam', konu: 'akraba', cevap: 'verilir', aciklama: 'Amca, hala, dayı, teyze ve çocuklarına zengin değillerse zekât verilebilir.' },
        { id: 'teyze', emo: '👵', ad: 'Fakir teyzem', konu: 'akraba', cevap: 'verilir', aciklama: 'Teyze usûl ve fürûdan değildir; zengin değilse zekât verilebilir.' },
        { id: 'gelin', emo: '👩‍🦱', ad: 'Fakir gelinim ya da damadım', konu: 'akraba', cevap: 'verilir', aciklama: 'Gelin ve damat usûl ve fürûdan değildir; kişi onlara bakmakla yükümlü de değildir.' },
        { id: 'kayinvalide', emo: '👵', ad: 'Fakir kayınvalidem', konu: 'akraba', cevap: 'verilir', aciklama: 'Kayınvalide ve kayınpedere, fakir iseler zekât verilebilir.' },
        { id: 'uvey', emo: '👩‍👧', ad: 'Fakir üvey annem', konu: 'akraba', cevap: 'verilir', aciklama: 'Üvey anne, üvey baba ve üvey çocuklarla aranızda usûl-fürû ilişkisi yoktur; fakir iseler zekât verilebilir.' },
        { id: 'sutanne', emo: '🍼', ad: 'Süt annem', konu: 'akraba', cevap: 'verilir', aciklama: 'Süt anne ve süt baba, kişinin bakmakla yükümlü olduğu kimselerden değildir; fakir iseler zekât verilebilir.' },
        { id: 'komsu', emo: '🏘️', ad: 'İhtiyaç sahibi müslüman komşum', konu: 'fakir-miskin', cevap: 'verilir', aciklama: 'Temel ihtiyaçları dışında nisap miktarı malı olmayan müslüman fakirdir; zekât verilir.' },
        { id: 'memur', emo: '🧑‍💼', ad: 'Maaşı geçimine yetmeyen memur', konu: 'fakir-miskin', cevap: 'verilir', aciklama: 'Geliri olsa da temel ihtiyaçlarından sonra nisap miktarı malı kalmayana zekât verilebilir; memur olması fark etmez.' },
        { id: 'borclu', emo: '🧾', ad: 'Borcunu ödeyemeyen esnaf', konu: 'sekiz-sinif', cevap: 'verilir', aciklama: 'Borcunu ödeyecek maldan başka nisap miktarı malı olmayan borçlu, sekiz sınıftandır.' },
        { id: 'yolcu', emo: '🧳', ad: 'Parasına ulaşamayan, yolda kalmış yolcu', konu: 'sekiz-sinif', cevap: 'verilir', aciklama: 'Yolda kalmış kimseye malına ulaşıncaya kadar yetecek kadar zekât verilebilir. Banka kartıyla parasına ulaşabiliyorsa verilmez.' },
        { id: 'zengin-akraba', emo: '💼', ad: 'Birikimi nisabın üstünde olan kuzenim', konu: 'zengin', cevap: 'verilmez', aciklama: 'Aslî ihtiyaçları dışında nisap miktarı malı olan zengindir; ona zekât verilmez.' },
        { id: 'zengin-cocuk', emo: '🧸', ad: 'Babası zengin olan küçük çocuk', konu: 'zengin', cevap: 'verilmez', aciklama: 'Babası zengin olan, ergenlik çağına girmemiş çocuğa zekât verilmez.' },
        { id: 'gayrimuslim', emo: '🕊️', ad: 'Müslüman olmayan fakir komşum', konu: 'gayrimuslim', cevap: 'verilmez', aciklama: 'Zekât müslüman fakirlerin hakkıdır. Komşunuza zekât dışındaki maldan yardım etmek güzeldir.' },
        { id: 'cami', emo: '🕌', ad: 'Mahallemizdeki cami inşaatı', konu: 'kurumlar', cevap: 'verilmez', aciklama: 'Zekât cami, okul, yol, çeşme gibi yerlere harcanmaz; bunlar gönüllü bağışla desteklenir.' },
        { id: 'kurs', emo: '🏫', ad: 'Kur’an kursu binası', konu: 'kurumlar', cevap: 'verilmez', aciklama: 'Kur’an kursları, okullar ve camiler “Allah yolunda” sınıfına girmez; zekât bunlara harcanmaz.' }
    ],

    // Yıllık ve sabit değerler. Fitre ve fidye Oruç Rehberi ile aynı değer ve kaynaktır (üretici denetler).
    // Doğrulanamazsa tutar null kalır ve ekranda "Diyanet'in açıklamasına bakın" yazılır.
    // Altın ve gümüş gram fiyatı yazılmaz: hesaplayıcıda kullanıcı girer.
    degerler: {
        nisapAltin: { gram: 80.18, olcu: '20 miskal altın', ne: 'zekât nisabı (altın)',
                      kaynak: 'Din İşleri Yüksek Kurulu, Zekât: Sıkça Sorulanlar, soru 1; İlmihal I, “Altın ve Gümüş”',
                      url: 'https://webdosya.diyanet.gov.tr/ramazan/UserFiles/00000000-0000-0000-0000-000000000000/2017/5/26/0de9ef51-1b0a-4602-bfda-ef68727b299b.pdf' },
        nisapGumus: { gram: 561.2, olcu: '200 dirhem gümüş', ne: 'gümüş nisabı (bilgi için)',
                      kaynak: 'İlmihal I, “Altın ve Gümüş”: Din İşleri Yüksek Kurulu 200 dirhem gümüşü 561,2 gram esas almıştır',
                      not: 'Diyanet İlmihali’ne göre bugün gümüşün değeri çok düştüğü için gümüş nisabının parasal karşılığı nisap sayılmaz; altın esas alınır.' },
        fidye: { tutar: 240, birim: 'TL', ne: 'bir günlük oruç fidyesi', donem: '2026 Ramazan’ından 2027 Ramazan’ına kadar',
                 tarih: '2026-01-07', duyuru: '2026-01-13', kaynak: 'Din İşleri Yüksek Kurulu, “2026 Yılı Fitre Miktarını Açıkladı”',
                 url: 'https://kurul.diyanet.gov.tr/tr/duyuru/din-isleri-yuksek-kurulu-2026-yili-fitre-miktarini-acikladi/019bb642-4872-7191-841e-408610f76b33',
                 not: 'Kurul bu tutarı asgari olarak açıklamıştır; herkes kendi günlük gıda harcamasına göre daha fazlasını verebilir. Bu tutar aynı zamanda günlük oruç fidyesidir.' },
        fitre: { tutar: 240, birim: 'TL', ne: 'bir kişinin fıtır sadakası', donem: '2026 Ramazan’ından 2027 Ramazan’ına kadar',
                 tarih: '2026-01-07', duyuru: '2026-01-13', kaynak: 'Din İşleri Yüksek Kurulu, “2026 Yılı Fitre Miktarını Açıkladı”',
                 url: 'https://kurul.diyanet.gov.tr/tr/duyuru/din-isleri-yuksek-kurulu-2026-yili-fitre-miktarini-acikladi/019bb642-4872-7191-841e-408610f76b33',
                 not: 'Kurul bu tutarı asgari olarak açıklamıştır; herkes kendi günlük gıda harcamasına göre daha fazlasını verebilir. Nakit ya da gıda olarak verilebilir.' }
    },

    kaynaklar: [
        { ad: 'Kur’an-ı Kerim', not: 'Bakara 43, 177, 183–184, 261, 262, 264, 267, 270, 271, 273, 274; Âl-i İmrân 92; Mâide 89; En‘âm 141; Tevbe 34–35, 60, 103. Arapça metin Tanzil Quran Text (Simple), meal Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet); değiştirilmeden.' },
        { ad: 'Buhârî, “Kitâbü’z-zekât” ve Müslim, “Kitâbü’z-zekât”', not: 'Ayrıca Buhârî “Savm” ve “Eymân ve’n-nüzûr”, Müslim “Sıyâm”, “Vasiyyet”, “Birr” ve “Nezr”. Künyeler fawazahmed0/hadith-api metinleriyle otomatik denetlendi; Müslim numarası M. Fuâd Abdülbâkî numarasıdır. Hadis metinleri Türkçeye anlam olarak aktarılmıştır.' },
        { ad: 'Din İşleri Yüksek Kurulu, Zekât: Sıkça Sorulanlar', not: 'Konulardaki “SSS, soru …” bu kitapçıktır; “Sadaka-i Fıtır” soruları ayrı numaralıdır.', url: 'https://webdosya.diyanet.gov.tr/ramazan/UserFiles/00000000-0000-0000-0000-000000000000/2017/5/26/0de9ef51-1b0a-4602-bfda-ef68727b299b.pdf' },
        { ad: 'Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler, “Zekât” bölümü', not: 'Nisap ölçüsü (80,18 g altın, 561,2 g gümüş), zekâtın sarf yerleri, verilmeyecek kimseler, âdâb ve fıtır sadakası; mezhep farkları bu bölümden aktarılmıştır.' },
        { ad: 'Diyanet İşleri Başkanlığı, İlmihal II, “Kefâretler” ve “Adak ve Yeminler”', not: 'Yemin kefareti ve adak.' },
        { ad: 'Din İşleri Yüksek Kurulu fetvaları', not: '“Zekât kimlere verilir?” (19.03.2025), “Zekât kimlere verilmez?” (12.07.2017), “Zekât âyetinde geçen fî sebîlillâh…” (12.03.2025), “Maaş ve ücret gibi gelirlerin zekâtı…” (26.11.2025), “Fitre, yemin keffâreti ve oruç fidyesinin askıda ekmek…” (09.04.2025).', url: 'https://kurul.diyanet.gov.tr/tr/fetvalar/zekat-ve-sadaka/3ab3e3d9-e166-425c-957a-aeb000d961ee' },
        { ad: 'Din İşleri Yüksek Kurulu, 2026 yılı fitre miktarı', not: 'Toplantı 07.01.2026, duyuru 13.01.2026: fitre ve günlük fidye 240 TL. Yemin kefareti için ayrı tutar açıklanmamıştır.', url: 'https://kurul.diyanet.gov.tr/tr/duyuru/din-isleri-yuksek-kurulu-2026-yili-fitre-miktarini-acikladi/019bb642-4872-7191-841e-408610f76b33' },
        { ad: 'Diyanet İşleri Başkanlığı, Oruç: Sıkça Sorulanlar', not: 'Oruç fidyesi ve kefareti Oruç Rehberi ile aynı metin ve kaynaktır (“Oruç SSS”).', url: 'https://webdosya.diyanet.gov.tr/ramazan/UserFiles/00000000-0000-0000-0000-000000000000/2025/2/20/b4f6325c-01ad-4d75-8bac-8c830775bfb9.pdf' },
        { ad: 'Hadislerle İslâm, “Zekât Vermek: Zekâta Tabi Mallar ve Zekât Nisabı”', not: 'Diyanet İşleri Başkanlığı; gümüş nisabı (200 dirhem, 561 g) ve altının esas alınması.', url: 'https://webdosya.diyanet.gov.tr/ramazan/UserFiles/00000000-0000-0000-0000-000000000000/2025/2/21/48cbe41d-2e3e-41cb-898d-ce5e581f6e1f.pdf' },
        { ad: 'Diyanet İşleri Başkanlığı, Cuma Hutbesi “Sadaka-i Câriye” (17.08.2018)', not: 'Sadaka-i câriyenin anlamı ve örnekleri.', url: 'https://diyanet.gov.tr/tr-tr/kurumsal/detay/11871/cuma-hutbesi-sadaka-i-criye' }
    ]
};
