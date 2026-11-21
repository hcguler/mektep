// ============================================
// Sahabe Hayatları — uygulama mantığı
// İçerik: data.js (SAHABE_DATA), ayetler: ayetler.js (SAHABE_AYETLER), Siyer olayları: siyer-baglanti.js
// (SAHABE_SIYER_OLAY); ikisini de tools/sahabe-uret.mjs üretir.
// Anlatım metinleri tools/sahabe-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/)
// ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Görsellerde yüz ya da beden yoktur; her sahabi bir renk, baş harf ve (çocuk temasında) simgeyle gösterilir.
// ============================================
(function () {
    'use strict';

    const DATA = window.SAHABE_DATA;
    const AYET = window.SAHABE_AYETLER || {};
    const OLAY = window.SAHABE_SIYER_OLAY || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.sahabiler.map((s, i) => Object.assign({ n: i + 1 }, s));
    const BY = Object.fromEntries(ALL.map((s) => [s.id, s]));
    const GRUP = Object.fromEntries(DATA.gruplar.map((g) => [g.id, g]));
    const T = ALL.length;
    const dosya = (s) => String(s.n).padStart(2, '0') + '-' + s.id;
    const harf = (s) => s.ad.replace(/^Hz\.\s*/, '').charAt(0);

    // ---------- Kalıcı durum ----------
    const KEY = 'sahabe:v1';
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
    const seenCount = () => ALL.filter((s) => state.seen[s.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Sahabe', title: 'Sahabe <em>Hayatları</em>',
            lead: 'Peygamberimizin on iki arkadaşı: hayatlarından sahih kaynaklı kesitler ve bugüne bıraktıkları örnek davranışlar.',
            progress: (n) => n === 0 ? `${T} sahabinin hayatı seni bekliyor.` : n === T ? 'Bütün sahabilerin sayfasını okudun.' : `${T} sahabiden ${n} tanesini okudun.`,
            resume: 'Devam et', start: 'İlk sahabiden başla',
            erdem: 'Örnek davranış', vefat: 'Vefatı',
            right: 'Doğru.', wrong: 'Yanlış.',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Sahabilerin sayfalarına göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Peygamberimizin arkadaşları', title: '<span class="emo">🌟</span> Sahabe <em>Hayatları</em>',
            lead: 'Peygamberimizin arkadaşlarını tanıyalım! On iki arkadaş, her birinden öğrenecek güzel bir davranış.',
            progress: (n) => n === 0 ? `${T} arkadaş seni bekliyor! 👋` : n === T ? 'Hepsini tanıdın! 🎉' : `${n} arkadaşı tanıdın, ${T - n} arkadaş kaldı.`,
            resume: 'Devam et', start: 'Hadi tanışalım',
            erdem: 'Sen de böyle ol', vefat: 'Vefatı 🤍',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Arkadaşların sayfalarına bakıp yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        people: svg('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5M15 14.6c.6-.1 1.3-.1 2-.1 2.4 0 4 1.6 4.5 4.5"/>'),
        time: svg('<path d="M3 7h18M3 12h18M3 17h18"/><path d="M7 5v4M13 10v4M10 15v4"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3"/><path d="M12 17h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        line: svg('<path d="M6 3v18"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M11 7h9M11 17h6"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const refTxt = (r) => { const a = AYET[r]; return a ? `${a.sure} ${a.no}` : r; };
    const yilTxt = (y) => (Array.isArray(y) ? y.join('/') : y);
    // Yüz yok: renkli halka içinde baş harf; çocuk temasında simge.
    const rozet = (s, cls) => `<span class="rozet${cls ? ' ' + cls : ''}" style="--sc:${s.renk}" aria-hidden="true"><span class="h">${esc(harf(s))}</span><span class="emo">${s.emo}</span></span>`;
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
        { id: '', href: '#/', ad: 'Sahabiler', alt: 'On iki arkadaş', icon: IC.people },
        { id: 'zaman', href: '#/zaman', ad: 'Zaman şeridi', alt: 'İslam’a giriş ve vefat', icon: IC.time },
        { id: 'oyun', href: '#/oyun', ad: 'Kim yaptı?', alt: 'Tanıma oyunu', icon: IC.quiz }
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
            app.querySelectorAll('.viewbar').forEach((v) => {
                const sb = v.querySelectorAll('[data-size]');
                if (sb.length) { sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; }
            });
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            if (state.show[k] && Object.values(state.show).filter(Boolean).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }

    // ---------- Ana ekran ----------
    function viewListe() {
        const c = copy();
        const n = seenCount();
        const last = state.last && BY[state.last];
        const gruplar = DATA.gruplar.map((g) => {
            const kartlar = ALL.filter((s) => s.grup === g.id).map((s) => `<li><a class="kart${state.seen[s.id] ? ' is-seen' : ''}" href="#/s/${s.id}" style="--sc:${s.renk}">
                    ${rozet(s)}
                    <span class="kart__txt"><b>${esc(s.ad)}</b><span class="lakap">${esc(s.lakap)}</span><small>${esc(s.kisa)}</small></span>
                    ${state.seen[s.id] ? '<span class="sr"> (okundu)</span>' : ''}</a></li>`).join('');
            return `<section class="grup" aria-labelledby="g-${g.id}"><div class="grup__head"><h2 id="g-${g.id}">${kid() ? `<span class="emo" aria-hidden="true">${g.emo}</span> ` : ''}${esc(g.ad)}</h2><small>${esc(g.alt)}</small></div><ul class="kartlar">${kartlar}</ul></section>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Okunan sahabiler" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="btns">${last ? `<a class="btn" href="#/s/${last.id}">${IC.go}${esc(c.resume + ': ' + last.ad)}</a>` : `<a class="btn" href="#/s/${ALL[0].id}">${IC.go}${esc(c.start)}</a>`}<a class="btn alt" href="#/oyun">${IC.quiz}Kim yaptı?</a></div>
                </section>
                ${gruplar}
                <p class="note"><b>Not:</b> “Sahabe”, Peygamberimizi görüp ona inanan ve Müslüman olarak vefat eden kişilerdir. Görsellerde yüz ya da beden çizilmez; her sahabi bir renk ve baş harfiyle gösterilir. Tarihler milâdîdir; hicrî yıl da yazılır.</p>
            </div>`;
        hsub.textContent = 'Sahabiler';
        document.title = 'Sahabe Hayatları';
        return '';
    }

    // ---------- Sahabi sayfası ----------
    function kesitHtml(s, h, i) {
        const ay = (h.ayetler || []).map(ayBlock).join('');
        const kaynak = [];
        if (h.ayetler && h.ayetler.length) kaynak.push('Kur’an-ı Kerîm, ' + h.ayetler.map(refTxt).join('; ') + '. Meal: ' + DATA.meal);
        if (h.hadis) kaynak.push(h.hadis.kaynak + ' (hadis anlam olarak, kısaltılarak aktarılmıştır)');
        if (h.kaynak) kaynak.push(h.kaynak);
        const o = h.siyer && OLAY[h.siyer];
        return `<section class="kesit" aria-labelledby="k-${i}">
                <div class="kesit__head"><span class="kesit__no" aria-hidden="true">${i + 1}</span><h3 id="k-${i}">${esc(h.baslik)}</h3>${h.yil !== undefined ? `<span class="kesit__yil">${esc(yilTxt(h.yil))}</span>` : ''}</div>
                <p class="kesit__metin">${esc(h.metin)}</p>
                ${ay ? `${viewbar()}<div class="ayetler delils">${ay}</div>` : ''}
                ${h.ayetNot ? `<p class="pnote"><b>Ayetin bağlantısı:</b> ${esc(h.ayetNot)}</p>` : ''}
                ${h.hadis ? `<figure class="hadis"><blockquote>${esc(h.hadis.metin)}</blockquote><figcaption><b>${esc(h.hadis.kaynak)}</b><br>Ravi: ${esc(h.hadis.ravi)}</figcaption></figure>` : ''}
                ${o ? `<a class="siyer-link" href="../siyer/#/o/${h.siyer}">${IC.line}<span><small>Siyer Çizelgesi’nde</small><b>${esc(o.baslik)}</b> · ${esc(o.tarih)}</span></a>` : ''}
                <p class="kesit__src"><b>Kaynak:</b> ${kaynak.map(esc).join('. ')}.</p>
            </section>`;
    }
    function viewSahabi(s) {
        const c = copy();
        const prev = ALL[s.n - 2], next = ALL[s.n];
        state.seen[s.id] = true; state.last = s.id; save();
        const g = GRUP[s.grup];
        const kunye = [
            ['Doğum', s.dogum], ['Müslüman oluşu', s.musluman], [c.vefat, s.vefat], ['Kabri', s.defin]
        ].filter((x) => x[1]).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
        const tumKaynak = [...s.kaynak];
        s.hayat.forEach((h) => { if (h.hadis) tumKaynak.push(h.hadis.kaynak); });
        const ayetler = s.hayat.flatMap((h) => h.ayetler || []);
        if (ayetler.length) tumKaynak.push('Kur’an-ı Kerîm, ' + ayetler.map(refTxt).join('; ') + ' (meal: ' + DATA.meal + ')');
        app.innerHTML = `
            <div class="page in" style="--sc:${s.renk}">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Sahabiler</a><span class="pos">${s.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? g.emo + ' ' : ''}${esc(g.ad)}</div>
                    ${rozet(s, 'buyuk')}
                    <h1>${esc(s.ad)}</h1>
                    <p class="lakap-l">${esc(s.lakap)}</p>
                    <p class="lead">${esc(s.kisa)}</p>
                    <div data-anlatim="${dosya(s)}"></div>
                    <dl class="kunye">${kunye}</dl>
                    ${kid() ? `<p class="cocuk-not"><span aria-hidden="true">💡</span> ${esc(s.cocuk)}</p>` : ''}
                </section>
                <h2 class="secttl">Hayatından kesitler</h2>
                ${s.hayat.map((h, i) => kesitHtml(s, h, i)).join('')}
                <section class="sc erdem"><div class="kick">${esc(c.erdem)}</div><p>${esc(kid() ? s.cocuk : s.erdem)}</p></section>
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(s.akilda)}</p></section>
                ${s.gorusFarki ? `<p class="pnote"><b>Görüş farkı:</b> ${esc(s.gorusFarki)}</p>` : ''}
                <p class="srccard src"><b>Kaynak:</b> ${tumKaynak.map(esc).join(' · ')}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki sahabi">
                    ${prev ? `<a href="#/s/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/s/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = s.ad;
        document.title = `${s.ad} | Sahabe Hayatları`;
        return '';
    }

    // ---------- Zaman şeridi ----------
    const DON = DATA.donemler;
    const Y0 = DON[0].yil[0], Y1 = DON[DON.length - 1].yil[1];
    const x = (y) => (((y - Y0) / (Y1 - Y0)) * 100).toFixed(2);
    function cubuk(s) {
        // Çubuğun her parçası düştüğü dönemin rengini alır (Siyer Çizelgesi dönem renkleri).
        const a = Math.max(Y0, s.yil.islam), b = Math.min(Y1, s.yil.vefat);
        const parca = DON.map((d) => {
            const p = Math.max(a, d.yil[0]), q = Math.min(b, d.yil[1]);
            return q > p ? `<i class="c-${d.id}" style="left:${x(p)}%;width:${(x(q) - x(p)).toFixed(2)}%"></i>` : '';
        }).join('');
        return `<span class="zs__bar">${parca}</span><span class="zs__dot gir${s.yil.yaklasik ? ' yak' : ''}" style="left:${x(a)}%"></span><span class="zs__dot ves" style="left:${x(b)}%"></span>`;
    }
    function viewZaman() {
        const sirali = [...ALL].sort((p, q) => p.yil.islam - q.yil.islam || p.yil.vefat - q.yil.vefat);
        const bantlar = DON.map((d) => `<i class="c-${d.id}" style="left:${x(d.yil[0])}%;width:${(x(d.yil[1]) - x(d.yil[0])).toFixed(2)}%"></i>`).join('');
        const isaret = [610, 622, 632, 650, 680].map((y) => `<span style="left:${x(y)}%">${y}</span>`).join('');
        const satir = sirali.map((s) => {
            const gir = s.yil.islamYl || (s.yil.yaklasik ? '~' + s.yil.islam : s.yil.islam), ves = s.yil.vefatYl || s.yil.vefat;
            return `<li><a class="zs" href="#/s/${s.id}" style="--sc:${s.renk}" aria-label="${esc(s.ad)}: İslam’a giriş ${esc(gir)}, vefat ${esc(ves)}">
                    <span class="zs__ad">${rozet(s, 'kucuk')}<b>${esc(s.ad)}</b><small>${esc(gir)} – ${esc(ves)}</small></span>
                    <span class="zs__iz" aria-hidden="true"><span class="zs__bant">${bantlar}</span>${cubuk(s)}</span></a></li>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⏳ ' : ''}Zaman şeridi</div>
                    <h1>Ne zaman Müslüman oldular?</h1>
                    <p class="lead">Her çizgi bir sahabinin Müslüman olduğu yıldan vefat ettiği yıla uzanır. Renkler Siyer Çizelgesi’ndeki dönemlerdir.</p>
                    <div class="zs-key">${DON.map((d) => `<span class="c-${d.id}">${esc(d.ad)} <small>${d.yil[0]}–${d.yil[1]}</small></span>`).join('')}<span class="yak">Yaklaşık giriş yılı</span></div>
                </section>
                <div class="zs-wrap">
                    <div class="zs-eksen" aria-hidden="true">${isaret}</div>
                    <ol class="zs-liste">${satir}</ol>
                </div>
                <p class="note"><b>Not:</b> Hz. Âişe Müslüman bir ailede doğduğu için çizgisi doğum yılından başlar. İlk Müslümanlardan olup yılı kesin bilinmeyenlerin başlangıcı yaklaşıktır (içi boş nokta). Tarihler TDV İslâm Ansiklopedisi’nin ilgili maddelerine göredir; farklı rivayetler sahabi sayfasında yazılıdır.</p>
            </div>`;
        hsub.textContent = 'Zaman şeridi';
        document.title = 'Zaman şeridi | Sahabe Hayatları';
        return 'zaman';
    }

    // ---------- Kim yaptı? ----------
    const ROUND = 10;
    let quiz = null;
    const rnd = (n) => Math.floor(Math.random() * n);
    const karistir = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    function newQuiz() {
        const havuz = karistir(ALL.flatMap((s) => s.hayat.filter((h) => h.ipucu).map((h) => ({ s, h }))));
        const list = [];
        let son = null;
        for (const q of havuz) {
            if (list.length >= ROUND) break;
            if (q.s === son) continue;
            const secenek = karistir([q.s, ...karistir(ALL.filter((x) => x !== q.s)).slice(0, 3)]);
            list.push({ s: q.s, h: q.h, secenek }); son = q.s;
        }
        quiz = { list, i: 0, score: 0, answered: null };
    }
    function viewOyun() {
        if (!quiz) newQuiz();
        const c = copy();
        const total = quiz.list.length;
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > state.best) { state.best = n; save(); }
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}Sonuç</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/">${IC.people}Sahabilere dön</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i], ans = quiz.answered;
            const ok = ans && ans === q.s.id;
            const btn = (s) => {
                let cls = 'opt2';
                if (ans) cls += s === q.s ? ' is-right' : s.id === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="${cls}" data-ans="${s.id}" style="--sc:${s.renk}"${ans ? ' disabled' : ''}>${rozet(s, 'kucuk')}<span>${esc(s.ad)}</span>${ans && s === q.s ? '<span class="mark">✓</span>' : ''}</button>`;
            };
            app.innerHTML = `
                <div class="page in"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    <p class="quiz__ask">${kid() ? '🤔 ' : ''}Kim yaptı?</p>
                    <p class="quiz__q">${esc(q.h.ipucu)}</p>
                    <div class="opts" role="group" aria-label="Seçenekler">${q.secenek.map(btn).join('')}</div>
                    ${ans ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> ${esc(q.s.ad)}: “${esc(q.h.baslik)}”. <a href="#/s/${q.s.id}">Sayfasını aç</a></div>
                        <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section></div>`;
            app.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = b.dataset.ans;
                const right = quiz.answered === q.s.id;
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.opt2.is-right')); else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = 'Kim yaptı?';
        document.title = 'Kim yaptı? | Sahabe Hayatları';
        return 'oyun';
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
            const f = Array.from(sheetBg.querySelectorAll('button, a[href]')).filter((el) => !el.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    function infoHtml() {
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Her sahabinin künyesi ve her kesit kaynağına bağlanır; hangi bilginin nereden geldiği sayfada ayrı ayrı yazılır.</p>
            <ul>
                <li><b>Künye ve hayat bilgisi:</b> TDV İslâm Ansiklopedisi’nin ilgili maddesi (islamansiklopedisi.org.tr). Rivayet farkı olan tarihlerde sayfada “Görüş farkı” notu vardır.</li>
                <li><b>Hadis:</b> Yalnızca Buhârî ve Müslim; öncelikle Buhârî’nin “Fezâilü ashâbi’n-nebî” ve Müslim’in “Fezâilü’s-sahâbe” bölümleri. Hadisler anlam olarak, kısaltılarak aktarılır. Buhârî numarası genel hadis numarası, Müslim numarası M. Fuâd Abdülbâkî numarasıdır.</li>
                <li><b>Kur’an:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}. Bir ayet yalnızca, sahabi hakkında indiği ya da onu kapsadığı sahih rivayette ya da tefsirde açıkça belirtilmişse verilir; bağlantı ayetin altında yazılıdır.</li>
            </ul>
            <h4>Saygı ve ölçü</h4>
            <p>Her sahabi “Hz.” ile anılır. Sahabiler arasında karşılaştırma yapılmaz; sahih hadiste geçen ifade aynen aktarılır. Zayıf menkıbelere yer verilmez. Peygamberimizden sonraki siyasi olaylar anlatılmaz; vefat yalnızca yeri ve tarihiyle verilir.</p>
            <h4>Görseller</h4>
            <p>Peygamberimizin ve sahabenin yüzü ya da bedeni çizilmez. Her sahabi bir renk ve adının baş harfiyle (çocuk temasında bir simgeyle) gösterilir.</p>
            <h4>Siyer Çizelgesi</h4>
            <p>Kesitlerdeki olaylar Siyer Çizelgesi’ndeki olaylara bağlanır; tarihlerin iki uygulamada çelişmediği otomatik olarak denetlenir.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her arkadaşa bir simge.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
            <h4>Renk</h4><div class="optrow">${opt('data-set-mode', 'light', m === 'light', 'Açık', 'Aydınlık ortamlar için.', ['#fffdf8', '#e9e0cf'])}${opt('data-set-mode', 'dark', m === 'dark', 'Koyu', 'Loş ortamlar ve gece için.', ['#0c1814', '#22213a'])}</div>`;
    }
    const lookSync = () => { if (sheetBg.dataset.kind === 'look' && sheetBg.classList.contains('on')) sheetBody.innerHTML = lookHtml(); };
    document.getElementById('lookBtn').addEventListener('click', () => openSheet(lookHtml(), 'look'));
    document.getElementById('infoBtn').addEventListener('click', () => openSheet(infoHtml(), 'info'));
    const THEME_KEY = 'apps:tema', MODE_KEY = 'theme';
    function paint() { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(document.body).backgroundColor); }
    function withReveal(origin, change) {
        if (!origin || !document.startViewTransition || reduceMotion.matches) { change(); paint(); return; }
        const b = origin.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
        root.classList.add('theme-vt');
        const vt = document.startViewTransition(() => { change(); paint(); });
        vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${r}px at ${cx}px ${cy}px)`] }, { duration: 620, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
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
    // #/ sahabiler · #/s/<id> · #/zaman · #/oyun
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const ms = h.match(/^s\/([\w-]+)$/);
        let active;
        if (ms && BY[ms[1]]) active = viewSahabi(BY[ms[1]]);
        else if (h === 'zaman') active = viewZaman();
        else if (h === 'oyun') active = viewOyun();
        else active = viewListe();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && lastHash === 'oyun' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
