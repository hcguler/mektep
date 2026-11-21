// ============================================
// Esmâ-ül Hüsnâ — uygulama mantığı
// İçerik: data.js (ESMA_DATA), Arapça isimler: isimler.js (ESMA_ARAPCA, Tirmizî metninden),
// ayetler: ayetler.js (ESMA_AYETLER). Anlatım metinleri tools/esma-anlatim.json içindedir;
// metin gösterilmez; kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.ESMA_DATA;
    const AR = window.ESMA_ARAPCA || [];
    const AYET = window.ESMA_AYETLER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.isimler.map((x, i) => Object.assign({ n: i + 1, ar: AR[i] || '' }, x));
    const T = DATA.isimler.length;

    // ---------- Kalıcı durum ----------
    const KEY = 'esma:v1';
    const state = { ezber: {}, show: { ar: true, meal: true }, arSize: 2, filtre: 'hepsi', deste: 'kalan' };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.ezber && typeof s.ezber === 'object') state.ezber = s.ezber;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (['hepsi', 'ezber', 'kalan'].includes(s.filtre)) state.filtre = s.filtre;
        if (['kalan', 'hepsi'].includes(s.deste)) state.deste = s.deste;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const ezberCount = () => ALL.filter((x) => state.ezber[x.n]).length;

    const COPY = {
        yetiskin: {
            kick: 'Bismillâh', title: 'Esmâ-ül <em>Hüsnâ</em>',
            lead: 'Allah’ın güzel isimleri: Arapçası, okunuşu, anlamı, Kur’an’da geçtiği ayet ve kula yansımasıyla. Kart kart keşfet, ezberle.',
            progress: (n) => n === 0 ? `${T} ismin hepsi seni bekliyor.` : n === T ? 'Doksan dokuz ismin hepsini ezberledin. Allah kabul etsin.' : `${T} isimden ${n} tanesini ezberledin.`,
            today: 'Günün ismi', cards: 'Kartlarla ezberle', mark: 'Ezberledim', marked: 'Ezberlendi',
            toastOn: (o) => `${o} ezberlendi olarak işaretlendi.`, toastOff: (o) => `${o} için işaret kaldırıldı.`
        },
        cocuk: {
            kick: 'Allah’ın güzel isimleri', title: '<span class="emo">✨</span> Esmâ-ül <em>Hüsnâ</em>',
            lead: 'Allah’ın doksan dokuz güzel ismi var! Her birini kartlarla öğren, ezberledikçe yıldız topla.',
            progress: (n) => n === 0 ? `${T} yıldız seni bekliyor! ⭐` : n === T ? 'Bütün yıldızları topladın! 🎉' : `${n} yıldız topladın, ${T - n} yıldız kaldı.`,
            today: 'Bugünün ismi', cards: 'Kartlarla oyna', mark: 'Ezberledim! ⭐', marked: 'Ezberimde ⭐',
            toastOn: (o) => `Harikasın! ${o} artık ezberinde. 🌟`, toastOff: (o) => `${o} yıldızı geri bırakıldı.`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        grid: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
        cards: svg('<rect x="6" y="3" width="13" height="17" rx="2.5"/><path d="M3.5 6.5v12A2.5 2.5 0 0 0 6 21h9"/>'),
        star: svg('<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>'),
        check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.4),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
        again: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
    };
    const TUR = { isim: 'Kur’an’da isim olarak geçer', fiil: 'Kur’an’da fiil ya da türev olarak geçer', yok: 'Kur’an’da bu kalıpta geçmez' };
    const dayIndex = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);

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
    function toggleEzber(x, btn) {
        const now = !state.ezber[x.n];
        if (now) state.ezber[x.n] = true; else delete state.ezber[x.n];
        save();
        toast(now ? copy().toastOn(x.o) : copy().toastOff(x.o));
        if (now) burst(btn);
        return now;
    }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'İsimler', alt: 'Doksan dokuz isim', icon: IC.grid },
        { id: 'kart', href: '#/kart', ad: 'Kartlar', alt: 'Çevir, öğren, ezberle', icon: IC.cards },
        { id: 'ezber', href: '#/ezber', ad: 'Ezberim', alt: 'İlerleme ve tekrar', icon: IC.star }
    ];
    function drawNav(active) {
        tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join('');
    }

    // ---------- Parçalar ----------
    const ncard = (x) => `<li><a class="ncard${state.ezber[x.n] ? ' is-done' : ''}" href="#/i/${x.n}">
            <span class="no">${x.n}</span><span class="star" aria-hidden="true">★</span>
            <span class="ar" lang="ar">${esc(x.ar)}</span><b>${esc(x.o)}</b><small>${esc(x.a)}</small>
            ${state.ezber[x.n] ? '<span class="sr"> (ezberlendi)</span>' : ''}</a></li>`;
    const norm = (t) => t.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`\-]/g, '');
    function gridBody(q) {
        const qq = q ? norm(q) : '';
        const list = ALL.filter((x) => (state.filtre === 'hepsi' || (state.filtre === 'ezber') === !!state.ezber[x.n]) && (!qq || norm(x.o + ' ' + x.a + ' ' + x.n).includes(qq)));
        return list.length ? `<ul class="grid99" style="list-style:none;padding:0;margin:0">${list.map(ncard).join('')}</ul>` : '<p class="empty">Eşleşen isim yok.</p>';
    }

    // ---------- İsimler ----------
    function viewHome() {
        const c = copy();
        const n = ezberCount();
        const g = ALL[dayIndex() % T];
        const h = DATA.hadisler.sahih;
        const seg = (id, label) => `<button type="button" data-filtre="${id}" aria-pressed="${state.filtre === id}">${label}</button>`;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog">
                        <div class="bar" role="progressbar" aria-label="Ezberlenen isimler" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div>
                        <p class="prog__txt">${esc(c.progress(n))}</p>
                    </div>
                    <a class="gunun" href="#/i/${g.n}"><span class="ar" lang="ar">${esc(g.ar)}</span><small>${esc(c.today)}</small><b>${esc(g.o)}</b><span>${esc(g.a)}</span></a>
                    <div class="hadis-kart"><q>“${esc(h.metin)}”</q><small>${esc(h.kaynak)}</small></div>
                    <div class="btns"><a class="btn" href="#/kart">${IC.cards}${esc(c.cards)}</a></div>
                </section>
                <div class="filters" role="search">
                    <label class="search">${IC.search}<span class="sr">İsim ara</span><input type="search" id="q" placeholder="Ara…" autocomplete="off"></label>
                    <div class="seg2" role="group" aria-label="Süzgeç">${seg('hepsi', 'Hepsi')}${seg('kalan', 'Kalan')}${seg('ezber', kid() ? '⭐' : 'Ezber')}</div>
                </div>
                <div id="gridbox">${gridBody('')}</div>
            </div>`;
        const box = app.querySelector('#gridbox'), q = app.querySelector('#q');
        const redraw = () => { box.innerHTML = gridBody(q.value); };
        q.addEventListener('input', redraw);
        app.querySelectorAll('[data-filtre]').forEach((b) => b.addEventListener('click', () => {
            state.filtre = b.dataset.filtre; save();
            app.querySelectorAll('[data-filtre]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.filtre === state.filtre)));
            redraw();
        }));
        hsub.textContent = 'İsimler';
        document.title = 'Esmâ-ül Hüsnâ';
        return '';
    }

    // ---------- İsim sayfası ----------
    function viewIsim(x) {
        const c = copy();
        const prev = ALL[x.n - 2], next = ALL[x.n];
        const done = !!state.ezber[x.n];
        const a = x.ayet && AYET[x.ayet];
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}İsimler</a><span class="pos">${x.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${x.n}. isim</div>
                    <p class="big-ar" lang="ar">${esc(x.ar)}</p>
                    <h1 class="okunus">${esc(x.o)}</h1>
                    <p class="lead">${esc(x.a)}</p>
                    <div data-anlatim="${String(x.n).padStart(2, '0')}-*"></div>
                    <span class="tag k-${x.tur}">${esc(TUR[x.tur])}</span>
                    <div class="btns"><button type="button" class="btn${done ? ' is-done' : ''}" id="ezb" aria-pressed="${done}">${kid() ? IC.star : IC.check}<span>${esc(done ? c.marked : c.mark)}</span></button></div>
                </section>
                <section class="sc expl"><div class="kick">Açıklama</div><p>${esc(x.t)}</p></section>
                <h2 class="secttl">Kur’an’dan</h2>
                ${a ? `<div class="viewbar" role="group" aria-label="Ayette gösterilecek metinler">
                        <div class="chips" style="grid-template-columns:repeat(2,minmax(0,1fr))">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                        <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
                    </div>
                    <div class="delils page" data-ar="${state.arSize}"><section class="sc delil">
                        <span class="tag k-ayet">Ayet</span>
                        <p class="ayet-ar" lang="ar">${esc(a.ar)}</p>
                        <p class="ayet-meal${a.meal.length > 320 ? ' clamp' : ''}">${esc(a.meal)}</p>
                        ${a.meal.length > 320 ? '<button type="button" class="more" data-more>Devamını oku</button>' : ''}
                        <p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p>
                        ${x.tur === 'fiil' ? `<p class="dnot"><b>Not:</b> Bu isim ayette isim olarak değil, aynı kökten bir fiil ya da kelime olarak geçer.</p>` : ''}
                        ${x.not ? `<p class="dnot"><b>Not:</b> ${esc(x.not)}</p>` : ''}
                    </section></div>`
                : `<p class="yoknote"><b>Bu isim Kur’an’da bu kalıpta geçmez.</b> Tirmizî’nin rivayet ettiği listede yer alır; anlamı, Kur’an’da başka isim ve ifadelerle anlatılan sıfatlarla uyumludur.</p>`}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(x.y)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> İsim ve sıra: ${esc(DATA.hadisler.liste.kaynak)}${a ? `; ayet: ${esc(a.sure)} ${a.no} (meal: ${esc(DATA.meal)})` : ''}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki isim">
                    ${prev ? `<a href="#/i/${prev.n}"><small>Önceki</small><b>${esc(prev.o)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/i/${next.n}"><small>Sonraki</small><b>${esc(next.o)}</b></a>` : ''}
                </nav>
            </div>`;
        const dl = app.querySelector('.delils');
        if (dl) {
            const apply = () => {
                ['ar', 'meal'].forEach((k) => dl.classList.toggle('hide-' + k, !state.show[k]));
                app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
                const sb = app.querySelectorAll('[data-size]');
                sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar;
                dl.dataset.ar = state.arSize;
            };
            apply();
            app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
                const k = b.dataset.show;
                if (state.show[k] && Object.values(state.show).filter(Boolean).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
                state.show[k] = !state.show[k]; save(); apply();
            }));
            app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
            app.querySelectorAll('[data-more]').forEach((b) => b.addEventListener('click', () => { const open = b.previousElementSibling.classList.toggle('clamp') === false; b.textContent = open ? 'Kısalt' : 'Devamını oku'; }));
        }
        const btn = document.getElementById('ezb');
        btn.addEventListener('click', () => {
            const now = toggleEzber(x, btn);
            btn.classList.toggle('is-done', now); btn.setAttribute('aria-pressed', String(now));
            btn.querySelector('span').textContent = now ? copy().marked : copy().mark;
        });
        hsub.textContent = x.o;
        document.title = `${x.o} | Esmâ-ül Hüsnâ`;
        return '';
    }

    // ---------- Kartlar ----------
    let deck = null;
    function newDeck() {
        const pool = ALL.filter((x) => state.deste === 'hepsi' || !state.ezber[x.n]);
        const list = (pool.length ? pool : ALL).slice();
        for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
        deck = { list, i: 0, open: false };
    }
    function viewKart() {
        if (!deck || deck.i >= deck.list.length) newDeck();
        const x = deck.list[deck.i];
        const n = ezberCount();
        const seg = (id, label) => `<button type="button" data-deste="${id}" aria-pressed="${state.deste === id}">${label}</button>`;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🃏 ' : ''}Ezber kartları</div>
                    <p class="prog__txt">Kart ${deck.i + 1} / ${deck.list.length} · ${n} / ${T} ezber</p>
                    <div class="filters" style="position:static;margin-top:12px;box-shadow:none"><span style="flex:1;font-size:.84rem;color:var(--soft);padding-left:8px">Deste</span><div class="seg2" role="group" aria-label="Deste">${seg('kalan', 'Kalanlar')}${seg('hepsi', 'Hepsi')}</div></div>
                </section>
                <div class="flip${deck.open ? ' is-open' : ''}" id="flip">
                    <div class="flip__in">
                        <div class="flip__face front" aria-hidden="${deck.open}">
                            <p class="big-ar" lang="ar">${esc(x.ar)}</p>
                            <p class="flip__hint">Anlamını hatırla, sonra kartı çevir.</p>
                        </div>
                        <div class="flip__face back" aria-hidden="${!deck.open}">
                            <p class="okunus">${esc(x.o)}</p>
                            <p class="anlam">${esc(x.a)}</p>
                            <p>${esc(x.y)}</p>
                            <a class="more" href="#/i/${x.n}" style="position:relative;z-index:3">İsmin sayfası</a>
                        </div>
                    </div>
                    <button type="button" class="face-btn" id="flipBtn" aria-label="${deck.open ? 'Kartı geri çevir' : 'Kartı çevir: anlamı göster'}"></button>
                </div>
                <div class="card-acts">
                    <button type="button" class="btn alt" id="again">${IC.again}Tekrar</button>
                    <button type="button" class="btn" id="know">${kid() ? IC.star : IC.check}Biliyorum</button>
                </div>
            </div>`;
        const flip = document.getElementById('flip');
        document.getElementById('flipBtn').addEventListener('click', () => { deck.open = !deck.open; flip.classList.toggle('is-open', deck.open); document.getElementById('flipBtn').setAttribute('aria-label', deck.open ? 'Kartı geri çevir' : 'Kartı çevir: anlamı göster'); flip.querySelectorAll('.flip__face').forEach((f) => f.setAttribute('aria-hidden', String(f.classList.contains('front') ? deck.open : !deck.open))); });
        const next = () => { deck.i += 1; deck.open = false; render(true); };
        document.getElementById('again').addEventListener('click', () => { deck.list.push(x); next(); });
        document.getElementById('know').addEventListener('click', (e) => { if (!state.ezber[x.n]) toggleEzber(x, e.currentTarget); next(); });
        app.querySelectorAll('[data-deste]').forEach((b) => b.addEventListener('click', () => { state.deste = b.dataset.deste; save(); newDeck(); render(true); }));
        hsub.textContent = 'Kartlar';
        document.title = 'Kartlar | Esmâ-ül Hüsnâ';
        return 'kart';
    }

    // ---------- Ezberim ----------
    function viewEzber() {
        const c = copy();
        const n = ezberCount();
        const list = ALL.filter((x) => state.ezber[x.n]);
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⭐ ' : ''}Ezberim</div>
                    <p class="score">${n}<small> / ${T}</small></p>
                    <p class="lead">${esc(c.progress(n))}</p>
                    <div class="prog"><div class="bar" aria-hidden="true"><b style="width:${pct(n, T)}%"></b></div></div>
                    <div class="btns"><a class="btn" href="#/kart">${IC.cards}${esc(c.cards)}</a>${n ? `<button type="button" class="btn alt" id="reset">${IC.again}Sıfırla</button>` : ''}</div>
                </section>
                ${list.length ? `<ul class="grid99" style="list-style:none;padding:0;margin:0">${list.map(ncard).join('')}</ul>` : '<p class="empty">Henüz ezberlenen isim yok. Kartlarla başlayabilirsin.</p>'}
            </div>`;
        const r = document.getElementById('reset');
        if (r) r.addEventListener('click', () => { if (window.confirm('Bütün ezber işaretleri silinsin mi?')) { state.ezber = {}; save(); render(true); } });
        hsub.textContent = 'Ezberim';
        document.title = 'Ezberim | Esmâ-ül Hüsnâ';
        return 'ezber';
    }

    // ---------- Alt panel, görünüm ----------
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
        const h = DATA.hadisler;
        const yok = ALL.filter((x) => x.tur === 'yok').map((x) => x.o).join(', ');
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <h4>Doksan dokuz isim</h4>
            <div class="hadisler"><figure><blockquote>“${esc(h.sahih.metin)}”</blockquote><figcaption>${esc(h.sahih.ravi)} · ${esc(h.sahih.kaynak)}</figcaption></figure></div>
            <h4>Listenin kaynağı ve sıhhati</h4>
            <p>İsimler ve sıraları ${esc(h.liste.kaynak)} rivayetinden, Arapça metin değiştirilmeden alınmıştır. ${esc(h.liste.not)}</p>
            <ul>
                <li><b>Kur'an'da isim olarak geçenler:</b> ${ALL.filter((x) => x.tur === 'isim').length} isim.</li>
                <li><b>Fiil ya da türev olarak geçenler:</b> ${ALL.filter((x) => x.tur === 'fiil').length} isim; ayette aynı kökten bir fiil ya da kelime gösterilir.</li>
                <li><b>Bu kalıpta geçmeyenler:</b> ${esc(yok)}.</li>
            </ul>
            <h4>Ayetler ve anlamlar</h4>
            <p>Kur'an metni: Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}. Her ayetin, gösterildiği ismin kökünü içerdiği metin üzerinde denetlenmiştir. İsimlerin anlam ve açıklamaları yaygın Türkçe açıklamalara göre kısa tutulmuştur; ayrıntı için Diyanet İşleri Başkanlığı ve TDV İslâm Ansiklopedisi kaynaklarına başvurulabilir.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“En güzel isimler Allah'ındır, O'na o isimlerle dua edin.” (A‘râf 180)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her isimde yıldız toplar.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; anlamaya ve tefekküre odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ isimler · #/i/<sıra> · #/kart · #/ezber
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mi = h.match(/^i\/(\d+)$/);
        let active;
        if (mi && ALL[+mi[1] - 1]) active = viewIsim(ALL[+mi[1] - 1]);
        else if (h === 'kart') active = viewKart();
        else if (h === 'ezber') active = viewEzber();
        else active = viewHome();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
