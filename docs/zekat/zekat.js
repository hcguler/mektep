// ============================================
// Zekât ve Sadaka Rehberi — uygulama mantığı
// İçerik: data.js (ZEKAT_DATA), ayet metinleri: ayetler.js (ZEKAT_AYETLER; tools/zekat-uret.mjs üretir),
// hesap: hesap.js (ZekatHesap; saf fonksiyonlar, tools/zekat-test.mjs sınar). Anlatım metni
// tools/zekat-anlatim.json içindedir; sayfada gösterilmez. Kayıtlar üretildiğinde ../anlatim.js data-anlatim
// yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Ağ isteği yoktur: altın ve gümüş gram fiyatını kullanıcı girer. Tutarlar yalnızca "Hatırla" seçilirse
// bu cihazda (localStorage "zekat:hesap") saklanır ve tek dokunuşla silinir.
// ============================================
(function () {
    'use strict';

    const DATA = window.ZEKAT_DATA;
    const AY = window.ZEKAT_AYETLER || {};
    const HESAP = window.ZekatHesap;
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.konular.map((k, i) => Object.assign({ n: i + 1 }, k));
    const BY = Object.fromEntries(ALL.map((k) => [k.id, k]));
    const BOL = Object.fromEntries(DATA.bolumler.map((b) => [b.id, b]));
    const HK = DATA.hukumler;
    const DG = DATA.degerler;
    const T = ALL.length;
    const AYET_SAY = new Set(ALL.flatMap((k) => k.ayetler || [])).size;
    const HADIS_SAY = ALL.reduce((s, k) => s + (k.hadisler || []).length, 0);
    const kayitAdi = (k) => `${String(k.n).padStart(2, '0')}-${k.id}`;
    // Kavram Haritası (../kavram/#/k/<id>) kimlikleri; üretici bunların orada bulunduğunu denetler.
    const KAVRAM = { farz: 'Farz', vacip: 'Vacip', niyet: 'Niyet', mustehab: 'Müstehab' };
    const kavramUrl = (id) => `../kavram/#/k/${id}`;

    // ---------- Kalıcı durum ----------
    // zekat:v1 yalnızca görünüm tercihleri; zekat:hesap yalnızca kullanıcı "Hatırla" derse tutarlar.
    const KEY = 'zekat:v1', HKEY = 'zekat:hesap';
    const state = { show: { ar: true, meal: true }, arSize: 2 };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';

    const COPY = {
        yetiskin: {
            kick: 'Kur’an, sahih sünnet ve Diyanet', title: 'Zekât <em>ve Sadaka</em>',
            lead: 'Bana zekât düşüyor mu? Ne kadar? Kime verebilirim? Fitre ile zekât farkı ne? Zekât, fıtır sadakası, fidye, kefaret ve gönüllü sadaka, kaynağıyla.',
            kimAlt: 'Annem, kardeşim, komşum… zekât verilebilir mi?',
            dogru: ['Doğru.', 'Evet, doğru.', 'Doğru cevap.'], yanlis: 'Doğru cevap şu:',
            bitti: (d, t) => d === t ? 'Bütün soruları doğru bildiniz.' : `${t} sorudan ${d} tanesini doğru bildiniz.`
        },
        cocuk: {
            kick: 'Paylaştıkça çoğalır! 💚', title: '<span class="emo">💚</span> Zekât <em>ve Sadaka</em>',
            lead: 'Zekât, zengin büyüklerin malından ihtiyaç sahiplerine verdiği paydır. Sadaka ise herkesin verebileceği iyiliktir: güler yüz bile sadakadır! Hadi paylaşmayı öğrenelim.',
            kimAlt: 'Bil bakalım: zekât kime verilir? 🤔',
            dogru: ['Harika, doğru! 🎉', 'Aferin, bildin! ⭐', 'Süpersin! 🌟'], yanlis: 'Olsun, yeni bir şey öğrendin! 💡 Doğrusu şu:',
            bitti: (d, t) => d === t ? 'Hepsini bildin, maşallah! 🎉' : `${t} sorudan ${d} tanesini bildin. Her soru yeni bir bilgi! 🌟`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        rehber: svg('<path d="M12 5v16"/><path d="M20 19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a5 5 0 0 0-4 2 5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/>'),
        hesap: svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h3.5"/>'),
        paylas: svg('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5.3 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>'),
        siniflar: svg('<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>'),
        oyun: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><circle cx="12" cy="17.3" r=".4" fill="currentColor"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        right: svg('<path d="m9 5 7 7-7 7"/>', 2),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')
    };
    const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’'‘]/g, '');
    const hk = (id, lg) => (id && HK[id] ? `<span class="hk${lg ? ' lg' : ''}" data-hk="${id}" title="${esc(HK[id].aciklama)}">${esc(lg ? HK[id].tam : HK[id].ad)}</span>` : '');
    const dis = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
    const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const tarihTr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${AYLAR[m - 1]} ${y}`; };
    const TL = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });
    const SAYI = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
    const tl = (x) => TL.format(x);
    const buyuk = (s) => s[0].toLocaleUpperCase('tr') + s.slice(1);

    let toastTimer = null;
    function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600); }

    // ---------- Gezinme ----------
    // Çocuk temasında hesaplayıcı yerine "Paylaşmak" öne çıkar; hesaplayıcıya oradan da gidilir.
    function tabs() {
        return [
            { id: '', href: '#/', ad: 'Rehber', alt: 'Bölümler ve konular', icon: IC.rehber },
            kid() ? { id: 'paylas', href: '#/paylas', ad: 'Paylaş', alt: 'Her iyilik sadakadır', icon: IC.paylas }
                : { id: 'hesapla', href: '#/hesapla', ad: 'Hesapla', alt: 'Yaklaşık zekât', icon: IC.hesap },
            { id: 'siniflar', href: '#/siniflar', ad: 'Sınıflar', alt: 'Tevbe 60: sekiz sınıf', icon: IC.siniflar },
            { id: 'kim', href: '#/kim', ad: 'Kime?', alt: 'Verebilir miyim? oyunu', icon: IC.oyun }
        ];
    }
    function drawNav(active) { tabbar.innerHTML = tabs().map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // ---------- Parçalar ----------
    function konuKart(k) {
        return `<li><a class="og" href="#/k/${k.id}"><span class="th" aria-hidden="true">${k.emo}</span>
                <b>${esc(k.ad)}</b><span class="oz">${esc(k.kisa)}</span>${hk(k.hukum)}</a></li>`;
    }
    const liste = (ks) => `<ul class="ogeler">${ks.map(konuKart).join('')}</ul>`;
    function bolumKartlari(aktif) {
        return `<nav class="bolumler" aria-label="Bölümler">${DATA.bolumler.map((b, i) => `<a class="bk" href="#/b/${b.id}"${b.id === aktif ? ' aria-current="true"' : ''}><span class="emo" aria-hidden="true">${b.emo}</span><span class="n">${i + 1}. bölüm · ${ALL.filter((k) => k.bolum === b.id).length} konu</span><b>${esc(b.ad)}</b><small>${esc(b.alt)}</small></a>`).join('')}</nav>`;
    }
    function ctaKartlari() {
        const c = copy();
        const hesap = `<a class="cta" href="#/hesapla"><span class="emo" aria-hidden="true">🧮</span><b>Zekâtımı hesapla</b><small>Gram altın fiyatını girin; nisabı ve zekâtı yaklaşık hesaplayın. Tutarlar cihazınızdan çıkmaz.</small><span class="go">${IC.right}</span></a>`;
        const paylas = `<a class="cta" href="#/paylas"><span class="emo" aria-hidden="true">💚</span><b>Paylaşmak</b><small>Güler yüz, güzel söz, yarım hurma: her iyilik sadakadır.</small><span class="go">${IC.right}</span></a>`;
        return `<div class="ctas">
            ${kid() ? paylas : hesap}
            <a class="cta" href="#/kim"><span class="emo" aria-hidden="true">❓</span><b>Verebilir miyim?</b><small>${esc(c.kimAlt)}</small><span class="go">${IC.right}</span></a>
            <a class="cta" href="#/siniflar"><span class="emo" aria-hidden="true">8️⃣</span><b>Sekiz sınıf</b><small>Tevbe suresi 60. ayet: zekâtın verileceği yerler.</small><span class="go">${IC.right}</span></a>
            ${kid() ? hesap.replace('Zekâtımı hesapla', 'Büyükler için: zekât hesabı') : paylas}
        </div>`;
    }
    // Yıllık değerin tarihi bir yıldan eskiyse uyarı (plan: "yıllık değer disiplini")
    const eski = (iso) => (Date.now() - new Date(iso + 'T00:00:00').getTime()) / 864e5 > 365;
    function degerKutu(ad) {
        const v = DG[ad];
        if (!v) return '';
        if ('gram' in v) {
            return `<div class="kutu deger"><b>${esc(buyuk(v.ne))}</b>
                <span class="tutar">${SAYI.format(v.gram)} gram</span>
                ${esc(v.olcu)}. Parasal karşılığı o günkü gram fiyatına göre değişir; uygulama fiyat yazmaz.
                <small>${v.not ? esc(v.not) + ' ' : ''}Kaynak: ${v.url ? dis(v.url, v.kaynak) : esc(v.kaynak)}.</small></div>`;
        }
        if (v.tutar == null) return `<div class="kutu deger"><b>Güncel tutar</b><span class="tutar">—</span>Güncel tutar için Diyanet’in açıklamasına bakın.</div>`;
        return `<div class="kutu deger"><b>${esc(buyuk(v.ne))}</b>
            <span class="tutar">${esc(String(v.tutar))} ${esc(v.birim)}</span>
            ${tarihTr(v.tarih)} tarihinde Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’nun açıkladığı asgari tutar; ${esc(v.donem)} geçerlidir.
            ${eski(v.tarih) ? '<span class="eski">⚠️ Bu tutar bir yıldan eski; güncel olmayabilir. Diyanet’in son açıklamasına bakın.</span>' : ''}
            <small>${esc(v.not)} Kaynak: ${dis(v.url, v.kaynak)}.</small></div>`;
    }
    function hadisKart(h) {
        return `<figure class="hadis"><p>“${esc(h.metin)}”</p><figcaption class="ravi"><span>Râvi: <b>${esc(h.ravi)}</b></span><span>${esc(h.kaynak)}</span></figcaption></figure>`;
    }
    const danisKutu = '<p class="kutu uyari">💬 <b>Danışın:</b> Bu bilgi genel bir rehberdir. Kendi malınız ve durumunuz için müftülüğe ya da 190 Alo Fetva hattına danışın.</p>';
    function viewbar() {
        const ad = { ar: 'Arapça', meal: 'Anlam' };
        const chip = (k) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${ad[k]}</button>`;
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips" style="--n:2">${['ar', 'meal'].map(chip).join('')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const boxes = app.querySelectorAll('.metinler');
        const apply = () => {
            boxes.forEach((box) => { ['ar', 'meal'].forEach((k) => box.classList.toggle('hide-' + k, !state.show[k])); box.dataset.ar = state.arSize; });
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            app.querySelectorAll('.viewbar').forEach((vb) => { const sb = vb.querySelectorAll('[data-size]'); sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; });
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            if (state.show[k] && ['ar', 'meal'].filter((x) => state.show[x]).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }
    const ayetKart = (r) => { const a = AY[r]; return `<div class="ayet"><p class="ar" lang="ar">${esc(a.ar)}</p><p class="meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${esc(a.no)}. ayet</p></div>`; };

    // ---------- Ana ekran ----------
    let aramaMetni = '';
    function viewHome() {
        const c = copy();
        const f = DG.fitre, fi = DG.fidye, n = DG.nisapAltin;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="stats"><span><b>${DATA.bolumler.length}</b> bölüm</span><span><b>${T}</b> konu</span><span><b>${AYET_SAY}</b> ayet grubu</span><span><b>${HADIS_SAY}</b> sahih hadis</span></div>
                </section>
                <nav class="degerler" aria-label="Güncel değerler">
                    <a href="#/k/nisap"><small>Nisap</small><b>${SAYI.format(n.gram)} g altın</b><span>ya da değeri</span></a>
                    <a href="#/k/fitir-sadakasi"><small>Fitre ${f.tutar != null ? f.tarih.slice(0, 4) : ''}</small><b>${f.tutar != null ? f.tutar + ' ' + esc(f.birim) : '—'}</b><span>kişi başı, en az</span></a>
                    <a href="#/k/oruc-fidyesi"><small>Fidye ${fi.tutar != null ? fi.tarih.slice(0, 4) : ''}</small><b>${fi.tutar != null ? fi.tutar + ' ' + esc(fi.birim) : '—'}</b><span>bir gün için</span></a>
                    <a href="#/k/kirkta-bir"><small>Oran</small><b>Kırkta bir</b><span>yüzde 2,5</span></a>
                </nav>
                ${ctaKartlari()}
                <div class="filters">
                    <label class="search">${IC.search}<span class="sr">Konu ara</span><input type="search" id="ara" placeholder="Ara: altın, borç, kardeş, fitre, adak…" value="${esc(aramaMetni)}" autocomplete="off"></label>
                </div>
                <div id="sonuc" aria-live="polite"></div>
                ${bolumKartlari()}
            </div>`;
        const sonuc = document.getElementById('sonuc'), ara = document.getElementById('ara');
        const ciz = () => {
            const q = norm(aramaMetni.trim());
            if (!q) { sonuc.innerHTML = ''; return; }
            const ks = ALL.filter((k) => norm([k.ad, k.kisa, k.aciklama.join(' '), k.ornek || '', k.hukum ? HK[k.hukum].tam : '', BOL[k.bolum].ad].join(' ')).includes(q));
            sonuc.innerHTML = ks.length ? `<section class="grup"><h2>Arama<small>${ks.length} konu</small></h2>${liste(ks)}</section>` : '<p class="empty">Bu aramaya uyan konu yok.</p>';
        };
        ciz();
        ara.addEventListener('input', () => { aramaMetni = ara.value; ciz(); });
        hsub.textContent = 'Rehber';
        document.title = 'Zekât ve Sadaka Rehberi';
        return '';
    }

    // ---------- Bölüm ----------
    function viewBolum(b) {
        const ks = ALL.filter((k) => k.bolum === b.id);
        const i = DATA.bolumler.indexOf(b);
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Rehber</a><span class="pos">${i + 1} / ${DATA.bolumler.length}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? b.emo + ' ' : ''}${i + 1}. bölüm</div>
                    <h1>${esc(b.ad)}</h1>
                    <p class="lead">${esc(b.alt)}</p>
                </section>
                ${b.id === 'kime' ? `<a class="cta" href="#/siniflar"><span class="emo" aria-hidden="true">8️⃣</span><b>Sekiz sınıf</b><small>Tevbe 60 ve her sınıfın bugünkü karşılığı.</small><span class="go">${IC.right}</span></a>` : ''}
                ${liste(ks)}
                ${b.id === 'kime' || b.id === 'verilmez' ? `<a class="cta" href="#/kim"><span class="emo" aria-hidden="true">❓</span><b>Verebilir miyim?</b><small>${esc(copy().kimAlt)}</small><span class="go">${IC.right}</span></a>` : ''}
                <nav class="pager" aria-label="Önceki ve sonraki bölüm">
                    ${i > 0 ? `<a href="#/b/${DATA.bolumler[i - 1].id}"><small>Önceki bölüm</small><b>${esc(DATA.bolumler[i - 1].ad)}</b></a>` : ''}
                    ${i < DATA.bolumler.length - 1 ? `<a class="next" href="#/b/${DATA.bolumler[i + 1].id}"><small>Sonraki bölüm</small><b>${esc(DATA.bolumler[i + 1].ad)}</b></a>` : ''}
                </nav>
            </div>`;
        hsub.textContent = b.ad;
        document.title = `${b.ad} | Zekât ve Sadaka Rehberi`;
        return '';
    }

    // ---------- Konu sayfası ----------
    const KID_NOT = {
        'fitir-sadakasi': '🧒 <b>Senin fitren:</b> Küçük çocukların fitresini anne ya da babası verir. Bayramdan önce verilen fitre, ihtiyaç sahibi bir çocuğun da bayram sevinci olur!',
        'kime-farz': '🧒 Zekât, ergenlik çağına girmiş ve dinen zengin olan büyüklere farzdır. Sen de harçlığından sadaka vererek paylaşmayı öğrenebilirsin! <a href="#/paylas">Paylaşmak</a>',
        'her-iyilik': '😊 <b>Bugün dene:</b> Birine gülümse, güzel bir söz söyle ya da yoldaki bir taşı kenara çek. Hepsi sadaka!'
    };
    function viewKonu(k) {
        const prev = ALL[k.n - 2], next = ALL[k.n];
        const b = BOL[k.bolum];
        const ayetler = (k.ayetler || []).filter((r) => AY[r]);
        const h = k.hukum && HK[k.hukum];
        const kavramlar = (k.kavramlar || []).filter((c) => KAVRAM[c]);
        const hkRow = h ? `<div class="hkrow">${hk(k.hukum, true)}${h.kavram ? `<a class="kv" href="${kavramUrl(h.kavram)}">${esc(KAVRAM[h.kavram] || h.ad)} nedir? →</a>` : ''}</div>` : '';
        const bag = k.baglanti ? `<a class="cta" href="${esc(k.baglanti.href)}"><span class="emo" aria-hidden="true">${k.baglanti.href.startsWith('../oruc') ? '🌙' : k.baglanti.href === '#/hesapla' ? '🧮' : '➡️'}</span><b>${esc(k.baglanti.ad)}</b><small>${esc(k.baglanti.alt)}</small><span class="go">${IC.right}</span></a>` : '';
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/b/${b.id}">${IC.left}${esc(b.ad)}</a><span class="pos">${k.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? k.emo + ' ' : ''}${esc(b.ad)}</div>
                    <h1>${esc(k.ad)}</h1>
                    <p class="lead">${esc(k.kisa)}</p>
                    ${hkRow}
                    <div data-anlatim="${kayitAdi(k)}"></div>
                </section>
                ${kid() && KID_NOT[k.id] ? `<p class="kutu ornek">${KID_NOT[k.id]}</p>` : ''}
                <section class="sc expl"><div class="kick">Kısaca</div>${k.aciklama.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
                ${k.ornek ? `<p class="kutu ornek"><b>Örnek:</b> ${esc(k.ornek)}</p>` : ''}
                ${k.mezhep ? `<p class="kutu mezhep"><b>Mezhep farkı:</b> ${esc(k.mezhep)}</p>` : ''}
                ${k.deger ? degerKutu(k.deger) : ''}
                ${k.danis ? danisKutu : ''}
                ${bag}
                ${ayetler.length ? `<section class="blok"><h2>Kur’an</h2>${viewbar()}<div class="metinler">${ayetler.map(ayetKart).join('')}</div></section>` : ''}
                ${(k.hadisler || []).length ? `<section class="blok"><h2>Sünnet <small>sahih hadis</small></h2>${k.hadisler.map(hadisKart).join('')}</section>` : ''}
                ${kavramlar.length ? `<section class="blok"><h2>Kavram Haritası</h2><nav class="chiprow" aria-label="İlgili kavramlar">${kavramlar.map((c) => `<a href="${kavramUrl(c)}">${esc(KAVRAM[c])}</a>`).join('')}</nav></section>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(k.akilda)}</p></section>
                <div class="srccard src"><b>Kaynak</b><ul class="srclist">${k.kaynak.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>${ayetler.length ? `<p class="srclist">Arapça: Tanzil. Meal: ${esc(DATA.meal)}.</p>` : ''}${(k.hadisler || []).length ? '<p class="srclist">Hadis metinleri anlam olarak aktarılmıştır.</p>' : ''}<p class="srclist">SSS: DİYK, Zekât Sıkça Sorulanlar · İlmihal I: Diyanet İlmihali, Zekât bölümü.</p></div>
                <nav class="pager" aria-label="Önceki ve sonraki konu">
                    ${prev ? `<a href="#/k/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/k/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = k.ad;
        document.title = `${k.ad} | Zekât ve Sadaka Rehberi`;
        return '';
    }

    // ---------- Sekiz sınıf (Tevbe 60) ----------
    function viewSiniflar() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '8️⃣ ' : ''}Tevbe suresi, 60. ayet</div>
                    <h1>Sekiz <em>sınıf</em></h1>
                    <p class="lead">Zekâtın kimlere verileceğini Allah bizzat bildirmiştir. Her sınıfın anlamı ve Diyanet’e göre bugünkü karşılığı.</p>
                </section>
                ${AY['9:60'] ? `<section class="blok"><h2>Kur’an</h2>${viewbar()}<div class="metinler">${ayetKart('9:60')}</div></section>` : ''}
                <ol class="siniflar">${DATA.siniflar.map((s, i) => `<li class="sinif">
                    <div class="sinif__bas"><span class="no" aria-hidden="true">${i + 1}</span><span class="emo" aria-hidden="true">${s.emo}</span><div><h2>${esc(s.ad)}</h2><small>Mealde: “${esc(s.meal)}”</small></div></div>
                    <p>${esc(s.aciklama)}</p>
                    <p class="bugun"><b>Bugün:</b> ${esc(s.bugun)}</p>
                    ${s.mezhep ? `<p class="mz"><b>Mezhep farkı:</b> ${esc(s.mezhep)}</p>` : ''}
                    <p class="kay">${esc(s.kaynak)}${s.konu ? ` · <a href="#/k/${s.konu}">${esc(BY[s.konu].ad)}</a>` : ''}</p>
                </li>`).join('')}</ol>
                <p class="kutu">🧭 Hanefîlere göre zekât bu sınıflardan yalnız birine de verilebilir; en başta gelen hak sahipleri fakir ve miskinlerdir. <a href="#/k/sekiz-sinif">Sekiz sınıf konusu</a> · <a href="#/b/verilmez">Kimlere verilmez?</a></p>
            </div>`;
        bindView();
        hsub.textContent = 'Sekiz sınıf';
        document.title = 'Sekiz sınıf | Zekât ve Sadaka Rehberi';
        return 'siniflar';
    }

    // ---------- Hesaplayıcı ----------
    const ALAN = [
        { id: 'altinFiyat', ad: 'Gram altın fiyatı', birim: 'TL', ipucu: 'Bugünkü gram altın fiyatını kendiniz yazın. Uygulama internetten fiyat almaz.', gerekli: true },
        { id: 'nakit', ad: 'Nakit ve banka', birim: 'TL', ipucu: 'Elde ve bankadaki para.' },
        { id: 'doviz', ad: 'Döviz', birim: 'TL karşılığı', ipucu: 'Bugünkü kurla Türk lirası karşılığı.' },
        { id: 'altinGram', ad: 'Altın', birim: 'gram', ipucu: 'Takılar dahil bütün altınlarınızın toplam gramı (Hanefî görüş).' },
        { id: 'ticaret', ad: 'Ticaret malı', birim: 'TL', ipucu: 'Satmak için tutulan mal ve taşınmaz; maliyet ya da piyasa değeri.' },
        { id: 'alacak', ad: 'Tahsili umulan alacaklar', birim: 'TL', ipucu: 'Borçlunun kabul ettiği, ödeyebileceği alacaklar.' },
        { id: 'borc', ad: 'Bu yıl ödenecek borçlar', birim: 'TL', ipucu: 'Uzun vadeli kredinin yalnız bu yılki taksitleri.' }
    ];
    const GUMUS = [
        { id: 'gumusGram', ad: 'Gümüş', birim: 'gram', ipucu: 'Elinizdeki gümüşün toplam gramı.' },
        { id: 'gumusFiyat', ad: 'Gram gümüş fiyatı', birim: 'TL', ipucu: 'Girilirse gümüş nisabının karşılığı da bilgi olarak gösterilir.' }
    ];
    const KALEM = { nakit: 'Nakit ve banka', doviz: 'Döviz', altin: 'Altın', gumus: 'Gümüş', ticaret: 'Ticaret malı', alacak: 'Alacaklar' };
    const ALAN_AD = Object.fromEntries([...ALAN, ...GUMUS].map((a) => [a.id, a.ad]));
    function hatirlanan() { try { const s = JSON.parse(localStorage.getItem(HKEY) || 'null'); return s && typeof s === 'object' ? s : null; } catch (e) { return null; } }
    function viewHesapla() {
        const kayit = hatirlanan();
        const deger = (id) => (kayit && typeof kayit[id] === 'string' ? kayit[id] : '');
        const alan = (a) => `<label class="alan"><span class="ad">${esc(a.ad)} <em>${esc(a.birim)}</em>${a.gerekli ? ' <i class="ger">gerekli</i>' : ''}</span>
            <input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" id="h-${a.id}" data-alan="${a.id}" value="${esc(deger(a.id))}" placeholder="0" aria-describedby="i-${a.id}">
            <small id="i-${a.id}">${esc(a.ipucu)}</small></label>`;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🧮 ' : ''}Yaklaşık hesap</div>
                    <h1>Zekât <em>hesapla</em></h1>
                    <p class="lead">Varlıklarınızı ve bu yıl ödeyeceğiniz borçları yazın. Hesap yalnızca aritmetiktir; hüküm için rehberdeki konulara bakın.</p>
                </section>
                ${kid() ? '<p class="kutu ornek">🧒 Bu hesap büyükler içindir. Sen paylaşmayı öğrenmek istersen <a href="#/paylas">Paylaşmak</a> sayfasına bak!</p>' : ''}
                <p class="kutu gizli">🔒 <b>Gizlilik:</b> Yazdığınız tutarlar cihazınızdan çıkmaz; ağ isteği yapılmaz. Yalnızca “Hatırla” seçerseniz bu cihazda saklanır.</p>
                <form class="hesap" id="hesap" novalidate onsubmit="return false">
                    <fieldset><legend>Varlıklar ve borçlar</legend>${ALAN.map(alan).join('')}</fieldset>
                    <details class="gumus"${deger('gumusGram') || deger('gumusFiyat') ? ' open' : ''}><summary>Gümüş <small>isteğe bağlı</small></summary><div>${GUMUS.map(alan).join('')}</div></details>
                    <div class="hatirla">
                        <label class="sw"><input type="checkbox" id="hatirla"${kayit ? ' checked' : ''}><span>Bu cihazda hatırla</span></label>
                        <button type="button" class="btn alt" id="sil">Tutarları sil</button>
                    </div>
                </form>
                <section class="sc sonuc" id="sonuc" aria-live="polite" aria-atomic="true"></section>
                <p class="kutu">📌 <b>Hatırlatma:</b> Zekât, nisap miktarı malın üzerinden <b>bir kamerî yıl geçmiş</b> olmasıyla farz olur. Oturduğunuz ev, eşyanız, aracınız ve meslek aletleriniz hesaba girmez. <a href="#/k/kime-farz">Şartlar</a> · <a href="#/k/borclar">Borçlar</a> · <a href="#/k/muaf">Zekât gerekmeyen mallar</a></p>
                ${danisKutu}
            </div>`;
        const form = document.getElementById('hesap'), sonuc = document.getElementById('sonuc'), hat = document.getElementById('hatirla');
        const oku = () => Object.fromEntries(Array.from(form.querySelectorAll('[data-alan]')).map((i) => [i.dataset.alan, i.value]));
        const kaydet = () => { if (hat.checked) store(HKEY, JSON.stringify(oku())); };
        const ciz = () => {
            const r = HESAP.hesapla(oku(), { nisapGram: DG.nisapAltin.gram, gumusNisapGram: DG.nisapGumus.gram });
            form.querySelectorAll('[data-alan]').forEach((i) => i.setAttribute('aria-invalid', String(r.hatalar.includes(i.dataset.alan))));
            sonuc.innerHTML = sonucHtml(r);
        };
        form.addEventListener('input', () => { ciz(); kaydet(); });
        hat.addEventListener('change', () => {
            if (hat.checked) { kaydet(); toast('Tutarlar bu cihazda hatırlanacak.'); }
            else { try { localStorage.removeItem(HKEY); } catch (e) { /* yok say */ } toast('Hatırlanan tutarlar silindi.'); }
        });
        document.getElementById('sil').addEventListener('click', () => {
            form.querySelectorAll('[data-alan]').forEach((i) => { i.value = ''; });
            try { localStorage.removeItem(HKEY); } catch (e) { /* yok say */ }
            hat.checked = false; ciz(); toast('Tutarlar silindi.');
            const f = document.getElementById('h-altinFiyat'); if (f) f.focus();
        });
        ciz();
        hsub.textContent = 'Hesapla';
        document.title = 'Zekât hesapla | Zekât ve Sadaka Rehberi';
        return 'hesapla';
    }
    function sonucHtml(r) {
        const bas = '<div class="kick">Sonuç · yaklaşık</div>';
        if (r.durum === 'bos') return `${bas}<p class="lead">Önce gram altın fiyatını, sonra varlıklarınızı yazın. Nisap: ${SAYI.format(DG.nisapAltin.gram)} gram altın ya da değeri.</p>`;
        if (r.durum === 'hata') return `${bas}<p class="lead">Şu alanlar okunamadı: <b>${r.hatalar.map((a) => esc(ALAN_AD[a])).join(', ')}</b>. Yalnızca sayı yazın (ör. 12.500 ya da 12500,50); eksi tutar yazılmaz.</p>`;
        if (r.durum === 'eksik') return `${bas}<p class="lead">Hesap için şu alan gerekli: <b>${r.eksik.map((a) => esc(ALAN_AD[a])).join(', ')}</b>.</p>`;
        const satir = (ad, t, cls) => `<li${cls ? ` class="${cls}"` : ''}><span>${esc(ad)}</span><b>${tl(t)}</b></li>`;
        const tablo = `<ul class="dokum">
            ${r.kalemler.map((k) => satir(KALEM[k.ad], k.tutar)).join('')}
            ${r.kalemler.length ? satir('Varlıklar toplamı', r.varlik, 'top') : ''}
            ${r.borc ? satir('Düşülen borç', -r.borc) : ''}
            ${satir('Net varlık', r.net, 'top')}
            ${satir(`Nisap (${SAYI.format(DG.nisapAltin.gram)} g altın)`, r.nisap, 'nis')}
            ${r.gumusNisap != null ? `<li class="bilgi"><span>Gümüş nisabı (${SAYI.format(DG.nisapGumus.gram)} g) · yalnız bilgi</span><b>${tl(r.gumusNisap)}</b></li>` : ''}
        </ul>`;
        let ana;
        if (r.durum === 'ustu') ana = `<p class="buyuk" data-d="ustu">${tl(r.zekat)}</p><p class="lead">Net varlığınız nisaba ulaşıyor. Üzerinden bir kamerî yıl geçmişse zekâtınız <b>yaklaşık</b> bu kadardır: net varlığın kırkta biri (yüzde 2,5).</p>`;
        else if (r.durum === 'borc-fazla') ana = `<p class="buyuk" data-d="yok">Zekât düşmüyor</p><p class="lead">Bu yıl ödenecek borçlarınız varlıklarınızdan fazla görünüyor; bu hesaba göre zekât gerekmez.</p>`;
        else if (!r.kalemler.length && !r.borc) ana = `<p class="buyuk" data-d="bilgi">${tl(r.nisap)}</p><p class="lead">Girdiğiniz fiyata göre nisap. Şimdi varlıklarınızı yazın.</p>`;
        else ana = `<p class="buyuk" data-d="yok">Nisabın altında</p><p class="lead">Net varlığınız nisaba ulaşmıyor (eksik: ${tl(r.nisap - r.net)}); bu hesaba göre zekât gerekmez.</p>`;
        return `${bas}${ana}${tablo}<p class="not">Bu sonuç bir fetva değildir; kesin hüküm için müftülüğe danışın.</p>`;
    }

    // ---------- Paylaşmak (çocuk teması öne çıkarır) ----------
    function viewPaylas() {
        const hadisler = ['her-iyilik', 'sadaka', 'once-yakinlar', 'sadaka-adabi'].flatMap((id) => BY[id].hadisler.map((h) => ({ h, k: BY[id] })));
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '💚 ' : ''}Her iyilik sadakadır</div>
                    <h1>Paylaşmak</h1>
                    <p class="lead">${kid() ? 'Paylaşmak için çok paran olması gerekmez! Bir gülümseme, güzel bir söz, yardım eden bir el: Peygamberimiz bunların hepsinin sadaka olduğunu söyledi. 🌟' : 'Sadaka yalnız para değildir. Peygamberimizin sahih hadisleriyle paylaşmanın yolları.'}</p>
                </section>
                <ul class="paylas">
                    <li><span class="emo" aria-hidden="true">😊</span><b>Güler yüz</b><small>Kardeşini güler yüzle karşılamak</small></li>
                    <li><span class="emo" aria-hidden="true">💬</span><b>Güzel söz</b><small>Güzel söz sadakadır</small></li>
                    <li><span class="emo" aria-hidden="true">🪨</span><b>Yolu temizlemek</b><small>Yoldan eziyet veren şeyi kaldırmak</small></li>
                    <li><span class="emo" aria-hidden="true">🤝</span><b>Yardım etmek</b><small>Birinin yükünü kaldırmasına yardım</small></li>
                    <li><span class="emo" aria-hidden="true">🍞</span><b>Az da olsa vermek</b><small>Yarım hurmayla bile olsa</small></li>
                    <li><span class="emo" aria-hidden="true">🏡</span><b>Önce yakınlar</b><small>Veren el, alan elden üstündür</small></li>
                </ul>
                <section class="blok"><h2>Sünnet <small>sahih hadis</small></h2>${hadisler.map(({ h, k }) => `${hadisKart(h)}`).join('')}</section>
                <p class="kutu ornek">🎁 <b>Bayramda:</b> Küçük çocukların fitresini anne ya da babası verir. Fitre, ihtiyaç sahiplerinin de bayram sevinci yaşamasını sağlar. <a href="#/k/fitir-sadakasi">Fıtır sadakası</a></p>
                <div class="ctas">
                    <a class="cta" href="#/k/her-iyilik"><span class="emo" aria-hidden="true">😊</span><b>Her iyilik sadakadır</b><small>Konunun tamamı ve kaynağı.</small><span class="go">${IC.right}</span></a>
                    <a class="cta" href="#/b/sadaka"><span class="emo" aria-hidden="true">💚</span><b>Sadaka ve infak</b><small>Sadaka-i câriye, adak ve diğer konular.</small><span class="go">${IC.right}</span></a>
                    <a class="cta" href="#/hesapla"><span class="emo" aria-hidden="true">🧮</span><b>${kid() ? 'Büyükler için: zekât hesabı' : 'Zekâtımı hesapla'}</b><small>Yaklaşık zekât hesaplayıcı.</small><span class="go">${IC.right}</span></a>
                </div>
            </div>`;
        hsub.textContent = 'Paylaşmak';
        document.title = 'Paylaşmak | Zekât ve Sadaka Rehberi';
        return 'paylas';
    }

    // ---------- Verebilir miyim? ----------
    const SECENEK = ['verilir', 'verilmez'];
    let quiz = null;
    function karistir(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
    function yeniOyun() { quiz = { list: karistir(DATA.kisiler).slice(0, 10), i: 0, dogru: 0, cevap: null }; }
    function viewOyun() {
        if (!quiz) yeniOyun();
        const c = copy();
        const t = quiz.list.length;
        if (quiz.i >= t) {
            app.innerHTML = `
                <div class="page in">
                    <section class="sc hero quiz">
                        <div class="kick">Verebilir miyim?</div>
                        <p class="score">${quiz.dogru}<small> / ${t}</small></p>
                        <p class="lead">${esc(c.bitti(quiz.dogru, t))}</p>
                        <div class="btns"><button type="button" class="btn" id="tekrar">Yeniden oyna</button><a class="btn alt" href="#/b/kime">Kimlere verilir?</a><a class="btn alt" href="#/b/verilmez">Kimlere verilmez?</a></div>
                    </section>
                </div>`;
            document.getElementById('tekrar').addEventListener('click', () => { yeniOyun(); render(true); app.focus({ preventScroll: true }); });
            hsub.textContent = 'Verebilir miyim?';
            document.title = 'Verebilir miyim? | Zekât ve Sadaka Rehberi';
            return 'kim';
        }
        const s = quiz.list[quiz.i], k = BY[s.konu];
        const cevaplandi = quiz.cevap !== null;
        const opt = (id) => {
            let cls = '';
            if (cevaplandi) cls = id === s.cevap ? ' is-right' : id === quiz.cevap ? ' is-wrong' : ' is-dim';
            const mark = cevaplandi && id === s.cevap ? '<span class="mark">✓</span>' : cevaplandi && id === quiz.cevap ? '<span class="mark">✗</span>' : '';
            return `<button type="button" class="opt2${cls}" data-c="${id}" data-cevap="${id}"${cevaplandi ? ' disabled' : ''}><span class="dot" style="background:var(--c)" aria-hidden="true"></span>${esc(HK[id].tam)}${mark}</button>`;
        };
        const ok = quiz.cevap === s.cevap;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero quiz">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${t} · ${quiz.dogru} doğru</span><div class="bar" role="progressbar" aria-label="İlerleme" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${quiz.i}"><b style="width:${Math.round((100 * quiz.i) / t)}%"></b></div></div>
                    <p class="quiz__ask">${kid() ? '🤔 ' : ''}Zekâtımı ya da fitremi…</p>
                    <p class="kisi" aria-hidden="true">${s.emo}</p>
                    <h1 class="quiz__q">${esc(s.ad)}</h1>
                    <p class="quiz__ref">…verebilir miyim?</p>
                    <div class="opts" role="group" aria-label="Cevaplar">${SECENEK.map(opt).join('')}</div>
                    ${cevaplandi ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status">
                        <p><b>${esc(ok ? c.dogru[quiz.i % c.dogru.length] : c.yanlis)}</b> ${hk(s.cevap, true)}</p>
                        <p>${esc(s.aciklama)}</p>
                        ${k.mezhep ? `<p><b>Mezhep farkı:</b> ${esc(k.mezhep)}</p>` : ''}
                        <p><b>Kaynak:</b> ${esc(k.kaynak.join('; '))} · <a href="#/k/${k.id}">${esc(k.ad)} konusunu aç</a></p>
                    </div>
                    <div class="btns"><button type="button" class="btn" id="sonraki">${quiz.i + 1 < t ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section>
            </div>`;
        app.querySelectorAll('[data-cevap]').forEach((bt) => bt.addEventListener('click', () => {
            if (quiz.cevap !== null) return;
            quiz.cevap = bt.dataset.cevap;
            if (quiz.cevap === s.cevap) quiz.dogru++;
            render(false);
            const nx = document.getElementById('sonraki'); if (nx) nx.focus({ preventScroll: true });
        }));
        const nx = document.getElementById('sonraki');
        if (nx) nx.addEventListener('click', () => { quiz.i++; quiz.cevap = null; render(true); window.scrollTo(0, 0); const f = app.querySelector('[data-cevap]'); if (f) f.focus({ preventScroll: true }); });
        hsub.textContent = 'Verebilir miyim?';
        document.title = 'Verebilir miyim? | Zekât ve Sadaka Rehberi';
        return 'kim';
    }

    // ---------- Alt panel ve görünüm ----------
    let sheetReturn = null;
    function openSheet(html, kind) { sheetReturn = document.activeElement; sheetBody.innerHTML = html; sheetBg.dataset.kind = kind || ''; sheetBg.classList.remove('out'); sheetBg.classList.add('on'); document.getElementById('sheetX').focus(); }
    function closeSheet() {
        if (!sheetBg.classList.contains('on')) return;
        const done = () => { sheetBg.classList.remove('on', 'out'); sheetBg.dataset.kind = ''; if (sheetReturn && sheetReturn.focus) sheetReturn.focus(); };
        if (reduceMotion.matches) { done(); return; }
        sheetBg.classList.add('out'); setTimeout(done, 220);
    }
    document.getElementById('sheetX').addEventListener('click', closeSheet);
    sheetBg.addEventListener('click', (e) => { if (e.target === sheetBg) closeSheet(); });
    document.addEventListener('keydown', (e) => {
        if (!sheetBg.classList.contains('on')) return;
        if (e.key === 'Escape') { closeSheet(); return; }
        if (e.key === 'Tab') {
            const f = Array.from(sheetBg.querySelectorAll('button, a[href]')).filter((x) => !x.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    function infoHtml() {
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Hükümler Diyanet İşleri Başkanlığı’na göre verilmiştir. Hanefî görüş ana metindir; Şâfiî mezhebinin farkı önemli yerlerde ayrıca yazılmıştır.</p>
            <ul>${DATA.kaynaklar.map((s) => `<li><b>${s.url ? dis(s.url, s.ad) : esc(s.ad)}</b> ${esc(s.not)}</li>`).join('')}</ul>
            <h4>Hüküm rozetleri</h4>
            <ul>${Object.entries(HK).map(([id, h]) => `<li>${hk(id)} ${esc(h.aciklama)}.</li>`).join('')}</ul>
            <h4>Hesaplayıcı</h4>
            <p>Hesaplayıcı yalnızca aritmetik yapar ve sonucu yaklaşık verir. Altın ve gümüş fiyatı internetten alınmaz; tutarlar cihazınızdan çıkmaz.</p>
            <h4>Not</h4>
            <p>Bu uygulama bir öğrenme rehberidir; kişiye özel fetva vermez. Kişisel durumunuz için Diyanet’e (müftülükler, 190 Alo Fetva hattı) danışın. Oruç fidyesi ve kefareti Oruç Rehberi ile aynı metin ve kaynaktır.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Sevdiğiniz şeylerden sarfetmedikçe iyiliğe erişemezsiniz.” (Âl-i İmrân 92)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, Mektep ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; kısa cümleler.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
            <h4>Renk</h4><div class="optrow">${opt('data-set-mode', 'light', m === 'light', 'Açık', 'Aydınlık ortamlar için.', ['#fffdf8', '#e9e0cf'])}${opt('data-set-mode', 'dark', m === 'dark', 'Koyu', 'Loş ortamlar ve gece için.', ['#0c1814', '#22213a'])}</div>`;
    }
    const lookSync = () => { if (sheetBg.dataset.kind === 'look' && sheetBg.classList.contains('on')) sheetBody.innerHTML = lookHtml(); };
    document.getElementById('lookBtn').addEventListener('click', () => openSheet(lookHtml(), 'look'));
    document.getElementById('infoBtn').addEventListener('click', () => openSheet(infoHtml(), 'info'));
    const THEME_KEY = 'apps:tema', MODE_KEY = 'theme';
    function paint() { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(document.body).backgroundColor); }
    function withReveal(origin, change) {
        if (!origin || !document.startViewTransition || reduceMotion.matches) { change(); paint(); return; }
        const b = origin.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        root.classList.add('theme-vt');
        const vt = document.startViewTransition(() => { change(); paint(); });
        vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 620, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
        vt.finished.finally(() => root.classList.remove('theme-vt'));
    }
    // Tema değişince hesaplayıcıdaki yazılmamış tutarlar kaybolmasın diye yalnızca gezinme ve hero yeniden çizilir.
    function rerender() { if (lastHash === 'hesapla') { drawNav('hesapla'); return; } render(false); }
    function setTheme(t, o) { if (t === root.dataset.theme) return; store(THEME_KEY, t); withReveal(o, () => { root.setAttribute('data-theme', t); rerender(); lookSync(); }); }
    function setMode(m, o) { if (m === root.dataset.mode) return; store(MODE_KEY, m); withReveal(o, () => { root.setAttribute('data-mode', m); lookSync(); }); }
    sheetBody.addEventListener('click', (e) => {
        const t = e.target.closest('[data-set-theme]'); if (t) { setTheme(t.dataset.setTheme, t); return; }
        const m = e.target.closest('[data-set-mode]'); if (m) setMode(m.dataset.setMode, m);
    });
    window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && (e.newValue === 'cocuk' || e.newValue === 'yetiskin') && e.newValue !== root.dataset.theme) { root.setAttribute('data-theme', e.newValue); rerender(); lookSync(); paint(); }
        if (e.key === MODE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) { root.setAttribute('data-mode', e.newValue); lookSync(); paint(); }
    });

    // ---------- Yönlendirme ----------
    // #/ rehber · #/b/<bölüm> · #/k/<konu> · #/siniflar · #/hesapla · #/kim · #/paylas
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mk = h.match(/^k\/([\w-]+)$/), mb = h.match(/^b\/([\w-]+)$/);
        let active;
        if (mk && BY[mk[1]]) active = viewKonu(BY[mk[1]]);
        else if (mb && BOL[mb[1]]) active = viewBolum(BOL[mb[1]]);
        else if (h === 'siniflar') active = viewSiniflar();
        else if (h === 'hesapla' && HESAP) active = viewHesapla();
        else if (h === 'kim') active = viewOyun();
        else if (h === 'paylas') active = viewPaylas();
        else active = viewHome();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && lastHash === 'kim' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
