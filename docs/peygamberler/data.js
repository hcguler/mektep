// ============================================
// Peygamberler Yolculuğu — içerik
// --------------------------------------------
// Ana kaynak Kur'an'dır. Her bilgi bir ayete dayanır; Kur'an'da geçmeyen tarih, yaş ya da yer yazılmaz.
// Arapça adlar elle yazılmaz: tools/peygamberler-uret.mjs adı "adAyet" ayetinin Tanzil metninden alır.
// Ayet metinleri ayetler.js'tedir (Tanzil Simple + Diyanet İşleri meali, tools/lib/tanzil-ayetler.mjs).
//
// Alanlar: id · ad · b (harekesiz Arapça ad, yalnızca arama ve denetim için) · adAyet
//   kisa (tek satır) · ozet (Kur'an'a göre 2-3 cümle) · kavim / yer {metin, ayet} (yalnızca Kur'an'da geçiyorsa)
//   olaylar [{metin, ayet, soru?}] · ayet (öne çıkan ayet) · aile [{id, bag, ayet}] · motif (çocuk teması simgesi)
//   akilda · not (gerekirse)
// Sıra: Hz. Âdem'den Hz. Muhammed'e kadar yaygın sıralama. Kur'an bütün peygamberler için kesin bir
// tarih sırası vermez; bu sıra öğrenmeyi kolaylaştırmak içindir.
// ============================================
window.PEYGAMBER_DATA = {
    surum: 1,
    meal: 'Diyanet İşleri Başkanlığı meali (Tanzil, tr.diyanet)',
    giris: [
        { ayet: '4:164-165', metin: 'Kur’an, kıssalarını anlattığı ve anlatmadığı peygamberler olduğunu bildirir; adı geçen yirmi beş peygamber, gönderilenlerin hepsi değildir.' },
        { ayet: '2:285', metin: 'Müminler, peygamberlerin hiçbirini diğerinden ayırmadan hepsine inanır.' },
        { ayet: '12:111', metin: 'Peygamberlerin kıssaları akıl sahipleri için ibrettir.' }
    ],
    peygamberler: [
        { id: 'adem', ad: 'Hz. Âdem', b: 'آدم', adAyet: '2:31', motif: '🌱',
          kisa: 'İlk insan; Allah’ın isimleri öğrettiği kul',
          ozet: 'Allah, yeryüzünde bir halife yaratacağını meleklere bildirdi ve Âdem’e bütün isimleri öğretti. Melekler ona secde etti; İblis ise kibirlenip secde etmedi. Âdem ve eşi şeytana uyup yasak ağaca yaklaştılar; sonra hatalarını kabul edip tövbe ettiler ve Allah tövbelerini kabul etti.',
          olaylar: [
              { metin: 'Allah, yeryüzünde bir halife yaratacağını meleklere bildirdi.', ayet: '2:30' },
              { metin: 'Âdem’e bütün isimler öğretildi.', ayet: '2:31', soru: 'Allah’ın bütün isimleri öğrettiği peygamber kimdir?' },
              { metin: 'Melekler secde etti, İblis kibirlenip direndi.', ayet: '2:34' },
              { metin: 'Âdem ve eşi “Rabbimiz! Kendimize yazık ettik” diyerek tövbe ettiler.', ayet: '7:23', soru: 'Eşiyle birlikte “Rabbimiz! Kendimize yazık ettik” diye tövbe eden peygamber kimdir?' }
          ],
          ayet: '2:37', akilda: 'Hata edince Âdem gibi dön: tövbenin kapısı açıktır.' },
        { id: 'idris', ad: 'Hz. İdrîs', b: 'ادريس', adAyet: '19:56', motif: '⛰️',
          kisa: 'Çok doğru bir peygamber, yüce bir makama yükseltilen',
          ozet: 'Kur’an, İdrîs’i çok doğru bir peygamber olarak anar ve Allah’ın onu yüce bir makama yükselttiğini bildirir. Sabredenlerden ve salih kullardan sayılır.',
          olaylar: [
              { metin: 'Çok doğru bir peygamberdi; Allah onu yüce bir makama yükseltti.', ayet: '19:56-57' },
              { metin: 'İsmâil ve Zülkifl ile birlikte sabredenlerden sayıldı.', ayet: '21:85' }
          ],
          ayet: '19:56-57', akilda: 'Doğruluk, insanı yüceltir.' },
        { id: 'nuh', ad: 'Hz. Nûh', b: 'نوح', adAyet: '26:106-110', motif: '⛵',
          kisa: 'Kavmini yıllarca davet eden, gemiyi yapan peygamber',
          ozet: 'Nûh, kavmini gece gündüz, gizli ve açık Allah’a davet etti. Kavmi arasında bin yıldan elli yıl eksik kaldı; inananlar azdı. Allah’ın emriyle bir gemi yaptı; tufanda inananlar gemiyle kurtuldu, oğlu ise dağa sığınmayı seçip boğulanlardan oldu.',
          kavim: { metin: 'Nûh kavmi', ayet: '26:105' },
          olaylar: [
              { metin: 'Kavmini gece gündüz davet etti.', ayet: '71:5' },
              { metin: 'Kavmi arasında bin yıldan elli yıl eksik kaldı.', ayet: '29:14', soru: 'Kavmi arasında bin yıldan elli yıl eksik kalan peygamber kimdir?' },
              { metin: 'Allah’ın gözetimi altında gemiyi yaptı.', ayet: '11:36-37', soru: 'Allah’ın emriyle gemiyi yapan peygamber kimdir?' },
              { metin: 'Oğlu “Dağa sığınırım” dedi ve boğulanlardan oldu.', ayet: '11:42-43' }
          ],
          ayet: '71:5', akilda: 'Doğruya çağırmaktan yorulma; sonuç Allah’a aittir.' },
        { id: 'hud', ad: 'Hz. Hûd', b: 'هود', adAyet: '26:124-135', motif: '🌬️',
          kisa: 'Güçleriyle övünen Âd kavmine gönderilen peygamber',
          ozet: 'Hûd, kardeşleri olduğu Âd kavmine gönderildi ve onları yalnız Allah’a kulluğa çağırdı. Âd kavmi “Bizden daha güçlü kim var?” diyerek büyüklük tasladı ve uyarıyı reddetti; sonunda dondurucu, şiddetli bir rüzgârla helak oldular.',
          kavim: { metin: 'Âd kavmi', ayet: '7:65' }, yer: { metin: 'Ahkāf (kum tepeleri)', ayet: '46:21' },
          olaylar: [
              { metin: 'Kavmi “Bizden daha güçlü kim var?” diyerek büyüklük tasladı.', ayet: '41:15', soru: '“Bizden daha güçlü kim var?” diyen kavme gönderilen peygamber kimdir?' },
              { metin: 'Âd kavmi dondurucu, şiddetli bir rüzgârla helak oldu.', ayet: '69:6' }
          ],
          ayet: '7:65', akilda: 'Güç Allah’ındır; güçle övünen kaybeder.' },
        { id: 'salih', ad: 'Hz. Sâlih', b: 'صالح', adAyet: '26:142-152', motif: '🐪',
          kisa: 'Semûd kavmine dişi deve mucizesiyle gönderilen peygamber',
          ozet: 'Sâlih, kardeşleri olduğu Semûd kavmine gönderildi. Allah’ın bir mucizesi olarak dişi bir deve gösterildi ve ona dokunulmaması istendi. Kavmi deveyi kesti ve Rablerinin emrine karşı geldi; sonra helak oldular.',
          kavim: { metin: 'Semûd kavmi', ayet: '7:73' }, yer: { metin: 'Hicr', ayet: '15:80' },
          olaylar: [
              { metin: 'Kavmine Allah’ın bir mucizesi olarak dişi bir deve gösterildi.', ayet: '7:73', soru: 'Kavmine dişi deve mucizesi gösterilen peygamber kimdir?' },
              { metin: 'Kavmi dağlarda kayaları oyarak evler yapıyordu.', ayet: '7:74' },
              { metin: 'Kavmi deveyi kesti ve emre karşı geldi.', ayet: '7:76-77' }
          ],
          ayet: '7:73', akilda: 'Emanete ve uyarıya saygı göster.' },
        { id: 'ibrahim', ad: 'Hz. İbrâhîm', b: 'ابراهيم', adAyet: '4:125', motif: '🔥',
          kisa: 'Allah’ın dostu; ateşin serin kılındığı peygamber',
          ozet: 'İbrâhîm, gökteki yıldız, ay ve güneşin batıp gittiğini göstererek yalnız Yaratan’a yöneldi. Kavminin putlarını kırdı; Allah ateşe, ona karşı serin ve zararsız olmasını emretti. Oğlu İsmâil ile Kâbe’nin temellerini yükseltti. Allah onu dost edindi.',
          olaylar: [
              { metin: 'Yıldızın, ayın ve güneşin batışını göstererek yalnız Yaratan’a yöneldi.', ayet: '6:76-79' },
              { metin: 'Kavminin putlarını paramparça etti, büyüklerini sağlam bıraktı.', ayet: '21:58' },
              { metin: 'Allah ateşe “Ey ateş! İbrahim’e karşı serin ve zararsız ol” dedi.', ayet: '21:69', soru: 'Ateşin kendisine karşı serin ve zararsız kılındığı peygamber kimdir?' },
              { metin: 'Oğlu İsmâil ile Kâbe’nin temellerini yükseltti.', ayet: '2:127', soru: 'Oğlu ile Kâbe’nin temellerini yükselten peygamber kimdir?' }
          ],
          aile: [{ id: 'ismail', bag: 'Oğlu', ayet: '14:39' }, { id: 'ishak', bag: 'Oğlu', ayet: '14:39' }, { id: 'lut', bag: 'Ona inandı', ayet: '29:26' }],
          ayet: '4:125', akilda: 'Hakikati aramaktan vazgeçme; Allah’a güvenen için ateş bile serinler.' },
        { id: 'lut', ad: 'Hz. Lût', b: 'لوط', adAyet: '26:161-166', motif: '🏙️',
          kisa: 'İbrâhîm’e inanan; kavmini hayasızlıktan sakındıran peygamber',
          ozet: 'Lût, Hz. İbrâhîm’e inandı. Kavmini, daha önce kimsenin yapmadığı bir hayasızlıktan sakındırdı. Kavmi onu dinlemedi; Lût ve ailesi, geride kalan eşi dışında kurtarıldı.',
          olaylar: [
              { metin: 'Hz. İbrâhîm’e inandı.', ayet: '29:26' },
              { metin: 'Kavmini daha önce kimsenin yapmadığı hayasızlıktan sakındırdı.', ayet: '7:80-81' },
              { metin: 'Kendisi ve ailesi kurtarıldı; eşi geride kalanlardan oldu.', ayet: '7:83' }
          ],
          aile: [{ id: 'ibrahim', bag: 'İnandığı peygamber', ayet: '29:26' }],
          ayet: '7:80-81', akilda: 'Kötülüğün karşısında yalnız da kalsan doğruyu söyle.' },
        { id: 'ismail', ad: 'Hz. İsmâil', b: 'اسماعيل', adAyet: '19:54', motif: '🕋',
          kisa: 'Sözüne sadık; Kâbe’yi babasıyla yükselten peygamber',
          ozet: 'Kur’an İsmâil’i sözünde doğru, gönderilmiş bir peygamber olarak anar; çevresindekilere namazı ve zekâtı emrederdi. Babası İbrâhîm ile Kâbe’nin temellerini yükseltti ve sabredenlerden sayıldı.',
          olaylar: [
              { metin: 'Sözünde doğru bir peygamberdi; çevresindekilere namazı ve zekâtı emrederdi.', ayet: '19:54-55', soru: 'Kur’an’ın “sözünde doğru” diye andığı ve Kâbe’yi babasıyla yükselten peygamber kimdir?' },
              { metin: 'Babası İbrâhîm ile Kâbe’nin temellerini yükseltti.', ayet: '2:127' }
          ],
          aile: [{ id: 'ibrahim', bag: 'Babası', ayet: '14:39' }, { id: 'ishak', bag: 'Kardeşi', ayet: '14:39' }],
          not: 'Saffât 102-107’deki kurban kıssasında oğlun adı geçmez; âlimlerin çoğuna göre bu oğul Hz. İsmâil’dir.',
          ayet: '19:54', akilda: 'Söz ver, sonra sözünü tut.' },
        { id: 'ishak', ad: 'Hz. İshak', b: 'اسحاق', adAyet: '37:112', motif: '✨',
          kisa: 'İbrâhîm’e müjdelenen salih peygamber',
          ozet: 'İshak, Hz. İbrâhîm’e ve eşine, yaşlılıklarında müjdelenen salih bir peygamberdir. Allah, İbrâhîm’e İshak’ı ve Yakup’u bağışladı ve her birini peygamber yaptı.',
          olaylar: [
              { metin: 'Salihlerden bir peygamber olarak müjdelendi.', ayet: '37:112' },
              { metin: 'Melekler İbrâhîm’in eşine İshak’ı ve ardından Yakup’u müjdeledi.', ayet: '11:71' }
          ],
          aile: [{ id: 'ibrahim', bag: 'Babası', ayet: '14:39' }, { id: 'yakup', bag: 'Oğlu', ayet: '19:49' }],
          ayet: '19:49', akilda: 'Müjde, sabredenlere gelir.' },
        { id: 'yakup', ad: 'Hz. Yakup', b: 'يعقوب', adAyet: '2:132', motif: '🤍',
          kisa: 'Güzel sabrın örneği; derdini Allah’a açan peygamber',
          ozet: 'Yakup, oğullarına “Allah bu dini sizin için seçti; Müslüman olarak ölün” diye vasiyet etti. Oğlu Yûsuf’u kaybettiğinde “güzel bir sabır” gösterdi; üzüntüden gözleri ağardı ama “Ben üzüntü ve tasamı yalnız Allah’a açarım” dedi.',
          olaylar: [
              { metin: 'Oğullarına Allah’ın seçtiği din üzere kalmalarını vasiyet etti.', ayet: '2:132' },
              { metin: 'Yûsuf kaybolunca “güzel bir sabır” dedi.', ayet: '12:18' },
              { metin: '“Ben üzüntü ve tasamı yalnız Allah’a açarım” dedi.', ayet: '12:86', soru: '“Ben üzüntü ve tasamı yalnız Allah’a açarım” diyen peygamber kimdir?' }
          ],
          aile: [{ id: 'ishak', bag: 'Babası', ayet: '19:49' }, { id: 'yusuf', bag: 'Oğlu', ayet: '12:6' }],
          ayet: '12:86', akilda: 'Derdini insanlara değil, Allah’a aç.' },
        { id: 'yusuf', ad: 'Hz. Yûsuf', b: 'يوسف', adAyet: '12:4', motif: '⭐',
          kisa: 'Kuyudan saraya; iffetin ve affın peygamberi',
          ozet: 'Yûsuf, çocukken on bir yıldızın, güneşin ve ayın kendisine secde ettiğini rüyasında gördü. Kardeşleri onu kuyuya attı; Mısır’da satıldı, iffetini korudu ve haksız yere zindana girdi. Allah ona rüya yorumunu öğretti; ülkenin hazinelerine yönetici oldu ve sonunda kendisine kötülük eden kardeşlerini affetti.',
          yer: { metin: 'Mısır', ayet: '12:21' },
          olaylar: [
              { metin: 'Rüyasında on bir yıldızın, güneşin ve ayın kendisine secde ettiğini gördü.', ayet: '12:4', soru: 'Rüyasında on bir yıldızı, güneşi ve ayı gören peygamber kimdir?' },
              { metin: 'Kardeşleri onu bir kuyunun derinliklerine bıraktı.', ayet: '12:15' },
              { metin: 'İffetini korudu; “Rabbim! Hapis benim için daha iyidir” dedi.', ayet: '12:33' },
              { metin: 'Kardeşlerine “Bugün azarlanacak değilsiniz, Allah sizi bağışlar” diyerek onları affetti.', ayet: '12:92-93', soru: 'Kendisini kuyuya bırakan kardeşlerine “Bugün azarlanacak değilsiniz” diyen peygamber kimdir?' }
          ],
          aile: [{ id: 'yakup', bag: 'Babası', ayet: '12:6' }],
          ayet: '12:92-93', akilda: 'Güç elindeyken affetmek, en büyük güçtür.' },
        { id: 'eyyub', ad: 'Hz. Eyyûb', b: 'ايوب', adAyet: '21:83', motif: '🌿',
          kisa: 'Sabrın timsali; dertte bile Rabbine yönelen peygamber',
          ozet: 'Eyyûb, başına gelen sıkıntıda Rabbine “Başıma bir bela geldi; Sen merhametlilerin merhametlisisin” diye seslendi. Allah duasını kabul etti, derdini giderdi. Kur’an onu sabırlı bulduğunu ve ne güzel bir kul olduğunu bildirir.',
          olaylar: [
              { metin: '“Başıma bir bela geldi; Sen merhametlilerin merhametlisisin” diye dua etti.', ayet: '21:83', soru: '“Başıma bir bela geldi; Sen merhametlilerin merhametlisisin” diye dua eden peygamber kimdir?' },
              { metin: 'Allah duasını kabul etti ve derdini giderdi.', ayet: '21:84' },
              { metin: 'Allah onu sabırlı buldu: ne güzel bir kul.', ayet: '38:44' }
          ],
          ayet: '38:44', akilda: 'Dertte de şükürde de Rabbine yönel.' },
        { id: 'suayb', ad: 'Hz. Şuayb', b: 'شعيب', adAyet: '26:177-184', motif: '⚖️',
          kisa: 'Ölçüde ve tartıda dürüstlüğü öğütleyen peygamber',
          ozet: 'Şuayb, kardeşleri olduğu Medyen halkına gönderildi. Onlara ölçüyü ve tartıyı tam yapmalarını, insanların mallarını eksiltmemelerini ve yeryüzünde bozgunculuk yapmamalarını öğütledi. “Gücümün yettiği kadar ıslah etmekten başka bir dileğim yoktur” dedi.',
          kavim: { metin: 'Medyen halkı', ayet: '7:85' },
          olaylar: [
              { metin: 'Ölçüyü ve tartıyı tam yapmayı öğütledi.', ayet: '7:85', soru: 'Medyen halkına ölçüyü ve tartıyı tam yapmayı öğütleyen peygamber kimdir?' },
              { metin: '“Gücümün yettiği kadar ıslah etmekten başka bir dileğim yoktur” dedi.', ayet: '11:88' }
          ],
          ayet: '7:85', akilda: 'Ticarette dürüstlük, imanın bir parçasıdır.' },
        { id: 'musa', ad: 'Hz. Mûsâ', b: 'موسى', adAyet: '4:164-165', motif: '🌊',
          kisa: 'Allah’ın konuştuğu; Firavun’a gönderilen peygamber',
          ozet: 'Mûsâ bebekken, annesine bildirilen vahiyle suya bırakıldı ve Firavun’un sarayında büyüdü. Allah onunla konuştu; kardeşi Hârûn ile birlikte Firavun’a gönderildi ve ona yumuşak söz söylemeleri emredildi. Deniz yarıldı, İsrailoğulları kurtuldu; Mûsâ’ya Tevrat verildi.',
          yer: { metin: 'Mısır', ayet: '10:87' },
          olaylar: [
              { metin: 'Annesine, korktuğunda onu suya bırakması bildirildi.', ayet: '28:7', soru: 'Annesinin bebekken suya bıraktığı peygamber kimdir?' },
              { metin: 'Allah, Mûsâ ile konuştu.', ayet: '4:164-165' },
              { metin: 'Firavun’a kardeşiyle gidip yumuşak söz söylemesi emredildi.', ayet: '20:43-44' },
              { metin: 'Değneğiyle denize vurdu; deniz ikiye ayrıldı.', ayet: '26:63', soru: 'Değneğiyle denize vurduğunda denizin ikiye ayrıldığı peygamber kimdir?' }
          ],
          aile: [{ id: 'harun', bag: 'Kardeşi', ayet: '19:53' }],
          ayet: '20:43-44', akilda: 'Zalime bile önce yumuşak sözle git.' },
        { id: 'harun', ad: 'Hz. Hârûn', b: 'هارون', adAyet: '20:25-35', motif: '🗣️',
          kisa: 'Mûsâ’nın kardeşi ve yardımcısı',
          ozet: 'Mûsâ, Rabbinden ailesinden kardeşi Hârûn’u kendisine yardımcı yapmasını istedi; çünkü Hârûn’un dili daha düzgündü. Allah rahmetinden Hârûn’u bir peygamber olarak Mûsâ’ya bağışladı.',
          olaylar: [
              { metin: 'Allah, Mûsâ’ya “Seni kardeşinle destekleyeceğiz” dedi.', ayet: '28:35' },
              { metin: 'Hârûn’un dili daha düzgündü.', ayet: '28:33-34', soru: 'Dili daha düzgün olduğu için kardeşine yardımcı yapılan peygamber kimdir?' },
              { metin: 'Allah rahmetinden Hârûn’u bir peygamber olarak bağışladı.', ayet: '19:53' }
          ],
          aile: [{ id: 'musa', bag: 'Kardeşi', ayet: '19:53' }],
          ayet: '19:53', akilda: 'İyilikte kardeşine destek ol.' },
        { id: 'zulkifl', ad: 'Hz. Zülkifl', b: 'ذا الكفل', adAyet: '21:85', motif: '🤝',
          kisa: 'Sabredenlerden ve hayırlılardan bir peygamber',
          ozet: 'Kur’an Zülkifl’i yalnızca iki yerde, sabredenlerden, salihlerden ve hayırlılardan biri olarak anar; hayatına dair ayrıntı vermez.',
          olaylar: [
              { metin: 'İsmâil ve İdrîs ile birlikte sabredenlerden sayıldı.', ayet: '21:85' },
              { metin: 'Hayırlılardan sayıldı.', ayet: '38:48' }
          ],
          ayet: '21:85', akilda: 'Az bilinmek, değersiz olmak değildir.' },
        { id: 'davud', ad: 'Hz. Dâvûd', b: 'داوود', adAyet: '2:251', motif: '⚒️',
          kisa: 'Zebur verilen; demiri yumuşatan peygamber',
          ozet: 'Dâvûd, Câlût’u öldürdü; Allah ona hükümranlık ve hikmet verdi. Kendisine Zebur verildi. Allah ona demiri yumuşattı ve zırh yapmayı öğretti; dağlar ve kuşlar onunla birlikte Allah’ı tesbih ederdi. İnsanlar arasında hak ile hükmetmesi istendi.',
          olaylar: [
              { metin: 'Câlût’u öldürdü; Allah ona hükümranlık ve hikmet verdi.', ayet: '2:251' },
              { metin: 'Ona Zebur verildi.', ayet: '17:55', soru: 'Kendisine Zebur verilen peygamber kimdir?' },
              { metin: 'Allah ona demiri yumuşattı ve zırh yapmasını öğretti.', ayet: '34:10-11' }
          ],
          aile: [{ id: 'suleyman', bag: 'Oğlu', ayet: '27:16' }],
          ayet: '38:26', akilda: 'Hükmederken hak ile hükmet.' },
        { id: 'suleyman', ad: 'Hz. Süleymân', b: 'سليمان', adAyet: '27:16', motif: '🐜',
          kisa: 'Kuş dili öğretilen; karıncayı duyan peygamber',
          ozet: 'Süleymân, babası Dâvûd’a vâris oldu; kendisine kuş dili öğretildi. Karıncanın sözüne hafifçe güldü ve “Rabbim! Bana ve ana babama verdiğin nimete şükürde beni muvaffak kıl” dedi. Hüdhüd kuşundan Sebe halkının haberini aldı.',
          olaylar: [
              { metin: 'Babası Dâvûd’a vâris oldu; kendisine kuş dili öğretildi.', ayet: '27:16' },
              { metin: 'Karıncanın sözünü duydu ve Rabbine şükretti.', ayet: '27:18-19', soru: 'Karıncanın sözünü duyup Rabbine şükreden peygamber kimdir?' },
              { metin: 'Hüdhüd kuşu ona Sebe’den haber getirdi.', ayet: '27:22-26' }
          ],
          aile: [{ id: 'davud', bag: 'Babası', ayet: '27:16' }],
          ayet: '27:18-19', akilda: 'Nimet arttıkça şükür de artmalı.' },
        { id: 'ilyas', ad: 'Hz. İlyâs', b: 'الياس', adAyet: '37:123', motif: '📣',
          kisa: 'Kavmini Baal putuna tapmaktan sakındıran peygamber',
          ozet: 'İlyâs gönderilen peygamberlerdendir. Kavmine “Allah’a karşı gelmekten sakınmaz mısınız? Biçim verenlerin en iyisi olan Allah’ı bırakıp da Baal putuna mı taparsınız?” dedi.',
          olaylar: [
              { metin: 'Kavmini Baal putuna tapmaktan sakındırdı.', ayet: '37:123-126', soru: 'Kavmini Baal putuna tapmaktan sakındıran peygamber kimdir?' },
              { metin: 'Zekeriyyâ, Yahyâ ve Îsâ ile birlikte iyilerden sayıldı.', ayet: '6:84-86' }
          ],
          ayet: '37:123-126', akilda: 'Yaratanı bırakıp yaratılmışa yönelme.' },
        { id: 'elyesa', ad: 'Hz. Elyesa‘', b: 'اليسع', adAyet: '6:84-86', motif: '🌟',
          kisa: 'Âlemlere üstün kılınan hayırlılardan',
          ozet: 'Kur’an Elyesa‘ı iki yerde, âlemlere üstün kılınan ve hayırlılardan olan peygamberler arasında anar; hayatına dair ayrıntı vermez.',
          olaylar: [
              { metin: 'İsmâil, Yûnus ve Lût ile birlikte âlemlere üstün kılındı.', ayet: '6:84-86' },
              { metin: 'Hayırlılardan sayıldı.', ayet: '38:48' }
          ],
          ayet: '6:84-86', akilda: 'Allah katında değer, iyi kul olmaktadır.' },
        { id: 'yunus', ad: 'Hz. Yûnus', b: 'يونس', adAyet: '10:98', motif: '🐋',
          kisa: 'Balığın karnında Rabbine yalvaran peygamber',
          ozet: 'Yûnus, kavminden öfkeyle ayrılıp yüklü gemiye kaçtı; denize atıldı ve onu bir balık yuttu. Karanlıklar içinde “Senden başka tanrı yoktur, Sen münezzehsin, doğrusu ben haksızlık edenlerdenim” diye seslendi; Allah onu kederden kurtardı. Kavmi iman edince azaptan kurtuldu.',
          olaylar: [
              { metin: 'Balık onu yuttu.', ayet: '37:142', soru: 'Balığın yuttuğu peygamber kimdir?' },
              { metin: '“Senden başka tanrı yoktur, Sen münezzehsin, doğrusu ben haksızlık edenlerdenim” diye seslendi.', ayet: '21:87' },
              { metin: 'Kavmi iman edince azaptan kurtuldu.', ayet: '10:98' }
          ],
          ayet: '21:87', akilda: 'En derin karanlıkta bile dua bir çıkış kapısıdır.' },
        { id: 'zekeriyya', ad: 'Hz. Zekeriyyâ', b: 'زكريا', adAyet: '19:2', motif: '🤲',
          kisa: 'Gizlice dua eden; Yahyâ ile müjdelenen peygamber',
          ozet: 'Zekeriyyâ, Hz. Meryem’in bakımını üstlendi. Yaşlılığında Rabbine içinden yalvararak bir evlat istedi; Allah ona Yahyâ’yı müjdeledi.',
          olaylar: [
              { metin: 'Meryem’in bakımını üstlendi.', ayet: '3:37' },
              { metin: 'Rabbine içinden yalvardı.', ayet: '19:3', soru: 'Rabbine içinden yalvarıp evlat isteyen peygamber kimdir?' },
              { metin: 'Kendisine Yahyâ müjdelendi.', ayet: '19:7' }
          ],
          aile: [{ id: 'yahya', bag: 'Oğlu', ayet: '19:7' }],
          ayet: '19:3', akilda: 'Umudunu yitirme; dua et.' },
        { id: 'yahya', ad: 'Hz. Yahyâ', b: 'يحيى', adAyet: '19:12-14', motif: '📖',
          kisa: 'Kitaba kuvvetle sarılan; anne babasına iyi davranan peygamber',
          ozet: 'Yahyâ’ya “Kitaba kuvvetle sarıl” denildi ve çocukken hikmet verildi. Anne babasına iyi davranan, zorba ve isyankâr olmayan biriydi. Doğduğu gün, öleceği gün ve diriltileceği gün ona selam olsun.',
          olaylar: [
              { metin: '“Kitaba kuvvetle sarıl” denildi; çocukken hikmet verildi. Anne babasına iyi davranırdı, baş kaldıran bir zorba değildi.', ayet: '19:12-14', soru: '“Kitaba kuvvetle sarıl” denilen ve çocukken hikmet verilen peygamber kimdir?' },
              { metin: 'Babası Zekeriyyâ’ya, daha önce kimseye verilmemiş bu adla müjdelendi.', ayet: '19:7' }
          ],
          aile: [{ id: 'zekeriyya', bag: 'Babası', ayet: '19:7' }],
          ayet: '19:12-15', akilda: 'Bilgiyi kuvvetle tut, anne babana iyi davran.' },
        { id: 'isa', ad: 'Hz. Îsâ', b: 'عيسى', adAyet: '3:45', motif: '🕊️',
          kisa: 'Meryem oğlu; beşikte konuşan peygamber',
          ozet: 'Îsâ, Allah’ın bir kelimesi olarak Meryem’e müjdelendi. Beşikte konuşarak “Ben Allah’ın kuluyum” dedi. Allah’ın izniyle mucizeler gösterdi; kendisine İncil verildi. Kendisinden sonra adı Ahmed olan bir peygamberi müjdeledi.',
          olaylar: [
              { metin: 'Meryem’e, adı Meryem oğlu Mesih Îsâ olan bir kelime ile müjdelendi.', ayet: '3:45' },
              { metin: 'Beşikte konuştu: “Ben Allah’ın kuluyum.”', ayet: '19:29-33', soru: 'Beşikte konuşarak “Ben Allah’ın kuluyum” diyen peygamber kimdir?' },
              { metin: 'Allah’ın izniyle mucizeler gösterdi.', ayet: '3:48-49' },
              { metin: 'Adı Ahmed olan bir peygamberi müjdeledi.', ayet: '61:6' }
          ],
          ayet: '19:29-33', akilda: 'Kulluk, en yüce şereftir.' },
        { id: 'muhammed', ad: 'Hz. Muhammed (s.a.v.)', b: 'محمد', adAyet: '48:29', motif: '🌙',
          kisa: 'Peygamberlerin sonuncusu; âlemlere rahmet',
          ozet: 'Muhammed, Allah’ın elçisi ve peygamberlerin sonuncusudur. Âlemlere rahmet olarak gönderildi; Kur’an onun büyük bir ahlak üzere olduğunu bildirir.',
          olaylar: [
              { metin: 'Allah’ın elçisi ve peygamberlerin sonuncusudur.', ayet: '33:40', soru: 'Peygamberlerin sonuncusu kimdir?' },
              { metin: 'Âlemlere rahmet olarak gönderildi.', ayet: '21:107' },
              { metin: 'Büyük bir ahlak üzeredir.', ayet: '68:4' },
              { metin: '“Oku!” emriyle başlayan ayetler Alak suresinin başındadır.', ayet: '96:1' }
          ],
          not: 'Alak suresinin ilk ayetlerinin ilk inen ayetler olduğu hadislerle ve âlimlerin büyük çoğunluğunca bildirilir.',
          ayet: '33:40', akilda: 'Onun ahlakı, Kur’an’ın yaşanmış hâlidir.' }
    ]
};
