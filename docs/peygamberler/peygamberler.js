// ============================================
// Peygamberler Yolculuğu — uygulama mantığı
// İçerik: data.js (PEYGAMBER_DATA), Arapça adlar: adlar.js (Kur'an metninden), ayetler: ayetler.js.
// Anlatım metinleri tools/peygamberler-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından
// çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.PEYGAMBER_DATA;
    const ADLAR = window.PEYGAMBER_ADLAR || {};
    const AYET = window.PEYGAMBER_AYETLER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.peygamberler.map((p, i) => Object.assign({ n: i + 1, ar: ADLAR[p.id] || '' }, p));
    const BY = Object.fromEntries(ALL.map((p) => [p.id, p]));
    const T = ALL.length;

    // ---------- Kalıcı durum ----------
    const KEY = 'peygamberler:v1';
    const state = { seen: {}, show: { ar: true, meal: true }, arSize: 2, best: 0, last: null };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.seen && typeof s.seen === 'object') state.seen = s.seen;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (Number.isInteger(s.best)) state.best = s.best;
        if (s.last && BY[s.last]) state.last = s.last;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const seenCount = () => ALL.filter((p) => state.seen[p.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Bismillâh', title: 'Peygamberler <em>Yolculuğu</em>',
            lead: 'Kur’an’da adı geçen yirmi beş peygamber: kıssaları, kavimleri ve hayatlarından olaylar, her biri ayetiyle. Ana kaynak Kur’an’dır.',
            progress: (n) => n === 0 ? `${T} durağın hepsi seni bekliyor.` : n === T ? 'Yolculuğun bütün duraklarını gezdin.' : `${T} duraktan ${n} tanesini gezdin.`,
            resume: 'Devam et', start: 'Yolculuğa başla',
            right: 'Doğru.', wrong: 'Doğru cevap',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Duraklara göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Hadi yola çıkalım!', title: '<span class="emo">🧭</span> Peygamberler <em>Yolculuğu</em>',
            lead: 'Hz. Âdem’den Peygamberimize yirmi beş durak! Her durakta Kur’an’dan bir hikâye ve bir ders seni bekliyor.',
            progress: (n) => n === 0 ? `${T} durak seni bekliyor! 🗺️` : n === T ? 'Bütün durakları gezdin! 🎉' : `${n} durağı gezdin, ${T - n} durak kaldı.`,
            resume: 'Devam et', start: 'Yola çık',
            right: 'Harika, doğru! 🌟', wrong: 'Doğrusu',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Biraz daha gezip yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        route: svg('<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>'),
        tree: svg('<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M12 7.5v4M12 11.5 6 16.5M12 11.5l6 5"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 2.4-2.8 4.1M12 17.2h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
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
        { id: '', href: '#/', ad: 'Yolculuk', alt: 'Yirmi beş durak', icon: IC.route },
        { id: 'aile', href: '#/aile', ad: 'Aile', alt: 'Kur’an’daki aile bağları', icon: IC.tree },
        { id: 'test', href: '#/test', ad: 'Bil bakalım', alt: 'Hangi peygamber?', icon: IC.quiz }
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

    // ---------- Yolculuk ----------
    function viewYol() {
        const c = copy();
        const n = seenCount();
        const last = state.last && BY[state.last];
        const giris = DATA.giris.map((g) => `<details><summary><b>${esc(refTxt(g.ayet))}</b><span>${esc(g.metin)}</span></summary><div class="delils">${ayBlock(g.ayet)}</div></details>`).join('');
        const stops = ALL.map((p) => `<li class="stop${state.seen[p.id] ? ' is-seen' : ''}"><a href="#/p/${p.id}">
                <span class="medal" aria-hidden="true"><span class="n">${p.n}</span><span class="emo">${p.motif}</span></span>
                <b>${esc(p.ad)}</b><small>${esc(p.kisa)}</small><span class="ar" lang="ar" aria-hidden="true">${esc(p.ar)}</span>
                ${state.seen[p.id] ? '<span class="sr"> (gezildi)</span>' : ''}</a></li>`).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Gezilen duraklar" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="giris">${giris}</div>
                    <div class="btns">${last ? `<a class="btn" href="#/p/${last.id}">${IC.go}${esc(c.resume + ': ' + last.ad)}</a>` : `<a class="btn" href="#/p/adem">${IC.go}${esc(c.start)}</a>`}<a class="btn alt" href="#/test">${IC.quiz}Bil bakalım</a></div>
                </section>
                <ol class="yol">${stops}</ol>
                <p class="note"><b>Not:</b> Sıralama, Hz. Âdem’den Hz. Muhammed’e kadar yaygın sıralamadır. Kur’an bütün peygamberler için kesin bir tarih sırası vermez; Kur’an’da adı geçmeyen peygamberler de vardır (Nisâ 164).</p>
            </div>`;
        bindView();
        hsub.textContent = 'Yolculuk';
        document.title = 'Peygamberler Yolculuğu';
        return '';
    }

    // ---------- Peygamber sayfası ----------
    function viewPeygamber(p) {
        const prev = ALL[p.n - 2], next = ALL[p.n];
        state.seen[p.id] = true; state.last = p.id; save();
        const facts = [];
        if (p.kavim) facts.push(`<span><b>Kavmi:</b> ${esc(p.kavim.metin)} <i>(${esc(refTxt(p.kavim.ayet))})</i></span>`);
        if (p.yer) facts.push(`<span><b>Yer:</b> ${esc(p.yer.metin)} <i>(${esc(refTxt(p.yer.ayet))})</i></span>`);
        const olaylar = p.olaylar.map((o, i) => `<details class="olay"><summary><span class="no">${i + 1}</span><span>${esc(o.metin)}</span>${IC.chev}<small>${esc(refTxt(o.ayet))} · ayeti göster</small></summary>${ayBlock(o.ayet)}</details>`).join('');
        const aile = (p.aile || []).map((a) => BY[a.id] ? `<a class="aile-chip" href="#/p/${a.id}"><small>${esc(a.bag)}</small>${esc(BY[a.id].ad)}</a>` : '').join('');
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Yolculuk</a><span class="pos">${p.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? p.motif + ' ' : ''}${p.n}. durak</div>
                    <p class="big-ar" lang="ar">${esc(p.ar)}</p>
                    <h1>${esc(p.ad)}</h1>
                    <p class="lead">${esc(p.kisa)}</p>
                    <div data-anlatim="${String(p.n).padStart(2, '0')}-*"></div>
                    ${facts.length ? `<div class="facts">${facts.join('')}</div>` : ''}
                </section>
                <section class="sc expl"><div class="kick">Kur’an’a göre</div><p>${esc(p.ozet)}</p></section>
                <h2 class="secttl">Kur’an’dan olaylar</h2>
                ${viewbar()}
                <div class="olaylar delils">${olaylar}</div>
                ${p.not ? `<p class="pnote"><b>Not:</b> ${esc(p.not)}</p>` : ''}
                <h2 class="secttl">Öne çıkan ayet</h2>
                <section class="sc delil delils">${ayBlock(p.ayet)}</section>
                ${aile ? `<h2 class="secttl">Aile bağları</h2><div class="aile-chips">${aile}</div>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(p.akilda)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> Kur’an-ı Kerîm (Arapça ad: ${esc(refTxt(p.adAyet))}; olaylar: ${p.olaylar.map((o) => esc(refTxt(o.ayet))).join('; ')}). Meal: ${esc(DATA.meal)}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki durak">
                    ${prev ? `<a href="#/p/${prev.id}"><small>Önceki durak</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/p/${next.id}"><small>Sonraki durak</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = p.ad;
        document.title = `${p.ad} | Peygamberler Yolculuğu`;
        return '';
    }

    // ---------- Aile ağacı (yalnızca Kur'an'da geçen bağlar) ----------
    function node(id) { const p = BY[id]; return `<a class="tnode" href="#/p/${id}"><span class="ar" lang="ar">${esc(p.ar)}</span><b>${esc(p.ad.replace('Hz. ', ''))}</b></a>`; }
    const link = (txt, ref) => `<span class="tlink"><em>${esc(txt)}</em>${esc(refTxt(ref))}</span>`;
    function viewAile() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🌳 ' : ''}Aile bağları</div>
                    <h1>Peygamber aileleri</h1>
                    <p class="lead">Kur’an’ın açıkça bildirdiği baba, oğul ve kardeş bağları. Her bağın altında ayeti yazılıdır.</p>
                </section>
                <div class="tree">
                    <section class="sc"><div class="kick">İbrâhîm ailesi</div>
                        <div class="branch">${node('ibrahim')}${link('oğulları', '14:39')}
                            <div class="trow">
                                <div class="branch">${node('ismail')}</div>
                                <div class="branch">${node('ishak')}${link('oğlu', '19:49')}${node('yakup')}${link('oğlu', '12:6')}${node('yusuf')}</div>
                            </div>
                        </div>
                        <p class="tree-cap" style="margin-top:14px">Hz. Lût, Hz. İbrâhîm’e inananlardandır (Ankebût 26).</p>
                    </section>
                    <section class="sc"><div class="kick">Kardeşler</div><div class="branch"><div class="trow">${node('musa')}${node('harun')}</div>${link('kardeşi Hârûn’u bir peygamber olarak bağışladık', '19:53')}</div></section>
                    <section class="sc"><div class="kick">Baba ve oğul</div><div class="trow">
                        <div class="branch">${node('davud')}${link('vâris oldu', '27:16')}${node('suleyman')}</div>
                        <div class="branch">${node('zekeriyya')}${link('müjdelendi', '19:7')}${node('yahya')}</div>
                    </div></section>
                    <p class="note"><b>Not:</b> Burada yalnızca Kur’an’ın açıkça bildirdiği bağlar gösterilir. Diğer akrabalık bilgileri hadis ve tarih kaynaklarına dayandığı için bu ağaca eklenmemiştir.</p>
                </div>
            </div>`;
        hsub.textContent = 'Aile';
        document.title = 'Aile | Peygamberler Yolculuğu';
        return 'aile';
    }

    // ---------- Bil bakalım ----------
    const ROUND = 10;
    let quiz = null;
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    function newQuiz() {
        const pool = [];
        ALL.forEach((p) => p.olaylar.forEach((o) => { if (o.soru) pool.push({ p, o }); }));
        quiz = { list: shuffle(pool).slice(0, Math.min(ROUND, pool.length)).map((q) => ({ ...q, opts: shuffle([q.p, ...shuffle(ALL.filter((x) => x.id !== q.p.id)).slice(0, 2)]) })), i: 0, score: 0, answered: null };
    }
    function viewTest() {
        if (!quiz) newQuiz();
        const c = copy();
        const total = quiz.list.length;
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > state.best) { state.best = n; save(); }
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}Sonuç</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/">${IC.route}Yolculuğa dön</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i], ans = quiz.answered;
            const opts = q.opts.map((o) => {
                let cls = '';
                if (ans) cls = o.id === q.p.id ? ' is-right' : o.id === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="opt2${cls}" data-ans="${o.id}"${ans ? ' disabled' : ''}><span class="emo" aria-hidden="true">${o.motif}</span>${esc(o.ad)}${ans && o.id === q.p.id ? '<span class="mark">✓</span>' : ''}${ans && o.id === ans && o.id !== q.p.id ? '<span class="mark">✗</span>' : ''}</button>`;
            }).join('');
            const a = AYET[q.o.ayet];
            app.innerHTML = `
                <div class="page in"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    <p class="quiz__ask">Hangi peygamber?</p>
                    <p class="quiz__q">${esc(q.o.soru)}</p>
                    <div class="opts" role="group" aria-label="Seçenekler" style="grid-template-columns:1fr">${opts}</div>
                    ${ans ? `<div class="fb ${ans === q.p.id ? 'ok' : 'no'}" role="status"><b>${esc(ans === q.p.id ? c.right : c.wrong + ': ' + q.p.ad + '.')}</b> ${a ? `“${esc(a.meal.length > 200 ? a.meal.slice(0, 200).replace(/\s+\S*$/, '') + '…' : a.meal)}” <em style="font-style:normal;color:var(--faint)">(${esc(a.sure)} ${a.no})</em>` : ''} <a href="#/p/${q.p.id}">Durağı aç</a></div>
                        <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section></div>`;
            app.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = b.dataset.ans;
                const right = quiz.answered === q.p.id;
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.opt2.is-right')); else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = 'Bil bakalım';
        document.title = 'Bil bakalım | Peygamberler Yolculuğu';
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
            <p>Bu uygulamanın ana kaynağı Kur’an’dır. Her peygamberle ilgili her bilgi bir ayete dayanır; Kur’an’da geçmeyen tarih, yaş ya da yer bilgisi verilmez.</p>
            <ul>
                <li><b>Kur'an metni:</b> Tanzil Quran Text (Simple), değiştirilmeden. Peygamberlerin Arapça adları da bu metinden, adlarının geçtiği ayetten alınmıştır.</li>
                <li><b>Meal:</b> ${esc(DATA.meal)}. Bu mealde birleşik çevrilmiş ayetler aralık olarak gösterilir.</li>
                <li><b>Alıntılar:</b> Olaylarda tırnak içindeki sözler mealin kendi ifadeleridir.</li>
                <li><b>Sıralama:</b> Hz. Âdem’den Hz. Muhammed’e yaygın sıralama. Kur’an bütün peygamberler için kesin bir tarih sırası vermez.</li>
                <li><b>Aile bağları:</b> Yalnızca Kur’an’ın açıkça bildirdiği bağlar gösterilir.</li>
            </ul>
            <h4>Yirmi beş peygamber</h4>
            <p>Kur’an’da adı geçen ve peygamber olduğu açıkça bildirilen yirmi beş peygamber anlatılır. Kur’an, kıssalarını anlatmadığı başka peygamberler de olduğunu bildirir (Nisâ 164). Üzeyr, Lokmân ve Zülkarneyn’in adları Kur’an’da geçer; peygamber olup olmadıkları konusunda âlimler arasında farklı görüşler vardır.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Peygamberlerin kıssalarında, aklı olanlar için ibretler vardır.” (Yûsuf 111)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her durakta bir simge.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ yolculuk · #/p/<id> · #/aile · #/test
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mp = h.match(/^p\/([\w-]+)$/);
        let active;
        if (mp && BY[mp[1]]) active = viewPeygamber(BY[mp[1]]);
        else if (h === 'aile') active = viewAile();
        else if (h === 'test') active = viewTest();
        else active = viewYol();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && lastHash === 'test' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
