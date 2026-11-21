// ============================================
// Oruç Rehberi — içerik
// --------------------------------------------
// Fıkıh: Diyanet İşleri Başkanlığı esas alınır. Hanefî görüş ana metindir; Şâfiî farkı yalnızca önemli
// yerlerde tek cümleyle "mezhep" alanında verilir. Her konunun "kaynak" alanı hangi Diyanet yayını,
// soru ya da Din İşleri Yüksek Kurulu (DİYK) kararı olduğunu söyler. Kısaltmalar:
//   SSS  = Diyanet İşleri Başkanlığı, "Oruç: Sıkça Sorulanlar" (Din İşleri Yüksek Kurulu, 8. baskı, Ankara 2020)
//   İlmihal = Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler, "Oruç" bölümü
//
// Ayet metinleri burada yazılmaz; yalnızca "sure:ayet" verilir. Arapça (Tanzil Simple) ve meal (Diyanet İşleri,
// Tanzil tr.diyanet) tools/oruc-uret.mjs ile ayetler.js dosyasına üretilir.
// Hadis metinleri Türkçeye anlam olarak aktarılmıştır; her künye (kitap, bölüm, numara, râvi) üretici tarafından
// fawazahmed0/hadith-api metinleriyle otomatik denetlenir. Müslim numarası M. Fuâd Abdülbâkî numarasıdır.
//   k: [[kitap (b: Buhârî | m: Müslim | d: Ebû Dâvûd | t: Tirmizî), numara, metinde geçen râvi adı (İngilizce yazımıyla)]]
// Buhârî ve Müslim dışındaki rivayetler "rivayetler" alanındadır; sıhhat durumu yazılır ve üretici hadith-api'deki
// derecelendirmeyle (grades) karşılaştırır.
//
// Konu alanları: id · bolum · ad · emo · kisa (tek cümle) · aciklama [2–4 cümle] · hukum (hukumler'den ya da yok)
//   · ornek (günlük hayattan, isteğe bağlı) · mezhep (Şâfiî farkı, isteğe bağlı) · saglik (doktor/müftülük notu)
//   · ayetler · hadisler · rivayetler · dua · kavramlar (../kavram/ kimlikleri) · baglanti · deger · akilda · kaynak []
// "sorular" Bozar mı? oyunudur: cevap, bağlı konunun hükmüyle aynı olmalıdır (üretici denetler).
// ============================================
window.ORUC_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    vakitler: 'https://namazvakitleri.diyanet.gov.tr/',

    // Hüküm rozetleri: her yerde aynı renk ve kelime. "cumle" anlatımda okunur.
    hukumler: {
        farz: { ad: 'Farz', tam: 'Farz', aciklama: 'Yapılması kesin olarak istenen', kavram: 'farz', cumle: 'Hükmü: farzdır.' },
        sunnet: { ad: 'Sünnet', tam: 'Sünnet', aciklama: 'Peygamberimizin yaptığı ve tavsiye ettiği', kavram: 'sunnet', cumle: 'Hükmü: sünnettir.' },
        mekruh: { ad: 'Mekruh', tam: 'Mekruh', aciklama: 'Orucu bozmaz ama kaçınılması istenir', kavram: 'mekruh-tenzihen', cumle: 'Hükmü: mekruhtur, kaçınılması istenir.' },
        'bozar-kaza': { ad: 'Bozar · kaza', tam: 'Orucu bozar, kaza gerekir', aciklama: 'Oruç bozulur; o gün sonra kaza edilir', cumle: 'Bu durum orucu bozar ve kaza gerektirir.' },
        'bozar-kefaret': { ad: 'Bozar · kaza + kefaret', tam: 'Orucu bozar, kaza ve kefaret gerekir', aciklama: 'Oruç bozulur; kaza ile birlikte kefaret de gerekir', cumle: 'Bu durum orucu bozar; kaza ile birlikte kefaret de gerektirir.' },
        bozmaz: { ad: 'Bozmaz', tam: 'Orucu bozmaz', aciklama: 'Oruç devam eder', cumle: 'Bu durum orucu bozmaz.' },
        ruhsat: { ad: 'Ruhsat', tam: 'Ruhsat var', aciklama: 'Oruç tutmamaya izin verilen durum', kavram: 'ruhsat', cumle: 'Bu durumda oruç tutmamaya ruhsat vardır.' }
    },

    bolumler: [
        { id: 'giris', ad: 'Giriş', alt: 'Orucun anlamı ve farz oluşu', emo: '🌙' },
        { id: 'farz', ad: 'Farzları ve şartları', alt: 'Kime farzdır, niyet, imsak ve iftar', emo: '📜' },
        { id: 'sahur', ad: 'Sahur ve iftar', alt: 'Sünnetleri ve iftar duası', emo: '🍽️' },
        { id: 'bozan', ad: 'Orucu bozanlar', alt: 'Yalnız kaza ya da kaza ve kefaret', emo: '⛔' },
        { id: 'bozmayan', ad: 'Orucu bozmayanlar', alt: 'Unutmak, diş, iğne, sprey, damla, kan', emo: '✅' },
        { id: 'mekruh', ad: 'Mekruh olanlar', alt: 'Orucu bozmaz ama kaçınılır', emo: '⚠️' },
        { id: 'ruhsat', ad: 'Ruhsatlar', alt: 'Yolcu, hasta, hamile, yaşlı, çocuk', emo: '🤲' },
        { id: 'telafi', ad: 'Kaza, kefaret, fidye', alt: 'Tutulamayan orucun telafisi', emo: '⚖️' },
        { id: 'nafile', ad: 'Nafile oruçlar', alt: 'Şevval, Arefe, Aşure ve diğerleri', emo: '⭐' },
        { id: 'yasak', ad: 'Tutulmayan günler', alt: 'Bayramlar, yalnız cuma, şek günü', emo: '🚫' },
        { id: 'ramazan', ad: 'Ramazan’ın ibadetleri', alt: 'Teravih, itikâf, Kadir Gecesi, fitre', emo: '🕌' }
    ],

    konular: [
        // ---------------- 1. Giriş ----------------
        { id: 'farz-olusu', bolum: 'giris', ad: 'Oruç farzdır', emo: '🌙', hukum: 'farz',
          kisa: 'Ramazan orucu, İslam’ın beş şartından biridir.',
          aciklama: [
              'Oruç, imsak vaktinden iftar vaktine kadar Allah rızası için yemekten, içmekten ve cinsel ilişkiden uzak durmaktır.',
              'Ramazan orucu hicretten bir buçuk yıl sonra farz kılınmıştır ve İslam’ın beş şartından biridir.',
              'Ayet, orucun bizden önceki ümmetlere de farz kılındığını ve amacının takva, yani Allah’a karşı gelmekten sakınmak olduğunu bildirir.'
          ],
          ayetler: ['2:183-184'],
          hadisler: [{ metin: 'Kim inanarak ve sevabını Allah’tan umarak Ramazan orucunu tutarsa geçmiş günahları bağışlanır.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1901', k: [['b', 1901, 'Abu Huraira']] }],
          kavramlar: ['farz', 'niyet'],
          akilda: 'Oruç aç kalmak değil, Allah için kendini tutmaktır.',
          kaynak: ['Bakara 183–184', 'İlmihal, “Orucun Mahiyeti ve Önemi”', 'SSS, “Orucun Hikmet ve Faydaları”'] },

        { id: 'oruc-kalkandir', bolum: 'giris', ad: 'Oruç bir kalkandır', emo: '🛡️',
          kisa: 'Oruç yalnız mideyi değil, dili ve davranışı da korur.',
          aciklama: [
              'Peygamberimiz orucu, insanı kötülüklerden koruyan bir kalkana benzetmiştir.',
              'Oruçlu kimse kötü söz söylemez, kavga etmez; biri ona sataşırsa yalnızca “Ben oruçluyum” der.',
              'Yalanı ve kötü davranışı bırakmayan kimsenin aç ve susuz kalmasının bir anlamı olmadığı da bildirilmiştir.'
          ],
          hadisler: [
              { metin: 'Oruç bir kalkandır. Oruçlu kimse çirkin söz söylemesin, cahillik etmesin. Biri onunla kavga eder ya da ona söverse iki kez “Ben oruçluyum” desin. Allah buyurur: “O, yemesini, içmesini ve arzusunu benim için bıraktı. Oruç benim içindir, onun karşılığını ben veririm.”', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1894', k: [['b', 1894, 'Abu Huraira']] },
              { metin: 'Yalan sözü ve onunla iş görmeyi bırakmayan kimsenin yemesini, içmesini bırakmasına Allah’ın ihtiyacı yoktur.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1903', k: [['b', 1903, 'Abu Huraira']] }
          ],
          akilda: 'Oruç, dilin ve elin de orucudur.',
          kaynak: ['İlmihal, “Orucun Mahiyeti ve Önemi” ve “Oruçlu İçin Müstehap Olan Şeyler”'] },

        { id: 'ramazan-ayi', bolum: 'giris', ad: 'Ramazan ayı', emo: '📖',
          kisa: 'Kur’an’ın indirildiği ay; bu aya ulaşan oruç tutar.',
          aciklama: [
              'Ramazan, Kur’an’ın insanlara yol gösterici olarak indirildiği aydır; ayet, bu aya ulaşanın oruç tutmasını emreder.',
              'Kamerî aylar 29 ya da 30 gün çeker. Diyanet, Ramazan’ın başlangıcını ve bayramı astronomik hesaba dayanan takvimle ilan eder; hesap yöntemi meşrudur.',
              'Oruç ayetlerinin arasında Allah’ın kullarına yakın olduğu ve duaya cevap verdiği de bildirilir.'
          ],
          ayetler: ['2:185', '2:186'],
          hadisler: [{ metin: 'Ramazan ayı girince göğün kapıları açılır, cehennemin kapıları kapanır ve şeytanlar zincire vurulur.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1899', k: [['b', 1899, 'Abu Huraira']] }],
          akilda: 'Ramazan, Kur’an’ın ayıdır.',
          kaynak: ['Bakara 185–186', 'SSS, soru 2 (hilalin görülmesi)', 'İlmihal, “Hilâlin Görülmesi”'] },

        // ---------------- 2. Farzları ve şartları ----------------
        { id: 'kime-farz', bolum: 'farz', ad: 'Kime farzdır?', emo: '🧑',
          hukum: 'farz',
          kisa: 'Müslüman, akıllı ve ergenlik çağına girmiş herkese.',
          aciklama: [
              'Ramazan orucu müslüman, akıllı ve ergenlik çağına ulaşmış (âkil-bâliğ) her kişiye farzdır.',
              'Orucu o gün tutmak için ayrıca oruca gücü yetiyor olmak ve yolcu olmamak gerekir; hasta ve yolcu tutamadığını sonra kaza eder.',
              'Kadın, âdet ve lohusalık hâlinde oruç tutmaz; temizlenince kaza eder. Ergenlik çağına girmemiş çocuğa oruç farz değildir; alıştırılır.'
          ],
          kavramlar: ['farz', 'guc'],
          akilda: 'Akıl, ergenlik ve İslam: orucun üç şartı.',
          kaynak: ['SSS, soru 1', 'İlmihal, “Yükümlülük Şartları”'] },

        { id: 'niyet', bolum: 'farz', ad: 'Niyet', emo: '💭', hukum: 'farz',
          kisa: 'Niyetsiz oruç olmaz; kalben niyet yeterlidir.',
          aciklama: [
              'Niyet orucun şartıdır; kalben niyet etmek yeterli, dille söylemek güzeldir. Sahura kalkmak da niyet sayılır.',
              'Ramazan orucu, belli güne adanmış oruç ve nafile oruç için niyet vakti güneşin batışından ertesi gün öğle vaktinin girmesinden az öncesine kadardır; imsaktan sonra niyet edecek kimse o vakte kadar bir şey yememiş olmalıdır.',
              'Kaza, kefaret ve belli bir güne bağlanmamış adak oruçlarına en geç imsaka kadar ve hangi oruç olduğu belirtilerek niyet edilir. Ramazan’ın her günü için ayrı niyet edilir.'
          ],
          mezhep: 'Şâfiî mezhebine göre nafile dışındaki bütün oruçlara geceden niyet edilmelidir; imsaka kadar niyet edilmemişse o günün orucu geçerli olmaz.',
          hadisler: [{ metin: 'Ameller ancak niyetlere göredir; herkese niyet ettiğinin karşılığı vardır.', ravi: 'Hz. Ömer', kaynak: 'Buhârî, Bed’ü’l-vahy, 1', k: [['b', 1, 'Umar']] }],
          kavramlar: ['niyet', 'farz'],
          akilda: 'Oruç, kalpteki niyetle başlar.',
          kaynak: ['SSS, soru 6', 'İlmihal, “Niyet” ve “Niyetin Vakti”'] },

        { id: 'imsak-iftar', bolum: 'farz', ad: 'İmsak ve iftar vakti', emo: '🌅', hukum: 'farz',
          kisa: 'Oruç tan yeri ağarınca başlar, güneş batınca biter.',
          aciklama: [
              'İmsak, fecr-i sâdık denilen tan yerinin ağarmasıyla başlar; iftar vakti güneşin batmasıdır.',
              'Diyanet, imsak vaktini güneşin ufkun on sekiz derece altına yaklaştığı ana göre belirler. Sabah ezanı imsakla okunduğu için ezan başlayınca yeme içme bırakılır; ağızdaki lokmayı yutmakta sakınca yoktur.',
              'Vakitler bulunulan yere göre değişir; yolculukta da bulunulan yerin vakti esas alınır.'
          ],
          ayetler: ['2:187'],
          hadisler: [{ metin: 'Gece şu taraftan gelip gündüz şu taraftan çekilince ve güneş batınca oruçlu iftar eder.', ravi: 'Hz. Ömer', kaynak: 'Buhârî, Savm, 1954', k: [['b', 1954, 'Umar']] }],
          vakitBaglantisi: true,
          akilda: 'Tan ağarınca başlar, güneş batınca biter.',
          kaynak: ['Bakara 187', 'SSS, soru 7, 8 ve 19', 'İlmihal, “Orucun Mahiyeti ve Önemi”'] },

        // ---------------- 3. Sahur ve iftar ----------------
        { id: 'sahur', bolum: 'sahur', ad: 'Sahur', emo: '🌌', hukum: 'sunnet',
          kisa: 'Bir yudum su ile de olsa sahura kalkmak sünnettir.',
          aciklama: [
              'Sahur, imsaktan az önceki seher vaktinde yenen yemektir. Sahura kalkmak hem oruca güç verir hem de bir sünneti yerine getirir.',
              'Bir yudum su ile de olsa sahur yapmak ve sahuru imsaka yakın bir vakte bırakmak uygundur.'
          ],
          hadisler: [
              { metin: 'Sahur yapın; çünkü sahurda bereket vardır.', ravi: 'Enes b. Mâlik', kaynak: 'Buhârî, Savm, 1923; Müslim, Sıyâm, 1095', k: [['b', 1923, 'Anas'], ['m', 1095, 'Anas']] },
              { metin: 'Zeyd b. Sâbit anlatır: “Peygamberimizle sahur yaptık, sonra namaza kalktı.” Sahur ile ezan arasında ne kadar vakit olduğu sorulunca “Elli ayet okuyacak kadar” dedi.', ravi: 'Zeyd b. Sâbit', kaynak: 'Buhârî, Savm, 1921', k: [['b', 1921, 'Zaid bin Thabit']] }
          ],
          kavramlar: ['sunnet'],
          akilda: 'Sahurda bereket vardır.',
          kaynak: ['İlmihal, “Oruçlu İçin Müstehap Olan Şeyler”'] },

        { id: 'iftar', bolum: 'sahur', ad: 'İftar', emo: '🌇', hukum: 'sunnet',
          kisa: 'Vakit girince iftarı geciktirmemek sünnettir.',
          aciklama: [
              'Peygamberimiz iftarın vakit girer girmez yapılmasını teşvik etmiştir.',
              'Akşam namazı yemekten önce kılınacaksa önce bir hurma ya da biraz su ile oruç açılır, sonra namaz kılınır.',
              'İmkânı olanların, özellikle ihtiyaç sahiplerine iftar yedirmesi güzel ve sevaplı bir davranıştır.'
          ],
          hadisler: [{ metin: 'İnsanlar iftarı acele ettikçe hayır üzere olmaya devam ederler.', ravi: 'Sehl b. Sa‘d', kaynak: 'Buhârî, Savm, 1957; Müslim, Sıyâm, 1098', k: [['b', 1957, 'Sahl'], ['m', 1098, 'Sahl']] }],
          rivayetler: [{ metin: 'Peygamberimiz akşam namazından önce birkaç taze hurma ile iftar ederdi; taze hurma yoksa kuru hurma ile, o da yoksa birkaç yudum su ile iftar ederdi.', ravi: 'Enes b. Mâlik', kaynak: 'Ebû Dâvûd, Savm, 2356', k: [['d', 2356, 'Anas']], derece: { 'Al-Albani': 'Hasan Sahih' }, sihhat: 'Elbânî “hasen sahih”, Şuayb el-Arnaût “sahih” saymıştır.' }],
          kavramlar: ['sunnet'],
          akilda: 'Vakit girince iftarı geciktirme.',
          kaynak: ['İlmihal, “Oruçlu İçin Müstehap Olan Şeyler”'] },

        { id: 'iftar-duasi', bolum: 'sahur', ad: 'İftar duası', emo: '🤲', hukum: 'sunnet',
          kisa: 'Oruç açılırken dua etmek sünnettir; herkes içinden geldiği gibi dua edebilir.',
          aciklama: [
              'Oruç açılırken dua etmek sünnettir; belirli bir söz şart değildir, herkes içinden geldiği gibi şükrünü ve isteğini dile getirebilir.',
              'Peygamberimizin iftar ederken söylediği dua Ebû Dâvûd’da hasen bir senedle rivayet edilmiştir; Arapçası, okunuşu ve anlamı bu sayfadadır.',
              'Diyanet İlmihali, öteden beri yaygın olan şu duayı örnek verir: “Allah’ım! Senin rızanı kazanmak için oruç tuttum, senin verdiğin rızıkla orucumu açtım. Sana inanıp güvendim. Ey lütuf ve ikramı geniş olan Rabbim! Beni bağışla.”'
          ],
          dua: { kunye: 'd2357', okunus: 'Zehebe’z-zameü vebtelleti’l-urûku ve sebete’l-ecru inşâallah.', anlam: 'Susuzluk gitti, damarlar ıslandı; Allah dilerse sevap da kesinleşti.' },
          rivayetler: [{ metin: 'Peygamberimiz iftar ettiğinde “Susuzluk gitti, damarlar ıslandı; Allah dilerse sevap da kesinleşti” derdi.', ravi: 'Abdullah b. Ömer', kaynak: 'Ebû Dâvûd, Savm, 2357', k: [['d', 2357, 'Ibn Umar']], derece: { 'Al-Albani': 'Hasan', 'Shuaib Al Arnaut': 'Hasan' }, sihhat: 'Elbânî ve Şuayb el-Arnaût hasen saymıştır. Halk arasında bilinen “Allahümme leke sumtu…” sözleri ise Ebû Dâvûd’da (2358) mürsel olarak geçer ve zayıf sayılmıştır; anlamı güzel bir dua olarak okunabilir.' }],
          kavramlar: ['sunnet'],
          akilda: 'İftar, şükür ve dua anıdır.',
          kaynak: ['İlmihal, “Oruçlu İçin Müstehap Olan Şeyler”', 'Ebû Dâvûd, Savm, 2357–2358 (derece: hadith-api, Elbânî ve Şuayb el-Arnaût)'] },

        // ---------------- 4. Orucu bozanlar ----------------
        { id: 'bilerek-yemek', bolum: 'bozan', ad: 'Bilerek yemek, içmek', emo: '🍔', hukum: 'bozar-kefaret',
          kisa: 'Ramazan orucunu mazeretsiz ve bilerek bozmak kaza ve kefaret gerektirir.',
          aciklama: [
              'Ramazan’da oruçlu olduğunu bildiği hâlde mazeretsiz olarak yiyip içen kimsenin orucu bozulur; Hanefîlere göre kaza ile birlikte kefaret ve tövbe gerekir.',
              'Gıda ya da ilaç cinsinden bir şeyi su ile ya da susuz yutmak da böyledir. Ancak orucu bozmayı mübah kılacak bir hastalık yüzünden ilaç alınmışsa yalnız kaza gerekir.',
              'İmsak vaktinin girdiğini anladığı hâlde yemeye devam etmek de kefaret gerektirir.'
          ],
          ornek: 'Ramazan’da öğle sıcağında canı çektiği için bilerek su içmek.',
          mezhep: 'Şâfiî mezhebine göre yiyip içerek bozulan oruç için kefaret gerekmez, yalnız kaza gerekir; kefaret yalnız cinsel ilişkiyle bozulan oruçtadır.',
          kavramlar: ['haram'],
          akilda: 'Ramazan orucu bilerek bozulmaz; bozulursa kaza da kefaret de gerekir.',
          kaynak: ['SSS, soru 31 ve 58', 'İlmihal, “Kazâ ve Kefâreti Gerektiren Durumlar”', 'Bartın Müftülüğü, “Oruç Hakkında Fıkhi Bilgiler” (Şâfiî görüşü)'] },

        { id: 'cinsel-iliski', bolum: 'bozan', ad: 'Cinsel ilişki', emo: '🚫', hukum: 'bozar-kefaret',
          kisa: 'Ramazan günü oruçluyken cinsel ilişki bütün mezheplere göre kaza ve kefaret gerektirir.',
          aciklama: [
              'Ramazan günü oruçlu iken bilerek ve isteyerek cinsel ilişkide bulunmak, bütün mezheplere göre hem kaza hem kefaret gerektirir.',
              'Peygamberimiz oruç kefaretinin hükmünü böyle bir olay üzerine bildirmiştir. Gecesi ise ayetle helal kılınmıştır.'
          ],
          ayetler: ['2:187'],
          hadisler: [{ metin: 'Bir adam gelip “Mahvoldum, oruçluyken eşimle birlikte oldum” dedi. Peygamberimiz “Bir köle azat edebilir misin?”, “İki ay peş peşe oruç tutabilir misin?”, “Altmış yoksulu doyurabilir misin?” diye sordu. Adam hepsine “Hayır” deyince Peygamberimiz ona bir sepet hurma verip sadaka olarak dağıtmasını söyledi.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1936; Müslim, Sıyâm, 1111', k: [['b', 1936, 'Abu Huraira'], ['m', 1111, 'Abu Huraira']] }],
          akilda: 'Kefaretin hükmü bu olayla bildirilmiştir.',
          kaynak: ['Bakara 187', 'İlmihal, “Kazâ ve Kefâreti Gerektiren Durumlar”', 'SSS, soru 31'] },

        { id: 'sigara', bolum: 'bozan', ad: 'Sigara ve nargile', emo: '🚬', hukum: 'bozar-kefaret',
          kisa: 'Tütün dumanı yeme içme kapsamındadır; bilerek içmek orucu bozar.',
          aciklama: [
              'Sigara ve nargile gibi keyif veren tütün dumanı ile uyuşturucu ve tiryakilikle alınan her madde oruç yasakları kapsamındadır.',
              'Ramazan orucunu tutarken bilerek sigara içen kimsenin orucu bozulur; yeme içme gibi kaza ile birlikte kefaret gerekir.'
          ],
          ornek: 'Oruçluyken “bir tane bir şey olmaz” diyerek sigara yakmak.',
          akilda: 'Duman da oruç yasağına girer.',
          kaynak: ['SSS, soru 28', 'İlmihal, “Orucu Bozan Şeylerden Kaçınmak”', 'Afyonkarahisar Dinar Müftülüğü, “Ramazan Ayı ve Oruç” (kaza ve kefaret gerektiren hâller)'] },

        { id: 'su-kacmasi', bolum: 'bozan', ad: 'Boğaza su kaçması', emo: '💧', hukum: 'bozar-kaza',
          kisa: 'Oruçlu olduğunu bilirken istemeden su kaçarsa oruç bozulur, kaza gerekir.',
          aciklama: [
              'Abdest alırken, yıkanırken ya da yüzerken oruçlu olduğu aklındayken istemeden boğaza su kaçarsa oruç bozulur ve yalnız kaza gerekir; buna hata denir.',
              'Oruçlu olduğu aklında değilken su kaçarsa bu unutma hükmündedir ve oruç bozulmaz.'
          ],
          ornek: 'Abdest alırken ağzını çalkalarken boğazına su kaçtı.',
          mezhep: 'Şâfiî mezhebine göre orucu bozma kastı olmadığı için yanlışlıkla boğaza su kaçması orucu bozmaz.',
          akilda: 'İstemeden kaçan su: kaza var, kefaret yok.',
          kaynak: ['SSS, soru 20 ve 29', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'kasten-kusmak', bolum: 'bozan', ad: 'Kasten kusmak', emo: '🤢', hukum: 'bozar-kaza',
          kisa: 'Kendi isteğiyle ağız dolusu kusmak orucu bozar.',
          aciklama: [
              'Kişinin kendi isteğiyle ağız dolusu kusması orucu bozar ve kaza gerektirir.',
              'Kustuğu için orucunun bozulduğunu sanıp yemeye devam eden kimsenin de orucu bozulur; ona kefaret değil, kaza gerekir.'
          ],
          ornek: 'Midesi rahatlasın diye parmağıyla kendini kusturmak.',
          akilda: 'İstemeden kusmak bozmaz, kasten kusmak bozar.',
          kaynak: ['SSS, soru 34', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'vakit-yanilmasi', bolum: 'bozan', ad: 'Vakitte yanılmak', emo: '⏰', hukum: 'bozar-kaza',
          kisa: 'İmsak girmişken ya da güneş batmadan yemek, yanılarak da olsa orucu bozar.',
          aciklama: [
              'İmsak vaktinin girip girmediğinden şüphe ederek yemeye devam eden kimse, o sırada imsakın girmiş olduğunu anlarsa orucu bozulur ve kaza gerekir.',
              'Güneşin battığını sanarak iftar eden kimse, güneşin henüz batmadığını anlarsa yine kaza gerekir. Bu yüzden güneşin battığından emin olmadan iftar edilmemelidir.'
          ],
          ornek: 'Bulutlu bir günde akşam oldu sanıp iftar etmek, sonra güneşin batmadığını görmek.',
          vakitBaglantisi: true,
          akilda: 'Şüphede iftar edilmez; vakti takvimden bil.',
          kaynak: ['SSS, soru 29', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'mutat-olmayan', bolum: 'bozan', ad: 'Yenmesi alışılmamış şeyler', emo: '🌾',
          hukum: 'bozar-kaza',
          kisa: 'Çiğ pirinç, un, toprak gibi şeyleri yutmak orucu bozar; yalnız kaza gerekir.',
          aciklama: [
              'Beslenme amacı taşımayan, yenip içilmesi alışılmış olmayan ya da insanın yemek istemeyeceği şeyleri yutmak orucu bozar; bunlar için kefaret değil, yalnız kaza gerekir.',
              'Çiğ pirinç, çiğ hamur, un, ham meyve ya da toprak yemek, fındığı veya cevizi kabuğuyla yutmak bu türdendir.'
          ],
          ornek: 'Oruçluyken avucundaki çiğ pirinçten birkaç tane yutmak.',
          akilda: 'Mideye giden her şey orucu bozar; kefaret yemek ve içmek içindir.',
          kaynak: ['SSS, soru 29', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'hayiz-nifas', bolum: 'bozan', ad: 'Âdet ve lohusalık', emo: '🌸', hukum: 'bozar-kaza',
          kisa: 'Âdet ya da lohusalık başlayınca oruç bozulur; temizlenince kaza edilir.',
          aciklama: [
              'Âdet ve lohusalık hâlindeki kadın oruç tutmaz, tutsa da geçerli olmaz; temizlendikten sonra tutamadığı günleri kaza eder. Kılamadığı namazları ise kaza etmez.',
              'Oruca niyet eden kadının gün içinde âdeti başlarsa orucu bozulur; o günü de sonra kaza eder. Ramazan’a saygı için başkalarının yanında yiyip içmemesi uygun olur.'
          ],
          hadisler: [{ metin: 'Hz. Âişe’ye âdet gören kadının neden orucu kaza edip namazı kaza etmediği soruldu. O şöyle dedi: “Biz bu hâli yaşardık; orucu kaza etmekle emrolunurduk, namazı kaza etmekle emrolunmazdık.”', ravi: 'Hz. Âişe', kaynak: 'Müslim, Hayz, 335', k: [['m', 335, "A'isha"]] }],
          akilda: 'Oruç kaza edilir, namaz kaza edilmez.',
          kaynak: ['SSS, soru 60 ve 62', 'İlmihal, “Geçerlilik Şartları”'] },

        // ---------------- 5. Orucu bozmayanlar ----------------
        { id: 'unutarak', bolum: 'bozmayan', ad: 'Unutarak yemek, içmek', emo: '😊', hukum: 'bozmaz',
          kisa: 'Oruçlu olduğunu unutup yiyen içen orucuna devam eder.',
          aciklama: [
              'Oruçlu olduğunu unutarak yiyip içmek orucu bozmaz. Hatırlayınca hemen ağzındakini çıkarır, ağzını yıkar ve orucuna devam eder.',
              'Hatırladıktan sonra mideye bir şey inerse oruç bozulur. Unutarak yedikten sonra “Orucum bozuldu” sanıp yemeye devam eden kimseye de kaza gerekir.'
          ],
          ornek: 'Oruçlu olduğunu unutup mutfakta bir bardak su içmek.',
          hadisler: [{ metin: 'Oruçlu olduğunu unutarak yiyen ya da içen orucunu tamamlasın; çünkü onu Allah yedirmiş, içirmiştir.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1933; Müslim, Sıyâm, 1155', k: [['b', 1933, 'Abu Huraira'], ['m', 1155, 'Abu Huraira']] }],
          akilda: 'Unutarak yiyeni Allah doyurmuştur.',
          kaynak: ['SSS, soru 29 ve 32', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'kendiliginden-kusmak', bolum: 'bozmayan', ad: 'Kendiliğinden kusmak', emo: '🤧', hukum: 'bozmaz',
          kisa: 'İstemeden gelen kusuntu, ne kadar olursa olsun orucu bozmaz.',
          aciklama: [
              'Miktarı ne olursa olsun kendiliğinden gelen kusuntu orucu bozmaz.',
              'Mideden ansızın ağza gelip geri dönen şeyler de oruca zarar vermez.'
          ],
          ornek: 'Yolda midesi bulanıp istemeden kusmak.',
          akilda: 'Elinde olmayan şey orucunu bozmaz.',
          kaynak: ['SSS, soru 34', 'İlmihal, “Sadece Kazâyı Gerektiren Durumlar”'] },

        { id: 'dis-fircalamak', bolum: 'bozmayan', ad: 'Diş fırçalamak', emo: '🪥', hukum: 'bozmaz',
          kisa: 'Diş fırçalamak orucu bozmaz; macun ya da su boğaza kaçarsa bozar.',
          aciklama: [
              'Boğaza su kaçırmadan ağzı çalkalamak gibi diş fırçalamak da orucu bozmaz; ağız ve diş temizliği aksatılmamalıdır.',
              'Diş macunu ya da su boğaza kaçarsa oruç bozulur. Bu yüzden dişleri imsaktan önce ve iftardan sonra fırçalamak, oruçluyken fırçalanacaksa macun kullanmamak uygun olur.'
          ],
          ornek: 'Öğle vakti dişlerini macunsuz fırçalamak ve suyu yutmamak.',
          akilda: 'Fırça bozmaz; yutulan macun bozar.',
          kaynak: ['SSS, soru 33', 'İlmihal, “Orucun Mekruhları”'] },

        { id: 'igne-asi', bolum: 'bozmayan', ad: 'İğne ve aşı', emo: '💉', hukum: 'bozmaz', saglik: true,
          kisa: 'Gıda ve keyif verici olmayan iğneler ve aşılar orucu bozmaz.',
          aciklama: [
              'Tedavi ya da aşı amacıyla yapılan, gıda ve keyif verici olmayan iğneler orucu bozmaz; şeker hastalarının insülin iğnesi de bu türdendir.',
              'Gıda ve vitamin iğneleri, damardan serum ve vücuda kan verilmesi (kan nakli) ise orucu bozar; o gün kaza edilir. Ağızdan alınan aşı da orucu bozar.',
              'Tedavisi süren hasta, iyileşene kadar orucunu erteleyebilir; oruç tutmak isterse iğnesini iftardan sonra yaptırması yerinde olur.'
          ],
          ornek: 'Oruçluyken kas içine ağrı kesici iğne ya da grip aşısı yaptırmak.',
          akilda: 'Besleyen iğne bozar, tedavi eden iğne bozmaz.',
          kaynak: ['SSS, soru 49 ve 50', 'DİYK kararı, 22.09.2005, sayı 155: “Orucu Bozan ve Bozmayan Muayene ve Tedavi Yöntemleri”'] },

        { id: 'astim-spreyi', bolum: 'bozmayan', ad: 'Astım spreyi', emo: '🫁', hukum: 'bozmaz', saglik: true,
          kisa: 'Nefes açıcı sprey orucu bozmaz.',
          aciklama: [
              'Nefes darlığı dışında oruca engel bir sağlık sorunu olmayan astım hastası, nefesini rahatlatan spreyi ağzına püskürterek oruç tutabilir; bu sprey orucu bozmaz.',
              'Bir kullanımda çok az ilaç ağza girer, büyük kısmı ağızda ve nefes yollarında emilir; mideye bir şey ulaşıp ulaşmadığı şüphelidir ve kesin olan şüpheyle bozulmaz.',
              'Spreye sürekli muhtaç olup oruç tutamayan hasta iyileşince kaza eder; iyileşme ümidi yoksa her gün için fidye verir.'
          ],
          ornek: 'Gün içinde nefesi daralınca astım spreyini kullanmak.',
          akilda: 'Nefes açan sprey orucu bozmaz.',
          kaynak: ['SSS, soru 37', 'DİYK kararı, 22.09.2005, sayı 155'] },

        { id: 'damlalar', bolum: 'bozmayan', ad: 'Göz, kulak ve burun damlası', emo: '👁️', hukum: 'bozmaz', saglik: true,
          kisa: 'Tedavi için damlatılan göz, kulak ve burun damlası orucu bozmaz.',
          aciklama: [
              'Göz damlası çok az miktardadır ve beslenme anlamı taşımaz; orucu bozmaz.',
              'Kulak zarı ilacın boğaza geçmesine engel olduğundan kulak damlası da orucu bozmaz. Kulak yıkatmak da bozmaz; ancak kulak zarı delikse ve su mideye ulaşırsa oruç bozulur.',
              'Burun damlasının çok azı mideye ulaşır ve bu, orucu bozacak düzeyde görülmemiştir.'
          ],
          ornek: 'Gözü kızardığı için doktorun verdiği damlayı oruçluyken kullanmak.',
          akilda: 'Tedavi için bir damla, orucu bozmaz.',
          kaynak: ['SSS, soru 38, 39, 40 ve 41', 'DİYK kararı, 22.09.2005, sayı 155'] },

        { id: 'dis-tedavisi', bolum: 'bozmayan', ad: 'Diş tedavisi', emo: '🦷', hukum: 'bozmaz', saglik: true,
          kisa: 'Diş tedavisi ve uyuşturma iğnesi orucu bozmaz.',
          aciklama: [
              'Yalnızca diş tedavisi sebebiyle oruç bozulmaz; tedavinin ağrısız olması için yapılan uyuşturma iğnesi de beslenme amacı taşımadığı için bozmaz.',
              'Tedavi sırasında boğaza su, kan ya da tedavide kullanılan bir madde kaçarsa oruç bozulur ve kaza gerekir.',
              'Diş kanaması orucu bozmaz; ancak kan, karıştığı tükürüğe eşit ya da ondan fazlaysa ve yutulursa oruç bozulur.'
          ],
          ornek: 'Oruçluyken dişçide dolgu yaptırmak ve boğaza bir şey kaçırmamak.',
          akilda: 'Dişçi koltuğu bozmaz, boğaza kaçan bozar.',
          kaynak: ['SSS, soru 56 ve 57'] },

        { id: 'kan-vermek', bolum: 'bozmayan', ad: 'Kan tahlili ve kan vermek', emo: '🩸', hukum: 'bozmaz', saglik: true,
          kisa: 'Tahlil için ya da bağış için kan vermek orucu bozmaz.',
          aciklama: [
              'Oruçluyken kan vermek orucu bozmaz; tahlil için kan ya da doku (biyopsi) aldırmak da bozmaz.',
              'Vücuda kan almak, yani kan nakli ise beslenme kapsamına girdiği için orucu bozar.',
              'Oruçluyu güçsüz düşürecek kadar kan aldırmak, orucu bozmasa da mekruh sayılmıştır.'
          ],
          ornek: 'Sabah aç karnına kan tahlili için kan verdirmek.',
          hadisler: [{ metin: 'Peygamberimiz ihramlıyken de oruçluyken de hacamat olup kan aldırmıştır.', ravi: 'İbn Abbâs', kaynak: 'Buhârî, Savm, 1938', k: [['b', 1938, 'Abbas']] }],
          akilda: 'Kan vermek bozmaz, kan almak bozar.',
          kaynak: ['SSS, soru 45 ve 51', 'DİYK kararı, 22.09.2005, sayı 155', 'İlmihal, “Orucun Mekruhları”'] },

        { id: 'cunup-sabahlamak', bolum: 'bozmayan', ad: 'Cünüp sabahlamak', emo: '🚿', hukum: 'bozmaz',
          kisa: 'Cünüp olmak oruca engel değildir; ihtilam da orucu bozmaz.',
          aciklama: [
              'Cünüplük oruç tutmaya engel değildir; cünüplük oruçtan önce olmuş olsun ya da oruçluyken ihtilam gibi orucu bozmayan bir sebeple olsun, oruç geçerlidir.',
              'Cünüp olan kimse bir an önce yıkanmalı; üzerinden bir namaz vakti geçirmemelidir.'
          ],
          ornek: 'Sahurdan sonra uyuyup cünüp olarak uyanmak.',
          hadisler: [{ metin: 'Hz. Âişe ve Ümmü Seleme anlatır: Peygamberimiz bazen eşleriyle birlikte olduktan sonra cünüp olarak sabahlar, sonra yıkanır ve oruç tutardı.', ravi: 'Hz. Âişe ve Ümmü Seleme', kaynak: 'Buhârî, Savm, 1925–1926', k: [['b', 1925, 'Aisha'], ['b', 1926, 'Salama']] }],
          akilda: 'Cünüplük oruca engel değil, namaza engeldir; hemen yıkan.',
          kaynak: ['SSS, soru 22', 'İlmihal, “Oruçlu İçin Müstehap Olan Şeyler”'] },

        { id: 'yikanmak', bolum: 'bozmayan', ad: 'Yıkanmak ve yüzmek', emo: '🏊', hukum: 'bozmaz',
          kisa: 'Ağız ve burundan su kaçırmamak şartıyla yıkanmak orucu bozmaz.',
          aciklama: [
              'Ağız ve burundan su girip mideye ulaşmadıkça yıkanmak orucu bozmaz; denize girmek de bu şartla orucu bozmaz.',
              'Yüzerken dalgayla su yutma ihtimali yüksek olduğu için oruçluyken denize girmekten kaçınmak daha ihtiyatlıdır.'
          ],
          ornek: 'İkindi vakti duş almak, ağzına ve burnuna su kaçırmamak.',
          akilda: 'Su tende kalırsa bozmaz, mideye inerse bozar.',
          kaynak: ['SSS, soru 21'] },

        // ---------------- 6. Mekruh olanlar ----------------
        { id: 'tatmak', bolum: 'mekruh', ad: 'Tatmak ve çiğnemek', emo: '🥄', hukum: 'mekruh',
          kisa: 'Bir şeyi tatmak ya da çiğnemek mekruhtur; yutulma tehlikesi vardır.',
          aciklama: [
              'Oruçluyken bir şeyi tatmak ya da çiğnemek mekruhtur; çünkü ağza alınan şeyin yutulma tehlikesi vardır.',
              'Tadılan ya da çiğnenen şeyden boğaza bir şey inerse oruç bozulur.'
          ],
          ornek: 'Pişen yemeğin tuzuna bakmak için kaşıkla tatmak.',
          kavramlar: ['mekruh-tenzihen'],
          akilda: 'Ağza alma ki boğaza kaçmasın.',
          kaynak: ['İlmihal, “Orucun Mekruhları”'] },

        { id: 'gucsuz-dusurmek', bolum: 'mekruh', ad: 'Güçsüz düşüren işler', emo: '🥱', hukum: 'mekruh',
          kisa: 'Orucu bozmasa da oruçluyu güçsüz düşüren şeyler mekruhtur.',
          aciklama: [
              'Orucu bozmamakla birlikte oruçlunun direncini kıran ve onu güçsüz düşüren, çok kan aldırmak gibi şeyler mekruhtur.',
              'Yalnızca serinlemek için yıkanmak da oruç anlayışına uymadığı gerekçesiyle mekruh sayılmıştır; temizlik ya da gusül için yıkanmak ise mekruh değildir.'
          ],
          ornek: 'Oruçluyken halsiz bırakacak kadar çok kan aldırmak.',
          kavramlar: ['mekruh-tenzihen'],
          akilda: 'Orucu koru, kendini de yorma.',
          kaynak: ['İlmihal, “Orucun Mekruhları”'] },

        // ---------------- 7. Ruhsatlar ----------------
        { id: 'yolcu', bolum: 'ruhsat', ad: 'Yolcu', emo: '🧳', hukum: 'ruhsat',
          kisa: 'En az doksan kilometrelik yolculukta oruç tutmamaya ruhsat vardır.',
          aciklama: [
              'Ramazan’da sefer mesafesi olan en az doksan kilometrelik bir yere gidecek kimse geceden oruca niyet etmeyebilir; tutamadığı günleri sonra kaza eder.',
              'Niyet ettikten sonra gündüz yola çıkan kimse başka bir mazereti yoksa orucunu bozmamalıdır; bozarsa kefaret değil, yalnız kaza gerekir.',
              'Yolculukta bir sıkıntı çekmeyen ve zarar görmeyecek olanın oruç tutması daha faziletlidir. Sürekli yola giden kaptan ve şoförler de yolcu hükmündedir.'
          ],
          mezhep: 'Şâfiî ve Hanbelî mezheplerine göre geceden niyet edilmiş oruç da yolculuk sırasında bozulabilir.',
          ayetler: ['2:185'],
          hadisler: [{ metin: 'Çok oruç tutan Hamza b. Amr el-Eslemî, yolculukta oruç tutup tutmayacağını sordu. Peygamberimiz “Dilersen tut, dilersen tutma” buyurdu.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Savm, 1943; Müslim, Sıyâm, 1121', k: [['b', 1943, 'Aisha'], ['m', 1121, "A'isha"]] }],
          kavramlar: ['ruhsat'],
          akilda: 'Yolculuk ruhsattır; kolaysa tutmak daha faziletlidir.',
          kaynak: ['Bakara 185', 'SSS, soru 3, 18 ve 30', 'İlmihal, “Oruç Tutmamayı Mubah Kılan Mazeretler”'] },

        { id: 'hasta', bolum: 'ruhsat', ad: 'Hasta', emo: '🤒', hukum: 'ruhsat', saglik: true,
          kisa: 'Oruç hastalığını artıracak ya da uzatacak kimse tutmayabilir.',
          aciklama: [
              'Oruç tuttuğunda hastalığının artmasından ya da uzamasından endişe eden, ya da hastalığı yüzünden oruçta zorlanan kimse oruç tutmayabilir; başladığı orucu da bozabilir. Oruç tutarsa hasta olacağını doktorun bildirdiği kimse de hasta hükmündedir.',
              'Hastalık geçiciyse iyileşince tutamadığı günleri kaza eder; kalıcıysa her gün için fidye verir.',
              'Açlık ya da susuzluktan sağlığı ciddi zarar görecek kimse orucunu bozabilir; ölüm tehlikesi açıksa oruca devam etmesi haram olur.'
          ],
          ayetler: ['2:185'],
          kavramlar: ['ruhsat', 'zaruret'],
          akilda: 'Allah kolaylık ister, zorluk istemez.',
          kaynak: ['Bakara 185', 'SSS, soru 3, 35, 36 ve 43', 'İlmihal, “Oruç Tutmamayı Mubah Kılan Mazeretler”'] },

        { id: 'hamile-emzikli', bolum: 'ruhsat', ad: 'Hamile ve emzikli', emo: '🤰', hukum: 'ruhsat', saglik: true,
          kisa: 'Kendisine ya da çocuğuna zarar gelmesinden korkan tutmayabilir; sonra kaza eder.',
          aciklama: [
              'Hamile ya da emzikli kadın, oruç tutarsa kendisine ya da çocuğuna zarar gelmesinden korkarsa oruç tutmayabilir; zarar ihtimali kuvvetliyse tutmaması gerekir.',
              'Kendisi dayanabilecek ve çocuk etkilenmeyecekse oruç tutabilir; bu konuda uzman bir hekime danışmak uygun olur.',
              'Tutamadığı oruçları, durumu elverişli olunca kaza eder.'
          ],
          kavramlar: ['ruhsat'],
          akilda: 'Anne ve bebeğin sağlığı önce gelir; oruç sonra kaza edilir.',
          kaynak: ['SSS, soru 3 ve 64', 'İlmihal, “Oruç Tutmamayı Mubah Kılan Mazeretler”'] },

        { id: 'yasli', bolum: 'ruhsat', ad: 'Yaşlı', emo: '🧓', hukum: 'ruhsat',
          kisa: 'Oruca gücü yetmeyen yaşlı tutmaz; her gün için fidye verir.',
          aciklama: [
              'Oruç tutamayacak kadar yaşlı olan kimse oruç tutmaz; tutamadığı her gün için bir fidye verir. İyileşme ümidi olmayan hasta da bu hükümdedir.',
              'Uzun günlerde tutamayıp kısa günlerde tutabilen kimse fidye vermez, kısa günlerde kaza eder.',
              'Fidye verecek gücü olmayan kimse Allah’tan af diler; kimse gücünün üstünde bir şeyle yükümlü değildir.'
          ],
          ayetler: ['2:183-184'],
          kavramlar: ['ruhsat', 'guc'],
          akilda: 'Gücü yetmeyene fidye, gücü yetene oruç.',
          kaynak: ['Bakara 184', 'SSS, soru 3, 5 ve 27', 'İlmihal, “Fidye”'] },

        { id: 'cocuk', bolum: 'ruhsat', ad: 'Çocuk ve oruç', emo: '🧒',
          kisa: 'Ergenlik çağına girmemiş çocuğa oruç farz değildir; oruca alıştırılır.',
          aciklama: [
              'Ergenlik çağına girmemiş çocuk ibadetlerle yükümlü değildir; oruç ona farz değildir.',
              'Çocuğu oruca ısındırmak için ara ara oruç tutmaya teşvik etmek güzeldir. Diyanet İlmihali, bedeni elverdiği ölçüde çocuğun sekiz dokuz yaşından itibaren oruca alıştırılmasını uygun görür.',
              'Çocuk henüz yükümlü olmadığı için tuttuğu oruç onun için güzel bir alıştırmadır; zorlanıp tamamlayamazsa günah işlemiş olmaz.'
          ],
          hadisler: [{ metin: 'Rubeyyi‘ binti Muavviz anlatır: Aşure günü biz oruç tutar, çocuklarımıza da oruç tuttururduk. Onlara yünden oyuncaklar yapardık; biri yemek için ağlarsa iftar vaktine kadar o oyuncağı verirdik.', ravi: 'Rubeyyi‘ binti Muavviz', kaynak: 'Buhârî, Savm, 1960', k: [['b', 1960, 'Rubai']] }],
          kavramlar: ['guc'],
          akilda: 'Çocuk için oruç bir borç değil, güzel bir alıştırmadır.',
          kaynak: ['SSS, soru 1', 'İlmihal, “Yükümlülük Şartları”'] },

        // ---------------- 8. Kaza, kefaret, fidye ----------------
        { id: 'kaza', bolum: 'telafi', ad: 'Kaza orucu', emo: '🔁', hukum: 'farz',
          kisa: 'Tutulamayan her Ramazan günü için bir gün oruç tutulur.',
          aciklama: [
              'Ramazan’da tutulamayan ya da başlanıp bozulan her gün için sonra bir gün oruç tutulur; buna kaza denir ve kaza etmek de farzdır.',
              'Kaza oruçlarının peş peşe tutulması gerekmez; bayram günleri dışında her zaman tutulabilir. Kişi ne zaman öleceğini bilmediği için geciktirmemek uygun olur.',
              'Çok sayıda kaza borcu olan “Üzerimde borç olan ilk orucun kazasına” diye niyet edebilir. Şevval’de kazaya niyetle tutulan oruç kaza yerine geçer.'
          ],
          mezhep: 'Şâfiî mezhebine göre kaza bir sonraki Ramazan’a kadar tutulmalıdır; tutulmazsa kazaya ek olarak fidye de gerekir.',
          ayetler: ['2:183-184'],
          kavramlar: ['farz'],
          akilda: 'Bir güne bir gün; ne kadar erken, o kadar iyi.',
          kaynak: ['Bakara 184', 'SSS, soru 12, 13 ve 15', 'İlmihal, “Ramazan Orucunun Kazâsı”'] },

        { id: 'kefaret', bolum: 'telafi', ad: 'Oruç kefareti', emo: '⚖️',
          kisa: 'Altmış gün ara vermeden oruç; gücü yetmeyene altmış yoksulu doyurmak.',
          aciklama: [
              'Oruç kefareti, Ramazan orucunu mazeretsiz ve bilerek bozan kimsenin yerine getirmesi gereken telafidir.',
              'Kefaret, iki kamerî ay ya da altmış gün ara vermeden oruç tutmaktır; buna gücü yetmeyen altmış yoksulu bir gün ya da bir yoksulu altmış gün doyurur. Hanefîlere göre bu sıraya uyulur.',
              'Kefaretin yanında bozulan günün kazası ve tövbe de gerekir. Kadının âdet ve lohusalık hâli kefaret orucunun ardı ardınalığını bozmaz; temizlenince kaldığı yerden devam eder.',
              'Aynı Ramazan’da birden fazla gün bozulmuşsa bir kefaret yeterli görülmüştür.'
          ],
          hadisler: [{ metin: 'Ramazan’da orucunu bozan adama Peygamberimiz sırasıyla köle azat etmeyi, iki ay peş peşe oruç tutmayı ve altmış yoksulu doyurmayı sordu.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1936; Müslim, Sıyâm, 1111', k: [['b', 1936, 'Abu Huraira'], ['m', 1111, 'Abu Huraira']] }],
          akilda: 'Kefaret: altmış gün oruç ya da altmış yoksula yemek.',
          kaynak: ['SSS, soru 31', 'İlmihal, “Kefâret Orucu”'] },

        { id: 'fidye', bolum: 'telafi', ad: 'Oruç fidyesi', emo: '🍞', deger: 'fidye',
          kisa: 'Oruca hiç gücü yetmeyen yaşlı ve iyileşmeyecek hastanın her gün için verdiği bedel.',
          aciklama: [
              'Fidye, oruç tutmaya gücü yetmeyen yaşlılar ile iyileşme ümidi olmayan hastaların tutamadıkları her gün için verdikleri bedeldir. Bir günün fidyesi bir fıtır sadakası kadardır, yani bir kişiyi bir gün doyuracak yiyecek ya da bunun parasıdır.',
              'Fidye Ramazan’ın başında, içinde ya da sonunda verilebilir; hepsi bir yoksula topluca ya da ayrı ayrı yoksullara verilebilir. Kişinin anne babası, dede ve ninesi, çocukları ve torunları ile eşine verilmez.',
              'Gücü yettiği hâlde oruç tutmayan ya da geçici bir mazeretle tutamayan kimse için fidye yoktur; o, orucunu kaza eder. Fidye veren kimse sonradan oruç tutabilecek duruma gelirse Hanefîlere göre tutamadığı oruçları kaza eder ve verdiği fidye sadaka sayılır.',
              'Fidye verecek gücü olmayan kimse Allah’tan bağışlanma diler.'
          ],
          ayetler: ['2:183-184'],
          akilda: 'Fidye, oruca gücü hiç yetmeyenin kolaylığıdır.',
          kaynak: ['Bakara 184', 'SSS, soru 5, 24, 25, 26 ve 27', 'İlmihal, “Fidye”', 'DİYK, 2026 yılı fitre miktarı kararı (07.01.2026)'] },

        // ---------------- 9. Nafile oruçlar ----------------
        { id: 'sevval', bolum: 'nafile', ad: 'Şevval’de altı gün', emo: '6️⃣', hukum: 'sunnet',
          kisa: 'Ramazan’dan sonra Şevval’de altı gün oruç tutmak müstehaptır.',
          aciklama: [
              'Ramazan’dan sonra Şevval ayında altı gün oruç tutmak müstehaptır; bu günler peş peşe ya da ara verilerek tutulabilir.',
              'Şevval’de nafile olarak tutulan oruç Ramazan’ın kazası yerine geçmez; kazaya niyet edilirse kaza orucu olur. Bir oruçta hem kazaya hem nafileye niyet edilmez.',
              'Bayramın birinci gününde oruç tutulmaz.'
          ],
          hadisler: [{ metin: 'Kim Ramazan orucunu tutar, ardından ona Şevval’den altı gün eklerse bütün yılı oruçlu geçirmiş gibi olur.', ravi: 'Ebû Eyyûb el-Ensârî', kaynak: 'Müslim, Sıyâm, 1164', k: [['m', 1164, 'Abu Ayyub']] }],
          kavramlar: ['mustehab'],
          akilda: 'Ramazan’ın ardından altı gün: bütün yıl gibi.',
          kaynak: ['SSS, soru 15', 'İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        { id: 'arefe', bolum: 'nafile', ad: 'Arefe günü', emo: '⛰️', hukum: 'sunnet',
          kisa: 'Zilhicce’nin dokuzuncu günü tutulan oruç çok faziletlidir.',
          aciklama: [
              'Kurban Bayramı’ndan önceki gün olan Zilhicce’nin dokuzuncu günü Arefe günüdür; bu günde oruç tutmak tavsiye edilmiştir.',
              'Zilhicce’nin ilk dokuz gününü oruçlu geçirmek de müstehaptır.',
              'Hacda bulunanların ise güçsüz düşmemek için Arefe günü oruç tutmamaları uygun görülmüştür.'
          ],
          hadisler: [{ metin: 'Arefe günü orucunun önceki ve sonraki birer yılın günahlarına kefaret olmasını Allah’tan umarım.', ravi: 'Ebû Katâde', kaynak: 'Müslim, Sıyâm, 1162', k: [['m', 1162, 'Abu Qatada']] }],
          kavramlar: ['mustehab'],
          akilda: 'Bir günlük oruç, iki yıllık umut.',
          kaynak: ['İlmihal, “Oruç Tutmanın Mendup Olduğu Günler” (Zilhicce orucu) ve “Oruç Tutmanın Yasak Olduğu Günler”'] },

        { id: 'asure', bolum: 'nafile', ad: 'Aşure günü', emo: '🌊', hukum: 'sunnet',
          kisa: 'Muharrem’in onuncu günü; bir gün öncesi ya da sonrasıyla birlikte tutulur.',
          aciklama: [
              'Muharrem ayının onuncu günü Aşure günüdür; Peygamberimiz bu günde oruç tutmayı tavsiye etmiştir.',
              'Yahudiler yalnızca onuncu günü oruç tuttuğu için onlara benzememek amacıyla bir gün öncesi ya da sonrasıyla birlikte, yani dokuz ve on ya da on ve on bir Muharrem tutulması uygundur.'
          ],
          hadisler: [
              { metin: 'Peygamberimiz Medine’ye geldiğinde Yahudilerin Aşure günü oruç tuttuğunu gördü. “Allah’ın Mûsâ’yı düşmanından kurtardığı gündür” dediler. Peygamberimiz “Mûsâ’ya ben sizden daha yakınım” buyurdu, o gün oruç tuttu ve tutulmasını emretti.', ravi: 'İbn Abbâs', kaynak: 'Buhârî, Savm, 2004', k: [['b', 2004, 'Abbas']] },
              { metin: 'Gelecek yıla yetişirsem dokuzuncu günü de mutlaka oruç tutacağım.', ravi: 'İbn Abbâs', kaynak: 'Müslim, Sıyâm, 1134', k: [['m', 1134, 'Abbas']] },
              { metin: 'Aşure günü orucunun önceki yılın günahlarına kefaret olmasını Allah’tan umarım.', ravi: 'Ebû Katâde', kaynak: 'Müslim, Sıyâm, 1162', k: [['m', 1162, 'Abu Qatada']] }
          ],
          kavramlar: ['mustehab'],
          akilda: 'Aşure tek başına değil, yanına bir gün eklenerek tutulur.',
          kaynak: ['SSS, soru 16', 'İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        { id: 'uc-gun', bolum: 'nafile', ad: 'Her ay üç gün', emo: '🌕', hukum: 'sunnet',
          kisa: 'Her ay üç gün, özellikle ayın on üç, on dört ve on beşinci günleri.',
          aciklama: [
              'Her aydan üç gün oruç tutmak müstehaptır; bunu kamerî ayın on üç, on dört ve on beşinci günlerinde yapmak ayrıca tavsiye edilmiştir. Bu günlere eyyâm-ı bîz denir.',
              'İyiliğe on kat karşılık verildiği için her ay üç gün oruç bütün yıl oruç tutmak gibi sayılmıştır.'
          ],
          hadisler: [{ metin: 'Dostum Peygamberimiz bana üç şeyi tavsiye etti: Her ay üç gün oruç tutmayı, iki rekât kuşluk namazını ve uyumadan önce vitir kılmayı.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1981', k: [['b', 1981, 'Abu Huraira']] }],
          rivayetler: [{ metin: 'Ey Ebû Zer! Her aydan üç gün oruç tutacaksan on üç, on dört ve on beşinci günleri tut.', ravi: 'Ebû Zer', kaynak: 'Tirmizî, Savm, 761', k: [['t', 761, 'Abu Dharr']], derece: { 'Al-Albani': 'Hasan Sahih' }, sihhat: 'Elbânî ve Ahmed Şâkir “hasen sahih” saymıştır.' }],
          kavramlar: ['mustehab'],
          akilda: 'Ayın dolunay günleri, orucun da güzel günleridir.',
          kaynak: ['Buhârî, Savm, 1976 (her ay üç gün, bütün yıl gibi)', 'İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        { id: 'pazartesi-persembe', bolum: 'nafile', ad: 'Pazartesi ve perşembe', emo: '📅', hukum: 'sunnet',
          kisa: 'Her hafta pazartesi ve perşembe oruç tutmak teşvik edilmiştir.',
          aciklama: [
              'Her hafta pazartesi ve perşembe günleri oruç tutmak teşvik edilmiş bir nafiledir.',
              'Peygamberimiz pazartesinin doğduğu ve kendisine vahyin geldiği gün olduğunu söylemiş; amellerin pazartesi ve perşembe günleri Allah’a sunulduğunu, amelinin oruçluyken sunulmasını sevdiğini bildirmiştir.'
          ],
          hadisler: [{ metin: 'Peygamberimize pazartesi orucu soruldu. “O gün doğdum ve o gün bana vahiy indirildi” buyurdu.', ravi: 'Ebû Katâde', kaynak: 'Müslim, Sıyâm, 1162', k: [['m', 1162, 'Abu Qatada']] }],
          rivayetler: [{ metin: 'Ameller pazartesi ve perşembe günleri Allah’a sunulur; amelimin oruçluyken sunulmasını severim.', ravi: 'Ebû Hüreyre', kaynak: 'Tirmizî, Savm, 747', k: [['t', 747, 'Abu Hurairah']], derece: { 'Al-Albani': 'Sahih' }, sihhat: 'Elbânî ve Ahmed Şâkir sahih saymıştır.' }],
          kavramlar: ['mustehab'],
          akilda: 'Haftada iki gün, amelin oruçla sunulsun.',
          kaynak: ['İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        { id: 'davud-orucu', bolum: 'nafile', ad: 'Dâvûd orucu', emo: '🔀', hukum: 'sunnet',
          kisa: 'Bir gün oruç tutup bir gün tutmamak, en faziletli nafile oruçtur.',
          aciklama: [
              'Gün aşırı oruç tutmak, yani bir gün tutup ertesi gün tutmamak Peygamberimiz tarafından Dâvûd aleyhisselamın orucu olarak anılmış ve en faziletli oruç olarak bildirilmiştir.',
              'Peygamberimiz bundan daha faziletli bir oruç olmadığını bildirmiş ve daha fazlasını tutmaya çalışmamayı tavsiye etmiştir.'
          ],
          hadisler: [{ metin: 'Bir gün oruç tut, bir gün tutma. Bu, Dâvûd peygamberin orucudur ve oruçların en faziletlisidir. Bundan daha faziletlisi yoktur.', ravi: 'Abdullah b. Amr', kaynak: 'Buhârî, Savm, 1976', k: [['b', 1976, 'Abdullah bin `Amr']] }],
          kavramlar: ['mustehab'],
          akilda: 'İbadette de ölçü: bir gün tut, bir gün dinlen.',
          kaynak: ['İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        { id: 'muharrem-saban', bolum: 'nafile', ad: 'Muharrem ve Şaban', emo: '🗓️', hukum: 'sunnet',
          kisa: 'Muharrem ve Şaban, nafile orucun çok tutulduğu aylardır.',
          aciklama: [
              'Ramazan’dan sonra en faziletli oruç, Allah’ın ayı denilen Muharrem’de tutulan oruçtur.',
              'Peygamberimiz Ramazan dışında en çok Şaban ayında oruç tutmuştur; fakat Ramazan’dan başka hiçbir ayın tamamını oruçlu geçirmemiştir. Bu yüzden üç ayları aralıksız oruçla geçirmenin dinî bir dayanağı yoktur.'
          ],
          hadisler: [
              { metin: 'Ramazan’dan sonra en faziletli oruç, Allah’ın ayı Muharrem’de tutulan oruçtur.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Sıyâm, 1163', k: [['m', 1163, 'Abu Haraira']] },
              { metin: 'Peygamberimizin Ramazan dışında bir ayın tamamını oruçlu geçirdiğini görmedim; Şaban’dan daha çok oruç tuttuğu bir ay da görmedim.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Savm, 1969', k: [['b', 1969, 'Aisha']] }
          ],
          kavramlar: ['mustehab'],
          akilda: 'Nafile oruç gönülden tutulur, ölçüyü kaçırmadan.',
          kaynak: ['SSS, soru 11 ve 17', 'İlmihal, “Oruç Tutmanın Mendup Olduğu Günler”'] },

        // ---------------- 10. Oruç tutulmayan günler ----------------
        { id: 'bayram-gunleri', bolum: 'yasak', ad: 'Bayram günleri', emo: '🎉',
          kisa: 'Ramazan Bayramı’nın birinci günü ve Kurban Bayramı’nın dört günü oruç tutulmaz.',
          aciklama: [
              'Ramazan Bayramı’nın birinci gününde ve Kurban Bayramı’nın dört gününde oruç tutmak yasaktır; Diyanet bunu tahrîmen mekruh olarak bildirir, İlmihal’de haram diye de geçer.',
              'Bayramlar yeme, içme ve sevinç günleridir. Ramazan Bayramı bir aylık orucun ardından verilen genel bir iftar sofrası gibidir; Kurban Bayramı da kurbanların kesildiği ziyafet günleridir.',
              'Kaza orucu da bu günlerde tutulmaz.'
          ],
          hadisler: [{ metin: 'Hz. Ömer bayram namazından sonra şöyle dedi: Resûlullah bu iki günde oruç tutmayı yasakladı: Orucunuzu bitirdiğiniz bayram günü ve kurbanlarınızdan yediğiniz gün.', ravi: 'Hz. Ömer', kaynak: 'Buhârî, Savm, 1990; Müslim, Sıyâm, 1137', k: [['b', 1990, 'Umar'], ['m', 1137, 'Umar']] }],
          kavramlar: ['mekruh-tahrimen', 'haram'],
          akilda: 'Bayram, Allah’ın sofrasıdır; o gün oruç tutulmaz.',
          kaynak: ['SSS, soru 9 ve 12', 'İlmihal, “Oruç Tutmanın Yasak Olduğu Günler”'] },

        { id: 'yalniz-cuma', bolum: 'yasak', ad: 'Yalnız cuma günü', emo: '🕌', hukum: 'mekruh',
          kisa: 'Yalnızca cuma günü nafile oruç tutmak tenzîhen mekruhtur.',
          aciklama: [
              'Sadece cuma günü nafile oruç tutmak tenzîhen mekruhtur; çünkü cuma müslümanların haftalık bayramıdır.',
              'Bir gün öncesi ya da sonrasıyla birlikte tutmakta, alışılmış orucun cumaya denk gelmesinde ya da cuma günü kaza ve adak orucu tutmakta sakınca yoktur.'
          ],
          hadisler: [{ metin: 'Sizden biri, bir gün öncesinde ya da sonrasında da oruç tutmadıkça yalnız cuma günü oruç tutmasın.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1985; Müslim, Sıyâm, 1144', k: [['b', 1985, 'Abu Huraira'], ['m', 1144, 'Abu Huraira']] }],
          kavramlar: ['mekruh-tenzihen'],
          akilda: 'Cumayı oruç için ayırma; yanına bir gün ekle.',
          kaynak: ['SSS, soru 10', 'İlmihal, “Oruç Tutmanın Yasak Olduğu Günler”'] },

        { id: 'sek-gunu', bolum: 'yasak', ad: 'Şek günü', emo: '❔', hukum: 'mekruh',
          kisa: 'Ramazan girmiş olabilir diye Şaban’ın son gününde ihtiyaten oruç tutmak mekruhtur.',
          aciklama: [
              'Şaban’ın yirmi dokuzundan sonraki günün Şaban’a mı Ramazan’a mı ait olduğundan şüphe edilen güne şek günü denir. Ramazan’ı karşılamak için ya da Ramazan girmiş olabilir diye bu günde oruç tutmak mekruhtur; Ramazan niyetiyle tutmak tahrîmen mekruhtur.',
              'Alışkanlık hâline gelmiş orucu bu güne denk gelen kimsenin tutmasında sakınca yoktur. Bugün Ramazan’ın başlangıcı Diyanet’in takvimiyle bilinir.'
          ],
          hadisler: [{ metin: 'Sizden biri Ramazan’dan bir ya da iki gün önce oruç tutmasın; ancak öteden beri tuttuğu oruç o güne denk gelen tutsun.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1914', k: [['b', 1914, 'Abu Huraira']] }],
          kavramlar: ['mekruh-tenzihen', 'mekruh-tahrimen'],
          akilda: 'Ramazan’ı tahminle değil, takvimle başlat.',
          kaynak: ['SSS, soru 17', 'İlmihal, “Oruç Tutmanın Yasak Olduğu Günler”'] },

        { id: 'visal', bolum: 'yasak', ad: 'Visal orucu', emo: '🔗', hukum: 'mekruh',
          kisa: 'İki ya da daha fazla günü iftar etmeden birleştirmek mekruhtur.',
          aciklama: [
              'İki ya da daha fazla günü arada iftar etmeden birbirine ekleyerek oruç tutmaya visal orucu denir ve mekruhtur.',
              'Peygamberimiz ümmetine acıdığı için visal orucunu yasaklamıştır.'
          ],
          hadisler: [{ metin: 'Visal orucu tutmayın. “Ama sen tutuyorsun” dediler. “Ben sizden biri gibi değilim; ben yedirilir ve içirilirim” buyurdu.', ravi: 'Enes b. Mâlik', kaynak: 'Buhârî, Savm, 1961', k: [['b', 1961, 'Anas']] }],
          kavramlar: ['mekruh-tenzihen'],
          akilda: 'Her orucun bir iftarı vardır.',
          kaynak: ['İlmihal, “Oruç Tutmanın Yasak Olduğu Günler”'] },

        // ---------------- 11. Ramazan'ın ibadetleri ----------------
        { id: 'teravih', bolum: 'ramazan', ad: 'Teravih namazı', emo: '🕯️', hukum: 'sunnet',
          kisa: 'Ramazan gecelerinde yatsıdan sonra kılınan yirmi rekâtlık namaz.',
          aciklama: [
              'Teravih, Ramazan ayına mahsus olarak yatsı namazından sonra ve vitirden önce kılınan namazdır; kadın ve erkek için müekked sünnettir. Orucun değil, Ramazan ayının sünnetidir.',
              'Teravih yirmi rekâttır ve on selamla kılınır; cemaatle kılınması kifâye sünnetidir.'
          ],
          hadisler: [{ metin: 'Kim inanarak ve sevabını Allah’tan umarak Ramazan gecelerini namazla ihya ederse geçmiş günahları bağışlanır.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Salâtü’t-terâvîh, 2009', k: [['b', 2009, 'Abu Huraira']] }],
          kavramlar: ['sunnet'],
          akilda: 'Ramazan’ın gündüzü oruçla, gecesi teravihle ihya edilir.',
          kaynak: ['İlmihal, “Teravih Namazı”'] },

        { id: 'itikaf', bolum: 'ramazan', ad: 'İtikâf', emo: '🧎', hukum: 'sunnet',
          kisa: 'Ramazan’ın son on gününde ibadet niyetiyle mescitte kalmak.',
          aciklama: [
              'İtikâf, ibadet niyetiyle bir mescitte belirli kurallara uyarak kalmaktır. Peygamberimiz Ramazan’ın son on gününde itikâfa girerdi; Hanefîler bunu kifâye niteliğinde müekked sünnet saymıştır.',
              'İtikâftaki kimse vaktini namaz, Kur’an, dua, zikir ve tefekkürle geçirir; zorunlu ihtiyaçları için dışarı çıkar ve hemen döner. Kadınlar evlerinin bir odasında itikâfa girebilir.'
          ],
          ayetler: ['2:187'],
          hadisler: [{ metin: 'Peygamberimiz vefat edinceye kadar Ramazan’ın son on gününde itikâfa girerdi; ondan sonra eşleri de itikâfa girdi.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, İ‘tikâf, 2026; Müslim, İ‘tikâf, 1172', k: [['b', 2026, 'Aisha'], ['m', 1172, "A'isha"]] }],
          kavramlar: ['sunnet'],
          akilda: 'Son on gün, kalbi dünyadan bir süre ayırma vaktidir.',
          kaynak: ['Bakara 187', 'İlmihal, “İtikâf”'] },

        { id: 'kadir-gecesi', bolum: 'ramazan', ad: 'Kadir Gecesi', emo: '✨',
          kisa: 'Kur’an’ın indirildiği, bin aydan hayırlı gece.',
          aciklama: [
              'Kadir Gecesi, Kur’an’ın indirildiği ve bin aydan hayırlı olduğu bildirilen gecedir.',
              'Peygamberimiz bu geceyi Ramazan’ın son on gecesinin tek gecelerinde aramayı tavsiye etmiştir; bu yüzden son on gece ibadetle değerlendirilir.'
          ],
          ayetler: ['97:1-5'],
          hadisler: [
              { metin: 'Kadir Gecesi’ni Ramazan’ın son on gününün tek gecelerinde arayın.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Fazlü leyleti’l-kadr, 2017', k: [['b', 2017, 'Aisha']] },
              { metin: 'Kim Kadir Gecesi’ni inanarak ve sevabını Allah’tan umarak ihya ederse geçmiş günahları bağışlanır.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Savm, 1901', k: [['b', 1901, 'Abu Huraira']] }
          ],
          akilda: 'Bin aydan hayırlı bir gece: son on gecede ara.',
          kaynak: ['Kadr 1–5', 'Buhârî, Fazlü leyleti’l-kadr, 2017'] },

        { id: 'fitir-sadakasi', bolum: 'ramazan', ad: 'Fıtır sadakası (fitre)', emo: '🎁', deger: 'fitre',
          kisa: 'Bayrama ulaşan, dinen zengin müslümanın vermesi vacip olan sadaka.',
          aciklama: [
              'Halk arasında fitre denen fıtır sadakası, dinen zengin olup Ramazan’ın sonuna ulaşan müslümanın vermesi vacip olan sadakadır. Kişi kendisinin ve küçük çocuklarının fitresini verir.',
              'Bayram namazından önce verilmesi müstehaptır; Ramazan’ın ilk günlerinde vermek de caizdir. Kişinin bakmakla yükümlü olduğu yakınlarına ve eşine verilmez.',
              'Fitrenin ve zekâtın ayrıntıları Zekât ve Sadaka Rehberi’ndedir.'
          ],
          hadisler: [{ metin: 'Peygamberimiz köle ya da hür, erkek ya da kadın, küçük ya da büyük her müslümana fıtır sadakası olarak bir sâ‘ hurma ya da bir sâ‘ arpa vermeyi farz kıldı ve insanlar bayram namazına çıkmadan önce verilmesini emretti.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Zekât, 1503', k: [['b', 1503, 'Ibn `Umar']] }],
          kavramlar: ['vacip'],
          baglanti: { href: '../zekat/', ad: 'Zekât ve Sadaka Rehberi' },
          akilda: 'Fitre, bayram sevincini yoksulla paylaşmaktır.',
          kaynak: ['SSS, soru 23 ve 24', 'DİYK, 2026 yılı fitre miktarı kararı (07.01.2026)'] }
    ],

    // Bozar mı? oyunu: cevap bağlı konunun hükmüyle aynıdır (bozmaz | bozar-kaza | bozar-kefaret).
    sorular: [
        { id: 'unutup-su', konu: 'unutarak', soru: 'Oruçlu olduğumu unutup bir bardak su içtim.', cevap: 'bozmaz', aciklama: 'Unutarak yiyip içmek orucu bozmaz; hatırlayınca hemen bırakılır ve oruca devam edilir.' },
        { id: 'abdest-su', konu: 'su-kacmasi', soru: 'Abdest alırken ağzımı çalkalıyordum, boğazıma su kaçtı.', cevap: 'bozar-kaza', aciklama: 'Oruçlu olduğu aklındayken istemeden boğaza su kaçması orucu bozar; yalnız kaza gerekir.' },
        { id: 'macunsuz', konu: 'dis-fircalamak', soru: 'Dişlerimi macunsuz fırçaladım, suyu yutmadım.', cevap: 'bozmaz', aciklama: 'Boğaza su ya da macun kaçırmadan diş fırçalamak orucu bozmaz.' },
        { id: 'grip-asisi', konu: 'igne-asi', soru: 'Oruçluyken grip aşısı oldum.', cevap: 'bozmaz', aciklama: 'Besin değeri taşımayan aşılar orucu bozmaz.' },
        { id: 'insulin', konu: 'igne-asi', soru: 'Şeker hastasıyım, insülin iğnemi yaptım.', cevap: 'bozmaz', aciklama: 'İnsülin iğnesi gıda ve keyif verici olmadığı için orucu bozmaz.' },
        { id: 'astim', konu: 'astim-spreyi', soru: 'Nefesim daralınca astım spreyimi kullandım.', cevap: 'bozmaz', aciklama: 'Nefes açıcı spreyden ağza giren miktar çok azdır; orucu bozmaz.' },
        { id: 'goz-damla', konu: 'damlalar', soru: 'Gözüme doktorun verdiği damlayı damlattım.', cevap: 'bozmaz', aciklama: 'Göz damlası çok az miktardadır ve beslenme anlamı taşımaz; orucu bozmaz.' },
        { id: 'kulak-damla', konu: 'damlalar', soru: 'Kulak zarım sağlam; kulağıma damla damlattım.', cevap: 'bozmaz', aciklama: 'Kulak zarı ilacın boğaza geçmesine engel olur; kulak damlası orucu bozmaz.' },
        { id: 'kan-tahlili', konu: 'kan-vermek', soru: 'Sabah kan tahlili için kan verdim.', cevap: 'bozmaz', aciklama: 'Kan vermek, tahlil için de olsa orucu bozmaz.' },
        { id: 'dolgu', konu: 'dis-tedavisi', soru: 'Dişçide dolgu yaptırdım; boğazıma bir şey kaçmadı.', cevap: 'bozmaz', aciklama: 'Yalnızca diş tedavisi orucu bozmaz; boğaza su, kan ya da malzeme kaçarsa bozar.' },
        { id: 'istemeden-kusma', konu: 'kendiliginden-kusmak', soru: 'Midem bulandı, istemeden kustum.', cevap: 'bozmaz', aciklama: 'Kendiliğinden gelen kusuntu, ne kadar olursa olsun orucu bozmaz.' },
        { id: 'kasten-kusma', konu: 'kasten-kusmak', soru: 'Kendi isteğimle ağız dolusu kustum.', cevap: 'bozar-kaza', aciklama: 'Kendi isteğiyle ağız dolusu kusmak orucu bozar; kaza gerekir.' },
        { id: 'erken-iftar', konu: 'vakit-yanilmasi', soru: 'Güneş battı sandım, iftar ettim; sonra batmadığını anladım.', cevap: 'bozar-kaza', aciklama: 'Güneş batmadan iftar ettiği anlaşılan kimsenin orucu bozulur; kaza gerekir.' },
        { id: 'pirinc', konu: 'mutat-olmayan', soru: 'Oruçluyken çiğ pirinç tanelerini yuttum.', cevap: 'bozar-kaza', aciklama: 'Yenmesi alışılmamış şeyleri yutmak orucu bozar; kefaret değil, yalnız kaza gerekir.' },
        { id: 'cunup', konu: 'cunup-sabahlamak', soru: 'Sahurdan sonra uyudum, cünüp olarak uyandım.', cevap: 'bozmaz', aciklama: 'Cünüplük oruca engel değildir; bir an önce yıkanmak gerekir.' },
        { id: 'dus', konu: 'yikanmak', soru: 'Öğlen duş aldım, ağzıma ve burnuma su kaçırmadım.', cevap: 'bozmaz', aciklama: 'Ağız ve burundan su kaçırmadan yıkanmak orucu bozmaz.' },
        { id: 'adet', konu: 'hayiz-nifas', soru: 'Gün içinde âdetim başladı.', cevap: 'bozar-kaza', aciklama: 'Gün içinde âdet başlayınca oruç bozulur; o gün temizlendikten sonra kaza edilir.' },
        { id: 'bilerek-su', konu: 'bilerek-yemek', soru: 'Ramazan’da canım çekti, bilerek su içtim.', cevap: 'bozar-kefaret', aciklama: 'Ramazan orucunu mazeretsiz ve bilerek bozmak, Hanefîlere göre kaza ile birlikte kefaret gerektirir.' },
        { id: 'sigara', konu: 'sigara', soru: 'Ramazan’da oruçluyken bilerek sigara içtim.', cevap: 'bozar-kefaret', aciklama: 'Sigara yeme içme kapsamındadır; Ramazan’da bilerek içmek kaza ve kefaret gerektirir.' },
        { id: 'imsak-devam', konu: 'bilerek-yemek', soru: 'Sahurda imsak vaktinin girdiğini anladım ama yemeye devam ettim.', cevap: 'bozar-kefaret', aciklama: 'İmsak vaktinin girdiğini anladığı hâlde yemeye devam eden kimseye Hanefîlere göre kefaret de gerekir.' }
    ],

    // Nafile oruçlar ve tutulmayan günler çizelgesi (hicrî aylara göre). tur: tavsiye | yasak | mekruh | farz
    cizelge: [
        { ay: 'Muharrem', satirlar: [
            { gun: '9–10 ya da 10–11', ad: 'Aşure orucu', tur: 'tavsiye', konu: 'asure' },
            { gun: 'Ay boyunca', ad: 'Ramazan’dan sonra en faziletli nafile oruç', tur: 'tavsiye', konu: 'muharrem-saban' },
            { gun: 'Yalnız 10', ad: 'Aşure’yi tek başına tutmak mekruh görülmüştür', tur: 'mekruh', konu: 'asure' }
        ] },
        { ay: 'Şaban', satirlar: [
            { gun: 'Ayın çoğu', ad: 'Peygamberimizin en çok nafile oruç tuttuğu ay', tur: 'tavsiye', konu: 'muharrem-saban' },
            { gun: 'Son gün (şek günü)', ad: 'Ramazan’ı karşılamak için tutmak mekruh', tur: 'mekruh', konu: 'sek-gunu' }
        ] },
        { ay: 'Ramazan', satirlar: [
            { gun: 'Bütün ay', ad: 'Ramazan orucu', tur: 'farz', konu: 'farz-olusu' }
        ] },
        { ay: 'Şevval', satirlar: [
            { gun: '1', ad: 'Ramazan Bayramı’nın birinci günü: oruç tutulmaz', tur: 'yasak', konu: 'bayram-gunleri' },
            { gun: 'Herhangi altı gün', ad: 'Şevval orucu', tur: 'tavsiye', konu: 'sevval' }
        ] },
        { ay: 'Zilhicce', satirlar: [
            { gun: '1–9', ad: 'Zilhicce’nin ilk dokuz günü', tur: 'tavsiye', konu: 'arefe' },
            { gun: '9', ad: 'Arefe orucu (hacılar için tavsiye edilmez)', tur: 'tavsiye', konu: 'arefe' },
            { gun: '10–13', ad: 'Kurban Bayramı’nın dört günü: oruç tutulmaz', tur: 'yasak', konu: 'bayram-gunleri' }
        ] },
        { ay: 'Her ay', satirlar: [
            { gun: '13, 14, 15', ad: 'Eyyâm-ı bîz: her ay üç gün', tur: 'tavsiye', konu: 'uc-gun' }
        ] },
        { ay: 'Her hafta', satirlar: [
            { gun: 'Pazartesi, perşembe', ad: 'Haftalık nafile oruç', tur: 'tavsiye', konu: 'pazartesi-persembe' },
            { gun: 'Yalnız cuma', ad: 'Tek başına cuma orucu mekruh', tur: 'mekruh', konu: 'yalniz-cuma' }
        ] },
        { ay: 'Her zaman', satirlar: [
            { gun: 'Gün aşırı', ad: 'Dâvûd orucu', tur: 'tavsiye', konu: 'davud-orucu' },
            { gun: 'İftarsız birleştirmek', ad: 'Visal orucu mekruh', tur: 'mekruh', konu: 'visal' }
        ] }
    ],

    // Yıllık değişen değerler: Diyanet'in açıkladığı tarihli değer. Doğrulanamazsa tutar null kalır
    // ve ekranda "Diyanet'in açıklamasına bakın" yazılır. Zekât ve Sadaka Rehberi aynı değeri kullanır.
    degerler: {
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
        { ad: 'Kur’an-ı Kerim: Bakara 183–187, Kadr 1–5', not: 'Arapça metin Tanzil Quran Text (Simple), meal Diyanet İşleri Başkanlığı (Tanzil, tr.diyanet); değiştirilmeden.' },
        { ad: 'Buhârî, “Kitâbu’s-savm” ve Müslim, “Kitâbu’s-sıyâm”', not: 'Künyeler fawazahmed0/hadith-api metinleriyle otomatik denetlendi; Müslim numarası M. Fuâd Abdülbâkî numarasıdır. Hadis metinleri Türkçeye anlam olarak aktarılmıştır.' },
        { ad: 'Ebû Dâvûd ve Tirmizî', not: 'Yalnızca birkaç rivayet; her birinin sıhhat durumu (Elbânî, Şuayb el-Arnaût, Ahmed Şâkir) yanında yazılıdır.' },
        { ad: 'Diyanet İşleri Başkanlığı, Oruç: Sıkça Sorulanlar', not: 'Din İşleri Yüksek Kurulu fetvaları doğrultusunda, 8. baskı, Ankara 2020. Konulardaki “SSS, soru …” bu kitapçıktır.', url: 'https://webdosya.diyanet.gov.tr/ramazan/UserFiles/00000000-0000-0000-0000-000000000000/2025/2/20/b4f6325c-01ad-4d75-8bac-8c830775bfb9.pdf' },
        { ad: 'Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler, “Oruç” bölümü', not: 'Mezhep farkları ve mekruhlar bu bölümden aktarılmıştır.' },
        { ad: 'Din İşleri Yüksek Kurulu kararı, 22.09.2005, sayı 155', not: 'Orucu bozan ve bozmayan muayene ve tedavi yöntemleri.', url: 'https://kurul.diyanet.gov.tr/Cevap-Ara/Karar/3560/orucu-bozan-ve-bozmayan-muayene-ve-tedavi-yontemleri' },
        { ad: 'Din İşleri Yüksek Kurulu, 2026 yılı fitre miktarı', not: 'Toplantı 07.01.2026, duyuru 13.01.2026: fitre ve günlük fidye 240 TL.', url: 'https://kurul.diyanet.gov.tr/tr/duyuru/din-isleri-yuksek-kurulu-2026-yili-fitre-miktarini-acikladi/019bb642-4872-7191-841e-408610f76b33' },
        { ad: 'Müftülük sayfaları (Diyanet)', not: 'Bartın Amasra Müftülüğü “Oruç Hakkında Fıkhi Bilgiler” (Şâfiî mezhebinde yeme içmenin yalnız kaza gerektirmesi) ve Afyonkarahisar Dinar Müftülüğü “Ramazan Ayı ve Oruç” (sigaranın kaza ve kefaret gerektirmesi).', url: 'https://bartin.diyanet.gov.tr/amasra/sayfalar/contentdetail.aspx?ContentId=473&MenuCategory=Kurumsal' },
        { ad: 'Namaz ve imsak vakitleri', not: 'Uygulama vakit hesaplamaz; bulunduğunuz yerin vakti için Diyanet’in sayfasına bakın.', url: 'https://namazvakitleri.diyanet.gov.tr/' }
    ]
};
