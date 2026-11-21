// ============================================
// Mektep — ana ekran (uygulama olarak yüklendiğinde)
// --------------------------------------------
// html.is-launcher iken çalışır (bkz. index.html'deki baştaki betik): ana ekrana eklenmiş uygulama
// standalone / tam ekran açıldığında ya da önizleme için ?launcher adresiyle.
//   · Selam ve tarih, "Bugün" kartları (günün ismi, günün davranışı, devam et)
//   · Favoriler: kullanıcının seçtiği uygulamalar, seçtiği sırayla (favori.js, 'apps:favoriler').
//     "Düzenle" (ya da bir favoriye uzun basmak) düzenleme modunu açar: simgeler sallanır, sürükleyerek
//     sıralanır, "−" ile çıkarılır; klavyede ok tuşlarıyla taşınır, Delete ile çıkarılır.
//   · Telefon ana ekranı gibi simge ızgarası; yayımlananlar ve "Yakında" olanlar
//   · Simgeye dokununca simge panele uçar; ad, açıklama ve özellikler görünür
//   · "Aç" uygulamanın rengiyle ekranı doldurur ve uygulamaya geçer
// Uygulama listesi apps.js'ten (window.HCG_APPS) okunur; yeni uygulama otomatik görünür.
// ============================================
(function () {
    'use strict';
    const html = document.documentElement;
    if (!html.classList.contains('is-launcher')) return;
    const APPS = window.HCG_APPS || [];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } } };
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const tr = (v) => (v == null ? '' : typeof v === 'string' ? v : v.tr || v.en || '');
    const svg = (b, sw) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
    const IC = {
        palette: svg('<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".6" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".6" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".6" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".6" fill="currentColor"/>'),
        clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 2.2),
        x: svg('<path d="M18 6 6 18M6 6l12 12"/>', 2),
        open: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2.2),
        star: svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
        starOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
        minus: svg('<path d="M6 12h12"/>', 3)
    };
    const FAV = window.AppsFav;
    const published = APPS.filter((a) => !a.soon && a.href);
    const soon = APPS.filter((a) => a.soon);
    const byId = Object.fromEntries(APPS.map((a) => [a.id, a]));
    const isKid = () => ln.dataset.tema === 'cocuk';

    // ---------- Görünüm durumu ----------
    const ln = document.createElement('div');
    ln.className = 'ln';
    function readLook() {
        const t = ls.get('apps:tema'); const m = ls.get('theme');
        ln.dataset.tema = t === 'cocuk' ? 'cocuk' : 'yetiskin';
        ln.dataset.mode = m === 'light' || m === 'dark' ? m : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        requestAnimationFrame(() => {
            const bg = getComputedStyle(ln).getPropertyValue('--ln-bg').trim();
            html.style.setProperty('--ln-bg', bg);
            const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', bg);
        });
    }

    // ---------- Selam ve tarih ----------
    function greet() {
        const h = new Date().getHours();
        const g = h >= 5 && h < 11 ? ['Hayırlı sabahlar', '🌅'] : h >= 11 && h < 17 ? ['Hayırlı günler', '☀️'] : h >= 17 && h < 22 ? ['Hayırlı akşamlar', '🌇'] : ['Hayırlı geceler', '🌙'];
        return isKid() ? `${g[1]} ${g[0]}` : g[0];
    }
    const today = () => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());

    // ---------- Simge ----------
    function iconHtml(a, cls) {
        const c = a.colors || ['#1d5a47', '#0a1f19'];
        const inner = a.iconSvg || `<span class="emo">${esc(a.icon || '◆')}</span>`;
        return `<span class="ln-icon ${cls || ''}" style="--c1:${esc(c[0])};--c2:${esc(c[1] || c[0])};--ic:${esc(a.iconColor || '#dab56d')}">${inner}</span>`;
    }
    const seen = (() => { try { return JSON.parse(ls.get('apps:yayinda') || 'null'); } catch (e) { return null; } })();

    // ---------- Bugün kartları ----------
    const dayIndex = () => { const d = new Date(); return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5); };
    function loadScript(src) { return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
    function cardStyle(a) { const c = (a && a.colors) || ['#1d5a47', '#0a1f19']; return `--c1:${esc(c[0])};--c2:${esc(c[1] || c[0])};--ic:${esc((a && a.iconColor) || '#dab56d')}`; }
    function todayCards() {
        const box = ln.querySelector('#lnCards');
        const esmaApp = byId['esma-ul-husna'], davApp = byId['davranis-modeli'];
        const cards = [];
        const last = byId[ls.get('apps:son')];
        if (last && !last.soon) cards.push(`<a class="ln-card" href="${esc(last.href)}" data-launch="${esc(last.id)}" style="${cardStyle(last)}"><small>Devam et</small><b>${esc(tr(last.name))}</b><span>${esc(tr(last.tagline))}</span><span class="go">${IC.open}Kaldığın yerden aç</span><span class="mini-ic">${last.iconSvg || ''}</span></a>`);
        if (esmaApp && !esmaApp.soon) cards.push(`<a class="ln-card is-skel" id="cEsma" href="esma/" style="${cardStyle(esmaApp)}"><small>${isKid() ? 'Bugünün ismi' : 'Günün ismi'}</small><b>Yükleniyor</b><span>…</span></a>`);
        if (davApp && !davApp.soon) cards.push(`<a class="ln-card is-skel" id="cDav" href="davranis/" style="${cardStyle(davApp)}"><small>${isKid() ? 'Bugünün görevi' : 'Günün davranışı'}</small><b>Yükleniyor</b><span>…</span></a>`);
        box.innerHTML = cards.join('');
        box.closest('section').hidden = !cards.length;
        if (esmaApp && !esmaApp.soon) {
            Promise.all([window.ESMA_DATA ? 0 : loadScript('esma/data.js'), window.ESMA_ARAPCA ? 0 : loadScript('esma/isimler.js')]).then(() => {
                const D = window.ESMA_DATA, AR = window.ESMA_ARAPCA, el = ln.querySelector('#cEsma');
                if (!D || !el) return;
                const i = dayIndex() % D.isimler.length, x = D.isimler[i];
                el.classList.remove('is-skel'); el.href = `esma/#/i/${i + 1}`;
                el.innerHTML = `<small>${isKid() ? 'Bugünün ismi' : 'Günün ismi'}</small><span class="ar" lang="ar">${esc(AR[i])}</span><b>${esc(x.o)}</b><span>${esc(x.a)}</span>`;
            }).catch(() => { const el = ln.querySelector('#cEsma'); if (el) el.remove(); });
        }
        if (davApp && !davApp.soon) {
            (window.DAVRANIS_DATA ? Promise.resolve() : loadScript('davranis/data.js')).then(() => {
                const D = window.DAVRANIS_DATA, el = ln.querySelector('#cDav');
                if (!D || !el) return;
                const d = D.davranislar[(dayIndex() * 7) % D.davranislar.length];
                el.classList.remove('is-skel'); el.href = `davranis/#/d/${d.id}`;
                el.innerHTML = `<small>${isKid() ? 'Bugünün görevi' : 'Günün davranışı'}</small><span class="tur ${d.tur}">${d.tur === 'yap' ? (isKid() ? '✅ Yap' : 'Yap') : (isKid() ? '🚫 Yapma' : 'Yapma')}</span><b>${esc(d.ad)}</b><span>${esc(d.kisa)}</span>`;
            }).catch(() => { const el = ln.querySelector('#cDav'); if (el) el.remove(); });
        }
    }

    // ---------- Çizim ----------
    function draw() {
        readLook();
        const appBtn = (a, i) => {
            const isNew = seen && !a.soon && !seen.includes(a.id);
            const fav = FAV && FAV.has(a.id);
            return `<li><button type="button" class="ln-app${a.soon ? ' is-soon' : ''}${isNew ? ' is-new' : ''}${fav ? ' is-fav' : ''}" data-app="${esc(a.id)}" style="--i:${i}" aria-label="${esc(tr(a.name))}${a.soon ? ' (yakında)' : ''}${fav ? ' (favori)' : ''}">
                ${iconHtml(a).replace('</span>', (a.soon ? `<span class="ln-badge" aria-hidden="true">${IC.clock}</span>` : isNew ? '<span class="ln-badge" aria-hidden="true">YENİ</span>' : '') + (a.soon ? '' : `<span class="ln-star" aria-hidden="true">${IC.starOn}</span>`) + '</span>')}
                <span class="ln-label">${esc(a.short || tr(a.name))}</span></button></li>`;
        };
        ln.innerHTML = `
            <div class="ln-wrap">
                <header class="ln-top">
                    <div><p class="ln-greet">${esc(greet())}</p><p class="ln-date">${esc(today())}</p></div>
                    <button type="button" class="ln-ibtn" id="lnLook" aria-label="Görünüm ayarları">${IC.palette}</button>
                </header>
                <section class="ln-brand">
                    <img src="icons/icon-192.png" alt="" width="58" height="58">
                    <div><h1>Mek<em>tep</em></h1><p>${published.length} uygulama${soon.length ? ` · ${soon.length} yakında` : ''} · çevrimdışı da çalışır</p></div>
                </section>
                ${FAV ? '<section class="ln-favsec" id="lnFavSec" aria-labelledby="lnFavT"></section>' : ''}
                <section>
                    <div class="ln-h"><h2>Bugün</h2><small>Kaydırarak gez</small></div>
                    <div class="ln-cards" id="lnCards"></div>
                </section>
                <section>
                    <div class="ln-h"><h2>Uygulamalar</h2><small>Dokun, tanı, aç</small></div>
                    <ul class="ln-grid">${published.map(appBtn).join('')}</ul>
                </section>
                ${soon.length ? `<section><div class="ln-h"><h2>Yakında</h2><small>Hazırlanıyor</small></div><ul class="ln-grid">${soon.map((a, i) => appBtn(a, i + published.length)).join('')}</ul></section>` : ''}
                <p class="ln-foot">hcguler.github.io/mektep · <a href="https://hcguler.github.io/">Hüseyin Cihad Güler</a></p>
                <p class="sr" id="lnLive" role="status" aria-live="polite"></p>
            </div>
            <div class="ln-sheet-bg" id="lnSheetBg"><div class="ln-sheet" role="dialog" aria-modal="true" aria-labelledby="lnSheetT"><div class="ln-grab" aria-hidden="true"></div><button type="button" class="ln-x" id="lnX" aria-label="Kapat">${IC.x}</button><div id="lnSheetBody"></div></div></div>`;
        todayCards();
        favDraw();
    }

    // ---------- Favoriler ----------
    let favEdit = false;
    function favDraw(focusId) {
        const sec = ln.querySelector('#lnFavSec');
        if (!sec) return;
        const ids = FAV.list(), list = ids.map((id) => byId[id]).filter(Boolean);
        if (!list.length) favEdit = false;
        sec.classList.toggle('is-edit', favEdit);
        sec.innerHTML = `
            <div class="ln-h"><h2 id="lnFavT">Favoriler</h2>${list.length ? `<button type="button" class="ln-edit" id="lnFavEdit" aria-pressed="${favEdit}">${favEdit ? 'Bitti' : 'Düzenle'}</button>` : '<small>Sık kullandıkların</small>'}</div>
            ${favEdit ? '<p class="ln-favhint">Sürükleyerek sırala · <b>−</b> ile çıkar</p>' : ''}
            ${list.length ? `<ul class="ln-grid ln-favs" id="lnFavs" aria-label="Favori uygulamalar${favEdit ? ', düzenleniyor: ok tuşlarıyla taşı, Delete ile çıkar' : ''}">${list.map((a, i) => `<li data-fav data-id="${esc(a.id)}">
                    <button type="button" class="ln-app" data-favapp="${esc(a.id)}" style="--i:${i}" aria-label="${esc(tr(a.name))}${favEdit ? `, ${i + 1}. sırada` : ''}">${iconHtml(a)}<span class="ln-label">${esc(a.short || tr(a.name))}</span></button>
                    ${favEdit ? `<button type="button" class="ln-rm" data-fav-remove="${esc(a.id)}" aria-label="${esc(tr(a.name))} favorilerden çıkar">${IC.minus}</button>` : ''}</li>`).join('')}</ul>`
                : `<div class="ln-favempty">${IC.star}<p>Sık kullandığın uygulamaları buraya ekle: bir uygulamaya dokun, <b>Favorilere ekle</b>’yi seç.</p></div>`}`;
        const ul = sec.querySelector('#lnFavs');
        if (ul) FAV.sortable(ul, { item: '[data-fav]', enabled: () => favEdit, onSort: (order, id) => { FAV.set(order); say(`${tr(byId[id].name)}, ${order.indexOf(id) + 1}. sıraya taşındı.`); setTimeout(() => favDraw(), 260); } });
        if (focusId) { const f = sec.querySelector(`[data-favapp="${focusId}"]`) || sec.querySelector('#lnFavEdit'); if (f) f.focus({ preventScroll: true }); }
    }
    const say = (t) => { const l = ln.querySelector('#lnLive'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = t; }, 30); } };
    function setEdit(on, focusId) { favEdit = on; favDraw(focusId); if (on) say('Favoriler düzenleniyor. Sürükleyerek ya da ok tuşlarıyla sırala.'); }
    if (FAV) {
        FAV.on((ids, why) => {
            if (why && why.tur === 'sira' && !why.id) return; // sürükleme: DOM zaten yeni sırada
            const focusId = why && why.tur === 'sira' ? why.id : null;
            favDraw(focusId);
            // Uygulamalar ızgarasındaki yıldızlar
            ln.querySelectorAll('.ln-grid:not(.ln-favs) .ln-app[data-app]').forEach((b) => b.classList.toggle('is-fav', ids.includes(b.dataset.app)));
        });
        // Uzun basma: düzenleme modunu açar
        let lp = null;
        ln.addEventListener('pointerdown', (e) => {
            const b = e.target.closest('[data-favapp]');
            if (!b || favEdit) return;
            const x = e.clientX, y = e.clientY;
            lp = { t: setTimeout(() => { lp.fired = true; if (navigator.vibrate) navigator.vibrate(12); setEdit(true, b.dataset.favapp); }, 480), x, y, fired: false };
        });
        const cancel = () => { if (lp) clearTimeout(lp.t); };
        ln.addEventListener('pointermove', (e) => { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 8) cancel(); });
        ln.addEventListener('pointerup', cancel);
        ln.addEventListener('pointercancel', cancel);
        ln.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-favapp]')) e.preventDefault(); });
        ln.addEventListener('click', (e) => { if (lp && lp.fired && e.target.closest('[data-favapp]')) { e.preventDefault(); e.stopPropagation(); lp = null; } }, true);
        // Klavye: düzenleme modunda ok tuşlarıyla taşı, Delete ile çıkar, Escape ile bitir
        ln.addEventListener('keydown', (e) => {
            if (!favEdit) return;
            if (e.key === 'Escape' && !sheetBg().classList.contains('on')) { setEdit(false); return; }
            const b = e.target.closest && e.target.closest('[data-favapp]');
            if (!b) return;
            const id = b.dataset.favapp, step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
            if (step) { e.preventDefault(); if (FAV.move(id, step)) say(`${tr(byId[id].name)}, ${FAV.list().indexOf(id) + 1}. sıraya taşındı.`); }
            else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); favRemove(id); }
        });
    }
    function favRemove(id) {
        const l = FAV.list(), i = l.indexOf(id);
        FAV.remove(id);
        say(`${tr(byId[id].name)} favorilerden çıkarıldı.`);
        const next = FAV.list()[Math.min(i, FAV.list().length - 1)];
        const f = next ? ln.querySelector(`[data-favapp="${next}"]`) : ln.querySelector('#lnFavEdit') || ln.querySelector('#lnFavSec');
        if (f && f.focus) f.focus({ preventScroll: true });
    }

    // ---------- Panel ----------
    let ret = null, flyFrom = null;
    const sheetBg = () => ln.querySelector('#lnSheetBg');
    function openSheet(htmlStr, origin) {
        ret = document.activeElement;
        const bg = sheetBg();
        ln.querySelector('#lnSheetBody').innerHTML = htmlStr;
        bg.classList.remove('out'); bg.classList.add('on');
        ln.querySelector('#lnX').focus({ preventScroll: true });
        if (origin) fly(origin, ln.querySelector('.ln-sh-icon'));
    }
    function closeSheet() {
        const bg = sheetBg();
        if (!bg.classList.contains('on')) return;
        const done = () => { bg.classList.remove('on', 'out'); if (ret && ret.focus) ret.focus({ preventScroll: true }); };
        if (reduce.matches) { done(); return; }
        bg.classList.add('out'); setTimeout(done, 240);
    }
    // Simge, dokunulan yerden paneldeki yerine uçar (FLIP)
    function fly(fromEl, toEl) {
        if (!fromEl || !toEl || reduce.matches || !toEl.animate) return;
        const a = fromEl.getBoundingClientRect();
        const clone = fromEl.cloneNode(true);
        clone.classList.add('ln-fly');
        Object.assign(clone.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
        ln.appendChild(clone);
        toEl.style.visibility = 'hidden';
        fromEl.style.visibility = 'hidden';
        requestAnimationFrame(() => {
            const b = toEl.getBoundingClientRect();
            const dx = b.left - a.left, dy = b.top - a.top, s = b.width / a.width;
            const anim = clone.animate([
                { transform: 'translate(0,0) scale(1)', borderRadius: '30%' },
                { transform: `translate(${dx}px,${dy}px) scale(${s})`, borderRadius: '29%' }
            ], { duration: 520, easing: 'cubic-bezier(.3,1.25,.4,1)', fill: 'forwards' });
            anim.onfinish = () => { toEl.style.visibility = ''; clone.remove(); fromEl.style.visibility = ''; };
        });
    }
    function appSheet(a) {
        const feats = (a.features && (a.features.tr || [])) || [];
        const langs = (a.langs || []).map((l) => `<span>${esc(l)}</span>`).join('');
        return `<div class="ln-sh-head">
                ${iconHtml(a, 'ln-sh-icon')}
                <h2 id="lnSheetT">${esc(tr(a.name))}</h2>
                <p class="ln-sh-tag">${esc(tr(a.tagline))}</p>
                <div class="ln-pills">${a.soon ? '<span class="soon">Yakında</span>' : '<span>Çevrimdışı çalışır</span>'}${langs}</div>
            </div>
            <p class="ln-sh-desc">${esc(tr(a.description))}</p>
            ${feats.length ? `<ul class="ln-feats">${feats.map((f, i) => `<li style="--i:${i}">${esc(f)}</li>`).join('')}</ul>` : ''}
            <div class="ln-acts">
                ${a.soon ? '<span class="ln-btn" aria-disabled="true">' + IC.clock + 'Hazırlanıyor, yakında burada</span>' : `<a class="ln-btn" href="${esc(a.href)}" data-launch="${esc(a.id)}">${IC.open}${isKid() ? 'Hadi açalım!' : 'Uygulamayı aç'}</a>`}
                ${!a.soon && FAV ? favBtn(a) : ''}
                <button type="button" class="ln-btn alt" data-close>Kapat</button>
            </div>`;
    }
    const favBtn = (a) => { const on = FAV.has(a.id); return `<button type="button" class="ln-btn alt ln-favbtn" data-favtoggle="${esc(a.id)}" aria-pressed="${on}">${on ? IC.starOn : IC.star}${on ? 'Favorilerden çıkar' : 'Favorilere ekle'}</button>`; };
    function lookSheet() {
        const t = ln.dataset.tema, m = ln.dataset.mode;
        const o = (attr, val, on, title, desc, sw) => `<button type="button" class="ln-opt" data-${attr}="${val}" aria-pressed="${on}"><span class="sw">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="lnSheetT">Görünüm</h3><p class="soft">Bütün uygulamalar bu seçimle açılır; uygulamaların içinden de değiştirilebilir.</p>
            <h4>Tema</h4><div class="ln-opts">${o('tema', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli, sıcak ve oyunlu.', ['#ffb703', '#7b61ff', '#219ebc'])}${o('tema', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin, ciddi, okumaya odaklı.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
            <h4>Renk</h4><div class="ln-opts">${o('mode', 'light', m === 'light', 'Açık', 'Aydınlık ortamlar için.', ['#fffdf8', '#e9e0cf'])}${o('mode', 'dark', m === 'dark', 'Koyu', 'Loş ortamlar ve gece için.', ['#0c1814', '#22213a'])}</div>
            <div class="ln-acts"><button type="button" class="ln-btn alt" data-close>Tamam</button></div>`;
    }

    // ---------- Açılış ----------
    function launch(a, from) {
        ls.set('apps:son', a.id);
        if (reduce.matches) { location.href = a.href; return; }
        const c = a.colors || ['#1d5a47', '#0a1f19'];
        const r = (from || ln).getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        const cover = document.createElement('div');
        cover.className = 'ln-launch';
        cover.style.cssText = `--c1:${c[0]};--c2:${c[1] || c[0]};--ic:${a.iconColor || '#dab56d'}`;
        cover.innerHTML = a.iconSvg || '';
        ln.appendChild(cover);
        const anim = cover.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${rad}px at ${x}px ${y}px)` }], { duration: 480, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
        anim.onfinish = () => setTimeout(() => { location.href = a.href; }, 140);
        // geri tuşuyla dönülürse (bfcache) örtüyü kaldır
        window.addEventListener('pageshow', () => cover.remove(), { once: true });
    }

    // ---------- Olaylar ----------
    ln.addEventListener('click', (e) => {
        const t = e.target;
        if (FAV) {
            if (t.closest('#lnFavEdit')) { setEdit(!favEdit, null); const b = ln.querySelector('#lnFavEdit'); if (b) b.focus({ preventScroll: true }); return; }
            const rm = t.closest('[data-fav-remove]'); if (rm) { favRemove(rm.dataset.favRemove); return; }
            const fa = t.closest('[data-favapp]');
            if (fa) { if (favEdit) return; const a = byId[fa.dataset.favapp]; if (a) openSheet(appSheet(a), fa.querySelector('.ln-icon')); return; }
            const ft = t.closest('[data-favtoggle]');
            if (ft) {
                const a = byId[ft.dataset.favtoggle], on = FAV.toggle(a.id);
                ft.outerHTML = favBtn(a);
                const nb = ln.querySelector('[data-favtoggle]'); if (nb) nb.focus({ preventScroll: true });
                say(on ? `${tr(a.name)} favorilere eklendi.` : `${tr(a.name)} favorilerden çıkarıldı.`);
                return;
            }
        }
        const appBtn = t.closest('[data-app]');
        if (appBtn) { const a = byId[appBtn.dataset.app]; if (a) openSheet(appSheet(a), appBtn.querySelector('.ln-icon')); return; }
        const l = t.closest('[data-launch]');
        if (l) { e.preventDefault(); const a = byId[l.dataset.launch]; if (a) launch(a, l.closest('.ln-sheet') ? ln.querySelector('.ln-sh-icon') : l); return; }
        if (t.closest('#lnLook')) { openSheet(lookSheet()); return; }
        if (t.closest('#lnX') || t.closest('[data-close]') || t.id === 'lnSheetBg') { closeSheet(); return; }
        const tm = t.closest('[data-tema]'); if (tm) { ls.set('apps:tema', tm.dataset.tema); refreshLook(); return; }
        const md = t.closest('[data-mode]'); if (md) { ls.set('theme', md.dataset.mode); refreshLook(); return; }
        const card = t.closest('.ln-card');
        if (card && !card.dataset.launch) {
            const id = card.id === 'cEsma' ? 'esma-ul-husna' : card.id === 'cDav' ? 'davranis-modeli' : null;
            if (id) { e.preventDefault(); ls.set('apps:son', id); const a = Object.assign({}, byId[id], { href: card.getAttribute('href') }); launch(a, card); }
        }
    });
    function refreshLook() {
        const change = () => { draw(); openSheet(lookSheet()); };
        if (document.startViewTransition && !reduce.matches) document.startViewTransition(change); else change();
    }
    document.addEventListener('keydown', (e) => {
        const bg = sheetBg();
        if (!bg || !bg.classList.contains('on')) return;
        if (e.key === 'Escape') { closeSheet(); return; }
        if (e.key === 'Tab') {
            const f = Array.from(bg.querySelectorAll('button, a[href]')).filter((x) => !x.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    window.addEventListener('storage', (e) => { if (e.key === 'apps:tema' || e.key === 'theme') draw(); });
    window.addEventListener('pageshow', (e) => { if (e.persisted) draw(); });

    document.body.prepend(ln);
    draw();
    // ilk açılışta odak ve kaydırma en üstte
    window.scrollTo(0, 0);
})();
