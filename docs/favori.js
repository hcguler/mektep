// ============================================
// Mektep — favoriler (ana ekran: apps/index.html)
// --------------------------------------------
// Kullanıcının seçtiği uygulamalar, seçtiği sırayla. Tarayıcı görünümü (hub.js) ve uygulama olarak
// yüklendiğindeki telefon ana ekranı (launcher.js) aynı kaydı kullanır:
//   localStorage 'apps:favoriler' → ["dualar", "ezberler", …]  (sıra = gösterim sırası)
// Yalnızca yayında olan (soon olmayan, href'i olan) uygulamalar favori olabilir; listeden kalkan bir
// uygulama kayıtta kalsa da gösterilmez.
//
// AppsFav.list() · has(id) · toggle(id) → bool · remove(id) · move(id, adım) · set(ids) · on(fn)
// AppsFav.sortable(liste, { item, enabled, onSort, onClickAfterDrag }) → sürükle-bırak ile sıralama
//   (fare, dokunma ve kalem; Pointer Events). Klavye sırası görünümlerin kendisindedir (ok tuşları).
// ============================================
(function () {
    'use strict';
    if (window.AppsFav) return;

    const KEY = 'apps:favoriler';
    const APPS = window.HCG_APPS || [];
    const ok = new Set(APPS.filter((a) => !a.soon && a.href).map((a) => a.id));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fns = new Set();

    function read() {
        try {
            const v = JSON.parse(localStorage.getItem(KEY) || '[]');
            return Array.isArray(v) ? v.filter((id, i) => typeof id === 'string' && v.indexOf(id) === i) : [];
        } catch (e) { return []; }
    }
    let raw = read();
    const list = () => raw.filter((id) => ok.has(id));
    function write(next, why) {
        // Gösterilmeyen (yayından kalkmış) kimlikler kayıtta yerini korur.
        const hidden = raw.filter((id) => !ok.has(id));
        raw = next.filter((id, i) => ok.has(id) && next.indexOf(id) === i).concat(hidden);
        try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch (e) { /* gizli mod */ }
        fns.forEach((fn) => fn(list(), why));
    }
    const has = (id) => list().includes(id);
    function toggle(id) {
        if (!ok.has(id)) return false;
        const l = list();
        if (l.includes(id)) { write(l.filter((x) => x !== id), { tur: 'cikar', id }); return false; }
        write(l.concat(id), { tur: 'ekle', id });
        return true;
    }
    const remove = (id) => write(list().filter((x) => x !== id), { tur: 'cikar', id });
    function move(id, step) {
        const l = list(), i = l.indexOf(id), j = i + step;
        if (i < 0 || j < 0 || j >= l.length) return false;
        l.splice(j, 0, l.splice(i, 1)[0]);
        write(l, { tur: 'sira', id });
        return true;
    }
    const set = (ids) => write(ids, { tur: 'sira' });
    const on = (fn) => { fns.add(fn); return () => fns.delete(fn); };
    window.addEventListener('storage', (e) => { if (e.key === KEY) { raw = read(); fns.forEach((fn) => fn(list(), { tur: 'dis' })); } });

    // ---------- Sürükle-bırak ile sıralama ----------
    // Öge parmağın / imlecin altında kalır; üzerine gelinen ögenin yerine geçer, diğerleri kayarak (FLIP) yer açar.
    function sortable(listEl, o) {
        let d = null, suppress = false;
        const kayan = new WeakMap(); // kayma animasyonu süren ögeler: eski yerlerinde görünürler, çarpışmaya katılmazlar
        const items = () => Array.from(listEl.querySelectorAll(o.item));
        function flip(change) {
            const before = new Map(items().filter((x) => x !== d.el).map((x) => [x, x.getBoundingClientRect()]));
            change();
            if (reduce.matches) return;
            before.forEach((r, x) => {
                const n = x.getBoundingClientRect(), dx = r.left - n.left, dy = r.top - n.top;
                if (!dx && !dy) return;
                const a = x.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
                kayan.set(x, a);
                a.onfinish = a.oncancel = () => { if (kayan.get(x) === a) kayan.delete(x); };
            });
        }
        function place(e) {
            d.el.style.transform = 'none';
            const r = d.el.getBoundingClientRect();
            d.el.style.transform = `translate(${e.clientX - d.ox - r.left}px,${e.clientY - d.oy - r.top}px) scale(1.06)`;
        }
        listEl.addEventListener('pointerdown', (e) => {
            if (!o.enabled() || (e.pointerType === 'mouse' && e.button !== 0)) return;
            if (e.target.closest('[data-fav-remove]')) return;
            const el = e.target.closest(o.item);
            if (!el || !listEl.contains(el)) return;
            const r = el.getBoundingClientRect();
            d = { el, pid: e.pointerId, x0: e.clientX, y0: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, on: false };
        });
        listEl.addEventListener('pointermove', (e) => {
            if (!d || e.pointerId !== d.pid) return;
            if (!d.on) {
                if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
                d.on = true;
                d.el.classList.add('is-drag');
                listEl.classList.add('is-sorting');
                try { d.el.setPointerCapture(d.pid); } catch (err) { /* eski tarayıcı */ }
            }
            e.preventDefault();
            const hit = items().find((x) => {
                if (x === d.el || kayan.has(x)) return false;
                const r = x.getBoundingClientRect();
                return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
            });
            if (hit) {
                const all = items(), from = all.indexOf(d.el), to = all.indexOf(hit);
                flip(() => (to > from ? hit.after(d.el) : hit.before(d.el)));
            }
            place(e);
        });
        const end = (e) => {
            if (!d || (e && e.pointerId !== d.pid)) return;
            const was = d.on, el = d.el;
            d = null;
            if (!was) return;
            suppress = true; setTimeout(() => { suppress = false; }, 0);
            listEl.classList.remove('is-sorting');
            const r0 = el.getBoundingClientRect();
            el.style.transform = '';
            el.classList.remove('is-drag');
            if (!reduce.matches) {
                const r1 = el.getBoundingClientRect();
                el.animate([{ transform: `translate(${r0.left - r1.left}px,${r0.top - r1.top}px) scale(1.06)` }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' });
            }
            o.onSort(items().map((x) => x.dataset.id), el.dataset.id);
        };
        listEl.addEventListener('pointerup', end);
        listEl.addEventListener('pointercancel', end);
        // Bağlantı ve görsellerin tarayıcıya ait sürükle-bırakı, düzenlerken işaretçi olaylarını keser
        listEl.addEventListener('dragstart', (e) => { if (o.enabled()) e.preventDefault(); });
        // Sürüklemenin sonundaki tıklama bağlantıyı açmasın
        listEl.addEventListener('click', (e) => { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    }

    window.AppsFav = { KEY, list, has, toggle, remove, move, set, on, sortable, uygun: (id) => ok.has(id) };
})();
