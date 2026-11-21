// ============================================
// Siyer Çizelgesi — uygulama mantığı
// İçerik: data.js (SIYER_DATA), ayetler: ayetler.js (SIYER_AYETLER, tools/siyer-uret.mjs üretir).
// Anlatım metinleri tools/siyer-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından
// çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.SIYER_DATA;
    const AYET = window.SIYER_AYETLER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.olaylar.map((o, i) => Object.assign({ n: i + 1 }, o));
    const BY = Object.fromEntries(ALL.map((o) => [o.id, o]));
    const DON = Object.fromEntries(DATA.donemler.map((d) => [d.id, d]));
    const YER = Object.fromEntries(DATA.yerler.map((y) => [y.id, y]));
    const T = ALL.length;
    const Y0 = DATA.donemler[0].yil[0], Y1 = DATA.donemler[DATA.donemler.length - 1].yil[1];
    const anaYer = (id) => (YER[id] && YER[id].ust) || id;

    // ---------- Kalıcı durum ----------
    const KEY = 'siyer:v1';
    const state = { seen: {}, show: { ar: true, meal: true }, arSize: 2, best: 0, last: null, yer: 'mekke' };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.seen && typeof s.seen === 'object') state.seen = s.seen;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (Number.isInteger(s.best)) state.best = s.best;
        if (s.last && BY[s.last]) state.last = s.last;
        if (s.yer && YER[s.yer] && !YER[s.yer].ust) state.yer = s.yer;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const seenCount = () => ALL.filter((o) => state.seen[o.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Siyer', title: 'Siyer <em>Çizelgesi</em>',
            lead: 'Peygamberimizin doğumundan vefatına otuz olay. Her biri tarihi, yeri ve ilgili ayet ya da sahih hadisle.',
            progress: (n) => n === 0 ? `${T} olayın hepsi seni bekliyor.` : n === T ? 'Bütün olayları okudun.' : `${T} olaydan ${n} tanesini okudun.`,
            resume: 'Devam et', start: 'Doğumdan başla',
            right: 'Doğru.', wrong: 'Yanlış.',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Çizelgeye göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Peygamberimizin hayatı', title: '<span class="emo">🌙</span> Siyer <em>Çizelgesi</em>',
            lead: 'Peygamberimiz nasıl yaşadı? Doğduğu günden vefatına kadar otuz durak seni bekliyor!',
            progress: (n) => n === 0 ? `${T} olay seni bekliyor! 🗺️` : n === T ? 'Bütün olayları okudun! 🎉' : `${n} olay okudun, ${T - n} olay kaldı.`,
            resume: 'Devam et', start: 'Hadi başlayalım',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Çizelgeye bakıp yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        line: svg('<path d="M6 3v18"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M11 7h9M11 17h6"/>'),
        map: svg('<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>'),
        quiz: svg('<path d="M4 7h11M4 12h7M4 17h11"/><path d="m16 10 3 3-3 3"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const yil = (o) => o.yl || String(Math.floor(o.t));
    const refTxt = (r) => { const a = AYET[r]; return a ? `${a.sure} ${a.no}` : r; };
    function ayBlock(r) {
        const a = AYET[r];
        if (!a) return '';
        return `<div class="ay"><p class="ayet-ar" lang="ar">${esc(a.ar)}</p><p class="ayet-meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p></div>`;
    }

    let toastTimer = null;
    function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600); }
    function burst(el) {
        if (!kid() || reduceMotion.matches || !el) return;
        const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const colors = ['#ffb703', '#ff7f9c', '#63cbe2', '#7b61ff'];
        for (let i = 0; i < 14; i++) {
            const s = document.createElement('i'); s.className = 'burst';
            const a = (Math.PI * 2 * i) / 14, d = 70 + Math.random() * 70;
            s.style.left = (cx - 9) + 'px'; s.style.top = (cy - 9) + 'px'; s.style.background = colors[i % 4];
            s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', (Math.sin(a) * d - 30) + 'px');
            document.body.appendChild(s); setTimeout(() => s.remove(), 950);
        }
    }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Çizelge', alt: 'Otuz olay, yıl yıl', icon: IC.line },
        { id: 'harita', href: '#/harita', ad: 'Harita', alt: 'Olaylar nerede oldu?', icon: IC.map },
        { id: 'test', href: '#/test', ad: 'Hangisi önce?', alt: 'Sıralama oyunu', icon: IC.quiz }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // görünüm düğmeleri (Arapça / Anlam / yazı boyutu)
    function viewbar() {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        return `<div class="viewbar" role="group" aria-label="Ayetlerde gösterilecek metinler">
                <div class="chips" style="grid-template-columns:repeat(2,minmax(0,1fr))">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const boxes = app.querySelectorAll('.delils');
        const apply = () => {
            boxes.forEach((b) => { ['ar', 'meal'].forEach((k) => b.classList.toggle('hide-' + k, !state.show[k])); b.dataset.ar = state.arSize; });
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

    // ---------- Çizelge ----------
    function hayat() {
        const w = (d) => ((d.yil[1] - d.yil[0]) / (Y1 - Y0)) * 100;
        const x = (t) => ((t - Y0) / (Y1 - Y0)) * 100;
        const segs = DATA.donemler.map((d) => `<i class="c-${d.id}" style="width:${w(d)}%"></i>`).join('');
        const dots = ALL.map((o) => `<span class="hayat__dot${state.seen[o.id] ? ' is-seen' : ''}" style="left:${x(o.t).toFixed(2)}%"></span>`).join('');
        const yrs = [Y0, ...DATA.donemler.map((d) => d.yil[1])].map((y) => `<span style="left:${x(y)}%">${y}</span>`).join('');
        return `<div class="hayat" role="img" aria-label="Hayat çizgisi: ${Y0}–${Y1}; peygamberlikten önce, Mekke dönemi ve Medine dönemi">
                <div class="hayat__bar">${segs}${dots}</div>
                <div class="hayat__yrs" aria-hidden="true">${yrs}</div>
                <div class="hayat__key" aria-hidden="true">${DATA.donemler.map((d) => `<span class="c-${d.id}">${esc(d.ad)}</span>`).join('')}</div>
            </div>`;
    }
    function viewCizelge() {
        const c = copy();
        const n = seenCount();
        const last = state.last && BY[state.last];
        const g = AYET[DATA.giris.ayet];
        const lists = DATA.donemler.map((d) => {
            const items = ALL.filter((o) => o.d === d.id).map((o) => `<li class="stop${state.seen[o.id] ? ' is-seen' : ''}"><a href="#/o/${o.id}">
                    <span class="medal" aria-hidden="true"><span class="n">${yil(o)}</span><span class="emo">${o.emo}</span></span>
                    <span class="when">${esc(o.tarih)}${o.yas !== undefined ? ' · ' + esc(o.yas) + ' yaş' : ''}</span>
                    <b>${esc(o.baslik)}</b><small>${esc(o.kisa)}</small>
                    ${state.seen[o.id] ? '<span class="sr"> (okundu)</span>' : ''}</a></li>`).join('');
            return `<div class="donem c-${d.id}"><div><h2>${esc(d.ad)}</h2><small>${esc(d.alt)}</small></div></div><ol class="yol c-${d.id}">${items}</ol>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    ${hayat()}
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Okunan olaylar" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="btns">${last ? `<a class="btn" href="#/o/${last.id}">${IC.go}${esc(c.resume + ': ' + last.baslik)}</a>` : `<a class="btn" href="#/o/${ALL[0].id}">${IC.go}${esc(c.start)}</a>`}<a class="btn alt" href="#/test">${IC.quiz}Hangisi önce?</a></div>
                </section>
                ${g ? `<section class="sc delil"><div class="kick">Ahzâb 21</div><p class="quote" style="margin-top:6px">“${esc(g.meal)}”</p></section>` : ''}
                ${lists}
                <p class="note"><b>Not:</b> Tarihler milâdîdir ve siyer kaynaklarındaki yaygın kabule göredir; bazı olayların tarihi hakkında farklı görüşler vardır. Yaşlar, siyer geleneğindeki gibi kamerî (ay) yılıyla verilir.</p>
            </div>`;
        hsub.textContent = 'Çizelge';
        document.title = 'Siyer Çizelgesi';
        return '';
    }

    // ---------- Olay sayfası ----------
    function viewOlay(o) {
        const prev = ALL[o.n - 2], next = ALL[o.n];
        state.seen[o.id] = true; state.last = o.id; save();
        const d = DON[o.d], y = YER[o.yer];
        const facts = [`<span><b>Tarih:</b> ${esc(o.tarih)}</span>`];
        if (o.yas !== undefined) facts.push(`<span><b>Yaşı:</b> ${esc(o.yas)}</span>`);
        if (y) facts.push(`<a class="fact-link" href="#/harita/${anaYer(y.id)}" aria-label="Yer: ${esc(y.ad)}, haritada göster"><b>Yer:</b> ${esc(y.ad)} ${IC.map}</a>`);
        const ay = (o.ayetler || []).map(ayBlock).join('');
        const h = o.hadis;
        // Sahabe Hayatları'ndaki ilgili kesitler (apps/sahabe/siyer-baglanti.js, tools/sahabe-uret.mjs üretir)
        const sh = (window.SAHABE_SIYER || {})[o.id] || [];
        const kaynak = [];
        if (o.ayetler && o.ayetler.length) kaynak.push('Kur’an-ı Kerîm, ' + o.ayetler.map(refTxt).join('; ') + '. Meal: ' + DATA.meal);
        if (h) kaynak.push(h.kaynak + ' (hadis anlam olarak aktarılmıştır)');
        kaynak.push('Tarih ve yer: siyer kaynaklarındaki yaygın bilgi');
        app.innerHTML = `
            <div class="page in c-${o.d}">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Çizelge</a><span class="pos">${o.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? o.emo + ' ' : ''}${esc(d.ad)}</div>
                    <h1>${esc(o.baslik)}</h1>
                    <p class="lead">${esc(o.kisa)}</p>
                    <div data-anlatim="${String(o.n).padStart(2, '0')}-${o.id}"></div>
                    <div class="facts">${facts.join('')}</div>
                </section>
                <section class="sc expl"><div class="kick">Ne oldu?</div><p>${esc(o.metin)}</p></section>
                ${ay ? `<h2 class="secttl">İlgili ${o.ayetler.length > 1 ? 'ayetler' : 'ayet'}</h2>${viewbar()}<div class="ayetler delils">${ay}</div>` : ''}
                ${h ? `<h2 class="secttl">Hadis</h2><figure class="hadis"><blockquote>${esc(h.metin)}</blockquote><figcaption><b>${esc(h.kaynak)}</b><br>Ravi: ${esc(h.ravi)}</figcaption></figure>` : ''}
                ${o.not ? `<p class="pnote"><b>Not:</b> ${esc(o.not)}</p>` : ''}
                ${sh.length ? `<h2 class="secttl">Bu olayda sahabiler</h2><ul class="sahabe-links">${sh.map((x) => `<li><a href="../sahabe/#/s/${esc(x.id)}"><b>${esc(x.ad)}</b><small>${esc(x.baslik)}</small>${IC.go}</a></li>`).join('')}</ul>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(o.ders)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> ${kaynak.map(esc).join('. ')}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki olay">
                    ${prev ? `<a href="#/o/${prev.id}"><small>Önceki · ${yil(prev)}</small><b>${esc(prev.baslik)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/o/${next.id}"><small>Sonraki · ${yil(next)}</small><b>${esc(next.baslik)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = o.baslik;
        document.title = `${o.baslik} | Siyer Çizelgesi`;
        return '';
    }

    // ---------- Harita (şematik, yaklaşık konumlar) ----------
    // Eşdikdörtgen izdüşüm; enlem 22,5° için boylam ölçeği küçültülür.
    const B = { lon0: 32, lon1: 44.1, lat0: 12.4, lat1: 32.5 }, S = 46, KX = Math.cos((22.5 * Math.PI) / 180);
    const px = (lon) => +((lon - B.lon0) * S * KX).toFixed(1), py = (lat) => +((B.lat1 - lat) * S).toFixed(1);
    const W = px(B.lon1), H = py(B.lat0);
    const pts = (a) => a.map(([la, lo]) => `${px(lo)},${py(la)}`).join(' ');
    // Kıyılar kabaca çizilmiştir (enlem, boylam).
    const KIZILDENIZ = [[29.97, 32.55], [28.35, 33.08], [27.25, 33.81], [26.1, 34.28], [25.07, 34.89], [23.95, 35.47], [22.22, 36.64], [19.6, 37.22], [19.1, 37.33], [15.6, 39.45], [13.0, 42.74], [12.4, 43.3], [12.4, 44.1], [12.75, 44.1], [12.65, 43.45], [13.32, 43.25], [16.89, 42.55], [19.13, 41.08], [20.15, 40.27], [21.49, 39.18], [22.8, 39.03], [24.09, 38.06], [25.02, 37.27], [26.23, 36.45], [27.35, 35.69], [27.95, 34.6], [29.29, 34.94], [29.53, 35.0], [29.49, 34.9], [29.0, 34.67], [28.5, 34.51], [27.9, 34.33], [28.24, 33.62], [28.9, 33.2], [29.6, 32.7]];
    const AKDENIZ = [[32.5, 34.9], [32.05, 34.75], [31.5, 34.45], [31.13, 33.8], [31.26, 32.3], [31.3, 32], [32.5, 32]];
    const ETIKET = { mekke: 'l', medine: 'r', taif: 'r', bedir: 'l', hayber: 'r', tebuk: 'r', kudus: 'r', habesistan: 'r', huneyn: 'r' };
    function haritaSvg(sel) {
        const yerler = DATA.yerler.filter((y) => !y.ust);
        const m = YER.mekke, md = YER.medine;
        const nok = yerler.map((y) => {
            const x = px(y.lon), yy = py(y.lat), sag = ETIKET[y.id] !== 'l';
            const n = ALL.filter((o) => anaYer(o.yer) === y.id).length;
            return `<a class="nok${y.id === sel ? ' is-on' : ''}" href="#/harita/${y.id}" aria-label="${esc(y.ad)}: ${n} olay"${y.id === 'huneyn' ? ' transform="translate(0,-4)"' : ''}>
                    <circle class="hit" cx="${x}" cy="${yy}" r="22"/><circle class="d" cx="${x}" cy="${yy}" r="7"/>
                    <text x="${sag ? x + 13 : x - 13}" y="${y.id === 'huneyn' ? yy - 8 : yy + 5}" text-anchor="${sag ? 'start' : 'end'}">${esc(y.ad)}</text></a>`;
        }).join('');
        const grid = [15, 20, 25, 30].map((la) => `<line class="grid" x1="0" x2="${W}" y1="${py(la)}" y2="${py(la)}"/>`).join('') + [34, 38, 42].map((lo) => `<line class="grid" y1="0" y2="${H}" x1="${px(lo)}" x2="${px(lo)}"/>`).join('');
        const mx = px(m.lon), my = py(m.lat), nx = px(md.lon), ny = py(md.lat);
        return `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Arap Yarımadası ve çevresinin şematik haritası">
                <rect class="kara" width="${W}" height="${H}"/>${grid}
                <polygon class="deniz" points="${pts(KIZILDENIZ)}"/><polygon class="deniz" points="${pts(AKDENIZ)}"/>
                <text class="denizad" transform="translate(${px(36.3)},${py(22.6)}) rotate(-58)" text-anchor="middle">KIZILDENİZ</text>
                <text class="denizad" x="${px(32.15)}" y="${py(32.0)}">AKDENİZ</text>
                <path class="yol-h" d="M${mx},${my} C${mx - 30},${(my + ny) / 2 + 40} ${nx - 40},${(my + ny) / 2 - 20} ${nx},${ny}"/>
                <text class="yol-ad" x="${(mx + nx) / 2 - 44}" y="${(my + ny) / 2 + 18}" text-anchor="end">HİCRET</text>
                ${nok}
            </svg>`;
    }
    function viewHarita(sel) {
        if (!sel || !YER[sel] || YER[sel].ust) sel = state.yer;
        if (sel !== state.yer) { state.yer = sel; save(); }
        const y = YER[sel];
        const olaylar = ALL.filter((o) => anaYer(o.yer) === sel);
        const alt = DATA.yerler.filter((x) => x.ust === sel);
        const chips = DATA.yerler.filter((x) => !x.ust).map((x) => `<button type="button" data-yer="${x.id}" aria-pressed="${x.id === sel}">${esc(x.ad)}<small>${ALL.filter((o) => anaYer(o.yer) === x.id).length}</small></button>`).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🗺️ ' : ''}Harita</div>
                    <h1>Olaylar nerede oldu?</h1>
                    <p class="lead">Bir yere dokun; orada yaşanan olaylar aşağıda listelensin.</p>
                </section>
                <div class="harita-wrap">
                    <div class="harita">${haritaSvg(sel)}<p class="harita-cap">Şematik harita; konumlar ve kıyılar yaklaşıktır.</p></div>
                    <div style="display:grid;gap:14px">
                        <div class="yerler" role="group" aria-label="Yerler">${chips}</div>
                        <section class="sc" aria-live="polite"><div class="kick">${esc(y.ad)}</div>
                            ${y.not ? `<p class="lead" style="margin-top:6px">${esc(y.not)}</p>` : ''}
                            ${alt.length ? `<p class="prog__txt" style="margin-top:6px">Yakınındaki yerler: ${alt.map((a) => esc(a.ad)).join(', ')}.</p>` : ''}
                            <div class="yer-olay" style="margin-top:14px">${olaylar.map((o) => `<a class="c-${o.d}" href="#/o/${o.id}"><span class="yr">${yil(o)}</span><b>${esc(o.baslik)}</b><small>${o.yer !== sel ? esc(YER[o.yer].ad) + ' · ' : ''}${esc(o.kisa)}</small></a>`).join('')}</div>
                        </section>
                    </div>
                </div>
            </div>`;
        app.querySelectorAll('[data-yer]').forEach((b) => b.addEventListener('click', () => { location.hash = '#/harita/' + b.dataset.yer; }));
        hsub.textContent = 'Harita';
        document.title = `${y.ad} · Harita | Siyer Çizelgesi`;
        return 'harita';
    }

    // ---------- Hangisi önce? ----------
    const ROUND = 10;
    let quiz = null;
    const rnd = (n) => Math.floor(Math.random() * n);
    function newQuiz() {
        const list = [], used = new Set();
        let guard = 0;
        while (list.length < ROUND && guard++ < 500) {
            const pool = ALL.filter((o) => o.oyun !== false);
            const a = pool[rnd(pool.length)], b = pool[rnd(pool.length)];
            if (a === b || Math.floor(a.t) === Math.floor(b.t)) continue;
            const key = [a.id, b.id].sort().join('|');
            if (used.has(key)) continue;
            used.add(key); list.push([a, b]);
        }
        quiz = { list, i: 0, score: 0, answered: null };
    }
    function viewTest() {
        if (!quiz) newQuiz();
        const c = copy();
        const total = quiz.list.length;
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > state.best) { state.best = n; save(); }
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}Sonuç</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/">${IC.line}Çizelgeye dön</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const [a, b] = quiz.list[quiz.i], ans = quiz.answered;
            const first = a.t < b.t ? a : b;
            const card = (o) => {
                let cls = '';
                if (ans) cls = o === first ? ' is-right' : o.id === ans ? ' is-wrong' : '';
                return `<button type="button" class="${cls.trim()}" data-ans="${o.id}"${ans ? ' disabled' : ''}>${kid() ? `<span aria-hidden="true" style="font-size:1.5rem">${o.emo}</span>` : ''}<b>${esc(o.baslik)}</b><small>${esc(o.kisa)}</small>${ans ? `<span class="yr">${esc(o.tarih)}</span>` : ''}</button>`;
            };
            const ok = ans && ans === first.id;
            app.innerHTML = `
                <div class="page in"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    <p class="quiz__ask">Sıralama</p>
                    <p class="quiz__q">Hangisi daha önce oldu?</p>
                    <div class="ikili" role="group" aria-label="Seçenekler" style="margin-top:16px">${card(a)}<span class="veya" aria-hidden="true">YA DA</span>${card(b)}</div>
                    ${ans ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> Önce olan: ${esc(first.baslik)}, ${esc(first.tarih)}. <a href="#/o/${first.id}">Olayı aç</a></div>
                        <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section></div>`;
            app.querySelectorAll('[data-ans]').forEach((btn) => btn.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = btn.dataset.ans;
                const right = quiz.answered === first.id;
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.ikili .is-right')); else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = 'Hangisi önce?';
        document.title = 'Hangisi önce? | Siyer Çizelgesi';
        return 'test';
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
            <p>Her olay üç tür kaynağa dayanır ve hangisinin nereden geldiği sayfada ayrı ayrı yazılır.</p>
            <ul>
                <li><b>Kur'an:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}. Ayet, olayın kendisini anlatıyorsa ya da konusuyla doğrudan ilgiliyse verilir.</li>
                <li><b>Hadis:</b> Yalnızca Buhârî ve Müslim. Hadisler anlam olarak, kısaltılarak aktarılır. Buhârî numarası genel hadis numarası, Müslim numarası M. Fuâd Abdülbâkî numarasıdır.</li>
                <li><b>Tarih, yer ve yaş:</b> Siyer kaynaklarındaki yaygın bilgi (İbn Hişâm, es-Sîretü’n-nebeviyye ve sonraki siyer eserleri). Farklı görüş bulunan yerlerde sayfada not vardır.</li>
            </ul>
            <h4>Tarihler</h4>
            <p>Tarihler milâdîdir. Peygamberlikten önceki ve Mekke dönemindeki tarihler yaklaşıktır. Hicretten sonra hicrî yıl da yazılır. Yaşlar, siyer geleneğinde olduğu gibi kamerî yılla verilir: kırk yaşında peygamberlik, altmış üç yaşında vefat.</p>
            <h4>Harita</h4>
            <p>Harita şematiktir; kıyılar ve konumlar yaklaşıktır.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Resûlullah sizin için en güzel örnektir.” (Ahzâb 21)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her olayda bir simge.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ çizelge · #/o/<id> · #/harita[/<yer>] · #/test
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mo = h.match(/^o\/([\w-]+)$/), mh = h.match(/^harita(?:\/([\w-]+))?$/);
        let active;
        if (mo && BY[mo[1]]) active = viewOlay(BY[mo[1]]);
        else if (mh) active = viewHarita(mh[1]);
        else if (h === 'test') active = viewTest();
        else active = viewCizelge();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        const mapToMap = lastHash !== null && /^harita/.test(lastHash) && /^harita/.test(h);
        if (changed && lastHash === 'test' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(!mapToMap);
        if (changed && !mapToMap) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
