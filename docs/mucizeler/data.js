// ============================================
// Kur'an'dan Mucizeler — içerik
// --------------------------------------------
// Kur'an'ın gelecekten verdiği ve sonra gerçekleşen haberler; indiği dönemde bilinmeyen, bugün bilimin ortaya
// koyduğu bilgilerle karşılaştırılan ayetler. Kullanıcı kararı (20.11.2026): Kur'an dışına çıkılmaz; hadise dayanan
// mucizeler (ör. ayın yarılması rivayetleri) alınmaz. Gerçekleşmeyi anlatan kısa tarih bilgisi ve bugünkü bilimsel
// bilgi eklenir; ayetle bilimsel bilgi arasındaki bağ "çağdaş yorum" olarak ve klasik tefsirle birlikte verilir.
// Kaynak sırası: 1) Kur'an (ayet metni ve meali ayetler.js'te: Tanzil Simple + Diyanet İşleri meali,
// tools/lib/tanzil-ayetler.mjs), 2) tarih ve tefsir bağlamı için TDV İslâm Ansiklopedisi'nin ilgili maddeleri.
// tools/mucizeler-uret.mjs: ayetleri üretir, anahtar ifadeyi ayetin Tanzil metninden harekeleriyle alır (ifadeler.js).
//
// Alanlar: id · ad · grup (gelecek | bilim) · renk · emo (çocuk teması) · ikon (ikonlar sözlüğünde kimlik)
//   ayetler [ref] · ifade {ref, b (harekesiz Arapça ifade; ifadeler.js için), okunus, anlam}
//   kisa · aciklama [paragraf] (ayet ne bildiriyor) · gerceklesme [paragraf] (yalnızca gelecek: ne oldu)
//   bugun [paragraf] (yalnızca bilim: bugün bildiğimiz) · yorum (yalnızca bilim: klasik tefsir ve çağdaş yorum)
//   akilda · cocuk (çocuk temasında öne çıkan cümle) · kaynak [madde]
// ============================================
window.MUCIZE_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    gruplar: [
        { id: 'gelecek', ad: 'Gelecekten haberler', alt: 'Kur’an’ın önceden bildirdiği ve sonra gerçekleşenler', emo: '🔮' },
        { id: 'bilim', ad: 'O gün bilinmeyenler', alt: 'Bugün bilimin ortaya koyduğu bilgilerle düşünülen ayetler', emo: '🔭' }
    ],
    giris: 'Kur’an bir bilim kitabı değil, insanlığa yol gösteren bir kitaptır. Bu uygulamada iki tür ayet var: Kur’an’ın önceden haber verdiği ve sonra gerçekleşen olaylar; indiği dönemde bilinmeyen, bugün bilimin ortaya koyduğu bilgilerle birlikte düşünülen ayetler.',
    olcu: 'Ayetle bilimsel bilgi arasında kurulan bağ, yirminci yüzyılda öne çıkan ve bazı âlimlerin benimsediği bir yorumdur (bilimsel i‘câz). Bilim yenilendikçe değişebilir, ayet değişmez. Bu yüzden her sayfada ayetin meali, bugünkü bilgi ve bu bağı kimin kurduğu ayrı ayrı yazılır.',
    mucizeler: [
        // ---------------- Gelecekten haberler ----------------
        {
            id: 'rum', ad: 'Rumların zaferi', grup: 'gelecek', renk: '#b5523b', emo: '⚔️', ikon: 'kalkan',
            ayetler: ['30:2-5'],
            ifade: { ref: '30:4', b: 'في بضع سنين', okunus: 'fî bid‘ı sinîn', anlam: 'birkaç yıl içinde' },
            kisa: 'Yenilen Rumların birkaç yıl içinde galip geleceği haber verildi.',
            aciklama: [
                'Rûm suresi Mekke’de, Rumların yani Bizanslıların İranlılara yenildiği yıllarda indi. Ayet bu yenilgiyi bildirir ve Rumların birkaç yıl içinde galip geleceğini haber verir.',
                'Ayetteki “bid‘ı sinîn” ifadesi, Arapçada üç ile dokuz arasındaki bir sayıyı anlatır; Diyanet meali “bir kaç yıl” diye çevirir. O gün Bizans’ın yeniden ayağa kalkacağını kimse beklemiyordu.'
            ],
            gerceklesme: [
                'İranlılar 613’te Bizans ordusunu Antakya’da yendi, 614’te Kudüs’ü aldı. İmparator Herakleios 622’de karşı saldırıya geçti ve 627’de Ninova yakınlarında İran ordusunu ağır bir yenilgiye uğrattı. Savaş 628’de barışla bitti.',
                'Böylece Rumlar, ayetin bildirdiği gibi, büyük yenilgiden birkaç yıl sonra galip geldiler.'
            ],
            akilda: 'Herkesin bittiğini sandığı bir iş, Allah dilerse birkaç yıl içinde tersine döner.',
            cocuk: 'Kur’an, olmadan önce haber verdi; birkaç yıl sonra dediği gibi oldu.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Rûm Sûresi” ve “İ‘câzü’l-Kur’ân”', 'Bizans–Sâsânî savaşı (602–628) tarihleri: Herakleios’un seferleri ve Ninova Savaşı']
        },
        {
            id: 'ebuleheb', ad: 'Ebu Leheb', grup: 'gelecek', renk: '#c76b2b', emo: '🔥', ikon: 'alev',
            ayetler: ['111:1-5'],
            ifade: { ref: '111:3', b: 'سيصلى نارا ذات لهب', okunus: 'seyaslâ nâran zâte leheb', anlam: 'alevli ateşe yaslanacaktır' },
            kisa: 'Peygamberimizin amcası Ebu Leheb’in iman etmeyeceği, o daha hayattayken bildirildi.',
            aciklama: [
                'Tebbet suresi, Peygamberimize düşmanlık eden amcası Ebu Leheb ve karısı hakkında indi. Bir müşrikin adıyla anılarak karısıyla birlikte uyarıldığı ilk ayetler bunlardır.',
                'Sure, Ebu Leheb’in alevli ateşe gireceğini bildirir. Bu, onun inkâr üzere öleceğini haber vermektir. Ebu Leheb sure indikten sonra da yıllarca yaşadı.'
            ],
            gerceklesme: [
                'Ebu Leheb, hiç değilse görünüşte Müslüman olduğunu söyleyerek bu haberi yalanlayabilirdi. Bunu yapmadı; hayatı boyunca Peygamberimize karşı çıkanlardan biri olarak kaldı.',
                'Bedir’de müşriklerin yenildiğini öğrendikten birkaç gün sonra, hicretin ikinci yılında (624) Mekke’de öldü.'
            ],
            akilda: 'Bir insanın ne yapacağını ancak Allah bilir; Kur’an onu yıllar önce bildirdi.',
            cocuk: 'Ebu Leheb yıllarca yaşadı ama Kur’an’ın dediği gibi hiç iman etmedi.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Ebû Leheb”']
        },
        {
            id: 'bedir', ad: 'Bedir’deki bozgun', grup: 'gelecek', renk: '#8c6d2c', emo: '🏳️', ikon: 'bayrak',
            ayetler: ['54:44-45'],
            ifade: { ref: '54:45', b: 'سيهزم الجمع', okunus: 'seyuhzemu’l-cem‘u', anlam: 'o topluluk bozguna uğrayacak' },
            kisa: 'Güçlerine güvenen inkârcıların bozguna uğrayacağı, Müslümanlar Mekke’de azken haber verildi.',
            aciklama: [
                'Kamer suresi Mekke’de indi. O günlerde Müslümanlar az ve güçsüzdü; Mekkeli inkârcılar ise “Biz öç alabilecek bir topluluğuz” diyordu.',
                'Ayet, bu topluluğun dağıtılacağını ve arkasını dönüp kaçacağını bildirir.'
            ],
            gerceklesme: [
                'Hicretin ikinci yılında (624) Bedir’de karşılaşan iki ordudan Mekke ordusu bozguna uğradı ve geri çekildi.',
                'TDV İslâm Ansiklopedisi’ne göre ayet, Kureyş’in Bedir’de bozguna uğrayacağını müjdeler.'
            ],
            akilda: 'Sayıya ve güce güvenen değil, Allah’a güvenen kazanır.',
            cocuk: 'Az olan Müslümanlar, Kur’an’ın haber verdiği gibi Bedir’de kazandı.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Kamer Sûresi”']
        },
        {
            id: 'mescid', ad: 'Mescid-i Haram’a giriş', grup: 'gelecek', renk: '#2f7a5c', emo: '🕋', ikon: 'kabe',
            ayetler: ['48:27'],
            ifade: { ref: '48:27', b: 'لتدخلن المسجد الحرام', okunus: 'letedhulunne’l-mescide’l-harâm', anlam: 'Mescid-i Haram’a mutlaka gireceksiniz' },
            kisa: 'Kâbe’ye gidemeden geri dönen Müslümanlara, oraya güven içinde girecekleri bildirildi.',
            aciklama: [
                'Hicretin altıncı yılında Müslümanlar umre için yola çıktılar ama Mekkeliler onları Kâbe’ye sokmadı; Hudeybiye’de antlaşma yapılıp geri dönüldü.',
                'Bu ayet, Peygamberimizin gördüğü rüyanın doğru olduğunu bildirir: Müslümanlar Mescid-i Haram’a güven içinde, başlarını tıraş etmiş ya da saçlarını kısaltmış olarak, korkmadan gireceklerdi.'
            ],
            gerceklesme: [
                'Ertesi yıl, hicretin yedinci yılında (629) Müslümanlar Mekke’ye gidip umrelerini yaptılar. Bu umreye, önceki yıl yapılamayanın yerine yapıldığı için Umretü’l-kazâ denir.',
                'TDV İslâm Ansiklopedisi bu umreyi, ayetteki rüyanın aynen gerçekleşmesi olarak anlatır.'
            ],
            akilda: 'Allah’ın vaadi ertelense de yerine gelir.',
            cocuk: 'Bir yıl sabrettiler; Kur’an’ın dediği gibi Kâbe’ye güven içinde girdiler.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Umretü’l-kazâ”']
        },
        {
            id: 'koruma', ad: 'Kur’an’ın korunması', grup: 'gelecek', renk: '#2f6f8f', emo: '📖', ikon: 'kitap',
            ayetler: ['15:9'],
            ifade: { ref: '15:9', b: 'وإنا له لحافظون', okunus: 've innâ lehû le-hâfizûn', anlam: 'onun koruyucusu elbette Biziz' },
            kisa: 'Kur’an’ın korunacağı, daha inmesi tamamlanmadan bildirildi.',
            aciklama: [
                'Hicr suresi Mekke’de indi. O gün Kur’an’ın inişi daha bitmemişti ve onu ezberleyip yazanlar bir avuç insandı.',
                'Ayet, Kur’an’ı Allah’ın indirdiğini ve onu yine Allah’ın koruyacağını bildirir.'
            ],
            gerceklesme: [
                'Kur’an hem ezberlenerek hem yazılarak korundu. Peygamberimizden sonra Hz. Ebû Bekir döneminde bir araya getirildi, Hz. Osman döneminde çoğaltılıp şehirlere gönderildi.',
                'On dört asırdır dünyanın her yerinde aynı metin okunur ve milyonlarca hâfız onu ezberinde taşır.'
            ],
            akilda: 'Kur’an’ı koruyan Allah’tır; onu ezberleyen ve okuyan her insan bu korumaya vesile olur.',
            cocuk: 'Kur’an’ı ezberleyen her çocuk, onun korunmasına yardım eder.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Mushaf”']
        },
        {
            id: 'benzeri', ad: 'Benzeri getirilemez', grup: 'gelecek', renk: '#6a4c93', emo: '✍️', ikon: 'kalem',
            ayetler: ['2:23-24', '17:88'],
            ifade: { ref: '2:24', b: 'ولن تفعلوا', okunus: 've len tef‘alû', anlam: 've asla yapamayacaksınız' },
            kisa: 'Kur’an’dan şüphe edenlere bir sure getirmeleri söylendi ve bunu asla yapamayacakları bildirildi.',
            aciklama: [
                'Kur’an, ondan şüphe edenleri benzeri bir sure getirmeye çağırır. Bakara suresinin ayeti, “yapamazsanız, ki asla yapamayacaksınız” diyerek bir haber de verir.',
                'İsrâ suresindeki ayet ise insanların ve cinlerin birbirine yardım etse bile Kur’an’ın benzerini ortaya koyamayacağını bildirir.'
            ],
            gerceklesme: [
                'Bu çağrı, şiir ve söz ustalığıyla övünen Araplara yapıldı. Kur’an’a karşı çıkanlar onunla savaşmayı bile göze aldılar ama bir sure getirerek çağrıya karşılık veremediler.',
                'O günden bu yana yapılan denemelerin hiçbiri Kur’an’ın benzeri sayılmadı.'
            ],
            akilda: 'Kur’an’ın sözü insan sözüne benzemez; ondan şüphe edenlere hâlâ aynı çağrıyı yapar.',
            cocuk: 'Kimse Kur’an gibi bir sure yazamadı; Kur’an bunu önceden söylemişti.',
            kaynak: ['TDV İslâm Ansiklopedisi, “İ‘câzü’l-Kur’ân”']
        },
        // ---------------- O gün bilinmeyenler ----------------
        {
            id: 'yaratilis', ad: 'Ana rahminde yaratılış', grup: 'bilim', renk: '#c2567a', emo: '👶', ikon: 'kalp',
            ayetler: ['23:12-14'],
            ifade: { ref: '23:14', b: 'فكسونا العظام لحما', okunus: 'fe-kesevne’l-‘izâme lahmâ', anlam: 'kemiklere de et giydirdik' },
            kisa: 'İnsanın ana rahmindeki gelişimi aşama aşama anlatıldı.',
            aciklama: [
                'Ayetler insanın yaratılışını sırayla anlatır: süzme çamur, sağlam bir yere yerleştirilen nutfe, alaka (Diyanet meali: kan pıhtısı), bir çiğnemlik et, kemikler ve kemiklere giydirilen et.',
                'Ayet, “Biçim verenlerin en güzeli olan Allah ne yücedir” sözüyle biter.'
            ],
            bugun: [
                'Embriyoloji, bebeğin ana rahminde birbirini izleyen evrelerle geliştiğini gösterir. Haftalar ilerledikçe kıkırdaktan bir iskelet taslağı belirir, kaslar bu iskeletin çevresinde gelişip onu sarar.',
                'Bu evreleri ayrıntısıyla görmek mikroskopla mümkün oldu; bilimsel embriyoloji on yedinci yüzyıldan sonra gelişti.'
            ],
            yorum: 'İbn Kesîr bu ayetleri aşama aşama açıklar ve insanın böyle yaratılmasını ölümün ve yeniden dirilişin kesinliğine bağlar. Ayetleri bugünkü embriyolojiyle karşılaştırmak, yirminci yüzyılda öne çıkan bilimsel i‘câz yorumudur.',
            akilda: 'Her insan, aşama aşama yaratılmış bir emanettir.',
            cocuk: 'Sen de annenin karnında adım adım büyüdün; Kur’an bunu anlatır.',
            kaynak: ['Klasik yorum: İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm, Mü’minûn 12-14', 'Bilimsel i‘câz yorumu: TDV İslâm Ansiklopedisi, “İ‘câzü’l-Kur’ân”']
        },
        {
            id: 'ay', ad: 'Ay’ın evreleri ve yörüngeler', grup: 'bilim', renk: '#4a6fa5', emo: '🌙', ikon: 'ay',
            ayetler: ['36:38', '36:39', '36:40'],
            ifade: { ref: '36:39', b: 'كالعرجون القديم', okunus: 'ke’l-‘urcûni’l-kadîm', anlam: 'kuru bir hurma dalı gibi' },
            kisa: 'Ay’ın konakları, hilal hâli ve gök cisimlerinin kendi yörüngelerinde yürüdüğü anlatıldı.',
            aciklama: [
                'Yâsîn suresinin ayetleri güneşin yörüngesinde yürüyüp gittiğini, Ay için konaklar belirlendiğini ve her birinin bir yörüngede yürüdüğünü bildirir.',
                'Ay, konaklarını geçtikçe incelir ve sonunda kuru, eğri bir hurma dalına benzer. Bu benzetme Ay’ın görünüşünü, yani incecik hilal hâlini anlatır; Ay’ın yörüngesini değil.'
            ],
            bugun: [
                'Ay, Dünya’nın çevresinde dolanırken Güneş’in aydınlattığı yüzünü bize her gece farklı ölçüde gösterir; ayın sonunda geriye ince, kavisli bir hilal kalır.',
                'Ay Dünya’nın, Dünya Güneş’in çevresinde dolanır. Güneş de yerinde durmaz: Samanyolu galaksisinin merkezi çevresinde saniyede yaklaşık iki yüz otuz kilometre hızla yol alır.'
            ],
            yorum: 'İbn Kesîr Ay’ın konaklarını onun büyüyüp küçülen evreleriyle, “kuru hurma dalı”nı da hurma salkımını ağaca bağlayan eğri sapla açıklar; Güneş’in yörüngesi için farklı görüşleri aktarır. Gök cisimlerinin hareketi gözle de görülüyordu. Ayeti Güneş’in de galaksi içinde yol aldığını gösteren bugünkü bilgiyle ilişkilendirmek çağdaş bir yorumdur.',
            akilda: 'Gökteki her şey belirlenmiş bir ölçüyle yürür.',
            cocuk: 'Ay her gece biraz değişir; ayın sonunda hurma dalı gibi incecik olur.',
            kaynak: ['Klasik yorum: İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm, Yâsîn 37-40', 'Bilimsel i‘câz yorumu: TDV İslâm Ansiklopedisi, “İ‘câzü’l-Kur’ân”']
        },
        {
            id: 'daglar', ad: 'Dağların hareketi', grup: 'bilim', renk: '#6b7f3a', emo: '⛰️', ikon: 'dag',
            ayetler: ['27:87', '27:88'],
            ifade: { ref: '27:88', b: 'تمر مر السحاب', okunus: 'temurru merra’s-sehâb', anlam: 'bulutların geçişi gibi geçer' },
            kisa: 'Yerinde durur sanılan dağların bulutlar gibi geçtiği bildirildi.',
            aciklama: [
                'Ayet, dağları yerinde donmuş gibi durur gördüğümüzü ama onların bulutlar gibi geçtiğini bildirir ve “Bu her şeyi sağlam tutan Allah’ın işidir” der.',
                'Ayetten hemen önce Sûr’a üfürüleceği gün anlatılır.'
            ],
            bugun: [
                'Dünya kendi çevresinde döner ve Güneş’in çevresinde dolanır; üzerindeki dağlar da onunla birlikte hareket eder.',
                'Yer kabuğunu oluşturan levhalar da yılda birkaç santimetre kayar; dağlar bu levhaların üzerinde yer değiştirir.'
            ],
            yorum: 'Bu ayet Sûr’a üfürülme anlatımının içinde yer alır. Kur’an Yolu tefsiri dahil müfessirlerin çoğu dağların geçişini kıyamet günüyle açıklar. Bazı müfessirler ise ayeti Dünya’nın hareketine işaret olarak değerlendirmiştir; bu çağdaş bir yorumdur.',
            akilda: 'Sapasağlam görünen dağlar bile Allah’ın dilediği gibi hareket eder.',
            cocuk: 'Dağlar duruyor gibi görünür ama Dünya ile birlikte hareket eder.',
            kaynak: ['Klasik yorum: Kur’an Yolu Tefsiri (Diyanet İşleri Başkanlığı), IV, 210', 'Çağdaş yorum: Celal Kırca, Kur’ân-ı Kerîm’de Fen Bilimleri, s. 76']
        },
        {
            id: 'genisleme', ad: 'Evrenin genişlemesi', grup: 'bilim', renk: '#3b4f8c', emo: '🌌', ikon: 'galaksi',
            ayetler: ['51:47'],
            ifade: { ref: '51:47', b: 'وإنا لموسعون', okunus: 've innâ le-mûsi‘ûn', anlam: 'şüphesiz biz onu genişleticiyiz' },
            kisa: 'Göğü Allah’ın kurduğu ve onu genişlettiği bildirildi.',
            aciklama: [
                'Ayet, göğü Allah’ın kudretiyle kurduğunu bildirir. Diyanet meali ayetin sonunu “Şüphesiz biz onu genişleticiyiz” diye çevirir.'
            ],
            bugun: [
                'Yirminci yüzyılın başına kadar evren durağan sanılıyordu. Ancak 1920’lerde yapılan gözlemler galaksilerin bizden uzaklaştığını, yani evrenin genişlediğini gösterdi.',
                'Bugün evrenin genişlemesi gökbilimin temel bulgularından biridir.'
            ],
            yorum: 'İbn Kesîr bu ifadeyi, Allah’ın göğü geniş kıldığı ve onu direksiz yükselttiği anlamında açıklar. Ayeti evrenin genişlemesiyle ilişkilendirmek çağdaş bir yorumdur.',
            akilda: 'Evren, onu kuran Allah’ın kudretiyle genişler.',
            cocuk: 'Gökyüzü her an büyüyor; Kur’an “onu genişleten Biziz” der.',
            kaynak: ['Klasik yorum: İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm, Zâriyât 47', 'Bilimsel i‘câz yorumu: TDV İslâm Ansiklopedisi, “İ‘câzü’l-Kur’ân”']
        },
        {
            id: 'denizler', ad: 'İki deniz arasındaki engel', grup: 'bilim', renk: '#2a8c9e', emo: '🌊', ikon: 'dalga',
            ayetler: ['55:19-20', '25:53'],
            ifade: { ref: '55:20', b: 'بينهما برزخ لا يبغيان', okunus: 'beynehumâ berzahun lâ yebgıyân', anlam: 'aralarında bir engel vardır; birbirinin sınırını aşamazlar' },
            kisa: 'Tatlı ve tuzlu suyun buluştuğu yerde aralarında bir engel olduğu bildirildi.',
            aciklama: [
                'Rahmân suresi, acı ve tatlı sulu iki denizin birbirine kavuşmamak üzere salıverildiğini, aralarında bir engel bulunduğunu bildirir.',
                'Furkān suresindeki ayet de iki denizin arasına karışmalarına engel olan bir sınır konduğunu söyler.'
            ],
            bugun: [
                'Tuzluluğu, sıcaklığı ve yoğunluğu farklı sular karşılaştıkları yerde hemen karışmaz; aralarında bir geçiş bölgesi oluşur.',
                'Örneğin Akdeniz’in daha tuzlu ve ağır suyu Cebelitarık Boğazı’ndan Atlas Okyanusu’na geçerken derinlerde uzun süre kendi özelliğini korur.'
            ],
            yorum: 'İbn Kesîr tatlı suyun akan ırmaklardan geldiğini söyler ve engeli iki suyun arasındaki bir kara parçası olarak açıklar. Bu engeli suların yoğunluk farkıyla açıklamak çağdaş bir yorumdur; TDV İslâm Ansiklopedisi, tatlı ve tuzlu su arasındaki engeli bilimsel i‘câz yorumunun örnekleri arasında sayar.',
            akilda: 'Allah, birbirine karışacak gibi duran suların arasına bile bir ölçü koymuştur.',
            cocuk: 'Tatlı su ile tuzlu su buluşur ama hemen karışmaz.',
            kaynak: ['TDV İslâm Ansiklopedisi, “Rahmân Sûresi” ve “İ‘câzü’l-Kur’ân”', 'Klasik yorum: İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm, Rahmân 19-20']
        },
        {
            id: 'ayrilma', ad: 'Göklerin ve yerin ayrılması', grup: 'bilim', renk: '#9a5b2e', emo: '💧', ikon: 'damla',
            ayetler: ['21:30'],
            ifade: { ref: '21:30', b: 'كانتا رتقا ففتقناهما', okunus: 'kânetâ retkan fe-fetaknâhumâ', anlam: 'bitişikken onları ayırdık' },
            kisa: 'Göklerle yerin bitişikken ayrıldığı ve bütün canlıların sudan yaratıldığı bildirildi.',
            aciklama: [
                'Ayet, göklerin ve yerin yapışıkken ayrıldığını ve bütün canlıların sudan meydana getirildiğini bildirir; sonra “Yine de inanmıyorlar mı?” diye sorar.'
            ],
            bugun: [
                'Bugünkü gökbilim, evrenin yaklaşık on üç milyar sekiz yüz milyon yıl önce çok yoğun bir başlangıç hâlinden genişleyerek oluştuğunu söyler.',
                'Canlıların hücrelerinin büyük kısmı sudur; bilinen hiçbir canlı su olmadan yaşayamaz.'
            ],
            yorum: 'İbn Kesîr “ratk” (bitişiklik) ve “fatk” (ayırma) kelimelerini göklerle yerin bitişikken ayrılması olarak açıklar; İbn Abbâs’tan, bitişikken yağmur yağmadığı ve bitki bitmediği, ayrılınca gökten yağmur yağıp yerden bitki bittiği yorumunu da aktarır. Ayeti evrenin bir başlangıçtan genişleyerek oluşmasıyla ilişkilendirmek çağdaş bir yorumdur.',
            akilda: 'Gökleri ayıran da canlıya sudan hayat veren de Allah’tır.',
            cocuk: 'Sen de bir bardak suyla hayat bulursun; bütün canlılar sudan yaratıldı.',
            kaynak: ['Klasik yorum: İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm, Enbiyâ 30', 'Bilimsel i‘câz yorumu: TDV İslâm Ansiklopedisi, “İ‘câzü’l-Kur’ân”']
        }
    ]
};
