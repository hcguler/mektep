// ============================================
// Giyim ve Görünüş — uygulama mantığı
// İçerik: data.js (GIYIM_DATA), ayet metinleri: ayetler.js (GIYIM_AYETLER, tools/giyim-uret.mjs üretir),
// çizimler: cizimler.js (GIYIM_CIZIM). Anlatım metni tools/giyim-anlatim.json içindedir; sayfada gösterilmez.
// Kayıtlar üretildiğinde ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.GIYIM_DATA;
    const AY = window.GIYIM_AYETLER || {};
    const CZ = window.GIYIM_CIZIM;
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app || !CZ) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.ogeler.map((o, i) => Object.assign({ n: i + 1 }, o));
    const BY = Object.fromEntries(ALL.map((o) => [o.id, o]));
    const BOL = Object.fromEntries(DATA.bolumler.map((b) => [b.id, b]));
    const KON = Object.fromEntries(DATA.konular.map((k) => [k.id, k]));
    const T = ALL.length;
    const AYET_SAY = new Set(ALL.flatMap((o) => o.ayetler || [])).size;
    const HADIS_SAY = ALL.reduce((s, o) => s + (o.hadisler || []).length, 0);
    const kayitAdi = (o) => `${String(o.n).padStart(2, '0')}-${o.id}`;

    // ---------- Kalıcı durum ----------
    const KEY = 'giyim:v1';
    const state = { okunan: {}, show: { ar: true, meal: true }, arSize: 2, mezhep: 'hanefi', cins: 'erkek' };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.okunan && typeof s.okunan === 'object') state.okunan = s.okunan;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (s.mezhep === 'hanefi' || s.mezhep === 'safii') state.mezhep = s.mezhep;
        if (s.cins === 'erkek' || s.cins === 'kadin') state.cins = s.cins;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const okunanSay = () => ALL.filter((o) => state.okunan[o.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Kur’an ve sahih sünnetle', title: 'Giyim ve <em>Görünüş</em>',
            lead: 'Erkek, kadın ve çocuk için kıyafet, örtünme, saç ve sakal: önce ayet, sonra sahih hadis, ardından Diyanet’in ve mezheplerin görüşü.',
            progress: (n) => n === 0 ? `${T} konu seni bekliyor.` : n === T ? 'Bütün konuları okudun.' : `${T} konudan ${n} tanesini okudun.`
        },
        cocuk: {
            kick: 'Güzel giyinelim!', title: '<span class="emo">👕</span> Giyim ve <em>Görünüş</em>',
            lead: 'Allah bizi en güzel şekilde yarattı. Nasıl giyinir, saçımıza nasıl bakarız? Ayetlerle ve Peygamberimizin sözleriyle öğrenelim!',
            progress: (n) => n === 0 ? `${T} konu var, hadi başlayalım! 🌟` : n === T ? 'Hepsini okudun, aferin! 🎉' : `${n} konu okudun, ${T - n} konu kaldı.`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        rehber: svg('<path d="M8 3 4 6v4l2 1v10h12V11l2-1V6l-4-3-2 2h-4z"/>'),
        ortu: svg('<circle cx="12" cy="5" r="2.5"/><path d="M8 21l1-9-3 4M16 21l-1-9 3 4M9 12q3-4 6 0"/><path d="M7 14h10" stroke-dasharray="2 2"/>'),
        konu: svg('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’'‘]/g, '');
    const hk = (o) => `<span class="hk" data-hk="${o.hukum.tur}" title="${esc(DATA.hukumler[o.hukum.tur])}">${esc(o.hukum.ad)}</span>`;
    const MEZHEP = { hanefi: 'Hanefî', safii: 'Şâfiî / Hanbelî' };

    let toastTimer = null;
    function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600); }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Rehber', alt: 'Bütün konular', icon: IC.rehber },
        { id: 'ortu', href: '#/ortu', ad: 'Örtünme', alt: 'Erkek ve kadın için sınır', icon: IC.ortu },
        { id: 'konu', href: '#/konu', ad: 'Konular', alt: 'Kıyafet, saç, sakal, süs', icon: IC.konu }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // ---------- Parçalar ----------
    function ogKart(o) {
        return `<li><a class="og${state.okunan[o.id] ? ' is-seen' : ''}" href="#/o/${o.id}">
                <span class="th" aria-hidden="true">${CZ.ciz(o.cizim, { mezhep: state.mezhep })}</span>
                <b>${kid() ? o.emo + ' ' : ''}${esc(o.ad)}</b><span class="oz">${esc(o.ozet)}</span>${hk(o)}
                <span class="seen" aria-hidden="true"></span>${state.okunan[o.id] ? '<span class="sr"> (okundu)</span>' : ''}</a></li>`;
    }
    const liste = (os) => `<ul class="ogeler">${os.map(ogKart).join('')}</ul>`;
    function bolumKartlari(aktif) {
        return `<div class="bolumler">${DATA.bolumler.map((b) => `<a class="bk" href="#/b/${b.id}"${b.id === aktif ? ' aria-current="true"' : ''}><span class="emo" aria-hidden="true">${b.emo}</span><b>${esc(b.ad)}</b><small>${esc(b.alt)}</small></a>`).join('')}</div>`;
    }
    function konuCipleri(aktif) {
        return `<nav class="kchips" aria-label="Konular">${DATA.konular.map((k) => `<a href="#/konu/${k.id}"${k.id === aktif ? ' aria-current="true"' : ''}><span class="emo" aria-hidden="true">${k.emo}</span>${esc(k.ad)}</a>`).join('')}</nav>`;
    }
    // Örtünme çizimi: cinsiyet ve mezhep seçimiyle
    function ortuKutu(cins, secici) {
        const kadin = cins === 'kadin';
        const seg = (attr, val, label, on) => `<button type="button" data-${attr}="${val}" aria-pressed="${on}">${label}</button>`;
        const lg = kadin
            ? `<li><span><b>Yüz ve eller</b> her iki görüşte de açık kalabilir.</span></li>
               <li><span><b>Ayaklar:</b> ${state.mezhep === 'hanefi' ? 'Hanefî mezhebinde sahih görüşe göre avret değildir.' : 'Şâfiî ve Hanbelî mezhebinde namazda örtülür.'}</span></li>
               <li class="tarali"><span><b>Bunların dışındaki beden</b>, sarkan saçlar dahil örtülür. ${state.mezhep === 'safii' ? 'Bu iki mezhepte ağırlıklı görüş, namaz dışında yüz ve ellerin de örtülmesidir.' : ''}</span></li>`
            : `<li class="tarali"><span><b>Göbek ile diz kapağı arası</b> örtülür.</span></li>
               <li><span><b>Diz kapağı:</b> ${state.mezhep === 'hanefi' ? 'Hanefî mezhebinde örtülecek yere dahildir; göbek dahil değildir.' : 'Şâfiî ve Hanbelî mezhebinde göbek de diz kapağı da dahil değildir.'}</span></li>
               <li><span>Bu sınırın dışındaki yerler de <b>örf ve edebe göre</b> örtülür.</span></li>`;
        return `<figure class="cizim" id="ortuKutu">
                ${secici ? `<div class="segs"><div class="seg3" role="group" aria-label="Kimin için">${seg('cins', 'erkek', 'Erkek', !kadin)}${seg('cins', 'kadin', 'Kadın', kadin)}</div>` : '<div class="segs">'}
                <div class="seg3" role="group" aria-label="Mezhep">${seg('mezhep', 'hanefi', 'Hanefî', state.mezhep === 'hanefi')}${seg('mezhep', 'safii', 'Şâfiî / Hanbelî', state.mezhep === 'safii')}</div></div>
                ${CZ.ciz(kadin ? 'kadin-avret' : 'erkek-avret', { mezhep: state.mezhep })}
                <ul class="legend">${lg}</ul>
                <figcaption>${esc(CZ.bilgi[kadin ? 'kadin-avret' : 'erkek-avret'].not)} Kaynak: TDV İslâm Ansiklopedisi, “Setr-i Avret”; Diyanet İlmihali.</figcaption>
            </figure>`;
    }
    function bindOrtu(rerender) {
        app.querySelectorAll('[data-mezhep]').forEach((b) => b.addEventListener('click', () => { if (state.mezhep === b.dataset.mezhep) return; state.mezhep = b.dataset.mezhep; save(); rerender(); }));
        app.querySelectorAll('[data-cins]').forEach((b) => b.addEventListener('click', () => { if (state.cins === b.dataset.cins) return; state.cins = b.dataset.cins; save(); rerender(); }));
    }
    function yenileOrtu(cins, secici) {
        const k = document.getElementById('ortuKutu');
        if (!k) return;
        const odak = document.activeElement && document.activeElement.closest('#ortuKutu') ? (document.activeElement.dataset.mezhep ? `[data-mezhep="${document.activeElement.dataset.mezhep}"]` : `[data-cins="${document.activeElement.dataset.cins}"]`) : null;
        k.outerHTML = ortuKutu(cins(), secici);
        bindOrtu(() => yenileOrtu(cins, secici));
        if (odak) { const f = app.querySelector('#ortuKutu ' + odak); if (f) f.focus(); }
    }

    // ---------- Rehber ----------
    let aramaMetni = '';
    function viewHome() {
        const c = copy();
        const n = okunanSay();
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="cizim" style="box-shadow:none;border:0;background:none;padding:6px 0 0">${CZ.ciz('uclu')}</div>
                    <div class="stats"><span><b>${T}</b> konu</span><span><b>${AYET_SAY}</b> ayet</span><span><b>${HADIS_SAY}</b> sahih hadis</span></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Okunan konular" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                </section>
                ${bolumKartlari()}
                <div class="filters">
                    <label class="search">${IC.search}<span class="sr">Konu ara</span><input type="search" id="ara" placeholder="Ara: sakal, başörtüsü, altın, saç boyası…" value="${esc(aramaMetni)}" autocomplete="off"></label>
                </div>
                <div id="liste" style="display:grid;gap:22px"></div>
            </div>`;
        const lst = document.getElementById('liste'), ara = document.getElementById('ara');
        const ciz = () => {
            const q = norm(aramaMetni.trim());
            const uy = (o) => !q || norm([o.ad, o.ozet, o.aciklama, o.hukum.ad, BOL[o.bolum].ad, o.konu.map((k) => KON[k].ad).join(' ')].join(' ')).includes(q);
            const html = DATA.bolumler.map((b) => { const os = ALL.filter((o) => o.bolum === b.id && uy(o)); return os.length ? `<section class="grup"><h2>${esc(b.ad)}<small>${os.length} konu</small></h2>${liste(os)}</section>` : ''; }).join('');
            lst.innerHTML = html || '<p class="empty">Bu aramaya uyan konu yok.</p>';
        };
        ciz();
        ara.addEventListener('input', () => { aramaMetni = ara.value; ciz(); });
        hsub.textContent = 'Rehber';
        document.title = 'Giyim ve Görünüş';
        return '';
    }

    // ---------- Bölüm ----------
    function viewBolum(b) {
        const os = ALL.filter((o) => o.bolum === b.id);
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Rehber</a><span class="pos">${os.length} konu</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? b.emo + ' ' : ''}Bölüm</div>
                    <h1>${esc(b.ad)}</h1>
                    <p class="lead">${esc(b.alt)}</p>
                </section>
                ${bolumKartlari(b.id)}
                ${liste(os)}
            </div>`;
        hsub.textContent = b.ad;
        document.title = `${b.ad} | Giyim ve Görünüş`;
        return '';
    }

    // ---------- Konular ----------
    function viewKonu(k) {
        const os = k ? ALL.filter((o) => o.konu.includes(k.id)) : [];
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🧭 ' : ''}Konular</div>
                    <h1>${k ? esc(k.ad) : 'Ne öğrenmek istersin?'}</h1>
                    <p class="lead">${k ? `${os.length} konu. Bölümlerden bağımsız olarak bu başlıktaki bütün konular.` : 'Bir başlık seç; erkek, kadın ve çocuk için o başlıktaki bütün konuları gör.'}</p>
                </section>
                ${konuCipleri(k && k.id)}
                ${k ? `<div id="sonuc">${liste(os)}</div>` : ''}
            </div>`;
        hsub.textContent = k ? k.ad : 'Konular';
        document.title = `${k ? k.ad + ' · ' : ''}Konular | Giyim ve Görünüş`;
        return 'konu';
    }

    // ---------- Örtünme ----------
    function viewOrtu() {
        const ilgili = ALL.filter((o) => o.ortu || o.id === 'ortunun-nitelikleri' || o.id === 'cocugun-ortunmesi');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🧥 ' : ''}Örtünme sınırı</div>
                    <h1>Nereler <em>örtülür?</em></h1>
                    <p class="lead">Erkek ve kadın için örtülmesi farz olan yerler; Hanefî ile Şâfiî ve Hanbelî mezhepleri arasındaki fark çizim üzerinde.</p>
                </section>
                ${ortuKutu(state.cins, true)}
                <section class="blok"><h2>Ayrıntı ve deliller</h2>${liste(ilgili)}</section>
            </div>`;
        bindOrtu(() => yenileOrtu(() => state.cins, true));
        hsub.textContent = 'Örtünme';
        document.title = 'Örtünme sınırı | Giyim ve Görünüş';
        return 'ortu';
    }

    // ---------- Öge sayfası ----------
    function viewbar() {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const box = app.querySelector('.ayetler');
        const apply = () => {
            if (box) { ['ar', 'meal'].forEach((k) => box.classList.toggle('hide-' + k, !state.show[k])); box.dataset.ar = state.arSize; }
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            const sb = app.querySelectorAll('[data-size]');
            if (sb.length) { sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; }
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            if (state.show[k] && Object.values(state.show).filter(Boolean).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }
    function viewOge(o) {
        const prev = ALL[o.n - 2], next = ALL[o.n];
        if (!state.okunan[o.id]) { state.okunan[o.id] = 1; save(); }
        const b = BOL[o.bolum];
        const ayetler = (o.ayetler || []).filter((r) => AY[r]);
        const bilgi = CZ.bilgi[o.cizim] || {};
        const cizim = o.ortu ? ortuKutu(o.ortu, false)
            : `<figure class="cizim">${CZ.ciz(o.cizim, { mezhep: state.mezhep })}${bilgi.liste ? `<ol>${bilgi.liste.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}${bilgi.not ? `<figcaption>${esc(bilgi.not)}</figcaption>` : ''}</figure>`;
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/b/${b.id}">${IC.left}${esc(b.ad)}</a><span class="pos">${o.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? o.emo + ' ' : ''}${esc(b.ad)}</div>
                    <h1>${esc(o.ad)}</h1>
                    <p class="lead">${esc(o.ozet)}</p>
                    ${hk(o)}
                    <div data-anlatim="${kayitAdi(o)}"></div>
                </section>
                ${cizim}
                <section class="sc expl"><div class="kick">Kısaca</div><p>${esc(o.aciklama)}</p></section>
                ${ayetler.length ? `<section class="blok"><h2>Kur’an</h2>${viewbar()}<div class="ayetler">${ayetler.map((r) => { const a = AY[r]; return `<div class="ayet"><p class="ar" lang="ar">${esc(a.ar)}</p><p class="meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${esc(a.no)}. ayet</p></div>`; }).join('')}</div></section>` : ''}
                ${(o.hadisler || []).length ? `<section class="blok"><h2>Sünnet <small>sahih hadis</small></h2>${o.hadisler.map((h) => `<figure class="hadis"><p>“${esc(h.metin)}”</p><figcaption class="ravi"><span>Râvi: <b>${esc(h.ravi)}</b></span><span>${esc(h.kaynak)}</span></figcaption></figure>`).join('')}</section>` : ''}
                ${o.fikih ? `<section class="blok"><h2>Fıkıh <small>Diyanet ve mezhepler</small></h2><div class="fikih"><p>${esc(o.fikih.metin)}</p><p class="fk"><b>Kaynak:</b> ${esc(o.fikih.kaynak)}</p></div></section>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(o.akilda)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> ${esc(o.kaynak)}${ayetler.length ? ` Arapça: Tanzil. Meal: ${esc(DATA.meal)}.` : ''}${(o.hadisler || []).length ? ' Hadis metinleri anlam olarak aktarılmıştır.' : ''}</p>
                <nav class="pager" aria-label="Önceki ve sonraki konu">
                    ${prev ? `<a href="#/o/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/o/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        if (o.ortu) bindOrtu(() => yenileOrtu(() => o.ortu, false));
        hsub.textContent = o.ad;
        document.title = `${o.ad} | Giyim ve Görünüş`;
        return '';
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
            <p>Her konuda sıra aynıdır: önce Kur’an, sonra sahih hadis, ardından fıkıh.</p>
            <ul>
                <li><b>Kur’an:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}, değiştirilmeden.</li>
                <li><b>Hadis:</b> Yalnızca Buhârî ve Müslim’den. Künyeler (kitap, bölüm, numara, râvi) bu iki eserin metinleriyle otomatik karşılaştırılmıştır; Müslim numarası M. Fuâd Abdülbâkî numarasıdır. Hadis metinleri Türkçeye anlam olarak aktarılmıştır.</li>
                <li><b>Fıkıh:</b> Diyanet İşleri Başkanlığı (İlmihal, Din İşleri Yüksek Kurulu kararları ve fetvaları) esas alınmıştır. Mezhep farkları TDV İslâm Ansiklopedisi’nden (“Setr-i Avret”, “Tesettür”, “Sakal”, “Saç”, “Âkıl”) aktarılmış ve kimin görüşü olduğu belirtilmiştir.</li>
                <li><b>Çizimler:</b> Yüzsüz, genel figürlerdir. Peygamberlerin ve sahabenin yüzü, bedeni çizilmez.</li>
            </ul>
            <h4>Not</h4>
            <p>Bu uygulama bir öğrenme rehberidir. Size özel bir durumda bir din görevlisine ya da Diyanet’in 190 Alo Fetva hattına danışın.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Takva elbisesi ise daha hayırlıdır.” (A‘râf 26)</p>`;
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
    function setTheme(t, o) { if (t === root.dataset.theme) return; store(THEME_KEY, t); withReveal(o, () => { root.setAttribute('data-theme', t); render(false); lookSync(); }); }
    function setMode(m, o) { if (m === root.dataset.mode) return; store(MODE_KEY, m); withReveal(o, () => { root.setAttribute('data-mode', m); lookSync(); }); }
    sheetBody.addEventListener('click', (e) => {
        const t = e.target.closest('[data-set-theme]'); if (t) { setTheme(t.dataset.setTheme, t); return; }
        const m = e.target.closest('[data-set-mode]'); if (m) setMode(m.dataset.setMode, m);
    });
    window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && (e.newValue === 'cocuk' || e.newValue === 'yetiskin') && e.newValue !== root.dataset.theme) { root.setAttribute('data-theme', e.newValue); render(false); lookSync(); paint(); }
        if (e.key === MODE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) { root.setAttribute('data-mode', e.newValue); lookSync(); paint(); }
    });

    // ---------- Yönlendirme ----------
    // #/ rehber · #/o/<id> · #/b/<bölüm> · #/konu[/<konu>] · #/ortu
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mo = h.match(/^o\/([\w-]+)$/), mb = h.match(/^b\/([\w-]+)$/), mk = h.match(/^konu(?:\/([\w-]+))?$/);
        let active;
        if (mo && BY[mo[1]]) active = viewOge(BY[mo[1]]);
        else if (mb && BOL[mb[1]]) active = viewBolum(BOL[mb[1]]);
        else if (mk) active = viewKonu(KON[mk[1]] || null);
        else if (h === 'ortu') active = viewOrtu();
        else active = viewHome();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        const konuIci = lastHash !== null && /^konu/.test(lastHash) && /^konu\//.test(h);
        lastHash = h;
        render(!konuIci);
        if (konuIci) { const s = document.getElementById('sonuc'); if (s) s.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' }); }
        else if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
