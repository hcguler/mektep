/* Sureler Atlası — yorum verisi (elle yazılır).
 * Künye (ayet sayısı, Mekkî/Medenî, iniş sırası, cüz, sayfa) BURADA DEĞİLDİR: kunye.js'e tools/sureler-uret.mjs üretir.
 * Öne çıkan ayetlerin Arapça metni ve meali ayetler.js'tedir (aynı üretici; Tanzil Simple + Diyanet meali).
 * Konu özetleri kendi cümlelerimizledir; her biri TDV İslâm Ansiklopedisi'nin ilgili sure maddesiyle
 * karşılaştırılmıştır (kaynak alanı). Hadisler yalnızca Buhârî ve Müslim'den, anlam olarak; künyeler
 * üreticide fawazahmed0/hadith-api ile denetlenir.
 * Düzenledikten sonra (depo kökünde): node tools/sureler-uret.mjs && node tools/sureler-anlatim.mjs
 */
window.SURE_DATA = {
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    temalar: [
        { id: 'tevhid', ad: 'Tevhid', emo: '☝️' },
        { id: 'ahiret', ad: 'Âhiret', emo: '⚖️' },
        { id: 'peygamber', ad: 'Peygamber', emo: '🌙' },
        { id: 'kuran', ad: 'Kur’an ve vahiy', emo: '📖' },
        { id: 'ibadet', ad: 'İbadet', emo: '🕌' },
        { id: 'dua', ad: 'Dua ve sığınma', emo: '🤲' },
        { id: 'ahlak', ad: 'Ahlak', emo: '💎' },
        { id: 'toplum', ad: 'Toplum ve yardımlaşma', emo: '🤝' },
        { id: 'kissa', ad: 'Kıssalar', emo: '📜' },
        { id: 'nimet', ad: 'Nimet ve şükür', emo: '🌾' },
        { id: 'sabir', ad: 'Sabır ve teselli', emo: '🌱' }
    ],

    // Mekkî / Medenî oluşu hakkında görüş farkı (TDV İslâm Ansiklopedisi'nin sure maddeleri).
    // guclu: görüş farkı belirgin ya da Tanzil'in sınıflaması maddenin tercih ettiği görüşten farklı;
    //        ekranda Mekkî/Medenî yerine "Görüş farkı" yazar.
    // zayif: farklı bir görüş anılır ama madde onu zayıf bulur ya da çoğunluk görüşü açıktır.
    // İkisi de "Mekkî mi, Medenî mi?" oyununa girmez. Yalnızca bazı ayetlerin farklı yerde indiği
    // söylenen sureler (ör. Kehf, Vâkıa, Hucurât) burada sayılmaz.
    ihtilaf: {
        13: { derece: 'guclu', not: 'Tamamının Mekkî, tamamının Medenî ya da bir kısmının Mekkî bir kısmının Medenî olduğu görüşleri vardır. TDV İslâm Ansiklopedisi, üslubuna ve konularına bakarak Mekkî olduğu görüşünün ağır bastığını belirtir; Tanzil verisinde Medenî sayılır.', kaynak: 'TDV İslâm Ansiklopedisi, “Ra‘d Sûresi” maddesi' },
        22: { derece: 'guclu', not: 'Mekkî mi Medenî mi olduğu tartışılmıştır; çoğunluğa göre Mekkî ve Medenî ayetler bir aradadır. TDV İslâm Ansiklopedisi muhtevasına ve üslubuna bakarak Mekkî olduğu yönüne meyleder; Tanzil verisinde Medenî sayılır.', kaynak: 'TDV İslâm Ansiklopedisi, “Hac Sûresi” maddesi' },
        55: { derece: 'guclu', not: 'Çoğunluğun görüşüne göre Mekke döneminde inmiştir; İbn Mes‘ûd ve Mukātil’den gelen rivayetlerde Medine’de indiği söylenir. Tanzil verisinde Medenî sayılır.', kaynak: 'TDV İslâm Ansiklopedisi, “Rahmân Sûresi” maddesi' },
        76: { derece: 'guclu', not: 'Mücâhid ve Katâde gibi birçok âlim Medenî, İbn Âşûr Mekkî saymıştır; bir kısmını Mekkî bir kısmını Medenî sayanlar da vardır. TDV İslâm Ansiklopedisi üslubuna bakarak Mekkî olduğu görüşünü güçlü bulur; Tanzil verisinde Medenî sayılır.', kaynak: 'TDV İslâm Ansiklopedisi, “İnsân Sûresi” maddesi' },
        98: { derece: 'guclu', not: 'Mekkî olduğuna dair rivayetler vardır; TDV İslâm Ansiklopedisi, Buhârî’deki bir hadise dayanarak Medine döneminde indiğini belirtir. İlk ayetleri Mekkî, son ayetleri Medenî surelere benzediği için görüş farkı doğmuştur.', kaynak: 'TDV İslâm Ansiklopedisi, “Beyyine Sûresi” maddesi' },
        99: { derece: 'guclu', not: 'Taberî, Kurtubî ve Süyûtî Medenî; İbn Âşûr Mekkî saymıştır.', kaynak: 'TDV İslâm Ansiklopedisi, “Zilzâl Sûresi” maddesi' },
        112: { derece: 'guclu', not: 'İbn Mes‘ûd, Hasan-ı Basrî ve Mücâhid Mekkî; İbn Abbas, Dahhâk ve Süyûtî Medenî saymıştır. TDV İslâm Ansiklopedisi dilinin ve üslubunun Mekkî surelere benzediğini belirtir.', kaynak: 'TDV İslâm Ansiklopedisi, “İhlâs Sûresi” maddesi' },
        113: { derece: 'guclu', not: 'Nâs suresiyle birlikte indiğinde görüş birliği vardır. Hasan-ı Basrî, Atâ, İkrime ve Câbir b. Zeyd Mekkî; Abdullah b. Zübeyr ve Katâde Medenî saymıştır. TDV İslâm Ansiklopedisi üslubunun ve muhtevasının Mekkî surelere benzediğini belirtir.', kaynak: 'TDV İslâm Ansiklopedisi, “Felak Sûresi” maddesi' },
        114: { derece: 'guclu', not: 'Felak suresiyle birlikte inmiştir; Mekkî mi Medenî mi olduğu konusunda aynı görüş farkı vardır. TDV İslâm Ansiklopedisi muhtevasının ve üslubunun Mekkî olduğu görüşünü güçlendirdiğini belirtir.', kaynak: 'TDV İslâm Ansiklopedisi, “Nâs Sûresi” maddesi' },

        1: { derece: 'zayif', not: 'Medine’de ya da iki defa indiğine dair rivayetler vardır; bunlara itibar edilmemiştir.', kaynak: 'TDV İslâm Ansiklopedisi, “Fâtiha Sûresi” maddesi' },
        36: { derece: 'zayif', not: 'Bir hadis dolayısıyla Medine’de indiği de söylenmiştir; bu görüş benimsenmemiştir.', kaynak: 'TDV İslâm Ansiklopedisi, “Yâsîn Sûresi” maddesi' },
        38: { derece: 'zayif', not: 'Medenî olduğu görüşü de anılır; isabetli bulunmamıştır.', kaynak: 'TDV İslâm Ansiklopedisi, “Sâd Sûresi” maddesi' },
        53: { derece: 'zayif', not: 'Tamamının ya da bir kısmının Medine’de indiği ileri sürülmüştür; bu görüş itibar görmemiştir.', kaynak: 'TDV İslâm Ansiklopedisi, “Necm Sûresi” maddesi' },
        57: { derece: 'zayif', not: 'Mekkî olduğuna dair rivayetler de vardır; müfessirlerin büyük çoğunluğu Medenî kabul eder. TDV İslâm Ansiklopedisi, İbn Abbas rivayetlerine dayanarak ilk dokuz ayetini Mekke dönemine yerleştirir.', kaynak: 'TDV İslâm Ansiklopedisi, “Hadîd Sûresi” maddesi' },
        61: { derece: 'zayif', not: 'Bazı rivayetlerde Mekke’de indiği söylenir; müfessirlerin çoğu Medenî kabul eder.', kaynak: 'TDV İslâm Ansiklopedisi, “Saf Sûresi” maddesi' },
        62: { derece: 'zayif', not: 'Süleyman b. Yesâr’dan Mekkî olduğuna dair bir rivayet vardır; âlimlerin çoğunluğu Medenî kabul eder.', kaynak: 'TDV İslâm Ansiklopedisi, “Cuma Sûresi” maddesi' },
        83: { derece: 'zayif', not: 'Bazı rivayetlere göre ilk dört ayeti Medine’de inmiştir; TDV İslâm Ansiklopedisi Mekkî olduğu görüşünü daha isabetli bulur.', kaynak: 'TDV İslâm Ansiklopedisi, “Mutaffifîn Sûresi” maddesi' },
        89: { derece: 'zayif', not: 'Ali b. Ebû Talha’dan Medenî olduğuna dair bir rivayet vardır; üslubu ve muhtevası Mekkî surelere benzer.', kaynak: 'TDV İslâm Ansiklopedisi, “Fecr Sûresi” maddesi' },
        97: { derece: 'zayif', not: 'Müfessirlerin çoğunluğuna göre Mekke döneminde inmiştir; Medine’de indiğine dair rivayetler de vardır.', kaynak: 'TDV İslâm Ansiklopedisi, “Kadr Sûresi” maddesi' },
        100: { derece: 'zayif', not: 'Medenî olduğu da söylenmiştir; konusu ve üslubu Mekkî surelerin özelliklerini taşır.', kaynak: 'TDV İslâm Ansiklopedisi, “Âdiyât Sûresi” maddesi' },
        102: { derece: 'zayif', not: 'Nüzul sebebine göre tartışılır: çoğunluğa göre Mekke’de Kureyş’in iki kolunun övünmesi üzerine, bazılarına göre Medine’de ensardan iki grup hakkında inmiştir.', kaynak: 'TDV İslâm Ansiklopedisi, “Tekâsür Sûresi” maddesi' },
        107: { derece: 'zayif', not: 'Tamamının ya da son dört ayetinin Medine’de indiğine dair rivayetler vardır; müfessirlerin çoğunluğu Mekkî kabul eder.', kaynak: 'TDV İslâm Ansiklopedisi, “Mâûn Sûresi” maddesi' },
        108: { derece: 'zayif', not: 'Medine’de indiğini söyleyenler de vardır; muhtevası ve üslubu bu ihtimalin zayıf olduğunu gösterir.', kaynak: 'TDV İslâm Ansiklopedisi, “Kevser Sûresi” maddesi' }
    },

    // Konu özetleri: anlam (adın anlamı) · konu (2–4 cümle) · tema · oneCikan (ayet, üreticiden) ·
    // akilda (tek cümle) · cocuk (çocuk teması: "Bu sure ne anlatıyor?") · emo · hadis (isteğe bağlı; soz: true
    // ise metin Peygamberimizin sözüdür, değilse ravinin anlatımıdır; anlatım metni buna göre girer) · kaynak
    ozetler: {
        1: {
            anlam: 'Açılış', emo: '🔑', tema: ['tevhid', 'dua', 'ibadet'], oneCikan: '1:5',
            konu: 'Kur’an’ın ilk suresidir ve Kur’an’a bir giriş gibidir. Hamdin yalnızca âlemlerin Rabbi Allah’a ait olduğunu, O’nun Rahmân, Rahîm ve hesap gününün sahibi olduğunu bildirir. Kul yalnızca Allah’a ibadet edeceğini ve yalnızca O’ndan yardım dileyeceğini söyler, dosdoğru yola iletilmeyi ister. Her namazda okunur.',
            akilda: 'Kulluk da yardım dilemek de yalnızca Allah’adır.',
            cocuk: 'Allah’a hamd ettiğimiz ve bizi doğru yola iletmesini dilediğimiz, her namazda okuduğumuz sure.',
            hadis: { metin: 'Resûlullah bana Kur’an’daki en büyük sureyi öğreteceğini söyledi. Sonra bunun “Elhamdü lillâhi rabbi’l-âlemîn”, yani Fâtiha suresi olduğunu bildirdi ve “O, tekrar tekrar okunan yedi ayet ve bana verilen yüce Kur’an’dır” dedi.', ravi: 'Ebû Saîd b. el-Muallâ', kaynak: 'Buhârî, Tefsîr, 4474', k: [['b', 4474, "Mu'alla"]] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Fâtiha Sûresi” maddesi']
        },
        2: {
            anlam: 'İnek', emo: '🐄', tema: ['tevhid', 'ibadet', 'toplum', 'kissa'], oneCikan: '2:286',
            konu: 'Kur’an’ın en uzun suresidir; adını İsrâiloğulları’na bir inek kesmelerinin emredildiği kıssadan alır. İman esaslarını, insanların hidayet karşısındaki durumlarını ve İsrâiloğulları’nın geçmişinden ibret verici örnekleri anlatır. Namaz, oruç, hac, aile, borç ve alışveriş gibi konularda müslüman toplumun hayatını düzenleyen hükümler getirir. Âyetü’l-kürsî ve sık okunan son iki ayet bu suredendir.',
            akilda: 'Allah kimseye gücünün yetmeyeceği yükü yüklemez.',
            cocuk: 'Kur’an’ın en uzun suresi; imanı, ibadeti ve güzel yaşamayı öğretir.',
            hadis: { soz: true, metin: 'Kim geceleyin Bakara suresinin son iki ayetini okursa bu ona yeter.', ravi: 'Ebû Mes‘ûd el-Ensârî', kaynak: 'Buhârî, Fezâilü’l-Kur’ân, 5009; Müslim, Salâtü’l-müsâfirîn, 807', k: [['b', 5009, "Mas'ud"], ['m', 807, "Mas'ud"]] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Bakara Sûresi” maddesi']
        },
        3: {
            anlam: 'İmrân ailesi', emo: '🌷', tema: ['tevhid', 'peygamber', 'toplum', 'sabir'], oneCikan: '3:103',
            konu: 'Medine döneminde inmiştir; adını Âdem, Nûh ve İbrâhim ailesiyle birlikte seçkin kılındığı bildirilen İmrân ailesinden alır. Allah katındaki dinin İslâm olduğunu ve peygamberlerin görevini işler; Hz. Meryem’in, Yahyâ’nın ve Îsâ’nın doğumunu anlatarak Hıristiyanların Îsâ hakkındaki inancına cevap verir. Uhud Savaşı’nda yaşananlardan dersler çıkarır; müminleri Allah’ın ipine sarılmaya, iyiliği emredip kötülükten alıkoymaya ve sabırla sebat etmeye çağırır.',
            akilda: 'Müminler hep birlikte Allah’ın ipine sarılır, ayrılığa düşmez.',
            cocuk: 'Hz. Meryem’in ailesini anlatan, hep birlikte Allah’ın ipine sarılmayı öğreten sure.',
            hadis: { soz: true, metin: 'Kur’an okuyun; çünkü o kıyamet günü kendisini okuyanlara şefaatçi olarak gelecektir. İki parlak sureyi, Bakara ve Âl-i İmrân surelerini okuyun; çünkü onlar kıyamet günü iki bulut ya da iki gölgelik gibi gelip kendilerini okuyanları savunacaklardır.', ravi: 'Ebû Ümâme', kaynak: 'Müslim, Salâtü’l-müsâfirîn, 804', k: [['m', 804, 'Umama']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Âl-i İmrân Sûresi” maddesi']
        },
        4: {
            anlam: 'Kadınlar', emo: '👪', tema: ['toplum', 'ahlak', 'tevhid'], oneCikan: '4:58',
            konu: 'Medine’de, savaşların ardından geride yetimlerin ve dul kadınların kaldığı bir dönemde inmiştir; adını içinde sıkça geçen “kadınlar” kelimesinden alır. İnsanların tek bir nefisten yaratıldığını hatırlatarak akrabalık haklarını, yetimlerin korunmasını, mirası, evliliği ve aile içi barışı düzenler. Emanetlerin ehline verilmesini ve kişinin kendi aleyhine de olsa adaletten ayrılmamasını emreder; münafıkların tutumunu ve Ehl-i kitapla ilgili meseleleri ele alır.',
            akilda: 'Adalet, kendi aleyhimize olsa bile gözetilir.',
            cocuk: 'Ailemize, yetimlere ve herkese karşı adaletli olmayı öğreten sure.',
            hadis: { metin: 'Resûlullah bana “Bana Kur’an oku” dedi. “Kur’an sana indirilmişken ben mi sana okuyayım?” dedim. “Onu başkasından dinlemeyi severim” buyurdu. Nisâ suresini okudum; “Her ümmete bir şahit getirdiğimiz ve seni de bunlara şahit getirdiğimiz vakit durumları nasıl olacak?” ayetine gelince “Dur” dedi; bir de baktım ki gözlerinden yaşlar akıyordu.', ravi: 'Abdullah b. Mes‘ûd', kaynak: 'Buhârî, Tefsîr, 4582', k: [['b', 4582, 'Masud']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Nisâ Sûresi” maddesi']
        },
        5: {
            anlam: 'Sofra', emo: '🍽️', tema: ['toplum', 'ibadet', 'ahlak', 'peygamber'], oneCikan: '5:32',
            konu: 'Medine döneminin sonlarında inmiştir; adını havârîlerin Hz. Îsâ’dan istediği, gökten inen sofradan alır. Sözleşmelere bağlı kalmayı emreder; yiyecekler, abdest, teyemmüm, şahitlik, hırsızlık, içki ve kumar gibi konularda hükümler getirir ve dinin tamamlandığını bildirir. Âdem’in iki oğlunun kıssasıyla haksız yere bir cana kıymanın bütün insanları öldürmek gibi olduğunu anlatır; Yahudilerle Hıristiyanların yanlış inanç ve tutumlarını eleştirir.',
            akilda: 'Bir canı kurtaran, bütün insanları yaşatmış gibidir.',
            cocuk: 'Sözümüzü tutmayı, iyilikte yardımlaşmayı ve her canın çok değerli olduğunu öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mâide Sûresi” maddesi']
        },
        6: {
            anlam: 'Hayvanlar (deve, sığır, koyun ve keçi)', emo: '🐑', tema: ['tevhid', 'peygamber', 'ahlak'], oneCikan: '6:162-163',
            konu: 'Mekke döneminin sonlarında inmiştir ve tamamının bir defada indiği kabul edilir; adını müşriklerin hayvanlarla ilgili uydurdukları hükümlerin anlatıldığı ayetlerden alır. Allah’ın birliğini, peygamberliği ve öldükten sonra dirilişi delillerle anlatır, inkârcıların itirazlarına cevap verir; Hz. İbrâhim’in putperestliğe karşı mücadelesini anlatır. Sonunda şirk, anne babaya kötü davranmak, haksız yere cana kıymak, yetim malı yemek ve ölçüde hile yapmak gibi yasakları sıralar.',
            akilda: 'Namaz da ibadet de hayat da ölüm de yalnızca Allah içindir.',
            cocuk: 'Allah’ın bir olduğunu ve Hz. İbrâhim’in putlara karşı çıkışını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “En‘âm Sûresi” maddesi']
        },
        7: {
            anlam: 'Yüksek yerler, burçlar', emo: '🏰', tema: ['kissa', 'ahiret', 'peygamber'], oneCikan: '7:23',
            konu: 'Mekke döneminde inen en uzun suredir; adını cennetle cehennem arasındaki yüksek yerlerden alır. Vahye uymaya çağırarak başlar, amellerin tartılacağını bildirir; İblîs’in Âdem’e secde etmeyişini, Âdem ile eşinin hatalarından dönüp Rablerine yalvarışını anlatır. Nûh, Hûd, Sâlih, Lût ve Şuayb peygamberlerin kavimlerinin helâkini, Hz. Mûsâ’nın Firavun ve İsrâiloğulları ile yaşadıklarını ayrıntılı olarak anlatır.',
            akilda: 'Hata eden, Âdem gibi pişman olup Rabbine yönelir.',
            cocuk: 'Hz. Âdem’in ve birçok peygamberin hikâyesini anlatan, hata edince Allah’tan af dilemeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “A‘râf Sûresi” maddesi']
        },
        8: {
            anlam: 'Ganimetler', emo: '🏕️', tema: ['toplum', 'sabir', 'peygamber'], oneCikan: '8:46',
            konu: 'Hicretin ikinci yılında, Bedir Savaşı’nın ardından inmiştir; adını ilk ayette geçen ve savaş ganimetleri anlamına gelen kelimeden alır. Ganimetlerin Allah’a ve Resûlü’ne ait olduğunu bildirir ve Bedir zaferinin Allah’ın yardımıyla kazanıldığını hatırlatır. Allah’a ve Resûlü’ne itaati, birliği, sabrı ve sebatı öğütler; hicret eden ve onlara kucak açan müminlerin birbirinin dostu olduğunu bildirir.',
            akilda: 'Çekişme gücü götürür; birlik ve sabır zaferi getirir.',
            cocuk: 'Bedir’de Allah’ın müminlere yardımını anlatan, birlik olmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Enfâl Sûresi” maddesi']
        },
        9: {
            anlam: 'Tövbe', emo: '💚', tema: ['toplum', 'peygamber', 'ahlak'], oneCikan: '9:128-129',
            konu: 'Başında besmele bulunmaz; Medine’de tamamı inen son surelerdendir. Mekke’nin fethinden sonra müşriklerle yapılan antlaşmalar, savaş ve barış şartları ve haram aylarla ilgili hükümleri bildirir. Tebük Seferi sırasında münafıkların tutumlarını geniş olarak anlatır; seferden geri kalıp içtenlikle pişman olan üç kişinin tövbesinin kabul edildiğini bildirir. Peygamberimizin müminlere düşkün, şefkatli ve merhametli olduğunu anlatan ayetlerle sona erer.',
            akilda: 'Allah, içtenlikle tövbe edenin tövbesini kabul eder.',
            cocuk: 'Hata yapınca pişman olup Allah’a dönmeyi ve Peygamberimizin bizi ne kadar sevdiğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tevbe Sûresi” maddesi']
        },
        10: {
            anlam: 'Yûnus peygamber', emo: '🐋', tema: ['tevhid', 'kuran', 'kissa'], oneCikan: '10:57',
            konu: 'Mekke döneminde, büyük ihtimalle hicretten bir yıl önce inmiştir; adını, kavmi iman ettiği için azaptan kurtulan Yûnus peygamberden alır. Allah’ın birliğini, Peygamberimizin peygamberliğini ve âhireti tabiattaki delillerle anlatır; inkârcılara Kur’an’ın benzerini getirmeleri için meydan okur. Kur’an’ın bir öğüt, kalplere şifa ve rahmet olduğunu bildirir; Nûh ve Mûsâ peygamberlerin kıssalarını anlatır.',
            akilda: 'Kur’an, kalplere şifa ve müminlere rahmettir.',
            cocuk: 'Kur’an’ın kalbimize iyi gelen bir öğüt olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Yûnus Sûresi” maddesi']
        },
        11: {
            anlam: 'Hûd peygamber', emo: '⛵', tema: ['kissa', 'peygamber', 'sabir'], oneCikan: '11:112',
            konu: 'Mekke döneminde, Yûnus suresinden sonra inmiştir; adını Âd kavmine gönderilen Hûd peygamberden alır. Kur’an’ın tevhide çağrısını, Allah’ın ilmini ve kudretini anlatır. Nûh, Hûd, Sâlih, İbrâhim, Lût, Şuayb ve Mûsâ peygamberlerin kıssalarını, özellikle Nûh tufanını anlatır ve helâk edilen kavimlerin kendi kötülükleri yüzünden cezalandırıldığını bildirir. Peygamberimize ve müminlere dosdoğru olmayı, sabretmeyi ve namaz kılmayı öğütler.',
            akilda: 'Emrolunduğun gibi dosdoğru ol.',
            cocuk: 'Hz. Nûh’un gemisini ve birçok peygamberin sabrını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hûd Sûresi” maddesi']
        },
        12: {
            anlam: 'Yûsuf peygamber', emo: '👕', tema: ['kissa', 'sabir', 'ahlak'], oneCikan: '12:87',
            konu: 'Mekke döneminde, peygamberliğin sekizinci ile onuncu yılları arasında inmiştir; Hz. Yûsuf’un hayatını baştan sona tek bir kıssa olarak anlatır. Rüyasını, kardeşlerinin onu kıskanıp kuyuya atmasını, Mısır’a satılmasını, iffetini korumasını ve haksız yere hapse atılmasını anlatır. Hükümdarın rüyasını yorumlayıp ülkenin hazinelerinin başına geçtiğini, sonunda kardeşlerini bağışlayıp ailesine kavuştuğunu bildirir.',
            akilda: 'Sabreden ve Allah’ın rahmetinden ümit kesmeyen, sonunda kavuşur.',
            cocuk: 'Hz. Yûsuf’un kuyudan saraya uzanan, sabır ve affetme dolu hikâyesi.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Yûsuf Sûresi” maddesi']
        },
        13: {
            anlam: 'Gök gürültüsü', emo: '⛈️', tema: ['tevhid', 'nimet', 'peygamber'], oneCikan: '13:28',
            konu: 'Adını, gök gürültüsünün Allah’ı hamd ile tesbih ettiğini bildiren ayetten alır; üslubu ve konuları Mekke dönemi surelerine benzer. Göklerin direksiz yükseltilmesi, yeryüzü, dağlar, ırmaklar ve meyveler gibi delillerle Allah’ın birliğini ve kudretini anlatır; öldükten sonra dirilişi inkâr edenlere ve mucize isteyenlere cevap verir. Sözünde duran, akrabalık bağını gözeten, sabredip namaz kılan akıl sahiplerini cennetle müjdeler ve bir toplum kendi durumunu değiştirmedikçe Allah’ın onların durumunu değiştirmeyeceğini bildirir. Kur’an’ın Allah katından geldiğini bildirerek Peygamberimizi teselli eder.',
            akilda: 'Kalpler ancak Allah’ı anmakla huzur bulur.',
            cocuk: 'Gök gürültüsünün bile Allah’ı andığını, kalbimizin Allah’ı anınca huzur bulduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ra‘d Sûresi” maddesi']
        },
        14: {
            anlam: 'İbrâhim peygamber', emo: '🏜️', tema: ['tevhid', 'peygamber', 'dua', 'nimet'], oneCikan: '14:40-41',
            konu: 'Mekke döneminde, hicrete yakın bir zamanda inmiştir; adını Hz. İbrâhim’in Mekke için yaptığı duadan alır. Peygamberlerin davetine karşı direnişi ve inkârcıların âkıbetini anlatır; şükredenlere nimetin artırılacağını, nankörlük edenlerin ise azaba uğrayacağını bildirir. İbrâhim peygamberin Mekke’nin güvenli olması, soyunun putlardan uzak tutulması ve namazı dosdoğru kılması için ettiği dualarla müminlere örnek verir.',
            akilda: 'Şükrettikçe nimet artar.',
            cocuk: 'Hz. İbrâhim’in ailesi için ettiği güzel duaları anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İbrâhîm Sûresi” maddesi']
        },
        15: {
            anlam: 'Hicr (Semûd kavminin yurdu)', emo: '🪨', tema: ['kuran', 'kissa', 'peygamber'], oneCikan: '15:9',
            konu: 'Mekke döneminde, müşriklerin baskısının arttığı yıllarda inmiştir; adını Sâlih peygamberi yalanlayan ve dağlara oyulmuş evlerde yaşayan Semûd kavminin yurdu Hicr’den alır. Kur’an’ı Allah’ın indirdiğini ve onu koruyanın da O olduğunu bildirir. İblîs’in Âdem’e secde etmeyişini, İbrâhim peygambere bir oğul müjdelenmesini, Lût kavminin ve Eyke halkının helâkini anlatır; Peygamberimize ölüm gelinceye kadar Rabbine kulluk etmesini emreder.',
            akilda: 'Kur’an’ı indiren Allah, onu korumayı da üstlenmiştir.',
            cocuk: 'Kur’an’ı Allah’ın koruduğunu ve dağlara ev oyan bir kavmin hikâyesini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hicr Sûresi” maddesi']
        },
        16: {
            anlam: 'Bal arısı', emo: '🐝', tema: ['nimet', 'tevhid', 'ahlak'], oneCikan: '16:90',
            konu: 'Mekke döneminde, hicretten kısa bir süre önce inmiştir; adını bal arısına verilen ilhamı anlatan ayetlerden alır ve saydığı nimetler sebebiyle “Nimetler suresi” diye de anılır. Hayvanlar, yağmur, bitkiler, denizler, dağlar, hurma, üzüm ve bal gibi nimetleri sayarak Allah’ın birliğine ve şükre çağırır. Adaleti, iyiliği ve akrabaya yardımı emredip hayasızlığı, kötülüğü ve zulmü yasaklayan ayeti içerir; sözleşmelere bağlı kalmayı ve insanları Allah yoluna hikmetle, güzel öğütle çağırmayı öğretir.',
            akilda: 'Allah adaleti, iyiliği ve yakınlara yardımı emreder.',
            cocuk: 'Bal arısından yağmura kadar Allah’ın bize verdiği nimetleri anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nahl Sûresi” maddesi']
        },
        17: {
            anlam: 'Gece yolculuğu', emo: '🌃', tema: ['peygamber', 'ahlak', 'kuran', 'tevhid'], oneCikan: '17:23-24',
            konu: 'Mekke döneminin son surelerindendir; adını Peygamberimizin bir gece Mescid-i Harâm’dan Mescid-i Aksâ’ya götürülmesini anlatan ilk ayetten alır. İsrâiloğulları’nın tarihinden ibretler verir. Yalnızca Allah’a kulluğu, anne babaya iyiliği, akrabaya ve yoksula hakkını vermeyi emreder; cimriliği, israfı, yetim malına el uzatmayı, ölçüde hileyi ve kibirli yürümeyi yasaklar. Kur’an’ın benzerinin getirilemeyeceğini bildirir ve ruh hakkındaki soruya cevap verir.',
            akilda: 'Anne babaya “öf” bile denmez; onlara hep tatlı söz söylenir.',
            cocuk: 'Peygamberimizin gece yolculuğunu anlatan ve anne babamıza iyi davranmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İsrâ Sûresi” maddesi']
        },
        18: {
            anlam: 'Mağara', emo: '🏔️', tema: ['kissa', 'tevhid', 'ahiret'], oneCikan: '18:10',
            konu: 'Allah’ın çocuk edinmekten uzak olduğunu ve Kur’an’ın hak olduğunu bildirerek başlar. İnançlarını korumak için bir mağaraya sığınan gençlerin (Ashâb-ı Kehf) kıssasını, Hz. Mûsâ’nın Allah’ın kendisine ilim verdiği bir kulla (Hızır olarak bilinir) yolculuğunu ve Zülkarneyn’in kıssasını anlatır. İki bahçe sahibinin örneğiyle dünya hayatının ve malın geçici olduğunu hatırlatır.',
            akilda: 'Mal da evlat da dünyanın süsüdür; kalıcı olan iyiliklerdir.',
            cocuk: 'Mağaraya sığınan iman dolu gençlerin ve Hz. Mûsâ’nın öğretici yolculuğunun anlatıldığı sure.',
            hadis: { soz: true, metin: 'Kim Kehf suresinin ilk on ayetini ezberlerse Deccâl’den korunur.', ravi: 'Ebü’d-Derdâ', kaynak: 'Müslim, Salâtü’l-müsâfirîn, 809', k: [['m', 809, 'Darda']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Kehf Sûresi” maddesi', 'Kur’an-ı Kerîm, Kehf 18/46']
        },
        19: {
            anlam: 'Hz. Meryem', emo: '🌴', tema: ['kissa', 'peygamber', 'tevhid'], oneCikan: '19:30-33',
            konu: 'Mekke döneminde, Habeşistan’a hicretten önce inmiştir; adını kıssası geniş biçimde anlatılan Hz. Meryem’den alır. Zekeriyyâ peygambere yaşlılığında Yahyâ’nın müjdelenmesini, Meryem’e Îsâ’nın müjdelenmesini ve Îsâ’nın beşikte konuşarak Allah’ın kulu olduğunu bildirmesini anlatır. İbrâhim, Mûsâ, İsmâil ve İdrîs peygamberleri anar; Allah’a çocuk isnat etmenin büyük bir iftira olduğunu bildirir ve öldükten sonra dirilişi inkâr edenleri uyarır.',
            akilda: 'Îsâ beşikteyken “Ben Allah’ın kuluyum” demiştir.',
            cocuk: 'Hz. Meryem’i, Hz. Îsâ’nın doğumunu ve Hz. Zekeriyyâ’nın duasını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Meryem Sûresi” maddesi']
        },
        20: {
            anlam: 'Tâ ve Hâ harfleri', emo: '⛰️', tema: ['kissa', 'peygamber', 'kuran', 'sabir'], oneCikan: '20:114',
            konu: 'Mekke döneminde, Meryem suresinden sonra inmiştir; adını başındaki iki harften alır ve Kur’an’ın insanı sıkıntıya sokmak için değil, öğüt olsun diye indirildiğini bildirerek başlar. Muhtevasının çoğu Hz. Mûsâ’ya ayrılmıştır: peygamberliğe seçilişini, Firavun’la mücadelesini, denizin yarılmasını ve İsrâiloğulları’nın Sâmirî’nin yaptığı buzağıya tapmasını anlatır. Âdem’in şeytana kanmasını hatırlatarak sabrı, namazı ve Allah’ı tesbih etmeyi öğütler.',
            akilda: '“Rabbim, ilmimi artır!” diye dua edilir.',
            cocuk: 'Hz. Mûsâ’nın Firavun’a karşı mücadelesini anlatan, “Rabbim, ilmimi artır!” duasını öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tâhâ Sûresi” maddesi']
        },
        21: {
            anlam: 'Peygamberler', emo: '💡', tema: ['peygamber', 'kissa', 'tevhid'], oneCikan: '21:107',
            konu: 'Mekke döneminde inmiştir; adını hayatlarından ve özelliklerinden söz edilen on sekiz peygamberden alır. Hesap günü yaklaştığı hâlde gaflet içinde olan müşrikleri uyarır; peygamberlerin de insan olduğunu, onları ayıranın vahiy olduğunu bildirir ve kâinattaki düzeni Allah’ın birliğine delil gösterir. İbrâhim peygamberin ateşten korunmasını, Nûh, Eyyûb, Yûnus ve Zekeriyyâ peygamberlerin dualarının kabul edildiğini anlatır; Peygamberimizin âlemlere rahmet olarak gönderildiğini bildirir.',
            akilda: 'Peygamberimiz bütün âlemlere rahmet olarak gönderilmiştir.',
            cocuk: 'Birçok peygamberin dualarını ve Allah’ın onlara yardımını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Enbiyâ Sûresi” maddesi']
        },
        22: {
            anlam: 'Hac (Kâbe’yi ziyaret)', emo: '🛤️', tema: ['ibadet', 'ahiret', 'tevhid', 'toplum'], oneCikan: '22:37',
            konu: 'Adını Hz. İbrâhim’e insanları hacca çağırmasının emredildiği ayetten alır; kıyametin dehşetini ve ölülerin diriltilmesini anlatarak başlar. Haccın amacını, kurbanı ve takvayı anlatır; kurbanların etinin ve kanının değil, takvanın Allah’a ulaştığını bildirir. Zulme uğrayan müminlere savunma için savaş izni verildiğini bildirir; geçmiş toplumların harabelerinden ibret almaya ve namaz, zekât gibi ibadetlere çağırır.',
            akilda: 'Allah’a ulaşan, kurbanın eti değil, kalpteki takvadır.',
            cocuk: 'Kâbe’yi ziyaret etmeyi, haccı ve kurbanı anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hac Sûresi” maddesi']
        },
        23: {
            anlam: 'Müminler', emo: '🌺', tema: ['ibadet', 'ahlak', 'peygamber', 'ahiret'], oneCikan: '23:1-2',
            konu: 'Mekke döneminin son yıllarında inmiştir; adını kurtuluşa eren müminlerin özelliklerini sayan ilk ayetlerden alır. Namazda huşû, boş söz ve davranıştan uzak durma, zekât, iffet, emanete ve söze bağlılık gibi özellikleri sayar; insanın yaratılış aşamalarını ve kâinattaki düzeni Allah’ın kudretine delil gösterir. Nûh’tan Mûsâ ve Îsâ’ya kadar peygamberlerin mücadelesini anlatır, kötülüğü en güzel şekilde savmayı öğütler ve “Rabbim, bağışla, merhamet et” duasıyla sona erer.',
            akilda: 'Kurtuluşa eren mümin, namazını huşû içinde kılar.',
            cocuk: 'İyi bir müminin güzel özelliklerini tek tek sayan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mü’minûn Sûresi” maddesi']
        },
        24: {
            anlam: 'Nur, ışık', emo: '🪔', tema: ['ahlak', 'toplum', 'tevhid'], oneCikan: '24:35',
            konu: 'Medine’de, hicretin beşinci yılının sonlarında Benî Mustalik Gazvesi’nin ardından inmiştir; adını Allah’ın göklerin ve yerin nuru olduğunu bildiren “nur ayeti”nden alır. Ailenin ve toplumun iffetini koruyan hükümler getirir; Hz. Âişe’ye atılan iftirayı büyük bir iftira olarak niteler ve müminlere, duydukları haberi yaymak yerine birbirleri hakkında iyi düşünmeyi öğretir. Başkasının evine izinsiz girmemeyi, bakışları korumayı ve örtünmeyi emreder; münafıkların tutumunu anlatır ve Peygamberimizin meclisindeki edebi öğretir.',
            akilda: 'Duyulan her söz yayılmaz; mümin, kardeşi hakkında iyi düşünür.',
            cocuk: 'Allah’ın nurunu anlatan, evlere izin alarak girmeyi ve kimse hakkında kötü söz yaymamayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nûr Sûresi” maddesi']
        },
        25: {
            anlam: 'Hakla bâtılı ayıran', emo: '🔍', tema: ['kuran', 'peygamber', 'ahlak', 'tevhid'], oneCikan: '25:63',
            konu: 'Mekke döneminin sonlarında inmiştir; adını Kur’an’ın bir adı olan ve hakla bâtılı ayıran anlamına gelen “furkān” kelimesinden alır. Müşriklerin Kur’an’ı uydurma saymalarına, Peygamberimizin yiyip içmesine ve çarşıda gezmesine itiraz etmelerine cevap verir; Kur’an’ın bölüm bölüm indirilmesinin hikmetini açıklar. Geçmiş kavimlerin helâkini ve kâinattaki delilleri hatırlatır; alçak gönüllü yürüyen, cahillere selamla karşılık veren, geceyi ibadetle geçiren, israftan ve cimrilikten uzak duran “Rahmân’ın kulları”nın özelliklerini sayar.',
            akilda: 'Rahmân’ın kulları alçak gönüllü yürür, kaba sözlere güzel sözle karşılık verir.',
            cocuk: 'Allah’ın sevdiği kulların alçak gönüllü ve tatlı dilli olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Furkān Sûresi” maddesi']
        },
        26: {
            anlam: 'Şairler', emo: '🪶', tema: ['kissa', 'peygamber', 'kuran'], oneCikan: '26:9',
            konu: 'Mekke döneminin ortalarında inmiştir; adını sonundaki şairlerden söz eden ayetlerden alır. İnkârcıların iman etmemesine üzülen Peygamberimizi teselli eder; Mûsâ ile Firavun’un mücadelesini geniş olarak, ardından İbrâhim, Nûh, Hûd, Sâlih, Lût ve Şuayb peygamberlerin kavimleriyle yaşadıklarını anlatır. Rabbin mutlak güç ve merhamet sahibi olduğunu bildiren ayet surede sekiz defa tekrarlanır. Kur’an’ın Cebrâil aracılığıyla indirildiğini bildirir, Peygamberimize en yakın akrabasını uyarmasını emreder ve iman edip iyi işler yapanlar dışındaki şairlerin yolunu eleştirir.',
            akilda: 'Rabbin hem mutlak güç hem engin merhamet sahibidir.',
            cocuk: 'Birçok peygamberin hikâyesini anlatan ve Allah’ın çok merhametli olduğunu hatırlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Şuarâ Sûresi” maddesi']
        },
        27: {
            anlam: 'Karıncalar', emo: '🐜', tema: ['kissa', 'peygamber', 'tevhid', 'nimet'], oneCikan: '27:18-19',
            konu: 'Mekke döneminde, Şuarâ suresinden sonra inmiştir; adını Hz. Süleymân’ın ordusu geçerken diğer karıncaları uyaran karıncanın kıssasından alır. Mûsâ peygamberin hayatından bir kesit verir; Süleymân peygamberin hükümdarlığını, hüdhüd kuşunun getirdiği haberi ve Sebe’ melikesinin iman edişini anlatır, ardından Sâlih ve Lût peygamberlerin kavimlerini anar. Göklerin ve yerin yaratılışı, yağmur ve bitkiler gibi delilleri sayarak “Allah ile beraber başka bir ilâh mı?” sorusunu tekrar tekrar sorar; gaybı yalnızca Allah’ın bildiğini bildirir.',
            akilda: 'Süleymân gibi güçlü olan da nimet için Rabbine şükreder.',
            cocuk: 'Konuşan karıncayı, hüdhüd kuşunu ve Hz. Süleymân’ı anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Neml Sûresi” maddesi']
        },
        28: {
            anlam: 'Kıssalar, olaylar', emo: '🌊', tema: ['kissa', 'peygamber', 'ahlak'], oneCikan: '28:76-77',
            konu: 'Mekke döneminde, Neml suresinden sonra inmiştir; adını “kıssa” kelimesinin çoğulu olan ve sure içinde geçen kelimeden alır. Firavun’un İsrâiloğulları’na zulmünü ve Mûsâ peygamberin bebekken suya bırakılmasından Firavun’un boğulmasına kadar hayatını anlatır. Peygamberimizin peygamberliğine yöneltilen itirazlara cevap verir; hidayetin Allah’ın dilemesine bağlı olduğunu ve dünya hayatının geçici olduğunu bildirir. Servetiyle böbürlenen Kārûn’un yerin dibine geçirilmesini anlatır; âhiret yurdunun, yeryüzünde büyüklenmeyen ve bozgunculuk istemeyenler için olduğunu bildirir.',
            akilda: 'Âhireti gözet, dünyadaki payını da unutma; Allah sana iyilik ettiği gibi sen de iyilik et.',
            cocuk: 'Hz. Mûsâ’nın bebekken suya bırakılıp Allah’ın koruması altında büyümesini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kasas Sûresi” maddesi']
        },
        29: {
            anlam: 'Örümcek', emo: '🕸️', tema: ['sabir', 'kissa', 'tevhid', 'ibadet'], oneCikan: '29:2-3',
            konu: 'Mekke döneminin sonlarında, hicrete yakın bir zamanda inmiştir; adını Allah’tan başka dostlar edinenlerin hâlini örümcek yuvasına benzeten ayetten alır. “İman ettik” demenin yeterli olmadığını, müminlerin sıkıntılarla sınanacağını bildirir; anne babaya iyiliği emreder, ancak şirke zorlarlarsa onlara uyulmayacağını söyler. Nûh, İbrâhim, Lût ve Şuayb peygamberlerin kıssalarıyla inkârcı kavimlerin âkıbetini hatırlatır. Namazın hayasızlıktan ve kötülükten alıkoyduğunu, rızkın Allah’tan olduğunu ve O’nun yolunda çaba gösterenlere yollarının gösterileceğini bildirir.',
            akilda: 'İman, sınanarak sağlamlaşır.',
            cocuk: 'Allah’tan başkasına güvenmenin örümcek ağı kadar zayıf olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ankebût Sûresi” maddesi']
        },
        30: {
            anlam: 'Rumlar (Bizanslılar)', emo: '🏛️', tema: ['tevhid', 'nimet', 'ahiret'], oneCikan: '30:21',
            konu: 'Mekke döneminin sonlarında inmiştir; adını Bizanslıların İranlılara yenildiğini ve birkaç yıl içinde galip geleceklerini haber veren ilk ayetlerden alır. Bu haber, müşriklerin yenilgiyi müslümanların aleyhine kullandığı bir sırada gelmiş ve bildirildiği gibi gerçekleşmiştir. Göklerin ve yerin yaratılışı, eşler arasındaki sevgi ve merhamet, dillerin ve renklerin farklılığı, uyku, şimşek ve yağmur gibi delillerle Allah’ın birliğini ve öldükten sonra dirilişi anlatır. İnsanı, Allah’ın yaratılışta verdiği fıtrata uygun olan hanîf dine yönelmeye çağırır.',
            akilda: 'Eşler arasındaki sevgi ve merhamet Allah’ın ayetlerindendir.',
            cocuk: 'Ailemizdeki sevgiyi, farklı dilleri ve renkleri Allah’ın işaretleri olarak anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Rûm Sûresi” maddesi']
        },
        31: {
            anlam: 'Lokmân (hikmet verilen kişi)', emo: '🌳', tema: ['ahlak', 'tevhid', 'nimet'], oneCikan: '31:17',
            konu: 'Mekke döneminde inmiştir; adını Allah’ın kendisine hikmet verdiği Lokmân’dan alır. Kur’an’ın iyilik yapanlara hidayet ve rahmet olduğunu bildirir. Lokmân’ın oğluna öğütlerini anlatır: Allah’a ortak koşmamak, anne babaya iyilik etmek, namaz kılmak, iyiliği emredip kötülükten alıkoymak, sabretmek, kibirlenmemek ve sesini alçaltmak. Allah’ın nimetlerini hatırlatır; kıyametin vaktini yalnızca Allah’ın bildiğini, yağmuru O’nun indirdiğini, rahimlerdekini O’nun bildiğini, kimsenin yarın ne kazanacağını ve nerede öleceğini bilemeyeceğini bildirir.',
            akilda: 'Namazı kıl, iyiliği emret, kötülükten alıkoy, başına gelene sabret.',
            cocuk: 'Lokmân’ın oğluna verdiği güzel öğütleri anlatan sure.',
            hadis: { metin: 'Resûlullah “Gaybın anahtarları beştir” buyurdu, sonra “Kıyamet saatini bilmek ancak Allah’a mahsustur” diye başlayan ayeti okudu.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Tefsîr, 4778', k: [['b', 4778, 'Umar']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Lokmân Sûresi” maddesi']
        },
        32: {
            anlam: 'Secde', emo: '🛐', tema: ['ibadet', 'tevhid', 'ahiret', 'kuran'], oneCikan: '32:15-16',
            konu: 'Mekke döneminin son yıllarında, Mü’minûn suresinden sonra inmiştir; adını ayetler hatırlatıldığında secdeye kapanan müminleri anlatan ayetten alır ve bu ayet bir secde ayetidir. Kur’an’ın Allah katından indiğini, göklerin ve yerin yaratılışını, insanın çamurdan yaratılıp ona ruh üflenmesini anlatır. Âhireti inkâr edenlerin pişmanlığını ve geceleri yataklarından kalkıp korku ve ümitle Rablerine yalvaran müminlerin mükâfatını anlatır; mümin ile yoldan çıkmışın bir olmadığını bildirir.',
            akilda: 'Mümin, geceleri de korku ve ümitle Rabbine yalvarır.',
            cocuk: 'Allah’a secde eden ve geceleri dua eden müminleri anlatan sure.',
            hadis: { metin: 'Resûlullah cuma günü sabah namazında birinci rekâtta Secde suresini, ikinci rekâtta İnsân suresini okurdu.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Cum‘a, 880', k: [['m', 880, 'Huraira']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Secde Sûresi” maddesi']
        },
        33: {
            anlam: 'Birleşik düşman grupları', emo: '⛺', tema: ['toplum', 'peygamber', 'ahlak', 'sabir'], oneCikan: '33:21',
            konu: 'Medine döneminde inmiştir; adını Medine’yi kuşatmaya gelen müttefik düşman kuvvetlerinden alır ve bir bölümü Hendek Savaşı üzerine inmiştir. Evlatlığın öz evlat sayılması gibi cahiliye âdetlerini kaldırır; kuşatmada müminlerin sebatını, münafıkların bahanelerini anlatır ve Resûlullah’ın müminler için en güzel örnek olduğunu bildirir. Peygamberimizin peygamberlerin sonuncusu olduğunu bildirir; aile hayatı, eşleri ve görgü kuralları hakkında hükümler getirir, Allah’ı çokça anmayı, doğru söz söylemeyi ve emanete riayeti öğütler.',
            akilda: 'Resûlullah, müminler için en güzel örnektir.',
            cocuk: 'Peygamberimizin bizim için en güzel örnek olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ahzâb Sûresi” maddesi']
        },
        34: {
            anlam: 'Sebe’ kavmi', emo: '🏞️', tema: ['ahiret', 'kissa', 'nimet', 'tevhid'], oneCikan: '34:46',
            konu: 'Mekke döneminde, Lokmân suresinden sonra inmiştir; adını nimetlere nankörlük ettiği için sel ile cezalandırılan Sebe’ kavminden alır. Öldükten sonra dirilişin mümkün olduğunu ve herkesin yaptığının karşılığını göreceğini bildirir. Dâvûd ve Süleymân peygamberlere verilen nimetleri, bahçeleri yok olan Sebe’ halkının nankörlüğüyle karşılaştırır. Mal ve evladın insanı Allah’a yaklaştırmadığını, Peygamberimizin bütün insanlara müjdeleyici ve uyarıcı olarak gönderildiğini bildirir; insanları Allah için kalkıp düşünmeye çağırır.',
            akilda: 'Nimet, şükürle korunur.',
            cocuk: 'Nimetlere şükreden Dâvûd ve Süleymân peygamberleri ve şükretmeyen Sebe’ halkını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Sebe’ Sûresi” maddesi']
        },
        35: {
            anlam: 'Yoktan yaratan', emo: '🌤️', tema: ['tevhid', 'nimet', 'kuran'], oneCikan: '35:15',
            konu: 'Mekke döneminin ortalarında inmiştir; adını ilk ayette Allah’ın sıfatı olarak geçen ve “yoktan yaratan” anlamına gelen kelimeden alır, “Melâike suresi” diye de anılır. Gökleri ve yeri yaratanın, melekleri elçi kılanın, yağmurla ölü toprağı canlandıranın Allah olduğunu, O’ndan başka yalvarılanların hiçbir şeye sahip olmadığını bildirir. Kimsenin başkasının günah yükünü taşımayacağını, Allah’tan en çok bilginlerin korktuğunu ve Allah’ın kitabını okuyup namaz kılan, rızkından infak edenlerin asla zarar etmeyecek bir kazanç umduğunu bildirir.',
            akilda: 'İnsan Allah’a muhtaçtır; Allah ise hiçbir şeye muhtaç değildir.',
            cocuk: 'Gökleri, yeri, melekleri ve yağmuru yaratan Allah’ı anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fâtır Sûresi” maddesi']
        },
        36: {
            anlam: 'Yâ ve Sîn harfleri', emo: '💖', tema: ['tevhid', 'peygamber', 'ahiret'], oneCikan: '36:82',
            konu: 'Adını başındaki iki harften alır. Tevhid, peygamberlik ve âhiret inancını işler; Kur’an’ın Allah katından geldiğini ve Peygamberimizin gönderilmiş bir elçi olduğunu bildirir. Elçileri yalanlayan bir kasaba halkının kıssasını anlatır, tabiattaki düzeni delil olarak gösterir ve öldükten sonra dirilişi hatırlatır.',
            akilda: 'Allah bir şeyi dilediğinde ona “Ol!” der, o da hemen olur.',
            cocuk: 'Allah’ın her şeye gücünün yettiğini ve insanların yeniden diriltileceğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Yâsîn Sûresi” maddesi']
        },
        37: {
            anlam: 'Saf saf dizilenler', emo: '🔆', tema: ['tevhid', 'ahiret', 'kissa', 'peygamber'], oneCikan: '37:180-182',
            konu: 'Mekke döneminde inmiştir; adını saf saf dizilen meleklere yeminle başlayan ilk ayetten alır. Allah’ın bir olduğunu ve âhiret hayatını anlatır; cennet ehlinin nimetlerini ve cehennem ehlinin hâlini tasvir eder. Nûh, İbrâhim, Mûsâ, Hârûn, İlyâs, Lût ve Yûnus peygamberlerin kıssalarını anlatır; İbrâhim peygamberin oğlunu kurban etmekle sınanmasını ve teslimiyetini bildirir. Melekleri Allah’ın kızları sayan müşriklerin inancını reddeder; Allah’ı tesbih, peygamberlere selam ve âlemlerin Rabbine hamd ile sona erer.',
            akilda: 'Hamd, âlemlerin Rabbi Allah’adır.',
            cocuk: 'Hz. İbrâhim’in teslimiyetini, Hz. Yûnus’u ve birçok peygamberi anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Sâffât Sûresi” maddesi']
        },
        38: {
            anlam: 'Sâd harfi', emo: '🦅', tema: ['peygamber', 'kissa', 'tevhid', 'sabir'], oneCikan: '38:29',
            konu: 'Mekke döneminde inmiştir; adını başındaki “sâd” harfinden alır. Rivayete göre ilk ayetleri, Kureyş’in ileri gelenlerinin Ebû Tâlib’e gelip Peygamberimizin davetini durdurmasını istemeleri üzerine inmiştir. Dâvûd, Süleymân, Eyyûb, İbrâhim, İshak, Yâkub, İsmâil, Elyesa‘ ve Zülkifl peygamberleri anarak onların sabrını, tevbesini ve şükrünü örnek gösterir; cennet ve cehennem ehlinin hâlini anlatır. Âdem’in yaratılışını ve İblîs’in kibirlenerek secde etmeyi reddedişini anlatarak sona erer.',
            akilda: 'Kur’an, ayetleri üzerinde düşünülsün diye indirilmiş mübarek bir kitaptır.',
            cocuk: 'Hz. Dâvûd, Hz. Süleymân ve Hz. Eyyûb’un sabrını ve şükrünü anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Sâd Sûresi” maddesi']
        },
        39: {
            anlam: 'Zümreler, topluluklar', emo: '🚪', tema: ['tevhid', 'ahiret', 'kuran'], oneCikan: '39:53',
            konu: 'Mekke döneminin ortalarında inmiştir; adını âhirette inkârcıların ve müminlerin zümre zümre cehenneme ve cennete götürülmesini anlatan ayetlerden alır. Kur’an’ın Allah katından indiğini bildirir, dini yalnızca Allah’a has kılarak O’na kulluk etmeye çağırır. Kur’an’ı sözün en güzeli olarak niteler, uykuyu ölüme benzetir ve sıkıntıda Allah’a yalvarıp nimete kavuşunca O’nu unutan insanı eleştirir. Günahlarla kendine kötülük edenlere Allah’ın rahmetinden ümit kesmemelerini, tövbe edip O’na yönelmelerini söyler.',
            akilda: 'Allah’ın rahmetinden ümit kesilmez; tövbe edene kapı her zaman açıktır.',
            cocuk: 'Hata yapınca bile Allah’ın rahmetinden ümidimizi kesmememizi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Zümer Sûresi” maddesi']
        },
        40: {
            anlam: 'Mümin, inanan kişi', emo: '💬', tema: ['tevhid', 'kissa', 'dua', 'sabir'], oneCikan: '40:60',
            konu: 'Mekke döneminde inmiştir; adını Firavun ailesinden olup imanını gizleyen bir müminin konuşmalarından alır ve “Hâ mîm” ile başlayan yedi surenin ilkidir. Allah’ın günahları bağışlayan, tövbeleri kabul eden ve cezası çetin olan tek ilâh olduğunu bildirir; arşı taşıyan meleklerin müminler için bağışlanma dilediğini anlatır. Mûsâ ile Firavun’un mücadelesini ve o mümin kişinin kavmine öğütlerini anlatır. Peygamberimize ve müminlere sabrı, bağışlanma dilemeyi ve Allah’a dua etmeyi öğütler; azabı görünce getirilen imanın fayda vermeyeceğini bildirir.',
            akilda: 'Allah, kendisine dua edenin duasına icabet eder.',
            cocuk: 'Allah’a dua etmeyi öğreten ve Firavun’un sarayındaki cesur bir mümini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mü’min Sûresi” maddesi']
        },
        41: {
            anlam: 'Ayrıntılı olarak açıklanmış', emo: '📃', tema: ['kuran', 'tevhid', 'ahiret', 'ahlak'], oneCikan: '41:34',
            konu: 'Mekke döneminin sonlarında inmiştir; adını Kur’an’ın ayetlerinin ayrıntılı olarak açıklandığını bildiren ayetten alır ve içinde bir secde ayeti vardır. Göklerin ve yerin yaratılışını anlatır, Âd ve Semûd kavimlerinin helâkini hatırlatır; âhirette inkârcıların kulaklarının, gözlerinin ve derilerinin aleyhlerine şahitlik edeceğini bildirir. “Rabbimiz Allah’tır” deyip dosdoğru olanlara meleklerin inip müjde vereceğini, kötülüğü en güzel şekilde savmanın düşmanı dosta çevireceğini öğretir. Kur’an’ın müminler için hidayet ve şifa olduğunu bildirir.',
            akilda: 'Kötülüğü iyilikle savan, düşmanını dosta çevirebilir.',
            cocuk: 'Kötülüğe iyilikle karşılık vermeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fussılet Sûresi” maddesi']
        },
        42: {
            anlam: 'Danışma', emo: '💭', tema: ['toplum', 'ahlak', 'kuran', 'tevhid'], oneCikan: '42:36-38',
            konu: 'Mekke döneminde, Fussılet suresinden sonra inmiştir; adını müminlerin işlerini aralarında danışarak yürüttüğünü bildiren ayetten alır. Allah’ın birliğini, vahyin ve peygamberliğin tek kaynaktan geldiğini, bütün peygamberlere dini ayakta tutup ayrılığa düşmemenin emredildiğini bildirir. Dünya metaının geçici olduğunu hatırlatır; Allah’a güvenen, büyük günahlardan kaçınan, öfkelendiğinde bağışlayan, namaz kılan, işlerini danışarak yürüten ve infak eden müminleri över. Allah’ın insanla ancak vahiy yoluyla, perde arkasından ya da bir elçi göndererek konuştuğunu bildirerek sona erer.',
            akilda: 'Müminler işlerini aralarında danışarak yürütür.',
            cocuk: 'Birlikte karar verirken danışmayı ve öfkelenince bağışlamayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Şûrâ Sûresi” maddesi']
        },
        43: {
            anlam: 'Altın, süs', emo: '💍', tema: ['tevhid', 'peygamber', 'ahiret', 'kissa'], oneCikan: '43:67',
            konu: 'Mekke döneminde inmiştir; adını dünya süsünün Allah katındaki değersizliğini anlatan ayette geçen “zuhruf” kelimesinden alır. Melekleri Allah’ın kızları sayanları ve atalarını körü körüne taklit edenleri eleştirir; İbrâhim peygamberin tevhid inancını soyuna miras bıraktığını anlatır. Kur’an’ın zengin bir adama indirilmesi gerektiğini söyleyenlere cevap verir; Mûsâ ile Firavun’un mücadelesini ve Îsâ hakkındaki tartışmaları anlatır. Kıyametin ansızın geleceğini, o gün takva sahipleri dışında dostların birbirine düşman olacağını bildirir.',
            akilda: 'Takva üzerine kurulan dostluk âhirette de sürer.',
            cocuk: 'Altın ve süsün değil, Allah için kurulan dostluğun kalıcı olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Zuhruf Sûresi” maddesi']
        },
        44: {
            anlam: 'Duman', emo: '🌫️', tema: ['kuran', 'kissa', 'ahiret'], oneCikan: '44:2-3',
            konu: 'Mekke döneminin sonlarında inmiştir; adını inkârcıları saracak bir azap olarak gökten inecek dumanı haber veren ayetten alır. Kur’an’ın mübarek bir gecede, Allah’tan bir rahmet olarak indirildiğini bildirerek başlar. Firavun ve kavminin helâkini Mekke müşriklerine ibret olarak anlatır; helâk olanlar için ne göğün ne de yerin ağladığını bildirir. İnkârcıları bekleyen azabı ve takva sahiplerine vaat edilen cennet nimetlerini anlatır; Kur’an’ın öğüt alınsın diye kolaylaştırıldığını bildirerek sona erer.',
            akilda: 'Kur’an, mübarek bir gecede bir rahmet olarak indirilmiştir.',
            cocuk: 'Kur’an’ın mübarek bir gecede indiğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Duhân Sûresi” maddesi']
        },
        45: {
            anlam: 'Diz çöken', emo: '📒', tema: ['ahiret', 'tevhid', 'kuran'], oneCikan: '45:15',
            konu: 'Mekke döneminde, Duhân suresinden sonra inmiştir; adını kıyamet günü her ümmetin diz çökmüş hâlde kitabına çağrılacağını bildiren ayetten alır. Göklerde, yerde, gece ile gündüzün art arda gelişinde ve yağmurla canlanan toprakta düşünenler için deliller bulunduğunu bildirir. İsrâiloğulları’na verilen kitabı ve peygamberliği hatırlatır; hevesini ilâh edinenleri ve “Bizi ancak zaman yok eder” diyerek âhireti inkâr edenleri eleştirir. Herkesin yaptığının karşılığını göreceğini bildirir ve Allah’a hamd ile sona erer.',
            akilda: 'İyilik yapan kendi iyiliğine, kötülük yapan kendi aleyhine yapar.',
            cocuk: 'Yaptığımız her iyiliğin bize döneceğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Câsiye Sûresi” maddesi']
        },
        46: {
            anlam: 'Kum tepeleri', emo: '🌪️', tema: ['ahlak', 'kissa', 'peygamber', 'sabir'], oneCikan: '46:15',
            konu: 'Mekke döneminde, Câsiye suresinden sonra inmiştir; adını Hûd peygamberin Âd kavmini uyardığı kum tepeleriyle kaplı bölgeden alır. Göklerin ve yerin bir amaçla yaratıldığını, Allah’tan başkasına yalvarmanın anlamsızlığını ve Kur’an’ın vahiy olduğunu bildirir. Anne babaya iyilik etmeyi emreder ve olgunluk çağına eren müminin şükür duasını öğretir; Âd kavminin helâkini ibret olarak anlatır. Kur’an’ı dinleyip kavimlerine uyarıcı olarak dönen bir grup cinden söz eder ve Peygamberimize, azim sahibi peygamberler gibi sabretmesini öğütler.',
            akilda: 'Anne babaya iyilik, Allah’ın insana tavsiyesidir.',
            cocuk: 'Annemizin bizi büyük zorluklarla taşıdığını hatırlatıp anne babamıza iyi davranmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ahkāf Sûresi” maddesi']
        },
        47: {
            anlam: 'Muhammed (Peygamberimizin adı)', emo: '🍯', tema: ['toplum', 'peygamber', 'sabir', 'ahiret'], oneCikan: '47:7',
            konu: 'Medine döneminde inmiştir; adını ikinci ayette geçen Peygamberimizin adından alır ve “Kıtâl” (savaş) suresi diye de anılır. İnkâr edip Allah yolundan alıkoyanlarla iman edip iyi işler yapanların durumunu karşılaştırır; savaşla ilgili hükümleri ve esirlere yapılacak muameleyi bildirir, Allah’ın dinine yardım edenlere Allah’ın da yardım edeceğini müjdeler. Takva sahiplerine vaat edilen cenneti ırmaklarıyla tasvir eder; münafıkların iki yüzlülüğünü ve Kur’an üzerinde düşünmeyişlerini eleştirir. Müminleri sebata, itaate ve Allah yolunda harcamaya çağırır; yüz çevirirlerse Allah’ın yerlerine başka bir toplum getireceğini bildirir.',
            akilda: 'Allah’ın dinine yardım edene Allah da yardım eder.',
            cocuk: 'Peygamberimizin adını taşıyan, Allah’ın müminlere yardım ettiğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Muhammed Sûresi” maddesi']
        },
        48: {
            anlam: 'Zafer, açılış', emo: '🕊️', tema: ['peygamber', 'toplum'], oneCikan: '48:1',
            konu: 'Hudeybiye Antlaşması’ndan sonra Medine’ye dönüş yolunda inmiştir. Görünüşte geri dönüş olan bu antlaşmayı apaçık bir zafer olarak müjdeler ve müminlerin kalplerine huzur verir. Ağaç altında Peygamberimize biat eden müminlerden Allah’ın hoşnut olduğunu bildirir, sefere katılmayan bedevîleri eleştirir ve yakın bir zaferi haber verir.',
            akilda: 'Sabırla yapılan barış, zaferin kapısını açabilir.',
            cocuk: 'Peygamberimize ve müminlere büyük bir zaferin müjdelendiği sure.',
            hadis: { metin: 'Bir yolculukta Resûlullah, “Bu gece bana bir sure indi ki benim için üzerine güneşin doğduğu her şeyden daha sevimlidir” buyurdu ve “Doğrusu Biz sana apaçık bir zafer sağlamışızdır” ayetini okudu.', ravi: 'Hz. Ömer', kaynak: 'Buhârî, Meğâzî, 4177', k: [['b', 4177, 'Umar']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Feth Sûresi” maddesi']
        },
        49: {
            anlam: 'Odalar', emo: '🏠', tema: ['ahlak', 'toplum'], oneCikan: '49:13',
            konu: 'Medine döneminin son yıllarında inmiştir; adını Peygamberimizin ailesinin mescidin yanındaki odalarından alır. Allah’a ve Resûlü’ne saygıyı, gelen haberi araştırmayı ve müminler arasında barışı emreder. Alay etmeyi, kötü lakap takmayı, kötü zannı, birbirinin kusurunu araştırmayı ve gıybeti yasaklar. İnsanların bir erkekle bir dişiden yaratıldığını, Allah katında üstünlüğün yalnızca takvada olduğunu bildirir.',
            akilda: 'Allah katında en değerli olan, O’na karşı gelmekten en çok sakınandır.',
            cocuk: 'Kardeşçe yaşamayı, alay etmemeyi ve kimseyi arkasından çekiştirmemeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hucurât Sûresi” maddesi']
        },
        50: {
            anlam: 'Kāf harfi', emo: '❤️', tema: ['ahiret', 'tevhid', 'nimet'], oneCikan: '50:16',
            konu: 'Mekke döneminde inmiştir; adını başındaki “kāf” harfinden alır. Gök, yer, dağlar, yağmur, hurma ağaçları ve bitkiler gibi delilleri sayarak öldükten sonra dirilmenin Allah için kolay olduğunu bildirir; peygamberlerini yalanlayan eski kavimleri hatırlatarak Peygamberimizi teselli eder. Allah’ın insana şah damarından daha yakın olduğunu, gönlünden geçeni bildiğini ve iki meleğin onun her sözünü yazdığını haber verir. Ölüm sarhoşluğunu, kıyameti, cehennemi ve takva sahiplerine yaklaştırılan cenneti anlatır; Peygamberimize sabretmeyi ve Rabbini tesbih etmeyi öğütler.',
            akilda: 'Allah insana şah damarından daha yakındır.',
            cocuk: 'Allah’ın bize çok yakın olduğunu ve her sözümüzün yazıldığını anlatan sure.',
            hadis: { metin: 'Kāf suresini ancak Resûlullah’ın ağzından öğrendim; o, her cuma minberde insanlara hutbe okurken bu sureyi okurdu.', ravi: 'Ümmü Hişâm bint Hârise', kaynak: 'Müslim, Cum‘a, 873', k: [['m', 873, 'Hisham']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Kāf Sûresi” maddesi']
        },
        51: {
            anlam: 'Savuran rüzgârlar', emo: '🌬️', tema: ['ahiret', 'tevhid', 'ibadet', 'kissa'], oneCikan: '51:56',
            konu: 'Mekke döneminin ortalarında inmiştir; adını savuran rüzgârlara yeminle başlayan ilk ayetten alır. Âhiretin mutlaka gerçekleşeceğini bildirir; geceleri az uyuyup seherlerde bağışlanma dileyen, mallarında isteyenin ve yoksulun hakkını gözeten takva sahiplerini över. İbrâhim peygamberin misafirlerini, Lût, Firavun, Âd, Semûd ve Nûh kavimlerinin helâkini anlatır. Göğün kuruluşunu, yerin döşenişini ve her şeyin çift yaratılışını hatırlatır; cinlerin ve insanların yalnızca Allah’a kulluk etmek için yaratıldığını bildirir.',
            akilda: 'İnsan, Allah’a kulluk etmek için yaratılmıştır.',
            cocuk: 'Rüzgârları ve gökyüzünü anlatıp bizim Allah’a kulluk için yaratıldığımızı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Zâriyât Sûresi” maddesi']
        },
        52: {
            anlam: 'Dağ (Tûr Dağı)', emo: '🗻', tema: ['ahiret', 'peygamber', 'sabir'], oneCikan: '52:48',
            konu: 'Mekke döneminin ikinci yarısında, müşriklerin müminlere baskı yaptığı yıllarda inmiştir; adını yeminle başlayan ilk ayetteki Tûr dağından alır. Tûr dağına, yazılmış kitaba, göğe ve kaynayan denize yemin ederek Allah’ın azabının mutlaka geleceğini bildirir. Takva sahiplerinin cennette, imanda kendilerine uyan nesilleriyle birlikte olacağını anlatır. Peygamberimize kâhin, mecnun ve şair diyenlere cevap verir; ona sabretmesini ve Rabbini hamd ile tesbih etmesini öğütler.',
            akilda: 'Sabreden mümin, Rabbinin gözetimi altındadır.',
            cocuk: 'Peygamberimize sabretmeyi öğütleyen ve cennette ailelerin buluşacağını müjdeleyen sure.',
            hadis: { metin: 'Peygamberimizi akşam namazında Tûr suresini okurken işittim. “Onlar, yaratan olmaksızın mı yaratıldılar yoksa yaratanlar kendileri midir?” ayetlerine gelince kalbim neredeyse yerinden uçacaktı.', ravi: 'Cübeyr b. Mut‘im', kaynak: 'Buhârî, Tefsîr, 4854', k: [['b', 4854, 'Jubair']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Tûr Sûresi” maddesi']
        },
        53: {
            anlam: 'Yıldız', emo: '✴️', tema: ['peygamber', 'kuran', 'tevhid', 'ahiret'], oneCikan: '53:39-41',
            konu: 'Mekke döneminde inmiştir ve iniş sırasına göre içinde secde ayeti bulunan ilk suredir; adını yeminle başlayan ilk ayetteki “yıldız” kelimesinden alır. Peygamberimizin doğru yoldan sapmadığını, kendi arzusuyla konuşmadığını ve Kur’an’ın Cebrâil aracılığıyla gelen bir vahiy olduğunu bildirir. Lât, Uzzâ ve Menât gibi putlara tapmanın anlamsızlığını gösterir. İnsan için ancak çalıştığının olduğunu, kimsenin başkasının yükünü taşımayacağını bildirir ve Allah’a secde etmeye çağırarak sona erer.',
            akilda: 'İnsan için ancak çalıştığı vardır.',
            cocuk: 'Peygamberimize vahyin gelişini anlatan, çalışmanın karşılığını öğreten sure.',
            hadis: { metin: 'Peygamberimiz Necm suresini okuyup bitirince secde etti; yanındaki müslümanlar, müşrikler, cinler ve insanlar da onunla birlikte secde etti.', ravi: 'İbn Abbas', kaynak: 'Buhârî, Tefsîr, 4862', k: [['b', 4862, 'Abbas']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Necm Sûresi” maddesi']
        },
        54: {
            anlam: 'Ay', emo: '🌗', tema: ['ahiret', 'kissa', 'kuran'], oneCikan: '54:17',
            konu: 'Mekke döneminin ilk yıllarında inmiştir; adını kıyametin yaklaştığını ve ayın yarıldığını bildiren ilk ayetten alır. Bu mucizeyi görüp de “süregelen bir büyü” diyerek yüz çeviren inkârcıları uyarır. Nûh, Âd, Semûd, Lût ve Firavun kavimlerinin peygamberlerini yalanlayıp helâk edilmesini anlatır; Kur’an’ın öğüt alınsın diye kolaylaştırıldığını bildiren ayet surede dört defa tekrarlanır. Her şeyin bir ölçüyle yaratıldığını bildirir ve takva sahiplerinin cennetteki yerini anlatarak sona erer.',
            akilda: 'Kur’an, öğüt almak isteyen herkes için kolaylaştırılmıştır.',
            cocuk: 'Ayın ikiye ayrılmasını anlatan ve Kur’an’ın kolay anlaşılsın diye indirildiğini söyleyen sure.',
            hadis: { metin: 'Resûlullah’ın zamanında ay iki parçaya ayrıldı; bir parçası dağın üzerinde kaldı, diğeri dağın ötesine geçti. Resûlullah “Şahit olun” buyurdu.', ravi: 'Abdullah b. Mes‘ûd', kaynak: 'Buhârî, Tefsîr, 4864', k: [['b', 4864, 'Masud']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Kamer Sûresi” maddesi']
        },
        55: {
            anlam: 'Merhameti sonsuz olan', emo: '🌸', tema: ['nimet', 'tevhid', 'ahiret'], oneCikan: '55:13',
            konu: 'Adını ilk ayetindeki Rahmân isminden alır ve büyük bölümünde ilâhî rahmetin izlerini anlatır. Kur’an’ı öğretmesi, insana konuşmayı öğretmesi, gök, yer, denizler ve rızıklar gibi nimetleri sayar; “Rabbinizin nimetlerinden hangisini yalanlarsınız?” sorusunu tekrar tekrar sorar. Yeryüzündeki her şeyin yok olacağını, yalnızca Allah’ın baki kalacağını bildirir; inkârcıların âkıbetini ve müminlerin cennetteki hayatını tasvir eder.',
            akilda: 'Her nimet Allah’tandır; şükür, bu nimetleri görmekle başlar.',
            cocuk: 'Allah’ın bize verdiği güzellikleri tek tek sayan ve “Hangisini yalanlarsınız?” diye soran sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Rahmân Sûresi” maddesi']
        },
        56: {
            anlam: 'Mutlaka gerçekleşecek olay', emo: '🌾', tema: ['ahiret', 'nimet'], oneCikan: '56:62',
            konu: 'Kıyametin mutlaka kopacağını ve o gün insanların üç gruba ayrılacağını anlatır: öne geçenler, sağdakiler ve soldakiler. Öne geçenlerin ve sağdakilerin cennetteki nimetlerini, soldakilerin azabını tasvir eder. İnsanın yaratılışı, ekin, su ve ateş örnekleriyle öldükten sonra diriltmenin Allah’ın gücü içinde olduğunu hatırlatır.',
            akilda: 'İlk defa yaratan, yeniden diriltmeye de kadirdir.',
            cocuk: 'Kıyamet gününü ve iyi insanları bekleyen cenneti anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Vâkıa Sûresi” maddesi']
        },
        57: {
            anlam: 'Demir', emo: '🔩', tema: ['tevhid', 'toplum', 'ahlak', 'ahiret'], oneCikan: '57:7',
            konu: 'Çoğunluğa göre Medine’de inmiştir; adını insanlara birçok faydası olan demirin indirildiğini bildiren ayetten alır ve tesbihle başlayan, “müsebbihât” denilen beş surenin ilkidir. Göklerde ve yerde ne varsa Allah’ı tesbih ettiğini, O’nun ilminin ve kudretinin her şeyi kuşattığını bildirir; Allah’a ve Resûlü’ne iman edip Allah yolunda harcamaya çağırır. Âhirette müminlerin nurlarının önlerinde koşacağını, münafıkların ise karanlıkta kalacağını anlatır; dünya hayatının bir oyun, eğlence ve övünme olduğunu hatırlatarak bağışlanma ve cennet için yarışmaya çağırır. Peygamberlerin, insanlar adaleti ayakta tutsun diye kitap ve ölçüyle gönderildiğini bildirir.',
            akilda: 'Dünya geçicidir; asıl yarışılacak olan Allah’ın bağışlaması ve cennettir.',
            cocuk: 'Allah yolunda paylaşmayı ve iyilikte yarışmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hadîd Sûresi” maddesi']
        },
        58: {
            anlam: 'Tartışan kadın', emo: '👂', tema: ['toplum', 'ahlak'], oneCikan: '58:11',
            konu: 'Medine döneminin son yıllarında inmiştir; adını, kocası cahiliye âdeti olan zıhâr ile onu kendine haram kılınca Peygamberimize gelip tartışan ve Allah’a şikâyette bulunan Havle bint Sa‘lebe’den söz eden ilk ayetten alır. Allah’ın bu kadının sözünü işittiğini bildirir, zıhârı geçersiz sayar ve bunu yapanın keffâret ödemesini emreder. Müminlere karşı gizli fısıldaşmayı ve Peygamberimizi alaylı biçimde selamlamayı kınar; toplantılarda yer açmayı öğretir ve Allah’ın iman edenleri ve ilim verilenleri derecelerle yükselteceğini bildirir. Müminlerin, akrabaları bile olsa Allah’a ve Resûlü’ne düşmanlık edenleri dost edinmeyeceğini bildirir.',
            akilda: 'Allah, kendisine derdini açan kulunun sesini işitir.',
            cocuk: 'Derdini Allah’a anlatan bir kadının sesinin işitildiğini anlatan ve toplantılarda birbirimize yer açmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mücâdile Sûresi” maddesi']
        },
        59: {
            anlam: 'Toplama, sürgün', emo: '🏘️', tema: ['toplum', 'tevhid', 'ahlak'], oneCikan: '59:22-24',
            konu: 'Medine’de, Uhud Savaşı’ndan sonra inmiştir; adını, antlaşmayı bozan Benî Nadîr yahudilerinin Medine’den ilk sürgününü anlatan ayetteki ifadeden alır. Bu olayı ve onlardan savaşsız elde edilen malların, servet yalnızca zenginler arasında dolaşmasın diye nasıl paylaştırılacağını bildirir. Muhacirleri kendilerine tercih eden ensarın cömertliğini över, münafıkların aldatıcı vaatlerini anlatır. Herkesi yarın için ne hazırladığına bakmaya çağırır ve Allah’ın güzel isimlerini sayan ayetlerle sona erer.',
            akilda: 'Mümin, ihtiyacı olsa bile kardeşini kendine tercih edebilir.',
            cocuk: 'Medineli müslümanların Mekke’den gelen kardeşlerine kucak açmasını anlatan ve Allah’ın güzel isimlerini sayan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Haşr Sûresi” maddesi']
        },
        60: {
            anlam: 'İmtihan edilen kadın', emo: '✉️', tema: ['toplum', 'ahlak', 'peygamber'], oneCikan: '60:8',
            konu: 'Medine’de, Hudeybiye Antlaşması ile Mekke’nin fethi arasında inmiştir; adını hicret edip gelen kadınların imanlarının sınanmasını emreden ayetten alır. Büyük bölümü, bir sahâbînin Peygamberimizin sefer hazırlığını Mekkeli akrabalarına gizlice bildirmeye çalışması üzerine inmiştir; müminlere, dinleri yüzünden kendileriyle savaşan inkârcıları dost edinmemelerini öğütler ve İbrâhim peygamberi örnek gösterir. Din uğrunda savaşmayan ve yurtlarından çıkarmayanlara iyilik ve adaletle davranmanın yasaklanmadığını bildirir. Hicret eden mümin kadınların durumunu ve kadınların Peygamberimize verdiği biatın şartlarını anlatır.',
            akilda: 'Müminlere düşmanlık etmeyenlere iyilik ve adaletle davranılır.',
            cocuk: 'Bize kötülük etmeyen herkese iyi ve adaletli davranmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mümtehine Sûresi” maddesi']
        },
        61: {
            anlam: 'Saf, sıra', emo: '🧱', tema: ['ahlak', 'toplum', 'peygamber'], oneCikan: '61:2-3',
            konu: 'Çoğunluğa göre Medine’de, Uhud Savaşı’ndan sonra inmiştir; adını Allah yolunda kenetlenmiş bir duvar gibi saf bağlayanları anlatan ayetten alır. Müminleri yapmayacakları şeyi söylememeye, sözleriyle davranışlarını uyumlu kılmaya çağırır; Mûsâ’nın kavminin ona eziyet ettiğini hatırlatır. Îsâ’nın Tevrat’ı doğruladığını ve kendisinden sonra Ahmed adında bir peygamber geleceğini müjdelediğini bildirir. Müminleri malları ve canlarıyla Allah yolunda çaba göstermeye çağırır, havârîleri örnek gösterir.',
            akilda: 'Mümin, yapmayacağı şeyi söylemez.',
            cocuk: 'Söylediğimizi yapmayı ve birlik olmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Saf Sûresi” maddesi']
        },
        62: {
            anlam: 'Cuma (toplanma günü)', emo: '🕌', tema: ['ibadet', 'peygamber'], oneCikan: '62:9',
            konu: 'Medine’de, muhtemelen hicretin ilk yılında inmiştir. Peygamberimizin ayetleri okuyup insanları arındırdığını, onlara kitabı ve hikmeti öğrettiğini bildirir. Kendilerine Tevrat öğretildiği hâlde gereğini yapmayanları kitap yüklü merkebe benzetir. Cuma günü ezan okununca alışverişi bırakıp Allah’ı anmaya koşmayı, namaz bitince de yeryüzüne dağılıp Allah’ı çokça anmayı emreder.',
            akilda: 'Cuma namazının vakti gelince dünya işi bir kenara bırakılır.',
            cocuk: 'Cuma namazına koşmayı öğreten sure.',
            hadis: { metin: 'Resûlullah’ı cuma namazında bu iki sureyi, Cuma ve Münâfikûn surelerini okurken işittim.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Cum‘a, 877', k: [['m', 877, 'Huraira']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Cuma Sûresi” maddesi']
        },
        63: {
            anlam: 'Münafıklar, iki yüzlüler', emo: '🎭', tema: ['ahlak', 'toplum'], oneCikan: '63:9',
            konu: 'Medine’de inmiştir; ilk ayetleri Benî Mustalik Gazvesi sırasında, münafıkların başı Abdullah İbn Übey’in “Medine’ye dönersek şerefli olanlar alçakları oradan çıkaracak” demesi üzerine inmiştir. Münafıkların iman ettiklerine dair yeminlerini, dış görünüşleri hoş olsa da içlerinin boş olduğunu anlatır ve şerefin Allah’a, Peygamberine ve müminlere ait olduğunu bildirir. Müminleri, mallarının ve çocuklarının kendilerini Allah’ı anmaktan alıkoymasına karşı uyarır; ölüm gelmeden önce Allah yolunda harcamaya çağırır.',
            akilda: 'Mal ve çocuk, Allah’ı anmaya engel olmamalıdır.',
            cocuk: 'Söylediği ile kalbindeki bir olmayanları anlatan ve Allah’ı anmayı unutmamayı öğreten sure.',
            hadis: { metin: 'Resûlullah’ı cuma namazında bu iki sureyi, Cuma ve Münâfikûn surelerini okurken işittim.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Cum‘a, 877', k: [['m', 877, 'Huraira']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Münâfikūn Sûresi” maddesi']
        },
        64: {
            anlam: 'Aldanış', emo: '🪙', tema: ['tevhid', 'ahiret', 'ahlak'], oneCikan: '64:16',
            konu: 'Çoğunluğa göre Medine’de inmiştir ve tesbihle başlayan beş surenin sonuncusudur; adını kıyamet gününü kimin aldandığının ortaya çıkacağı gün olarak niteleyen ayetten alır. Göklerde ve yerde ne varsa Allah’ı tesbih ettiğini, Allah’ın insanı en güzel biçimde yarattığını ve gizli açık her şeyi bildiğini bildirir; Allah’a, Peygamberine ve indirilen nura iman etmeye çağırır. Hiçbir musibetin Allah’ın izni olmadan gelmeyeceğini bildirir. Malın ve çocukların bir imtihan olduğunu hatırlatır; affetmeyi, gücü yettiğince Allah’tan sakınmayı ve cimrilikten kurtulup infak etmeyi öğütler.',
            akilda: 'Kurtuluş, gönül cimriliğinden korunup paylaşmaktadır.',
            cocuk: 'Başımıza gelen her şeyin Allah’ın bilgisi içinde olduğunu anlatan ve paylaşmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tegābün Sûresi” maddesi']
        },
        65: {
            anlam: 'Boşanma', emo: '🏡', tema: ['toplum', 'ahlak', 'tevhid'], oneCikan: '65:2-3',
            konu: 'Medine döneminin ortalarında inmiştir; adını boşanmayla ilgili hükümlerle başlamasından alır. Boşanmanın iddet gözetilerek yapılmasını, iddet süresince kadınların evlerinden çıkarılmamasını, nafakalarının verilmesini, hamile olanlara doğuma kadar bakılmasını ve çocuğunu emziren annelere ücret ödenmesini emreder. Bu hükümleri Allah’tan sakınma ve iyilikle davranma öğütleriyle birlikte anlatır; Allah’tan sakınana bir çıkış yolu açılacağını ve Allah’a güvenene O’nun yeteceğini bildirir. Emrine karşı gelen kavimlerin âkıbetini hatırlatır ve Allah’ın yedi göğü ve yeri yarattığını bildirerek sona erer.',
            akilda: 'Allah’a güvenene Allah yeter.',
            cocuk: 'Zor zamanlarda Allah’a güvenmeyi ve aile içinde iyilikle davranmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Talâk Sûresi” maddesi']
        },
        66: {
            anlam: 'Haram kılma, yasaklama', emo: '🪷', tema: ['toplum', 'ahlak', 'peygamber'], oneCikan: '66:8',
            konu: 'Medine döneminin ikinci yarısında inmiştir; adını Peygamberimizin eşlerinin rızasını gözeterek kendine helâl olan bir şeyi yasak etmesiyle ilgili ilk ayetten alır. Yeminin keffâretle çözülebileceğini bildirir ve Peygamberimizin gizli bir sözünü başkasına aktaran eşlerinden ikisini tövbeye çağırır. Müminlere kendilerini ve ailelerini ateşten korumayı ve içtenlikle tövbe etmeyi emreder. Nûh’un ve Lût’un eşlerini inkârın, Firavun’un eşini ve Meryem’i imanın örneği olarak gösterir.',
            akilda: 'Mümin, kendini ve ailesini kötülükten korur, içtenlikle tövbe eder.',
            cocuk: 'Ailemizi kötülükten korumayı ve içtenlikle tövbe etmeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tahrîm Sûresi” maddesi']
        },
        67: {
            anlam: 'Hükümranlık', emo: '👑', tema: ['tevhid', 'nimet', 'ahiret'], oneCikan: '67:2',
            konu: 'Mekke döneminde inmiştir ve adını ilk ayetteki “mülk” kelimesinden alır. Bütün hükümranlığın Allah’ın elinde olduğunu, ölümü ve hayatı insanların hangisinin daha güzel iş yapacağını ortaya koymak için yarattığını bildirir. Göklerdeki kusursuz düzene bakmaya, akıl ve duyuları kullanarak düşünmeye çağırır; inkârcıların âhiretteki pişmanlığını anlatır.',
            akilda: 'Hayat bir imtihandır; ölçü, işin en güzelini yapmaktır.',
            cocuk: 'Gökyüzündeki kusursuz düzene bakıp Allah’ın büyüklüğünü düşünmeye çağıran sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mülk Sûresi” maddesi']
        },
        68: {
            anlam: 'Kalem', emo: '✒️', tema: ['peygamber', 'ahlak', 'sabir', 'kissa'], oneCikan: '68:4',
            konu: 'Mekke döneminin ilk yıllarında inmiştir; adını kaleme ve yazılanlara yeminle başlayan ilk ayetten alır. Peygamberimizin mecnun olmadığını, büyük bir ahlak üzere olduğunu bildirir; çok yemin eden, laf taşıyan, iyiliği engelleyen, haddi aşan ve kaba kimselere uymamasını öğütler. Yoksullara pay vermemek için sözleşip ürününü kaybeden bahçe sahiplerinin kıssasıyla nimetin bir imtihan olduğunu anlatır. Kıyamet gününü tasvir eder; Yûnus peygamberi hatırlatarak Peygamberimize sabretmesini öğütler.',
            akilda: 'Peygamberimiz büyük bir ahlaka sahiptir.',
            cocuk: 'Peygamberimizin güzel ahlakını ve paylaşmayan bahçe sahiplerinin hikâyesini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kalem Sûresi” maddesi']
        },
        69: {
            anlam: 'Mutlaka gerçekleşecek olan', emo: '📯', tema: ['ahiret', 'kuran', 'kissa'], oneCikan: '69:38-43',
            konu: 'Mekke döneminin ilk yıllarında inmiştir; adını kıyameti ifade eden ve “mutlaka gerçekleşecek olan” anlamına gelen ilk kelimeden alır. Peygamberlerini yalanlayan Semûd, Âd, Firavun ve Lût kavimlerinin helâkini hatırlatır; kıyamet günü sûra üflenmesini, Rabbin arşını sekiz meleğin taşıyacağını ve herkesin hesap vereceğini anlatır. Kitabı sağından verilenin sevincini, solundan verilenin pişmanlığını tasvir eder; yoksulu doyurmaya teşvik etmeyenlerin âkıbetini bildirir. Kur’an’ın şair ya da kâhin sözü değil, âlemlerin Rabbinden indirilmiş bir söz olduğunu bildirir ve Rabbin yüce adını tesbih emriyle sona erer.',
            akilda: 'Kur’an, âlemlerin Rabbinden indirilmiş bir sözdür.',
            cocuk: 'Kıyamet gününü ve Kur’an’ın Allah’ın sözü olduğunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hâkka Sûresi” maddesi']
        },
        70: {
            anlam: 'Yükselme yerleri, dereceler', emo: '🪜', tema: ['ahiret', 'ibadet', 'ahlak', 'toplum'], oneCikan: '70:22-27',
            konu: 'Mekke döneminin ortalarında inmiştir; adını Allah’ın sıfatı olarak geçen ve yükselme yerleri anlamına gelen kelimeden alır. İnkârcıların alayla sorduğu azabın mutlaka geleceğini, kıyamet gününün dehşetini ve o gün kimsenin yakınına yardım edemeyeceğini anlatır. İnsanın sıkıntıda sızlanan, nimete kavuşunca cimrileşen yapısını anlatır; namazlarını sürekli kılan, mallarında yoksulun hakkını gözeten, hesap gününe inanan, iffetini koruyan, emanete ve sözüne bağlı kalan ve şahitliğini dosdoğru yapan müminleri bundan ayırır. Bu özelliklere sahip olanların cennette ağırlanacağını bildirir.',
            akilda: 'Namazını sürdüren ve malında yoksulun hakkını gözeten, insanın zaaflarından kurtulur.',
            cocuk: 'Namazımızı kılmayı, yoksulla paylaşmayı ve sözümüzü tutmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Meâric Sûresi” maddesi']
        },
        71: {
            anlam: 'Nûh peygamber', emo: '🌧️', tema: ['kissa', 'peygamber', 'dua', 'tevhid'], oneCikan: '71:10-12',
            konu: 'Mekke döneminde inmiştir; adını yalnızca Nûh peygamberin ve kavminin kıssasını anlatmasından alır. Nûh peygamberin kavmini gece gündüz, açıktan ve gizlice Allah’a çağırdığını, onların ise kulaklarını tıkayıp büyüklendiklerini anlatır. Bağışlanma dilerlerse Allah’ın onlara bol yağmur, mal, evlat, bahçeler ve ırmaklar vereceğini bildirdiğini, göklerin, ayın, güneşin ve yeryüzünün yaratılışını delil gösterdiğini anlatır. Kavminin Ved, Süvâ‘, Yegūs, Yeûk ve Nesr adlı putlarda direnmesi üzerine boğulduklarını bildirir; Nûh peygamberin kendisi, anne babası ve bütün müminler için bağışlanma duasıyla sona erer.',
            akilda: 'Bağışlanma dilemek, rahmetin ve bereketin kapısını açar.',
            cocuk: 'Hz. Nûh’un kavmini yıllarca sabırla Allah’a çağırmasını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nûh Sûresi” maddesi']
        },
        72: {
            anlam: 'Cinler', emo: '🕯️', tema: ['kuran', 'tevhid', 'ahiret'], oneCikan: '72:1-2',
            konu: 'Mekke döneminde inmiştir; adını Kur’an’ı dinleyip iman eden bir grup cinin anlatıldığı ilk ayetten alır ve “De ki” emriyle başlayan surelerin en uzunudur. Cinlerin Kur’an’ı hayranlıkla dinleyip Rablerine hiçbir şeyi ortak koşmayacaklarını söylediklerini aktarır. Cinlerin de müminleri ve inkâr edenleri olduğunu, gökten haber almalarının engellendiğini, insanların cinlere sığınmasının onların azgınlığını artırdığını bildirir. Mescitlerin Allah’a ait olduğunu, Allah ile birlikte başka birine yalvarılmayacağını ve gaybı yalnızca Allah’ın bildiğini, onu ancak razı olduğu elçiye bildirdiğini anlatır.',
            akilda: 'Kur’an’ı dinleyen kalp, doğru yolu bulur.',
            cocuk: 'Kur’an’ı dinleyip hayran kalan ve iman eden cinleri anlatan sure.',
            hadis: { metin: 'Resûlullah ashabından bir toplulukla Ukâz panayırına giderken Nahle’de sabah namazı kıldırıyordu. Şeytanlarla gökten gelen haber arasına engel konmuş, üzerlerine alevler gönderilmişti; bunun sebebini araştırmak için yola çıkan şeytanlardan Tihâme’ye yönelenler, Kur’an’ı duyunca dinlediler ve “Gökten gelen haberle aranıza giren engel işte budur” dediler. Kavimlerine dönüp “Biz doğru yola ileten, hayranlık verici bir Kur’an dinledik ve ona iman ettik” dediler. Bunun üzerine Allah, “De ki: Cinlerden bir topluluğun Kur’an’ı dinlediği bana vahyolundu” diye başlayan Cin suresini indirdi.', ravi: 'İbn Abbas', kaynak: 'Buhârî, Tefsîr, 4921', k: [['b', 4921, 'Abbas']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Cin Sûresi” maddesi']
        },
        73: {
            anlam: 'Örtünüp bürünen', emo: '🧣', tema: ['ibadet', 'kuran', 'sabir', 'peygamber'], oneCikan: '73:8-9',
            konu: 'Mekke döneminin ilk yıllarında inmiştir; adını Peygamberimize “Ey örtünüp bürünen” diye seslenen ilk ayetten alır. Peygamberimize, ağır bir sorumluluğa hazırlanmak için gecenin bir bölümünde kalkıp namaz kılmasını, Kur’an’ı ağır ağır okumasını, Rabbinin adını anıp yalnız O’na yönelmesini emreder. İnkârcıların sözlerine sabretmesini, onlardan güzellikle uzaklaşmasını öğütler ve Firavun’un âkıbetini hatırlatır. Son ayeti gece ibadetinde kolaylık getirir; Kur’an’dan kolay geleni okumayı, namaz kılmayı, zekât vermeyi ve bağışlanma dilemeyi emreder.',
            akilda: 'Gece ibadeti ve ağır ağır okunan Kur’an, kalbi büyük işlere hazırlar.',
            cocuk: 'Geceleri namaz kılmayı ve Kur’an’ı ağır ağır, güzelce okumayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Müzzemmil Sûresi” maddesi']
        },
        74: {
            anlam: 'Örtüye bürünen', emo: '📣', tema: ['peygamber', 'ahiret', 'ahlak'], oneCikan: '74:1-7',
            konu: 'Mekke döneminin ilk yıllarında, çoğu âlime göre Alak suresinin ilk ayetlerinden sonra inmiştir; adını Peygamberimize “Ey örtüye bürünen” diye seslenen ilk ayetten alır. Peygamberimize kalkıp insanları uyarmasını, Rabbini yüceltmesini, giysilerini temiz tutmasını, kötülükten uzak durmasını, yaptığı iyiliği çok görmemesini ve sabretmesini emreder. Kur’an’a büyü diyen zengin ve kibirli bir inkârcının âkıbetini anlatır ve cehennemi tasvir eder. Namaz kılmayan, yoksulu doyurmayan ve hesap gününü yalanlayan kimselerin cehenneme girdiğini bildirir.',
            akilda: 'Mümin, Rabbini yüceltir, temiz olur ve yaptığı iyiliği başa kakmaz.',
            cocuk: 'Peygamberimize “Kalk ve insanları uyar!” diye seslenen, temiz olmayı öğreten sure.',
            hadis: { soz: true, metin: 'Ben yürürken gökten bir ses işittim. Başımı kaldırınca Hirâ’da bana gelen meleği gökle yer arasında bir kürsüde otururken gördüm; korkudan yere düştüm. Eşime gidip “Beni örtün, beni örtün” dedim; beni örttüler. Bunun üzerine Allah “Ey örtüye bürünen! Kalk da uyar” diye başlayan ayetleri indirdi.', ravi: 'Câbir b. Abdullah', kaynak: 'Buhârî, Tefsîr, 4926', k: [['b', 4926, 'Jabir']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Müddessir Sûresi” maddesi']
        },
        75: {
            anlam: 'Kıyamet, diriliş', emo: '🖐️', tema: ['ahiret', 'kuran', 'tevhid'], oneCikan: '75:16-19',
            konu: 'Mekke döneminde, Kāria suresinden sonra inmiştir; adını kıyamet gününe yeminle başlayan ilk ayetten alır. Kendini kınayan nefse de yemin ederek çürümüş kemikleri bir araya getirmenin, hatta parmak uçlarını yeniden düzenlemenin Allah’a kolay olduğunu bildirir. Peygamberimize vahyi unutmamak için acele etmemesini söyler; Kur’an’ı kalbine yerleştirmenin, okutmanın ve açıklamanın Allah’a ait olduğunu bildirir. Dünyayı sevip âhireti bırakanları uyarır; o gün bazı yüzlerin Rablerine bakarak parlayacağını, bazılarının ise asık olacağını anlatır ve insanın yaratılış aşamalarını dirilişe delil gösterir.',
            akilda: 'Parmak uçlarımızı bile yeniden düzenlemeye gücü yeten Allah, insanı mutlaka diriltecektir.',
            cocuk: 'Allah’ın parmak uçlarımızı bile yeniden yaratmaya gücünün yettiğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kıyâme Sûresi” maddesi']
        },
        76: {
            anlam: 'İnsan', emo: '🍲', tema: ['ahiret', 'ahlak', 'nimet'], oneCikan: '76:8-10',
            konu: 'Adını, insanın anılmaya değer bir şey değilken var edildiğini hatırlatan ilk ayetten alır; “Dehr” ve “Hel etâ” diye de anılır. İnsanın karışık bir damladan yaratılıp ona işitme ve görme verildiğini, imtihan için yol gösterildiğini ve şükür ile nankörlük arasında seçim yapacağını bildirir. Sözlerini yerine getiren, sevdikleri hâlde yemeği yoksula, yetime ve esire yediren ve bunu yalnızca Allah rızası için yapan iyileri anlatır; onları bekleyen cennet nimetlerini tasvir eder. Peygamberimize Rabbinin hükmüne sabretmesini, sabah akşam O’nun adını anmasını öğütler.',
            akilda: 'İyilik, karşılık ve teşekkür beklemeden yalnızca Allah için yapılır.',
            cocuk: 'Sevdikleri yemeği ihtiyacı olanlarla paylaşan iyi insanları anlatan sure.',
            hadis: { metin: 'Resûlullah cuma günü sabah namazında birinci rekâtta Secde suresini, ikinci rekâtta İnsân suresini okurdu.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Cum‘a, 880', k: [['m', 880, 'Huraira']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “İnsân Sûresi” maddesi']
        },
        77: {
            anlam: 'Gönderilenler', emo: '💨', tema: ['ahiret', 'nimet'], oneCikan: '77:41-44',
            konu: 'Mekke döneminin ilk yıllarında inmiştir; adını ardı ardına gönderilenlere yeminle başlayan ilk ayetten alır. Kıyametin, yani ayırım gününün mutlaka geleceğini, o gün yıldızların sönüp göğün yarılacağını bildirir. İnsanın bayağı bir sudan yaratılışını ve yeryüzünün diriler ve ölüler için toplanma yeri kılınışını hatırlatır; “O gün yalanlayanların vay hâline” uyarısını on defa tekrarlar. Takva sahiplerinin gölgeliklerde ve pınar başlarında olacağını bildirir.',
            akilda: 'Takva sahiplerini gölgeler, pınarlar ve canlarının çektiği meyveler bekler.',
            cocuk: 'Kıyamet gününü anlatan ve iyileri bekleyen gölgeli bahçeleri müjdeleyen sure.',
            hadis: { metin: 'Resûlullah ile birlikte bir mağaradaydık; Mürselât suresi ona indi ve biz onu indiği anda onun ağzından öğreniyorduk.', ravi: 'Abdullah b. Mes‘ûd', kaynak: 'Buhârî, Tefsîr, 4931', k: [['b', 4931, 'Abdullah']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Mürselât Sûresi” maddesi']
        },
        78: {
            anlam: 'Büyük haber', emo: '📢', tema: ['ahiret', 'nimet'], oneCikan: '78:6-7',
            konu: 'Otuzuncu cüz bu sureyle başlar. İnkârcıların birbirine sorduğu büyük haber, yani öldükten sonra diriliş üzerinde durur; yeryüzünün beşik, dağların direk kılınması, gece ile gündüz, uyku ve yağmur gibi nimetleri dirilişin delilleri olarak sayar. Hüküm gününü, cehennemi ve cenneti kısaca tasvir eder; o gün Rahmân’ın izni olmadan kimsenin konuşamayacağını bildirir.',
            akilda: 'Düzenle yaratılan kâinat, insanın boşuna yaratılmadığını gösterir.',
            cocuk: 'Yeri, dağları, geceyi ve gündüzü hatırlatıp âhireti anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nebe’ Sûresi” maddesi']
        },
        79: {
            anlam: 'Çekip alanlar', emo: '🌘', tema: ['ahiret', 'kissa', 'ahlak'], oneCikan: '79:40-41',
            konu: 'Canları şiddetle çekip alanlara yeminle başlar ve kıyametin mutlaka kopacağını bildirir. Firavun’un kibrini ve ibret verici sonunu Hz. Mûsâ kıssasıyla anlatır. Dünya hayatını tercih edenle Rabbinin huzurunda durmaktan korkup nefsini kötü arzulardan alıkoyanın âkıbetini karşılaştırır; kıyametin vaktini yalnızca Allah’ın bildiğini hatırlatır.',
            akilda: 'Nefsini kötülükten alıkoyanı cennet bekler.',
            cocuk: 'Firavun’un kibrini anlatıp nefsimize hâkim olmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nâziât Sûresi” maddesi']
        },
        80: {
            anlam: 'Yüzünü ekşitti', emo: '🌱', tema: ['ahlak', 'peygamber', 'nimet', 'ahiret'], oneCikan: '80:24',
            konu: 'Peygamberimiz Kureyş’in ileri gelenleriyle konuşurken yanına gelen âmâ sahâbî İbn Ümmü Mektûm’la ilgilenmemesi üzerine inmiştir. Hakikati arayan kimseye öncelik verilmesi gerektiğini öğretir. İnsanı yiyeceğine bakıp Allah’ın nimetlerini düşünmeye çağırır ve kıyamet gününde herkesin kendi derdine düşeceğini anlatır.',
            akilda: 'Hakikati arayan kimse, makamına bakılmadan değerlidir.',
            cocuk: 'Kimseyi küçük görmemeyi ve sofradaki nimetleri düşünmeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Abese Sûresi” maddesi']
        },
        81: {
            anlam: 'Dürülmek', emo: '🌑', tema: ['ahiret', 'kuran'], oneCikan: '81:14',
            konu: 'Mekke döneminin ilk yıllarında inmiştir. Güneşin dürülmesi, dağların yürütülmesi ve denizlerin kaynaştırılması gibi kıyamet sahneleriyle başlar; diri diri gömülen kız çocuğuna hangi suçtan öldürüldüğünün sorulacağını ve o gün herkesin önceden ne hazırladığını göreceğini bildirir. Kur’an’ın Cebrâil aracılığıyla getirilen bir vahiy olduğunu, Peygamberimizin mecnun olmadığını vurgular.',
            akilda: 'Herkes, önceden ne hazırladığını o gün görecektir.',
            cocuk: 'Kıyamet gününü anlatıp iyiliğe hazırlanmamızı hatırlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tekvîr Sûresi” maddesi']
        },
        82: {
            anlam: 'Yarılmak', emo: '💫', tema: ['ahiret'], oneCikan: '82:6-8',
            konu: 'Göğün yarılması, yıldızların dağılması ve kabirlerin açılması gibi kıyamet olaylarını anlatır. İnsana, kendisini yaratıp düzenleyen cömert Rabbine karşı onu neyin aldattığını sorar. Amelleri yazan değerli meleklerden söz eder; iyilerin nimet içinde, kötülerin cehennemde olacağını ve o gün hükmün yalnızca Allah’a ait olduğunu bildirir.',
            akilda: 'Cömert Rabbin lütfu, insanı gaflete değil şükre götürmelidir.',
            cocuk: 'Bizi en güzel şekilde yaratan Rabbimizi unutmamamızı hatırlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İnfitâr Sûresi” maddesi']
        },
        83: {
            anlam: 'Ölçüde ve tartıda hile yapanlar', emo: '⚖️', tema: ['ahlak', 'toplum', 'ahiret'], oneCikan: '83:1-3',
            konu: 'Ölçüde ve tartıda hile yapanları uyarır ve bu davranışı hesap gününe inanmamakla ilişkilendirir. Kötülerin amel defterinin siccînde, iyilerinkinin illiyyînde olduğunu bildirir ve cennetteki nimetleri anlatır. Dünyada müminlerle alay edenlerin âhirette aşağılanacağını haber verir.',
            akilda: 'Hakkı tam vermek, hesap gününe inanmanın gereğidir.',
            cocuk: 'Alışverişte dürüst olmayı ve kimsenin hakkını yememeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mutaffifîn Sûresi” maddesi']
        },
        84: {
            anlam: 'Yarılmak', emo: '☁️', tema: ['ahiret', 'ibadet'], oneCikan: '84:6',
            konu: 'Göğün yarılması ve yerin düzleştirilmesiyle kıyamet gününü anlatır. İnsanın Rabbine kavuşuncaya kadar çalışıp çabaladığını, amel defterini sağından alanın kolay bir hesapla sevineceğini, arkasından alanın ise yıkıma uğrayacağını bildirir. Kur’an okunduğunda secde etmeyenleri uyarır; surede bir secde ayeti vardır.',
            akilda: 'Her çaba, bir gün Rabbin huzurunda karşılık bulur.',
            cocuk: 'Yaptığımız her güzel çabanın Allah katında karşılık bulacağını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İnşikāk Sûresi” maddesi']
        },
        85: {
            anlam: 'Burçlar', emo: '🌌', tema: ['kissa', 'sabir', 'ahiret'], oneCikan: '85:11',
            konu: 'Müşriklerin müminlere işkence etmeye başladığı Mekke döneminde inmiştir. İnananları ateşle dolu hendeklerde yakan “hendek sahipleri”nin kıssasını anlatarak zalimlerin cezasını ve sabreden müminlerin mükâfatını bildirir. Firavun’un ve Semûd’un helâkini hatırlatarak her dönemde zulme uğrayan müminleri teselli eder.',
            akilda: 'Zulüm geçicidir; iman edip sabredenleri büyük kurtuluş bekler.',
            cocuk: 'Zorluklara rağmen imanından vazgeçmeyenlerin anlatıldığı sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Burûc Sûresi” maddesi']
        },
        86: {
            anlam: 'Geceleyin gelen parlak yıldız', emo: '🌠', tema: ['ahiret', 'kuran'], oneCikan: '86:4',
            konu: 'Geceleyin görünen parlak yıldıza yeminle başlar ve her insanın üzerinde bir gözetici bulunduğunu bildirir. İnsanın atılan bir sudan yaratıldığını hatırlatarak onu yeniden diriltmenin Allah’a kolay olduğunu vurgular. Kur’an’ın hakla bâtılı ayıran ciddi bir söz olduğunu bildirir ve Peygamberimize, inkârcılara biraz süre tanımasını söyler.',
            akilda: 'Hiç kimse başıboş değildir; her insanın üzerinde bir gözetici vardır.',
            cocuk: 'Gökteki parlak yıldızı anlatıp Allah’ın bizi her an gördüğünü hatırlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Târık Sûresi” maddesi']
        },
        87: {
            anlam: 'En yüce', emo: '⭐', tema: ['tevhid', 'ahiret', 'ibadet'], oneCikan: '87:14-15',
            konu: 'En yüce Rabbin adını tesbih etmeyi emrederek başlar. Allah’ın yaratıp şekil verdiğini, her şeyi ölçüyle yapıp yol gösterdiğini anlatır; Peygamberimize Kur’an’ı unutmayacağını vaat eder. Arınıp Rabbinin adını anarak namaz kılanın kurtuluşa ereceğini, âhiretin dünyadan daha hayırlı ve kalıcı olduğunu bildirir.',
            akilda: 'Âhiret, dünyadan daha hayırlı ve daha kalıcıdır.',
            cocuk: 'Yüce Rabbimizi anmayı ve kalbimizi temiz tutmayı öğreten sure.',
            hadis: { metin: 'Resûlullah iki bayram namazında ve cuma namazında A‘lâ ve Gâşiye surelerini okurdu.', ravi: 'Nu‘mân b. Beşîr', kaynak: 'Müslim, Cum‘a, 878', k: [['m', 878, "Nu'man"]] },
            kaynak: ['TDV İslâm Ansiklopedisi, “A‘lâ Sûresi” maddesi']
        },
        88: {
            anlam: 'Her yeri kaplayan olay', emo: '🐫', tema: ['ahiret', 'nimet', 'peygamber'], oneCikan: '88:17-20',
            konu: 'Kıyameti, ansızın gelip her şeyi saran olay diye anar. Cehennem ehlinin perişan hâlini ve cennet ehlinin mutluluğunu karşılaştırır. Devenin yaratılışına, göğün yükseltilişine, dağlara ve yeryüzüne bakıp düşünmeye çağırır; Peygamberimizin görevinin zor kullanmak değil öğüt vermek olduğunu bildirir.',
            akilda: 'Yaratılışa dikkatle bakan, Yaratanın kudretini görür.',
            cocuk: 'Deveye, göğe, dağlara bakıp Allah’ın kudretini düşünmeye çağıran sure.',
            hadis: { metin: 'Resûlullah iki bayram namazında ve cuma namazında A‘lâ ve Gâşiye surelerini okurdu.', ravi: 'Nu‘mân b. Beşîr', kaynak: 'Müslim, Cum‘a, 878', k: [['m', 878, "Nu'man"]] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Gāşiye Sûresi” maddesi']
        },
        89: {
            anlam: 'Tan yerinin ağarması', emo: '🌅', tema: ['kissa', 'ahlak', 'ahiret'], oneCikan: '89:27-28',
            konu: 'Fecir vaktine ve Zilhicce’nin ilk on gecesine yeminle başlar. Âd, Semûd ve Firavun’un helâkini ibret olarak anlatır. Bolluk da darlık da bir imtihan olduğu hâlde bunu anlamayan, yetime ikram etmeyen, yoksulu doyurmaya teşvik etmeyen ve malı aşırı seven insanı eleştirir; huzura ermiş nefse Rabbine hoşnut olarak dönme müjdesi verir.',
            akilda: 'Zenginlik de yoksulluk da bir imtihandır.',
            cocuk: 'Yetimi sevindirmeyi, yoksulu doyurmayı hatırlatan ve huzurlu kalpleri müjdeleyen sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fecr Sûresi” maddesi']
        },
        90: {
            anlam: 'Şehir (Mekke)', emo: '🕋', tema: ['ahlak', 'toplum'], oneCikan: '90:10',
            konu: 'Mekke şehrine yeminle başlar ve insanın zorluklar içinde yaratıldığını bildirir. İnsana iyi ve kötü iki yolun gösterildiğini hatırlatır; zor geçidi aşmayı, yani köle azat etmeyi, açlık gününde yakını olan bir yetimi ya da yoksulu doyurmayı öğütler. Birbirine sabrı ve merhameti tavsiye eden müminlerin kurtuluşa ereceğini bildirir.',
            akilda: 'İyilik yolu zor bir geçittir; onu aşan, merhametle aşar.',
            cocuk: 'Aç olanı doyurmayı ve birbirimize merhametli olmayı öğütleyen sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Beled Sûresi” maddesi']
        },
        91: {
            anlam: 'Güneş', emo: '🌞', tema: ['ahlak', 'kissa'], oneCikan: '91:9-10',
            konu: 'Güneş, ay, gündüz, gece, gök ve yer üzerine art arda yeminlerle başlar. İnsan nefsine hem kötülüğün hem de takvanın bildirildiğini, nefsini arındıranın kurtuluşa erdiğini, onu kötülüğe gömenin ziyana uğradığını bildirir. Hz. Sâlih’in uyarısına rağmen Allah’ın devesine zarar veren Semûd kavminin helâkini ibret olarak anlatır.',
            akilda: 'Kurtuluş, nefsi arındırmakla başlar.',
            cocuk: 'Kalbimizi kötülüklerden temizlememizi öğütleyen sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Şems Sûresi” maddesi']
        },
        92: {
            anlam: 'Gece', emo: '🌙', tema: ['ahlak', 'toplum'], oneCikan: '92:5-7',
            konu: 'Gece, gündüz ve erkekle dişinin yaratılışı üzerine yeminle başlar; insanların çabalarının farklı farklı olduğunu bildirir. Malından verip Allah’a karşı gelmekten sakınan ve en güzeli doğrulayan kişiye kolaylık yolunun açılacağını, cimrilik edip kendini yeterli göreni ise zorluğun beklediğini anlatır. Arınmak için malını veren kişinin ateşten uzak tutulacağını müjdeler.',
            akilda: 'Cömertlik kolaylığa, cimrilik zorluğa götürür.',
            cocuk: 'Paylaşmanın güzelliğini ve cimriliğin çirkinliğini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Leyl Sûresi” maddesi']
        },
        93: {
            anlam: 'Kuşluk vakti', emo: '☀️', tema: ['peygamber', 'sabir', 'toplum'], oneCikan: '93:5',
            konu: 'Vahyin bir süre gelmemesi üzerine müşriklerin “Rabbi onu terk etti” demesiyle Peygamberimizin üzülmesi üzerine inmiş ve onu teselli etmiştir. Rabbinin onu bırakmadığını, sonrasının öncesinden daha hayırlı olacağını ve kendisine hoşnut olacağı şeyler verileceğini müjdeler. Yetim iken barındırıldığını, fakir iken zengin kılındığını hatırlatır; yetimi ezmemeyi, isteyeni azarlamamayı ve Rabbinin nimetini anlatmayı emreder.',
            akilda: 'Allah, kulunu yalnız bırakmaz.',
            cocuk: 'Peygamberimizi teselli eden ve yetimi sevindirmeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Duhâ Sûresi” maddesi']
        },
        94: {
            anlam: 'Göğsün açılması, ferahlık', emo: '🌈', tema: ['peygamber', 'sabir'], oneCikan: '94:5-6',
            konu: 'Duhâ suresinden sonra inmiştir ve onun gibi Peygamberimizi teselli eder. Göğsünün açıldığını, belini büken yükün kaldırıldığını ve şanının yüceltildiğini hatırlatır. Her güçlükle birlikte bir kolaylık bulunduğunu iki kez bildirir; bir işi bitirince başka bir işe koyulmayı ve yalnızca Rabbine yönelmeyi emreder.',
            akilda: 'Her güçlükle birlikte bir kolaylık vardır.',
            cocuk: 'Her zorluğun yanında bir kolaylık olduğunu müjdeleyen sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İnşirâh Sûresi” maddesi']
        },
        95: {
            anlam: 'İncir', emo: '🫒', tema: ['ahlak', 'ahiret'], oneCikan: '95:4',
            konu: 'İncir, zeytin, Sînâ dağı ve güvenli şehir Mekke üzerine yeminle başlar. İnsanın en güzel biçimde yaratıldığını, ancak inkâr yoluna gidenin aşağıların aşağısına düşürüleceğini bildirir. İman edip salih amel işleyenlere kesintisiz bir mükâfat verileceğini müjdeler.',
            akilda: 'İnsan en güzel biçimde yaratılmıştır; değerini imanla ve iyilikle korur.',
            cocuk: 'Allah’ın insanı en güzel şekilde yarattığını anlatan sure.',
            hadis: { metin: 'Resûlullah bir yolculukta yatsı namazının ilk iki rekâtından birinde Tîn suresini okudu.', ravi: 'Berâ b. Âzib', kaynak: 'Buhârî, Ezân, 767', k: [['b', 767, 'Bara']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Tîn Sûresi” maddesi']
        },
        96: {
            anlam: 'Alak (insanın ilk yaratılış evresi)', emo: '📖', tema: ['kuran', 'ibadet', 'peygamber'], oneCikan: '96:1-5',
            konu: 'Tercih edilen görüşe göre ilk beş ayeti, Hira mağarasında Peygamberimize inen ilk vahiydir. “Yaratan Rabbinin adıyla oku!” emriyle başlar; insanın alaktan yaratıldığını ve Allah’ın kalemle öğrettiğini bildirerek okumanın ve bilginin değerini öne çıkarır. Kendini yeterli görüp azan ve namaz kılanı engellemeye çalışan kişiyi uyarır; secde edip Rabbine yaklaşmayı emreder.',
            akilda: 'Okumak, Yaratanın adıyla başladığında insanı yüceltir.',
            cocuk: 'Kur’an’ın ilk inen ayetleriyle “Oku!” diye başlayan sure.',
            hadis: { metin: 'Hira mağarasında melek Peygamberimize gelip “Oku!” dedi. Üçüncü defasında “Yaratan Rabbinin adıyla oku! O, insanı alaktan yarattı. Oku! Rabbin en büyük kerem sahibidir” ayetlerini okudu.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Bed’ü’l-vahy, 3', k: [['b', 3, 'Aisha']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Alak Sûresi” maddesi']
        },
        97: {
            anlam: 'Kadir (değer, şeref)', emo: '✨', tema: ['kuran', 'ibadet'], oneCikan: '97:3',
            konu: 'Kur’an’ın Kadir gecesinde indirildiğini bildirir. Bu gecenin bin aydan daha hayırlı olduğunu, o gece meleklerin ve Cebrâil’in Rablerinin izniyle indiğini anlatır. Gecenin tan yeri ağarıncaya kadar esenlik olduğunu bildirerek Kur’an’ın insanlık için değerini öne çıkarır.',
            akilda: 'Kur’an’ın indiği gece, bin aydan daha hayırlıdır.',
            cocuk: 'Kur’an’ın indiği, bin aydan hayırlı Kadir gecesini anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kadr Sûresi” maddesi']
        },
        98: {
            anlam: 'Apaçık belge', emo: '📜', tema: ['ibadet', 'peygamber', 'ahiret'], oneCikan: '98:5',
            konu: 'Kitap ehlinden ve müşriklerden inkâr edenlerin, kendilerine apaçık bir belge olarak arınmış sayfaları okuyan bir peygamber gelinceye kadar inkârdan ayrılmayacaklarını bildirir. Hak dinin özünü özetler: dini yalnızca Allah’a has kılarak O’na kulluk etmek, namaz kılmak ve zekât vermek. İnkâr edenlerin ve iman edip salih amel işleyenlerin âkıbetini karşılaştırır.',
            akilda: 'Dinin özü; Allah’a ihlasla kulluk, namaz ve zekâttır.',
            cocuk: 'Dinin özünü, yani Allah’a içtenlikle kulluğu, namazı ve zekâtı anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Beyyine Sûresi” maddesi']
        },
        99: {
            anlam: 'Sarsıntı, deprem', emo: '🌍', tema: ['ahiret', 'ahlak'], oneCikan: '99:7-8',
            konu: 'Kıyamet günü yerin şiddetle sarsılacağını ve içindeki ağırlıkları dışarı çıkaracağını anlatır. O gün yeryüzünün, üzerinde yapılanları haber vereceğini bildirir. İnsanların amellerini görmek üzere bölük bölük çıkacaklarını, zerre kadar iyiliğin de kötülüğün de karşılıksız kalmayacağını vurgular.',
            akilda: 'Zerre kadar iyilik de kötülük de karşılıksız kalmaz.',
            cocuk: 'Yaptığımız en küçük iyiliğin bile kaybolmayacağını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Zilzâl Sûresi” maddesi']
        },
        100: {
            anlam: 'Koşan atlar', emo: '🐎', tema: ['ahlak', 'ahiret'], oneCikan: '100:6',
            konu: 'Soluk soluğa koşan, kıvılcımlar saçan ve sabah baskını yapan atlara yeminle başlar. İnsanın Rabbine karşı nankör olduğunu ve mal sevgisine aşırı düşkün olduğunu bildirir. Kabirlerdekilerin çıkarılacağı ve kalplerdekinin ortaya konulacağı günü hatırlatır; Rablerinin o gün onların her hâlinden haberdar olduğunu vurgular.',
            akilda: 'Nimeti vereni unutan insan nankörleşir.',
            cocuk: 'Bize verilen nimetler için teşekkür etmeyi hatırlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Âdiyât Sûresi” maddesi']
        },
        101: {
            anlam: 'Kapıyı çalan (kıyamet)', emo: '🔔', tema: ['ahiret'], oneCikan: '101:6-7',
            konu: 'Kıyameti, yürekleri hoplatan bir çarpış olarak anar ve dehşetini anlatır. O gün insanların ateş etrafında dökülen pervanelere, dağların atılmış renkli yüne döneceğini bildirir. Tartıları ağır gelenin hoş bir hayata, hafif gelenin ise kızgın ateşe varacağını haber verir.',
            akilda: 'O gün değer, tartıda ağır gelen iyiliklerdedir.',
            cocuk: 'Kıyamet gününde iyiliklerin tartılacağını anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kāria Sûresi” maddesi']
        },
        102: {
            anlam: 'Çoklukla övünme yarışı', emo: '💰', tema: ['ahlak', 'ahiret'], oneCikan: '102:8',
            konu: 'Mal, nüfus ve soyla övünüp çoğalma yarışının insanı kabirlere girinceye kadar oyaladığını bildirir. İnsanların cehennemi mutlaka göreceğini kesin bir dille haber verir. O gün dünyada verilen her nimetten hesap sorulacağını hatırlatır.',
            akilda: 'Her nimet bir emanettir; hesabı sorulacaktır.',
            cocuk: 'Daha çok şeye sahip olma yarışına kapılmamayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tekâsür Sûresi” maddesi']
        },
        103: {
            anlam: 'Zaman, ikindi vakti', emo: '⏳', tema: ['ahlak', 'toplum'], oneCikan: '103:1-3',
            konu: 'Zamana yemin ederek insanın ziyan içinde olduğunu bildirir. Bu ziyandan kurtulanları dört özellikle tanıtır: iman edenler, salih amel işleyenler, birbirine hakkı tavsiye edenler ve sabrı tavsiye edenler. Kısa olmasına rağmen Kur’an’ın öğütlerinin özünü taşıdığı kabul edilir.',
            akilda: 'Zamanı iman, iyilik, hak ve sabırla dolduran kazanır.',
            cocuk: 'Zamanımızı iyi kullanmayı ve birbirimize iyiliği tavsiye etmeyi öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Asr Sûresi” maddesi']
        },
        104: {
            anlam: 'Arkadan çekiştiren', emo: '🚫', tema: ['ahlak'], oneCikan: '104:1-2',
            konu: 'İnsanları arkalarından çekiştiren ve yüzlerine karşı ayıplayan kimseleri uyarır. Mal toplayıp onu tekrar tekrar sayan ve malının kendisini ölümsüz kılacağını sanan kişinin Hutame ateşine atılacağını bildirir. Malını ve gücünü üstünlük sayıp insanları küçümsemenin âkıbetini anlatır.',
            akilda: 'Mal insanı ölümsüz kılmaz; insanları küçümsemek de kimseyi yüceltmez.',
            cocuk: 'Kimseyle alay etmemeyi ve kimseyi kırmamayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hümeze Sûresi” maddesi']
        },
        105: {
            anlam: 'Fil', emo: '🐘', tema: ['kissa', 'tevhid'], oneCikan: '105:1-5',
            konu: 'Peygamberimizin doğduğu yıl ya da biraz önce Kâbe’yi yıkmak için gelen Ebrehe’nin fil ordusunun başına gelenleri anlatır. Allah’ın onların üzerine sert taşlar atan sürü sürü kuşlar gönderdiğini ve onları yenilmiş ekin gibi yaptığını bildirir. Mekke müşriklerine Kâbe’yi koruyan kudreti hatırlatarak ibret almalarını öğütler.',
            akilda: 'Allah’ın koruduğuna hiçbir ordu zarar veremez.',
            cocuk: 'Kâbe’yi yıkmaya gelen fil ordusunun başına gelenleri anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fîl Sûresi” maddesi']
        },
        106: {
            anlam: 'Kureyş kabilesi', emo: '🐪', tema: ['nimet', 'tevhid', 'ibadet'], oneCikan: '106:3-4',
            konu: 'Fîl suresinin devamı niteliğindedir ve Allah’ın Kureyş kabilesine verdiği nimetleri hatırlatır. Kışın ve yazın yaptıkları ticaret yolculuklarına alıştırıldıklarını bildirir. Kendilerini açlıktan doyuran ve korkudan emin kılan bu Ev’in, yani Kâbe’nin Rabbine kulluk etmeye çağırır.',
            akilda: 'Nimetin şükrü, nimeti verene kulluktur.',
            cocuk: 'Bizi doyuran ve koruyan Allah’a kulluk etmeye çağıran sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kureyş Sûresi” maddesi']
        },
        107: {
            anlam: 'Küçük yardım, ödünç eşya', emo: '🍞', tema: ['ahlak', 'toplum', 'ibadet'], oneCikan: '107:1-3',
            konu: 'Dini yalanlayan kimseyi tanıtır: yetimi itip kakan ve yoksulu doyurmaya yanaşmayan kişi. Kıldıkları namazdan gafil olanları, gösteriş yapanları ve basit şeyleri bile vermeyenleri kınar. İbadetin yardımlaşmadan ayrı düşünülemeyeceğini öğretir.',
            akilda: 'Yetime ve yoksula sırt çeviren, dinin özünü kaçırmıştır.',
            cocuk: 'Yetimi sevmeyi, yoksula yardım etmeyi ve namazı özenle kılmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mâûn Sûresi” maddesi']
        },
        108: {
            anlam: 'Bol hayır', emo: '💧', tema: ['peygamber', 'ibadet', 'sabir'], oneCikan: '108:1-2',
            konu: 'Kur’an’ın en kısa suresidir. Peygamberimize kevser, yani pek çok hayır verildiğini bildirir ve şükür olarak Rabbi için namaz kılıp kurban kesmesini emreder. Peygamberimizi “soyu kesik” diye küçümseyenlere, asıl soyu kesik olanın kendileri olduğunu bildirerek onu teselli eder.',
            akilda: 'Verilen nimetin şükrü, Allah için kulluktur.',
            cocuk: 'Peygamberimize verilen bol hayrı müjdeleyen, Kur’an’ın en kısa suresi.',
            hadis: { metin: 'Resûlullah aramızda otururken hafifçe daldı, sonra gülümseyerek başını kaldırdı ve “Bana az önce bir sure indi” diyerek Kevser suresini okudu. Ardından kevserin, Rabbinin kendisine vaat ettiği ve içinde çok hayır bulunan bir nehir olduğunu bildirdi.', ravi: 'Enes b. Mâlik', kaynak: 'Müslim, Salât, 400', k: [['m', 400, 'Anas']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Kevser Sûresi” maddesi']
        },
        109: {
            anlam: 'İnkâr edenler', emo: '🧭', tema: ['tevhid'], oneCikan: '109:6',
            konu: 'Rivayete göre Kureyş’in ileri gelenlerinin “Bir yıl sen bizim ilahlarımıza tap, bir yıl biz senin ilahına tapalım” teklifi üzerine inmiştir. Peygamberimizin onların taptıklarına asla tapmayacağını açıkça bildirir. “Sizin dininiz size, benim dinim bana” diyerek tevhid inancında taviz verilmeyeceğini ortaya koyar.',
            akilda: 'İnançta taviz olmaz; herkes kendi yolunun hesabını verir.',
            cocuk: 'İnancımızda kararlı olmayı öğreten sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kâfirûn Sûresi” maddesi']
        },
        110: {
            anlam: 'Yardım, zafer', emo: '🌟', tema: ['peygamber', 'ibadet'], oneCikan: '110:1-3',
            konu: 'Bütün olarak indirilen son suredir; Veda haccı sırasında Minâ’da indiği rivayeti ağırlık kazanmıştır. Allah’ın yardımı ve zafer gelip insanların akın akın Allah’ın dinine girdiğini görünce Rabbini hamd ile tesbih etmeyi ve O’ndan bağışlanma dilemeyi emreder. İbn Abbas bu sureyi Peygamberimizin vefatının yaklaştığına işaret olarak yorumlamış, Hz. Ömer de bu yorumu onaylamıştır.',
            akilda: 'Zafer anı, şükür ve istiğfar anıdır.',
            cocuk: 'Zafer gelince Allah’a şükredip O’ndan bağışlanma dilemeyi öğreten sure.',
            hadis: { metin: 'Hz. Ömer, Bedir’e katılan büyüklerin yanında Nasr suresinin anlamını sordu. İbn Abbas “Bu, Allah’ın Resûlü’ne bildirdiği vefatının işaretidir” dedi. Hz. Ömer de “Ben de bu sureden senin söylediğinden başkasını bilmiyorum” dedi.', ravi: 'İbn Abbas', kaynak: 'Buhârî, Tefsîr, 4970', k: [['b', 4970, 'Abbas']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Nasr Sûresi” maddesi']
        },
        111: {
            anlam: 'Kurusun', emo: '🔥', tema: ['peygamber', 'ahiret'], oneCikan: '111:1-2',
            konu: 'Peygamberimiz Safâ tepesinde Kureyş’i uyardığında amcası Ebû Leheb’in ona beddua etmesi üzerine inmiştir. Ebû Leheb’in ellerinin kuruyacağını, malının ve kazancının ona fayda vermeyeceğini, alevli bir ateşe gireceğini bildirir. Karısının da boynunda bir ip olduğu hâlde odun taşıyacağını haber verir.',
            akilda: 'Mal da akrabalık da hakka düşmanlık edeni kurtarmaz.',
            cocuk: 'Peygamberimize düşmanlık eden Ebû Leheb’in kötü sonunu anlatan sure.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Tebbet Sûresi” maddesi']
        },
        112: {
            anlam: 'İçtenlik, katıksız bağlılık', emo: '☝️', tema: ['tevhid'], oneCikan: '112:1-4',
            konu: 'Allah’ın birliğini en özlü biçimde anlatır: O tektir, her şey O’na muhtaçtır ve O hiçbir şeye muhtaç değildir. Doğurmadığını ve doğmadığını, hiçbir şeyin O’na denk olmadığını bildirir. Rivayetlere göre Allah hakkında sorulan sorulara cevap olarak inmiştir.',
            akilda: 'Allah birdir; hiçbir şey O’na denk değildir.',
            cocuk: 'Allah’ın bir olduğunu ve hiçbir şeyin O’na benzemediğini anlatan sure.',
            hadis: { soz: true, metin: 'Canımı elinde tutan Allah’a yemin ederim ki bu sure, Kur’an’ın üçte birine denktir.', ravi: 'Ebû Saîd el-Hudrî', kaynak: 'Buhârî, Fezâilü’l-Kur’ân, 5013', k: [['b', 5013, 'Khudri']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “İhlâs Sûresi” maddesi']
        },
        113: {
            anlam: 'Sabah aydınlığı', emo: '🌄', tema: ['dua', 'tevhid'], oneCikan: '113:1-5',
            konu: 'Nâs suresiyle birlikte inmiştir; ikisine birlikte “muavvizeteyn”, yani sığınma sureleri denir. Tan yerini ağartan Rabbe; yarattıklarının, bastıran karanlığın, düğümlere üfleyenlerin ve haset edenin şerrinden sığınmayı öğretir. Görünen ve görünmeyen her kötülüğe karşı sığınılacak tek kapının Allah olduğunu bildirir.',
            akilda: 'Her türlü kötülüğe karşı sığınılacak tek kapı Allah’tır.',
            cocuk: 'Bütün kötülüklerden Allah’a sığınmayı öğreten sure.',
            hadis: { soz: true, metin: 'Bana öyle ayetler indirildi ki benzerleri hiç görülmemiştir: Felak ve Nâs sureleri.', ravi: 'Ukbe b. Âmir', kaynak: 'Müslim, Salâtü’l-müsâfirîn, 814', k: [['m', 814, 'Uqba']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Felak Sûresi” maddesi']
        },
        114: {
            anlam: 'İnsanlar', emo: '🛡️', tema: ['dua', 'tevhid'], oneCikan: '114:1-6',
            konu: 'Felak suresiyle birlikte inmiştir. İnsanların Rabbi, Meliki ve İlâhı olan Allah’a, insanların gönlüne vesvese veren sinsi vesvesecinin şerrinden sığınmayı öğretir. Bu vesvesecinin cinlerden de insanlardan da olabileceğini bildirir.',
            akilda: 'Kalbe gelen kötü düşüncelere karşı Allah’a sığınılır.',
            cocuk: 'Kalbimize kötü düşünceler fısıldayanlardan Allah’a sığınmayı öğreten sure.',
            hadis: { metin: 'Resûlullah hastalandığında Felak ve Nâs surelerini okuyup kendine üflerdi. Hastalığı ağırlaşınca bu sureleri ben okur, bereketini umarak onun elini vücuduna sürerdim.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Fezâilü’l-Kur’ân, 5016', k: [['b', 5016, 'Aisha']] },
            kaynak: ['TDV İslâm Ansiklopedisi, “Nâs Sûresi” maddesi']
        }
    }
};
