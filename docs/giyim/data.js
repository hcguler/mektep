// ============================================
// Giyim ve Görünüş — içerik
// --------------------------------------------
// Kur'an önce gelir; ardından sahih hadis (Buhârî, Müslim), sonra fıkıh (Diyanet esas, mezhep farkı notla).
//
// Ayet metinleri burada yazılmaz; yalnızca "sure:ayet" verilir. Arapça (Tanzil Simple) ve meal (Diyanet İşleri,
// Tanzil tr.diyanet) tools/giyim-uret.mjs ile ayetler.js dosyasına üretilir.
// Hadis metinleri Türkçeye anlam olarak aktarılmıştır; her künye (kitap, bölüm, numara, râvi) üretici tarafından
// Buhârî ve Müslim metinleriyle (fawazahmed0/hadith-api) otomatik denetlenir. Müslim numarası
// M. Fuâd Abdülbâkî numarasıdır.
//   k: [[kitap (b | m), numara, metinde geçen râvi adı (İngilizce yazımıyla, denetim için)]]
//
// Alanlar: id · bolum (ilke | erkek | kadin | cocuk) · konu [konular] · ad · ozet · hukum { ad, tur } ·
//   cizim (cizimler.js) · aciklama (2–4 cümle) · ayetler · hadisler · fikih { metin, kaynak } · akilda · kaynak
// Peygamberlerin ve sahabenin yüzü, bedeni çizilmez; çizimler yalnızca genel, yüzsüz figürlerdir.
// ============================================
window.GIYIM_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    bolumler: [
        { id: 'ilke', ad: 'Herkes için', alt: 'Kur’an’ın ve sünnetin genel ölçüleri', emo: '🌿' },
        { id: 'erkek', ad: 'Erkek', alt: 'Örtünme, sakal, takı ve elbise', emo: '🧔' },
        { id: 'kadin', ad: 'Kadın', alt: 'Örtünme, örtünün nitelikleri, saç', emo: '🧕' },
        { id: 'cocuk', ad: 'Çocuk', alt: 'Saç, örtünme ve sorumluluk çağı', emo: '🧒' }
    ],
    konular: [
        { id: 'kiyafet', ad: 'Kıyafet ve örtünme', emo: '👕' },
        { id: 'sac', ad: 'Saç', emo: '💇' },
        { id: 'sakal', ad: 'Sakal ve bıyık', emo: '🧔' },
        { id: 'sus', ad: 'Süs ve takı', emo: '💍' },
        { id: 'temizlik', ad: 'Temizlik ve bakım', emo: '💧' },
        { id: 'beden', ad: 'Beden ve yaratılış', emo: '✨' }
    ],
    // Hüküm türleri: renk ve kısa açıklama için
    hukumler: {
        ilke: 'Kur’an’ın ve sünnetin genel ölçüsü',
        farz: 'Yapılması kesin olarak istenen',
        sunnet: 'Peygamberimizin yaptığı ve tavsiye ettiği',
        edep: 'Güzel davranış, tavsiye edilen',
        caiz: 'Yapılmasında sakınca olmayan',
        mekruh: 'Kaçınılması istenen',
        haram: 'Kesin olarak yasaklanan',
        bilgi: 'Bilgi'
    },
    ogeler: [
        // ---------------- Herkes için ----------------
        { id: 'en-guzel-bicim', bolum: 'ilke', konu: ['beden'], emo: '✨', cizim: 'uclu',
          ad: 'En güzel biçimde yaratılış', ozet: 'Beden, Allah’ın güzel yarattığı bir emanettir',
          hukum: { ad: 'Temel ilke', tur: 'ilke' },
          aciklama: 'Kur’an, insanın en güzel biçimde yaratıldığını ve ona güzel bir şekil verildiğini bildirir. Giyim ve görünüşle ilgili bütün ölçüler bu nimetin üzerine kurulur: Bedeni korumak, temiz ve güzel tutmak, yaratılışı bozmamak.',
          ayetler: ['95:4', '64:3'],
          akilda: 'Güzel görünmek, güzel yaratana şükürdür.',
          kaynak: 'Tîn 4; Teğâbün 3.' },
        { id: 'elbise-nimeti', bolum: 'ilke', konu: ['kiyafet'], emo: '👘', cizim: 'aski',
          ad: 'Elbise bir nimettir', ozet: 'Örter, süsler, korur; en hayırlısı takva elbisesidir',
          hukum: { ad: 'Temel ilke', tur: 'ilke' },
          aciklama: 'Allah elbiseyi insana üç amaçla verdiğini bildirir: Ayıp yerleri örtmek, insanı süslemek ve sıcaktan korumak. Ayet, bunlardan daha hayırlı olanın takva örtüsü olduğunu hatırlatır; dış görünüş, içteki saygının ve hayânın aynasıdır.',
          ayetler: ['7:26', '16:81'],
          akilda: 'Elbise bedeni örter, takva kalbi.',
          kaynak: 'A‘râf 26; Nahl 81.' },
        { id: 'guzel-giyinmek', bolum: 'ilke', konu: ['kiyafet'], emo: '🕌', cizim: 'mescid',
          ad: 'Güzel giyinmek, kibirden uzak durmak', ozet: 'Allah güzeldir, güzeli sever; kibir ise yasaktır',
          hukum: { ad: 'Güzel giyinmek övülür · kibir haram', tur: 'edep' },
          aciklama: 'Kur’an, mescide giderken güzel elbiselerin giyilmesini ister ve Allah’ın kulları için yarattığı süsü haram kılmaya kimsenin hakkı olmadığını bildirir. Peygamberimiz, güzel elbise ve ayakkabıyı sevmenin kibir olmadığını, kibrin hakkı tanımamak ve insanları küçümsemek olduğunu açıklamıştır. Ölçü israf etmemek ve kendini üstün görmemektir.',
          ayetler: ['7:31', '7:32'],
          hadisler: [
              { metin: 'Kalbinde zerre kadar kibir bulunan cennete giremez. Bir adam, “İnsan elbisesinin güzel, ayakkabısının güzel olmasını sever” deyince Resûlullah şöyle buyurdu: “Allah güzeldir, güzeli sever. Kibir, hakkı tanımamak ve insanları küçümsemektir.”', ravi: 'Abdullah b. Mes‘ûd', kaynak: 'Müslim, Îmân, 91', k: [['m', 91, 'Mas']] }
          ],
          akilda: 'Güzel giyin; ama kendini kimseden üstün görme.',
          kaynak: 'A‘râf 31-32; Müslim, Îmân, 91.' },
        { id: 'temizlik', bolum: 'ilke', konu: ['temizlik', 'kiyafet'], emo: '💧', cizim: 'damla',
          ad: 'Temiz beden, temiz elbise', ozet: 'Temizlik imanın yarısıdır',
          hukum: { ad: 'Temel ilke', tur: 'ilke' },
          aciklama: 'İlk inen ayetlerden biri, Peygamberimize giydiklerini temiz tutmasını emreder. Temizlik hem namazın şartıdır hem de Müslümanın her an taşıdığı bir özelliktir. Pahalı değil, temiz ve bakımlı giyinmek esastır.',
          ayetler: ['74:4'],
          hadisler: [
              { metin: 'Temizlik imanın yarısıdır.', ravi: 'Ebû Mâlik el-Eş‘arî', kaynak: 'Müslim, Tahâret, 223', k: [['m', 223, 'Abu Malik']] }
          ],
          fikih: { metin: 'Namazın sahih olması için bedenin, elbisenin ve namaz kılınan yerin necasetten temiz olması şarttır.', kaynak: 'Diyanet İşleri Başkanlığı, İlmihal I (namazın şartları)' },
          akilda: 'Temiz giyinmek, pahalı giyinmekten önce gelir.',
          kaynak: 'Müddessir 4; Müslim, Tahâret, 223.' },
        { id: 'fitrat', bolum: 'ilke', konu: ['temizlik', 'sakal'], emo: '✂️', cizim: 'fitrat',
          ad: 'Fıtrat temizliği', ozet: 'Beş temizlik sünneti',
          hukum: { ad: 'Sünnet', tur: 'sunnet' },
          aciklama: 'Peygamberimiz beş davranışı fıtrattan, yani insanın yaratılışına uygun temizlikten saymıştır: Sünnet olmak, kasık kıllarını temizlemek, bıyıkları kısaltmak, tırnakları kesmek ve koltuk altı kıllarını temizlemek. Bunlar hem temizliğin hem de Müslümanca görünüşün parçasıdır.',
          hadisler: [
              { metin: 'Beş şey fıtrattandır: Sünnet olmak, kasık kıllarını temizlemek, bıyığı kısaltmak, tırnakları kesmek ve koltuk altı kıllarını yolmak.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Libâs, 5889; Müslim, Tahâret, 257', k: [['b', 5889, 'Abu Huraira'], ['m', 257, 'Abu Huraira']] }
          ],
          akilda: 'Küçük bakımlar, büyük bir temizliğin parçasıdır.',
          kaynak: 'Buhârî, Libâs, 5889; Müslim, Tahâret, 257.' },
        { id: 'sagdan-baslamak', bolum: 'ilke', konu: ['kiyafet', 'temizlik'], emo: '👟', cizim: 'ayakkabi',
          ad: 'Giyinmeye sağdan başlamak', ozet: 'Giyerken sağdan, çıkarırken soldan',
          hukum: { ad: 'Sünnet', tur: 'sunnet' },
          aciklama: 'Peygamberimiz ayakkabı giymekte, saç taramakta ve temizlenmekte sağdan başlamayı severdi. Ayakkabı giyerken önce sağ ayağın, çıkarırken önce sol ayağın kullanılmasını öğretmiştir. Küçük bir alışkanlıkla gün boyu sünnet yaşanır.',
          hadisler: [
              { metin: 'Biriniz ayakkabısını giyerken sağdan, çıkarırken soldan başlasın. Sağ ayak giyilirken ilk, çıkarılırken son olsun.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Libâs, 5855; Müslim, Libâs, 2097', k: [['b', 5855, 'Abu Huraira'], ['m', 2097, 'Abu Huraira']] },
              { metin: 'Resûlullah ayakkabı giymekte, saçını taramakta, temizlenmekte ve bütün işlerinde sağdan başlamayı severdi.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Vudû, 168; Müslim, Tahâret, 268', k: [['b', 168, 'Aisha'], ['m', 268, 'isha']] }
          ],
          akilda: 'Sağdan başla; sünnet küçük işlerde de yaşanır.',
          kaynak: 'Buhârî, Libâs, 5855; Vudû, 168; Müslim, Libâs, 2097; Tahâret, 268.' },
        { id: 'benzememek', bolum: 'ilke', konu: ['kiyafet', 'sus'], emo: '⚖️', cizim: 'iki',
          ad: 'Erkek ve kadın kendi yaratılışına uygun', ozet: 'Karşı cinse benzemeye çalışmamak',
          hukum: { ad: 'Haram', tur: 'haram' },
          aciklama: 'Peygamberimiz, giyimde, süste ve tavırda kadınlara benzemeye çalışan erkekleri ve erkeklere benzemeye çalışan kadınları kınamıştır. Ölçü, toplumda bir cinse ait sayılan giyim ve süsün bilerek öbür cins tarafından benimsenmesidir. Herkes kendi yaratılışıyla değerlidir.',
          hadisler: [
              { metin: 'Resûlullah, kadınlara benzemeye çalışan erkeklere ve erkeklere benzemeye çalışan kadınlara lanet etti.', ravi: 'Abdullah b. Abbâs', kaynak: 'Buhârî, Libâs, 5885', k: [['b', 5885, 'Abbas']] }
          ],
          fikih: { metin: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu, küpeyi kadınlara ait bir süslenme biçimi saymış ve erkeklerin küpe takmasını mekruh görmüştür.', kaynak: 'Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu (basında aktarılan fetva)' },
          akilda: 'Kendin ol; yaratılışın bir değerdir.',
          kaynak: 'Buhârî, Libâs, 5885.' },
        { id: 'yaratilisi-degistirmemek', bolum: 'ilke', konu: ['beden', 'sac', 'sus'], emo: '🚫', cizim: 'yasak',
          ad: 'Dövme, saç ekleme ve kaş aldırma', ozet: 'Süs için yaratılışı değiştirmemek',
          hukum: { ad: 'Haram (tedavi hariç)', tur: 'haram' },
          aciklama: 'Peygamberimiz; dövme yapan ve yaptıranı, başkasının saçını ekleyen ve ekleteni, güzellik için yüzündeki kılları yolduranı ve dişlerini seyrelteni kınamıştır. Gerekçe, süs için Allah’ın yaratışını değiştirmek ve insanları aldatmaktır. Hastalık ve kusur gidermek için yapılan tedavi bu yasağa girmez.',
          hadisler: [
              { metin: 'Allah, saç ekleyene ve ekletene, dövme yapana ve yaptırana lanet etsin.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Libâs, 5933', k: [['b', 5933, 'Abu Huraira']] },
              { metin: 'Allah; dövme yapana ve yaptırana, yüzündeki kılları yolduranlara, güzellik için dişlerini seyreltenlere, Allah’ın yaratışını değiştirenlere lanet etsin. Resûlullah’ın lanet ettiğine ben neden lanet etmeyeyim?', ravi: 'Abdullah b. Mes‘ûd', kaynak: 'Buhârî, Libâs, 5931; Müslim, Libâs, 2125', k: [['b', 5931, 'Abdullah'], ['m', 2125, 'Abdullah']] },
              { metin: 'Bir kadın gelip, hastalık yüzünden saçları dökülen yeni evli kızına takma saç ekleyip ekleyemeyeceğini sordu. Resûlullah saç ekleyene ve ekletene lanet etti.', ravi: 'Esmâ bint Ebû Bekir', kaynak: 'Buhârî, Libâs, 5935; Müslim, Libâs, 2122', k: [['b', 5935, 'Asma'], ['m', 2122, 'Asma']] }
          ],
          fikih: { metin: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu, “Fetvalar” kitabında dövme yaptırmanın, kaş aldırmanın ve başkasının saçını kullanmanın caiz olmadığını, yalnızca tedavi amaçlı estetiğin caiz olduğunu bildirir; peruk ve saç ektirmeyi zorunlu hâller dışında caiz görmez. Vücudunda dövme bulunan kişi mümkünse onu giderir, mümkün değilse Allah’tan bağışlanma diler. Diyanet İlmihali’ne göre hadiste yasaklanan, kaşları inceltmek için kıl yolmaktır; yüzde sonradan biten ve yüzü çirkinleştiren kılları almak bu yasağa girmez. Saçsızlık hastalığında saç ektirmenin tedavi sayılarak caiz olduğuna dair fetvalar vardır (TDV İslâm Ansiklopedisi, “Saç”).', kaynak: 'Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu, Fetvalar (2018); Diyanet İslam İlmihali II; TDV İslâm Ansiklopedisi, “Saç”' },
          akilda: 'Süslen; ama yaratılışı değiştirme.',
          kaynak: 'Buhârî, Libâs, 5931, 5933, 5935; Müslim, Libâs, 2122, 2125.' },
        { id: 'sac-bakimi', bolum: 'ilke', konu: ['sac', 'temizlik'], emo: '🪮', cizim: 'tarak',
          ad: 'Saçın bakımı ve uzunluğu', ozet: 'Temiz, taranmış ve bulunulan yerin örfüne uygun',
          hukum: { ad: 'Caiz · bakım sünnet', tur: 'caiz' },
          aciklama: 'Peygamberimiz saçını sağdan başlayarak tarar, temiz ve bakımlı tutardı. Saçları bazen kulak memelerine, bazen omuzlarına kadar inerdi. Erkek için saçın uzun ya da kısa olması dinen belirlenmiş değildir; temizlik ve bulunulan toplumun örfü ölçüdür.',
          hadisler: [
              { metin: 'Resûlullah orta boylu, omuzları geniş biriydi; saçları kulak memelerine kadar inerdi.', ravi: 'Berâ b. Âzib', kaynak: 'Müslim, Fezâil, 2337', k: [['m', 2337, 'Bara']] },
              { metin: 'Resûlullah ayakkabı giymekte, saçını taramakta ve temizlenmekte sağdan başlamayı severdi.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Vudû, 168', k: [['b', 168, 'Aisha']] }
          ],
          fikih: { metin: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’na göre saçların temizliğine dikkat etmek şartıyla erkeklerin saçlarını uzatmasında ve dilediği şekilde taramasında dinen sakınca yoktur; ancak bulunulan ortamın örfü dikkate alınır. Hz. Peygamber saçını bazen omuzlarına kadar uzatmış, bazen kısa kestirmiştir (TDV İslâm Ansiklopedisi, “Saç”).', kaynak: 'Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu (basında aktarılan açıklama); TDV İslâm Ansiklopedisi, “Saç”' },
          akilda: 'Uzun ya da kısa; önce temiz ve bakımlı.',
          kaynak: 'Müslim, Fezâil, 2337; Buhârî, Vudû, 168.' },
        { id: 'sac-boyamak', bolum: 'ilke', konu: ['sac', 'sakal'], emo: '🎨', cizim: 'boya',
          ad: 'Ağaran saçı boyamak', ozet: 'Boyamak caiz; siyahtan kaçınılır',
          hukum: { ad: 'Caiz · siyah mekruh', tur: 'caiz' },
          aciklama: 'Peygamberimiz, ağarmış saç ve sakalların boyanmasını tavsiye etmiş, boyamayan Yahudi ve Hristiyanlardan farklı olmayı istemiştir. Mekke’nin fethi günü saçı sakalı bembeyaz olan Ebû Kuhâfe için “Bunu bir şeyle değiştirin, siyahtan kaçının” buyurmuştur.',
          hadisler: [
              { metin: 'Yahudiler ve Hristiyanlar saçlarını boyamazlar; siz onlara muhalefet edin.', ravi: 'Ebû Hüreyre', kaynak: 'Buhârî, Libâs, 5899; Müslim, Libâs, 2103', k: [['b', 5899, 'Abu Huraira'], ['m', 2103, 'Horaira']] },
              { metin: 'Mekke’nin fethi günü Ebû Kuhâfe getirildi; başı ve sakalı bembeyazdı. Resûlullah: “Bunu bir şeyle değiştirin, siyahtan kaçının” buyurdu.', ravi: 'Câbir b. Abdullah', kaynak: 'Müslim, Libâs, 2102', k: [['m', 2102, 'Jabir']] }
          ],
          fikih: { metin: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’na göre başkalarını yanıltma kastı olmaksızın saç, sakal ve bıyık boyanabilir; erkeğin saçını siyaha boyaması mekruh, kına gibi başka renklerle boyaması caizdir. Siyaha boyamada âlimlerin görüşleri farklıdır; evli kadınların eşleri için siyah dahil istedikleri renge boyamasında sakınca görülmemiştir (TDV İslâm Ansiklopedisi, “Saç”).', kaynak: 'Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu (basında aktarılan fetva); TDV İslâm Ansiklopedisi, “Saç”' },
          akilda: 'Ak saç bir nimettir; boyarsan aldatma.',
          kaynak: 'Buhârî, Libâs, 5899; Müslim, Libâs, 2102, 2103.' },
        { id: 'peygamberimizin-gorunusu', bolum: 'ilke', konu: ['beden', 'sac'], emo: '🌙', cizim: 'hilye',
          ad: 'Örnek: Peygamberimizin görünüşü', ozet: 'Sahih rivayetlerin anlattığı (çizilmez)',
          hukum: { ad: 'Bilgi', tur: 'bilgi' },
          aciklama: 'Sahabe, Peygamberimizin görünüşünü sevgiyle anlatmıştır. Orta boylu, güzel yüzlü, saçı ne kıvırcık ne düz bir insandı. Bu bölümde peygamberlerin ve sahabenin yüzü ve bedeni çizilmez; yalnızca sahih rivayetler aktarılır.',
          hadisler: [
              { metin: 'İnsanlar arasında orta boyluydu; ne uzun ne kısaydı. Rengi pembe beyazdı; ne bembeyaz ne esmerdi. Saçı ne çok kıvırcık ne de dümdüzdü.', ravi: 'Enes b. Mâlik', kaynak: 'Buhârî, Menâkıb, 3547; Müslim, Fezâil, 2347', k: [['b', 3547, 'Anas'], ['m', 2347, 'Anas']] },
              { metin: 'Resûlullah insanların yüzü en güzeli ve yaratılışı en güzeli idi; ne çok uzun ne de kısaydı.', ravi: 'Berâ b. Âzib', kaynak: 'Buhârî, Menâkıb, 3549; Müslim, Fezâil, 2337', k: [['b', 3549, 'Bara'], ['m', 2337, 'Bara']] }
          ],
          akilda: 'Onu sevmek, ahlakına ve sünnetine uymaktır.',
          kaynak: 'Buhârî, Menâkıb, 3547, 3549; Müslim, Fezâil, 2337, 2347.' },

        // ---------------- Erkek ----------------
        { id: 'erkegin-ortunmesi', bolum: 'erkek', konu: ['kiyafet'], emo: '👖', cizim: 'erkek-avret', ortu: 'erkek',
          ad: 'Erkeğin örtünmesi', ozet: 'Göbek ile diz kapağı arası',
          hukum: { ad: 'Farz', tur: 'farz' },
          aciklama: 'Kur’an, mümin erkeklere gözlerini haramdan sakınmalarını ve mahrem yerlerini korumalarını emreder. Fıkıhta erkeğin her durumda örtmesi gereken yer göbek ile diz kapağı arasıdır. Bu sınır en azıdır; bunun dışındaki yerler de örfe ve edebe göre örtülür.',
          ayetler: ['24:30'],
          fikih: { metin: 'Erkeğin avret yeri göbek ile diz kapağı arasıdır. Hanefî mezhebinde diz kapağı avrete dahildir, göbek dahil değildir; Şâfiî ve Hanbelî mezheplerinde göbek de diz kapağı da dahil değildir (TDV İslâm Ansiklopedisi, “Setr-i Avret”). Diyanet İlmihali’nde Hanefî görüş esas alınır: göbek altından diz kapağına kadar, diz kapağı dahil. Bu sınırın dışındaki yerlerin her ortamda açılabileceği anlamına gelmez; örf ve görgü kuralları da gözetilir (TDV İslâm Ansiklopedisi, “Tesettür”).', kaynak: 'Diyanet İşleri Başkanlığı, İlmihal I; TDV İslâm Ansiklopedisi, “Setr-i Avret” ve “Tesettür”' },
          akilda: 'Hayâ yalnız kadına değil, erkeğe de emredilmiştir.',
          kaynak: 'Nûr 30; Diyanet İlmihali; TDV İslâm Ansiklopedisi.' },
        { id: 'sakal-biyik', bolum: 'erkek', konu: ['sakal'], emo: '🧔', cizim: 'sakal',
          ad: 'Sakal ve bıyık', ozet: 'Sakalı bırakmak, bıyığı kısaltmak',
          hukum: { ad: 'Sünnet', tur: 'sunnet' },
          aciklama: 'Peygamberimiz sakalın bırakılmasını ve bıyığın kısaltılmasını istemiştir. Kur’an da Hz. Hârûn’un sakalından söz eder. Sahabeden İbn Ömer, hac ve umrede sakalını avucuyla tutar, taşan kısmı keserdi. Sakal bırakmak sünnettir; kesmenin hükmünde mezhepler farklı görüşlere sahiptir.',
          ayetler: ['20:94'],
          hadisler: [
              { metin: 'Müşriklere muhalefet edin: Sakalları bırakın, bıyıkları kısaltın. (İbn Ömer, hac ya da umre yaptığında sakalını avucuyla tutar, avucundan taşanı keserdi.)', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Libâs, 5892; Müslim, Tahâret, 259', k: [['b', 5892, 'Umar'], ['m', 259, 'Ibn Umar']] }
          ],
          fikih: { metin: 'Diyanet İslam İlmihali’ne göre sakal bırakmak Hz. Peygamber’in sünnetlerindendir. Kesmenin hükmünde görüşler farklıdır: Hanefîlerde “tahrîmen mekruh” terimi kullanılır; Şâfiîlerde yaygın görüş mekruh olduğudur. Son dönem âlimlerinin bir kısmı sakalı esasen örfle ilgili saymış, Peygamber’e uyma niyetiyle bırakılınca sünnet ya da müstehap olacağını söylemiştir. Bıyığı kısaltma emri fakihlerin görüş birliğiyle farz anlamına gelmez (TDV İslâm Ansiklopedisi, “Sakal”).', kaynak: 'Diyanet İslam İlmihali II; TDV İslâm Ansiklopedisi, “Sakal”' },
          akilda: 'Sakal bir sünnettir; onu taşıyan, ahlakıyla da süslesin.',
          kaynak: 'Tâhâ 94; Buhârî, Libâs, 5892; Müslim, Tahâret, 259.' },
        { id: 'altin-ipek', bolum: 'erkek', konu: ['sus', 'kiyafet'], emo: '💍', cizim: 'yuzuk',
          ad: 'Altın ve ipek erkeğe yasak', ozet: 'Altın yüzük ve saf ipek elbise',
          hukum: { ad: 'Haram', tur: 'haram' },
          aciklama: 'Peygamberimiz erkeklerin altın yüzük takmasını ve ipek giymesini yasaklamış, bir adamın elindeki altın yüzüğü çıkarıp atmıştır. Bu yasak erkeklere yöneliktir; kadınların altın ve ipek kullanması caizdir. Erkekler gümüş yüzük takabilir.',
          hadisler: [
              { metin: 'Resûlullah bize altın yüzüğü, ipeği ve ipekli kumaşları, gümüş kapları kullanmayı yasakladı.', ravi: 'Berâ b. Âzib', kaynak: 'Buhârî, Libâs, 5863', k: [['b', 5863, 'Bara']] },
              { metin: 'Resûlullah bir adamın elinde altın yüzük gördü; onu çıkarıp attı ve “Sizden biri ateşten bir kor alıp eline takıyor” buyurdu.', ravi: 'Abdullah b. Abbâs', kaynak: 'Müslim, Libâs, 2090', k: [['m', 2090, 'Abbas']] },
              { metin: 'Dünyada ipek giyen, ahirette onu giymez.', ravi: 'Enes b. Mâlik', kaynak: 'Buhârî, Libâs, 5832', k: [['b', 5832, 'Anas']] }
          ],
          fikih: { metin: 'Âlimlerin çoğunluğuna göre altın yüzük ve saf ipek elbise erkeklere haramdır; az sayıda âlim farklı görüştedir. Kadınlar için caizdir. Erkeklerin gümüş yüzük takması mubahtır. Başka elbisesi varken ipek elbiseyle kılınan namaz mekruh olmakla birlikte geçerlidir (Diyanet İşleri Fetva Kurulu).', kaynak: 'Diyanet İslam İlmihali II; Diyanet İşleri Başkanlığı Fetva Kurulu' },
          akilda: 'Erkeğin süsü sadeliktir.',
          kaynak: 'Buhârî, Libâs, 5832, 5863; Müslim, Libâs, 2090.' },
        { id: 'kibirle-surumek', bolum: 'erkek', konu: ['kiyafet'], emo: '🧥', cizim: 'etek',
          ad: 'Elbiseyi kibirle yerde sürümek', ozet: 'Yasak, kibirle yapılana yöneliktir',
          hukum: { ad: 'Kibirle: haram', tur: 'haram' },
          aciklama: 'Kur’an yeryüzünde böbürlenerek yürümeyi yasaklar. Peygamberimiz de elbisesini kibirle yerde sürüyene Allah’ın kıyamet günü bakmayacağını bildirmiştir. Hz. Ebû Bekir, dikkat etmezse elbisesinin bir tarafının sarktığını söyleyince Peygamberimiz onun bunu kibirle yapanlardan olmadığını söylemiştir.',
          ayetler: ['31:18'],
          hadisler: [
              { metin: 'Allah, elbisesini kibirle yerde sürüyene kıyamet günü bakmaz.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Libâs, 5783; Müslim, Libâs, 2085', k: [['b', 5783, 'Umar'], ['m', 2085, 'Umar']] },
              { metin: 'Ebû Bekir, “Dikkat etmezsem elbisemin bir tarafı sarkıyor” deyince Resûlullah: “Sen onu kibirle yapanlardan değilsin” buyurdu.', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Libâs, 5784', k: [['b', 5784, 'Abu Bakr']] }
          ],
          akilda: 'Elbisenin boyu değil, kalbin kibri ölçülür.',
          kaynak: 'Lokmân 18; Buhârî, Libâs, 5783, 5784; Müslim, Libâs, 2085.' },

        // ---------------- Kadın ----------------
        { id: 'tesettur', bolum: 'kadin', konu: ['kiyafet', 'sac'], emo: '🧕', cizim: 'kadin-avret', ortu: 'kadin',
          ad: 'Kadının örtünmesi (tesettür)', ozet: 'Başörtüsü yakaların üzerine; yüz ve eller açık',
          hukum: { ad: 'Farz', tur: 'farz' },
          aciklama: 'Kur’an, mümin kadınlara süslerini kendiliğinden görünen kısım dışında açmamalarını ve başörtülerini yakalarının üzerine salmalarını emreder; dışarı çıkarken üstlerine örtü almalarını ister. Ayet inince ilk muhacir kadınlar örtülerini keserek hemen örtündüler. Örtünme, Allah’a saygının ve hayânın ifadesidir.',
          ayetler: ['24:31', '33:59'],
          hadisler: [
              { metin: 'Allah ilk muhacir kadınlara rahmet etsin. “Başörtülerini yakalarının üzerine salsınlar” ayeti inince, örtülerini kesip onlarla örtündüler.', ravi: 'Hz. Âişe', kaynak: 'Buhârî, Tefsîr, 4758', k: [['b', 4758, 'Aishah']] }
          ],
          fikih: { metin: 'Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’nun 30 Aralık 1980 (77) ve 3 Aralık 1993 (6) tarihli kararlarına göre başörtüsü Kur’an, Sünnet ve Müslümanların ortak kabulüne dayanan dinî bir vecîbedir. Hanefî mezhebinde kadının yüzü, elleri ve ayakları dışında, sarkan saçları dahil bütün bedeni avrettir. Şâfiî ve Hanbelî mezheplerinde namazda yüz ve eller dışındaki beden avrettir; bu iki mezhepte ağırlıklı görüş namaz dışında yüz ve ellerin de örtülmesi yönündedir. Başörtüsü takmamak kişiyi dinden çıkarmaz; takva ve dindarlık açısından değerlendirilir (TDV İslâm Ansiklopedisi).', kaynak: 'Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu kararları (1980/77, 1993/6); TDV İslâm Ansiklopedisi, “Tesettür” ve “Setr-i Avret”' },
          akilda: 'Örtü bir sınır değil, saygıyla çizilmiş bir çerçevedir.',
          kaynak: 'Nûr 31; Ahzâb 59; Buhârî, Tefsîr, 4758.' },
        { id: 'ortunun-nitelikleri', bolum: 'kadin', konu: ['kiyafet'], emo: '🧥', cizim: 'nitelik',
          ad: 'Örtünün nitelikleri', ozet: 'Teni göstermeyen, vücut hatlarını belli etmeyen',
          hukum: { ad: 'Farz', tur: 'farz' },
          aciklama: 'Örtünmenin amacı gerçekleşmelidir: Elbise teni gösterecek kadar ince ya da vücut hatlarını belli edecek kadar dar olmamalıdır. Peygamberimiz “giyinik oldukları hâlde çıplak” olanlardan söz ederek bu ölçüye dikkat çekmiştir. Örtünün biçimi, rengi ve kumaşı ise bu amaç sağlandıkça örfe bırakılmıştır.',
          hadisler: [
              { metin: 'Resûlullah, cehennem ehlinden henüz görmediği iki sınıfı anlatırken “giyinik oldukları hâlde çıplak” olan kadınlardan söz etti ve onların cennete giremeyeceğini, kokusunu bile alamayacağını bildirdi.', ravi: 'Ebû Hüreyre', kaynak: 'Müslim, Libâs, 2128', k: [['m', 2128, 'Huraira']] }
          ],
          fikih: { metin: 'Cildin rengini gösterecek kadar ince elbiseyle avret örtülmüş sayılmaz; kıyafet vücut hatlarını belli etmemeli ve teni göstermemelidir (Diyanet İslam İlmihali; Diyanet İşleri Fetva Kurulu). İslam örtünmeyi emretmekle birlikte biçimi konusunda ayrıntıya girmemiş, bunu örfe bırakmıştır (Diyanet İşleri Fetva Kurulu). Çağdaş âlimlerin genel yaklaşımına göre normal giysi örtünmenin amaçlarını karşılıyorsa çarşaf gibi ayrı bir dış kıyafet zorunlu değildir (TDV İslâm Ansiklopedisi, “Tesettür”).', kaynak: 'Diyanet İslam İlmihali; Diyanet İşleri Başkanlığı Fetva Kurulu; TDV İslâm Ansiklopedisi, “Tesettür”' },
          akilda: 'Örtünün ölçüsü, örttüğü kadardır.',
          kaynak: 'Müslim, Libâs, 2128; Diyanet İlmihali; TDV İslâm Ansiklopedisi.' },
        { id: 'kadinin-saci', bolum: 'kadin', konu: ['sac'], emo: '💇‍♀️', cizim: 'kadin-sac',
          ad: 'Kadının saçı', ozet: 'Kısaltmak caiz, kazıtmak uygun görülmez',
          hukum: { ad: 'Caiz', tur: 'caiz' },
          aciklama: 'Peygamberimizin hanımları saçlarını kulak hizasına kadar kısaltırlardı. Kadının saçını kısaltmasında sakınca yoktur; tamamen kazıtması ise uygun görülmemiştir. Saç, mahrem olmayan erkeklere karşı örtülen süslerdendir.',
          hadisler: [
              { metin: 'Resûlullah’ın hanımları saçlarını kulak hizasına kadar kısaltırlardı.', ravi: 'Ebû Seleme b. Abdurrahman', kaynak: 'Müslim, Hayz, 320', k: [['m', 320, 'Salam']] }
          ],
          fikih: { metin: 'Hz. Peygamber, toplumsal kabul doğrultusunda kadınların saçını kısaltmasında sakınca görmemiş, kazıtmasını ise uygun bulmamıştır. Nûr 31. ayet, kadının saçını mahrem olmayan erkeklere göstermemesi şeklinde anlaşılmıştır.', kaynak: 'TDV İslâm Ansiklopedisi, “Saç”' },
          akilda: 'Saç bir süstür; korunur ve özenle taşınır.',
          kaynak: 'Müslim, Hayz, 320; TDV İslâm Ansiklopedisi, “Saç”.' },

        // ---------------- Çocuk ----------------
        { id: 'kaz', bolum: 'cocuk', konu: ['sac'], emo: '💈', cizim: 'kaz',
          ad: 'Saçın bir kısmını kazıyıp bırakmamak (kaz‘)', ozet: 'Saç ya hep birlikte kesilir ya bırakılır',
          hukum: { ad: 'Uygun görülmez', tur: 'mekruh' },
          aciklama: 'Peygamberimiz, çocuğun başının bir kısmını tıraş edip bir kısmını perçem hâlinde bırakmak anlamına gelen kaz‘ı yasaklamıştır. Saç kesilirken baş bir bütün olarak düzenlenir; yamalı, yer yer kazınmış bir görünüm uygun görülmez.',
          hadisler: [
              { metin: 'Resûlullah kaz‘ı yasakladı. (Nâfi‘: Kaz‘, çocuğun başının bir kısmının tıraş edilip bir kısmının bırakılmasıdır.)', ravi: 'Abdullah b. Ömer', kaynak: 'Buhârî, Libâs, 5921; Müslim, Libâs, 2120', k: [['b', 5921, 'Umar'], ['m', 2120, 'Ibn Umar']] }
          ],
          fikih: { metin: 'Çocukların saçının bir kısmının tıraş edilip bir kısmının perçem hâlinde bırakılmasını Hz. Peygamber uygun bulmamıştır.', kaynak: 'TDV İslâm Ansiklopedisi, “Saç”' },
          akilda: 'Saç bir bütündür; düzenli ve bakımlı olsun.',
          kaynak: 'Buhârî, Libâs, 5921; Müslim, Libâs, 2120.' },
        { id: 'cocugun-ortunmesi', bolum: 'cocuk', konu: ['kiyafet'], emo: '🌱', cizim: 'cocuk',
          ad: 'Çocuğun örtünmesi ve sorumluluk çağı', ozet: 'Yükümlülük ergenlikle başlar; öncesi alıştırmadır',
          hukum: { ad: 'Bulûğda farz', tur: 'farz' },
          aciklama: 'Kur’an, ergenlik çağına ermemiş çocukların yalnızca belli vakitlerde, ergenliğe erenlerin ise her zaman izin isteyerek odaya girmesini öğretir; mahremiyet bilinci küçük yaşta başlar. Örtünme ve diğer dinî yükümlülükler bulûğ (ergenlik) ile başlar. O zamana kadar çocuğa giyinme edebi sevdirerek ve zorlamadan öğretilir.',
          ayetler: ['24:58', '24:59'],
          fikih: { metin: 'Bulûğ çağına ermemiş çocuklar dinî emirlerle yükümlü değildir. Hukukçular yedi yaşı temyiz (iyiyi kötüden ayırma) gücünün başlangıcı kabul eder; çocuk bu yaştan sonra ibadetlere ve edebe alıştırılır (TDV İslâm Ansiklopedisi, “Âkıl”). Nûr 31. ayette kadınların süslerini gösterebileceği kimseler arasında “kadınların mahrem yerlerini henüz anlamayan çocuklar” da sayılmıştır (TDV İslâm Ansiklopedisi, “Tesettür”).', kaynak: 'TDV İslâm Ansiklopedisi, “Âkıl” ve “Tesettür”' },
          akilda: 'Sorumluluk ergenlikle gelir; sevgi ise bugünden başlar.',
          kaynak: 'Nûr 58-59; TDV İslâm Ansiklopedisi.' }
    ]
};
