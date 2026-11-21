// ============================================
// İslam'da Kavram Haritası — içerik
// --------------------------------------------
// Her kavram aynı kalıbı izler (apps/CLAUDE.md, 3. bölüm):
//   ad · Arapça terim · kısa tanım · açıklama · (hüküm ise) yapana / yapmayana
//   · deliller (ayet: Tanzil metni + Diyanet İşleri meali, ayetler.js'ten; hadis: anlam + künye)
//   · günlük hayattan örnekler · mezhep notu · Akılda kalsın · kaynak
//
// Ayet metinleri burada yazılmaz; yalnızca "sure:ayet" verilir. Metinler
// tools/kavram-ayetler.mjs ile Tanzil'den üretilen ayetler.js dosyasındadır.
//
// Hadis künyeleri: Buhârî için genel hadis numarası, Müslim için M. Fuâd Abdülbâkî numarası.
// Örneklerdeki "soru" alanı "Kendini dene" bölümünde sorulacak cevaptır:
//   farz (farz ve vacip) · sunnet (sünnet ve müstehab) · mubah · mekruh · haram
// Mezhebe göre değişen örneklerde soru alanı verilmez ya da cevap bütün mezheplerde aynıdır.
// ============================================
window.KAVRAM_DATA = {
    surum: 1,
    meal: "Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)",
    gruplar: [
        { id: 'kaynak', ad: 'Kaynaklar', soru: 'Hüküm nereden bilinir?', aciklama: "Dinî hükümler dört temel kaynaktan öğrenilir: Kur'an, Sünnet, İcmâ ve Kıyas." },
        { id: 'hukum', ad: 'Hüküm terazisi', soru: 'Bir davranışın dindeki yeri nedir?', aciklama: 'Yapılması kesin istenenden kesin yasaklanana kadar, bir davranışın dindeki yerini gösteren derecelerdir.' },
        { id: 'cati', ad: 'Helal, haram ve şüpheli', soru: 'Sınırlar nasıl çizilir?', aciklama: 'Hükümlerin hepsini kapsayan iki geniş alan ve aralarındaki belirsiz bölge.' },
        { id: 'ilke', ad: 'İlkeler', soru: 'Hüküm nasıl uygulanır?', aciklama: 'Niyet, serbestlik, güç yetirme, kolaylık ve zaruret: hükümlerin hayata nasıl uygulandığını gösteren temel ilkeler.' }
    ],
    // Kendini dene bölümündeki cevap seçenekleri
    sorular: [
        { id: 'farz', ad: 'Farz / Vacip', kavram: 'farz' },
        { id: 'sunnet', ad: 'Sünnet / Müstehab', kavram: 'sunnet' },
        { id: 'mubah', ad: 'Mubah', kavram: 'mubah' },
        { id: 'mekruh', ad: 'Mekruh', kavram: 'mekruh-tenzihen' },
        { id: 'haram', ad: 'Haram', kavram: 'haram' }
    ],
    hadisler: {
        'helal-bellidir': {
            metin: 'Helal bellidir, haram da bellidir. Bu ikisinin arasında insanların çoğunun bilmediği şüpheli şeyler vardır. Şüpheli şeylerden sakınan dinini ve namusunu korumuş olur. Şüpheli şeylere düşen ise korunun çevresinde hayvan otlatan çobana benzer; her an koruya girebilir.',
            ravi: "Nu'mân b. Beşîr",
            kaynak: "Buhârî, Îmân, 52; Müslim, Müsâkāt, 1599"
        },
        'niyet': {
            metin: 'Ameller niyetlere göredir; herkese ancak niyet ettiği şey vardır.',
            ravi: 'Hz. Ömer',
            kaynak: "Buhârî, Bed'ü'l-vahy, 1; Müslim, İmâre, 1907"
        },
        'gucunuz-yettigince': {
            metin: 'Size bir şeyi yasakladığımda ondan kaçının; bir şeyi emrettiğimde de onu gücünüz yettiği kadar yapın.',
            ravi: 'Ebû Hüreyre',
            kaynak: "Buhârî, İ'tisâm, 7288; Müslim, Hac, 1337"
        },
        'kolaylastirin': {
            metin: 'Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.',
            ravi: 'Enes b. Mâlik',
            kaynak: 'Buhârî, İlim, 69; Müslim, Cihâd, 1734'
        },
        'farzlarla-yaklasma': {
            metin: '(Allah buyurur:) Kulum bana, kendisine farz kıldığım şeylerden daha sevimli bir şeyle yaklaşamaz. Kulum nafilelerle de bana yaklaşmaya devam eder; sonunda onu severim.',
            ravi: 'Ebû Hüreyre',
            kaynak: 'Buhârî, Rikāk, 6502'
        },
        'misvak': {
            metin: 'Ümmetime zor gelmeyecek olsaydı, onlara her namazda misvak kullanmalarını emrederdim.',
            ravi: 'Ebû Hüreyre',
            kaynak: "Buhârî, Cum'a, 887; Müslim, Tahâret, 252"
        },
        'guler-yuz': {
            metin: 'İyilikten hiçbir şeyi küçük görme; kardeşini güler yüzle karşılamak bile olsa.',
            ravi: 'Ebû Zer',
            kaynak: 'Müslim, Birr, 2626'
        },
        'gucun-yetmezse': {
            metin: 'Namazı ayakta kıl; gücün yetmezse oturarak, ona da gücün yetmezse yan üstü kıl.',
            ravi: 'İmrân b. Husayn',
            kaynak: 'Buhârî, Taksîru’s-salât, 1117'
        },
        'kan-mal-namus': {
            metin: 'Kanlarınız, mallarınız ve namuslarınız; bu gününüz, bu ayınız ve bu şehriniz nasıl dokunulmazsa, birbirinize karşı öyle dokunulmazdır.',
            ravi: 'Ebû Bekre (Veda haccında)',
            kaynak: 'Buhârî, İlim, 67; Müslim, Kasâme, 1679'
        },
        'sarhosluk': {
            metin: 'Sarhoşluk veren her şey içkidir (hamr) ve sarhoşluk veren her şey haramdır.',
            ravi: 'Abdullah b. Ömer',
            kaynak: 'Müslim, Eşribe, 2003'
        },
        'aileye-harcama': {
            metin: 'Kişi, sevabını Allah’tan umarak ailesinin geçimi için harcadığında, bu onun için bir sadaka olur.',
            ravi: "Ebû Mes'ûd el-Ensârî",
            kaynak: 'Buhârî, Îmân, 55; Müslim, Zekât, 1002'
        },
        'sarimsak': {
            metin: 'Sarımsak ya da soğan yiyen kimse bizden ve mescidimizden uzak dursun, evinde otursun.',
            ravi: 'Câbir b. Abdullah',
            kaynak: 'Buhârî, Ezân, 855; Müslim, Mesâcid, 564'
        },
        'kerahat-vakitleri': {
            metin: 'Resûlullah üç vakitte namaz kılmamızı ve ölülerimizi defnetmemizi yasaklardı: Güneş doğarken yükselinceye kadar, güneş tam tepedeyken batıya kayıncaya kadar ve güneş batmaya yaklaştığında batıncaya kadar.',
            ravi: 'Ukbe b. Âmir',
            kaynak: 'Müslim, Salâtü’l-müsâfirîn, 831'
        },
        'gordugunuz-gibi': {
            metin: 'Beni nasıl namaz kılarken gördüyseniz öyle kılın.',
            ravi: 'Mâlik b. Huveyris',
            kaynak: 'Buhârî, Ezân, 631'
        }
    },
    kavramlar: [
        // ---------------- Kaynaklar ----------------
        {
            id: 'kuran', grup: 'kaynak', ad: "Kur'an", ar: 'القرآن',
            kisa: 'Dinin ilk ve temel kaynağı',
            tanim: "Kur'an, Allah'ın Peygamberimize indirdiği ve bize eksiksiz ulaşan sözüdür. Dinî hükümlerin ilk ve en temel kaynağıdır; bir meselenin hükmü aranırken önce Kur'an'a bakılır. Kur'an'daki hükümlerin bir kısmı ayrıntılıdır (içkinin ve faizin yasaklanması gibi), bir kısmı ise genel bir emir hâlindedir (namazın kılınması gibi); ayrıntıyı Sünnet açıklar.",
            deliller: [{ ayet: '16:89' }, { ayet: '17:9-10' }],
            ornekler: [
                { metin: 'Namazın kılınması, orucun tutulması ve zekâtın verilmesi Kur’an’da açıkça emredilir.', ref: 'Bakara 43, 183' },
                { metin: 'İçki, kumar, faiz ve gıybetin yasak oluşu Kur’an’da açıkça bildirilir.', ref: 'Mâide 90; Bakara 275; Hucurât 12' },
                { metin: 'Kur’an namazı emreder; kaç rekât olduğunu ve nasıl kılınacağını ise Sünnet öğretir.' }
            ],
            akilda: 'Hükmün ilk adresi Kur’an’dır.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler; TDV İslâm Ansiklopedisi, «Kur'ân» ve «Edille-i Şer'iyye» maddeleri.",
            iliskili: ['sunnet-kaynak', 'icma', 'kiyas', 'farz']
        },
        {
            id: 'sunnet-kaynak', grup: 'kaynak', ad: 'Sünnet', ar: 'السنة',
            kisa: 'Peygamberimizin söz, davranış ve onayları',
            tanim: "Sünnet, Peygamberimizin sözleri, davranışları ve gördüğü bir şeye karşı çıkmayarak verdiği onaylardır. Kur'an'dan sonra ikinci kaynaktır: Kur'an'ın genel bıraktığını açıklar, nasıl uygulanacağını gösterir. Burada «sünnet» kaynak anlamındadır; hüküm terazisindeki «sünnet» ise ayrı bir derecedir.",
            deliller: [{ ayet: '59:7' }, { ayet: '4:80' }, { hadis: 'gordugunuz-gibi' }],
            ornekler: [
                { metin: 'Namazların vakitleri, rekât sayıları ve kılınışı Peygamberimizin uygulamasıyla öğrenilir.' },
                { metin: 'Zekâtın hangi mallardan ve hangi oranda verileceği Sünnet’le belirlenmiştir.' },
                { metin: 'Haccın nasıl yapılacağı Peygamberimizin Veda haccındaki uygulamasından öğrenilir.' }
            ],
            akilda: 'Kur’an emreder, Sünnet nasıl yapılacağını gösterir.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Sünnet» maddesi.",
            iliskili: ['kuran', 'sunnet', 'icma']
        },
        {
            id: 'icma', grup: 'kaynak', ad: 'İcmâ', ar: 'الإجماع',
            kisa: 'Âlimlerin bir hükümde birleşmesi',
            tanim: "İcmâ, Peygamberimizin vefatından sonra bir dönemdeki müctehid âlimlerin, dinî bir meselenin hükmünde birleşmesidir. İcmâ Kur'an ve Sünnet'e dayanır; âlimlerin üzerinde birleştiği bir hüküm, ümmetin ortak anlayışını gösterir ve bağlayıcıdır.",
            deliller: [{ ayet: '4:115', not: 'Âlimler bu ayeti, müminlerin ortak yolundan ayrılmamanın gerekliliğine ve icmâın delil oluşuna dayanak göstermiştir.' }],
            ornekler: [
                { metin: 'Kur’an, Hz. Ebû Bekir döneminde sahâbenin ittifakıyla tek bir mushafta toplandı.' },
                { metin: 'Beş vakit namazın rekât sayıları, ümmetin kesintisiz uygulaması ve âlimlerin ittifakıyla bilinir.' }
            ],
            mezhep: 'İcmâın türleri ve şartları hakkında ayrıntılı görüşler vardır; ancak icmâın bir delil olduğunda Ehl-i sünnet mezhepleri birleşir.',
            akilda: 'Âlimlerin birleştiği yerde ümmetin ortak sesi vardır.',
            kaynak: "TDV İslâm Ansiklopedisi, «İcmâ» maddesi; Diyanet İşleri Başkanlığı, İlmihal I.",
            iliskili: ['kuran', 'sunnet-kaynak', 'kiyas']
        },
        {
            id: 'kiyas', grup: 'kaynak', ad: 'Kıyas', ar: 'القياس',
            kisa: 'Ortak gerekçeyle hükmü yeni duruma taşımak',
            tanim: "Kıyas, hakkında Kur'an ve Sünnet'te açık hüküm bulunmayan bir meseleyi, hükmü bilinen bir meseleye aralarındaki ortak gerekçe (illet) sebebiyle benzeterek hükme bağlamaktır. Böylece yeni ortaya çıkan durumlar da dinin ölçüleriyle değerlendirilir.",
            deliller: [
                { ayet: '59:2', not: 'Ayetin sonundaki «Ders alın» emri, âlimlerin kıyasa delil gösterdiği ifadelerdendir.' },
                { hadis: 'sarhosluk', not: 'Hükmün gerekçesi sarhoşluk vermesidir; bu gerekçeyi taşıyan her şey aynı hükmü alır.' }
            ],
            ornekler: [
                { metin: 'Kur’an içkiyi yasaklar; sarhoşluk veren uyuşturucu maddeler de aynı gerekçeyle haramdır.', ref: 'Mâide 90' },
                { metin: 'Cuma ezanı okunurken alışverişi bırakmak emredilir; âlimler namaza engel olan başka meşguliyetleri de aynı gerekçeyle bu emrin kapsamında görmüştür.', ref: 'Cuma 9' }
            ],
            mezhep: 'Dört mezhep kıyası delil kabul eder; Zâhirîler kabul etmez.',
            akilda: 'Gerekçe aynıysa hüküm de aynıdır.',
            kaynak: "TDV İslâm Ansiklopedisi, «Kıyas» maddesi; Diyanet İşleri Başkanlığı, İlmihal I.",
            iliskili: ['kuran', 'icma', 'haram']
        },

        // ---------------- Hüküm terazisi ----------------
        {
            id: 'farz', grup: 'hukum', ad: 'Farz', ar: 'فرض', renk: 'farz', emo: '🟢',
            kisa: 'Yapılması kesin olarak istenen',
            tanim: "Farz, yapılması Kur'an ya da kesin sünnet gibi şüphe taşımayan bir delille istenen davranıştır. Farz olduğu kesin olan bir şeyi inkâr etmek kişiyi dinden çıkarır. Herkesin bizzat yapması gereken farza farz-ı ayn (namaz gibi), bir kısım Müslümanın yapmasıyla diğerlerinden düşen farza farz-ı kifâye (cenaze namazı gibi) denir.",
            yaparsan: 'Sevap kazanırsın.',
            yapmazsan: 'Özürsüz terk etmek günahtır.',
            deliller: [{ ayet: '2:43' }, { ayet: '2:183-184' }, { hadis: 'farzlarla-yaklasma' }],
            ornekler: [
                { metin: 'Beş vakit namaz kılmak', ref: 'Bakara 43; Nisâ 103', soru: 'farz' },
                { metin: 'Ramazan orucunu tutmak', ref: 'Bakara 183', soru: 'farz' },
                { metin: 'Namaz kılmak için abdest almak', ref: 'Mâide 6', soru: 'farz' },
                { metin: 'Malı nisaba ulaşan kimsenin zekât vermesi', ref: 'Bakara 43', soru: 'farz' },
                { metin: 'Emaneti sahibine geri vermek', ref: 'Nisâ 58', soru: 'farz' },
                { metin: 'Cenaze namazı kılmak (farz-ı kifâye)', soru: 'farz' }
            ],
            mezhep: 'Hanefîler, kesin delille sabit olanı farz, kesinliği daha az olan delille sabit olanı vacip diye ayırır. Diğer mezhepler farz ile vacibi çoğunlukla aynı anlamda kullanır.',
            akilda: 'Farz kulluğun temelidir; nafileler onun üstüne kurulur.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Farz» maddesi.",
            iliskili: ['vacip', 'sunnet', 'haram', 'kuran']
        },
        {
            id: 'vacip', grup: 'hukum', ad: 'Vacip', ar: 'واجب', renk: 'vacip', emo: '🔵',
            kisa: 'Farza yakın, yapılması gereken',
            tanim: 'Vacip, Hanefî mezhebine göre yapılması istenen, ancak delili farzın delili kadar kesin olmayan davranıştır. Uygulamada farz gibi yerine getirilir; fark, inkâr edenin durumundadır: Vacibi inkâr eden, farzı inkâr eden gibi dinden çıkmaz.',
            yaparsan: 'Sevap kazanırsın.',
            yapmazsan: 'Özürsüz terk etmek günahtır.',
            deliller: [{ ayet: '108:2', not: 'Hanefîler bu ayeti, imkânı olanın kurban kesmesinin vacip oluşuna delil gösterir.' }],
            ornekler: [
                { metin: 'Vitir namazı kılmak (Hanefî)', soru: 'farz' },
                { metin: 'İmkânı olanın Kurban Bayramı’nda kurban kesmesi (Hanefî)' },
                { metin: 'Bayram namazlarını kılmak (Hanefî)' },
                { metin: 'Fıtır sadakası vermek (Hanefî)', soru: 'farz' },
                { metin: 'Namazda Fâtiha suresini okumak (Hanefî)', soru: 'farz' }
            ],
            mezhep: 'Şâfiî, Mâlikî ve Hanbelî mezheplerinde ayrı bir vacip derecesi yoktur. Bu örneklerin hükmü o mezheplerde farklıdır: Vitir ve kurban sünnet; fıtır sadakası ve namazda Fâtiha okumak farz kabul edilir.',
            akilda: 'Vacip farzın hemen yanındadır; terk edilmez.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Vâcib» maddesi.",
            iliskili: ['farz', 'mekruh-tahrimen', 'sunnet']
        },
        {
            id: 'sunnet', grup: 'hukum', ad: 'Sünnet', ar: 'سنة', renk: 'sunnet', emo: '⭐',
            kisa: 'Peygamberimizin yaptığı ve tavsiye ettiği',
            tanim: 'Hüküm olarak sünnet, Peygamberimizin farz ve vacip dışında yaptığı ya da yapılmasını tavsiye ettiği davranışlardır. Peygamberimizin devamlı yapıp nadiren terk ettiklerine sünnet-i müekkede, ara sıra yaptıklarına sünnet-i gayr-i müekkede denir.',
            yaparsan: 'Sevap kazanırsın.',
            yapmazsan: 'Günah olmaz; ancak müekked sünneti alışkanlık hâlinde terk etmek kınanmayı gerektirir.',
            deliller: [
                { ayet: '33:21' },
                { hadis: 'misvak', not: 'Peygamberimiz misvakı ümmetine zor gelmesin diye emir hâline getirmemiş, tavsiye olarak bırakmıştır. Emir ile tavsiye arasındaki fark, farz ile sünnet arasındaki farktır.' }
            ],
            ornekler: [
                { metin: 'Sabah namazının farzından önce iki rekât sünnet kılmak (müekked)', soru: 'sunnet' },
                { metin: 'Öğle namazının sünnetlerini kılmak (müekked)', soru: 'sunnet' },
                { metin: 'İkindi ve yatsı namazlarının ilk sünnetlerini kılmak (gayr-i müekked)', soru: 'sunnet' },
                { metin: 'Misvak kullanmak, dişleri temizlemek', soru: 'sunnet' },
                { metin: 'Karşılaştığı Müslümana selam vermek', soru: 'sunnet' }
            ],
            mezhep: 'Şâfiî ve Hanbelî mezheplerinde sünnet, mendup, müstehab ve nâfile çoğunlukla aynı anlamda kullanılır. Hanefîler sünneti, özellikle müekked olanını, müstehabdan daha kuvvetli görür.',
            akilda: 'Sünnet, Peygamberimizi örnek alarak yaşamaktır.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Sünnet» maddesi.",
            iliskili: ['sunnet-kaynak', 'mustehab', 'vacip']
        },
        {
            id: 'mustehab', grup: 'hukum', ad: 'Müstehab', ar: 'مستحب', renk: 'mustehab', emo: '🌸',
            kisa: 'Yapılması güzel ve sevaplı olan',
            tanim: 'Müstehab (mendup), Peygamberimizin bazen yaptığı ya da yapılmasını teşvik ettiği davranışlardır. Farzların dışında kılınan nâfile namazlar, tutulan nâfile oruçlar ve verilen sadakalar bu türdendir. Nâfile, tatavvu ve mendup kelimeleri de benzer anlamda kullanılır.',
            yaparsan: 'Sevap kazanırsın.',
            yapmazsan: 'Günah olmaz.',
            deliller: [{ hadis: 'farzlarla-yaklasma' }, { hadis: 'guler-yuz' }],
            ornekler: [
                { metin: 'Kuşluk (duhâ) namazı kılmak', soru: 'sunnet' },
                { metin: 'Pazartesi ve perşembe günleri nâfile oruç tutmak', soru: 'sunnet' },
                { metin: 'Zekâtın dışında, gönülden sadaka vermek', soru: 'sunnet' },
                { metin: 'Kardeşini güler yüzle karşılamak', ref: 'Müslim, Birr, 2626', soru: 'sunnet' },
                { metin: 'Namaz dışında, nâfile olarak Kur’an okumak', soru: 'sunnet' }
            ],
            mezhep: 'Şâfiî ve Hanbelî mezheplerinde müstehab, mendup, sünnet ve nâfile çoğunlukla aynı anlamda kullanılır.',
            akilda: 'İyiliğin küçüğü yoktur.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Mendûb» maddesi.",
            iliskili: ['sunnet', 'mubah', 'niyet']
        },
        {
            id: 'mubah', grup: 'hukum', ad: 'Mubah', ar: 'مباح', renk: 'mubah', emo: '⚪',
            kisa: 'Yapıp yapmamakta serbest olunan',
            tanim: 'Mubah, yapılıp yapılmaması kişinin tercihine bırakılan davranıştır. Gündelik hayatın büyük bölümü mubahtır: yemek, uyumak, gezmek, alışveriş yapmak gibi. Mubah bir iş güzel bir niyetle yapılırsa sevaba vesile olur.',
            yaparsan: 'Sevap da günah da yoktur; güzel bir niyetle sevaba dönüşür.',
            yapmazsan: 'Sevap da günah da yoktur.',
            deliller: [
                { ayet: '5:2', not: 'İhram sırasında yasak olan avlanma, ihramdan çıkınca serbest bırakılmıştır. Âlimlere göre yasaktan sonra gelen bu tür emirler «yapabilirsiniz» anlamındadır.' },
                { ayet: '62:10', not: 'Cuma namazı bitince işe ve rızık aramaya dönmek serbesttir.' }
            ],
            ornekler: [
                { metin: 'Helal yiyeceklerden canının istediğini seçip yemek', soru: 'mubah' },
                { metin: 'Alışveriş yapmak, ticaretle uğraşmak', ref: 'Bakara 275', soru: 'mubah' },
                { metin: 'Yürüyüş yapmak, spor yapmak', soru: 'mubah' },
                { metin: 'Uyumak, dinlenmek', soru: 'mubah' },
                { metin: 'Giyeceği kıyafetin rengini seçmek', soru: 'mubah' }
            ],
            mezhep: 'Bütün mezhepler mubahı aynı anlamda kullanır.',
            akilda: 'Serbest olan çoktur; niyet onu ibadete çevirir.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Mubah» maddesi.",
            iliskili: ['ibaha', 'niyet', 'helal']
        },
        {
            id: 'mekruh-tenzihen', grup: 'hukum', ad: 'Mekruh (tenzîhen)', kisaAd: 'Tenzîhen mekruh', ar: 'مكروه تنزيها', renk: 'tenzihen', emo: '🟡',
            kisa: 'Yapılmaması daha iyi olan',
            tanim: 'Tenzîhen mekruh, yapılmaması yapılmasından daha iyi olan davranıştır; helale daha yakındır. Yapan günaha girmez, fakat güzel olanı kaçırmış olur. Diğer mezheplerde «mekruh» denince genellikle bu anlam kastedilir.',
            yaparsan: 'Günah olmaz; ama güzel olanı kaçırırsın.',
            yapmazsan: 'Sevap kazanırsın.',
            deliller: [{ hadis: 'sarimsak' }, { ayet: '7:31' }],
            ornekler: [
                { metin: 'Abdest alırken suyu israf etmek', soru: 'mekruh' },
                { metin: 'Çiğ soğan ya da sarımsak yiyip ağız kokusuyla camiye gitmek', ref: 'Buhârî, Ezân, 855', soru: 'mekruh' }
            ],
            mezhep: 'Tenzîhen ve tahrîmen ayrımı Hanefî mezhebine aittir. Diğer mezheplerde mekruh, terk edilmesi daha iyi olan ve yapana günah yazılmayan davranıştır.',
            akilda: 'Mekruhtan uzak duran, güzel olanı seçmiş olur.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Mekruh» maddesi.",
            iliskili: ['mekruh-tahrimen', 'mubah', 'mustehab']
        },
        {
            id: 'mekruh-tahrimen', grup: 'hukum', ad: 'Mekruh (tahrîmen)', kisaAd: 'Tahrîmen mekruh', ar: 'مكروه تحريما', renk: 'tahrimen', emo: '🟠',
            kisa: 'Harama yakın, kaçınılması gereken',
            tanim: 'Tahrîmen mekruh, Hanefî mezhebine göre yapılmaması kesin olmayan bir delille istenen davranıştır; harama yakındır. Vacibin karşıtıdır: Vacip yapılması, tahrîmen mekruh ise terk edilmesi gereken davranıştır. Haramın aksine, bunu inkâr eden dinden çıkmaz.',
            yaparsan: 'Günah olur.',
            yapmazsan: 'Sevap kazanırsın.',
            deliller: [{ ayet: '62:9' }, { hadis: 'kerahat-vakitleri' }],
            ornekler: [
                { metin: 'Cuma ezanı okunurken alışverişe devam etmek', ref: 'Cuma 9' },
                { metin: 'Güneş doğarken, tam tepedeyken ya da batarken namaz kılmak (kerahat vakitleri)', ref: 'Müslim, Salâtü’l-müsâfirîn, 831', soru: 'mekruh' }
            ],
            mezhep: 'Bu derece yalnız Hanefî mezhebinde vardır. Diğer mezhepler bu örneklerin bir kısmını haram, bir kısmını mekruh sayar; örneğin Cuma ezanı okunurken yapılan alışveriş diğer üç mezhepte haramdır.',
            akilda: 'Harama yakın olandan uzak dur.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Mekruh» maddesi.",
            iliskili: ['haram', 'vacip', 'mekruh-tenzihen']
        },
        {
            id: 'haram', grup: 'hukum', ad: 'Haram', ar: 'حرام', renk: 'haram', emo: '🔴',
            kisa: 'Yapılmaması kesin olarak istenen',
            tanim: "Haram, yapılmaması Kur'an ya da kesin sünnet gibi şüphe taşımayan bir delille istenen davranıştır. Allah rızası için haramdan kaçınan sevap kazanır. Haram olduğu kesin olarak bilinen bir şeyi helal saymak kişiyi dinden çıkarır.",
            yaparsan: 'Günah olur.',
            yapmazsan: 'Allah rızası için kaçınırsan sevap kazanırsın.',
            deliller: [{ ayet: '5:90' }, { ayet: '2:173' }, { ayet: '49:12' }, { hadis: 'kan-mal-namus' }],
            ornekler: [
                { metin: 'İçki içmek, kumar oynamak', ref: 'Mâide 90', soru: 'haram' },
                { metin: 'Domuz eti, leş ya da kan yemek', ref: 'Bakara 173', soru: 'haram' },
                { metin: 'Faiz almak', ref: 'Bakara 275', soru: 'haram' },
                { metin: 'Gıybet etmek, insanların kusurlarını araştırmak', ref: 'Hucurât 12', soru: 'haram' },
                { metin: 'Başkasının malını haksız yere almak, hırsızlık yapmak', ref: 'Nisâ 29; Mâide 38', soru: 'haram' },
                { metin: 'Yalan söylemek', ref: 'Hac 30', soru: 'haram' }
            ],
            mezhep: 'Kesin delille sabit olan haramlarda mezhepler arasında görüş ayrılığı yoktur.',
            akilda: 'Haram, Allah’ın çizdiği sınırdır; sınıra yaklaşma.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Haram» maddesi.",
            iliskili: ['helal', 'supheli', 'mekruh-tahrimen', 'zaruret']
        },

        // ---------------- Helal, haram ve şüpheli ----------------
        {
            id: 'helal', grup: 'cati', ad: 'Helal', ar: 'حلال', renk: 'helal', emo: '✅',
            kisa: 'Dinin izin verdiği her şey',
            tanim: 'Helal, dinin yasaklamadığı ve yapılmasında sakınca bulunmayan şeydir. Geniş anlamıyla haramın dışındaki bütün davranışları içine alır: Farzdan mubaha kadar uzanan geniş bir alandır. Bir şeyi helal ya da haram kılma yetkisi yalnızca Allah’a aittir; kimse kendi görüşüyle helali haram, haramı helal sayamaz.',
            deliller: [{ ayet: '2:168' }, { ayet: '5:87' }, { ayet: '16:116' }],
            ornekler: [
                { metin: 'Temiz ve helal yiyeceklerden yemek', ref: 'Bakara 168' },
                { metin: 'Karşılıklı rızayla alışveriş yapmak', ref: 'Nisâ 29' },
                { metin: 'Helal kazanç için çalışmak' },
                { metin: 'Allah’ın helal kıldığı bir şeyi kendi kendine haram saymamak', ref: 'Mâide 87' }
            ],
            akilda: 'Helalin alanı geniştir; haram sınırlı ve bellidir.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Helâl» maddesi.",
            iliskili: ['haram', 'supheli', 'mubah', 'ibaha']
        },
        {
            id: 'supheli', grup: 'cati', ad: 'Şüpheli', ar: 'مشتبهات', renk: 'supheli', emo: '❔',
            kisa: 'Helal mi haram mı olduğu belli olmayan',
            tanim: 'Şüpheli şeyler, helal mi haram mı olduğu kişiye açıkça belli olmayan şeylerdir. Peygamberimiz bunlardan sakınmayı, dinini ve namusunu korumanın yolu olarak göstermiştir. Şüphe, araştırarak ve bilen birine sorarak giderilir; giderilemiyorsa sakınmak takvadır.',
            deliller: [{ hadis: 'helal-bellidir' }],
            ornekler: [
                { metin: 'İçindekileri bilinmeyen bir yiyeceği, ne olduğunu öğrenmeden yememek' },
                { metin: 'Kazancının helal olup olmadığından emin olunamayan bir işe girmemek' },
                { metin: 'Hükmünü bilmediğin bir konuyu bir din âlimine ya da güvenilir bir kaynağa sormak' }
            ],
            akilda: 'Şüpheden sakınan, dinini korur.',
            kaynak: 'Buhârî, Îmân, 52; Müslim, Müsâkāt, 1599; Diyanet İşleri Başkanlığı, İlmihal I.',
            iliskili: ['helal', 'haram', 'ibaha']
        },

        // ---------------- İlkeler ----------------
        {
            id: 'niyet', grup: 'ilke', ad: 'Niyet', ar: 'نية',
            kisa: 'Bir işi hangi amaçla yaptığını bilmek',
            tanim: 'Niyet, bir işi hangi amaçla yaptığını kalben bilmek ve istemektir. Namaz ve oruç gibi ibadetler niyetle geçerli olur. Mubah işler de güzel bir niyetle yapıldığında sevaba dönüşür; aynı davranış, niyete göre ibadet ya da sıradan bir iş olur.',
            deliller: [{ hadis: 'niyet' }, { ayet: '98:5' }, { hadis: 'aileye-harcama' }],
            ornekler: [
                { metin: 'Ailesinin geçimi için çalışan kimse, Allah rızasını umarsa sevap kazanır.', ref: 'Buhârî, Îmân, 55' },
                { metin: 'Namaza başlarken hangi namazı kıldığını kalben bilmek' },
                { metin: 'Spor yapmayı, sağlıklı kalıp ibadetlerini yerine getirebilmek niyetiyle yapmak' }
            ],
            mezhep: 'Hanefîlere göre abdestte niyet sünnettir; diğer mezheplere göre farzdır.',
            akilda: 'Niyet, sıradan bir işi ibadete çevirir.',
            kaynak: "Buhârî, Bed'ü'l-vahy, 1; Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Niyet» maddesi.",
            iliskili: ['mubah', 'mustehab', 'farz']
        },
        {
            id: 'ibaha', grup: 'ilke', ad: 'Asıl olan serbestliktir', kisaAd: 'Asıl serbestlik', ar: 'الأصل في الأشياء الإباحة',
            kisa: 'Yasak delil ister, serbestlik asıldır',
            tanim: 'Âlimlerin çoğunluğuna göre, hakkında yasak bulunmayan eşya ve davranışlarda asıl olan serbestliktir (ibâha). Yani bir şeyin haram olduğunu göstermek için delil gerekir; serbest olduğunu göstermek için ayrıca delil aranmaz. İbadetlerde ise durum farklıdır: İbadet ancak dinin bildirdiği şekilde yapılır; kimse kendiliğinden yeni bir ibadet ortaya koyamaz.',
            deliller: [{ ayet: '2:29' }, { ayet: '45:13' }],
            ornekler: [
                { metin: 'Yeni çıkan bir yiyeceği, içinde haram bir madde yoksa yemek serbesttir.' },
                { metin: 'Telefon ve bilgisayar gibi yeni araçlar kendiliğinden serbesttir; hükümleri nasıl kullanıldıklarına göre belirlenir.' },
                { metin: 'Namaza yeni bir rekât eklemek ya da yeni bir ibadet şekli uydurmak caiz değildir; ibadet dinin bildirdiği gibi yapılır.' }
            ],
            mezhep: 'Âlimlerin çoğunluğu bu ilkeyi benimser; bir kısım âlim ise delil bulununcaya kadar hüküm vermemeyi (tevakkuf) tercih etmiştir.',
            akilda: 'Yasak delil ister; ibadet ise dinin bildirdiği gibi yapılır.',
            kaynak: "TDV İslâm Ansiklopedisi, «İbâha» maddesi; Diyanet İşleri Başkanlığı, İlmihal I.",
            iliskili: ['mubah', 'helal', 'supheli']
        },
        {
            id: 'guc', grup: 'ilke', ad: 'Güç yetirme ve sorumluluk', kisaAd: 'Güç yetirme', ar: 'التكليف',
            kisa: 'Allah kimseye gücünün üstünde yük yüklemez',
            tanim: 'Dinin emir ve yasaklarından sorumlu olan kişiye mükellef denir: Akıllı ve ergenlik çağına girmiş her Müslüman mükelleftir. Allah kimseyi gücünün yetmediği bir şeyle sorumlu tutmaz. Emirler güç yettiği ölçüde yerine getirilir; yasaklardan ise kaçınılır.',
            deliller: [{ ayet: '2:286' }, { ayet: '64:16' }, { hadis: 'gucunuz-yettigince' }],
            ornekler: [
                { metin: 'Çocuklar mükellef değildir; ama namaza ve güzel davranışlara küçük yaşta alıştırılır.' },
                { metin: 'Akıl hastası olan kimse ibadetlerden sorumlu tutulmaz.' },
                { metin: 'Malı nisaba ulaşmayan zekâtla, yolculuğa gücü yetmeyen hacla yükümlü değildir.', ref: 'Âl-i İmrân 97' }
            ],
            akilda: 'Allah, gücün yetmeyeni istemez.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Teklîf» maddesi.",
            iliskili: ['ruhsat', 'zaruret', 'farz']
        },
        {
            id: 'ruhsat', grup: 'ilke', ad: 'Ruhsat ve azimet', kisaAd: 'Ruhsat', ar: 'رخصة وعزيمة',
            kisa: 'Zorlukta tanınan kolaylık',
            tanim: 'Azimet, dinin asıl ve genel hükmüdür. Ruhsat ise hastalık, yolculuk ya da zorlama gibi bir zorluk sebebiyle tanınan kolaylıktır. Dinde kolaylık esastır; ruhsatı kullanmak da Allah’ın bir lütfudur.',
            deliller: [{ ayet: '2:185' }, { hadis: 'kolaylastirin' }, { hadis: 'gucun-yetmezse' }],
            ornekler: [
                { metin: 'Hasta ya da yolcu olan, Ramazan’da tutamadığı oruçları sonra kaza eder.', ref: 'Bakara 185' },
                { metin: 'Su bulamayan ya da suyun zarar vereceği kimse teyemmüm eder.', ref: 'Mâide 6' },
                { metin: 'Ayakta duramayan oturarak, oturamayan yan yatarak namaz kılar.', ref: 'Buhârî, Taksîru’s-salât, 1117' },
                { metin: 'Yolcu, dört rekâtlı farz namazları iki rekât kılar.', ref: 'Nisâ 101' }
            ],
            mezhep: 'Hanefîlere göre yolculukta dört rekâtlı farzları iki kılmak ruhsat değil, uyulması gereken bir hükümdür (azimet). Diğer mezheplere göre bu bir ruhsattır; dileyen tam kılabilir.',
            akilda: 'Dinde zorluk değil, kolaylık esastır.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Ruhsat» ve «Azîmet» maddeleri.",
            iliskili: ['guc', 'zaruret', 'farz']
        },
        {
            id: 'zaruret', grup: 'ilke', ad: 'Zaruret', ar: 'ضرورة',
            kisa: 'Başka çaresi olmayan zorunlu durum',
            tanim: 'Zaruret, kişinin hayatını ya da sağlığını tehlikeye sokan ve başka çaresi olmayan zorunlu durumdur. Böyle bir durumda haram olan bir şey, tehlikeyi giderecek kadarıyla mubah olur. Sınır aşılmaz; zaruret bitince yasak geri döner. Mecelle’deki külli kaideler bunu şöyle özetler: «Zaruretler yasakları mubah kılar» ve «Zaruretler kendi miktarlarınca takdir olunur».',
            deliller: [{ ayet: '2:173' }, { ayet: '6:119' }],
            ornekler: [
                { metin: 'Açlıktan ölmek üzere olan ve başka yiyeceği bulunmayan kimse, hayatını kurtaracak kadar haram yiyecekten yiyebilir.', ref: 'Bakara 173' },
                { metin: 'Canın çekmesi, merak ya da sıradan bir kolaylık zaruret sayılmaz.' }
            ],
            akilda: 'Zaruret, yasağı ancak gerektiği kadar kaldırır.',
            kaynak: "Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, «Zarûret» maddesi; Mecelle-i Ahkâm-ı Adliyye, külli kaideler.",
            iliskili: ['haram', 'ruhsat', 'guc']
        }
    ]
};
