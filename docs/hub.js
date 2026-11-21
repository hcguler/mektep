// ============================================
// Web Apps hub — renders the launcher from apps/apps.js
// (theme, language, reveal and background come from js/site.js)
// Favoriler (favori.js, 'apps:favoriler'): kartlardaki yıldızla eklenir / çıkarılır; üstteki "Favorilerim"
// şeridinde seçilen sırayla durur. "Düzenle" ile sürükleyerek (ya da ok tuşlarıyla) sıralanır, × ile çıkarılır.
// ============================================
(function () {
    'use strict';

    const HCG = window.HCG;
    const apps = window.HCG_APPS || [];
    const grid = document.getElementById('hub-grid');
    const tools = document.getElementById('hub-tools');
    const search = document.getElementById('hub-search');
    const count = document.getElementById('hub-count');
    if (!grid) return;

    const SEARCH_THRESHOLD = 6; // the search box appears once the list is long enough to need it

    const FAV = window.AppsFav;
    const text = {
        tr: { open: 'Uygulamayı Aç', comingSoon: 'Yakında', soon: 'Yeni uygulamalar eklendikçe burada görünecek.', empty: 'Aramayla eşleşen uygulama yok.', count: (n) => `${n} uygulama`,
            favs: 'Favorilerim', favAdd: (a) => `${a} favorilere ekle`, favDel: (a) => `${a} favorilerden çıkar`, favAdded: (a) => `${a} favorilere eklendi.`, favRemoved: (a) => `${a} favorilerden çıkarıldı.`,
            edit: 'Düzenle', done: 'Bitti', hint: 'Sürükleyerek sırala · × ile çıkar', moved: (a, n) => `${a}, ${n}. sıraya taşındı.`,
            emptyFav: 'Sık kullandığın uygulamaları buraya ekle: kartlardaki ☆ simgesine dokun.', editing: 'Favoriler düzenleniyor. Sürükleyerek ya da ok tuşlarıyla sırala, Delete ile çıkar.', pos: (n) => `${n}. sırada` },
        en: { open: 'Open App', comingSoon: 'Coming soon', soon: 'New apps will show up here as they are published.', empty: 'No apps match your search.', count: (n) => `${n} ${n === 1 ? 'app' : 'apps'}`,
            favs: 'My favorites', favAdd: (a) => `Add ${a} to favorites`, favDel: (a) => `Remove ${a} from favorites`, favAdded: (a) => `${a} added to favorites.`, favRemoved: (a) => `${a} removed from favorites.`,
            edit: 'Edit', done: 'Done', hint: 'Drag to reorder · × to remove', moved: (a, n) => `${a} moved to position ${n}.`,
            emptyFav: 'Add the apps you use most: tap the ☆ on a card.', editing: 'Editing favorites. Drag or use the arrow keys to reorder, Delete to remove.', pos: (n) => `position ${n}` }
    };
    const byId = Object.fromEntries(apps.map((a) => [a.id, a]));
    const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
    const X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    const GRIP = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>';

    let firstRender = true;

    function el(tag, className, content) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (content != null) node.textContent = content;
        return node;
    }

    function pick(value, lang) {
        if (value == null) return '';
        return typeof value === 'string' ? value : (value[lang] || value.tr || value.en || '');
    }

    function createTile(app, lang, index) {
        // "soon" apps are listed but not published yet: a plain, non-interactive tile
        const tile = el(app.soon ? 'div' : 'a', 'app-tile card' + (app.soon ? ' is-soon' : ''));
        if (app.soon) {
            tile.setAttribute('role', 'group');
            tile.setAttribute('aria-disabled', 'true');
            tile.setAttribute('aria-label', `${pick(app.name, lang)} (${text[lang].comingSoon})`);
        } else {
            tile.href = app.href;
            tile.setAttribute('aria-label', pick(app.name, lang));
        }
        const colors = app.colors || ['#ff7a3d', '#ffc24d'];
        tile.style.setProperty('--c1', colors[0]);
        tile.style.setProperty('--c2', colors[1] || colors[0]);
        if (firstRender) {
            tile.setAttribute('data-reveal', '');
            tile.style.setProperty('--d', index * 90);
        }

        const art = el('div', 'app-tile__art');
        art.setAttribute('aria-hidden', 'true');
        (app.deco || []).slice(0, 3).forEach((emoji) => art.appendChild(el('span', 'app-tile__deco', emoji)));
        const iconBox = el('span', 'app-tile__icon', app.iconSvg ? null : (app.icon || '◆'));
        if (app.iconSvg) iconBox.innerHTML = app.iconSvg; // trusted markup from apps.js
        if (app.iconBg) iconBox.style.background = app.iconBg;
        if (app.iconColor) iconBox.style.color = app.iconColor;
        art.appendChild(iconBox);
        if (app.soon) art.appendChild(el('span', 'app-tile__badge', text[lang].comingSoon));

        const body = el('div', 'app-tile__body');

        const meta = el('div', 'app-tile__meta');
        (app.langs || []).forEach((code) => meta.appendChild(el('span', 'tag', code)));
        meta.appendChild(el('span', 'tag', 'Web'));

        body.append(meta, el('h2', 'app-tile__name', pick(app.name, lang)));

        const tagline = pick(app.tagline, lang);
        if (tagline) body.appendChild(el('p', 'app-tile__tagline', tagline));

        body.appendChild(el('p', 'app-tile__desc', pick(app.description, lang)));

        const features = (!app.soon && app.features && (app.features[lang] || app.features.tr)) || [];
        if (features.length) {
            const list = el('ul', 'app-tile__features');
            features.forEach((feature) => list.appendChild(el('li', '', feature)));
            body.appendChild(list);
        }

        body.appendChild(el('span', 'app-tile__spacer'));
        const cta = el('span', 'app-tile__cta', app.soon ? text[lang].comingSoon : text[lang].open);
        cta.appendChild(HCG.icon(app.soon ? 'calendar' : 'arrow-right'));
        body.appendChild(cta);

        tile.append(art, body);
        if (!FAV || app.soon) return tile;
        // Yıldız bağlantının içine konamaz (iç içe etkileşimli öge); kartla birlikte bir kapta durur.
        const wrap = el('div', 'app-tile-wrap');
        if (tile.hasAttribute('data-reveal')) { tile.removeAttribute('data-reveal'); wrap.setAttribute('data-reveal', ''); wrap.style.setProperty('--d', index * 90); }
        const star = el('button', 'app-tile__fav');
        star.type = 'button';
        star.dataset.favToggle = app.id;
        star.innerHTML = STAR;
        markStar(star, app, lang);
        wrap.append(tile, star);
        return wrap;
    }
    function markStar(star, app, lang) {
        const on = FAV.has(app.id);
        star.setAttribute('aria-pressed', String(on));
        star.setAttribute('aria-label', on ? text[lang].favDel(pick(app.name, lang)) : text[lang].favAdd(pick(app.name, lang)));
        star.title = star.getAttribute('aria-label');
    }

    // ---------- Favorilerim şeridi ----------
    let favEdit = false, favBox = null, live = null;
    function say(t) { if (!live) return; live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); }
    function favSection() {
        if (!FAV) return;
        if (!favBox) {
            favBox = el('section', 'hub-favs');
            favBox.setAttribute('aria-labelledby', 'hub-favs-t');
            const anchor = tools || grid;
            anchor.parentNode.insertBefore(favBox, anchor);
            live = el('p', 'sr-only');
            live.setAttribute('role', 'status');
            live.setAttribute('aria-live', 'polite');
            Object.assign(live.style, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' });
            favBox.after(live);
        }
        drawFavs();
    }
    function drawFavs(focusId) {
        const lang = HCG.lang, t = text[lang];
        const list = FAV.list().map((id) => byId[id]).filter(Boolean);
        if (!list.length) favEdit = false;
        favBox.classList.toggle('is-edit', favEdit);
        favBox.classList.toggle('is-empty', !list.length);
        const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        favBox.innerHTML = `
            <div class="hub-favs__head">
                <h2 id="hub-favs-t">${STAR}${esc(t.favs)}${list.length ? `<span class="hub-favs__n">${list.length}</span>` : ''}</h2>
                ${favEdit ? `<span class="hub-favs__hint">${esc(t.hint)}</span>` : ''}
                ${list.length ? `<button type="button" class="hub-favs__edit" data-fav-edit aria-pressed="${favEdit}">${esc(favEdit ? t.done : t.edit)}</button>` : ''}
            </div>
            ${list.length ? `<ol class="hub-favs__list" aria-label="${esc(t.favs)}">${list.map((a, i) => {
                const c = a.colors || ['#1d5a47', '#0a1f19'];
                const icon = a.iconSvg || `<span>${esc(a.icon || '◆')}</span>`;
                return `<li class="hub-fav" data-fav data-id="${esc(a.id)}" style="--c1:${esc(c[0])};--c2:${esc(c[1] || c[0])};--ic:${esc(a.iconColor || '#dab56d')}">
                    <a class="hub-fav__link" href="${esc(a.href)}" data-fav-link="${esc(a.id)}"${favEdit ? ` aria-label="${esc(pick(a.name, lang))}, ${esc(t.pos(i + 1))}" aria-roledescription="${lang === 'tr' ? 'sıralanabilir' : 'sortable'}"` : ''}>
                        <span class="hub-fav__icon" aria-hidden="true">${icon}</span>
                        <span class="hub-fav__txt"><b>${esc(pick(a.name, lang))}</b><small>${esc(pick(a.tagline, lang))}</small></span>
                    </a>
                    ${favEdit ? `<span class="hub-fav__grip" aria-hidden="true">${GRIP}</span><button type="button" class="hub-fav__rm" data-fav-remove="${esc(a.id)}" aria-label="${esc(t.favDel(pick(a.name, lang)))}">${X}</button>` : ''}
                </li>`;
            }).join('')}</ol>` : `<p class="hub-favs__empty">${esc(t.emptyFav)}</p>`}`;
        const ol = favBox.querySelector('.hub-favs__list');
        if (ol) FAV.sortable(ol, { item: '[data-fav]', enabled: () => favEdit, onSort: (order, id) => { FAV.set(order); say(t.moved(pick(byId[id].name, lang), order.indexOf(id) + 1)); setTimeout(() => drawFavs(), 240); } });
        if (focusId) { const f = favBox.querySelector(`[data-fav-link="${focusId}"]`) || favBox.querySelector('[data-fav-edit]'); if (f) f.focus({ preventScroll: true }); }
    }
    function favRemove(id) {
        const lang = HCG.lang, l = FAV.list(), i = l.indexOf(id);
        FAV.remove(id);
        say(text[lang].favRemoved(pick(byId[id].name, lang)));
        const n = FAV.list(), next = n[Math.min(i, n.length - 1)];
        const f = next ? favBox.querySelector(`[data-fav-link="${next}"]`) : favBox.querySelector('[data-fav-edit]');
        (f || favBox).focus && (f || favBox).focus({ preventScroll: true });
    }
    if (FAV) {
        document.addEventListener('click', (e) => {
            const lang = HCG.lang;
            const st = e.target.closest('[data-fav-toggle]');
            if (st) {
                const a = byId[st.dataset.favToggle], on = FAV.toggle(a.id);
                st.classList.remove('is-pop'); void st.offsetWidth; if (on) st.classList.add('is-pop');
                say(on ? text[lang].favAdded(pick(a.name, lang)) : text[lang].favRemoved(pick(a.name, lang)));
                return;
            }
            if (!favBox || !favBox.contains(e.target)) return;
            if (e.target.closest('[data-fav-edit]')) { favEdit = !favEdit; drawFavs(); const b = favBox.querySelector('[data-fav-edit]'); if (b) b.focus({ preventScroll: true }); if (favEdit) say(text[lang].editing); return; }
            const rm = e.target.closest('[data-fav-remove]'); if (rm) { favRemove(rm.dataset.favRemove); return; }
            if (favEdit && e.target.closest('[data-fav-link]')) e.preventDefault(); // düzenlerken bağlantı açılmaz
        });
        document.addEventListener('keydown', (e) => {
            if (!favEdit || !favBox) return;
            if (e.key === 'Escape') { favEdit = false; drawFavs(); return; }
            const l = e.target.closest && e.target.closest('[data-fav-link]');
            if (!l || !favBox.contains(l)) return;
            const id = l.dataset.favLink, step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
            if (step) { e.preventDefault(); if (FAV.move(id, step)) say(text[HCG.lang].moved(pick(byId[id].name, HCG.lang), FAV.list().indexOf(id) + 1)); }
            else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); favRemove(id); }
        });
        FAV.on((ids, why) => {
            if (why && why.tur === 'sira' && !why.id) return; // sürükleme bitti: şerit kendini yeniler
            if (favBox) drawFavs(why && why.tur === 'sira' ? why.id : null);
            grid.querySelectorAll('[data-fav-toggle]').forEach((b) => markStar(b, byId[b.dataset.favToggle], HCG.lang));
        });
    }

    function render() {
        const lang = HCG.lang;
        const query = search ? search.value.trim().toLocaleLowerCase(lang) : '';
        const visible = apps.filter((app) => {
            if (!query) return true;
            const haystack = [pick(app.name, lang), pick(app.tagline, lang), pick(app.description, lang)]
                .concat((app.features && app.features[lang]) || [])
                .join(' ')
                .toLocaleLowerCase(lang);
            return haystack.includes(query);
        });

        grid.replaceChildren();
        grid.classList.toggle('is-solo', apps.length === 1);

        visible.forEach((app, index) => grid.appendChild(createTile(app, lang, index)));

        if (!visible.length && query) {
            grid.appendChild(el('p', 'hub-empty', text[lang].empty));
        } else if (!query) {
            const soon = el('div', 'app-tile app-tile--soon card');
            if (firstRender) {
                soon.setAttribute('data-reveal', '');
                soon.style.setProperty('--d', visible.length * 90);
            }
            const plus = el('span', 'plus');
            plus.appendChild(HCG.icon('plus'));
            soon.append(plus, el('p', '', text[lang].soon));
            grid.appendChild(soon);
        }

        if (tools) tools.hidden = apps.length < SEARCH_THRESHOLD;
        if (count) count.textContent = text[lang].count(visible.length);

        if (firstRender) {
            firstRender = false;
            HCG.observeReveals(grid);
        }
        favSection();
    }

    // Theme picker: "cocuk" or "yetiskin". Every app under /mektep/ reads this key when it opens
    // and writes it back when the theme is changed inside the app.
    const APP_THEME_KEY = 'apps:tema';
    const themeButtons = Array.from(document.querySelectorAll('[data-app-theme]'));
    function readAppTheme() {
        try {
            const saved = localStorage.getItem(APP_THEME_KEY);
            return saved === 'cocuk' || saved === 'yetiskin' ? saved : 'yetiskin';
        } catch (e) { return 'yetiskin'; }
    }
    function markTheme(theme) {
        themeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.appTheme === theme)));
    }
    themeButtons.forEach((button) => button.addEventListener('click', () => {
        try { localStorage.setItem(APP_THEME_KEY, button.dataset.appTheme); } catch (e) { /* private mode */ }
        markTheme(button.dataset.appTheme);
    }));
    // opening an app without touching the picker still carries the theme shown as selected
    grid.addEventListener('click', (event) => {
        if (!event.target.closest('a.app-tile')) return;
        try { if (!localStorage.getItem(APP_THEME_KEY)) localStorage.setItem(APP_THEME_KEY, readAppTheme()); } catch (e) { /* private mode */ }
    });
    window.addEventListener('storage', (event) => { if (event.key === APP_THEME_KEY) markTheme(readAppTheme()); });
    window.addEventListener('pageshow', () => markTheme(readAppTheme()));
    markTheme(readAppTheme());

    HCG.onLangChange(render);
    if (search) search.addEventListener('input', render);
})();
