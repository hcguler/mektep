// ============================================
// Web Apps registry
// --------------------------------------------
// Yeni bir statik uygulama yayınlamak için:
//   1. Uygulamayı bu klasöre koy  (ör. apps/yeni-uygulama.html  ya da  apps/yeni-uygulama/index.html)
//   2. Aşağıdaki listeye bir kayıt ekle. Ana ekran (apps/index.html) kartı otomatik oluşturur.
//   3. Uygulamanın dosyalarını apps/sw.js içindeki ONBELLEK listesine ekle, sayfasına
//      manifest bağlantısı ve pwa.js'i ekle (bkz. apps/CLAUDE.md, PWA bölümü).
//   4. Yayından önce: node tools/pwa-surum.mjs  → kullanıcılar "Yeni sürüm hazır" penceresini görür.
//
// To publish another static app: drop it into this folder and add one entry below.
//
// Alanlar / fields:
//   id        benzersiz kısa ad
//   href      apps/ klasörüne göre yol
//   icon      kart ikonu (emoji)  ·  ya da iconSvg / iconBg / iconColor ile özel bir SVG ikon
//   deco      (isteğe bağlı) kartta süzülen küçük emojiler
//   colors    kart görselinin iki renkli geçişi
//   short     ana ekran simgesinin altındaki kısa ad (uygulama olarak yüklenen ana ekran)
//   langs     uygulamanın desteklediği diller, ör. ['TR'] ya da ['TR', 'EN']
//   soon      (isteğe bağlı) true ise kart "Yakında" olarak gösterilir, tıklanamaz; href ve features verilmez
//   plan      (soon kayıtlarında) yapılmadan önce okunacak çalışma planı, depo köküne göre (docs/planlar/…)
//   name / tagline / description / features   → { tr, en }
// ============================================
window.HCG_APPS = [
    {
        id: 'namaz',
        short: 'Namaz',
        href: 'namaz.html',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round" aria-hidden="true"><path d="M40 14 47.6 21.6H58.4V32.4L66 40l-7.6 7.6V58.4H47.6L40 66l-7.6-7.6H21.6V47.6L14 40l7.6-7.6V21.6H32.4Z"/><circle cx="40" cy="40" r="7"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#1d5a47', '#0a1f19'],
        langs: ['TR'],
        name: {
            tr: 'Namaz Yolculuğu',
            en: 'Namaz Yolculuğu'
        },
        tagline: {
            tr: 'Adım adım namaz rehberi',
            en: 'A step-by-step guide to prayer'
        },
        description: {
            tr: "Namazda ne yapıyoruz, ne söylüyoruz ve neden? Her adımı Kur'an'dan, Peygamberimizin (s.a.v.) sözlerinden ve âlimlerimizin açıklamalarından öğrenelim.",
            en: "What do we do and say in prayer, and why? Let's learn every step through the Qur'an, the sayings of our Prophet (pbuh) and the explanations of our scholars."
        },
        features: {
            tr: ['11 durakta namaz', 'Sesli anlatım', 'Nafile namazlar', 'Rekât çizelgesi', 'Çocuk ve yetişkin teması'],
            en: ['Prayer in 11 steps', 'Audio narration', 'Voluntary prayers', 'Daily rakat chart', 'Kids and adult themes']
        }
    },
    {
        id: 'ezberler',
        short: 'Ezberler',
        href: 'ezberler/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 24v36"/><path d="M40 24c-5-4-12-5-20-4v34c8-1 15 0 20 4"/><path d="M40 24c5-4 12-5 20-4v34c-8-1-15 0-20 4"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#1f5a62', '#0a1c1f'],
        langs: ['TR'],
        name: {
            tr: 'Ezberler',
            en: 'Ezberler'
        },
        tagline: {
            tr: 'Sureler, Namaz Duaları ve Zikirler',
            en: 'Surahs, Prayer Duas and Dhikr'
        },
        description: {
            tr: "Fâtiha ile Duhâ'dan Nâs'a kısa sureler, namaz duaları ve zikirler. Arapçası, okunuşu, anlamı ve akılda kalan kısa tefsiriyle; Suûd eş-Şüreym kıraatinden ayet ayet dinleyerek ezberleyin.",
            en: "Short surahs from al-Fatiha and ad-Duha to an-Nas, prayer duas and dhikr. With Arabic text, transliteration, meaning and a short tafsir; memorise verse by verse with Saud ash-Shuraym's recitation."
        },
        features: {
            tr: ['23 kısa sure', 'Namaz duaları ve zikirler', 'Şüreym kıraatiyle dinleme', 'Zikir sayacı', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['23 short surahs', 'Prayer duas and dhikr', 'Recitation by ash-Shuraym', 'Dhikr counter', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'kavram-haritasi',
        short: 'Kavramlar',
        href: 'kavram/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="40" cy="40" r="8"/><circle cx="18" cy="21" r="6"/><circle cx="62" cy="21" r="6"/><circle cx="18" cy="59" r="6"/><circle cx="62" cy="59" r="6"/><path d="M34 34.5 22.5 25M46 34.5 57.5 25M34 45.5 22.5 55M46 45.5 57.5 55"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#4a3d6e', '#141022'],
        langs: ['TR'],
        name: {
            tr: "İslam'da Kavram Haritası",
            en: "İslam'da Kavram Haritası"
        },
        tagline: {
            tr: 'Helal, haram, mubah, müstehab…',
            en: 'Halal, haram, mubah, mustahab…'
        },
        description: {
            tr: 'Dinî hükümleri bildiren temel kavramlar; âlimlerin üzerinde birleştiği tanımları, kaynak ve delilleri ve günlük hayattan en sık karşılaşılan örnekleriyle.',
            en: 'The core terms behind religious rulings, with the definitions scholars agree on, their sources and evidence, and the everyday examples met most often.'
        },
        features: {
            tr: ['19 kavram', 'Hüküm terazisi', 'Ayet ve hadis delilleri', 'Günlük hayattan örnekler', 'Kendini dene', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['19 concepts', 'Scale of rulings', 'Verses and hadith as evidence', 'Everyday examples', 'Self-test', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'davranis-modeli',
        short: 'Davranışlar',
        href: 'davranis/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="40" cy="40" r="25"/><path d="M49 31 44.5 44.5 31 49l4.5-13.5z"/><path d="M40 15v5M40 60v5M15 40h5M60 40h5"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#6e4a26', '#1f1409'],
        langs: ['TR'],
        name: {
            tr: "Kur'an'dan Davranış Modeli",
            en: "Kur'an'dan Davranış Modeli"
        },
        tagline: {
            tr: 'Herkes için, günün yirmi dört saatinde',
            en: 'For everyone, around the clock'
        },
        description: {
            tr: "Bir Müslümanın gün boyu karşılaştığı durumlarda nasıl davranacağını ayetlerle anlatan rehber: doğruluk, sabır, öfkeye hâkim olmak, kıskanmamak… Temelden ayrıntıya, keşfederek öğrenilir.",
            en: "A guide to how a Muslim should act in the situations of an ordinary day, grounded in verses of the Qur'an: honesty, patience, restraining anger, freedom from envy… Learned step by step, from the basics to the details."
        },
        features: {
            tr: ['72 davranış, ayetleriyle', 'Günün 24 saati', 'Yedi halka modeli', 'Ne yapardın?', 'Günlük muhasebe', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['72 behaviours with verses', 'Around the clock', 'Seven-circle model', 'What would you do?', 'Daily self-review', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'esma-ul-husna',
        short: 'Esmâ',
        href: 'esma/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="40" cy="40" r="25" stroke-width="5" stroke-dasharray="0 8.73"/><path d="M40 29 43.2 36.8 51 40 43.2 43.2 40 51 36.8 43.2 29 40 36.8 36.8Z"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#5c4a1c', '#1a1408'],
        langs: ['TR'],
        name: {
            tr: "Esmâ-ül Hüsnâ",
            en: "Esmâ-ül Hüsnâ"
        },
        tagline: {
            tr: "Allah'ın güzel isimleri",
            en: "The Beautiful Names of Allah"
        },
        description: {
            tr: "Doksan dokuz ismin her biri; Arapçası, anlamı, Kur'an'da geçtiği ayetler ve bu ismin günlük hayata yansımasıyla. İsimler kart kart keşfedilir ve ezberlenir.",
            en: "Each of the ninety-nine names with its Arabic, meaning, the verses it appears in and how it is reflected in daily life. Discover and memorise them card by card."
        },
        features: {
            tr: ['99 isim', 'Arapça, okunuş ve anlam', 'Kur’an’da geçtiği ayet', 'Ezber kartları', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['99 names', 'Arabic, transliteration and meaning', 'Qur’anic verse for each', 'Flashcards', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'peygamberler',
        short: 'Peygamberler',
        href: 'peygamberler/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 62c9 0 10-12 19-14s12 6 20-1 5-17 9-23"/><circle cx="16" cy="62" r="4.5"/><circle cx="35" cy="48" r="4.5"/><circle cx="55" cy="47" r="4.5"/><circle cx="64" cy="24" r="4.5"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#2c566a', '#0a1820'],
        langs: ['TR'],
        name: {
            tr: "Peygamberler Yolculuğu",
            en: "Peygamberler Yolculuğu"
        },
        tagline: {
            tr: "Kur'an'da adı geçen yirmi beş peygamber",
            en: "The twenty-five prophets named in the Qur'an"
        },
        description: {
            tr: "Hz. Âdem'den Peygamberimize yirmi beş durak: her peygamberin Kur'an'daki kıssası, kavmi, hayatından olaylar ve bıraktığı ders, her biri ayetiyle. Ana kaynak Kur'an'dır.",
            en: "Twenty-five stops from Adam to our Prophet: each prophet's story in the Qur'an, his people, events from his life and the lesson he left, each with its verse. The Qur'an is the main source."
        },
        features: {
            tr: ['25 peygamber', 'Kur’an’dan olaylar ve ayetler', 'Kur’an’daki aile bağları', 'Bil bakalım', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['25 prophets', 'Events and verses from the Qur’an', 'Family ties in the Qur’an', 'Quiz', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'siyer',
        short: 'Siyer',
        href: 'siyer/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M26 14v52"/><circle cx="26" cy="22" r="5"/><circle cx="26" cy="40" r="5"/><circle cx="26" cy="58" r="5"/><path d="M37 22h20M37 40h26M37 58h16"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#6a3a2c', '#1e0f0a'],
        langs: ['TR'],
        name: {
            tr: "Siyer Çizelgesi",
            en: "Siyer Çizelgesi"
        },
        tagline: {
            tr: "Peygamberimizin hayatı yıl yıl",
            en: "The Prophet's life, year by year"
        },
        description: {
            tr: "Doğumundan vefatına otuz olay, Mekke ve Medine dönemleriyle: her biri tarihi, yeri, ilgili ayet ya da sahih hadisle ve bugüne bıraktığı dersle. Harita ve sıralama oyunuyla.",
            en: "Thirty events from birth to passing, across the Meccan and Medinan periods: each with its date, place, a related verse or authentic hadith, and its lesson for today. With a map and an ordering game."
        },
        features: {
            tr: ['30 olay, yıl yıl', 'Ayet ve sahih hadis', 'Olay haritası', 'Hangisi önce?', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['30 events, year by year', 'Verses and authentic hadith', 'Map of events', 'Which came first?', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'arapca',
        short: 'Arapça',
        href: 'arapca/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 22c-7-5-16-6-24-5v40c8-1 17 0 24 5 7-5 16-6 24-5V17c-8-1-17 0-24 5z"/><path d="M40 22v40"/><path d="M22 30h10M22 38h12M48 30h10M46 38h12"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#2f5d50', '#0b1a16'],
        langs: ['TR'],
        name: {
            tr: "Ayet Ayet Arapça",
            en: "Ayet Ayet Arapça"
        },
        tagline: {
            tr: "Kur'an'ı okurken Arapça öğren",
            en: "Learn Arabic while reading the Qur'an"
        },
        description: {
            tr: "Kur'an'ı mushaf sırasıyla sayfa sayfa oku: Suûd eş-Şüreym kıraati, kelime kelime meal, her sayfada ilk kez geçen kelimeler, ekler, kalıplar ve dil bilgisi; ardından aralıklı tekrar. Yayında: 1–8. cüz (161 sayfa).",
            en: "Read the Qur'an page by page in mushaf order: Sa'ud ash-Shuraym's recitation, word-by-word meaning, and on every page the words, affixes, patterns and grammar that appear there for the first time, then spaced repetition. Available: juz 1–8 (161 pages)."
        },
        features: {
            tr: ['1–8. cüz: 161 sayfa', 'Şüreym kıraati, kelime vurgulu', 'Kelime kelime meal ve kök', 'Dil bilgisi defteri', 'Aralıklı tekrar', 'Sesli anlatım'],
            en: ['Juz 1–8: 161 pages', 'Recitation with word highlighting', 'Word-by-word meaning and roots', 'Grammar notebook', 'Spaced repetition', 'Audio narration']
        }
    },
    {
        id: 'zekat',
        short: 'Zekât',
        href: 'zekat/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="40" cy="56" rx="18" ry="6"/><path d="M22 56v-7c0 3.3 8 6 18 6s18-2.7 18-6v7"/><ellipse cx="40" cy="42" rx="18" ry="6"/><path d="M22 42v-7c0 3.3 8 6 18 6s18-2.7 18-6v7"/><ellipse cx="40" cy="28" rx="18" ry="6"/><path d="M40 12v6M34 15h12"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#2c6a4c', '#0a1e16'],
        langs: ['TR'],
        name: {
            tr: "Zekât ve Sadaka Rehberi",
            en: "Zekât ve Sadaka Rehberi"
        },
        tagline: {
            tr: "Hesapla, öğren, ver",
            en: "Calculate, learn, give"
        },
        description: {
            tr: "Kimin zekât vereceği, nisap, zekâta tabi mallar ve zekâtın verileceği yerler; adım adım hesaplama aracıyla birlikte. Fıtır sadakası, fidye, kefaret ve gönüllü sadaka da dahil.",
            en: "Who gives zakat, the nisab, which wealth is subject to zakat and who may receive it, with a step-by-step calculator. Fitr charity, fidya, expiation and voluntary charity included."
        },
        features: {
            tr: ['43 konu, 8 bölüm', 'Yaklaşık zekât hesaplayıcı', 'Sekiz sınıf: Tevbe 60', 'Verebilir miyim? oyunu', 'Fitre ve fidye 2026 (Diyanet)', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['43 topics in 8 sections', 'Approximate zakat calculator', 'The eight categories: Tawba 60', 'Can I give it? quiz', 'Fitr and fidya 2026 (Diyanet)', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'ramazan',
        short: 'Oruç',
        href: 'oruc/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M46 16a25 25 0 1 0 18 38 21 21 0 1 1-18-38Z"/><path d="M58 22l1.8 4.2L64 28l-4.2 1.8L58 34l-1.8-4.2L52 28l4.2-1.8Z"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#2a3878', '#0a0f24'],
        langs: ['TR'],
        name: {
            tr: "Oruç Rehberi",
            en: "Oruç Rehberi"
        },
        tagline: {
            tr: "Orucu doğru tutmak için",
            en: "Fasting rightly"
        },
        description: {
            tr: "Orucun farzları, bozan ve bozmayan durumlar, kaza, kefaret ve fidye, nafile oruçlar, teravih ve itikâf; \"Bozar mı?\" sorularıyla ve Kavram Haritası'na bağlantılı olarak.",
            en: "The obligations of the fast, what breaks it and what does not, making up, expiation and fidya, voluntary fasts, tarawih and itikaf, with \"Does it break the fast?\" questions and links to the Concept Map."
        },
        features: {
            tr: ['52 konu, 11 bölüm', 'Bozan ve bozmayan durumlar, ruhsatlar', 'Kaza, kefaret ve fidye', 'Bozar mı? oyunu', 'Nafile oruçlar çizelgesi', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['52 topics in 11 sections', 'What breaks the fast and what does not', 'Make-up, expiation and fidya', 'Does it break the fast? quiz', 'Voluntary fasts chart', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'dualar',
        short: 'Dualar',
        href: 'dualar/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M38 64H27c-4 0-7-3-8-7l-4-17c-1-3 3-5 5-2l5 9V22c0-3 4-3 4 0v16"/><path d="M42 64h11c4 0 7-3 8-7l4-17c1-3-3-5-5-2l-5 9V22c0-3-4-3-4 0v16"/><path d="M40 10v6M33 13l2 4M47 13l-2 4"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#3b5a2c', '#0f1a0b'],
        langs: ['TR'],
        name: {
            tr: "Kur'an Duaları",
            en: "Kur'an Duaları"
        },
        tagline: {
            tr: "Rabbenâ ile başlayan dualar",
            en: "Prayers from the Qur'an"
        },
        description: {
            tr: "Kur'an'da peygamberlerin ve müminlerin ettiği kırk üç dua: Arapçası, okunuşu, Diyanet meali, kimin hangi durumda ettiği ve ayeti. Duruma göre dua bulma ve ezber kartlarıyla.",
            en: "Forty-three prayers of the prophets and believers in the Qur'an: Arabic, transliteration, meaning, who said them and when, with the verse. Find a prayer by situation and memorize with flashcards."
        },
        features: {
            tr: ['43 Kur’an duası', 'Arapça, okunuş ve anlam', 'Duruma göre dua', 'Ezber kartları', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['43 Qur’anic prayers', 'Arabic, transliteration and meaning', 'Prayers by situation', 'Flashcards', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'giyim',
        short: 'Giyim',
        href: 'giyim/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M30 14 18 22v14l7 3v29h30V39l7-3V22l-12-8-6 6h-8z"/><path d="M34 14q6 8 12 0"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#2a5a6a', '#0b1a20'],
        langs: ['TR'],
        name: {
            tr: "Giyim ve Görünüş",
            en: "Giyim ve Görünüş"
        },
        tagline: {
            tr: "Kur'an ve sahih sünnetle",
            en: "Dress and appearance in Islam"
        },
        description: {
            tr: "Erkek, kadın ve çocuk için kıyafet, örtünme, saç, sakal ve süs. Her konuda önce ayet, sonra Buhârî ve Müslim'den sahih hadis, ardından Diyanet'in ve mezheplerin görüşü; çizimli örtünme rehberiyle.",
            en: "Clothing, covering, hair, beard and adornment for men, women and children. Each topic gives the verse first, then authentic hadith from Bukhari and Muslim, then Diyanet's and the schools' views, with an illustrated covering guide."
        },
        features: {
            tr: ['20 konu: erkek, kadın, çocuk', 'Önce ayet, sonra sahih hadis', 'Diyanet ve mezhep görüşleri', 'Çizimli örtünme sınırı', 'Çocuk ve yetişkin teması'],
            en: ['20 topics: men, women, children', 'Verse first, then authentic hadith', 'Diyanet and the schools of law', 'Illustrated covering guide', 'Kids and adult themes']
        }
    },
    {
        id: 'hayvanlar',
        short: 'Hayvanlar',
        href: 'hayvanlar/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="40" cy="48" rx="12" ry="16"/><path d="M29 43h22M28.5 51h23M31 59h18"/><path d="M35 34c-5-9-18-11-18-3 0 7 11 8 18 5M45 34c5-9 18-11 18-3 0 7-11 8-18 5"/><path d="M36 32l-4-9M44 32l4-9"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#7a5a1c', '#21180a'],
        langs: ['TR'],
        name: {
            tr: "Kur'an'da Hayvanlar",
            en: "Kur'an'da Hayvanlar"
        },
        tagline: {
            tr: "Çocuklar için keşif",
            en: "Animals in the Qur'an, for kids"
        },
        description: {
            tr: "Kur'an'da geçen hayvanlar ve anlattıkları dersler: Karınca, Arı, Örümcek ve Fil surelerinden Hz. Yûnus'un balığına, Hz. Sâlih'in devesine. Resimli kartlar ve oyunlarla, ayetleriyle.",
            en: "The animals of the Qur'an and their lessons: from the surahs of the Ant, the Bee, the Spider and the Elephant to Jonah's fish and Salih's camel. With picture cards, games and the verses."
        },
        features: {
            tr: ['15 hayvan, ayetleriyle', 'Renkli çizimler', 'Hayvanlara merhamet: sahih hadisler', 'Hangi surede? ve Kimin hikâyesi? oyunları', 'Peygamberler ve Sureler bağlantıları', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['15 animals with their verses', 'Colourful drawings', 'Kindness to animals: authentic hadith', 'Which surah? and Whose story? games', 'Links to Prophets and Surahs', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'sureler',
        short: 'Sureler',
        href: 'sureler/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="16" y="16" width="20" height="20" rx="4"/><rect x="44" y="16" width="20" height="12" rx="4"/><rect x="44" y="36" width="20" height="28" rx="4"/><rect x="16" y="44" width="20" height="20" rx="4"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#1d4f6a', '#0a1820'],
        langs: ['TR'],
        name: {
            tr: "Sureler Atlası",
            en: "Sureler Atlası"
        },
        tagline: {
            tr: "114 sure, bir bakışta",
            en: "All 114 surahs at a glance"
        },
        description: {
            tr: "Kur'an'ın 114 suresi bir atlasta: adı ve anlamı, Mekkî mi Medenî mi, iniş sırası, ayet sayısı, ana konusu ve öne çıkan ayeti. İniş sırası şeridi ve oyunlarla.",
            en: "The 114 surahs of the Qur'an in one atlas: name and meaning, Meccan or Medinan, order of revelation, number of verses, main theme and a key verse. With a revelation timeline and games."
        },
        features: {
            tr: ['114 sure, künyesiyle', '114 surenin hepsinde konu özeti ve öne çıkan ayet', 'Mekke–Medine haritası', 'İniş sırası şeridi', 'Mekkî mi, Medenî mi? ve Hangisi önce indi? oyunları', 'Ezberler bağlantısı', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['All 114 surahs with key facts', 'Theme summary and key verse for all 114 surahs', 'Mecca–Medina map', 'Revelation-order timeline', 'Meccan or Medinan? and Which came first? games', 'Link to Memorize', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'sahabe',
        short: 'Sahabe',
        href: 'sahabe/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="28" cy="30" r="8"/><circle cx="52" cy="30" r="8"/><path d="M14 62c0-9 6-16 14-16s14 7 14 16"/><path d="M38 62c0-9 6-16 14-16s14 7 14 16"/><path d="M40 12l2 4 4 .6-3 2.8.8 4.2L40 21.6l-3.8 2 .8-4.2-3-2.8 4-.6z"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#5a2c5a', '#1a0a1a'],
        langs: ['TR'],
        name: {
            tr: "Sahabe Hayatları",
            en: "Sahabe Hayatları"
        },
        tagline: {
            tr: "Peygamberimizin arkadaşları",
            en: "The Companions of the Prophet"
        },
        description: {
            tr: "Dört halifeden Hz. Bilâl'e, Hz. Hatice'den Hz. Mus'ab'a Peygamberimizin arkadaşları: hayatlarından sahih kaynakla kesitler, bugüne bıraktıkları örnek davranışlar, zaman şeridi ve \"Kim yaptı?\" oyunu.",
            en: "The Companions, from the four caliphs to Bilal, from Khadija to Mus'ab: moments from their lives from authentic sources, the example they left, a timeline and a \"Who did it?\" game."
        },
        features: {
            tr: ['12 sahabi, 54 kesit', 'Sahih hadis ve ilgili ayetler', 'Zaman şeridi', 'Kim yaptı? oyunu', 'Siyer Çizelgesi bağlantıları', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['12 Companions, 54 episodes', 'Authentic hadith and related verses', 'Timeline', 'Who did it? game', 'Links to the Seerah Timeline', 'Audio narration', 'Kids and adult themes']
        }
    },
    {
        id: 'mucizeler',
        short: 'Mucizeler',
        href: 'mucizeler/',
        iconSvg: '<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 12l6 13 14 2-10 10 2.5 14L40 44l-12.5 7L30 37 20 27l14-2Z"/><path d="M22 66h36"/></svg>',
        iconBg: '#0c1814',
        iconColor: '#dab56d',
        colors: ['#3b4f8c', '#0e1326'],
        langs: ['TR'],
        name: {
            tr: "Kur'an'dan Mucizeler",
            en: "Kur'an'dan Mucizeler"
        },
        tagline: {
            tr: "Gelecekten haberler, o gün bilinmeyenler",
            en: "Prophecies and verses on nature"
        },
        description: {
            tr: "Kur'an'ın önceden haber verip sonra gerçekleşen haberleri (Rumların zaferi, Ebu Leheb, Bedir, Mescid-i Haram'a giriş) ve indiği gün bilinmeyen, bugün bilimle birlikte düşünülen ayetler. Diyanet meali, klasik tefsir ve çağdaş yorum ayrı ayrı.",
            en: "Prophecies of the Qur'an that came true (the Byzantine victory, Abu Lahab, Badr, entering the Sacred Mosque) and verses read alongside today's science, with the Diyanet translation, classical commentary and modern interpretation kept apart."
        },
        features: {
            tr: ['12 sayfa, ayetleriyle', 'Gelecekten 6 haber ve gerçekleşmesi', 'O gün bilinmeyen 6 bilgi, klasik ve çağdaş yorumla', 'Hangi surede? oyunu', 'Sureler Atlası bağlantıları', 'Sesli anlatım', 'Çocuk ve yetişkin teması'],
            en: ['12 pages with their verses', '6 prophecies and how they came true', '6 verses on nature, with classical and modern readings', 'Which surah? game', 'Links to the Surah Atlas', 'Audio narration', 'Kids and adult themes']
        }
    }
];
