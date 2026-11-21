// ============================================
// Mektep — PWA: kurulum, güncelleme ve yeni uygulama bildirimi
// --------------------------------------------
// apps/ altındaki her sayfa bu dosyayı yükler (ana ekran, Namaz, Ezberler…).
//   · sw.js'yi /mektep/ kapsamıyla kaydeder.
//   · Yeni sürüm indiğinde "Yeni sürüm hazır" penceresini açar; "Güncelle" ile devreye alır.
//     Yeni yayımlanan uygulamalar apps.js'ten okunup pencerede adıyla gösterilir.
//   · Ana ekranda (window.HCG_APPS varsa) son ziyaretten beri yayımlanan uygulamaları bildirir.
//   · [data-pwa-install] öğesi varsa "Ana ekrana ekle" akışını yönetir (iOS için adım adım anlatım).
// Ortak localStorage anahtarı: apps:yayinda → kullanıcının gördüğü yayımlanmış uygulama kimlikleri.
// ============================================
(function () {
    'use strict';

    const script = document.currentScript;
    const BASE = new URL('.', script ? script.src : location.href).href; // …/mektep/
    const SEEN_KEY = 'apps:yayinda';
    const ss = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* yok say */ } } };
    const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } } };
    const en = () => (document.documentElement.lang || 'tr').toLowerCase().startsWith('en');
    const T = (tr, enText) => (en() ? enText : tr);
    const pick = (v) => (v == null ? '' : typeof v === 'string' ? v : (en() ? v.en || v.tr : v.tr || v.en) || '');
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const standalone = () => ['fullscreen', 'standalone', 'minimal-ui', 'window-controls-overlay'].some((m) => window.matchMedia(`(display-mode: ${m})`).matches) || navigator.standalone === true;
    const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // ---------- Görünüm (sayfanın kendi stilinden bağımsız) ----------
    function injectStyle() {
        if (document.getElementById('pwa-css')) return;
        const css = `
.pwa-dlg{--pd-bg:#0f1d18;--pd-surface:#16291f;--pd-ink:#f4eedf;--pd-soft:#a9b6ad;--pd-line:rgba(228,208,164,.2);--pd-gold:#dab56d;--pd-gold-ink:#1b1406;--pd-shadow:0 30px 80px -20px rgba(0,0,0,.7);
  width:min(440px,calc(100vw - 32px));max-height:calc(100dvh - 48px);margin:auto;padding:0;border:1px solid var(--pd-line);border-radius:26px;background:var(--pd-bg);color:var(--pd-ink);box-shadow:var(--pd-shadow);font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:15px;line-height:1.55;overflow:auto}
.pwa-dlg[data-mode="light"]{--pd-bg:#fffdf8;--pd-surface:#f5eede;--pd-ink:#1a2a23;--pd-soft:#55655e;--pd-line:rgba(38,58,48,.16);--pd-gold:#1d5a47;--pd-gold-ink:#fbf6ea;--pd-shadow:0 30px 70px -24px rgba(60,45,20,.45)}
.pwa-dlg::backdrop{background:rgba(4,10,8,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
.pwa-dlg[open]{animation:pwaIn .4s cubic-bezier(.2,.7,.2,1) both}
@keyframes pwaIn{from{opacity:0;transform:translateY(16px) scale(.97)}}
.pwa-dlg__in{display:flex;flex-direction:column;align-items:center;text-align:center;padding:28px 24px 22px}
.pwa-dlg__icon{width:72px;height:72px;border-radius:18px;box-shadow:0 12px 26px -12px rgba(0,0,0,.6)}
.pwa-dlg h2{margin:16px 0 6px;font-family:var(--font-d,"Bricolage Grotesque","Inter",system-ui,sans-serif);font-weight:700;font-size:1.5rem;line-height:1.2;letter-spacing:-.01em}
.pwa-dlg p{margin:0;color:var(--pd-soft)}
.pwa-dlg__list{width:100%;display:grid;gap:8px;margin:16px 0 0;padding:0;list-style:none;text-align:left}
.pwa-dlg__list li{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--pd-line);border-radius:16px;background:var(--pd-surface)}
.pwa-dlg__list .ic{flex:none;width:40px;height:40px;display:grid;place-items:center;border-radius:12px;font-size:1.3rem}
.pwa-dlg__list .ic svg{width:62%;height:62%}
.pwa-dlg__list b{display:block;font-weight:600;line-height:1.3}
.pwa-dlg__list small{display:block;color:var(--pd-soft);font-size:.82rem;line-height:1.35}
.pwa-dlg__list .tx{flex:1;min-width:0}
.pwa-dlg__list a{flex:none;min-height:40px;display:inline-flex;align-items:center;padding:0 14px;border-radius:999px;border:1px solid var(--pd-line);color:inherit;text-decoration:none;font-weight:600;font-size:.84rem}
.pwa-dlg__list a:hover{border-color:var(--pd-gold);color:var(--pd-gold)}
.pwa-dlg__steps{counter-reset:s;width:100%;display:grid;gap:8px;margin:18px 0 0;padding:0;list-style:none;text-align:left}
.pwa-dlg__steps li{counter-increment:s;display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--pd-line);border-radius:16px;background:var(--pd-surface)}
.pwa-dlg__steps li::before{content:counter(s);flex:none;width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:var(--pd-gold);color:var(--pd-gold-ink);font-weight:700;font-size:.85rem}
.pwa-dlg__steps svg{display:inline-block;width:18px;height:18px;vertical-align:-3px;margin:0 2px;color:var(--pd-gold)}
.pwa-dlg__acts{width:100%;display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.pwa-dlg__acts button{flex:1 1 140px;min-height:48px;padding:0 18px;border-radius:999px;border:1px solid var(--pd-line);background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer;transition:transform .25s,background .25s,border-color .25s}
.pwa-dlg__acts button:active{transform:scale(.97)}
.pwa-dlg__acts button.pri{background:var(--pd-gold);border-color:var(--pd-gold);color:var(--pd-gold-ink)}
.pwa-dlg__acts button:disabled{opacity:.6;cursor:progress}
.pwa-dlg :focus-visible{outline:2px solid var(--pd-gold);outline-offset:3px}
.pwa-toast{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));z-index:2147483000;transform:translate(-50%,16px);max-width:min(92vw,420px);padding:12px 18px;border-radius:16px;background:#0f1d18;color:#f4eedf;border:1px solid rgba(228,208,164,.25);box-shadow:0 18px 40px -18px rgba(0,0,0,.6);font:600 .92rem/1.4 "Inter",system-ui,sans-serif;text-align:center;opacity:0;pointer-events:none;transition:opacity .25s,transform .35s cubic-bezier(.34,1.4,.64,1)}
.pwa-toast.on{opacity:1;transform:translate(-50%,0)}
@media (prefers-reduced-motion:reduce){.pwa-dlg[open]{animation:none}.pwa-toast{transition:none}}`;
        const st = document.createElement('style');
        st.id = 'pwa-css';
        st.textContent = css;
        document.head.appendChild(st);
    }
    const mode = () => {
        const d = document.documentElement.dataset;
        const m = d.mode || ls.get('theme') || d.theme;
        if (m === 'light' || m === 'dark') return m;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    let openDlg = null;
    function dialog(opts) {
        injectStyle();
        if (openDlg) openDlg.close();
        const dlg = document.createElement('dialog');
        dlg.className = 'pwa-dlg';
        dlg.dataset.mode = mode();
        dlg.setAttribute('aria-labelledby', 'pwa-dlg-t');
        dlg.innerHTML = `<div class="pwa-dlg__in">
            <img class="pwa-dlg__icon" src="${BASE}icons/icon-192.png" alt="" width="72" height="72">
            <h2 id="pwa-dlg-t">${esc(opts.title)}</h2>
            ${opts.body || ''}
            <div class="pwa-dlg__acts"></div>
        </div>`;
        const acts = dlg.querySelector('.pwa-dlg__acts');
        (opts.actions || []).forEach((a) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = a.label;
            if (a.primary) b.className = 'pri';
            b.addEventListener('click', () => { if (a.onClick && a.onClick(b) === false) return; dlg.close(); });
            acts.appendChild(b);
        });
        dlg.addEventListener('cancel', (e) => { if (opts.locked) e.preventDefault(); });
        dlg.addEventListener('close', () => { dlg.remove(); if (openDlg === dlg) openDlg = null; if (opts.onClose) opts.onClose(); });
        document.body.appendChild(dlg);
        openDlg = dlg;
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
        const pri = dlg.querySelector('.pri');
        if (pri) pri.focus();
        return dlg;
    }

    let toastTimer = null;
    function toast(msg) {
        injectStyle();
        let el = document.querySelector('.pwa-toast');
        if (!el) { el = document.createElement('div'); el.className = 'pwa-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
        el.textContent = msg;
        requestAnimationFrame(() => el.classList.add('on'));
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('on'), 3200);
    }

    // ---------- Uygulama listesi ----------
    const published = (list) => (list || []).filter((a) => a && a.id && !a.soon && a.href);
    const readSeen = () => { try { const v = JSON.parse(ls.get(SEEN_KEY)); return Array.isArray(v) ? v : null; } catch (e) { return null; } };
    const writeSeen = (ids) => ls.set(SEEN_KEY, JSON.stringify(ids));
    function fetchApps() { // apps.js ağdan okunur; sayfaya eklenmeden ayrı bir kapta çalıştırılır
        return fetch(BASE + 'apps.js', { cache: 'no-store' })
            .then((r) => (r.ok ? r.text() : Promise.reject()))
            .then((text) => { const w = {}; new Function('window', text)(w); return w.HCG_APPS || []; })
            .catch(() => null);
    }
    function appRow(app, withLink) {
        const ic = app.iconSvg
            ? `<span class="ic" style="background:${esc(app.iconBg || '#0c1814')};color:${esc(app.iconColor || '#dab56d')}">${app.iconSvg}</span>`
            : `<span class="ic" style="background:linear-gradient(135deg,${esc((app.colors || [])[0] || '#1d5a47')},${esc((app.colors || [])[1] || '#0a1f19')})">${esc(app.icon || '◆')}</span>`;
        return `<li>${ic}<span class="tx"><b>${esc(pick(app.name))}</b><small>${esc(pick(app.tagline))}</small></span>${withLink ? `<a href="${esc(BASE + app.href)}">${esc(T('Aç', 'Open'))}</a>` : ''}</li>`;
    }

    // ---------- Güncelleme ----------
    let reloading = false;
    function promptUpdate(worker) {
        if (ss.get('pwa:sonra') === '1') return;
        fetchApps().then((apps) => {
            const seen = readSeen() || (window.HCG_APPS ? published(window.HCG_APPS).map((a) => a.id) : null);
            const fresh = apps && seen ? published(apps).filter((a) => !seen.includes(a.id)) : [];
            const body = fresh.length
                ? `<p>${esc(T(fresh.length > 1 ? 'Yeni uygulamalar eklendi:' : 'Yeni bir uygulama eklendi:', fresh.length > 1 ? 'New apps have been added:' : 'A new app has been added:'))}</p><ul class="pwa-dlg__list">${fresh.map((a) => appRow(a, false)).join('')}</ul>`
                : `<p>${esc(T('Mektep’te yenilikler ve iyileştirmeler var. Güncelleme birkaç saniye sürer.', 'Mektep has new features and improvements. Updating takes a few seconds.'))}</p>`;
            dialog({
                title: T('Yeni sürüm hazır', 'A new version is ready'),
                body,
                actions: [
                    { label: T('Sonra', 'Later'), onClick: () => { ss.set('pwa:sonra', '1'); } },
                    { label: T('Şimdi güncelle', 'Update now'), primary: true, onClick: (b) => {
                        b.disabled = true; b.textContent = T('Güncelleniyor…', 'Updating…');
                        ss.set('pwa:guncellendi', '1');
                        worker.postMessage({ tip: 'SKIP_WAITING' });
                        setTimeout(() => { if (!reloading) location.reload(); }, 4000); // güvenlik ağı
                        return false;
                    } }
                ]
            });
        });
    }

    function register() {
        if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (reloading || ss.get('pwa:guncellendi') !== '1') return;
            reloading = true;
            location.reload();
        });
        navigator.serviceWorker.register(BASE + 'sw.js', { scope: BASE }).then((reg) => {
            const watch = (w) => {
                if (!w) return;
                w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(w); });
            };
            if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);
            watch(reg.installing);
            reg.addEventListener('updatefound', () => watch(reg.installing));
            // açık kalan sekmelerde ve kurulu uygulamada yeni sürümü ara
            document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
            setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
        }).catch(() => { /* service worker kullanılamıyorsa site normal çalışır */ });
    }

    // ---------- Güncelleme sonrası ve yeni uygulama bildirimi ----------
    function announce() {
        const updated = ss.get('pwa:guncellendi') === '1';
        if (updated) { try { sessionStorage.removeItem('pwa:guncellendi'); } catch (e) { /* yok say */ } }
        if (!window.HCG_APPS) { if (updated) toast(T('Mektep güncellendi.', 'Mektep updated.')); return; }
        const list = published(window.HCG_APPS);
        const ids = list.map((a) => a.id);
        const seen = readSeen();
        writeSeen(ids);
        if (!seen) { if (updated) toast(T('Mektep güncellendi.', 'Mektep updated.')); return; } // ilk ziyaret: yalnızca kaydet
        const fresh = list.filter((a) => !seen.includes(a.id));
        if (!fresh.length) { if (updated) toast(T('Mektep güncellendi.', 'Mektep updated.')); return; }
        dialog({
            title: T(fresh.length > 1 ? 'Yeni uygulamalar' : 'Yeni uygulama', fresh.length > 1 ? 'New apps' : 'New app'),
            body: `<p>${esc(T('Son ziyaretinden bu yana yayımlandı:', 'Published since your last visit:'))}</p><ul class="pwa-dlg__list">${fresh.map((a) => appRow(a, true)).join('')}</ul>`,
            actions: [{ label: T('Tamam', 'OK'), primary: true }]
        });
    }

    // ---------- Ana ekrana ekle ----------
    let deferred = null;
    let installed = false; // tarayıcıda açıldı ama uygulama zaten kurulu (Chrome/Android: getInstalledRelatedApps)
    const SHARE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    const PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
    function installTargets() { return Array.from(document.querySelectorAll('[data-pwa-install]')); }
    function syncInstall() {
        const can = !standalone() && !installed && (!!deferred || isIOS());
        installTargets().forEach((el) => { el.hidden = !can; });
    }
    function iosSteps() {
        dialog({
            title: T('Ana ekrana ekle', 'Add to Home Screen'),
            body: `<p>${esc(T('Mektep ana ekranında bir uygulama gibi açılır ve çevrimdışı da çalışır.', 'Mektep opens from your home screen like an app and also works offline.'))}</p>
                <ol class="pwa-dlg__steps">
                    <li><span>${T(`Safari'de alttaki ${SHARE_SVG} <b>Paylaş</b> düğmesine dokun.`, `In Safari, tap the ${SHARE_SVG} <b>Share</b> button.`)}</span></li>
                    <li><span>${T(`Listeden ${PLUS_SVG} <b>Ana Ekrana Ekle</b>'yi seç.`, `Choose ${PLUS_SVG} <b>Add to Home Screen</b>.`)}</span></li>
                    <li><span>${T('Sağ üstteki <b>Ekle</b>\'ye dokun.', 'Tap <b>Add</b> in the top right.')}</span></li>
                </ol>`,
            actions: [{ label: T('Anladım', 'Got it'), primary: true }]
        });
    }
    function install() {
        if (deferred) {
            const p = deferred;
            deferred = null;
            p.prompt();
            p.userChoice.finally(syncInstall);
            return;
        }
        if (isIOS()) iosSteps();
    }
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; syncInstall(); });
    // appinstalled, kullanıcı kurulumu onayladığında gelir; Android kurulumu bundan sonra birkaç saniyede bitirir
    // ve bazı başlatıcılar simgeyi yalnızca uygulama listesine koyar.
    window.addEventListener('appinstalled', () => {
        deferred = null; installed = true; syncInstall();
        dialog({
            title: T('Yükleniyor', 'Installing'),
            body: `<p>${esc(T('Mektep birkaç saniye içinde ana ekranında ya da uygulama listende görünecek. Simge ana ekranda yoksa uygulama listesinden basılı tutup ana ekrana sürükleyebilirsin.', 'The apps will appear on your home screen or in your app list within a few seconds. If the icon is not on your home screen, long-press it in the app list and drag it there.'))}</p>`,
            actions: [{ label: T('Tamam', 'OK'), primary: true }]
        });
    });
    if (navigator.getInstalledRelatedApps && !standalone()) {
        navigator.getInstalledRelatedApps().then((apps) => { if (apps && apps.length) { installed = true; syncInstall(); } }).catch(() => {});
    }
    document.addEventListener('click', (e) => {
        const b = e.target.closest('[data-pwa-install-btn]');
        if (b) { e.preventDefault(); install(); }
    });

    window.HCG_PWA = { install, toast };

    const start = () => { syncInstall(); announce(); register(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
