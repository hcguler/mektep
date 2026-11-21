// ============================================
// İslam'da Kavram Haritası — uygulama mantığı
// İçerik: data.js (window.KAVRAM_DATA), ayet metinleri: ayetler.js (window.KAVRAM_AYETLER)
// Anlatım metinleri tools/kavram-anlatim.json içinde tutulur; metin gösterilmez;
// kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Tema (apps:tema) ve renk (theme) anahtarları bütün uygulamalarla ortaktır.
// ============================================
(function () {
    'use strict';

    const DATA = window.KAVRAM_DATA;
    const AYET = window.KAVRAM_AYETLER || {};
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
    const GROUPS = DATA.gruplar;
    const G = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
    const ALL = DATA.kavramlar;
    const BY_ID = Object.fromEntries(ALL.map((k) => [k.id, k]));
    const inGroup = (gid) => ALL.filter((k) => k.grup === gid);
    const HUKUM = inGroup('hukum');
    const H = DATA.hadisler;
    const QUESTIONS = [];
    ALL.forEach((k) => (k.ornekler || []).forEach((o) => { if (o.soru) QUESTIONS.push({ metin: o.metin, ref: o.ref, cevap: o.soru, kavram: k.id }); }));
    const ANSWERS = Object.fromEntries(DATA.sorular.map((s) => [s.id, s]));
    const KIND_OF_ANSWER = { farz: 'farz', sunnet: 'sunnet', mubah: 'mubah', mekruh: 'tenzihen', haram: 'haram' };

    // ---------- Kalıcı durum ----------
    const KEY = 'kavram:v1';
    const state = { seen: {}, show: { ar: true, meal: true }, arSize: 2, best: 0, last: null };
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (saved.seen && typeof saved.seen === 'object') state.seen = saved.seen;
        state.show = Object.assign(state.show, saved.show || {});
        if (Number.isInteger(saved.arSize)) state.arSize = Math.max(0, Math.min(4, saved.arSize));
        if (Number.isInteger(saved.best)) state.best = saved.best;
        if (saved.last && BY_ID[saved.last]) state.last = saved.last;
    } catch (e) { /* depolama kapalıysa varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';

    // ---------- Temaya göre metinler (içerik aynı, ton farklı) ----------
    const COPY = {
        yetiskin: {
            kick: 'Bismillâh',
            title: 'Kavram <em>Haritası</em>',
            lead: 'Dinî hükümlerin dili: farzdan harama, helalden şüpheliye. Her kavram tanımı, delili ve günlük hayattan örnekleriyle.',
            seen: (n, t) => n === 0 ? `${t} kavramın hepsi keşfedilmeyi bekliyor.` : n === t ? 'Bütün kavramları okudun.' : `${t} kavramdan ${n} tanesini okudun.`,
            start: 'Teraziyi incele', test: 'Kendini dene', resume: 'Devam et',
            right: 'Doğru.', wrong: 'Doğru cevap', result: (n, t) => n === t ? 'Hepsi doğru. Kavramlar yerli yerinde.' : n >= t * 0.7 ? 'Güzel bir sonuç. Yanlışlarını kavram sayfasından tekrar edebilirsin.' : 'Kavram sayfalarına göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Keşfe çık',
            title: '<span class="emo">🧭</span> Kavram <em>Haritası</em>',
            lead: 'Farz ne demek, mubah ne demek? Haritada gez, her kavramın hikâyesini öğren!',
            seen: (n, t) => n === 0 ? `${t} kavram seni bekliyor.` : n === t ? 'Bütün haritayı gezdin! 🎉' : `${n} kavramı keşfettin, ${t - n} kavram kaldı.`,
            start: 'Teraziye bak', test: 'Bilgini sına', resume: 'Devam et',
            right: 'Harika, doğru! 🌟', wrong: 'Doğrusu', result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Haritada biraz daha gezip yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    // ---------- Yardımcılar ----------
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        map: svg('<path d="M14.1 6.3 9.9 4.2a1 1 0 0 0-.9 0L3.6 6.8A1 1 0 0 0 3 7.7v11.7a.6.6 0 0 0 .9.5l5.1-2.5a1 1 0 0 1 .9 0l4.2 2.1a1 1 0 0 0 .9 0l5.4-2.6a1 1 0 0 0 .6-.9V4.3a.6.6 0 0 0-.9-.5l-5.1 2.5a1 1 0 0 1-.9 0z"/><path d="M15 6.5v13.3M9 4.2v13.3"/>'),
        scale: svg('<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/>'),
        book: svg('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6.9c0 1.9-2.8 2.4-2.8 4.1M12 17.2h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.4)
    };
    const kindOf = (k) => k.renk || (k.grup === 'kaynak' ? 'kaynak' : k.grup === 'ilke' ? 'ilke' : 'kaynak');
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const seenCount = () => ALL.filter((k) => state.seen[k.id]).length;
    const short = (k) => k.kisaAd || k.ad;

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
        { id: '', href: '#/', ad: 'Harita', alt: 'Bütün kavramlar bir bakışta', icon: IC.map },
        { id: 'hukum', href: '#/hukum', ad: 'Hükümler', alt: 'Farzdan harama terazi', icon: IC.scale },
        { id: 'temel', href: '#/temel', ad: 'Temeller', alt: 'Kaynaklar ve ilkeler', icon: IC.book },
        { id: 'test', href: '#/test', ad: 'Kendini dene', alt: 'Günlük hayattan sorular', icon: IC.quiz }
    ];
    function drawNav(active) {
        tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join('');
    }

    // ---------- Parçalar ----------
    function nodeLink(k) {
        return `<a class="node k-${kindOf(k)}${state.seen[k.id] ? ' is-seen' : ''}" href="#/k/${k.id}"><i class="dot" aria-hidden="true"></i>${esc(short(k))}${state.seen[k.id] ? '<span class="sr"> (okundu)</span>' : ''}</a>`;
    }
    function terazi() {
        const nodes = HUKUM.map((k) => `<a class="tnode k-${k.renk}${state.seen[k.id] ? ' is-seen' : ''}" href="#/k/${k.id}">
                <i class="dot" aria-hidden="true"></i><span class="emo" aria-hidden="true">${k.emo}</span>
                <span class="tx"><b>${esc(short(k))}</b><small>${esc(k.kisa)}</small></span></a>`).join('');
        return `<div class="terazi" role="list" aria-label="Hüküm terazisi: yapılması istenenlerden sakınılması istenenlere">
                <span class="br br-l istenen" aria-hidden="true"><span>İstenenler</span></span>
                <span class="br br-l serbest" aria-hidden="true"><span>Serbest</span></span>
                <span class="br br-l sakinilan" aria-hidden="true"><span>Sakınılanlar</span></span>
                ${nodes}
                <span class="br br-r helal" aria-hidden="true"><span>Helal alanı</span></span>
                <span class="br br-r yasak" aria-hidden="true"><span>Yasak</span></span>
                <a class="supheli-pin" href="#/k/supheli">❔ Şüpheli</a>
            </div>`;
    }

    // ---------- Harita ----------
    function viewMap() {
        const c = copy();
        const n = seenCount(), t = ALL.length;
        const last = state.last && BY_ID[state.last];
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam"></div>
                    <div class="prog">
                        <div class="bar" role="progressbar" aria-label="Okunan kavramlar" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${n}"><b style="width:${pct(n, t)}%"></b></div>
                        <p class="prog__txt">${esc(c.seen(n, t))}</p>
                    </div>
                    <div class="btns">
                        ${last ? `<a class="btn" href="#/k/${last.id}">${IC.go}${esc(c.resume + ': ' + last.ad)}</a>` : `<a class="btn" href="#/hukum">${IC.scale}${esc(c.start)}</a>`}
                        <a class="btn alt" href="#/test">${IC.quiz}${esc(c.test)}</a>
                    </div>
                </section>
                <div class="map">
                    <section class="map__sec k-kaynak">
                        <h2>${esc(G.kaynak.ad)}</h2><span class="map__q">${esc(G.kaynak.soru)}</span>
                        <div class="nodes">${inGroup('kaynak').map(nodeLink).join('')}</div>
                    </section>
                    <div class="map__link" aria-hidden="true">hükmü belirler</div>
                    <section class="map__sec">
                        <h2>${esc(G.hukum.ad)}</h2><span class="map__q">${esc(G.hukum.soru)}</span>
                        ${terazi()}
                        <div class="nodes" style="margin-top:30px">${inGroup('cati').map(nodeLink).join('')}</div>
                    </section>
                    <div class="map__link" aria-hidden="true">hayata uygulanır</div>
                    <section class="map__sec k-ilke">
                        <h2>${esc(G.ilke.ad)}</h2><span class="map__q">${esc(G.ilke.soru)}</span>
                        <div class="nodes">${inGroup('ilke').map(nodeLink).join('')}</div>
                    </section>
                </div>
            </div>`;
        hsub.textContent = 'Harita';
        document.title = "İslam'da Kavram Haritası";
        return '';
    }

    // ---------- Liste sayfaları ----------
    function itemRow(k, i) {
        const kind = kindOf(k);
        return `<li><a class="item k-${kind}${state.seen[k.id] ? ' is-done' : ''}" href="#/k/${k.id}">
                <span class="item__no k-dot" aria-hidden="true">${kid() && k.emo ? `<span class="emo">${k.emo}</span>` : `<span>${i + 1}</span>`}${IC.check}</span>
                <span class="item__ad">${esc(k.ad)}${state.seen[k.id] ? '<span class="sr"> (okundu)</span>' : ''}</span>
                <span class="item__konu">${esc(k.kisa)}</span>
                <span class="item__ar2" lang="ar" aria-hidden="true">${esc(k.ar)}</span>
            </a></li>`;
    }
    function listBlock(gid) {
        const g = G[gid], list = inGroup(gid);
        return `<div class="listhead"><h2>${esc(g.ad)}</h2><small>${list.filter((k) => state.seen[k.id]).length} / ${list.length}</small></div>
            <p class="tabs__note" style="margin:0 4px">${esc(g.aciklama)}</p>
            <ol class="items">${list.map(itemRow).join('')}</ol>`;
    }
    function viewHukum() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⚖️ ' : ''}Sekiz derece</div>
                    <h1>${esc(G.hukum.ad)}</h1>
                    <p class="lead">${esc(G.hukum.aciklama)} Hanefî mezhebindeki ayrıntılı sıralama esas alınmıştır; diğer mezheplerin kullanımı her kavramda ayrıca belirtilir.</p>
                    ${terazi()}
                    <p class="terazi-cap" aria-hidden="true" style="margin-top:34px"><span>Yapılması istenen</span><span>Sakınılması istenen</span></p>
                </section>
                ${listBlock('hukum')}
                ${listBlock('cati')}
            </div>`;
        hsub.textContent = 'Hükümler';
        document.title = "Hükümler | İslam'da Kavram Haritası";
        return 'hukum';
    }
    function viewTemel() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '📚 ' : ''}Kaynaklar ve ilkeler</div>
                    <h1>Temeller</h1>
                    <p class="lead">Hükümlerin nereden bilindiği ve hayata nasıl uygulandığı.</p>
                </section>
                ${listBlock('kaynak')}
                ${listBlock('ilke')}
            </div>`;
        hsub.textContent = 'Temeller';
        document.title = "Temeller | İslam'da Kavram Haritası";
        return 'temel';
    }

    // ---------- Kavram sayfası ----------
    function delilHtml(d) {
        if (d.ayet) {
            const a = AYET[d.ayet];
            if (!a) return '';
            const long = a.meal.length > 320;
            return `<section class="sc delil">
                    <span class="tag k-kaynak">Ayet</span>
                    <p class="ayet-ar" lang="ar">${esc(a.ar)}</p>
                    <p class="ayet-meal${long ? ' clamp' : ''}">${esc(a.meal)}</p>
                    ${long ? '<button type="button" class="more" data-more>Devamını oku</button>' : ''}
                    <p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p>
                    ${d.not ? `<p class="dnot"><b>Not:</b> ${esc(d.not)}</p>` : ''}
                </section>`;
        }
        const h = H[d.hadis];
        if (!h) return '';
        return `<section class="sc delil hadis">
                <span class="tag k-ilke">Hadis</span>
                <p class="quote">“${esc(h.metin)}”</p>
                <p class="ravi">Rivayet eden: ${esc(h.ravi)}</p>
                <p class="ref">${esc(h.kaynak)}</p>
                ${d.not ? `<p class="dnot"><b>Not:</b> ${esc(d.not)}</p>` : ''}
            </section>`;
    }
    function viewKavram(k) {
        const g = G[k.grup];
        const list = inGroup(k.grup);
        const i = list.indexOf(k);
        const prev = list[i - 1], next = list[i + 1];
        const kind = kindOf(k);
        const isHukum = k.grup === 'hukum';
        const hasAyet = (k.deliller || []).some((d) => d.ayet);
        state.seen[k.id] = true; state.last = k.id; save();
        const mini = isHukum ? `<div class="mini" role="img" aria-label="Terazideki yeri: ${HUKUM.indexOf(k) + 1} / ${HUKUM.length}">${HUKUM.map((h) => `<i class="k-${h.renk}${h.id === k.id ? ' on' : ''}"></i>`).join('')}</div>
            <div class="mini-cap" aria-hidden="true"><span>İstenen</span><span>Serbest</span><span>Sakınılan</span></div>` : '';
        const outcome = k.yaparsan ? `<div class="outcome"><div><b>Yaparsan</b><span>${esc(k.yaparsan)}</span></div><div><b>Yapmazsan</b><span>${esc(k.yapmazsan)}</span></div></div>` : '';
        const chip = (key, label) => `<button type="button" class="chip" data-show="${key}" aria-pressed="${state.show[key]}"><i aria-hidden="true"></i>${label}</button>`;
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs">
                    <a class="nb" href="#/${k.grup === 'hukum' || k.grup === 'cati' ? 'hukum' : 'temel'}">${IC.left}${esc(g.ad)}</a>
                    <span class="pos">${i + 1} / ${list.length}</span>
                </div>
                <section class="sc hero k-${kind}">
                    <div class="kick">${kid() && k.emo ? k.emo + ' ' : ''}${esc(g.ad)}</div>
                    <h1>${esc(k.ad)}</h1>
                    <p class="term" lang="ar">${esc(k.ar)}</p>
                    <p class="lead">${esc(k.kisa)}</p>
                    <div data-anlatim="${k.id}"></div>
                    ${mini}
                </section>
                <section class="sc expl">
                    <div class="kick">Açıklama</div>
                    <p>${esc(k.tanim)}</p>
                    ${outcome ? `<div style="margin-top:18px">${outcome}</div>` : ''}
                </section>
                <h2 class="secttl">Deliller</h2>
                ${hasAyet ? `<div class="viewbar" role="group" aria-label="Ayetlerde gösterilecek metinler">
                    <div class="chips" style="grid-template-columns:repeat(2,minmax(0,1fr))">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                    <div class="size" role="group" aria-label="Arapça yazı boyutu">
                        <button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button>
                        <button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button>
                    </div>
                </div>` : ''}
                <div class="delils page" data-ar="${state.arSize}">${(k.deliller || []).map(delilHtml).join('')}</div>
                <section class="sc k-${kind}">
                    <div class="kick">Günlük hayattan</div>
                    <ul class="ex">${(k.ornekler || []).map((o) => `<li><span>${esc(o.metin)}${o.ref ? `<small>${esc(o.ref)}</small>` : ''}</span></li>`).join('')}</ul>
                </section>
                ${k.mezhep ? `<p class="note"><b>Mezhep notu:</b> ${esc(k.mezhep)}</p>` : ''}
                <section class="sc memo">
                    <div class="kick">Akılda kalsın</div>
                    <p class="quote">${esc(k.akilda)}</p>
                </section>
                <p class="srccard src"><b>Kaynak:</b> ${esc(k.kaynak)}</p>
                ${(k.iliskili || []).length ? `<h2 class="secttl">İlgili kavramlar</h2><div class="rel">${k.iliskili.map((id) => BY_ID[id]).filter(Boolean).map(nodeLink).join('')}</div>` : ''}
                <nav class="pager" aria-label="Önceki ve sonraki kavram">
                    ${prev ? `<a href="#/k/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/k/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;

        const dl = app.querySelector('.delils');
        const applyShow = () => {
            ['ar', 'meal'].forEach((key) => dl.classList.toggle('hide-' + key, !state.show[key]));
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            const sb = app.querySelectorAll('[data-size]');
            if (sb.length) { sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; }
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
            const p = b.previousElementSibling;
            const open = p.classList.toggle('clamp') === false;
            b.textContent = open ? 'Kısalt' : 'Devamını oku';
        }));
        hsub.textContent = k.ad;
        document.title = `${k.ad} | İslam'da Kavram Haritası`;
        return k.grup === 'hukum' || k.grup === 'cati' ? 'hukum' : 'temel';
    }

    // ---------- Kendini dene ----------
    const ROUND = 10;
    let quiz = null;
    function newQuiz() {
        const pool = QUESTIONS.slice();
        for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
        quiz = { list: pool.slice(0, Math.min(ROUND, pool.length)), i: 0, score: 0, answered: null };
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
                        <div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/hukum">${IC.scale}Teraziye dön</a></div>
                    </section>
                </div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i];
            const ans = quiz.answered;
            const opts = DATA.sorular.map((s) => {
                const kind = KIND_OF_ANSWER[s.id];
                const emo = (BY_ID[s.kavram] || {}).emo || '';
                let cls = '';
                if (ans) cls = s.id === q.cevap ? ' is-right' : s.id === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="opt2 k-${kind}${cls}" data-ans="${s.id}"${ans ? ' disabled' : ''}><i class="dot" aria-hidden="true"></i><span class="emo" aria-hidden="true">${emo}</span>${esc(s.ad)}${ans && s.id === q.cevap ? '<span class="mark">✓</span>' : ''}${ans && s.id === ans && s.id !== q.cevap ? '<span class="mark">✗</span>' : ''}</button>`;
            }).join('');
            const k = BY_ID[q.kavram];
            const ok = ans === q.cevap;
            app.innerHTML = `
                <div class="page in">
                    <section class="sc">
                        <div class="quiz__top">
                            <span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span>
                            <div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div>
                        </div>
                        <p class="quiz__ask">Bu davranışın hükmü nedir?</p>
                        <p class="quiz__q">${esc(q.metin)}</p>
                        ${q.ref ? `<p class="quiz__ref">${esc(q.ref)}</p>` : ''}
                        <div class="opts" role="group" aria-label="Bu davranışın hükmü nedir?">${opts}</div>
                        ${ans ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong + ': ' + ANSWERS[q.cevap].ad + '.')}</b> ${esc(k.ad)}: ${esc(k.kisa.toLocaleLowerCase('tr'))}. <a href="#/k/${k.id}">Kavramı aç</a></div>
                            <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                    </section>
                    <p class="note"><b>Not:</b> Sorular kavram sayfalarındaki örneklerden seçilir. Vacip ve müstehab, farz ve sünnetle birlikte sorulur; mezhebe göre hükmü değişen örnekler sorulmaz ya da Hanefî mezhebine göre sorulur.</p>
                </div>`;
            app.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = b.dataset.ans;
                if (quiz.answered === q.cevap) quiz.score += 1;
                const wasRight = quiz.answered === q.cevap;
                render(false);
                const nb = document.getElementById('nextQ');
                if (nb) nb.focus();
                if (wasRight) burst(app.querySelector('.opt2.is-right'));
                else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = 'Kendini dene';
        document.title = "Kendini dene | İslam'da Kavram Haritası";
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
            <p>Dinî içerikte doğruluk esastır. Her kavramın altında kaynağı ayrıca belirtilmiştir.</p>
            <ul>
                <li><b>Kur'an metni:</b> Tanzil Quran Text (Simple), tanzil.net; metin değiştirilmeden kullanılmıştır.</li>
                <li><b>Meal:</b> ${esc(DATA.meal)}.</li>
                <li><b>Hadisler:</b> Yalnızca Buhârî ve Müslim'den alınmıştır. Numaralar Buhârî için genel hadis numarası, Müslim için M. Fuâd Abdülbâkî numarasıdır. Hadis metinleri anlam olarak aktarılmıştır.</li>
                <li><b>Tanımlar:</b> Diyanet İşleri Başkanlığı, İlmihal I: İman ve İbadetler; TDV İslâm Ansiklopedisi'nin ilgili maddeleri.</li>
            </ul>
            <h4>Mezhep</h4>
            <p>Hüküm terazisinde Hanefî mezhebindeki ayrıntılı sıralama (farz, vacip, sünnet, müstehab, mubah, tenzîhen mekruh, tahrîmen mekruh, haram) esas alınmıştır. Âlimlerin çoğunluğu hükümleri beş derecede toplar: farz (vacip), mendup, mubah, mekruh, haram. Mezhepler arasındaki farklar her kavramın sayfasında ayrıca belirtilir.</p>
            <h4>Örnekler</h4>
            <p>Örnekler, âlimlerin üzerinde birleştiği ve günlük hayatta sık karşılaşılan durumlardan seçilmiştir. Kişisel bir durumun hükmünü öğrenmek için bir din görevlisine ya da Diyanet İşleri Başkanlığı'nın Din İşleri Yüksek Kurulu kaynaklarına başvurmak en doğrusudur.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">İlim, amel içindir.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4>
            <div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; keşfederek öğretir.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya ve anlamaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ harita · #/hukum · #/temel · #/test · #/k/<kavram>
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const m = h.match(/^k\/([\w-]+)$/);
        let active;
        if (m && BY_ID[m[1]]) active = viewKavram(BY_ID[m[1]]);
        else if (h === 'hukum') active = viewHukum();
        else if (h === 'temel') active = viewTemel();
        else if (h === 'test') active = viewTest();
        else active = viewMap();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && h !== 'test' && lastHash === 'test') quiz = quiz && quiz.i >= quiz.list.length ? null : quiz;
        lastHash = h;
        render(true);
        if (changed) {
            window.scrollTo(0, 0);
            app.focus({ preventScroll: true });
        }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
