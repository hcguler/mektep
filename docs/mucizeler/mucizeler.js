// ============================================
// Kur'an'dan Mucizeler — uygulama mantığı (iskelet Kur'an'da Hayvanlar ile ortak)
// İçerik: data.js (MUCIZE_DATA); ayetler: ayetler.js (MUCIZE_AYETLER), anahtar ifadeler: ifadeler.js
// (MUCIZE_IFADELER); ikisini de tools/mucizeler-uret.mjs üretir.
// Anlatım metinleri tools/mucizeler-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/)
// ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm). Kayıt yoksa satır görünmez.
// ============================================
(function () {
    'use strict';

    const DATA = window.MUCIZE_DATA;
    const AYET = window.MUCIZE_AYETLER || {};
    const IFADE = window.MUCIZE_IFADELER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.mucizeler.map((m, i) => Object.assign({ n: i + 1 }, m));
    const BY = Object.fromEntries(ALL.map((m) => [m.id, m]));
    const GRUP = Object.fromEntries(DATA.gruplar.map((g) => [g.id, g]));
    const T = ALL.length;
    const dosya = (m) => String(m.n).padStart(2, '0') + '-' + m.id;
    const sureAd = (r) => (AYET[r] ? AYET[r].sure : '');
    const mucizeSureleri = (m) => [...new Set(m.ayetler.map(sureAd))];
    const sureYazi = (m) => { const s = mucizeSureleri(m); return s.length > 1 ? s.slice(0, -1).join(', ') + ' ve ' + s[s.length - 1] + ' sureleri' : s[0] + ' suresi'; };

    // ---------- Kalıcı durum ----------
    const KEY = 'mucizeler:v1';
    const state = { seen: {}, show: { ar: true, ok: true, meal: true }, arSize: 2, best: { sure: 0 }, last: null };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (s.seen && typeof s.seen === 'object') state.seen = s.seen;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (s.best && typeof s.best === 'object') state.best = Object.assign(state.best, s.best);
        if (s.last && BY[s.last]) state.last = s.last;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    const seenCount = () => ALL.filter((m) => state.seen[m.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Kur’an’dan', title: 'Kur’an’dan <em>Mucizeler</em>',
            lead: 'Kur’an’ın önceden haber verip sonra gerçekleşen altı haberi ve indiği gün bilinmeyen, bugün bilimle birlikte düşünülen altı ayet.',
            progress: (n) => n === 0 ? `${T} sayfa seni bekliyor.` : n === T ? 'Bütün sayfaları okudun.' : `${T} sayfadan ${n} tanesini okudun.`,
            resume: 'Devam et', start: 'İlk sayfadan başla', cocukBaslik: 'Kısaca',
            right: 'Doğru.', wrong: 'Yanlış.',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Sayfalara göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Kur’an’ın şaşırtan haberleri', title: '<span class="emo">✨</span> Kur’an’dan <em>Mucizeler</em>',
            lead: 'Kur’an olmadan önce haber verdi, dediği gibi oldu! Bugün bilim insanlarının bulduğu bazı şeyleri de anlatır. Hadi on iki sayfayı keşfedelim.',
            progress: (n) => n === 0 ? `${T} sayfa seni bekliyor! 👋` : n === T ? 'Hepsini okudun! 🎉' : `${n} sayfa okudun, ${T - n} sayfa kaldı.`,
            resume: 'Devam et', start: 'Hadi başlayalım', cocukBaslik: 'Kısaca',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Sayfalara bakıp yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw, cls) => `<svg class="${cls || 'ic'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        yildiz: svg('<path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8z"/>'),
        olcu: svg('<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3"/><path d="M12 17h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        book: svg('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>')
    };
    // Her mucizenin çizgi simgesi (data.js → ikon)
    const IKON = {
        kalkan: '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
        alev: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.6 1.2 2.6 2.5 3 0-3-1-5.5 0-8z"/>',
        bayrak: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
        kabe: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8M4 11l8 4 8-4"/>',
        kitap: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 7h7M9 11h5"/>',
        kalem: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>',
        kalp: '<circle cx="12" cy="12" r="8.5"/><path d="M9.5 14c0-2.6 1.6-4.2 3.4-4.2a2.4 2.4 0 0 1 0 4.8c-.9 0-1.4-.5-1.4-1.1"/>',
        ay: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
        dag: '<path d="M2.5 20l6.5-12 4.5 7 2.5-3.5L21.5 20z"/><path d="M14 5.5a2.5 2.5 0 0 1 4.8-.6A2 2 0 1 1 19 9h-4.5"/>',
        galaksi: '<circle cx="12" cy="12" r="2"/><path d="M12 4a8 8 0 0 1 8 8M12 20a8 8 0 0 1-8-8M12 7.5a4.5 4.5 0 0 1 4.5 4.5M12 16.5A4.5 4.5 0 0 1 7.5 12"/>',
        dalga: '<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
        damla: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const refTxt = (r) => { const a = AYET[r]; return a ? `${a.sure} ${a.no}` : r; };
    const simge = (m, cls, label) => `<span class="ciz-kutu${cls ? ' ' + cls : ''}" style="--hc:${m.renk}"${label ? ` role="img" aria-label="${esc(label)}"` : ''}>${kid() ? `<span class="emo-buyuk" aria-hidden="true">${m.emo}</span>` : svg(IKON[m.ikon] || '', 1.4, 'mz')}</span>`;
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
        { id: '', href: '#/', ad: 'Mucizeler', alt: 'On iki sayfa', icon: IC.yildiz },
        { id: 'olcu', href: '#/olcu', ad: 'Ölçü', alt: 'Bu sayfalar nasıl okunmalı?', icon: IC.olcu },
        { id: 'oyun', href: '#/oyun', ad: 'Oyun', alt: 'Hangi surede?', icon: IC.quiz }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // görünüm düğmeleri (Arapça / Okunuş / Anlam / yazı boyutu)
    function viewbar() {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips">${chip('ar', 'Arapça')}${chip('ok', 'Okunuş')}${chip('meal', 'Anlam')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const apply = () => {
            app.querySelectorAll('.delils, .adar').forEach((b) => { ['ar', 'ok', 'meal'].forEach((k) => b.classList.toggle('hide-' + k, !state.show[k])); b.dataset.ar = state.arSize; });
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
            const kartlar = ALL.filter((m) => m.grup === g.id).map((m) => `<li><a class="kart" href="#/m/${m.id}" style="--hc:${m.renk}">
                    ${simge(m)}
                    <b>${esc(m.ad)}</b><small>${esc(sureYazi(m))}</small>
                    ${state.seen[m.id] ? `<span class="tik" aria-hidden="true">✓</span><span class="sr"> (okundu)</span>` : ''}</a></li>`).join('');
            return `<section class="grup" aria-labelledby="g-${g.id}"><div class="grup__head"><h2 id="g-${g.id}">${kid() ? `<span class="emo" aria-hidden="true">${g.emo}</span> ` : ''}${esc(g.ad)}</h2><small>${esc(g.alt)}</small></div><ul class="kartlar">${kartlar}</ul></section>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Okunan sayfalar" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="btns">${last ? `<a class="btn" href="#/m/${last.id}">${IC.go}${esc(c.resume + ': ' + last.ad)}</a>` : `<a class="btn" href="#/m/${ALL[0].id}">${IC.go}${esc(c.start)}</a>`}<a class="btn alt" href="#/olcu">${IC.olcu}Ölçü</a></div>
                </section>
                ${gruplar}
                <p class="note"><b>Not:</b> ${esc(DATA.olcu)} Ayetler Tanzil metninden, anlamları Diyanet İşleri Başkanlığı mealinden alınmıştır.</p>
            </div>`;
        hsub.textContent = 'Mucizeler';
        document.title = 'Kur’an’dan Mucizeler';
        return '';
    }

    // ---------- Mucize sayfası ----------
    function viewMucize(m) {
        const c = copy();
        const prev = ALL[m.n - 2], next = ALL[m.n];
        state.seen[m.id] = true; state.last = m.id; save();
        const g = GRUP[m.grup];
        const sureNo = [...new Set(m.ayetler.map((r) => +String(r).split(':')[0]))];
        const baglar = sureNo.map((no) => { const r = m.ayetler.find((x) => +String(x).split(':')[0] === no); return `<a class="bag" href="../sureler/#/s/${no}">${IC.book}<span><small>Sureler Atlası’nda</small><b>${esc(sureAd(r))} suresi</b></span></a>`; });
        const kaynak = ['Kur’an-ı Kerîm, ' + m.ayetler.map(refTxt).join('; ') + ' (meal: ' + DATA.meal + ')', ...m.kaynak];
        const ifadeAy = AYET[Object.keys(AYET).find((r) => { const [s, a] = r.split(':'); const [x, y] = a.split('-').map(Number); const [fs, fa] = m.ifade.ref.split(':').map(Number); return +s === fs && x <= fa && fa <= (y || x); })];
        const gelecek = m.grup === 'gelecek';
        app.innerHTML = `
            <div class="page in" style="--hc:${m.renk}">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Mucizeler</a><span class="pos">${m.n} / ${T}</span></div>
                <section class="sc hero">
                    ${simge(m, 'buyuk', m.ad)}
                    <div class="kick">${kid() ? g.emo + ' ' : ''}${esc(g.ad)}</div>
                    <h1>${esc(m.ad)}</h1>
                    <div class="adar"><span class="ar" lang="ar">${esc(IFADE[m.id] || '')}</span><span class="ok">${esc(m.ifade.okunus)}</span><span class="an">“${esc(m.ifade.anlam)}”${ifadeAy ? ` · ${esc(ifadeAy.sure)} ${esc(m.ifade.ref.split(':')[1])}` : ''}</span></div>
                    ${viewbar()}
                    <p class="lead">${esc(m.kisa)}</p>
                    <div data-anlatim="${dosya(m)}"></div>
                    ${kid() ? `<p class="cocuk-not"><span aria-hidden="true">💡</span> ${esc(m.cocuk)}</p>` : ''}
                    <div class="baglar">${baglar.join('')}</div>
                </section>
                <section class="blok" aria-labelledby="b-ayet">
                    <h2 id="b-ayet">${kid() ? '📖 ' : ''}Ayet${m.ayetler.length > 1 || m.ayetler[0].includes('-') ? 'ler' : ''}</h2>
                    <div class="ayetler delils">${m.ayetler.map(ayBlock).join('')}</div>
                </section>
                <section class="blok" aria-labelledby="b-aciklama">
                    <h2 id="b-aciklama">${kid() ? '🔎 ' : ''}Ayet ne bildiriyor?</h2>
                    <div class="aciklama">${m.aciklama.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
                </section>
                ${gelecek ? `<section class="blok olay" aria-labelledby="b-olay">
                    <h2 id="b-olay">${kid() ? '📜 ' : ''}Ne oldu?</h2>
                    <div class="aciklama">${m.gerceklesme.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
                </section>` : `<section class="blok bugun" aria-labelledby="b-bugun">
                    <h2 id="b-bugun">${kid() ? '🔭 ' : ''}Bugün bildiğimiz</h2>
                    <div class="aciklama">${m.bugun.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
                    <p class="pnote"><b>Yorum notu:</b> ${esc(m.yorum)}</p>
                </section>`}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(m.akilda)}</p></section>
                ${kid() ? '' : `<p class="pnote"><b>${esc(c.cocukBaslik)}:</b> ${esc(m.cocuk)}</p>`}
                <p class="srccard src"><b>Kaynak:</b> ${kaynak.map(esc).join(' · ')}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki sayfa">
                    ${prev ? `<a href="#/m/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/m/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = m.ad;
        document.title = `${m.ad} | Kur’an’dan Mucizeler`;
        return '';
    }

    // ---------- Ölçü ----------
    function viewOlcu() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⚖️ ' : ''}Ölçü</div>
                    <h1>Bu sayfalar <em>nasıl okunmalı?</em></h1>
                    <p class="lead">${esc(DATA.giris)}</p>
                    <div data-anlatim="olcu"></div>
                </section>
                <section class="blok" aria-labelledby="b-olcu">
                    <h2 id="b-olcu">${kid() ? '📏 ' : ''}Dört ölçü</h2>
                    <ul class="olcu-liste">
                        <li><b>Yalnızca Kur’an.</b> Mucizeler Kur’an ayetlerinden seçildi. Hadis rivayetlerine dayanan mucizeler bu uygulamada yer almaz.</li>
                        <li><b>Gelecekten haberler.</b> Ayetin indiği gün henüz olmamış, sonra gerçekleşmiş olaylardır. Gerçekleşmeyi anlatan tarih bilgisi her sayfada “Ne oldu?” başlığıyla ayrıca verilir.</li>
                        <li><b>O gün bilinmeyenler.</b> ${esc(DATA.olcu)}</li>
                        <li><b>Klasik tefsir de yazılır.</b> Müfessirlerin ayeti nasıl anladığı “Yorum notu”nda yazılır; çağdaş yorumla ayrıldığı yer açıkça söylenir.</li>
                    </ul>
                </section>
                <p class="note"><b>Not:</b> TDV İslâm Ansiklopedisi’nin “İ‘câzü’l-Kur’ân” maddesi, Kur’an’ın benzerinin getirilemeyişini ve gelecekten verdiği haberleri i‘câzın yönleri arasında sayar; bilimsel i‘câzı ise yirminci yüzyılda öne çıkan, bazı âlimlerin benimsediği bir yorum olarak aktarır.</p>
            </div>`;
        hsub.textContent = 'Ölçü';
        document.title = 'Ölçü | Kur’an’dan Mucizeler';
        return 'olcu';
    }

    // ---------- Oyun ----------
    const OYUN = {
        sure: { ad: 'Hangi surede?', alt: 'Mucizeyi gör, geçtiği sureyi bul.', ornek: 'ay',
            havuz: () => ALL,
            soru: (m) => `“${m.ad}” hangi surede anlatılır?`,
            dogru: (m) => sureAd(m.ayetler[0]),
            yanlislar: (m) => { const own = new Set(mucizeSureleri(m)); return [...new Set(ALL.flatMap(mucizeSureleri))].filter((s) => !own.has(s)); },
            aciklama: (m) => `${m.ad}: ${m.ayetler.map((r) => refTxt(r)).join('; ')}.` }
    };
    const ROUND = 10;
    let quiz = null;
    const rnd = (n) => Math.floor(Math.random() * n);
    const karistir = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    function newQuiz(tur) {
        const O = OYUN[tur];
        const list = karistir(O.havuz()).slice(0, ROUND).map((m) => ({ m, secenek: karistir([O.dogru(m), ...karistir(O.yanlislar(m)).slice(0, 3)]) }));
        quiz = { tur, list, i: 0, score: 0, answered: null };
    }
    function viewOyunlar() {
        const O = OYUN.sure, m = BY[O.ornek];
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🎲 ' : ''}Oyun</div>
                    <h1>Ne kadar <em>hatırlıyorsun?</em></h1>
                    <p class="lead">Her mucizenin hangi surede anlatıldığını bul.</p>
                </section>
                <div class="oyunlar"><a class="oyunkart" href="#/oyun/sure" style="--hc:${m.renk}">${simge(m)}<b>${esc(O.ad)}</b><small>${esc(O.alt)}</small><span class="en">${esc(copy().best(state.best.sure || 0))} / ${Math.min(ROUND, O.havuz().length)}</span></a></div>
            </div>`;
        hsub.textContent = 'Oyun';
        document.title = 'Oyun | Kur’an’dan Mucizeler';
        return 'oyun';
    }
    function viewOyun(tur) {
        if (!quiz || quiz.tur !== tur) newQuiz(tur);
        const O = OYUN[tur];
        const c = copy();
        const total = quiz.list.length;
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > (state.best[tur] || 0)) { state.best[tur] = n; save(); }
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}${esc(O.ad)}</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best[tur]))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/oyun">${IC.quiz}Oyun</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(tur); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i], ans = quiz.answered, dogru = O.dogru(q.m);
            const ok = ans !== null && ans === dogru;
            const btn = (s, i) => {
                let cls = 'opt2';
                if (ans !== null) cls += s === dogru ? ' is-right' : s === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="${cls}" data-ans="${i}"${ans !== null ? ' disabled' : ''}><span>${esc(s)}</span>${ans !== null && s === dogru ? '<span class="mark" aria-label="doğru cevap">✓</span>' : ''}</button>`;
            };
            app.innerHTML = `
                <div class="page in" style="--hc:${q.m.renk}"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    ${simge(q.m, 'quiz__ciz')}
                    <p class="quiz__ask">${kid() ? '🤔 ' : ''}${esc(O.ad)}</p>
                    <p class="quiz__q">${esc(O.soru(q.m))}</p>
                    <div class="opts" role="group" aria-label="Seçenekler">${q.secenek.map(btn).join('')}</div>
                    ${ans !== null ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> ${ok ? '' : `Doğru cevap: ${esc(dogru)}. `}${esc(O.aciklama(q.m))} <a href="#/m/${q.m.id}">Sayfasını aç</a></div>
                        <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section></div>`;
            app.querySelectorAll('[data-ans]').forEach((b) => b.addEventListener('click', () => {
                if (quiz.answered !== null) return;
                quiz.answered = q.secenek[+b.dataset.ans];
                const right = quiz.answered === dogru;
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.opt2.is-right')); else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = O.ad;
        document.title = `${O.ad} | Kur’an’dan Mucizeler`;
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
            <p>Her sayfada hangi bilginin nereden geldiği ayrı ayrı yazılır.</p>
            <ul>
                <li><b>Kur’an:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}. Sayfa başındaki Arapça ifade de ayetin Tanzil metninden alınır.</li>
                <li><b>Tarih ve i‘câz:</b> TDV İslâm Ansiklopedisi (islamansiklopedisi.org.tr): “İ‘câzü’l-Kur’ân”, “Rûm Sûresi”, “Ebû Leheb”, “Kamer Sûresi”, “Umretü’l-kazâ”, “Mushaf”, “Rahmân Sûresi”.</li>
                <li><b>Klasik tefsir:</b> İbn Kesîr, Tefsîrü’l-Kur’âni’l-azîm; Neml 88 için Diyanet’in Kur’an Yolu tefsiri.</li>
            </ul>
            <h4>Ölçü</h4>
            <p>Yalnızca Kur’an ayetlerine dayanan mucizeler alınır; hadis rivayetlerine dayananlar alınmaz. Ayetle bilimsel bilgi arasındaki bağ “çağdaş yorum” olarak, klasik tefsirle birlikte verilir; ayete söylemediği bir anlam yüklenmez.</p>
            <h4>Görseller</h4>
            <p>Yetişkin temasında çizgi simgeler, çocuk temasında emoji kullanılır; insan çizilmez.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve emojili, sıcak renkler.', ['#ffb703', '#c8553d', '#2a9db0'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; çizgi simgeler.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ mucizeler · #/m/<id> · #/olcu · #/oyun · #/oyun/sure
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mm = h.match(/^m\/([\w-]+)$/), mo = h.match(/^oyun\/(sure)$/);
        let active;
        if (mm && BY[mm[1]]) active = viewMucize(BY[mm[1]]);
        else if (h === 'olcu') active = viewOlcu();
        else if (mo) active = viewOyun(mo[1]);
        else if (h === 'oyun') active = viewOyunlar();
        else active = viewListe();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && /^oyun\//.test(lastHash) && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
