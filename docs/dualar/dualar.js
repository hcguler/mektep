// ============================================
// Kur'an Duaları — uygulama mantığı
// İçerik: data.js (DUA_DATA), Arapça ve meal: metinler.js (DUA_METIN, tools/dualar-uret.mjs üretir).
// Anlatım metinleri tools/dualar-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından
// çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.DUA_DATA;
    const MET = window.DUA_METIN || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.dualar.filter((d) => MET[d.id]).map((d, i) => Object.assign({ n: i + 1 }, d, MET[d.id]));
    const BY = Object.fromEntries(ALL.map((d) => [d.id, d]));
    const DUR = Object.fromEntries(DATA.durumlar.map((d) => [d.id, d]));
    const T = ALL.length;
    const refTxt = (d) => `${d.sure} ${d.no}`;
    // Peygamberler Yolculuğu'ndaki durakların adları
    const P_AD = { adem: 'Hz. Âdem', nuh: 'Hz. Nûh', ibrahim: 'Hz. İbrâhîm', yusuf: 'Hz. Yûsuf', eyyub: 'Hz. Eyyûb', musa: 'Hz. Mûsâ', suleyman: 'Hz. Süleyman', yunus: 'Hz. Yûnus', zekeriyya: 'Hz. Zekeriyyâ', isa: 'Hz. Îsâ', muhammed: 'Hz. Muhammed' };

    // ---------- Kalıcı durum ----------
    const KEY = 'dualar:v1';
    const state = { ezber: {}, show: { ar: true, ok: true, meal: true }, arSize: 2, filtre: 'hepsi', deste: 'kalan', last: null };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.ezber && typeof s.ezber === 'object') state.ezber = s.ezber;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (['hepsi', 'ezber', 'kalan'].includes(s.filtre)) state.filtre = s.filtre;
        if (['kalan', 'hepsi'].includes(s.deste)) state.deste = s.deste;
        if (s.last && BY[s.last]) state.last = s.last;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const ezberCount = () => ALL.filter((d) => state.ezber[d.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Rabbenâ', title: 'Kur’an <em>Duaları</em>',
            lead: 'Peygamberlerin ve müminlerin Kur’an’daki duaları: Arapçası, okunuşu, anlamı, kimin hangi durumda ettiği ve ayetiyle.',
            progress: (n) => n === 0 ? `${T} dua seni bekliyor.` : n === T ? 'Bütün duaları ezberledin. Allah kabul etsin.' : `${T} duadan ${n} tanesini ezberledin.`,
            today: 'Günün duası', cards: 'Kartlarla ezberle', mark: 'Ezberledim', marked: 'Ezberlendi',
            toastOn: (o) => `${o} ezberlendi olarak işaretlendi.`, toastOff: (o) => `${o} için işaret kaldırıldı.`
        },
        cocuk: {
            kick: 'Rabbim, beni duy!', title: '<span class="emo">🤲</span> Kur’an <em>Duaları</em>',
            lead: 'Peygamberler zor anlarında nasıl dua etti? Kur’an’daki duaları öğren, ezberledikçe yıldız topla!',
            progress: (n) => n === 0 ? `${T} yıldız seni bekliyor! ⭐` : n === T ? 'Bütün yıldızları topladın! 🎉' : `${n} yıldız topladın, ${T - n} yıldız kaldı.`,
            today: 'Bugünün duası', cards: 'Kartlarla oyna', mark: 'Ezberledim! ⭐', marked: 'Ezberimde ⭐',
            toastOn: (o) => `Harikasın! ${o} artık ezberinde. 🌟`, toastOff: (o) => `${o} yıldızı geri bırakıldı.`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        hands: svg('<path d="M11 20H8a2 2 0 0 1-2-1.6L5 13c-.2-.9.9-1.5 1.5-.8L8 14V6.5a1 1 0 0 1 2 0V12"/><path d="M13 20h3a2 2 0 0 0 2-1.6l1-5.4c.2-.9-.9-1.5-1.5-.8L16 14V6.5a1 1 0 0 0-2 0V12"/><path d="M12 3v1.5"/>'),
        compass: svg('<circle cx="12" cy="12" r="9.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
        cards: svg('<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
        again: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        check: svg('<path d="M20 6 9 17l-5-5"/>', 2),
        star: svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
        chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’'‘]/g, '');

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
    function toggleEzber(d, origin) {
        const c = copy();
        if (state.ezber[d.id]) { delete state.ezber[d.id]; toast(c.toastOff(d.ad)); }
        else { state.ezber[d.id] = 1; toast(c.toastOn(d.ad)); burst(origin); }
        save();
    }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Dualar', alt: 'Kırk üç Kur’an duası', icon: IC.hands },
        { id: 'durum', href: '#/durum', ad: 'Duruma göre', alt: 'Ne zaman ne dua edilir?', icon: IC.compass },
        { id: 'kart', href: '#/kart', ad: 'Kartlar', alt: 'Ezber kartları', icon: IC.cards }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // ---------- Parçalar ----------
    function dkart(d) {
        return `<li><a class="dk${state.ezber[d.id] ? ' is-done' : ''}" href="#/d/${d.id}">
                <span class="star" aria-hidden="true">★</span>
                <span class="ar" lang="ar">${esc(d.ar)}</span>
                <b>${esc(d.ad)}</b><span class="konu">${esc(d.konu)}</span>
                <span class="meta"><span>${esc(d.kim)}</span><span>${esc(refTxt(d))}</span><span class="emo" aria-hidden="true">${d.emo}</span></span>
                ${state.ezber[d.id] ? '<span class="sr"> (ezberlendi)</span>' : ''}</a></li>`;
    }
    function viewbar() {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips">${chip('ar', 'Arapça')}${chip('ok', 'Okunuş')}${chip('meal', 'Anlam')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const box = app.querySelector('.dua');
        const apply = () => {
            if (box) { ['ar', 'ok', 'meal'].forEach((k) => box.classList.toggle('hide-' + k, !state.show[k])); box.dataset.ar = state.arSize; }
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

    // ---------- Dualar ----------
    let aramaMetni = '';
    function gununDuasi() { const d = new Date(); const g = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 864e5); return ALL[((g % T) + T) % T]; }
    function viewHome() {
        const c = copy();
        const n = ezberCount();
        const g = gununDuasi();
        const seg = (id, label) => `<button type="button" data-filtre="${id}" aria-pressed="${state.filtre === id}">${label}</button>`;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Ezberlenen dualar" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <a class="gunun" href="#/d/${g.id}"><small>${esc(c.today)}</small><span class="ar" lang="ar">${esc(g.ar)}</span><b>${esc(g.ad)}</b><span>${esc(g.kim)} · ${esc(refTxt(g))}</span></a>
                    <div class="btns"><a class="btn" href="#/kart">${IC.cards}${esc(c.cards)}</a><a class="btn alt" href="#/durum">${IC.compass}Duruma göre</a></div>
                </section>
                <div class="filters">
                    <label class="search">${IC.search}<span class="sr">Dua ara</span><input type="search" id="ara" placeholder="Ara: sabır, Yûnus, anne baba…" value="${esc(aramaMetni)}" autocomplete="off"></label>
                    <div class="seg2" role="group" aria-label="Süzgeç">${seg('hepsi', 'Hepsi')}${seg('kalan', 'Kalan')}${seg('ezber', '★')}</div>
                </div>
                <div id="liste" style="display:grid;gap:22px"></div>
            </div>`;
        const liste = document.getElementById('liste'), ara = document.getElementById('ara');
        const ciz = () => {
            const q = norm(aramaMetni.trim());
            const uy = (d) => (state.filtre === 'hepsi' || (state.filtre === 'ezber') === !!state.ezber[d.id]) && (!q || norm([d.ad, d.konu, d.kim, d.ok, d.meal, refTxt(d), d.durum.map((x) => DUR[x].ad).join(' ')].join(' ')).includes(q));
            const html = DATA.gruplar.map((gr) => { const ds = ALL.filter((d) => d.grup === gr.id && uy(d)); return ds.length ? `<section class="grup"><h2>${esc(gr.ad)}<small>${esc(gr.alt)}</small></h2><ul class="duas">${ds.map(dkart).join('')}</ul></section>` : ''; }).join('');
            liste.innerHTML = html || '<p class="empty">Bu aramaya uyan dua yok.</p>';
        };
        ciz();
        ara.addEventListener('input', () => { aramaMetni = ara.value; ciz(); });
        app.querySelectorAll('[data-filtre]').forEach((b) => b.addEventListener('click', () => { state.filtre = b.dataset.filtre; save(); app.querySelectorAll('[data-filtre]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); ciz(); }));
        hsub.textContent = 'Dualar';
        document.title = 'Kur’an Duaları';
        return '';
    }

    // ---------- Duruma göre ----------
    function viewDurum(sec) {
        if (sec && !DUR[sec]) sec = null;
        const say = (id) => ALL.filter((d) => d.durum.includes(id)).length;
        const btns = DATA.durumlar.map((x) => `<a class="dbtn" href="#/durum/${x.id}"${x.id === sec ? ' aria-current="true"' : ''}><span class="emo" aria-hidden="true">${x.emo}</span><b>${esc(x.ad)}</b><small>${say(x.id)} dua</small></a>`).join('');
        const list = sec ? ALL.filter((d) => d.durum.includes(sec)) : [];
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🧭 ' : ''}Duruma göre</div>
                    <h1>${sec ? esc(DUR[sec].ad) : 'Ne zaman, hangi dua?'}</h1>
                    <p class="lead">${sec ? `${list.length} dua. Kur’an’da bu durumda edilen ya da bu anlamı taşıyan dualar.` : 'İçinde bulunduğun durumu seç; Kur’an’da o durumda edilen duaları gör.'}</p>
                </section>
                <div class="durumlar" role="list">${btns}</div>
                ${sec ? `<ul class="duas" id="sonuc">${list.map(dkart).join('')}</ul>` : ''}
            </div>`;
        hsub.textContent = sec ? DUR[sec].ad : 'Duruma göre';
        document.title = `${sec ? DUR[sec].ad + ' · ' : ''}Duruma göre | Kur’an Duaları`;
        return 'durum';
    }

    // ---------- Dua sayfası ----------
    function viewDua(d) {
        const c = copy();
        const prev = ALL[d.n - 2], next = ALL[d.n];
        state.last = d.id; save();
        const durum = d.durum.map((x) => `<a href="#/durum/${x}"><small>Durum</small>${esc(DUR[x].ad)}</a>`).join('');
        const pLink = d.p && P_AD[d.p] ? `<a href="../peygamberler/#/p/${d.p}"><small>Peygamberler</small>${esc(P_AD[d.p])}</a>` : '';
        const ayetAd = String(d.no).includes('-') ? 'ayetler' : 'ayet';
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Dualar</a><span class="pos">${d.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? d.emo + ' ' : ''}${esc(d.kim)}</div>
                    <h1>${esc(d.ad)}</h1>
                    <p class="lead">${esc(d.konu)}</p>
                    <div data-anlatim="${String(d.n).padStart(2, '0')}-${d.id}"></div>
                </section>
                ${viewbar()}
                <section class="dua" aria-label="Dua">
                    <p class="ar" lang="ar">${esc(d.ar)}</p>
                    <p class="ok">${esc(d.ok)}</p>
                    <p class="meal">${esc(d.meal)}</p>
                    <p class="ref">${esc(d.sure)} Suresi, ${d.no}. ${ayetAd}</p>
                </section>
                <div class="btns" style="margin-top:0"><button type="button" class="btn${state.ezber[d.id] ? ' is-done' : ''}" id="ezBtn" aria-pressed="${!!state.ezber[d.id]}">${kid() ? IC.star : IC.check}${esc(state.ezber[d.id] ? c.marked : c.mark)}</button></div>
                <section class="sc expl"><div class="kick">Ne zaman, kim söyledi?</div><p>${esc(d.baglam)}</p></section>
                <details class="tam"><summary>Ayetin tamamı${IC.chev}</summary><div class="in"><p class="ar" lang="ar">${esc(d.arTam)}</p><p class="meal">${esc(d.mealTam)}</p>${d.mealGrup ? `<p class="not">Diyanet mealinde ${esc(d.sure)} ${esc(d.mealGrup.split(':')[1])} ayetleri birlikte çevrilmiştir; meal bu grubun tamamıdır.</p>` : ''}</div></details>
                <div class="chips2">${durum}${pLink}</div>
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(d.akilda)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> Kur’an-ı Kerîm, ${esc(d.sure)} ${d.no}. Arapça: Tanzil. Meal: ${esc(DATA.meal)}. Okunuş yardımcıdır.</p>
                <nav class="pager" aria-label="Önceki ve sonraki dua">
                    ${prev ? `<a href="#/d/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/d/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        const eb = document.getElementById('ezBtn');
        eb.addEventListener('click', () => {
            toggleEzber(d, eb);
            const on = !!state.ezber[d.id];
            eb.classList.toggle('is-done', on); eb.setAttribute('aria-pressed', String(on));
            eb.innerHTML = `${kid() ? IC.star : IC.check}${esc(on ? copy().marked : copy().mark)}`;
        });
        hsub.textContent = d.ad;
        document.title = `${d.ad} | Kur’an Duaları`;
        return '';
    }

    // ---------- Kartlar ----------
    let deck = null;
    function newDeck() {
        const pool = ALL.filter((d) => state.deste === 'hepsi' || !state.ezber[d.id]);
        const list = (pool.length ? pool : ALL).slice();
        for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
        deck = { list, i: 0, open: false };
    }
    function viewKart() {
        if (!deck || deck.i >= deck.list.length) newDeck();
        const d = deck.list[deck.i];
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
                            <p class="ar" lang="ar">${esc(d.ar)}</p>
                            <p class="flip__hint">Okunuşunu ve anlamını hatırla, sonra kartı çevir.</p>
                        </div>
                        <div class="flip__face back" aria-hidden="${!deck.open}">
                            <p class="ok">${esc(d.ok)}</p>
                            <p class="meal">${esc(d.meal)}</p>
                            <small>${esc(d.kim)} · ${esc(refTxt(d))}</small>
                            <a class="more" href="#/d/${d.id}">Duanın sayfası</a>
                        </div>
                    </div>
                    <button type="button" class="face-btn" id="flipBtn" aria-label="${deck.open ? 'Kartı geri çevir' : 'Kartı çevir: okunuşu ve anlamı göster'}"></button>
                </div>
                <div class="card-acts">
                    <button type="button" class="btn alt" id="again">${IC.again}Tekrar</button>
                    <button type="button" class="btn" id="know">${kid() ? IC.star : IC.check}Biliyorum</button>
                </div>
            </div>`;
        const flip = document.getElementById('flip');
        document.getElementById('flipBtn').addEventListener('click', () => {
            deck.open = !deck.open; flip.classList.toggle('is-open', deck.open);
            document.getElementById('flipBtn').setAttribute('aria-label', deck.open ? 'Kartı geri çevir' : 'Kartı çevir: okunuşu ve anlamı göster');
            flip.querySelectorAll('.flip__face').forEach((f) => f.setAttribute('aria-hidden', String(f.classList.contains('front') ? deck.open : !deck.open)));
        });
        const next = () => { deck.i += 1; deck.open = false; render(true); };
        document.getElementById('again').addEventListener('click', () => { deck.list.push(d); next(); });
        document.getElementById('know').addEventListener('click', (e) => { if (!state.ezber[d.id]) toggleEzber(d, e.currentTarget); next(); });
        app.querySelectorAll('[data-deste]').forEach((b) => b.addEventListener('click', () => { state.deste = b.dataset.deste; save(); newDeck(); render(true); }));
        hsub.textContent = 'Kartlar';
        document.title = 'Kartlar | Kur’an Duaları';
        return 'kart';
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
            <p>Bu uygulamadaki bütün dualar Kur’an’dandır.</p>
            <ul>
                <li><b>Arapça metin:</b> Tanzil Quran Text (Simple), değiştirilmeden. Dua ayetin bir parçasıysa yalnızca o kısım, kelime sınırından kesilerek gösterilir; “Ayetin tamamı” bölümünde ayetin bütünü vardır.</li>
                <li><b>Meal:</b> ${esc(DATA.meal)}. Dua kısmının meali aynı mealden, değiştirilmeden alınır. Bu mealde birlikte çevrilmiş ayet gruplarında grubun tamamı ayrıca gösterilir.</li>
                <li><b>Okunuş:</b> Türkçe harflerle yazılmıştır ve yalnızca yardımcıdır. Her okunuşun ünsüz harfleri Arapça metinle otomatik karşılaştırılmıştır; ünlüler ve uzatmalar elle yazılmıştır. Doğru telaffuz için Arapça metinden ve bir hocadan öğrenmek en iyisidir.</li>
                <li><b>Bağlam:</b> Duanın ne zaman ve kim tarafından edildiği yalnızca ayetin kendisinden ve yakın ayetlerden aktarılır.</li>
            </ul>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Bana dua edin ki duanıza icabet edeyim.” (Mü’min 60)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; ezberledikçe yıldız.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ dualar · #/d/<id> · #/durum[/<durum>] · #/kart
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const md = h.match(/^d\/([\w-]+)$/), mu = h.match(/^durum(?:\/([\w-]+))?$/);
        let active;
        if (md && BY[md[1]]) active = viewDua(BY[md[1]]);
        else if (mu) active = viewDurum(mu[1]);
        else if (h === 'kart') active = viewKart();
        else active = viewHome();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        const durumIci = lastHash !== null && /^durum/.test(lastHash) && /^durum/.test(h);
        lastHash = h;
        render(!durumIci);
        if (durumIci) { const s = document.getElementById('sonuc'); if (s) s.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' }); }
        else if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
