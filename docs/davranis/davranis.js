// ============================================
// Kur'an'dan Davranış Modeli — uygulama mantığı
// İçerik: data.js (window.DAVRANIS_DATA), ayet metinleri: ayetler.js (window.DAVRANIS_AYETLER)
// Anlatım metinleri tools/davranis-anlatim.json içinde tutulur; metin gösterilmez;
// kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Tema (apps:tema) ve renk (theme) anahtarları bütün uygulamalarla ortaktır.
// ============================================
(function () {
    'use strict';

    const DATA = window.DAVRANIS_DATA;
    const AYET = window.DAVRANIS_AYETLER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---------- İçerik dizini ----------
    const ALANLAR = DATA.alanlar;
    const AL = Object.fromEntries(ALANLAR.map((a) => [a.id, a]));
    const SAATLER = DATA.saatler;
    const SA = Object.fromEntries(SAATLER.map((s) => [s.id, s]));
    const ALL = DATA.davranislar;
    const BY_ID = Object.fromEntries(ALL.map((d) => [d.id, d]));
    const inAlan = (id) => ALL.filter((d) => d.alan === id);
    const atSaat = (id) => ALL.filter((d) => d.saat.includes(id));

    // ---------- Kalıcı durum ----------
    const KEY = 'davranis:v1';
    const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const state = { seen: {}, show: { ar: true, meal: true }, arSize: 2, best: 0, gun: { tarih: todayStr(), ids: {} }, filtre: 'hepsi' };
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (saved.seen && typeof saved.seen === 'object') state.seen = saved.seen;
        state.show = Object.assign(state.show, saved.show || {});
        if (Number.isInteger(saved.arSize)) state.arSize = Math.max(0, Math.min(4, saved.arSize));
        if (Number.isInteger(saved.best)) state.best = saved.best;
        if (saved.gun && saved.gun.tarih === todayStr() && saved.gun.ids) state.gun = saved.gun; // her gün sıfırlanır
        if (['hepsi', 'yap', 'yapma'].includes(saved.filtre)) state.filtre = saved.filtre;
    } catch (e) { /* depolama kapalıysa varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const doneToday = () => { if (state.gun.tarih !== todayStr()) state.gun = { tarih: todayStr(), ids: {} }; return state.gun.ids; };

    // ---------- Temaya göre metinler (içerik aynı, ton farklı) ----------
    const COPY = {
        yetiskin: {
            kick: 'Bismillâh',
            title: 'Kur’an’dan <em>Davranış Modeli</em>',
            lead: 'Bir Müslümanın gün boyu karşılaştığı durumlarda nasıl davranacağını ayetlerle anlatan bir rehber. Temelden ayrıntıya, kalpten yeryüzüne.',
            today: 'Günün davranışı',
            day: 'Günümü keşfet', test: 'Ne yapardın?',
            done: 'Bugün buna dikkat ettim', undone: 'Bugün dikkat ettim ✓',
            doneToast: 'Güzel. Günün muhasebesine eklendi.',
            gunLead: (n) => n ? `Bugün ${n} davranışa dikkat ettiğini işaretledin.` : 'Bir günün içindeki on durak. Her durakta Kur’an’ın öğüttediği davranışlar.',
            right: 'Doğru.', wrong: 'Kur’an’ın öğüdü',
            result: (n, t) => n === t ? 'Hepsi doğru. Bu öğütleri güne taşımak dileğiyle.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Davranış sayfalarına göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Bugün nasıl biri olalım?',
            title: '<span class="emo">🌟</span> Kur’an’dan <em>Davranış Modeli</em>',
            lead: 'Sabah uyanınca, okulda, sofrada, ekran başında… Kur’an bize her an nasıl davranacağımızı öğretiyor. Hadi keşfedelim!',
            today: 'Bugünün görevi',
            day: 'Günümü keşfet', test: 'Ne yapardın?',
            done: 'Bugün bunu yaptım! ⭐', undone: 'Bugün yaptım ⭐',
            doneToast: 'Harikasın! Bir yıldız daha 🌟',
            gunLead: (n) => n ? `Bugün ${n} yıldız topladın! 🌟` : 'Günün on durağında Kur’an’ın öğütleri seni bekliyor!',
            right: 'Harika, doğru! 🌟', wrong: 'Doğrusu',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Biraz daha keşfedip yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    // ---------- Yardımcılar ----------
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        model: svg('<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>'),
        day: svg('<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2.2"/>'),
        list: svg('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 2.4-2.8 4.1M12 17.2h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        yap: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.4),
        yapma: svg('<path d="M6 6l12 12M18 6 6 18"/>', 2.4),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        // halkalar
        kalp: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
        nefis: svg('<path d="M12 21V11"/><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 14c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5z"/>'),
        dil: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
        aile: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>'),
        insanlar: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>'),
        kazanc: svg('<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h9.4a1.5 1.5 0 0 0 1.5-1.2L21.5 8H6"/>'),
        yeryuzu: svg('<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.6 3.9 6 3.9 9.5S14.6 18.9 12 21.5c-2.6-2.6-3.9-6-3.9-9.5S9.4 5.1 12 2.5z"/>'),
        takva: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/>'),
        ihlas: svg('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>'),
        adalet: svg('<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>'),
        ihsan: svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 1 8-1.6 6.1-5.6 10-9 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>')
    };
    const turBadge = (t) => `<span class="tur k-${t}">${t === 'yap' ? IC.yap : IC.yapma}<span class="emo" aria-hidden="true">${t === 'yap' ? '✅' : '🚫'}</span>${t === 'yap' ? 'Yap' : 'Yapma'}</span>`;
    const mark = (d) => `<span class="mk k-${d.tur}" aria-hidden="true">${d.tur === 'yap' ? IC.yap : IC.yapma}<span class="emo">${d.tur === 'yap' ? '✅' : '🚫'}</span></span>`;
    const ayetRef = (r) => { const a = AYET[r]; return a ? `${a.sure} ${a.no}` : r; };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const dayIndex = () => { const d = new Date(); const start = new Date(d.getFullYear(), 0, 0); return Math.floor((d - start) / 864e5); };
    const todays = () => ALL[(dayIndex() * 7) % ALL.length];

    let toastTimer = null;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
    }
    function burst(fromEl) {
        if (!kid() || reduceMotion.matches || !fromEl) return;
        const r = fromEl.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const colors = ['#ffb703', '#ff7f9c', '#63cbe2', '#7b61ff'];
        for (let i = 0; i < 14; i++) {
            const s = document.createElement('i');
            s.className = 'burst';
            const a = (Math.PI * 2 * i) / 14, d = 70 + Math.random() * 70;
            s.style.left = (cx - 9) + 'px'; s.style.top = (cy - 9) + 'px';
            s.style.background = colors[i % 4];
            s.style.setProperty('--dx', Math.cos(a) * d + 'px');
            s.style.setProperty('--dy', (Math.sin(a) * d - 30) + 'px');
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 950);
        }
    }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Model', alt: 'İlkeler ve yedi halka', icon: IC.model },
        { id: 'gun', href: '#/gun', ad: 'Günüm', alt: 'Günün on durağı', icon: IC.day },
        { id: 'liste', href: '#/liste', ad: 'Davranışlar', alt: `${ALL.length} davranış, ayetleriyle`, icon: IC.list },
        { id: 'test', href: '#/test', ad: 'Ne yapardın?', alt: 'Günlük durumlar', icon: IC.quiz }
    ];
    function drawNav(active) {
        tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join('');
    }

    // ---------- Parçalar ----------
    function ditem(d) {
        const done = !!doneToday()[d.id];
        return `<li><a class="ditem k-${d.tur}${done ? ' is-done' : ''}" href="#/d/${d.id}">${mark(d)}<b>${esc(d.ad)}${done ? '<span class="sr"> (bugün dikkat edildi)</span>' : ''}</b><small>${esc(d.kisa)}</small></a></li>`;
    }
    function dchip(d) {
        const done = !!doneToday()[d.id];
        return `<a class="dchip k-${d.tur}${done ? ' is-done' : ''}" href="#/d/${d.id}"><span class="mk" aria-hidden="true">${d.tur === 'yap' ? '✓' : '✕'}</span><span class="sr">${d.tur === 'yap' ? 'Yap: ' : 'Yapma: '}</span>${esc(d.ad)}</a>`;
    }
    function rings() {
        // içten dışa: kalbim merkezde, yeryüzü en dışta
        const r0 = 36, w = 21;
        const ann = (R, r) => `M0 ${-R}A${R} ${R} 0 1 1 0 ${R}A${R} ${R} 0 1 1 0 ${-R}ZM0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${r} ${r} 0 1 0 0 ${-r}Z`;
        const parts = ALANLAR.map((a, i) => {
            const label = a.ad.toLocaleUpperCase('tr');
            if (i === 0) return `<a href="#/alan/${a.id}" class="k-${a.id}" aria-label="${esc(a.ad)}: ${esc(a.alt)}"><path d="M0 ${-r0}A${r0} ${r0} 0 1 1 0 ${r0}A${r0} ${r0} 0 1 1 0 ${-r0}Z"/><text class="core" x="0" y="4" text-anchor="middle">${esc(label)}</text></a>`;
            const r = r0 + (i - 1) * w, R = r + w;
            return `<a href="#/alan/${a.id}" class="k-${a.id}" aria-label="${esc(a.ad)}: ${esc(a.alt)}"><path fill-rule="evenodd" d="${ann(R, r)}"/><text x="0" y="${-(r + w / 2) + 4}" text-anchor="middle">${esc(label)}</text></a>`;
        });
        const max = r0 + (ALANLAR.length - 1) * w + 2;
        return `<div class="rings"><svg viewBox="${-max} ${-max} ${max * 2} ${max * 2}" role="group" aria-label="Yedi halka: içten dışa">${parts.reverse().join('')}</svg></div>`;
    }
    function ayetCard(ref, opts) {
        const a = AYET[ref];
        if (!a) return '';
        const long = a.meal.length > 320;
        return `<section class="sc delil">
                <span class="tag k-ayet">Ayet</span>
                <p class="ayet-ar" lang="ar">${esc(a.ar)}</p>
                <p class="ayet-meal${long ? ' clamp' : ''}">${esc(a.meal)}</p>
                ${long ? '<button type="button" class="more" data-more>Devamını oku</button>' : ''}
                <p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p>
                ${opts && opts.not ? `<p class="dnot"><b>Not:</b> ${esc(opts.not)}</p>` : ''}
            </section>`;
    }

    // ---------- Model ----------
    function viewModel() {
        const c = copy();
        const t = todays();
        const cati = AYET[DATA.cati.ayet];
        const ilkeler = DATA.ilkeler.map((i) => {
            const a = AYET[i.ayet];
            return `<details class="ilke">
                <summary>${IC[i.id]}<span class="emo" aria-hidden="true">${i.emo}</span><b>${esc(i.ad)}</b><span>${esc(i.kisa)}</span></summary>
                <div class="ilke__in"><p>${esc(i.aciklama)}</p>${a ? `<q>${esc(a.meal)}</q><small>${esc(a.sure)} Suresi, ${a.no}. ayet</small>` : ''}</div>
            </details>`;
        }).join('');
        const alanlar = ALANLAR.map((a) => {
            const list = inAlan(a.id);
            return `<a class="alancard k-${a.id}" href="#/alan/${a.id}">
                <span class="ti">${IC[a.id]}<span class="emo" aria-hidden="true">${a.emo}</span></span>
                <b>${esc(a.ad)} <span style="font-weight:500;color:var(--soft)">· ${esc(a.alt)}</span></b>
                <small>${esc(a.soru)}</small>
                <span class="cnt" aria-label="${list.filter((d) => d.tur === 'yap').length} yap, ${list.filter((d) => d.tur === 'yapma').length} yapma"><i>✓ ${list.filter((d) => d.tur === 'yap').length}</i><em>✕ ${list.filter((d) => d.tur === 'yapma').length}</em></span>
            </a>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <a class="today k-${t.tur}" href="#/d/${t.id}">
                        <small>${esc(c.today)}</small>
                        <b>${esc(t.ad)}</b>
                        <span>${esc(t.kisa)}</span>
                    </a>
                    <div class="btns">
                        <a class="btn" href="#/gun">${IC.day}${esc(c.day)}</a>
                        <a class="btn alt" href="#/test">${IC.quiz}${esc(c.test)}</a>
                    </div>
                </section>
                <section class="sc memo cati">
                    <div class="kick">Bütün davranışların çatısı</div>
                    ${cati ? `<p class="ayet-ar" lang="ar">${esc(cati.ar)}</p><p class="ayet-meal">${esc(cati.meal)}</p><p class="ref">${esc(cati.sure)} Suresi, ${cati.no}. ayet</p>` : ''}
                </section>
                <section class="sc">
                    <div class="kick">Dört temel ilke</div>
                    <p class="lead" style="margin:0 0 16px">Her davranışın arkasında dört ilke vardır. Birine dokun, ayetini gör.</p>
                    <div class="ilkeler">${ilkeler}</div>
                </section>
                <section class="sc">
                    <div class="kick">Yedi halka</div>
                    <p class="lead" style="margin:0 0 10px">Davranışlar kalpten başlar, dışa doğru genişler: önce Rabbimle, sonra kendimle, sözlerimle, ailemle, insanlarla, kazancımla ve yeryüzüyle.</p>
                    ${rings()}
                    <p class="rings-cap">Bir halkaya dokun.</p>
                </section>
                <div class="alanlar">${alanlar}</div>
            </div>`;
        hsub.textContent = 'Model';
        document.title = 'Kur’an’dan Davranış Modeli';
        return '';
    }

    // ---------- Günüm ----------
    function viewGun() {
        const c = copy();
        const n = Object.keys(doneToday()).length;
        const slots = SAATLER.map((s) => `
            <section class="slot" id="saat-${s.id}">
                <div class="slot__head"><span class="slot__time">${esc(s.saat)}</span><h2><span class="emo" aria-hidden="true">${s.emo}</span>${esc(s.ad)}</h2></div>
                <p>${esc(s.aciklama)}</p>
                <div class="chips2">${atSaat(s.id).map(dchip).join('')}</div>
            </section>`).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⏰ ' : ''}Günün yirmi dört saati</div>
                    <h1>Günüm</h1>
                    <p class="lead">${esc(c.gunLead(n))}</p>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Bugün dikkat edilen davranışlar" aria-valuemin="0" aria-valuemax="${ALL.length}" aria-valuenow="${n}"><b style="width:${pct(n, ALL.length)}%"></b></div>
                    <p class="prog__txt">${n} / ${ALL.length} · İşaretler gece yarısı sıfırlanır.</p></div>
                </section>
                <div class="timeline">${slots}</div>
            </div>`;
        hsub.textContent = 'Günüm';
        document.title = 'Günüm | Davranış Modeli';
        let target = null;
        try { target = sessionStorage.getItem('davranis:saat'); sessionStorage.removeItem('davranis:saat'); } catch (e) { /* yok say */ }
        if (target) {
            const el = document.getElementById('saat-' + target);
            if (el) requestAnimationFrame(() => { el.scrollIntoView({ block: 'start' }); el.classList.add('is-target'); el.style.borderColor = 'var(--gold)'; });
        }
        return 'gun';
    }

    // ---------- Liste ve halka ----------
    function filterBar(withSearch) {
        const seg = (id, label) => `<button type="button" data-filtre="${id}" aria-pressed="${state.filtre === id}">${label}</button>`;
        return `<div class="filters" role="search">
                ${withSearch ? `<label class="search">${IC.search}<span class="sr">Davranış ara</span><input type="search" id="q" placeholder="Davranış ara…" autocomplete="off"></label>` : '<span style="flex:1"></span>'}
                <div class="seg2" role="group" aria-label="Süzgeç">${seg('hepsi', 'Hepsi')}${seg('yap', 'Yap')}${seg('yapma', 'Yapma')}</div>
            </div>`;
    }
    const norm = (t) => t.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '');
    function listBody(groups, q) {
        const qq = q ? norm(q) : '';
        let total = 0;
        const html = groups.map((a) => {
            const list = inAlan(a.id).filter((d) => (state.filtre === 'hepsi' || d.tur === state.filtre) && (!qq || norm(d.ad + ' ' + d.kisa + ' ' + d.durum).includes(qq)));
            total += list.length;
            if (!list.length) return '';
            return `${groups.length > 1 ? `<h2 class="grouphead k-${a.id}"><i class="dot" aria-hidden="true"></i>${esc(a.ad)}<small>${esc(a.alt)}</small></h2>` : ''}<ul class="dlist">${list.map(ditem).join('')}</ul>`;
        }).join('');
        return total ? html : '<p class="empty">Aramayla eşleşen davranış yok.</p>';
    }
    function bindFilters(groups) {
        const box = app.querySelector('#listbox');
        const q = app.querySelector('#q');
        const redraw = () => { box.innerHTML = listBody(groups, q ? q.value : ''); };
        app.querySelectorAll('[data-filtre]').forEach((b) => b.addEventListener('click', () => {
            state.filtre = b.dataset.filtre; save();
            app.querySelectorAll('[data-filtre]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.filtre === state.filtre)));
            redraw();
        }));
        if (q) q.addEventListener('input', redraw);
    }
    function viewListe() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '📚 ' : ''}Bütün davranışlar</div>
                    <h1>Davranışlar</h1>
                    <p class="lead">Kur’an’ın açıkça emrettiği ya da yasakladığı ${ALL.length} davranış, yedi halkada; her biri ayetiyle.</p>
                    <div class="stats"><span><b>${ALL.filter((d) => d.tur === 'yap').length}</b> yap</span><span><b>${ALL.filter((d) => d.tur === 'yapma').length}</b> yapma</span><span><b>${Object.keys(AYET).length}</b> ayet</span></div>
                </section>
                ${filterBar(true)}
                <div id="listbox" class="page">${listBody(ALANLAR, '')}</div>
            </div>`;
        bindFilters(ALANLAR);
        hsub.textContent = 'Davranışlar';
        document.title = 'Davranışlar | Davranış Modeli';
        return 'liste';
    }
    function viewAlan(a) {
        const i = ALANLAR.indexOf(a);
        const prev = ALANLAR[i - 1], next = ALANLAR[i + 1];
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Model</a><span class="pos">${i + 1}. halka / ${ALANLAR.length}</span></div>
                <section class="sc hero k-${a.id}">
                    <div class="kick">${kid() ? a.emo + ' ' : ''}${esc(a.alt)}</div>
                    <h1>${esc(a.ad)}</h1>
                    <p class="lead">${esc(a.aciklama)}</p>
                </section>
                ${filterBar(false)}
                <div id="listbox" class="page">${listBody([a], '')}</div>
                <nav class="pager" aria-label="Önceki ve sonraki halka">
                    ${prev ? `<a href="#/alan/${prev.id}"><small>İçteki halka</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/alan/${next.id}"><small>Dıştaki halka</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindFilters([a]);
        hsub.textContent = a.ad;
        document.title = `${a.ad} | Davranış Modeli`;
        return 'liste';
    }

    // ---------- Davranış sayfası ----------
    function viewDavranis(d) {
        const c = copy();
        const a = AL[d.alan];
        const list = inAlan(d.alan);
        const i = list.indexOf(d);
        const prev = list[i - 1], next = list[i + 1];
        const done = !!doneToday()[d.id];
        state.seen[d.id] = true; save();
        const chip = (key, label) => `<button type="button" class="chip" data-show="${key}" aria-pressed="${state.show[key]}"><i aria-hidden="true"></i>${label}</button>`;
        const related = list.filter((x) => x !== d).slice(0, 4);
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/alan/${a.id}">${IC.left}${esc(a.ad)}</a><span class="pos">${i + 1} / ${list.length}</span></div>
                <section class="sc hero k-${a.id}">
                    <div class="kick">${kid() ? a.emo + ' ' : ''}${esc(a.ad)} · ${esc(a.alt)}</div>
                    ${turBadge(d.tur)}
                    <h1>${esc(d.ad)}</h1>
                    <p class="lead">${esc(d.kisa)}</p>
                    <div data-anlatim="${d.id}"></div>
                    <div class="btns check"><button type="button" class="btn${done ? ' is-done' : ''}" id="doneBtn" aria-pressed="${done}">${IC.yap}<span>${esc(done ? c.undone : c.done)}</span></button></div>
                </section>
                <section class="sc expl">
                    <div class="kick">Açıklama</div>
                    <p>${esc(d.aciklama)}</p>
                </section>
                <h2 class="secttl">${d.ayetler.length > 1 ? 'Ayetler' : 'Ayet'}</h2>
                <div class="viewbar" role="group" aria-label="Ayetlerde gösterilecek metinler">
                    <div class="chips" style="grid-template-columns:repeat(2,minmax(0,1fr))">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                    <div class="size" role="group" aria-label="Arapça yazı boyutu">
                        <button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button>
                        <button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button>
                    </div>
                </div>
                <div class="delils page" data-ar="${state.arSize}">${d.ayetler.map((r, j) => ayetCard(r, j === d.ayetler.length - 1 && d.not ? { not: d.not } : null)).join('')}</div>
                <section class="sc k-${d.tur}">
                    <div class="kick">Günlük hayatta</div>
                    <div class="durum"><small>Durum</small><p>${esc(d.durum)}</p></div>
                    <div class="when">${d.saat.map((s) => `<a href="#/gun" data-saat="${s}"><b>${esc(SA[s].saat)}</b>${esc(SA[s].ad)}</a>`).join('')}</div>
                </section>
                <section class="sc memo">
                    <div class="kick">Akılda kalsın</div>
                    <p class="quote">${esc(d.akilda)}</p>
                </section>
                <div class="srccard src"><b>Kaynak:</b> Kur’an-ı Kerîm, ${d.ayetler.map((r) => esc(ayetRef(r))).join('; ')}. Meal: ${esc(DATA.meal)}.</div>
                ${related.length ? `<h2 class="secttl">Aynı halkadan</h2><ul class="dlist">${related.map(ditem).join('')}</ul>` : ''}
                <nav class="pager" aria-label="Önceki ve sonraki davranış">
                    ${prev ? `<a href="#/d/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/d/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;

        const dl = app.querySelector('.delils');
        const applyShow = () => {
            ['ar', 'meal'].forEach((key) => dl.classList.toggle('hide-' + key, !state.show[key]));
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            const sb = app.querySelectorAll('[data-size]');
            sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar;
            dl.dataset.ar = state.arSize;
        };
        applyShow();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const key = b.dataset.show;
            if (state.show[key] && Object.values(state.show).filter(Boolean).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[key] = !state.show[key]; save(); applyShow();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => {
            state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); applyShow();
        }));
        app.querySelectorAll('[data-more]').forEach((b) => b.addEventListener('click', () => {
            const open = b.previousElementSibling.classList.toggle('clamp') === false;
            b.textContent = open ? 'Kısalt' : 'Devamını oku';
        }));
        app.querySelectorAll('[data-saat]').forEach((l) => l.addEventListener('click', () => { try { sessionStorage.setItem('davranis:saat', l.dataset.saat); } catch (e) { /* yok say */ } }));
        const btn = document.getElementById('doneBtn');
        btn.addEventListener('click', () => {
            const ids = doneToday();
            const now = !ids[d.id];
            if (now) ids[d.id] = true; else delete ids[d.id];
            save();
            btn.classList.toggle('is-done', now);
            btn.setAttribute('aria-pressed', String(now));
            btn.querySelector('span').textContent = now ? copy().undone : copy().done;
            if (now) { toast(copy().doneToast); burst(btn); }
        });
        hsub.textContent = d.ad;
        document.title = `${d.ad} | Davranış Modeli`;
        return 'liste';
    }

    // ---------- Ne yapardın? ----------
    const ROUND = 10;
    let quiz = null;
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    function newQuiz() {
        const list = shuffle(ALL.slice()).slice(0, ROUND).map((d) => {
            // çeldiriciler: başka halkalardan, aynı yönden (yap / yapma) davranışlar
            const pool = shuffle(ALL.filter((x) => x.alan !== d.alan && x.tur === d.tur));
            return { d, opts: shuffle([d, pool[0], pool[1]]) };
        });
        quiz = { list, i: 0, score: 0, answered: null };
    }
    function viewTest() {
        if (!quiz) newQuiz();
        const c = copy();
        const total = quiz.list.length;
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > state.best) { state.best = n; save(); }
            app.innerHTML = `
                <div class="page in">
                    <section class="sc hero">
                        <div class="kick">${kid() ? '🏁 ' : ''}Sonuç</div>
                        <p class="score" aria-label="${n} / ${total} doğru">${n}<small> / ${total}</small></p>
                        <p class="lead">${esc(c.result(n, total))}</p>
                        <p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best))}</p>
                        <div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/gun">${IC.day}Günüme dön</a></div>
                    </section>
                </div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i];
            const ans = quiz.answered;
            const opts = q.opts.map((o) => {
                let cls = '';
                if (ans) cls = o.id === q.d.id ? ' is-right' : o.id === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="opt2 k-${AL[o.alan].id}${cls}" data-ans="${o.id}"${ans ? ' disabled' : ''}><i class="dot" aria-hidden="true"></i><span class="emo" aria-hidden="true">${AL[o.alan].emo}</span>${esc(o.ad)}${ans && o.id === q.d.id ? '<span class="mark">✓</span>' : ''}${ans && o.id === ans && o.id !== q.d.id ? '<span class="mark">✗</span>' : ''}</button>`;
            }).join('');
            const ok = ans === q.d.id;
            const first = AYET[q.d.ayetler[0]];
            app.innerHTML = `
                <div class="page in">
                    <section class="sc">
                        <div class="quiz__top">
                            <span class="quiz__count">Durum ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span>
                            <div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div>
                        </div>
                        <p class="quiz__ask">Kur’an bu durumda neyi öğütler?</p>
                        <p class="quiz__q">${esc(q.d.durum)}</p>
                        <div class="opts" role="group" aria-label="Seçenekler" style="grid-template-columns:1fr">${opts}</div>
                        ${ans ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong + ': ' + q.d.ad + '.')}</b> ${esc(q.d.akilda)} ${first ? `<span style="display:block;margin-top:6px">“${esc(first.meal.length > 160 ? first.meal.slice(0, 160).replace(/\s+\S*$/, '') + '…' : first.meal)}” <em style="font-style:normal;color:var(--faint)">(${esc(first.sure)} ${first.no})</em></span>` : ''} <a href="#/d/${q.d.id}">Davranışı aç</a></div>
                            <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki durum' : 'Sonucu gör'}</button></div>` : ''}
                    </section>
                    <p class="note"><b>Not:</b> Durumlar davranış sayfalarındaki örneklerden seçilir; seçenekler aynı yöndeki (yap ya da yapma) başka davranışlardır.</p>
                </div>`;
            app.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = b.dataset.ans;
                const right = quiz.answered === q.d.id;
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.opt2.is-right'));
                else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = 'Ne yapardın?';
        document.title = 'Ne yapardın? | Davranış Modeli';
        return 'test';
    }

    // ---------- Alt panel ----------
    let sheetReturn = null;
    function openSheet(html, kind) {
        sheetReturn = document.activeElement;
        sheetBody.innerHTML = html;
        sheetBg.dataset.kind = kind || '';
        sheetBg.classList.remove('out');
        sheetBg.classList.add('on');
        document.getElementById('sheetX').focus();
    }
    function closeSheet() {
        if (!sheetBg.classList.contains('on')) return;
        const done = () => { sheetBg.classList.remove('on', 'out'); sheetBg.dataset.kind = ''; if (sheetReturn && sheetReturn.focus) sheetReturn.focus(); };
        if (reduceMotion.matches) { done(); return; }
        sheetBg.classList.add('out');
        setTimeout(done, 220);
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
            <p>Bu rehberdeki her davranış, mealinde o davranışı açıkça bildiren bir ayete dayanır.</p>
            <ul>
                <li><b>Kur'an metni:</b> Tanzil Quran Text (Simple), tanzil.net; metin değiştirilmeden kullanılmıştır.</li>
                <li><b>Meal:</b> ${esc(DATA.meal)}. Bu mealde bazı ayet grupları tek metin hâlinde çevrilmiştir; böyle ayetler aralık olarak (ör. Mutaffifîn 1-3) gösterilir.</li>
                <li><b>Model:</b> Davranışlar, Nahl Suresi 90. ayetteki çatı ve dört temel ilke (takva, ihlas, adalet, ihsan) altında, kalpten yeryüzüne yedi halkada toplanmıştır. Bu düzen, öğrenmeyi kolaylaştırmak için hazırlanmış bir sınıflandırmadır.</li>
            </ul>
            <h4>Peygamberimizin ahlakı</h4>
            <p>Kur’an’daki ahlakın en güzel örneği Peygamberimizdir. Bu konuda en sahih kaynaklardan üç hadis:</p>
            <div class="hadisler">${DATA.hadisler.map((h) => `<figure><blockquote>“${esc(h.metin)}”</blockquote><figcaption>${esc(h.ravi)} · ${esc(h.kaynak)}</figcaption></figure>`).join('')}</div>
            <p style="margin-top:10px">Hadis numaraları: Buhârî için genel hadis numarası, Müslim için M. Fuâd Abdülbâkî numarası. Hadisler anlam olarak aktarılmıştır.</p>
            <h4>Kapsam</h4>
            <p>Liste, Kur’an’ın açıkça emrettiği ya da yasakladığı başlıca ahlaki davranışları içerir; ibadetlerin ayrıntıları (namaz, oruç, zekât gibi) diğer uygulamalarda anlatılır. Kişisel bir durumun hükmü için bir din görevlisine danışmak en doğrusudur.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">Allah ahlakımızı güzelleştirsin.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4>
            <div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her iyilikte yıldız toplar.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya ve düşünmeye odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
            <h4>Renk</h4>
            <div class="optrow">${opt('data-set-mode', 'light', m === 'light', 'Açık', 'Aydınlık ortamlar için.', ['#fffdf8', '#e9e0cf'])}${opt('data-set-mode', 'dark', m === 'dark', 'Koyu', 'Loş ortamlar ve gece için.', ['#0c1814', '#22213a'])}</div>`;
    }
    const lookSync = () => { if (sheetBg.dataset.kind === 'look' && sheetBg.classList.contains('on')) sheetBody.innerHTML = lookHtml(); };
    document.getElementById('lookBtn').addEventListener('click', () => openSheet(lookHtml(), 'look'));
    document.getElementById('infoBtn').addEventListener('click', () => openSheet(infoHtml(), 'info'));

    // ---------- Görünüm: tema ve renk ----------
    const THEME_KEY = 'apps:tema', MODE_KEY = 'theme';
    function paint() {
        const m = document.querySelector('meta[name="theme-color"]');
        if (m) m.setAttribute('content', getComputedStyle(document.body).backgroundColor);
    }
    function withReveal(origin, change) {
        if (!origin || !document.startViewTransition || reduceMotion.matches) { change(); paint(); return; }
        const b = origin.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
        const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        root.classList.add('theme-vt');
        const vt = document.startViewTransition(() => { change(); paint(); });
        vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 620, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
        vt.finished.finally(() => root.classList.remove('theme-vt'));
    }
    function setTheme(t, origin) {
        if (t === root.dataset.theme) return;
        store(THEME_KEY, t);
        withReveal(origin, () => { root.setAttribute('data-theme', t); render(false); lookSync(); });
    }
    function setMode(m, origin) {
        if (m === root.dataset.mode) return;
        store(MODE_KEY, m);
        withReveal(origin, () => { root.setAttribute('data-mode', m); lookSync(); });
    }
    sheetBody.addEventListener('click', (e) => {
        const t = e.target.closest('[data-set-theme]'); if (t) { setTheme(t.dataset.setTheme, t); return; }
        const m = e.target.closest('[data-set-mode]'); if (m) setMode(m.dataset.setMode, m);
    });
    window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && (e.newValue === 'cocuk' || e.newValue === 'yetiskin') && e.newValue !== root.dataset.theme) { root.setAttribute('data-theme', e.newValue); render(false); lookSync(); paint(); }
        if (e.key === MODE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) { root.setAttribute('data-mode', e.newValue); lookSync(); paint(); }
    });

    // ---------- Yönlendirme ----------
    // #/ model · #/gun · #/liste · #/alan/<id> · #/d/<davranış> · #/test
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const md = h.match(/^d\/([\w-]+)$/), ma = h.match(/^alan\/([\w-]+)$/);
        let active;
        if (md && BY_ID[md[1]]) active = viewDavranis(BY_ID[md[1]]);
        else if (ma && AL[ma[1]]) active = viewAlan(AL[ma[1]]);
        else if (h === 'gun') active = viewGun();
        else if (h === 'liste') active = viewListe();
        else if (h === 'test') active = viewTest();
        else active = viewModel();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && lastHash === 'test' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed && !(h === 'gun' && document.querySelector('.slot.is-target'))) {
            window.scrollTo(0, 0);
            app.focus({ preventScroll: true });
        }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
