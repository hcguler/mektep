/* Ezberler — içerik verisi.
 * Kur'an metni: Tanzil Quran Text (Simple), tanzil.net — metin değiştirilmeden kullanılmıştır.
 * Okunuş, meal ve kısa tefsirler bu uygulama için hazırlanmıştır; kaynaklar her ögenin "kaynak" alanındadır.
 * Bu dosya elle düzenlenebilir. Düzenledikten sonra (depo kökünde): node tools/ezberler-anlatim.mjs
 */
window.EZBER_DATA = {
 "surum": "1.0.0",
 "kari": {
  "ad": "Suûd eş-Şüreym",
  "klasor": "Saood_ash-Shuraym_64kbps"
 },
 "besmele": {
  "ar": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "tr": "Bismillâhirrahmânirrahîm.",
  "meal": "Rahmân ve Rahîm olan Allah'ın adıyla."
 },
 "bolumler": [
  {
   "id": "sureler",
   "ad": "Sureler",
   "aciklama": "Fâtiha ve Duhâ'dan Nâs'a kısa sureler",
   "ogeler": [
    {
     "id": "fatiha",
     "tur": "sure",
     "no": 1,
     "ad": "Fâtiha Suresi",
     "kisaAd": "Fâtiha",
     "arAd": "الفاتحة",
     "anlam": "Açılış",
     "konu": "Kulun Rabbiyle konuşması",
     "yer": "Mekke",
     "ayetSayisi": 7,
     "satirlar": [
      {
       "ar": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
       "tr": "Bismillâhirrahmânirrahîm.",
       "meal": "Rahmân ve Rahîm olan Allah'ın adıyla.",
       "ses": "001001"
      },
      {
       "ar": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
       "tr": "Elhamdü lillâhi rabbil'âlemîn.",
       "meal": "Hamd, âlemlerin Rabbi Allah'a mahsustur.",
       "ses": "001002"
      },
      {
       "ar": "الرَّحْمَٰنِ الرَّحِيمِ",
       "tr": "Errahmânirrahîm.",
       "meal": "O, Rahmân'dır, Rahîm'dir.",
       "ses": "001003"
      },
      {
       "ar": "مَالِكِ يَوْمِ الدِّينِ",
       "tr": "Mâliki yevmiddîn.",
       "meal": "Hesap ve ceza gününün sahibidir.",
       "ses": "001004"
      },
      {
       "ar": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
       "tr": "İyyâke na'büdü ve iyyâke neste'în.",
       "meal": "Yalnız sana kulluk eder, yalnız senden yardım dileriz.",
       "ses": "001005"
      },
      {
       "ar": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
       "tr": "İhdinassırâtalmüstakîm.",
       "meal": "Bizi dosdoğru yola ilet;",
       "ses": "001006"
      },
      {
       "ar": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
       "tr": "Sırâtallezîne en'amte aleyhim, ğayrilmağdûbi aleyhim ve leddâllîn.",
       "meal": "Nimet verdiklerinin yoluna; gazaba uğrayanların ve sapanların yoluna değil.",
       "ses": "001007"
      }
     ],
     "tefsir": "Kur'an'ın özü ve namazın vazgeçilmez suresidir; Peygamberimiz, Fâtiha okunmadan namazın tamam olmayacağını bildirmiştir. İlk ayetleri Allah'ı tanıtır ve över. Ortadaki ayet kulun sözüdür: yalnız sana kulluk eder, yalnız senden yardım dileriz. Son ayetleri ise en büyük duadır: bizi doğru yoldan ayırma.",
     "akilda": "Önce hamd, sonra söz, sonra dua: Fâtiha, kulun Rabbiyle konuşmasıdır.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Ezân 95; Müslim, Salât 34."
    },
    {
     "id": "duha",
     "tur": "sure",
     "no": 93,
     "ad": "Duhâ Suresi",
     "kisaAd": "Duhâ",
     "arAd": "الضحى",
     "anlam": "Kuşluk Vakti",
     "konu": "Rabbin seni bırakmadı",
     "yer": "Mekke",
     "ayetSayisi": 11,
     "satirlar": [
      {
       "ar": "وَالضُّحَىٰ",
       "tr": "Vedduhâ.",
       "meal": "Kuşluk vaktine andolsun,",
       "ses": "093001"
      },
      {
       "ar": "وَاللَّيْلِ إِذَا سَجَىٰ",
       "tr": "Velleyli izâ secâ.",
       "meal": "Karanlığı çöktüğü zaman geceye andolsun ki,",
       "ses": "093002"
      },
      {
       "ar": "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
       "tr": "Mâ vedde'ake rabbüke ve mâ kalâ.",
       "meal": "Rabbin seni bırakmadı, sana darılmadı da.",
       "ses": "093003"
      },
      {
       "ar": "وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ",
       "tr": "Ve lel'âhıratü hayrun leke minel'ûlâ.",
       "meal": "Senin için âhiret, dünyadan elbette daha hayırlıdır.",
       "ses": "093004"
      },
      {
       "ar": "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
       "tr": "Ve lesevfe yu'tîke rabbüke feterdâ.",
       "meal": "Rabbin sana verecek, sen de hoşnut olacaksın.",
       "ses": "093005"
      },
      {
       "ar": "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ",
       "tr": "Elem yecidke yetîmen feâvâ.",
       "meal": "O seni yetim bulup barındırmadı mı?",
       "ses": "093006"
      },
      {
       "ar": "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
       "tr": "Ve vecedeke dâllen fehedâ.",
       "meal": "Seni yol bilmez hâlde bulup yola iletmedi mi?",
       "ses": "093007"
      },
      {
       "ar": "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ",
       "tr": "Ve vecedeke 'âilen feağnâ.",
       "meal": "Seni ihtiyaç içinde bulup zengin etmedi mi?",
       "ses": "093008"
      },
      {
       "ar": "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ",
       "tr": "Feemmelyetîme felâ takher.",
       "meal": "Öyleyse yetimi sakın ezme.",
       "ses": "093009"
      },
      {
       "ar": "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ",
       "tr": "Ve emmessâile felâ tenher.",
       "meal": "İsteyeni sakın azarlama.",
       "ses": "093010"
      },
      {
       "ar": "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
       "tr": "Ve emmâ bini'meti rabbike fehaddis.",
       "meal": "Rabbinin nimetini ise durmadan anlat.",
       "ses": "093011"
      }
     ],
     "tefsir": "Vahiy bir süre kesilince müşrikler, Rabbinin Peygamberimizi terk ettiğini söylediler; bu sure onu teselli etmek için indi. Allah, yetimken barındırdığı, yol gösterdiği ve ihtiyaçtan kurtardığı elçisine geçmiş nimetlerini hatırlatır, geleceğin daha güzel olacağını müjdeler. Karşılığında üç görev verir: yetimi ezme, isteyeni azarlama, nimeti anlat.",
     "akilda": "Gece ne kadar karanlık olsa da kuşluk gelir: Rabbin seni bırakmadı.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "insirah",
     "tur": "sure",
     "no": 94,
     "ad": "İnşirâh Suresi",
     "kisaAd": "İnşirâh",
     "arAd": "الشرح",
     "anlam": "Ferahlama",
     "konu": "Zorlukla beraber kolaylık",
     "yer": "Mekke",
     "ayetSayisi": 8,
     "satirlar": [
      {
       "ar": "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
       "tr": "Elem neşrah leke sadrek.",
       "meal": "Biz senin göğsünü açıp genişletmedik mi?",
       "ses": "094001"
      },
      {
       "ar": "وَوَضَعْنَا عَنْكَ وِزْرَكَ",
       "tr": "Ve vada'nâ 'anke vizrek.",
       "meal": "Yükünü senden indirmedik mi?",
       "ses": "094002"
      },
      {
       "ar": "الَّذِي أَنْقَضَ ظَهْرَكَ",
       "tr": "Ellezî enkada zahrek.",
       "meal": "O yük ki sırtını çökertmişti.",
       "ses": "094003"
      },
      {
       "ar": "وَرَفَعْنَا لَكَ ذِكْرَكَ",
       "tr": "Ve refa'nâ leke zikrek.",
       "meal": "Senin şânını yüceltmedik mi?",
       "ses": "094004"
      },
      {
       "ar": "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
       "tr": "Feinne me'al'usri yüsrâ.",
       "meal": "Şüphesiz zorlukla beraber bir kolaylık vardır.",
       "ses": "094005"
      },
      {
       "ar": "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
       "tr": "İnne me'al'usri yüsrâ.",
       "meal": "Gerçekten, zorlukla beraber bir kolaylık vardır.",
       "ses": "094006"
      },
      {
       "ar": "فَإِذَا فَرَغْتَ فَانْصَبْ",
       "tr": "Feizâ ferağte fensab.",
       "meal": "Öyleyse bir işi bitirince hemen başka bir işe koyul,",
       "ses": "094007"
      },
      {
       "ar": "وَإِلَىٰ رَبِّكَ فَارْغَبْ",
       "tr": "Ve ilâ rabbike ferğab.",
       "meal": "Ve yalnız Rabbine yönel.",
       "ses": "094008"
      }
     ],
     "tefsir": "Duhâ suresinin devamı gibidir. Allah, Peygamberimizin gönlünü genişlettiğini, yükünü hafiflettiğini ve adını yücelttiğini bildirir. Zorlukla beraber kolaylık müjdesi iki kez tekrarlanır; müfessirler bunu, bir zorluğun iki kolaylığı yenemeyeceği şeklinde açıklar. Sure, boş durmamayı ve yalnız Allah'a yönelmeyi öğütler.",
     "akilda": "Her zorluğun yanında bir kolaylık vardır; işin bitince yenisine koyul, yönün hep Rabbine olsun.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "tin",
     "tur": "sure",
     "no": 95,
     "ad": "Tîn Suresi",
     "kisaAd": "Tîn",
     "arAd": "التين",
     "anlam": "İncir",
     "konu": "En güzel biçimde yaratılış",
     "yer": "Mekke",
     "ayetSayisi": 8,
     "satirlar": [
      {
       "ar": "وَالتِّينِ وَالزَّيْتُونِ",
       "tr": "Vettîni vezzeytûn.",
       "meal": "İncire ve zeytine andolsun,",
       "ses": "095001"
      },
      {
       "ar": "وَطُورِ سِينِينَ",
       "tr": "Ve tûri sînîn.",
       "meal": "Sînâ dağına andolsun,",
       "ses": "095002"
      },
      {
       "ar": "وَهَٰذَا الْبَلَدِ الْأَمِينِ",
       "tr": "Ve hâzelbeledil'emîn.",
       "meal": "Ve bu güvenli şehre (Mekke'ye) andolsun ki,",
       "ses": "095003"
      },
      {
       "ar": "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
       "tr": "Lekad halaknel'insâne fî ahseni takvîm.",
       "meal": "Biz insanı en güzel biçimde yarattık.",
       "ses": "095004"
      },
      {
       "ar": "ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ",
       "tr": "Sümme radednâhü esfele sâfilîn.",
       "meal": "Sonra onu aşağıların aşağısına çevirdik.",
       "ses": "095005"
      },
      {
       "ar": "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ",
       "tr": "İllellezîne âmenû ve 'amilussâlihâti felehüm ecrun ğayru memnûn.",
       "meal": "Ancak iman edip sâlih ameller işleyenler başka; onlar için kesintisiz bir ödül vardır.",
       "ses": "095006"
      },
      {
       "ar": "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ",
       "tr": "Femâ yükezzibüke ba'dü biddîn.",
       "meal": "Öyleyse ey insan, bundan sonra sana hesap gününü ne yalanlatabilir?",
       "ses": "095007"
      },
      {
       "ar": "أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ",
       "tr": "Eleysallâhü biahkemilhâkimîn.",
       "meal": "Allah, hükmedenlerin en iyi hükmedeni değil midir?",
       "ses": "095008"
      }
     ],
     "tefsir": "İncir, zeytin, Sînâ dağı ve Mekke; vahyin indiği bereketli yerleri hatırlatır. Allah insanı beden ve ruh yönüyle en güzel biçimde yaratmıştır; ama insan bu değerini iman ve iyi işlerle korumazsa en aşağı seviyeye düşer. Kurtulanlar, iman edip sâlih amel işleyenlerdir.",
     "akilda": "En güzel biçimde yaratıldın; değerini iman ve iyilikle koru.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "alak",
     "tur": "sure",
     "no": 96,
     "ad": "Alak Suresi",
     "kisaAd": "Alak",
     "arAd": "العلق",
     "anlam": "Rahme Tutunan Hücre",
     "konu": "İlk vahiy: Oku!",
     "yer": "Mekke",
     "ayetSayisi": 19,
     "not": "19. ayet secde ayetidir; okuyan veya dinleyen kişinin tilâvet secdesi yapması gerekir.",
     "satirlar": [
      {
       "ar": "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
       "tr": "İkra' bismi rabbikellezî halak.",
       "meal": "Yaratan Rabbinin adıyla oku!",
       "ses": "096001"
      },
      {
       "ar": "خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ",
       "tr": "Halakal'insâne min 'alak.",
       "meal": "O, insanı alaktan (rahme tutunan hücreden) yarattı.",
       "ses": "096002"
      },
      {
       "ar": "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
       "tr": "İkra' ve rabbükel'ekrem.",
       "meal": "Oku! Rabbin sonsuz kerem sahibidir.",
       "ses": "096003"
      },
      {
       "ar": "الَّذِي عَلَّمَ بِالْقَلَمِ",
       "tr": "Ellezî 'alleme bilkalem.",
       "meal": "O, kalemle yazmayı öğretendir;",
       "ses": "096004"
      },
      {
       "ar": "عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ",
       "tr": "'Allemel'insâne mâ lem ya'lem.",
       "meal": "İnsana bilmediğini öğretendir.",
       "ses": "096005"
      },
      {
       "ar": "كَلَّا إِنَّ الْإِنْسَانَ لَيَطْغَىٰ",
       "tr": "Kellâ innel'insâne leyetğâ.",
       "meal": "Hayır! Doğrusu insan azar;",
       "ses": "096006"
      },
      {
       "ar": "أَنْ رَآهُ اسْتَغْنَىٰ",
       "tr": "Er raâhüstağnâ.",
       "meal": "Kendini kendine yeterli gördüğü için.",
       "ses": "096007"
      },
      {
       "ar": "إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ",
       "tr": "İnne ilâ rabbikerruc'â.",
       "meal": "Oysa dönüş mutlaka Rabbinedir.",
       "ses": "096008"
      },
      {
       "ar": "أَرَأَيْتَ الَّذِي يَنْهَىٰ",
       "tr": "Eraeytellezî yenhâ.",
       "meal": "Gördün mü şu engelleyeni;",
       "ses": "096009"
      },
      {
       "ar": "عَبْدًا إِذَا صَلَّىٰ",
       "tr": "'Abden izâ sallâ.",
       "meal": "Namaz kıldığı zaman bir kulu?",
       "ses": "096010"
      },
      {
       "ar": "أَرَأَيْتَ إِنْ كَانَ عَلَى الْهُدَىٰ",
       "tr": "Eraeyte in kâne 'alelhüdâ.",
       "meal": "Ne dersin, ya o kul doğru yoldaysa,",
       "ses": "096011"
      },
      {
       "ar": "أَوْ أَمَرَ بِالتَّقْوَىٰ",
       "tr": "Ev emera bittakvâ.",
       "meal": "Yahut takvâyı emrediyorsa?",
       "ses": "096012"
      },
      {
       "ar": "أَرَأَيْتَ إِنْ كَذَّبَ وَتَوَلَّىٰ",
       "tr": "Eraeyte in kezzebe ve tevellâ.",
       "meal": "Ne dersin, ya öteki yalanlıyor ve yüz çeviriyorsa?",
       "ses": "096013"
      },
      {
       "ar": "أَلَمْ يَعْلَمْ بِأَنَّ اللَّهَ يَرَىٰ",
       "tr": "Elem ya'lem biennallâhe yerâ.",
       "meal": "Allah'ın her şeyi gördüğünü bilmiyor mu?",
       "ses": "096014"
      },
      {
       "ar": "كَلَّا لَئِنْ لَمْ يَنْتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ",
       "tr": "Kellâ lein lem yentehi, lenesfe'an binnâsıyeh.",
       "meal": "Hayır! Eğer vazgeçmezse onu perçeminden tutup çekeceğiz;",
       "ses": "096015"
      },
      {
       "ar": "نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ",
       "tr": "Nâsıyetin kâzibetin hâtıeh.",
       "meal": "O yalancı, günahkâr perçeminden!",
       "ses": "096016"
      },
      {
       "ar": "فَلْيَدْعُ نَادِيَهُ",
       "tr": "Felyed'u nâdiyeh.",
       "meal": "Haydi, çağırsın meclisini.",
       "ses": "096017"
      },
      {
       "ar": "سَنَدْعُ الزَّبَانِيَةَ",
       "tr": "Sened'uzzebâniyeh.",
       "meal": "Biz de zebânîleri çağıracağız.",
       "ses": "096018"
      },
      {
       "ar": "كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ ۩",
       "tr": "Kellâ, lâ tütı'hü vescüd vakterib.",
       "meal": "Hayır! Ona boyun eğme; secde et ve Rabbine yaklaş.",
       "ses": "096019"
      }
     ],
     "tefsir": "İlk beş ayet, Hira mağarasında inen ilk vahiydir ve oku emriyle başlar; okumanın, yazmanın ve bilginin Allah'ın bir ikramı olduğunu öğretir. Devamı, kendini yeterli görüp azan ve namaz kılanı engellemeye kalkan kimseyi uyarır; rivayetlere göre bu kişi Ebû Cehil'dir. Sure, secde et ve yaklaş emriyle biter; çünkü kul Rabbine en çok secdede yakındır.",
     "akilda": "İlk emir: Oku! Son emir: Secde et ve yaklaş.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Bed'ü'l-vahy 3; Müslim, Salât 215."
    },
    {
     "id": "kadir",
     "tur": "sure",
     "no": 97,
     "ad": "Kadir Suresi",
     "kisaAd": "Kadir",
     "arAd": "القدر",
     "anlam": "Kadir Gecesi",
     "konu": "Bin aydan hayırlı gece",
     "yer": "Mekke",
     "ayetSayisi": 5,
     "satirlar": [
      {
       "ar": "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
       "tr": "İnnâ enzelnâhü fî leyletilkadr.",
       "meal": "Biz onu (Kur'an'ı) Kadir gecesinde indirdik.",
       "ses": "097001"
      },
      {
       "ar": "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ",
       "tr": "Ve mâ edrâke mâ leyletülkadr.",
       "meal": "Kadir gecesinin ne olduğunu sen nereden bileceksin?",
       "ses": "097002"
      },
      {
       "ar": "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
       "tr": "Leyletülkadri hayrun min elfi şehr.",
       "meal": "Kadir gecesi bin aydan daha hayırlıdır.",
       "ses": "097003"
      },
      {
       "ar": "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ",
       "tr": "Tenezzelülmelâiketü verrûhu fîhâ biizni rabbihim min külli emr.",
       "meal": "Melekler ve Rûh (Cebrâil), o gecede Rablerinin izniyle her iş için iner.",
       "ses": "097004"
      },
      {
       "ar": "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ",
       "tr": "Selâmün hiye hattâ matla'ilfecr.",
       "meal": "O gece, tan yeri ağarıncaya kadar esenliktir.",
       "ses": "097005"
      }
     ],
     "tefsir": "Kur'an'ın indirilmeye başlandığı geceyi anlatır. Bu tek gece, içinde Kadir gecesi bulunmayan bin aydan, yani seksen yılı aşkın bir ömürden daha hayırlıdır. Melekler ve Cebrâil yeryüzüne iner; gece, tan ağarıncaya kadar esenlikle doludur. Peygamberimiz bu geceyi Ramazan'ın son on gününde aramayı tavsiye etmiştir.",
     "akilda": "Bir gece, bin aydan hayırlı; değerini Kur'an'dan alır.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Fazlu Leyleti'l-kadr 3; Müslim, Sıyâm 219."
    },
    {
     "id": "beyyine",
     "tur": "sure",
     "no": 98,
     "ad": "Beyyine Suresi",
     "kisaAd": "Beyyine",
     "arAd": "البينة",
     "anlam": "Apaçık Delil",
     "konu": "Dinin özü ihlâstır",
     "yer": "Medine",
     "ayetSayisi": 8,
     "satirlar": [
      {
       "ar": "لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ",
       "tr": "Lem yekünillezîne keferû min ehlilkitâbi velmüşrikîne münfekkîne hattâ te'tiyehümülbeyyineh.",
       "meal": "Ehl-i kitaptan ve müşriklerden inkâr edenler, kendilerine apaçık delil gelinceye kadar inkârlarından ayrılacak değillerdi.",
       "ses": "098001"
      },
      {
       "ar": "رَسُولٌ مِنَ اللَّهِ يَتْلُو صُحُفًا مُطَهَّرَةً",
       "tr": "Rasûlün minallâhi yetlû suhufen mutahherah.",
       "meal": "O delil, Allah tarafından gönderilen ve tertemiz sayfaları okuyan bir elçidir.",
       "ses": "098002"
      },
      {
       "ar": "فِيهَا كُتُبٌ قَيِّمَةٌ",
       "tr": "Fîhâ kütübün kayyimeh.",
       "meal": "O sayfalarda dosdoğru hükümler vardır.",
       "ses": "098003"
      },
      {
       "ar": "وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِنْ بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ",
       "tr": "Ve mâ teferrekallezîne ûtülkitâbe illâ min ba'di mâ câethümülbeyyineh.",
       "meal": "Kendilerine kitap verilenler, ancak o apaçık delil geldikten sonra ayrılığa düştüler.",
       "ses": "098004"
      },
      {
       "ar": "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ",
       "tr": "Ve mâ ümirû illâ liya'büdullâhe muhlisîne lehüddîne hunefâe ve yukîmussalâte ve yü'tüzzekâte ve zâlike dînülkayyimeh.",
       "meal": "Oysa onlara yalnızca, dini Allah'a has kılarak ve hakka yönelerek O'na kulluk etmeleri, namazı kılmaları ve zekâtı vermeleri emredilmişti. İşte dosdoğru din budur.",
       "ses": "098005"
      },
      {
       "ar": "إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا ۚ أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ",
       "tr": "İnnellezîne keferû min ehlilkitâbi velmüşrikîne fî nâri cehenneme hâlidîne fîhâ, ülâike hüm şerrulberiyyeh.",
       "meal": "Ehl-i kitaptan ve müşriklerden inkâr edenler, içinde ebedî kalmak üzere cehennem ateşindedirler. İşte onlar yaratılmışların en kötüsüdür.",
       "ses": "098006"
      },
      {
       "ar": "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ",
       "tr": "İnnellezîne âmenû ve 'amilussâlihâti ülâike hüm hayrulberiyyeh.",
       "meal": "İman edip sâlih ameller işleyenlere gelince, işte onlar yaratılmışların en hayırlısıdır.",
       "ses": "098007"
      },
      {
       "ar": "جَزَاؤُهُمْ عِنْدَ رَبِّهِمْ جَنَّاتُ عَدْنٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا ۖ رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ ۚ ذَٰلِكَ لِمَنْ خَشِيَ رَبَّهُ",
       "tr": "Cezâühüm 'inde rabbihim cennâtü 'adnin tecrî min tahtihel'enhâru hâlidîne fîhâ ebedâ, radıyallâhü 'anhüm ve radû 'anh, zâlike limen haşiye rabbeh.",
       "meal": "Onların Rableri katındaki ödülü, içinden ırmaklar akan ve içinde ebedî kalacakları Adn cennetleridir. Allah onlardan razı olmuş, onlar da Allah'tan razı olmuşlardır. İşte bu, Rabbine saygı duyan kimse içindir.",
       "ses": "098008"
      }
     ],
     "tefsir": "Beyyine, apaçık delil demektir; bu delil, tertemiz sayfaları okuyan Peygamberimiz ve getirdiği Kur'an'dır. Sure dinin özünü tek ayette toplar: Allah'a içtenlikle kulluk etmek, namazı kılmak ve zekâtı vermek. İnsanlar bu çağrı karşısında ikiye ayrılır: inkâr edenler yaratılmışların en kötüsü, iman edip iyi işler yapanlar ise en hayırlısıdır.",
     "akilda": "Dinin özü ihlâstır: Allah onlardan razı, onlar da Allah'tan razı.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "zilzal",
     "tur": "sure",
     "no": 99,
     "ad": "Zilzâl Suresi",
     "kisaAd": "Zilzâl",
     "arAd": "الزلزلة",
     "anlam": "Sarsıntı",
     "konu": "Zerre kadar iyilik kaybolmaz",
     "yer": "Medine",
     "ayetSayisi": 8,
     "satirlar": [
      {
       "ar": "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا",
       "tr": "İzâ zülziletil'ardu zilzâlehâ.",
       "meal": "Yer, o dehşetli sarsıntısıyla sarsıldığı,",
       "ses": "099001"
      },
      {
       "ar": "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا",
       "tr": "Ve ahracetil'ardu eskâlehâ.",
       "meal": "Toprak, ağırlıklarını dışarı çıkardığı,",
       "ses": "099002"
      },
      {
       "ar": "وَقَالَ الْإِنْسَانُ مَا لَهَا",
       "tr": "Ve kâlel'insânü mâ lehâ.",
       "meal": "Ve insan \"Buna ne oluyor?\" dediği zaman,",
       "ses": "099003"
      },
      {
       "ar": "يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا",
       "tr": "Yevmeizin tühaddisü ahbârahâ.",
       "meal": "İşte o gün yer, bütün haberlerini anlatır;",
       "ses": "099004"
      },
      {
       "ar": "بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا",
       "tr": "Bienne rabbeke evhâ lehâ.",
       "meal": "Çünkü Rabbin ona öyle vahyetmiştir.",
       "ses": "099005"
      },
      {
       "ar": "يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ",
       "tr": "Yevmeizin yasdürunnâsü eştâten liyürav a'mâlehüm.",
       "meal": "O gün insanlar, yaptıkları kendilerine gösterilsin diye bölük bölük çıkarlar.",
       "ses": "099006"
      },
      {
       "ar": "فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
       "tr": "Femen ya'mel miskâle zerratin hayran yerah.",
       "meal": "Kim zerre kadar hayır işlemişse onu görür.",
       "ses": "099007"
      },
      {
       "ar": "وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ",
       "tr": "Ve men ya'mel miskâle zerratin şerran yerah.",
       "meal": "Kim de zerre kadar kötülük işlemişse onu görür.",
       "ses": "099008"
      }
     ],
     "tefsir": "Kıyamet günü yerin şiddetle sarsılacağını, içindekileri dışarı atacağını ve üzerinde yapılan her şeye şahitlik edeceğini haber verir. O gün hiçbir amel kaybolmaz: zerre kadar iyilik de zerre kadar kötülük de sahibinin önüne konur. Peygamberimiz son iki ayeti, benzersiz ve kapsamlı ayet olarak nitelemiştir.",
     "akilda": "Zerre kadar iyilik de zerre kadar kötülük de kaybolmaz.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Müsâkât 12; Müslim, Zekât 24."
    },
    {
     "id": "adiyat",
     "tur": "sure",
     "no": 100,
     "ad": "Âdiyât Suresi",
     "kisaAd": "Âdiyât",
     "arAd": "العاديات",
     "anlam": "Koşanlar",
     "konu": "İnsanın nankörlüğü",
     "yer": "Mekke",
     "ayetSayisi": 11,
     "satirlar": [
      {
       "ar": "وَالْعَادِيَاتِ ضَبْحًا",
       "tr": "Vel'âdiyâti dabhâ.",
       "meal": "Nefes nefese koşanlara,",
       "ses": "100001"
      },
      {
       "ar": "فَالْمُورِيَاتِ قَدْحًا",
       "tr": "Felmûriyâti kadhâ.",
       "meal": "Tırnaklarıyla kıvılcım saçanlara,",
       "ses": "100002"
      },
      {
       "ar": "فَالْمُغِيرَاتِ صُبْحًا",
       "tr": "Felmuğîrâti subhâ.",
       "meal": "Sabah vakti baskın yapanlara,",
       "ses": "100003"
      },
      {
       "ar": "فَأَثَرْنَ بِهِ نَقْعًا",
       "tr": "Feeserne bihî nak'â.",
       "meal": "Orada tozu dumana katanlara,",
       "ses": "100004"
      },
      {
       "ar": "فَوَسَطْنَ بِهِ جَمْعًا",
       "tr": "Fevesatne bihî cem'â.",
       "meal": "Ve bir topluluğun ortasına dalanlara andolsun ki,",
       "ses": "100005"
      },
      {
       "ar": "إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ",
       "tr": "İnnel'insâne lirabbihî lekenûd.",
       "meal": "İnsan, Rabbine karşı gerçekten çok nankördür.",
       "ses": "100006"
      },
      {
       "ar": "وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ",
       "tr": "Ve innehû 'alâ zâlike leşehîd.",
       "meal": "Buna kendisi de şahittir.",
       "ses": "100007"
      },
      {
       "ar": "وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ",
       "tr": "Ve innehû lihubbilhayri leşedîd.",
       "meal": "O, mal sevgisine de aşırı düşkündür.",
       "ses": "100008"
      },
      {
       "ar": "۞ أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ",
       "tr": "Efelâ ya'lemü izâ bu'sira mâ filkubûr.",
       "meal": "Bilmez mi ki, kabirlerdekiler dışarı çıkarıldığı,",
       "ses": "100009"
      },
      {
       "ar": "وَحُصِّلَ مَا فِي الصُّدُورِ",
       "tr": "Ve hussıle mâ fissudûr.",
       "meal": "Ve göğüslerdekiler ortaya döküldüğü zaman,",
       "ses": "100010"
      },
      {
       "ar": "إِنَّ رَبَّهُمْ بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ",
       "tr": "İnne rabbehüm bihim yevmeizin lehabîr.",
       "meal": "İşte o gün Rableri onların her hâlinden haberdardır.",
       "ses": "100011"
      }
     ],
     "tefsir": "Sure, sahibi için nefes nefese koşan atlara yeminle başlar. At, kendisini besleyen sahibine böylesine bağlıyken; insan, kendisini yaratıp sayısız nimet veren Rabbine karşı nankörlük eder ve mala aşırı düşkündür. Sure, kabirlerin açılıp kalplerdeki gizlilerin ortaya döküleceği günü hatırlatarak uyarır.",
     "akilda": "At sahibine vefalı; ya insan Rabbine?",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "karia",
     "tur": "sure",
     "no": 101,
     "ad": "Kâria Suresi",
     "kisaAd": "Kâria",
     "arAd": "القارعة",
     "anlam": "Büyük Felaket",
     "konu": "Amellerin tartılacağı gün",
     "yer": "Mekke",
     "ayetSayisi": 11,
     "satirlar": [
      {
       "ar": "الْقَارِعَةُ",
       "tr": "Elkâri'ah.",
       "meal": "Kapıları döven o büyük felaket!",
       "ses": "101001"
      },
      {
       "ar": "مَا الْقَارِعَةُ",
       "tr": "Melkâri'ah.",
       "meal": "Nedir o büyük felaket?",
       "ses": "101002"
      },
      {
       "ar": "وَمَا أَدْرَاكَ مَا الْقَارِعَةُ",
       "tr": "Ve mâ edrâke melkâri'ah.",
       "meal": "O büyük felaketin ne olduğunu sen nereden bileceksin?",
       "ses": "101003"
      },
      {
       "ar": "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ",
       "tr": "Yevme yekûnünnâsü kelferâşilmebsûs.",
       "meal": "O gün insanlar, etrafa saçılmış pervaneler gibi olur.",
       "ses": "101004"
      },
      {
       "ar": "وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ",
       "tr": "Ve tekûnülcibâlü kel'ihnilmenfûş.",
       "meal": "Dağlar da atılmış renkli yün gibi olur.",
       "ses": "101005"
      },
      {
       "ar": "فَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ",
       "tr": "Feemmâ men sekulet mevâzînüh.",
       "meal": "Kimin tartıları ağır gelirse,",
       "ses": "101006"
      },
      {
       "ar": "فَهُوَ فِي عِيشَةٍ رَاضِيَةٍ",
       "tr": "Fehüve fî 'îşetin râdıyeh.",
       "meal": "O, hoşnut olacağı bir hayat içindedir.",
       "ses": "101007"
      },
      {
       "ar": "وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ",
       "tr": "Ve emmâ men haffet mevâzînüh.",
       "meal": "Kimin de tartıları hafif gelirse,",
       "ses": "101008"
      },
      {
       "ar": "فَأُمُّهُ هَاوِيَةٌ",
       "tr": "Feümmühû hâviyeh.",
       "meal": "Onun varacağı yer Hâviye'dir.",
       "ses": "101009"
      },
      {
       "ar": "وَمَا أَدْرَاكَ مَا هِيَهْ",
       "tr": "Ve mâ edrâke mâ hiyeh.",
       "meal": "Onun ne olduğunu sen nereden bileceksin?",
       "ses": "101010"
      },
      {
       "ar": "نَارٌ حَامِيَةٌ",
       "tr": "Nârun hâmiyeh.",
       "meal": "O, kızgın bir ateştir.",
       "ses": "101011"
      }
     ],
     "tefsir": "Kâria, kalpleri yerinden oynatan kıyametin adıdır. O gün insanlar ateşin çevresinde uçuşan pervaneler gibi dağılır, dağlar atılmış yün gibi savrulur. Sonucu terazi belirler: iyilikleri ağır gelen hoşnut bir hayata kavuşur, hafif gelen ise kızgın ateşe varır.",
     "akilda": "O gün terazide ağır gelen, iyiliklerindir.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "tekasur",
     "tur": "sure",
     "no": 102,
     "ad": "Tekâsür Suresi",
     "kisaAd": "Tekâsür",
     "arAd": "التكاثر",
     "anlam": "Çoklukla Övünme",
     "konu": "Her nimetin hesabı var",
     "yer": "Mekke",
     "ayetSayisi": 8,
     "satirlar": [
      {
       "ar": "أَلْهَاكُمُ التَّكَاثُرُ",
       "tr": "Elhâkümüttekâsür.",
       "meal": "Çoklukla övünmek sizi oyaladı;",
       "ses": "102001"
      },
      {
       "ar": "حَتَّىٰ زُرْتُمُ الْمَقَابِرَ",
       "tr": "Hattâ zürtümülmekâbir.",
       "meal": "Kabirlere varıncaya kadar.",
       "ses": "102002"
      },
      {
       "ar": "كَلَّا سَوْفَ تَعْلَمُونَ",
       "tr": "Kellâ sevfe ta'lemûn.",
       "meal": "Hayır! Yakında bileceksiniz.",
       "ses": "102003"
      },
      {
       "ar": "ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ",
       "tr": "Sümme kellâ sevfe ta'lemûn.",
       "meal": "Yine hayır! Yakında bileceksiniz.",
       "ses": "102004"
      },
      {
       "ar": "كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ",
       "tr": "Kellâ lev ta'lemûne 'ilmelyakîn.",
       "meal": "Hayır! Keşke kesin bir bilgiyle bilseydiniz.",
       "ses": "102005"
      },
      {
       "ar": "لَتَرَوُنَّ الْجَحِيمَ",
       "tr": "Leteravünnelcahîm.",
       "meal": "Andolsun, cehennemi mutlaka göreceksiniz.",
       "ses": "102006"
      },
      {
       "ar": "ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ",
       "tr": "Sümme leteravünnehâ 'aynelyakîn.",
       "meal": "Sonra onu gözünüzle, kesin olarak göreceksiniz.",
       "ses": "102007"
      },
      {
       "ar": "ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ",
       "tr": "Sümme letüs'elünne yevmeizin 'aninna'îm.",
       "meal": "Sonra o gün, size verilen her nimetten mutlaka sorguya çekileceksiniz.",
       "ses": "102008"
      }
     ],
     "tefsir": "Mal, evlat ve sayı çokluğuyla övünme yarışı, insanı ölüm kapıyı çalana kadar asıl amacından alıkoyar. Sure peş peşe uyarır: gerçeği yakında bileceksiniz. Son ayet hesabı hatırlatır; sağlık, boş vakit, güvenlik, yenilen ve içilen her şey sorulacak nimetlerdendir.",
     "akilda": "Çokluk yarışı kabre kadar sürer; sonra her nimetin hesabı sorulur.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "asr",
     "tur": "sure",
     "no": 103,
     "ad": "Asr Suresi",
     "kisaAd": "Asr",
     "arAd": "العصر",
     "anlam": "Zaman",
     "konu": "Kurtuluşun dört şartı",
     "yer": "Mekke",
     "ayetSayisi": 3,
     "satirlar": [
      {
       "ar": "وَالْعَصْرِ",
       "tr": "Vel'asr.",
       "meal": "Zamana andolsun ki,",
       "ses": "103001"
      },
      {
       "ar": "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
       "tr": "İnnel'insâne lefî husr.",
       "meal": "İnsan gerçekten ziyandadır.",
       "ses": "103002"
      },
      {
       "ar": "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
       "tr": "İllellezîne âmenû ve 'amilussâlihâti ve tevâsav bilhakkı ve tevâsav bissabr.",
       "meal": "Ancak iman edip sâlih ameller işleyenler, birbirine hakkı tavsiye edenler ve birbirine sabrı tavsiye edenler başka.",
       "ses": "103003"
      }
     ],
     "tefsir": "Üç kısa ayette kurtuluşun yolunu özetler. Zaman insanın sermayesidir ve her an erimektedir; bu yüzden insan ziyandadır. Kurtulanlar dört şeyi bir araya getirenlerdir: iman, sâlih amel, hakkı tavsiye ve sabrı tavsiye. İmam Şâfiî, insanlar yalnızca bu sure üzerinde düşünselerdi onlara yeterdi, demiştir.",
     "akilda": "Zaman eriyen bir sermayedir: iman et, iyilik yap, hakkı ve sabrı tavsiye et.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "humeze",
     "tur": "sure",
     "no": 104,
     "ad": "Hümeze Suresi",
     "kisaAd": "Hümeze",
     "arAd": "الهمزة",
     "anlam": "Arkadan Çekiştiren",
     "konu": "Dil ve mal sınavı",
     "yer": "Mekke",
     "ayetSayisi": 9,
     "satirlar": [
      {
       "ar": "وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ",
       "tr": "Veylün likülli hümezetin lümezeh.",
       "meal": "İnsanları arkadan çekiştiren, kaş göz işaretiyle alay eden herkesin vay hâline!",
       "ses": "104001"
      },
      {
       "ar": "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ",
       "tr": "Ellezî ceme'a mâlen ve 'addedeh.",
       "meal": "O ki mal toplar ve onu sayıp durur.",
       "ses": "104002"
      },
      {
       "ar": "يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ",
       "tr": "Yahsebü enne mâlehû ahledeh.",
       "meal": "Malının kendisini ebedî yaşatacağını sanır.",
       "ses": "104003"
      },
      {
       "ar": "كَلَّا ۖ لَيُنْبَذَنَّ فِي الْحُطَمَةِ",
       "tr": "Kellâ leyünbezenne filhutameh.",
       "meal": "Hayır! O, mutlaka Hutame'ye atılacaktır.",
       "ses": "104004"
      },
      {
       "ar": "وَمَا أَدْرَاكَ مَا الْحُطَمَةُ",
       "tr": "Ve mâ edrâke melhutameh.",
       "meal": "Hutame'nin ne olduğunu sen nereden bileceksin?",
       "ses": "104005"
      },
      {
       "ar": "نَارُ اللَّهِ الْمُوقَدَةُ",
       "tr": "Nârullâhilmûkadeh.",
       "meal": "O, Allah'ın tutuşturulmuş ateşidir;",
       "ses": "104006"
      },
      {
       "ar": "الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ",
       "tr": "Elletî tettali'u 'alel'ef'ideh.",
       "meal": "Yüreklere kadar işleyen ateş.",
       "ses": "104007"
      },
      {
       "ar": "إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ",
       "tr": "İnnehâ 'aleyhim mü'sadeh.",
       "meal": "O ateş onların üzerine kapatılacaktır;",
       "ses": "104008"
      },
      {
       "ar": "فِي عَمَدٍ مُمَدَّدَةٍ",
       "tr": "Fî 'amedin mümeddedeh.",
       "meal": "Uzatılmış direkler arasında.",
       "ses": "104009"
      }
     ],
     "tefsir": "İnsanları arkalarından çekiştiren, kaş göz işaretiyle küçümseyen ve malını sayıp durarak ona güvenen kimseyi kınar. Mal kimseyi ölümsüz kılmaz; bu ahlâkın sonu, kalplere kadar işleyen Hutame ateşidir. Sure, dili ve malı doğru kullanmaya çağırır.",
     "akilda": "Dilinle kırma, malınla övünme.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "fil",
     "tur": "sure",
     "no": 105,
     "ad": "Fîl Suresi",
     "kisaAd": "Fîl",
     "arAd": "الفيل",
     "anlam": "Fil",
     "konu": "Kâbe'nin korunması",
     "yer": "Mekke",
     "ayetSayisi": 5,
     "satirlar": [
      {
       "ar": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
       "tr": "Elem tera keyfe fe'ale rabbüke biashâbilfîl.",
       "meal": "Rabbinin fil sahiplerine ne yaptığını görmedin mi?",
       "ses": "105001"
      },
      {
       "ar": "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
       "tr": "Elem yec'al keydehüm fî tadlîl.",
       "meal": "Onların tuzaklarını boşa çıkarmadı mı?",
       "ses": "105002"
      },
      {
       "ar": "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
       "tr": "Ve ersele 'aleyhim tayran ebâbîl.",
       "meal": "Üzerlerine sürü sürü kuşlar gönderdi.",
       "ses": "105003"
      },
      {
       "ar": "تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ",
       "tr": "Termîhim bihicâratin min siccîl.",
       "meal": "O kuşlar onlara pişmiş çamurdan taşlar atıyordu.",
       "ses": "105004"
      },
      {
       "ar": "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
       "tr": "Fece'alehüm ke'asfin me'kûl.",
       "meal": "Sonunda onları yenilmiş ekin yaprağı gibi yaptı.",
       "ses": "105005"
      }
     ],
     "tefsir": "Peygamberimizin doğduğu yıl, Yemen valisi Ebrehe fillerle güçlendirilmiş ordusuyla Kâbe'yi yıkmaya geldi. Allah, sürü sürü kuşlarla bu orduyu helâk etti ve evini korudu. Sure, Allah'ın gücü karşısında en büyük orduların bile çaresiz kaldığını gösterir.",
     "akilda": "Allah evini korur; koca filler küçük kuşlara yenildi.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "kureys",
     "tur": "sure",
     "no": 106,
     "ad": "Kureyş Suresi",
     "kisaAd": "Kureyş",
     "arAd": "قريش",
     "anlam": "Kureyş Kabilesi",
     "konu": "Nimetin şükrü kulluktur",
     "yer": "Mekke",
     "ayetSayisi": 4,
     "satirlar": [
      {
       "ar": "لِإِيلَافِ قُرَيْشٍ",
       "tr": "Liîlâfi kurayş.",
       "meal": "Kureyş'e sağlanan güven ve kolaylık için,",
       "ses": "106001"
      },
      {
       "ar": "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ",
       "tr": "Îlâfihim rıhleteşşitâi vessayf.",
       "meal": "Kış ve yaz yolculuklarında onlara sağlanan güven ve kolaylık için,",
       "ses": "106002"
      },
      {
       "ar": "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ",
       "tr": "Felya'büdû rabbe hâzelbeyt.",
       "meal": "Şu evin (Kâbe'nin) Rabbine kulluk etsinler.",
       "ses": "106003"
      },
      {
       "ar": "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
       "tr": "Ellezî at'amehüm min cû'in ve âmenehüm min havf.",
       "meal": "O, kendilerini açlıktan doyuran ve korkudan emin kılandır.",
       "ses": "106004"
      }
     ],
     "tefsir": "Fîl suresinin devamı gibidir. Kâbe sayesinde Kureyş kabilesi saygı görür; kışın Yemen'e, yazın Şam'a güven içinde ticaret yolculuğu yapardı. Allah onlara iki büyük nimetini hatırlatır: açlıktan doyurmak ve korkudan emin kılmak. Bu nimetlerin şükrü, Kâbe'nin Rabbine kulluk etmektir.",
     "akilda": "Tok ve güvendeysen şükret: Kâbe'nin Rabbine kulluk et.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "maun",
     "tur": "sure",
     "no": 107,
     "ad": "Mâûn Suresi",
     "kisaAd": "Mâûn",
     "arAd": "الماعون",
     "anlam": "Küçük Yardım",
     "konu": "Namaz ve iyilik ayrılmaz",
     "yer": "Mekke",
     "ayetSayisi": 7,
     "satirlar": [
      {
       "ar": "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
       "tr": "Eraeytellezî yükezzibü biddîn.",
       "meal": "Dini yalanlayanı gördün mü?",
       "ses": "107001"
      },
      {
       "ar": "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
       "tr": "Fezâlikellezî yedu'ulyetîm.",
       "meal": "İşte o, yetimi itip kakar;",
       "ses": "107002"
      },
      {
       "ar": "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ",
       "tr": "Ve lâ yehuddu 'alâ ta'âmilmiskîn.",
       "meal": "Yoksulu doyurmaya teşvik etmez.",
       "ses": "107003"
      },
      {
       "ar": "فَوَيْلٌ لِلْمُصَلِّينَ",
       "tr": "Feveylün lilmusallîn.",
       "meal": "Vay hâline o namaz kılanların ki,",
       "ses": "107004"
      },
      {
       "ar": "الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ",
       "tr": "Ellezîne hüm 'an salâtihim sâhûn.",
       "meal": "Onlar namazlarını ciddiye almazlar;",
       "ses": "107005"
      },
      {
       "ar": "الَّذِينَ هُمْ يُرَاءُونَ",
       "tr": "Ellezîne hüm yürâûn.",
       "meal": "Onlar gösteriş yaparlar,",
       "ses": "107006"
      },
      {
       "ar": "وَيَمْنَعُونَ الْمَاعُونَ",
       "tr": "Ve yemne'ûnelmâ'ûn.",
       "meal": "Ve en küçük yardımı bile esirgerler.",
       "ses": "107007"
      }
     ],
     "tefsir": "Dini yalanlamanın davranıştaki izlerini gösterir: yetimi itip kakmak ve yoksulu doyurmaya ön ayak olmamak. Ardından namazını ciddiye almayan, gösteriş için kılan ve en küçük yardımı bile esirgeyenleri uyarır. Gerçek dindarlık, Allah'a içten kulluk ile insanlara iyiliği birleştirir.",
     "akilda": "Namaz ve iyilik birbirinden ayrılmaz.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    },
    {
     "id": "kevser",
     "tur": "sure",
     "no": 108,
     "ad": "Kevser Suresi",
     "kisaAd": "Kevser",
     "arAd": "الكوثر",
     "anlam": "Bol Hayır",
     "konu": "Nimete şükür: namaz ve kurban",
     "yer": "Mekke",
     "ayetSayisi": 3,
     "satirlar": [
      {
       "ar": "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
       "tr": "İnnâ a'taynâkelkevser.",
       "meal": "Şüphesiz biz sana Kevser'i verdik.",
       "ses": "108001"
      },
      {
       "ar": "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
       "tr": "Fesalli lirabbike venhar.",
       "meal": "Öyleyse Rabbin için namaz kıl ve kurban kes.",
       "ses": "108002"
      },
      {
       "ar": "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
       "tr": "İnne şânieke hüvel'ebter.",
       "meal": "Asıl soyu kesik olan, sana buğzedenin kendisidir.",
       "ses": "108003"
      }
     ],
     "tefsir": "Kur'an'ın en kısa suresidir. Oğulları küçük yaşta vefat edince müşrikler Peygamberimize soyu kesik dediler; Allah ise ona Kevser'i, yani bitmeyen hayrı ve cennetteki Kevser ırmağını verdiğini bildirdi. Bu nimetin şükrü namaz ve kurbandır. Asıl adı sanı unutulanlar, ona düşmanlık edenler olmuştur.",
     "akilda": "Allah verince bol verir; şükrü namaz ve kurbandır.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Müslim, Salât 53."
    },
    {
     "id": "kafirun",
     "tur": "sure",
     "no": 109,
     "ad": "Kâfirûn Suresi",
     "kisaAd": "Kâfirûn",
     "arAd": "الكافرون",
     "anlam": "İnkârcılar",
     "konu": "İnançta pazarlık olmaz",
     "yer": "Mekke",
     "ayetSayisi": 6,
     "satirlar": [
      {
       "ar": "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
       "tr": "Kul yâ eyyühelkâfirûn.",
       "meal": "De ki: Ey inkârcılar!",
       "ses": "109001"
      },
      {
       "ar": "لَا أَعْبُدُ مَا تَعْبُدُونَ",
       "tr": "Lâ a'büdü mâ ta'büdûn.",
       "meal": "Ben sizin taptıklarınıza tapmam.",
       "ses": "109002"
      },
      {
       "ar": "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
       "tr": "Ve lâ entüm 'âbidûne mâ a'büd.",
       "meal": "Siz de benim kulluk ettiğime kulluk edecek değilsiniz.",
       "ses": "109003"
      },
      {
       "ar": "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
       "tr": "Ve lâ ene 'âbidün mâ 'abedtüm.",
       "meal": "Ben sizin taptıklarınıza tapacak değilim.",
       "ses": "109004"
      },
      {
       "ar": "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ",
       "tr": "Ve lâ entüm 'âbidûne mâ a'büd.",
       "meal": "Siz de benim kulluk ettiğime kulluk edecek değilsiniz.",
       "ses": "109005"
      },
      {
       "ar": "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
       "tr": "Leküm dînüküm ve liye dîn.",
       "meal": "Sizin dininiz size, benim dinim banadır.",
       "ses": "109006"
      }
     ],
     "tefsir": "Mekkeli müşrikler Peygamberimize, bir yıl sen bizim putlarımıza tap, bir yıl da biz senin Rabbine tapalım, diye uzlaşma teklif ettiler; bu sure teklifi kesin olarak reddetti. İnançta pazarlık ve karışım olmaz; ama zorlama da yoktur: herkesin dini kendisinedir. Peygamberimiz bu sureyi ve İhlâs'ı sabah namazının sünnetinde okurdu.",
     "akilda": "İnançta pazarlık olmaz: sizin dininiz size, benim dinim bana.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Müslim, Müsâfirîn 98."
    },
    {
     "id": "nasr",
     "tur": "sure",
     "no": 110,
     "ad": "Nasr Suresi",
     "kisaAd": "Nasr",
     "arAd": "النصر",
     "anlam": "Yardım",
     "konu": "Zaferde tevazu",
     "yer": "Medine",
     "ayetSayisi": 3,
     "satirlar": [
      {
       "ar": "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
       "tr": "İzâ câe nasrullâhi velfeth.",
       "meal": "Allah'ın yardımı ve fetih geldiği,",
       "ses": "110001"
      },
      {
       "ar": "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
       "tr": "Ve raeytennâse yedhulûne fî dînillâhi efvâcâ.",
       "meal": "Ve insanların bölük bölük Allah'ın dinine girdiğini gördüğün zaman,",
       "ses": "110002"
      },
      {
       "ar": "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
       "tr": "Fesebbih bihamdi rabbike vestağfirh, innehû kâne tevvâbâ.",
       "meal": "Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. Şüphesiz O, tövbeleri çok kabul edendir.",
       "ses": "110003"
      }
     ],
     "tefsir": "Mekke'nin fethini ve insanların bölük bölük İslâm'a girişini müjdeler; bütün olarak inen son suredir. Zafer anında istenen şey gurur değil; tesbih, hamd ve istiğfardır. İbn Abbas bu sureden, Peygamberimizin vefatının yaklaştığını anlamıştır.",
     "akilda": "Başarı gelince övünme; hamdet ve bağışlanma dile.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Tefsîr (Nasr) 3-4; Müslim, Tefsîr 21."
    },
    {
     "id": "tebbet",
     "tur": "sure",
     "no": 111,
     "ad": "Tebbet Suresi",
     "kisaAd": "Tebbet",
     "arAd": "المسد",
     "anlam": "Kurusun",
     "konu": "Mal ve soy kurtarmaz",
     "yer": "Mekke",
     "ayetSayisi": 5,
     "satirlar": [
      {
       "ar": "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
       "tr": "Tebbet yedâ ebî lehebin ve tebb.",
       "meal": "Ebû Leheb'in elleri kurusun; kurudu da!",
       "ses": "111001"
      },
      {
       "ar": "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ",
       "tr": "Mâ ağnâ 'anhü mâlühû ve mâ keseb.",
       "meal": "Ne malı ne de kazandıkları ona fayda verdi.",
       "ses": "111002"
      },
      {
       "ar": "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ",
       "tr": "Seyaslâ nâran zâte leheb.",
       "meal": "O, alevli bir ateşe girecektir.",
       "ses": "111003"
      },
      {
       "ar": "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ",
       "tr": "Vemraetüh, hammâletelhatab.",
       "meal": "Karısı da; o odun taşıyıcı,",
       "ses": "111004"
      },
      {
       "ar": "فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ",
       "tr": "Fî cîdihâ hablün min mesed.",
       "meal": "Boynunda bükülmüş bir ip olduğu hâlde.",
       "ses": "111005"
      }
     ],
     "tefsir": "Peygamberimiz Safâ tepesinde akrabalarını İslâm'a çağırınca amcası Ebû Leheb ona hakaret etti; sure bunun üzerine indi. Ne malı ne de soyu Ebû Leheb'i kurtardı; Peygamberimize eziyet etmekte ona ortak olan karısı da aynı sona uğradı. Sure, hakka düşmanlıkta malın ve akrabalığın fayda vermediğini öğretir. Mesed suresi olarak da anılır.",
     "akilda": "Mal da soy da kurtarmaz; kurtaran imandır.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Tefsîr (Tebbet) 1."
    },
    {
     "id": "ihlas",
     "tur": "sure",
     "no": 112,
     "ad": "İhlâs Suresi",
     "kisaAd": "İhlâs",
     "arAd": "الإخلاص",
     "anlam": "Samimiyet",
     "konu": "Dört ayette tevhid",
     "yer": "Mekke",
     "ayetSayisi": 4,
     "satirlar": [
      {
       "ar": "قُلْ هُوَ اللَّهُ أَحَدٌ",
       "tr": "Kul hüvallâhü ehad.",
       "meal": "De ki: O Allah birdir.",
       "ses": "112001"
      },
      {
       "ar": "اللَّهُ الصَّمَدُ",
       "tr": "Allâhüssamed.",
       "meal": "Allah Samed'dir; her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir.",
       "ses": "112002"
      },
      {
       "ar": "لَمْ يَلِدْ وَلَمْ يُولَدْ",
       "tr": "Lem yelid ve lem yûled.",
       "meal": "O doğurmamıştır ve doğurulmamıştır.",
       "ses": "112003"
      },
      {
       "ar": "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
       "tr": "Ve lem yekün lehû küfüven ehad.",
       "meal": "Hiçbir şey O'na denk değildir.",
       "ses": "112004"
      }
     ],
     "tefsir": "Müşrikler Peygamberimizden Rabbini tanıtmasını isteyince indi. Dört kısa ayette tevhidi özetler: Allah birdir, hiçbir şeye muhtaç değildir, doğurmamış ve doğurulmamıştır, hiçbir şey O'na denk değildir. Peygamberimiz bu surenin Kur'an'ın üçte birine denk olduğunu bildirmiştir.",
     "akilda": "Allah bir, eşsiz ve benzersiz: dört ayette tevhid.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Fezâilü'l-Kur'ân 13."
    },
    {
     "id": "felak",
     "tur": "sure",
     "no": 113,
     "ad": "Felak Suresi",
     "kisaAd": "Felak",
     "arAd": "الفلق",
     "anlam": "Sabah Aydınlığı",
     "konu": "Dış kötülüklerden sığınma",
     "yer": "Mekke",
     "ayetSayisi": 5,
     "satirlar": [
      {
       "ar": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
       "tr": "Kul e'ûzü birabbilfelak.",
       "meal": "De ki: Sabahın Rabbine sığınırım;",
       "ses": "113001"
      },
      {
       "ar": "مِنْ شَرِّ مَا خَلَقَ",
       "tr": "Min şerri mâ halak.",
       "meal": "Yarattığı şeylerin şerrinden,",
       "ses": "113002"
      },
      {
       "ar": "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
       "tr": "Ve min şerri ğâsikın izâ vekab.",
       "meal": "Karanlığı çöktüğü zaman gecenin şerrinden,",
       "ses": "113003"
      },
      {
       "ar": "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
       "tr": "Ve min şerrinneffâsâti fil'ukad.",
       "meal": "Düğümlere üfleyenlerin şerrinden,",
       "ses": "113004"
      },
      {
       "ar": "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
       "tr": "Ve min şerri hâsidin izâ hased.",
       "meal": "Ve haset ettiği zaman hasetçinin şerrinden.",
       "ses": "113005"
      }
     ],
     "tefsir": "Nâs suresiyle birlikte Muavvizeteyn, yani koruyucu iki sure diye anılır. Dışarıdan gelen kötülüklerden; yaratılmışların şerrinden, gecenin karanlığından, büyü yapanlardan ve hasetçiden sabahın Rabbine sığınmayı öğretir. Peygamberimiz her gece yatmadan önce İhlâs, Felak ve Nâs surelerini okurdu.",
     "akilda": "Karanlıktan korkma; sabahın Rabbine sığın.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm; Buhârî, Fezâilü'l-Kur'ân 14."
    },
    {
     "id": "nas",
     "tur": "sure",
     "no": 114,
     "ad": "Nâs Suresi",
     "kisaAd": "Nâs",
     "arAd": "الناس",
     "anlam": "İnsanlar",
     "konu": "Vesveseden sığınma",
     "yer": "Mekke",
     "ayetSayisi": 6,
     "satirlar": [
      {
       "ar": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
       "tr": "Kul e'ûzü birabbinnâs.",
       "meal": "De ki: İnsanların Rabbine sığınırım;",
       "ses": "114001"
      },
      {
       "ar": "مَلِكِ النَّاسِ",
       "tr": "Melikinnâs.",
       "meal": "İnsanların hükümdarına,",
       "ses": "114002"
      },
      {
       "ar": "إِلَٰهِ النَّاسِ",
       "tr": "İlâhinnâs.",
       "meal": "İnsanların ilâhına;",
       "ses": "114003"
      },
      {
       "ar": "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
       "tr": "Min şerrilvesvâsilhannâs.",
       "meal": "O sinsi vesvesecinin şerrinden.",
       "ses": "114004"
      },
      {
       "ar": "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
       "tr": "Ellezî yüvesvisü fî sudûrinnâs.",
       "meal": "O ki insanların göğüslerine vesvese verir;",
       "ses": "114005"
      },
      {
       "ar": "مِنَ الْجِنَّةِ وَالنَّاسِ",
       "tr": "Minelcinneti vennâs.",
       "meal": "Cinlerden de olur, insanlardan da.",
       "ses": "114006"
      }
     ],
     "tefsir": "Kur'an'ın son suresidir. İnsanın içine fısıldayan ve Allah anılınca sinip geri çekilen vesveseciden; insanların Rabbine, hükümdarına ve ilâhına sığınmayı öğretir. Vesvese cinlerden de gelebilir, insanlardan da; çaresi Allah'ı anmak ve O'na sığınmaktır.",
     "akilda": "Vesvese fısıldar; Allah'ı anınca siner.",
     "kaynak": "Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı); Elmalılı M. Hamdi Yazır, Hak Dini Kur'an Dili; İbn Kesîr, Tefsîrü'l-Kur'âni'l-Azîm."
    }
   ]
  },
  {
   "id": "dualar",
   "ad": "Namaz Duaları",
   "aciklama": "Namazdaki sırasıyla dualar",
   "ogeler": [
    {
     "id": "ezan-duasi",
     "tur": "dua",
     "ad": "Ezan Duası",
     "konu": "Ezandan sonra",
     "nezaman": "Ezan bittikten sonra okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ",
       "tr": "Allâhümme rabbe hâzihidda'vetittâmmeti vessalâtilkâimeh,",
       "meal": "Allah'ım! Ey bu eksiksiz çağrının ve kılınacak namazın Rabbi!"
      },
      {
       "ar": "آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ",
       "tr": "Âti Muhammedenilvesîlete velfadîleh,",
       "meal": "Muhammed'e vesileyi ve fazileti ver."
      },
      {
       "ar": "وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
       "tr": "Veb'ashü makâmen mahmûdenillezî ve'adteh.",
       "meal": "Onu, kendisine vaat ettiğin övülmüş makama ulaştır."
      }
     ],
     "tefsir": "Peygamberimiz, ezanı dinledikten sonra bu duayı okuyan kimseye kıyamet günü şefaatinin hak olacağını bildirmiştir. Vesile, cennette yüksek bir derecedir; Makam-ı Mahmûd ise büyük şefaat makamıdır.",
     "akilda": "Ezanı dinle, duasını et; şefaate talip ol.",
     "kaynak": "Buhârî, Ezân 8."
    },
    {
     "id": "subhaneke",
     "tur": "dua",
     "ad": "Sübhâneke",
     "konu": "Namazın açılış duası",
     "nezaman": "Namaza başlarken, iftitah tekbirinden hemen sonra okunur.",
     "not": "Cenaze namazında \"ve teâlâ ceddük\" sözünden sonra \"ve celle senâük\" (senin övgün yücedir) eklenir; diğer namazlarda eklenmez.",
     "satirlar": [
      {
       "ar": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ",
       "tr": "Sübhânekellâhümme ve bihamdik,",
       "meal": "Allah'ım! Seni her türlü eksiklikten uzak tutar, sana hamd ederim."
      },
      {
       "ar": "وَتَبَارَكَ اسْمُكَ",
       "tr": "Ve tebârekesmük,",
       "meal": "Senin adın mübarektir."
      },
      {
       "ar": "وَتَعَالَى جَدُّكَ",
       "tr": "Ve teâlâ ceddük,",
       "meal": "Senin şânın yücedir."
      },
      {
       "ar": "وَلَا إِلَهَ غَيْرُكَ",
       "tr": "Ve lâ ilâhe ğayruk.",
       "meal": "Senden başka ilâh yoktur."
      }
     ],
     "tefsir": "Namazın açılış duasıdır. Kul, daha ilk sözünde Rabbini eksikliklerden uzak tutar, O'na hamd eder ve O'ndan başka ilâh olmadığını ilan eder. Böylece namaza tevhid ile başlanır.",
     "akilda": "Namazın ilk sözü: Seni tesbih ederim, senden başka ilâh yoktur.",
     "kaynak": "Ebû Dâvûd, Salât 121-122; Tirmizî, Salât 65; İbn Mâce, İkāme 1."
    },
    {
     "id": "euzu-besmele",
     "tur": "dua",
     "ad": "Eûzü Besmele",
     "konu": "Okumaya başlarken",
     "nezaman": "Sübhâneke'den sonra, Fâtiha'ya başlamadan önce okunur. Sonraki rekâtlarda yalnız besmele çekilir.",
     "satirlar": [
      {
       "ar": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
       "tr": "Eûzü billâhi mineşşeytânirracîm.",
       "meal": "Kovulmuş şeytandan Allah'a sığınırım."
      },
      {
       "ar": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
       "tr": "Bismillâhirrahmânirrahîm.",
       "meal": "Rahmân ve Rahîm olan Allah'ın adıyla."
      }
     ],
     "tefsir": "Kur'an okumaya başlarken şeytandan Allah'a sığınmak Kur'an'ın emridir. Besmele ile de her işe Allah'ın adıyla başlanır; kul, işini O'nun rahmetine emanet eder.",
     "akilda": "Önce Allah'a sığın, sonra O'nun adıyla başla.",
     "kaynak": "Nahl 16/98; Neml 27/30."
    },
    {
     "id": "ruku-tesbihi",
     "tur": "dua",
     "ad": "Rükû Tesbihi",
     "konu": "Rükûda",
     "nezaman": "Rükûda en az üç kez söylenir.",
     "satirlar": [
      {
       "ar": "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
       "tr": "Sübhâne rabbiyel'azîm.",
       "meal": "Yüce Rabbimi her türlü eksiklikten uzak tutarım."
      }
     ],
     "tefsir": "Vâkıa suresindeki, Rabbini azîm ismiyle tesbih et, ayeti inince Peygamberimiz bunu rükûda söylemeyi öğretmiştir. Bedeniyle eğilen kul, diliyle de Rabbinin büyüklüğünü ilan eder.",
     "akilda": "Eğilirken söyle: Büyük olan yalnız Rabbimdir.",
     "kaynak": "Vâkıa 56/74; Ebû Dâvûd, Salât 151; İbn Mâce, İkāme 18; Tirmizî, Salât 79."
    },
    {
     "id": "rukudan-kalkarken",
     "tur": "dua",
     "ad": "Rükûdan Kalkarken",
     "konu": "Tesmî ve tahmîd",
     "nezaman": "Rükûdan doğrulurken ilk söz, doğrulunca ikinci söz söylenir. Cemaatle namazda ilkini imam, ikincisini cemaat söyler.",
     "satirlar": [
      {
       "ar": "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ",
       "tr": "Semi'allâhü limen hamideh.",
       "meal": "Allah, kendisine hamd edeni işitir."
      },
      {
       "ar": "رَبَّنَا لَكَ الْحَمْدُ",
       "tr": "Rabbenâ lekelhamd.",
       "meal": "Rabbimiz! Hamd yalnız sanadır."
      }
     ],
     "tefsir": "Rükûdan kalkan kul, Allah'ın hamd edeni işittiğini haber verir ve hemen ardından hamd eder. Peygamberimiz, imam bu sözü söylediğinde cemaatin hamd ile karşılık vermesini öğretmiştir.",
     "akilda": "Allah hamd edeni işitir; öyleyse hamdet.",
     "kaynak": "Buhârî, Ezân 124-125."
    },
    {
     "id": "secde-tesbihi",
     "tur": "dua",
     "ad": "Secde Tesbihi",
     "konu": "Secdede",
     "nezaman": "Her secdede en az üç kez söylenir.",
     "satirlar": [
      {
       "ar": "سُبْحَانَ رَبِّيَ الْأَعْلَى",
       "tr": "Sübhâne rabbiyel'a'lâ.",
       "meal": "En yüce Rabbimi her türlü eksiklikten uzak tutarım."
      }
     ],
     "tefsir": "A'lâ suresindeki, yüce Rabbinin adını tesbih et, ayeti inince Peygamberimiz bunu secdede söylemeyi öğretmiştir. Alnını yere koyan kul en alçak hâlindeyken Rabbinin en yüce olduğunu söyler; kulun Rabbine en yakın olduğu an da secde anıdır.",
     "akilda": "Alnım yerde, Rabbim en yücede.",
     "kaynak": "A'lâ 87/1; Ebû Dâvûd, Salât 151; İbn Mâce, İkāme 18; Müslim, Salât 215."
    },
    {
     "id": "tahiyyat",
     "tur": "dua",
     "ad": "Tahiyyat",
     "konu": "Oturuşlarda",
     "nezaman": "Namazdaki her oturuşta okunur.",
     "satirlar": [
      {
       "ar": "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ",
       "tr": "Ettehiyyâtü lillâhi vessalevâtü vettayyibât.",
       "meal": "Bütün saygılar, dualar ve güzel sözler Allah'a aittir."
      },
      {
       "ar": "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
       "tr": "Esselâmü aleyke eyyühennebiyyü ve rahmetullâhi ve berekâtüh.",
       "meal": "Ey Peygamber! Selâm, Allah'ın rahmeti ve bereketleri senin üzerine olsun."
      },
      {
       "ar": "السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ",
       "tr": "Esselâmü aleynâ ve alâ ibâdillâhissâlihîn.",
       "meal": "Selâm bize ve Allah'ın sâlih kullarına olsun."
      },
      {
       "ar": "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ",
       "tr": "Eşhedü en lâ ilâhe illallâh,",
       "meal": "Şahitlik ederim ki Allah'tan başka ilâh yoktur."
      },
      {
       "ar": "وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
       "tr": "Ve eşhedü enne Muhammeden abdühû ve rasûlüh.",
       "meal": "Yine şahitlik ederim ki Muhammed O'nun kulu ve elçisidir."
      }
     ],
     "tefsir": "Peygamberimiz bu duayı Abdullah b. Mes'ûd'a, elini avuçlarının arasına alarak, Kur'an'dan bir sure öğretir gibi öğretmiştir. Önce Allah'a saygı sunulur, sonra Peygamberimize ve bütün sâlih kullara selâm verilir, en sonunda kelime-i şehadetle iman tazelenir.",
     "akilda": "Önce Allah'a saygı, sonra Peygamber'e ve sâlihlere selâm, sonunda şehadet.",
     "kaynak": "Buhârî, Ezân 148, 150; İsti'zân 28; Müslim, Salât 55."
    },
    {
     "id": "salli",
     "tur": "dua",
     "ad": "Allâhümme Salli",
     "konu": "Son oturuşta",
     "nezaman": "Son oturuşta Tahiyyat'tan sonra okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
       "tr": "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed,",
       "meal": "Allah'ım! Muhammed'e ve Muhammed'in ailesine rahmet eyle;"
      },
      {
       "ar": "كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
       "tr": "Kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm,",
       "meal": "İbrâhim'e ve İbrâhim'in ailesine rahmet ettiğin gibi."
      },
      {
       "ar": "إِنَّكَ حَمِيدٌ مَجِيدٌ",
       "tr": "İnneke hamîdün mecîd.",
       "meal": "Şüphesiz sen övülmeye lâyıksın, şânı yüce olansın."
      }
     ],
     "tefsir": "Allah, müminlere Peygamberimize salât ve selâm getirmeyi emreder. Sahâbîler, sana nasıl salât getirelim, diye sorunca Peygamberimiz bu duayı öğretmiştir. Dua, Peygamberimizi atası Hazreti İbrâhim'le birlikte anar.",
     "akilda": "Peygamberimize dua, İbrâhim'e verilen rahmeti örnek göstererek yapılır.",
     "kaynak": "Ahzâb 33/56; Buhârî, Enbiyâ 10; Deavât 32-33; Müslim, Salât 65-66."
    },
    {
     "id": "barik",
     "tur": "dua",
     "ad": "Allâhümme Bârik",
     "konu": "Son oturuşta",
     "nezaman": "Son oturuşta Allâhümme Salli'den sonra okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
       "tr": "Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed,",
       "meal": "Allah'ım! Muhammed'e ve Muhammed'in ailesine bereket ver;"
      },
      {
       "ar": "كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
       "tr": "Kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm,",
       "meal": "İbrâhim'e ve İbrâhim'in ailesine bereket verdiğin gibi."
      },
      {
       "ar": "إِنَّكَ حَمِيدٌ مَجِيدٌ",
       "tr": "İnneke hamîdün mecîd.",
       "meal": "Şüphesiz sen övülmeye lâyıksın, şânı yüce olansın."
      }
     ],
     "tefsir": "Salli duasının devamıdır. Bereket, hayrın artması ve kalıcı olması demektir; kul, Peygamberimizin ve ailesinin hayrının kesintisiz sürmesini diler.",
     "akilda": "Salli rahmet ister, Bârik bereket ister.",
     "kaynak": "Buhârî, Enbiyâ 10; Deavât 32-33; Müslim, Salât 65-66."
    },
    {
     "id": "rabbena-atina",
     "tur": "dua",
     "ad": "Rabbenâ Âtinâ",
     "konu": "Selâmdan önce",
     "nezaman": "Son oturuşta Salli ve Bârik dualarından sonra okunur.",
     "satirlar": [
      {
       "ar": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
       "tr": "Rabbenâ âtinâ fiddünyâ haseneten,",
       "meal": "Rabbimiz! Bize dünyada iyilik ver,"
      },
      {
       "ar": "وَفِي الْآخِرَةِ حَسَنَةً",
       "tr": "Ve fil'âhırati haseneten,",
       "meal": "Âhirette de iyilik ver,"
      },
      {
       "ar": "وَقِنَا عَذَابَ النَّارِ",
       "tr": "Ve kınâ azâbennâr.",
       "meal": "Ve bizi ateş azabından koru."
      }
     ],
     "tefsir": "Bakara suresinin iki yüz birinci ayetinde geçen duadır. Dünya ve âhiret iyiliğini tek cümlede isteyen kapsamlı bir duadır; Enes b. Mâlik, Peygamberimizin en çok yaptığı duanın bu olduğunu bildirir.",
     "akilda": "Tek cümlede iki dünya: burada iyilik, orada iyilik, ateşten korunma.",
     "kaynak": "Bakara 2/201; Buhârî, Deavât 55; Müslim, Zikir 26."
    },
    {
     "id": "rabbenagfirli",
     "tur": "dua",
     "ad": "Rabbenağfirlî",
     "konu": "Selâmdan önce",
     "nezaman": "Son oturuşta Rabbenâ Âtinâ'dan sonra, selâm vermeden önce okunur.",
     "satirlar": [
      {
       "ar": "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ",
       "tr": "Rabbenağfir lî ve livâlideyye,",
       "meal": "Rabbimiz! Beni, anamı ve babamı bağışla;"
      },
      {
       "ar": "وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
       "tr": "Ve lilmü'minîne yevme yekûmülhisâb.",
       "meal": "Hesabın görüleceği gün bütün müminleri de bağışla."
      }
     ],
     "tefsir": "İbrâhîm suresinin kırk birinci ayetidir ve Hazreti İbrâhim'in duasıdır. Kul önce kendisi, sonra anne babası, sonra bütün müminler için bağışlanma diler; dua böylece halka halka genişler.",
     "akilda": "Önce kendin, sonra annen baban, sonra bütün müminler.",
     "kaynak": "İbrâhîm 14/41."
    },
    {
     "id": "kunut-1",
     "tur": "dua",
     "ad": "Kunut Duası 1",
     "konu": "Vitir namazında",
     "nezaman": "Vitir namazının üçüncü rekâtında, Fâtiha ve sureden sonra tekbir alınarak okunur.",
     "not": "Din İşleri Yüksek Kurulu'na göre, ezberleyene kadar bu duanın yerine Rabbenâ Âtinâ duası okunabilir.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنَسْتَهْدِيكَ",
       "tr": "Allâhümme innâ neste'înüke ve nestağfiruke ve nestehdîk,",
       "meal": "Allah'ım! Senden yardım isteriz, senden bağışlanma dileriz, senden hidayet isteriz."
      },
      {
       "ar": "وَنُؤْمِنُ بِكَ وَنَتُوبُ إِلَيْكَ وَنَتَوَكَّلُ عَلَيْكَ",
       "tr": "Ve nü'minü bike ve netûbü ileyk, ve netevekkelü aleyk,",
       "meal": "Sana iman ederiz, sana tövbe ederiz, sana güveniriz."
      },
      {
       "ar": "وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ",
       "tr": "Ve nüsnî aleykelhayra küllehû,",
       "meal": "Seni bütün hayırlarla överiz."
      },
      {
       "ar": "نَشْكُرُكَ وَلَا نَكْفُرُكَ",
       "tr": "Neşküruke ve lâ nekfüruk,",
       "meal": "Sana şükrederiz, nankörlük etmeyiz."
      },
      {
       "ar": "وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ",
       "tr": "Ve nahle'u ve netrükü men yefcüruk.",
       "meal": "Sana isyan edeni bırakır, ondan uzak dururuz."
      }
     ],
     "tefsir": "Vitir namazında okunan iki duanın ilkidir. Kul, Rabbinden yardım, bağışlanma ve hidayet ister; imanını, tövbesini ve tevekkülünü yeniler, şükredeceğine söz verir.",
     "akilda": "Üç istek: yardım, bağışlanma, hidayet. Üç söz: iman, tövbe, tevekkül.",
     "kaynak": "İbn Ebî Şeybe, el-Musannef, III, 245; Tahâvî, Şerhu Me'âni'l-âsâr, I, 249."
    },
    {
     "id": "kunut-2",
     "tur": "dua",
     "ad": "Kunut Duası 2",
     "konu": "Vitir namazında",
     "nezaman": "Vitir namazında birinci kunut duasının hemen ardından okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ إِيَّاكَ نَعْبُدُ",
       "tr": "Allâhümme iyyâke na'büdü,",
       "meal": "Allah'ım! Yalnız sana kulluk ederiz."
      },
      {
       "ar": "وَلَكَ نُصَلِّي وَنَسْجُدُ",
       "tr": "Ve leke nüsallî ve nescüdü,",
       "meal": "Yalnız senin için namaz kılar, yalnız sana secde ederiz."
      },
      {
       "ar": "وَإِلَيْكَ نَسْعَى وَنَحْفِدُ",
       "tr": "Ve ileyke nes'â ve nahfidü,",
       "meal": "Sana koşar, sana yöneliriz."
      },
      {
       "ar": "نَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ",
       "tr": "Nercû rahmeteke ve nahşâ azâbek,",
       "meal": "Rahmetini umar, azabından korkarız."
      },
      {
       "ar": "إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
       "tr": "İnne azâbeke bilküffâri mülhık.",
       "meal": "Şüphesiz senin azabın inkârcılara ulaşacaktır."
      }
     ],
     "tefsir": "Birinci kunut duasının devamıdır. Kulluğun yalnız Allah'a yapıldığını ilan eder; müminin kalbindeki iki duyguyu, yani rahmeti ummayı ve azaptan korkmayı bir arada dile getirir.",
     "akilda": "Kulluk yalnız sana; kalpte hem umut hem korku.",
     "kaynak": "İbn Ebî Şeybe, el-Musannef, III, 245; Tahâvî, Şerhu Me'âni'l-âsâr, I, 249."
    }
   ]
  },
  {
   "id": "zikirler",
   "ad": "Zikirler",
   "aciklama": "Namaz sonrası ve günlük zikirler",
   "ogeler": [
    {
     "id": "namaz-sonrasi",
     "tur": "zikir",
     "ad": "Namaz Sonrası İstiğfar ve Selâm Duası",
     "konu": "Selâmdan hemen sonra",
     "nezaman": "Farz namazın selâmından hemen sonra okunur; istiğfar üç kez söylenir.",
     "satirlar": [
      {
       "ar": "أَسْتَغْفِرُ اللَّهَ",
       "tr": "Estağfirullâh.",
       "meal": "Allah'tan bağışlanma dilerim."
      },
      {
       "ar": "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",
       "tr": "Allâhümme entesselâmü ve minkesselâm,",
       "meal": "Allah'ım! Selâm sensin, esenlik de ancak sendendir."
      },
      {
       "ar": "تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
       "tr": "Tebârekte yâ zelcelâli vel'ikrâm.",
       "meal": "Ey celâl ve ikram sahibi! Sen ne yücesin."
      }
     ],
     "sayac": [
      {
       "ad": "Estağfirullâh",
       "hedef": 3
      }
     ],
     "tefsir": "Sevbân'ın bildirdiğine göre Peygamberimiz namazı bitirince üç kez istiğfar eder, sonra bu duayı okurdu. Namazın hemen ardından istiğfar, ibadetteki eksiklerin affını dilemektir. Selâm ise Allah'ın güzel isimlerindendir; esenlik yalnız O'ndan gelir.",
     "akilda": "Namaz biter bitmez: üç istiğfar, bir selâm duası.",
     "kaynak": "Müslim, Mesâcid 135-136."
    },
    {
     "id": "ayetel-kursi",
     "tur": "zikir",
     "ad": "Âyetü'l-Kürsî",
     "konu": "Bakara suresi, 255. ayet",
     "nezaman": "Her farz namazın ardından ve gece yatmadan önce okunur.",
     "ses": "002255",
     "satirlar": [
      {
       "ar": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ",
       "tr": "Allâhü lâ ilâhe illâ hüvelhayyülkayyûm.",
       "meal": "Allah, kendisinden başka ilâh olmayandır; diridir, her şeyi ayakta tutandır."
      },
      {
       "ar": "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ",
       "tr": "Lâ te'huzühû sinetün ve lâ nevm.",
       "meal": "O'nu ne uyuklama tutar ne de uyku."
      },
      {
       "ar": "لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ",
       "tr": "Lehû mâ fissemâvâti ve mâ fil'ard.",
       "meal": "Göklerde ve yerde ne varsa hepsi O'nundur."
      },
      {
       "ar": "مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ",
       "tr": "Men zellezî yeşfe'u 'indehû illâ biiznih.",
       "meal": "O'nun izni olmadan katında kim şefaat edebilir?"
      },
      {
       "ar": "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ",
       "tr": "Ya'lemü mâ beyne eydîhim ve mâ halfehüm.",
       "meal": "O, kullarının önlerindekini de arkalarındakini de bilir."
      },
      {
       "ar": "وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ",
       "tr": "Ve lâ yuhîtûne bişey'in min 'ilmihî illâ bimâ şâe.",
       "meal": "Onlar O'nun ilminden, O'nun dilediği kadarından başka hiçbir şeyi kavrayamazlar."
      },
      {
       "ar": "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ",
       "tr": "Vesi'a kürsiyyühüssemâvâti vel'ard.",
       "meal": "O'nun kürsüsü gökleri ve yeri kaplamıştır."
      },
      {
       "ar": "وَلَا يَئُودُهُ حِفْظُهُمَا ۚ",
       "tr": "Ve lâ yeûdühû hıfzuhümâ.",
       "meal": "Onları koruyup gözetmek O'na ağır gelmez."
      },
      {
       "ar": "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
       "tr": "Ve hüvel'aliyyül'azîm.",
       "meal": "O, pek yücedir, pek büyüktür."
      }
     ],
     "tefsir": "Bakara suresinin iki yüz elli beşinci ayetidir; Peygamberimiz onu Kur'an'ın en büyük ayeti olarak nitelemiştir. Allah'ın diri, her şeyi ayakta tutan, uyumayan, ilmi ve hükümranlığı her şeyi kuşatan Rab olduğunu anlatır. Her farz namazın ardından okunması tavsiye edilmiştir.",
     "akilda": "Kur'an'ın en büyük ayeti: Allah diridir, uyumaz, her şeyi bilir ve korur.",
     "kaynak": "Bakara 2/255; Müslim, Müsâfirîn 258; Buhârî, Vekâle 10; Nesâî, es-Sünenü'l-kübrâ, no: 9848."
    },
    {
     "id": "tesbihat",
     "tur": "zikir",
     "ad": "Namaz Tesbihatı",
     "konu": "Otuz üçer kez",
     "nezaman": "Her namazın ardından, Âyetü'l-Kürsî'den sonra otuz üçer kez söylenir.",
     "satirlar": [
      {
       "ar": "سُبْحَانَ اللَّهِ",
       "tr": "Sübhânallâh.",
       "meal": "Allah'ı her türlü eksiklikten uzak tutarım."
      },
      {
       "ar": "الْحَمْدُ لِلَّهِ",
       "tr": "Elhamdülillâh.",
       "meal": "Hamd Allah'a mahsustur."
      },
      {
       "ar": "اللَّهُ أَكْبَرُ",
       "tr": "Allâhü ekber.",
       "meal": "Allah en büyüktür."
      }
     ],
     "sayac": [
      {
       "ad": "Sübhânallâh",
       "hedef": 33
      },
      {
       "ad": "Elhamdülillâh",
       "hedef": 33
      },
      {
       "ad": "Allâhü ekber",
       "hedef": 33
      }
     ],
     "tefsir": "Peygamberimiz, her namazın ardından otuz üçer kez tesbih, hamd ve tekbir getirip yüzüncüde kelime-i tevhidi söyleyen kimsenin günahlarının, deniz köpüğü kadar çok olsa bile bağışlanacağını müjdelemiştir.",
     "akilda": "Otuz üç tesbih, otuz üç hamd, otuz üç tekbir; yüzüncüsü tevhid.",
     "kaynak": "Müslim, Mesâcid 144-146."
    },
    {
     "id": "tehlil",
     "tur": "zikir",
     "ad": "Kelime-i Tevhid",
     "konu": "Tesbihatı yüze tamamlar",
     "nezaman": "Tesbihatın sonunda bir kez söylenir; gün içinde de çokça tekrarlanır.",
     "satirlar": [
      {
       "ar": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
       "tr": "Lâ ilâhe illallâhü vahdehû lâ şerîke leh,",
       "meal": "Allah'tan başka ilâh yoktur; O tektir, ortağı yoktur."
      },
      {
       "ar": "لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ",
       "tr": "Lehülmülkü ve lehülhamdü,",
       "meal": "Mülk O'nundur, hamd O'nadır."
      },
      {
       "ar": "وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
       "tr": "Ve hüve alâ külli şey'in kadîr.",
       "meal": "O'nun her şeye gücü yeter."
      }
     ],
     "sayac": [
      {
       "ad": "Kelime-i Tevhid",
       "hedef": 100
      }
     ],
     "tefsir": "Tesbihatı yüze tamamlayan sözdür. Peygamberimiz, bu zikri günde yüz kez söyleyen kimsenin büyük sevap kazanacağını ve o gün akşama kadar şeytandan korunacağını bildirmiştir.",
     "akilda": "Mülk de hamd de O'nun; ortağı yok, gücü her şeye yeter.",
     "kaynak": "Müslim, Mesâcid 146; Buhârî, Bed'ü'l-halk 11; Deavât 64; Müslim, Zikir 28."
    },
    {
     "id": "einni",
     "tur": "zikir",
     "ad": "Allâhümme Eınnî",
     "konu": "Namazın sonunda",
     "nezaman": "Her namazın sonunda okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
       "tr": "Allâhümme e'ınnî alâ zikrike ve şükrike ve hüsni ibâdetik.",
       "meal": "Allah'ım! Seni anmak, sana şükretmek ve sana güzelce kulluk etmek için bana yardım et."
      }
     ],
     "tefsir": "Peygamberimiz Muâz b. Cebel'in elini tutmuş, onu sevdiğini söylemiş ve her namazın sonunda bu duayı bırakmamasını tavsiye etmiştir. Kul, ibadeti bile ancak Allah'ın yardımıyla yapabileceğini bilir.",
     "akilda": "Zikir, şükür ve güzel kulluk; üçü de Allah'ın yardımıyla olur.",
     "kaynak": "Ebû Dâvûd, Vitr 26; Nesâî, Sehv 60."
    },
    {
     "id": "seyyidul-istigfar",
     "tur": "zikir",
     "ad": "Seyyidü'l-İstiğfâr",
     "konu": "İstiğfarın efendisi",
     "nezaman": "Sabah ve akşam okunur.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ",
       "tr": "Allâhümme ente rabbî lâ ilâhe illâ ent,",
       "meal": "Allah'ım! Sen benim Rabbimsin, senden başka ilâh yoktur."
      },
      {
       "ar": "خَلَقْتَنِي وَأَنَا عَبْدُكَ",
       "tr": "Halaktenî ve ene abdük,",
       "meal": "Beni sen yarattın, ben senin kulunum."
      },
      {
       "ar": "وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
       "tr": "Ve ene alâ ahdike ve va'dike mesteta't,",
       "meal": "Gücüm yettiğince sana verdiğim söz üzereyim."
      },
      {
       "ar": "أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ",
       "tr": "Eûzü bike min şerri mâ sana't,",
       "meal": "Yaptıklarımın kötülüğünden sana sığınırım."
      },
      {
       "ar": "أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي",
       "tr": "Ebûü leke bini'metike aleyye ve ebûü leke bizenbî,",
       "meal": "Bana verdiğin nimeti itiraf ederim, günahımı da itiraf ederim."
      },
      {
       "ar": "فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
       "tr": "Fağfir lî, feinnehû lâ yağfiruzzünûbe illâ ent.",
       "meal": "Beni bağışla; çünkü günahları senden başkası bağışlayamaz."
      }
     ],
     "tefsir": "İstiğfarın efendisi demektir. Peygamberimiz, bu duayı inanarak gündüz okuyup akşamdan önce, gece okuyup sabahtan önce ölen kimsenin cennetlik olduğunu bildirmiştir. Dua; tevhidi, kulluğu, nimeti itirafı ve bağışlanma dileğini bir arada toplar.",
     "akilda": "Rabbim sensin, kulun benim; nimet senden, kusur benden: bağışla.",
     "kaynak": "Buhârî, Deavât 2, 16."
    },
    {
     "id": "iki-kelime",
     "tur": "zikir",
     "ad": "Dile Hafif İki Söz",
     "konu": "Terazide ağır",
     "nezaman": "Gün içinde her zaman söylenir.",
     "satirlar": [
      {
       "ar": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
       "tr": "Sübhânallâhi ve bihamdih,",
       "meal": "Allah'ı hamd ederek tesbih ederim."
      },
      {
       "ar": "سُبْحَانَ اللَّهِ الْعَظِيمِ",
       "tr": "Sübhânallâhil'azîm.",
       "meal": "Yüce Allah'ı tesbih ederim."
      }
     ],
     "sayac": [
      {
       "ad": "Sübhânallâhi ve bihamdih",
       "hedef": 100
      }
     ],
     "tefsir": "Peygamberimiz bu iki sözü şöyle tanıtır: dile hafif, terazide ağır ve Rahmân'a sevimli. İmam Buhârî, Sahîh adlı eserini bu hadisle bitirmiştir. Günde yüz kez sübhânallâhi ve bihamdihî diyen kimsenin günahlarının bağışlanacağı da müjdelenmiştir.",
     "akilda": "Dile hafif, terazide ağır, Rahmân'a sevimli iki söz.",
     "kaynak": "Buhârî, Deavât 65; Tevhîd 58; Müslim, Zikir 28, 31."
    },
    {
     "id": "havkale",
     "tur": "zikir",
     "ad": "Lâ Havle",
     "konu": "Cennet hazinesi",
     "nezaman": "Zorlandığında ve gün içinde her zaman söylenir.",
     "satirlar": [
      {
       "ar": "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
       "tr": "Lâ havle ve lâ kuvvete illâ billâh.",
       "meal": "Güç ve kuvvet ancak Allah'ın yardımıyladır."
      }
     ],
     "sayac": [
      {
       "ad": "Lâ havle",
       "hedef": 33
      }
     ],
     "tefsir": "Peygamberimiz bu sözü, cennet hazinelerinden bir hazine olarak nitelemiştir. İnsan, bir işi başarmanın da kötülükten uzak durmanın da ancak Allah'ın yardımıyla mümkün olduğunu itiraf eder.",
     "akilda": "Gücüm yetmez; güç veren Allah'tır.",
     "kaynak": "Buhârî, Deavât 50; Müslim, Zikir 44-45."
    },
    {
     "id": "salavat",
     "tur": "zikir",
     "ad": "Salavat",
     "konu": "Peygamberimize dua",
     "nezaman": "Peygamberimizin adı anıldığında ve gün içinde her zaman söylenir.",
     "satirlar": [
      {
       "ar": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
       "tr": "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed.",
       "meal": "Allah'ım! Muhammed'e ve ailesine rahmet eyle."
      }
     ],
     "sayac": [
      {
       "ad": "Salavat",
       "hedef": 33
      }
     ],
     "tefsir": "Allah ve melekleri Peygamber'e salât eder; müminlere de ona salât ve selâm getirmeleri emredilmiştir. Peygamberimiz, kendisine bir kez salât getiren kimseye Allah'ın on kez rahmet edeceğini bildirmiştir.",
     "akilda": "Bir salavat, on rahmet.",
     "kaynak": "Ahzâb 33/56; Müslim, Salât 70."
    }
   ]
  }
 ]
};
