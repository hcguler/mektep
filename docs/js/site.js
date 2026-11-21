// ============================================
// Shared site core (home page + /apps/ hub)
// theme · language · navigation · reveal · pointer effects · background mesh
// ============================================
(function () {
    'use strict';

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const assetRoot = root.getAttribute('data-root') || '';

    const store = {
        get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } }
    };

    // ============================================
    // State
    // ============================================
    const savedLang = store.get('lang');
    const savedTheme = store.get('theme');

    let currentLang = savedLang === 'en' || savedLang === 'tr' ? savedLang : 'tr';
    let currentTheme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : (prefersDarkTheme.matches ? 'dark' : 'light');
    let hasManualThemePreference = savedTheme === 'dark' || savedTheme === 'light';

    const langListeners = [];
    const themeListeners = [];

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const backToTop = document.getElementById('back-to-top');

    // ============================================
    // Helpers
    // ============================================
    function icon(name, className) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', className || 'icon');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', assetRoot + 'assets/icons.svg#' + name);
        svg.appendChild(use);
        return svg;
    }

    function withViewTransition(update) {
        if (!document.startViewTransition || reduceMotion.matches) {
            update();
            return null;
        }
        return document.startViewTransition(update);
    }

    // ============================================
    // Theme System
    // ============================================
    function applyTheme() {
        root.setAttribute('data-theme', currentTheme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', currentTheme === 'dark' ? '#0b0d10' : '#f6f3ec');
        themeListeners.forEach((fn) => fn(currentTheme));
    }

    function setTheme(next, origin) {
        if (next === currentTheme) return;
        currentTheme = next;

        if (!origin || !document.startViewTransition || reduceMotion.matches) {
            applyTheme();
            return;
        }

        // Circular reveal that grows from the toggle button
        const rect = origin.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        root.classList.add('theme-vt');
        const transition = document.startViewTransition(applyTheme);
        transition.ready.then(() => {
            root.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 620, easing: 'cubic-bezier(.3,.6,.2,1)', pseudoElement: '::view-transition-new(root)' }
            );
        }).catch(() => {});
        transition.finished.finally(() => root.classList.remove('theme-vt'));
    }

    function initTheme() {
        applyTheme();

        prefersDarkTheme.addEventListener('change', (event) => {
            if (hasManualThemePreference) return;
            setTheme(event.matches ? 'dark' : 'light');
        });

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                hasManualThemePreference = true;
                const next = currentTheme === 'dark' ? 'light' : 'dark';
                store.set('theme', next);
                setTheme(next, themeToggle);
            });
        }
    }

    // ============================================
    // Language System
    // ============================================
    function updateLanguage() {
        document.querySelectorAll('[data-tr][data-en]').forEach((el) => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) el.textContent = text;
        });
        document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]').forEach((el) => {
            el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}-placeholder`));
        });
        root.setAttribute('lang', currentLang);

        if (langToggle) {
            const langText = langToggle.querySelector('.lang-text');
            if (langText) langText.textContent = currentLang === 'tr' ? 'EN' : 'TR';
        }

        langListeners.forEach((fn) => fn(currentLang));
    }

    function initLanguage() {
        updateLanguage();

        if (langToggle) {
            langToggle.addEventListener('click', () => {
                currentLang = currentLang === 'tr' ? 'en' : 'tr';
                store.set('lang', currentLang);
                withViewTransition(updateLanguage);
            });
        }
    }

    // ============================================
    // Navigation
    // ============================================
    function closeMenu() {
        if (!navMenu || !hamburger) return;
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function initNavigation() {
        let ticking = false;

        function onScroll() {
            ticking = false;
            const y = window.scrollY;
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const progress = Math.min(1, Math.max(0, y / max));

            root.style.setProperty('--progress', progress.toFixed(4));
            if (navbar) navbar.classList.toggle('scrolled', y > 50);
            if (backToTop) backToTop.classList.toggle('visible', y > 500);
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(onScroll);
            }
        }, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();

        if (hamburger && navMenu) {
            navMenu.querySelectorAll('li').forEach((li, index) => li.style.setProperty('--i', index));

            hamburger.addEventListener('click', () => {
                const open = !navMenu.classList.contains('active');
                hamburger.classList.toggle('active', open);
                hamburger.setAttribute('aria-expanded', String(open));
                navMenu.classList.toggle('active', open);
                document.body.classList.toggle('menu-open', open);
            });

            navMenu.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));

            window.matchMedia('(min-width: 1100px)').addEventListener('change', closeMenu);
        }

        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
            });
        }

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    // ============================================
    // Scroll reveal
    // ============================================
    let revealObserver = null;

    function reveal(el) {
        el.classList.add('is-in');
        const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
        // hand transitions back to the element's own hover styles once it has settled
        setTimeout(() => el.removeAttribute('data-reveal'), delay + 1100);
    }

    function observeReveals(scope) {
        const base = scope || document;

        base.querySelectorAll('[data-stagger]').forEach((group) => {
            Array.from(group.children).forEach((child, index) => {
                if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
                child.style.setProperty('--d', index * 90);
            });
            group.removeAttribute('data-stagger');
        });

        const targets = base.querySelectorAll('[data-reveal]:not(.is-in)');

        if (!('IntersectionObserver' in window) || reduceMotion.matches) {
            targets.forEach((el) => { el.classList.add('is-in'); el.removeAttribute('data-reveal'); });
            return;
        }

        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    reveal(entry.target);
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        }

        targets.forEach((el) => revealObserver.observe(el));
    }

    // ============================================
    // Pointer effects: card spotlight + magnetic buttons
    // ============================================
    function initPointerEffects() {
        if (!finePointer.matches) return;

        document.addEventListener('pointermove', (e) => {
            const card = e.target.closest ? e.target.closest('.card') : null;
            if (!card) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }, { passive: true });

        if (reduceMotion.matches) return;

        document.querySelectorAll('[data-magnetic]').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                el.style.setProperty('--tx', `${(dx * 0.22).toFixed(1)}px`);
                el.style.setProperty('--ty', `${(dy * 0.3).toFixed(1)}px`);
            });
            el.addEventListener('pointerleave', () => {
                el.style.setProperty('--tx', '0px');
                el.style.setProperty('--ty', '0px');
            });
        });
    }

    // ============================================
    // Background: a drifting "service mesh" with travelling packets
    // ============================================
    function initMesh() {
        const canvas = document.getElementById('mesh');
        if (!canvas || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const LINK = 150;
        let width = 0;
        let height = 0;
        let nodes = [];
        let packets = [];
        let rgb = '255,150,96';
        let frame = 0;
        let lastPacket = 0;
        const pointer = { x: -9999, y: -9999 };

        function readColor() {
            rgb = getComputedStyle(root).getPropertyValue('--mesh-rgb').trim() || rgb;
        }

        function seed() {
            const count = Math.round(Math.min(54, Math.max(12, (width * height) / 28000)));
            nodes = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: 1 + Math.random() * 1.5
            }));
            packets = [];
        }

        function resize(force) {
            const w = window.innerWidth;
            const h = Math.max(window.innerHeight, canvas.clientHeight || 0);
            // mobile browsers resize on scroll (URL bar) — only reseed when the width changes
            const widthChanged = w !== width;
            if (!force && !widthChanged && h <= height) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = w;
            height = h;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (force || widthChanged || !nodes.length) seed();
        }

        function draw(time) {
            ctx.clearRect(0, 0, width, height);
            const links = [];

            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                a.x += a.vx;
                a.y += a.vy;
                if (a.x < -20) a.x = width + 20; else if (a.x > width + 20) a.x = -20;
                if (a.y < -20) a.y = height + 20; else if (a.y > height + 20) a.y = -20;

                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < LINK) {
                        ctx.strokeStyle = `rgba(${rgb},${((1 - dist / LINK) * 0.2).toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                        links.push(i, j);
                    }
                }

                const pdx = a.x - pointer.x;
                const pdy = a.y - pointer.y;
                const pd = Math.sqrt(pdx * pdx + pdy * pdy);
                if (pd < 190) {
                    ctx.strokeStyle = `rgba(${rgb},${((1 - pd / 190) * 0.4).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }

                ctx.fillStyle = `rgba(${rgb},.55)`;
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // send a "request" along a random live link every now and then
            if (links.length && time - lastPacket > 420 && packets.length < 9) {
                const pick = Math.floor(Math.random() * (links.length / 2)) * 2;
                packets.push({ from: links[pick], to: links[pick + 1], t: 0, speed: 0.012 + Math.random() * 0.012 });
                lastPacket = time;
            }

            packets = packets.filter((p) => p.t < 1);
            packets.forEach((p) => {
                const a = nodes[p.from];
                const b = nodes[p.to];
                p.t += p.speed;
                if (Math.abs(a.x - b.x) > LINK * 1.6 || Math.abs(a.y - b.y) > LINK * 1.6) { p.t = 1; return; }
                const x = a.x + (b.x - a.x) * p.t;
                const y = a.y + (b.y - a.y) * p.t;
                const fade = Math.sin(Math.PI * Math.min(1, p.t));
                ctx.fillStyle = `rgba(${rgb},${(0.16 * fade).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(x, y, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(${rgb},${(0.95 * fade).toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(x, y, 2.1, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function loop(time) {
            draw(time);
            frame = requestAnimationFrame(loop);
        }

        function start() {
            cancelAnimationFrame(frame);
            if (reduceMotion.matches) { draw(0); return; }
            if (!document.hidden) frame = requestAnimationFrame(loop);
        }

        readColor();
        resize(true);
        start();

        window.addEventListener('resize', () => { resize(false); if (reduceMotion.matches) draw(0); });
        document.addEventListener('visibilitychange', start);
        reduceMotion.addEventListener('change', start);
        themeListeners.push(() => { readColor(); if (reduceMotion.matches) draw(0); });

        if (finePointer.matches) {
            window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
            root.addEventListener('pointerleave', () => { pointer.x = -9999; pointer.y = -9999; });
        }
    }

    // ============================================
    // Set Current Year
    // ============================================
    function setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) yearElement.textContent = new Date().getFullYear();
    }

    // ============================================
    // Public API
    // ============================================
    window.HCG = {
        get lang() { return currentLang; },
        get theme() { return currentTheme; },
        reduceMotion,
        finePointer,
        icon,
        observeReveals,
        onLangChange(fn) { langListeners.push(fn); },
        onThemeChange(fn) { themeListeners.push(fn); }
    };

    // ============================================
    // Initialize
    // ============================================
    function init() {
        initTheme();
        initLanguage();
        initNavigation();
        observeReveals();
        initPointerEffects();
        initMesh();
        setCurrentYear();
    }

    // page scripts register their language listeners first, then we boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
