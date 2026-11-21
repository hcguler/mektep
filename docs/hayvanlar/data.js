// ============================================
// Kur'an'da Hayvanlar — içerik
// --------------------------------------------
// Kur'an'da adı geçen ya da kıssasında yer alan on beş hayvan ve hayvanlara merhamet üzerine sahih hadisler.
// Kaynak sırası: 1) Kur'an (ayet metni ve meali ayetler.js'te: Tanzil Simple + Diyanet İşleri meali,
// tools/lib/tanzil-ayetler.mjs), 2) Buhârî ve Müslim (anlam olarak, kısaltılarak; Müslim numarası
// M. Fuâd Abdülbâkî numarasıdır), 3) tefsir bağlamı için TDV İslâm Ansiklopedisi'nin ilgili maddeleri.
// Ayetin söylemediği ayrıntı (köpeğin adı, balığın türü, kuşların türü, kardeşlerin adları vb.) yazılmaz.
// tools/hayvanlar-uret.mjs: ayetleri üretir, Arapça adı "adAyet" ayetinin Tanzil metninden alır (adlar.js),
// hadis künyelerini hadith-api ile, peygamber kimliklerini apps/peygamberler/data.js ile denetler.
//
// Alanlar (hayvan): id · ad · grup · renk (kart rengi) · b (harekesiz Arapça ad; adlar.js için) · adAyet
//   okunus · anlam (Arapça adın anlamı) · ayetler [ref] · kissa {ad, p (peygamber kimliği), pAd (bağlantı adı, ad farklıysa), sure}
//   kisa · aciklama [paragraf] · hadis (hadisler sözlüğünde kimlik) · cocuk (çocuk temasında öne çıkan davranış)
//   akilda · gorusFarki · not · kaynak [madde]
// Alanlar (hadis): baslik · metin · ravi · kaynak · k [[kitap, no, ravi (hadith-api İngilizce metninde aranır)]]
//   ders · cocuk · merhamet (Merhamet sayfasında listelenir mi)
// ============================================
window.HAYVAN_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    gruplar: [
        { id: 'kissa', ad: 'Peygamber kıssalarında', alt: 'Bir peygamberin hikâyesinde geçenler', emo: '📜' },
        { id: 'olay', ad: 'Kur’an’ın anlattığı olaylarda', alt: 'İbret dolu olaylarda geçenler', emo: '⛰️' },
        { id: 'ornek', ad: 'Örnek ve ibretlerde', alt: 'Allah’ın örnek verdiği, bakıp düşünmeye çağırdığı', emo: '🔍' }
    ],
    hayvanlar: [
        // ---------------- Peygamber kıssalarında ----------------
        {
            id: 'karinca', ad: 'Karınca', grup: 'kissa', renk: '#c8553d',
            b: 'النمل', adAyet: '27:18', okunus: 'en-neml', anlam: 'karıncalar',
            ayetler: ['27:18-19'], kissa: { ad: 'Hz. Süleymân', p: 'suleyman' },
            kisa: 'Arkadaşlarını tehlikeye karşı uyaran küçük karınca.',
            aciklama: [
                'Hz. Süleymân ordusuyla birlikte karıncaların bulunduğu bir vadiye geldi. Bir karınca ötekilere, “Yuvalarınıza girin, Süleymân’ın ordusu farkına varmadan sizi ezmesin” dedi.',
                'Hz. Süleymân karıncanın sözüne hafifçe güldü. Kendisine ve anne babasına verilen nimete şükretmeyi, Allah’ın hoşnut olacağı işi yapmayı Rabbinden istedi.',
                'Neml suresi adını bu ayette geçen “neml” (karınca) kelimesinden alır.'
            ],
            hadis: 'karinca',
            cocuk: 'Karınca gibi arkadaşlarını tehlikeye karşı uyar.',
            akilda: 'Arkadaşını tehlikeye karşı uyarmak da, nimete şükretmek de güzel bir davranıştır.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Neml Sûresi”']
        },
        {
            id: 'hudhud', ad: 'Hüdhüd kuşu', grup: 'kissa', renk: '#d9822b',
            b: 'الهدهد', adAyet: '27:20', okunus: 'el-hüdhüd', anlam: 'hüdhüd kuşu',
            ayetler: ['27:20-28'], kissa: { ad: 'Hz. Süleymân', p: 'suleyman' },
            kisa: 'Hz. Süleymân’a uzak bir ülkeden haber getiren kuş.',
            aciklama: [
                'Hz. Süleymân kuşları yokladığında hüdhüdü göremedi. Hüdhüd çok geçmeden geldi ve Sebe’den doğru bir haber getirdiğini söyledi: Orada halkı bir kadın yönetiyordu; o ve halkı Allah’ı bırakıp güneşe secde ediyordu.',
                'Hz. Süleymân haberi hemen kabul etmedi; “Doğru mu söylüyorsun, yoksa yalancılardan mısın, bakacağız” dedi. Sonra hüdhüde bir mektup verip onu Sebe halkına götürmesini istedi.',
                'Hüdhüd, başındaki tarak gibi tüyleriyle tanınan bir kuştur; Türkçede ibibik ya da çavuşkuşu da denir.'
            ],
            not: 'Hüdhüd hakkında anlatılan başka hikâyeler (adı, yer altındaki suyu görmesi gibi) Kur’an’da geçmez; burada yalnızca ayetlerde anlatılanlar yazılmıştır.',
            cocuk: 'Hüdhüd gibi gördüğünü doğru anlat; Hz. Süleymân gibi de duyduğunu araştır.',
            akilda: 'Haber getiren doğru söylemeli, haberi alan da araştırmalıdır.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hüdhüd”']
        },
        {
            id: 'dortkus', ad: 'Dört kuş', grup: 'kissa', renk: '#3f8fb0',
            b: 'الطير', adAyet: '2:260', okunus: 'et-tayr', anlam: 'kuşlar',
            ayetler: ['2:260'], kissa: { ad: 'Hz. İbrâhîm', p: 'ibrahim' },
            kisa: 'Hz. İbrâhîm’e ölülerin nasıl diriltildiğini gösteren dört kuş.',
            aciklama: [
                'Hz. İbrâhîm, Rabbinden ölüleri nasıl dirilttiğini kendisine göstermesini istedi. “İnanmıyor musun?” sorusuna, “İnanıyorum, fakat kalbim iyice kansın” diye cevap verdi.',
                'Allah ona dört çeşit kuş almasını, onları kendine alıştırmasını, sonra parçalarını dağların üzerine koyup onları çağırmasını bildirdi; kuşlar koşarak ona gelecekti.',
                'Ayet, “Allah’ın güçlü ve hikmet sahibi olduğunu bil” sözüyle biter.'
            ],
            gorusFarki: 'Diyanet meali ve müfessirlerin çoğu ayeti, kuşların kesilip parçalarının dağlara konduğu biçiminde anlar. Ebû Müslim el-İsfahânî gibi bazı müfessirler ise ayette kuşların yalnızca alıştırılıp çağrıldığını söyler. Kuşların hangi türden olduğunu ayet bildirmez.',
            hadis: 'ekin',
            cocuk: 'Hz. İbrâhîm gibi merak ettiğini sor; öğrenince kalbin rahatlasın.',
            akilda: 'Soru sormak imanı zayıflatmaz; Hz. İbrâhîm kalbi iyice kansın diye sordu.',
            kaynak: ['Görüş farkı: Abdurrahman Ateş, “Ölülerin Nasıl Diriltildiğinin Kuşlar Üzerinden Hz. İbrahim’e Gösterilmesi”, İstanbul Üniversitesi İlahiyat Fakültesi Dergisi, 7/1 (2016), s. 9-34']
        },
        {
            id: 'balik', ad: 'Balık', grup: 'kissa', renk: '#2a8c9e',
            b: 'الحوت', adAyet: '37:142', okunus: 'el-hût', anlam: 'balık',
            ayetler: ['37:139-148', '21:87-88'], kissa: { ad: 'Hz. Yûnus', p: 'yunus' },
            kisa: 'Hz. Yûnus’u yutan balık.',
            aciklama: [
                'Hz. Yûnus kavminden öfkeyle ayrılıp dolu bir gemiye bindi. Gemide çekilen kurada yenilenlerden oldu ve denize atıldı; onu bir balık yuttu.',
                'Hz. Yûnus karanlıklar içinde, “Senden başka tanrı yoktur, Sen münezzehsin, doğrusu ben haksızlık edenlerdenim” diye seslendi. Allah onun duasını kabul edip onu üzüntüden kurtardı ve sahile çıkardı. Allah’ı tesbih edenlerden olmasaydı, diriliş gününe kadar balığın karnında kalacaktı.',
                'Kur’an ona “Zünnûn” (balık sahibi) da der. Balığın türünü ayet bildirmez.'
            ],
            cocuk: 'Zor bir anda Hz. Yûnus gibi dua et; Allah duayı işitir.',
            akilda: 'Hatasını kabul edip Allah’a yönelen, sıkıntıdan kurtulur.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Yûnus”']
        },
        {
            id: 'disideve', ad: 'Dişi deve', grup: 'kissa', renk: '#b5793a',
            b: 'ناقة', adAyet: '91:13', okunus: 'nâka', anlam: 'dişi deve',
            ayetler: ['91:11-15', '7:73'], kissa: { ad: 'Hz. Sâlih', p: 'salih' },
            kisa: 'Semûd kavmine Allah’ın bir delili olarak gösterilen dişi deve.',
            aciklama: [
                'Hz. Sâlih, Semûd kavmine peygamber olarak gönderildi. Allah’ın bir delili olarak onlara bir dişi deve gösterildi. Hz. Sâlih kavmine, “Onu bırakın, Allah’ın toprağında otlasın; ona kötülük etmeyin” dedi.',
                'Kavmine, devenin ve onun su içme hakkının korunması söylenmişti. Fakat içlerinden en azgını ileri atıldı ve deveyi boğazladılar. Bunun üzerine Rableri onları suçları yüzünden azaba uğrattı.',
                'TDV İslâm Ansiklopedisi’ne göre Semûd kavmi, Suriye ile Hicaz arasındaki Hicr bölgesinde yaşıyordu.'
            ],
            hadis: 'hicr',
            cocuk: 'Sana emanet edilen hayvana iyi bak, ona zarar verme.',
            akilda: 'Allah’ın korunmasını istediği canlıya dokunmamak, O’nun emrine saygıdır.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Sâlih” (peygamber)']
        },
        {
            id: 'inek', ad: 'İnek', grup: 'kissa', renk: '#8a6d4b',
            b: 'بقرة', adAyet: '2:67', okunus: 'bakara', anlam: 'inek, sığır',
            ayetler: ['2:67-71', '2:72-73'], kissa: { ad: 'Hz. Mûsâ', p: 'musa' },
            kisa: 'Hz. Mûsâ’nın kavmine kesilmesi emredilen inek.',
            aciklama: [
                'İsrâiloğulları arasında bir kişi öldürülmüş, suç birbirlerinin üzerine atılıyordu. Hz. Mûsâ, Allah’ın onlara bir inek kesmelerini emrettiğini bildirdi.',
                'Kavmi emri hemen yerine getirmedi; ineğin yaşını, rengini ve özelliklerini tekrar tekrar sordular. Sonunda ineği kestiler; ama az kalsın bunu yapmayacaklardı. Ardından ineğin bir parçasıyla öldürülen kişiye vurulması emredildi; ayet, Allah’ın gizlenen şeyi ortaya çıkardığını ve ölüleri böyle dirilttiğini bildirir.',
                'Bakara suresi adını bu kıssadan alır; “bakara” inek, sığır demektir. Diyanet meali bu ayetlerde “sığır” der.'
            ],
            hadis: 'kesim',
            cocuk: 'Senden bir iş istendiğinde bahane arama, güzelce yap.',
            akilda: 'Emri bahanelerle zorlaştırmak yerine güzelce yerine getirmek gerekir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Bakara Sûresi”']
        },
        {
            id: 'kurt', ad: 'Kurt', grup: 'kissa', renk: '#6b7a8f',
            b: 'الذئب', adAyet: '12:13', okunus: 'ez-zi’b', anlam: 'kurt',
            ayetler: ['12:13-18'], kissa: { ad: 'Hz. Yûsuf', p: 'yusuf' },
            kisa: 'Hz. Yûsuf’un kardeşlerinin suçu üzerine attığı kurt.',
            aciklama: [
                'Hz. Yakup, oğlu Yûsuf’u kardeşleriyle göndermek istemedi; onlar farkına varmadan onu kurdun yemesinden korktuğunu söyledi. Kardeşleri, “Biz kuvvetli bir topluluğuz” diyerek onu götürdüler ve bir kuyunun derinliklerine bıraktılar.',
                'Akşam ağlayarak babalarına geldiler ve “Bir kurt onu yedi” dediler; gömleğini de üzerine başka bir kan bulaşmış olarak getirdiler. Hz. Yakup, “Sizi nefsiniz bir iş yapmaya sürükledi; artık bana güzelce sabır gerekir” dedi.',
                'Kurdun bu olayda bir suçu yoktu; söylenen bir yalandı.'
            ],
            cocuk: 'Bir hata yaptığında suçu başkasına atma, doğruyu söyle.',
            akilda: 'Kendi suçunu başkasının üzerine atmak, yalanı büyütür.',
            kaynak: []
        },
        // ---------------- Kur'an'ın anlattığı olaylarda ----------------
        {
            id: 'kopek', ad: 'Köpek', grup: 'olay', renk: '#a0703c',
            b: 'كلبهم', adAyet: '18:18', okunus: 'kelbühüm', anlam: 'köpekleri',
            ayetler: ['18:18', '18:22'], kissa: { ad: 'Ashâb-ı Kehf' },
            kisa: 'Mağaradaki gençlerin yanında, eşikte uzanan köpek.',
            aciklama: [
                'Ashâb-ı Kehf (Mağara arkadaşları), Rablerine inanan ve inançlarını korumak için bir mağaraya sığınan gençlerdir. Allah onları mağarada uzun süre uyuttu.',
                'Ayet, onlar uyurken köpeklerinin dirseklerini (ön ayaklarını) mağaranın eşiğine uzatmış olduğunu bildirir.',
                'İnsanlar onların sayısı hakkında farklı şeyler söylediler: üç, beş ya da yedi kişi oldukları ve köpeklerinin de onlarla birlikte olduğu. Ayet, “Onların sayısını en iyi bilen Rabbim’dir” der.'
            ],
            gorusFarki: 'Bazı müfessirler, ayette son sayılan “yedi kişi, sekizincisi köpekleri” sözünü gerçeğe daha yakın görmüştür; ancak ayet sayıyı Allah’ın bildiğini söyler. Köpeğin adı ve rengi gibi ayrıntılar Kur’an’da yoktur.',
            hadis: 'su',
            cocuk: 'Susamış bir hayvan görürsen ona su ver.',
            akilda: 'Bir hayvana su vermek bile Allah katında büyük bir iyiliktir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ashâb-ı Kehf”']
        },
        {
            id: 'karga', ad: 'Karga', grup: 'olay', renk: '#4a4e69',
            b: 'غرابا', adAyet: '5:31', okunus: 'gurâb', anlam: 'karga',
            ayetler: ['5:27-31'], kissa: { ad: 'Hz. Âdem’in iki oğlu', p: 'adem', pAd: 'Hz. Âdem' },
            kisa: 'Hz. Âdem’in oğluna kardeşini nasıl gömeceğini gösteren karga.',
            aciklama: [
                'Kur’an, Hz. Âdem’in iki oğlunun haberini anlatır. İkisi birer kurban sundu; birininki kabul edildi, diğerininki edilmedi. Kurbanı kabul edilmeyen kardeşini öldürmekle tehdit etti; kardeşi ise “Sen beni öldürmek için elini uzatsan da ben seni öldürmek için elimi uzatmam” dedi. Sonunda kardeşini öldürdü ve zarara uğrayanlardan oldu.',
                'Allah, ona kardeşinin cesedini nasıl gömeceğini göstermek için yeri eşeleyen bir karga gönderdi. O da “Bu karga kadar olmaktan aciz mi kaldım?” diyerek yaptığına pişman oldu.',
                'Kur’an bu iki kardeşin adlarını vermez; Hâbil ve Kâbil adları sonraki rivayetlerde geçer.'
            ],
            cocuk: 'Öfkelendiğinde dur ve sakinleş; kardeşine iyi davran.',
            akilda: 'Öfkeye yenilmek insanı pişman eder; küçük bir karga bile insana ders olabilir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Hâbil ve Kābil”']
        },
        {
            id: 'fil', ad: 'Fil', grup: 'olay', renk: '#6c7a89',
            b: 'الفيل', adAyet: '105:1', okunus: 'el-fîl', anlam: 'fil',
            ayetler: ['105:1-5'], kissa: { ad: 'Fil sahipleri', sure: 105 },
            kisa: 'Kâbe’yi yıkmaya gelen ordunun fili.',
            aciklama: [
                'Fîl suresi, “Fil sahiplerine Rabbinin ne ettiğini görmedin mi?” diye başlar. Allah onların düzenlerini boşa çıkardı.',
                'Tefsir ve siyer kaynaklarına göre fil sahipleri, Yemen’in Habeşli valisi Ebrehe ve ordusudur. Ebrehe, Kâbe’yi yıkmak için fillerin de bulunduğu bir orduyla Mekke’ye yürüdü; ordusu amacına ulaşamadan helak oldu.',
                'Araplar bu yıla “Fil yılı” dedi. Peygamberimizin bu yıl doğduğu kabul edilir.'
            ],
            hadis: 'fil',
            cocuk: 'Kâbe’yi Allah korur; biz de ona saygı gösterelim.',
            akilda: 'Güç ve kalabalık, Allah’ın koruduğu şeye karşı bir işe yaramaz.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fîl Sûresi”', 'TDV İslâm Ansiklopedisi, “Ebrehe”']
        },
        {
            id: 'ebabil', ad: 'Ebâbîl kuşları', grup: 'olay', renk: '#5b7fb5',
            b: 'ابابيل', adAyet: '105:3', okunus: 'ebâbîl', anlam: 'bölük bölük, sürü sürü',
            ayetler: ['105:3-4'], kissa: { ad: 'Fil sahipleri', sure: 105 },
            kisa: 'Fil sahiplerinin üzerine sürü sürü gönderilen kuşlar.',
            aciklama: [
                'Fîl suresinde Allah, fil sahiplerinin üzerine sert taşlar atan kuşları sürü sürü gönderdiğini bildirir.',
                '“Ebâbîl” bir kuş türünün adı değildir; “bölük bölük, sürü sürü” demektir. Ayet bu kuşların hangi türden olduğunu bildirmez.',
                'Taşların “siccîl”den olduğu söylenir; bu kelime tuğla gibi taşlaşmış çamur diye açıklanır.'
            ],
            gorusFarki: 'Klasik tefsirler olayı bir mucize olarak anlatır. Muhammed Abduh gibi bazı çağdaş âlimler olayı bulaşıcı bir hastalıkla açıklamış, ancak çağdaş müfessirlerin çoğu bu yorumu benimsememiştir.',
            cocuk: 'Allah dilerse en küçük canlılarla bile büyük işler yapar.',
            akilda: 'Allah dilediğini en küçük varlıklarla da gerçekleştirir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Fîl Sûresi”']
        },
        // ---------------- Örnek ve ibretlerde ----------------
        {
            id: 'ari', ad: 'Arı', grup: 'ornek', renk: '#e0a100',
            b: 'النحل', adAyet: '16:68', okunus: 'en-nahl', anlam: 'bal arısı',
            ayetler: ['16:68-69'],
            kisa: 'Rabbinin gösterdiği yolda çalışan ve şifalı bal yapan arı.',
            aciklama: [
                'Ayette, Allah’ın bal arısına dağlarda, ağaçlarda ve kovanlarda yuva edinmesini, her çeşit üründen yemesini ve Rabbinin gösterdiği yollardan yürümesini öğrettiği bildirilir. Ayetin Arapçasında “vahyetti” denir; Diyanet meali bunu “öğretti” diye çevirir.',
                'Arıların karınlarından çeşitli renklerde, insanlara şifa olan bal çıkar. Ayet, düşünen bir topluluk için bunda bir ibret olduğunu söyler.',
                'Nahl suresi adını bu ayetlerde geçen “nahl” (bal arısı) kelimesinden alır.'
            ],
            not: 'Bal bir besindir; hastalıkta tedavi için doktora danışılır.',
            hadis: 'bal',
            cocuk: 'Arı gibi çalışkan ol, herkese faydalı işler yap.',
            akilda: 'Küçük bir arının yaptığı bal bile Allah’ın insanlara bir nimetidir; düşünen bunda ibret bulur.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Nahl Sûresi”']
        },
        {
            id: 'orumcek', ad: 'Örümcek', grup: 'ornek', renk: '#7d5ba6',
            b: 'العنكبوت', adAyet: '29:41', okunus: 'el-ankebût', anlam: 'örümcek',
            ayetler: ['29:41'],
            kisa: 'Yuvası evlerin en dayanıksızı olan örümcek.',
            aciklama: [
                'Allah, kendisini bırakıp başka dostlar edinenleri, kendine yuva yapan örümceğe benzetir. Ayete göre evlerin en dayanıksızı örümceğin yuvasıdır.',
                'Bu benzetme, Allah’tan başka dayanılan şeylerin örümcek ağı gibi zayıf ve güvenilmez olduğunu anlatır.',
                'Ankebût suresi adını bu ayette geçen “ankebût” (örümcek) kelimesinden alır.'
            ],
            cocuk: 'Asıl güvenini Allah’a bağla; O’nun yardımı hiç kopmaz.',
            akilda: 'Allah’tan başkasına dayanmak, örümcek ağına yaslanmak gibidir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ankebût Sûresi”']
        },
        {
            id: 'sivrisinek', ad: 'Sivrisinek', grup: 'ornek', renk: '#4f8a5b',
            b: 'بعوضة', adAyet: '2:26', okunus: 'baûda', anlam: 'sivrisinek',
            ayetler: ['2:26-27'],
            kisa: 'Allah’ın örnek vermekten çekinmediği küçücük canlı.',
            aciklama: [
                'Ayette, Allah’ın sivrisineği ve onun üstündekini örnek olarak vermekten çekinmediği bildirilir.',
                'İnananlar bu örneğin Rablerinden gelen bir gerçek olduğunu bilir; inkâr edenler ise “Allah bu örnekle ne demek istedi?” der.',
                'Küçük görünen bir canlı da insana düşündürecek bir örnek olabilir.'
            ],
            cocuk: 'Hiçbir canlıyı küçük görme; her biri Allah’ın yarattığıdır.',
            akilda: 'Allah’ın verdiği örnek küçük olsa da taşıdığı ders büyüktür.',
            kaynak: []
        },
        {
            id: 'deve', ad: 'Deve', grup: 'ornek', renk: '#c08a3e',
            b: 'الابل', adAyet: '88:17', okunus: 'el-ibil', anlam: 'develer',
            ayetler: ['88:17-20'],
            kisa: '“Devenin nasıl yaratıldığına bakmazlar mı?” ayetindeki deve.',
            aciklama: [
                'Gāşiye suresinde Allah, insanları devenin nasıl yaratıldığına, göğün nasıl yükseltildiğine, dağların nasıl dikildiğine ve yerin nasıl yayıldığına bakıp düşünmeye çağırır.',
                'TDV İslâm Ansiklopedisi’ne göre bu surede, Allah’ın varlık ve kudretine inanmak için tabiatın incelenmesi tavsiye edilir. Her gün görülen bir hayvan bile, dikkatle bakana bir ders verir.'
            ],
            hadis: 'yolculuk',
            cocuk: 'Etrafındaki canlılara dikkatle bak ve düşün.',
            akilda: 'Her gün gördüğümüz bir hayvan bile, dikkatle bakana Allah’ın kudretini gösterir.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Gāşiye Sûresi”']
        }
    ],
    // Hadisler: hayvan sayfalarında (hadis alanı) ve Merhamet sayfasında (merhamet: true) gösterilir.
    hadisler: {
        su: {
            baslik: 'Susamış köpeğe su veren adam', merhamet: true,
            metin: 'Peygamberimiz şöyle anlattı: “Bir adam yolda giderken çok susadı. Bir kuyuya inip su içti. Çıkınca, susuzluktan dilini çıkarıp soluyan ve nemli toprağı yalayan bir köpek gördü. ‘Bu köpek de benim gibi susamış’ dedi. Kuyuya yeniden inip ayakkabısını suyla doldurdu, onu ağzıyla tutarak yukarı çıktı ve köpeğe su verdi. Allah bu iyiliğinin karşılığını verdi ve onu bağışladı.” Sahabiler, “Ey Allah’ın Resûlü! Hayvanlara yaptığımız iyilikte bize sevap var mı?” diye sordular. Peygamberimiz, “Her canlıya yapılan iyilikte sevap vardır” buyurdu.',
            ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Müsâkât, 2363; Müslim, Selâm, 2244',
            k: [['b', 2363, 'Abu Hurair'], ['m', 2244, 'Abu Hurair']],
            ders: 'Bir hayvana su vermek gibi küçük görünen bir iyilik, Allah katında büyük bir sevaptır.',
            cocuk: 'Kuşlara ve sokaktaki hayvanlara su kabı koyabilirsin.'
        },
        kedi: {
            baslik: 'Kediyi aç bırakan kadın', merhamet: true,
            metin: 'Peygamberimiz şöyle buyurdu: “Bir kadın, ölünceye kadar hapsettiği bir kedi yüzünden azaba uğradı ve bu yüzden cehenneme girdi. Onu hapsettiğinde ne yedirdi ne içirdi; ne de yerdeki böcekleri yesin diye onu salıverdi.”',
            ravi: 'Abdullah bin Ömer', kaynak: 'Buhârî, Müsâkât, 2365; Müslim, Selâm, 2242',
            k: [['b', 2365, 'Umar'], ['m', 2242, 'Umar']],
            ders: 'Bakımını üstlendiğimiz bir hayvanı aç, susuz bırakmak ve ona eziyet etmek büyük günahtır.',
            cocuk: 'Evdeki hayvanın yemeğini ve suyunu unutma.'
        },
        karinca: {
            baslik: 'Karınca yuvası', merhamet: true,
            metin: 'Peygamberimiz şöyle anlattı: “Önceki peygamberlerden birini bir karınca ısırdı. O da karınca yuvasının yakılmasını emretti. Bunun üzerine Allah ona: ‘Seni bir karınca ısırdı diye, Allah’ı tesbih eden ümmetlerden bir ümmeti mi yaktın?’ diye vahyetti.”',
            ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Cihâd, 3019; Müslim, Selâm, 2241',
            k: [['b', 3019, 'Abu Hurair'], ['m', 2241, 'Abu Hurair']],
            ders: 'Karıncalar da Allah’ı tesbih eden bir topluluktur; onlara gereksiz yere zarar verilmez.',
            cocuk: 'Yolda karınca görürsen basmamaya dikkat et.'
        },
        kesim: {
            baslik: 'Hayvanı rahat ettirerek kesmek', merhamet: true,
            metin: 'Peygamberimiz şöyle buyurdu: “Allah her şeyde iyiliği (ihsanı) emretmiştir. Bir hayvan kestiğinizde onu güzel kesin. Her biriniz bıçağını iyice bilesin ve kestiği hayvanı rahat ettirsin.”',
            ravi: 'Şeddâd bin Evs', kaynak: 'Müslim, Sayd ve zebâih, 1955',
            k: [['m', 1955, 'Shadd']],
            ders: 'Kesilen hayvana bile acı çektirilmez; iyilik her işte gözetilir.',
            cocuk: 'Her işini güzel ve özenle yap; hayvanlara acı çektirme.'
        },
        hedef: {
            baslik: 'Canlıyı hedef yapmamak', merhamet: true,
            metin: 'Abdullah bin Ömer, bir tavuğu bağlayıp ona ok atan birkaç gencin yanından geçti. Gençler onu görünce dağıldılar. Abdullah bin Ömer, “Bunu kim yaptı? Peygamberimiz, canlı bir şeyi hedef yapana lanet etmiştir” dedi.',
            ravi: 'Saîd bin Cübeyr', kaynak: 'Buhârî, Zebâih ve sayd, 5515; Müslim, Sayd ve zebâih, 1958',
            k: [['b', 5515, 'Umar'], ['m', 1958, 'Umar']],
            ders: 'Hayvanlar oyun ya da eğlence için incitilmez.',
            cocuk: 'Hayvanları oyun için asla incitme.'
        },
        ekin: {
            baslik: 'Kuşun yediği ekin', merhamet: true,
            metin: 'Peygamberimiz şöyle buyurdu: “Bir Müslüman bir ağaç diker ya da ekin eker de ondan bir kuş, bir insan ya da bir hayvan yerse, bu onun için mutlaka bir sadaka olur.”',
            ravi: 'Enes bin Mâlik', kaynak: 'Buhârî, Hars ve müzâraa, 2320; Müslim, Müsâkât, 1553',
            k: [['b', 2320, 'Anas'], ['m', 1553, 'Anas']],
            ders: 'Kuşların ve hayvanların rızıklanmasına vesile olmak bile sevaptır.',
            cocuk: 'Bir ağaç dik; meyvesinden kuşlar yesin, sen de sevap kazan.'
        },
        yolculuk: {
            baslik: 'Yolculukta develerin hakkı', merhamet: true,
            metin: 'Peygamberimiz şöyle buyurdu: “Verimli bir yerde yolculuk ettiğinizde develere oradan paylarını verin. Çorak bir yerde yolculuk ettiğinizde ise yürüyüşü hızlandırın.”',
            ravi: 'Ebû Hüreyre', kaynak: 'Müslim, İmâre, 1926',
            k: [['m', 1926, 'Abu Hurair']],
            ders: 'Binek ve yük hayvanlarının yeme, dinlenme hakkı gözetilir; güçlerinin üstünde yorulmazlar.',
            cocuk: 'Hayvanların da yorulduğunu, acıktığını unutma.'
        },
        bal: {
            baslik: 'Bal ve şifa',
            metin: 'Bir adam Peygamberimize gelip kardeşinin karnından rahatsız olduğunu söyledi. Peygamberimiz, “Ona bal içir” buyurdu. Adam birkaç kez gelip durumu anlattı; Peygamberimiz her seferinde bal içirmesini söyledi ve “Allah doğru söyledi, kardeşinin karnı ise yalan söyledi” buyurdu. Adam kardeşine bal içirdi ve kardeşi iyileşti.',
            ravi: 'Ebû Saîd el-Hudrî', kaynak: 'Buhârî, Tıb, 5684; Müslim, Selâm, 2217',
            k: [['b', 5684, 'Khudri'], ['m', 2217, 'Khudri']],
            ders: '“Allah doğru söyledi” sözü, Nahl suresindeki “onda insanlara şifa vardır” ayetine işaret eder.'
        },
        fil: {
            baslik: 'Allah fili Mekke’den alıkoydu',
            metin: 'Mekke fethedilince Peygamberimiz insanların arasında ayağa kalktı; Allah’a hamd ve senadan sonra şöyle buyurdu: “Şüphesiz Allah, fili Mekke’den alıkoydu; Resûlünü ve müminleri ise oraya hâkim kıldı.”',
            ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Lukata, 2434; Müslim, Hac, 1355',
            k: [['b', 2434, 'Abu Hurair'], ['m', 1355, 'Abu Hurair']],
            ders: 'Peygamberimiz Mekke’nin fethi günü Fil olayını hatırlattı.'
        },
        hicr: {
            baslik: 'Dişi devenin kuyusu',
            metin: 'Müslümanlar Peygamberimizle birlikte Semûd kavminin yurdu Hicr’de konakladılar; oranın kuyusundan su çekip onunla hamur yoğurdular. Peygamberimiz çektikleri suyu dökmelerini, hamuru da develere yedirmelerini emretti; dişi devenin su içmeye geldiği kuyudan su almalarını söyledi.',
            ravi: 'Abdullah bin Ömer', kaynak: 'Buhârî, Ehâdîsü’l-enbiyâ, 3379; Müslim, Zühd, 2981',
            k: [['b', 3379, 'Umar'], ['m', 2981, 'Umar']],
            ders: 'Peygamberimiz, Tebük seferi sırasında Semûd’un yurdundan geçerken dişi devenin kuyusunu ayırdı.'
        }
    },
    merhamet: {
        giris: 'Peygamberimiz hayvanlara iyilik etmeyi öğütlemiş, onlara eziyet etmeyi yasaklamıştır. Buhârî ve Müslim’deki şu hadisler bunu anlatır.',
        sira: ['su', 'kedi', 'karinca', 'ekin', 'yolculuk', 'kesim', 'hedef']
    }
};
