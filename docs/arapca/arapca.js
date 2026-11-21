// ============================================
// Ayet Ayet Arapça — uygulama mantığı
// Plan: docs/planlar/ayet-ayet-arapca.md. Veri: veri/indeks.json ve veri/cNN.json (tools/arapca-uret.mjs üretir).
// Kıraat: Suûd eş-Şüreym (quran.com ayet kayıtları, kelime zamanlamasıyla); önbelleğe alınmaz.
// Sesli anlatım: yalnızca yetişkin profili, ayrı depodan (/arapca-ses/) ../anlatim.js ile çalınır.
// ============================================
(function () {
    'use strict';

    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    const SIMGE = window.ARAPCA_SIMGE || {};
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const TOPLAM_SAYFA = 604;

    // ---------- Veri ----------
    let IDX = null;
    const PK = {};                 // cüz no -> paket
    const AY = {}, SOZ = {}, OGE = {}, SAYFA = {};
    const LEM_YER = {};            // lemma id -> ["s:a:w", ...] (yüklü paketlerde)
    let KAYNAK = {}, KARI = { ad: 'Suûd eş-Şüreym', kok: 'https://verses.quran.com/' }, BASLANGIC = null;
    const cuzAdi = (n) => `c${String(n).padStart(2, '0')}`;
    const sayfaKaydi = (p) => `${cuzAdi(sayfaCuz(p))}/s${String(p).padStart(3, '0')}`;
    function sayfaCuz(p) { return p === 0 ? 1 : IDX.sayfalar[p - 1][2]; }
    async function paketYukle(c) {
        if (PK[c]) return PK[c];
        const r = await fetch(`veri/${cuzAdi(c)}.json`);
        if (!r.ok) throw new Error('paket');
        const pk = await r.json();
        PK[c] = pk;
        Object.assign(AY, pk.ayetler); Object.assign(OGE, pk.ogeler);
        // Aynı kelime birden çok pakette bulunur; öğretildiği paketin kaydı (anlamı olan) korunur.
        for (const [id, l] of Object.entries(pk.sozluk)) if (!SOZ[id] || (l.anlam && !SOZ[id].anlam)) SOZ[id] = l;
        for (const s of pk.sayfalar) SAYFA[s.no] = s;
        for (const [k, a] of Object.entries(pk.ayetler)) a.k.forEach((w, i) => { if (w.l) (LEM_YER[w.l] ||= []).push(`${k}:${i + 1}`); });
        if (pk.kaynaklar) KAYNAK = pk.kaynaklar;
        if (pk.kari) KARI = pk.kari;
        if (pk.baslangic) BASLANGIC = pk.baslangic;
        return pk;
    }
    const yayinda = () => IDX.cuzler.filter((c) => c.yayinda);
    const yayindaSayfa = (p) => { const c = IDX.cuzler[sayfaCuz(p) - 1]; return c && c.yayinda; };
    const sureAd = (s) => IDX.sureler[s - 1];
    const ayRef = (k) => { const [s, a] = k.split(':'); return `${sureAd(+s)} ${a}`; };
    function sayfaAraligi(p) {
        const [ilk, son] = IDX.sayfalar[p - 1];
        const [s1, a1] = ilk.split(':').map(Number), [s2, a2] = son.split(':').map(Number);
        return s1 === s2 ? `${sureAd(s1)} ${a1}–${a2}` : `${sureAd(s1)} ${a1} – ${sureAd(s2)} ${a2}`;
    }

    // ---------- Kalıcı durum ----------
    const KEY = 'arapca:v1';
    const state = { son: 0, tamam: {}, oge: {}, show: { ar: true, ok: false, meal: true, kk: false }, gorunum: 'ayet', arSize: 2, gunluk: 20, yedekUyari: false };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (Number.isInteger(s.son)) state.son = s.son;
        if (s.tamam && typeof s.tamam === 'object') state.tamam = s.tamam;
        if (s.oge && typeof s.oge === 'object') state.oge = s.oge;
        state.show = Object.assign(state.show, s.show || {});
        if (s.gorunum === 'satir' || s.gorunum === 'ayet') state.gorunum = s.gorunum;
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (Number.isInteger(s.gunluk)) state.gunluk = Math.max(5, Math.min(100, s.gunluk));
        state.yedekUyari = !!s.yedekUyari;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';

    // ---------- Aralıklı tekrar (Leitner: 1, 3, 7, 16, 35 gün) ----------
    const KUTU_GUN = [1, 3, 7, 16, 35];
    const bugun = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); };
    function ekle(id) { if (!state.oge[id]) state.oge[id] = { k: 1, s: bugun() + 1, d: 0, y: 0 }; }
    function cevapla(id, dogru) {
        const o = state.oge[id]; if (!o) return;
        if (dogru) { o.d++; o.k = Math.min(5, o.k + 1); } else { o.y++; o.k = 1; }
        o.s = bugun() + KUTU_GUN[o.k - 1];
        save();
    }
    const bilinen = (id) => !!state.oge[id];
    const bekleyen = () => Object.keys(state.oge).filter((id) => state.oge[id].s <= bugun() && (SOZ[id] || OGE[id]));
    const enUzak = () => Math.max(state.son, ...Object.keys(state.tamam).map(Number), 0);
    const tamamSayisi = () => Object.keys(state.tamam).length;
    function siradakiSayfa() {
        if (!state.tamam[0] && BASLANGIC) return 0;
        for (const c of yayinda()) for (let p = c.sayfa[0]; p <= c.sayfa[1]; p++) if (!state.tamam[p]) return p;
        return null;
    }

    // ---------- Metinler ----------
    const COPY = {
        yetiskin: {
            kick: "Kur'an ile Arapça", title: 'Ayet Ayet <em>Arapça</em>',
            lead: "Kur'an'ı mushaf sırasıyla sayfa sayfa okurken Arapçayı öğren: her sayfada ilk kez geçen kelimeler, ekler ve dil bilgisi; ardından aralıklı tekrar.",
            progress: (n) => n === 0 ? `${TOPLAM_SAYFA} sayfalık yolculuk seni bekliyor.` : `${TOPLAM_SAYFA} sayfadan ${n} sayfayı tamamladın.`,
            resume: 'Devam et', start: 'Başlangıç dersi',
            right: 'Doğru.', wrong: 'Yanlış.', soruSay: 8,
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Kartlara bir kez daha göz at.',
            bitti: 'Bugünlük tekrar yok. Yeni bir sayfayla devam edebilirsin.'
        },
        cocuk: {
            kick: "Kur'an'ın dilini öğreniyorum", title: '<span class="emo">📖</span> Ayet Ayet <em>Arapça</em>',
            lead: "Kur'an'ı sayfa sayfa okurken Arapça kelimeler öğren! Her sayfada yeni kelimeler ve küçük oyunlar seni bekliyor.",
            progress: (n) => n === 0 ? 'Hadi ilk sayfayla başlayalım! 🌟' : `${n} sayfa bitirdin! 🎉`,
            resume: 'Devam et', start: 'Hadi başlayalım',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.', soruSay: 5,
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Kartlara bakıp yeniden dene!',
            bitti: 'Bugünlük tekrar bitti! 🎉 Yeni bir sayfa okuyabilirsin.'
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;
    const TUR = { kelime: 'Kelime', edat: 'Edat ve bağlaç', ek: 'Ek', kalip: 'Kalıp', deyim: 'Deyim', dilbilgisi: 'Dil bilgisi' };
    const TUR_EMO = { kelime: '🔤', edat: '🔗', ek: '🧩', kalip: '🧱', deyim: '💬', dilbilgisi: '📐' };

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        home: svg('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>'),
        book: svg('<path d="M12 6c-2.5-2-6-2.5-9-2v15c3-.5 6.5 0 9 2 2.5-2 6-2.5 9-2V4c-3-.5-6.5 0-9 2z"/><path d="M12 6v15"/>'),
        repeat: svg('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
        dict: svg('<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h8M8 13h5"/>'),
        gram: svg('<path d="M4 20 12 4l8 16"/><path d="M7 14h10"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        right: svg('<path d="M9 5l7 7-7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        play: svg('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>'),
        pause: svg('<path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" fill="currentColor" stroke="none"/>'),
        ear: svg('<path d="M6 9a6 6 0 1 1 12 0c0 4-3 5-4 8-.6 2-2 4-4.5 4"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-1.5 3.5"/>'),
        check: svg('<path d="M5 12.5l4.5 4.5L19 7"/>', 2.2),
        lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        tree: svg('<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5V16.5M12 11 5 16.5M12 11l7 5.5"/>'),
        save: svg('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>'),
        load: svg('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 17v3h16v-3"/>'),
        rep1: svg('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/><path d="M11 10h1.5v5"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const ilkAnlam = (s) => String(s || '').split(';')[0].trim();
    const nokta = (s) => (/[.!?…]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + '.');
    // Çeldirici, doğru cevapla ortak bir kelime taşımamalı (ör. "onları" ile "onlar").
    const kokler3 = (s) => new Set(String(s || '').toLocaleLowerCase('tr').split(/[^a-zçğıöşüâîû]+/).filter((x) => x.length > 2).map((x) => x.slice(0, 4)));
    const ayrik = (a, b) => { const x = kokler3(a); return ![...kokler3(b)].some((y) => x.has(y)); };
    const arSayi = (n) => Number(n).toLocaleString('ar-EG');
    const kokYaz = (k) => (k ? [...k].join(' ') : '');
    const turAdi = (l) => (l.tur === 'V' ? 'fiil' : l.tur === 'P' ? 'harf (edat)' : 'isim');
    const simgeHtml = (ad) => (SIMGE[ad] ? `<svg class="simge" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SIMGE[ad]}</svg>` : '');

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

    // ---------- Kıraat oynatıcısı (Suûd eş-Şüreym) ----------
    // Ayet listesini sırayla çalar; çalan ayet ve (zamanlama varsa) çalan kelime sayfada vurgulanır.
    // Anlatım başlayınca durur ('apps:ses' olayı), kıraat başlayınca anlatım durur.
    const K = { au: new Audio(), liste: [], i: 0, tekrar: false, kesit: null, aktifW: null };
    K.au.preload = 'none';
    const sesUrl = (a) => KARI.kok + a.ses;
    function kCal(liste, i) {
        K.kesit = null; K.liste = liste; K.i = i || 0;
        kYukle();
    }
    function kYukle() {
        const a = AY[K.liste[K.i]]; if (!a) return;
        K.au.src = sesUrl(a);
        kBaslat();
    }
    // Kilit ekranı / bildirim paneli oynatıcısı (../medya.js): ayet ayet önceki/sonraki
    function kMedya() {
        const k = K.liste[K.i];
        if (!window.AppsMedya || !k) return;
        const n = K.liste.length;
        window.AppsMedya.ayarla('kiraat', {
            audio: K.au,
            baslik: ayRef(k),
            sanatci: KARI.ad,
            album: n > 1 ? `Ayet Ayet Arapça · ${K.i + 1} / ${n}` : 'Ayet Ayet Arapça',
            oynat: kBaslat,
            duraklat: kDur,
            kapat: () => { kDur(); K.liste = []; kDurum(); kVurgu(); window.AppsMedya.birak('kiraat'); },
            onceki: K.i > 0 ? () => { K.i--; kYukle(); } : null,
            sonraki: K.i + 1 < n ? () => { K.i++; kYukle(); } : null
        });
    }
    function kBaslat() {
        window.dispatchEvent(new CustomEvent('apps:ses', { detail: 'kiraat' }));
        if (K.liste.length && !K.kesit) kMedya();
        const pr = K.au.play(); if (pr && pr.catch) pr.catch(() => { /* ağ hatası: error olayı */ });
        kDurum();
    }
    function kDur() { K.au.pause(); kDurum(); }
    function kesitCal(k, wi) {
        const a = AY[k]; if (!a || !a.seg || !a.seg[wi]) return false;
        K.liste = []; K.kesit = { k, wi, bas: a.seg[wi][0] / 1000, bit: a.seg[wi][1] / 1000 };
        if (window.AppsMedya) window.AppsMedya.birak('kiraat'); // tek kelime: bildirim oynatıcısı gerekmez
        const url = sesUrl(a);
        const basla = () => { K.au.currentTime = K.kesit.bas; kBaslat(); };
        if (K.au.src !== url) { K.au.src = url; K.au.addEventListener('loadedmetadata', basla, { once: true }); K.au.load(); }
        else basla();
        return true;
    }
    K.au.addEventListener('timeupdate', () => {
        if (K.kesit) { if (K.au.currentTime >= K.kesit.bit) { K.au.pause(); K.kesit = null; kDurum(); } return; }
        kVurgu();
    });
    K.au.addEventListener('ended', () => {
        if (K.kesit) { K.kesit = null; kDurum(); return; }
        if (K.tekrar) { K.au.currentTime = 0; kBaslat(); return; }
        if (K.i + 1 < K.liste.length) { K.i++; kYukle(); } else { K.liste = []; kDurum(); kVurgu(); if (window.AppsMedya) window.AppsMedya.birak('kiraat'); }
    });
    K.au.addEventListener('pause', kDurum);
    K.au.addEventListener('play', kDurum);
    K.au.addEventListener('error', () => { if (K.au.getAttribute('src')) { toast('Kıraat yüklenemedi. Bağlantını kontrol et.'); K.liste = []; kDurum(); } });
    window.addEventListener('apps:ses', (e) => { if (e.detail !== 'kiraat' && !K.au.paused) kDur(); });
    function kVurgu() {
        const k = K.liste.length && !K.au.paused ? K.liste[K.i] : null;
        app.querySelectorAll('.is-cal').forEach((el) => el.classList.remove('is-cal'));
        if (!k) return;
        app.querySelectorAll(`[data-ay="${k}"]`).forEach((el) => el.classList.add('is-cal'));
        const a = AY[k];
        if (a && a.seg) {
            const t = K.au.currentTime * 1000;
            const wi = a.seg.findIndex((s) => t >= s[0] && t < s[1]);
            if (wi >= 0) app.querySelectorAll(`[data-w="${k}:${wi + 1}"]`).forEach((el) => el.classList.add('is-cal'));
        }
        const on = app.querySelector(`.mushaf [data-ay="${k}"], .ay[data-ay="${k}"]`);
        if (on && K.aktifW !== k) { K.aktifW = k; if (!reduceMotion.matches && on.getBoundingClientRect && (on.getBoundingClientRect().top < 120 || on.getBoundingClientRect().bottom > innerHeight - 120)) on.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
    function kDurum() {
        const calan = !K.au.paused && (K.liste.length || K.kesit);
        app.querySelectorAll('[data-kiraat]').forEach((b) => {
            const hedef = b.dataset.kiraat;
            const on = calan && !K.kesit && (hedef === 'sayfa' ? K.liste.length > 1 : K.liste.length === 1 && K.liste[0] === hedef);
            b.setAttribute('aria-pressed', String(!!on));
            const ic = b.querySelector('.k-ic'); if (ic) ic.innerHTML = on ? IC.pause : IC.play;
        });
        const tb = app.querySelector('[data-k-tekrar]'); if (tb) tb.setAttribute('aria-pressed', String(K.tekrar));
        if (!calan) app.querySelectorAll('.is-cal').forEach((el) => el.classList.remove('is-cal'));
    }
    function kiraatTikla(hedef, liste) {
        const calan = !K.au.paused && !K.kesit && K.liste.length;
        const ayni = hedef === 'sayfa' ? calan && K.liste.length > 1 : calan && K.liste.length === 1 && K.liste[0] === hedef;
        if (ayni) { kDur(); return; }
        if (K.au.paused && K.liste.length && !K.kesit && (hedef === 'sayfa' ? K.liste.length > 1 : K.liste[0] === hedef)) { kBaslat(); return; }
        kCal(liste, 0);
    }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Ana', alt: 'İlerleme ve cüzler', icon: IC.home },
        { id: 'ders', href: '#/ders', ad: 'Ders', alt: 'Sıradaki sayfa', icon: IC.book },
        { id: 'tekrar', href: '#/tekrar', ad: 'Tekrar', alt: 'Aralıklı tekrar', icon: IC.repeat },
        { id: 'sozluk', href: '#/sozluk', ad: 'Sözlük', alt: 'Öğrendiklerin', icon: IC.dict },
        { id: 'dilbilgisi', href: '#/dilbilgisi', ad: 'Dil bilgisi', alt: 'Konular ve kalıplar', icon: IC.gram }
    ];
    function drawNav(active) {
        const n = IDX ? bekleyen().length : 0;
        tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}${t.id === 'tekrar' && n ? `<i class="rozet" aria-label="${n} bekleyen tekrar">${n}</i>` : ''}</span><small>${esc(t.alt)}</small></a>`).join('');
    }

    // ---------- Görünüm çubuğu ----------
    function viewbar(opts) {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        const chips = [chip('ar', 'Arapça'), chip('ok', 'Okunuş'), chip('meal', 'Meal')];
        if (opts && opts.kk) chips.push(chip('kk', 'Kelime'));
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips" style="grid-template-columns:repeat(${chips.length},minmax(0,1fr))">${chips.join('')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const apply = () => {
            app.querySelectorAll('.delils').forEach((b) => { ['ar', 'ok', 'meal', 'kk'].forEach((k) => b.classList.toggle('hide-' + k, !state.show[k])); b.dataset.ar = state.arSize; });
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            const sb = app.querySelectorAll('[data-size]');
            if (sb.length) { sb[0].disabled = state.arSize <= 0; sb[1].disabled = state.arSize >= 4; }
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            if (k !== 'kk' && state.show[k] && ['ar', 'ok', 'meal'].filter((x) => state.show[x]).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }

    // ---------- Ayet ve kelime çizimi ----------
    function kelimeSinif(w, sayfa) {
        const c = ['w'];
        if (sayfa && w.l && sayfa.kelime.includes(w.l)) c.push('is-yeni');
        else if (sayfa && w.p.some((x) => x[2] && sayfa.ogeler.includes(x[2]))) c.push('is-yapi');
        else if (w.l && bilinen(w.l)) c.push('is-bilinen');
        return c.join(' ');
    }
    function kelimeBtn(k, i, w, sayfa) {
        return `<button type="button" class="${kelimeSinif(w, sayfa)}" data-w="${k}:${i + 1}" aria-label="${esc(w.ok)}: ${esc(w.tr)}">${esc(w.ar)}</button>`;
    }
    const ayetSonu = (a) => `<span class="ay-no" aria-hidden="true">﴿${arSayi(a)}﴾</span>`;
    function besmeleHtml(s) {
        if (s === 1 || s === 9) return '';
        return `<p class="besmele" lang="ar" dir="rtl">${esc(IDX.besmele)}</p>`;
    }
    function sureBasi(s) {
        return `<div class="sure-basi"><b>${esc(sureAd(s))} Suresi</b><small>${s}. sure</small></div>${besmeleHtml(s)}`;
    }
    function mealHtml(k) {
        const a = AY[k];
        if (a.mg) return `<p class="ayet-meal is-grup">Bu ayetin meali, ${esc(ayRef(a.mg))} ayetiyle birlikte verilmiştir.</p>`;
        return `<p class="ayet-meal">${esc(a.meal)}</p>`;
    }
    function ayetKart(k, sayfa, anlatim) {
        const a = AY[k];
        const kk = `<div class="kk" dir="rtl">${a.k.map((w, i) => `<button type="button" class="kk__w ${kelimeSinif(w, sayfa).replace(/^w ?/, '')}" data-w="${k}:${i + 1}"><b lang="ar">${esc(w.ar)}</b><small class="kk__ok">${esc(w.ok)}</small><small class="kk__tr">${esc(w.tr)}</small></button>`).join('')}</div>`;
        return `<article class="ay" data-ay="${k}">
                <header class="ay__bas"><span class="ay__ref">${esc(sureAd(a.s))} · ${a.a}. ayet</span>
                    <button type="button" class="ay__cal" data-kiraat="${k}" aria-pressed="false" aria-label="${esc(ayRef(k))} ayetini ${esc(KARI.ad)} kıraatiyle dinle"><span class="k-ic">${IC.play}</span></button></header>
                <p class="ayet-ar" lang="ar" dir="rtl">${a.k.map((w, i) => kelimeBtn(k, i, w, sayfa)).join(' ')} ${ayetSonu(a.a)}</p>
                ${kk}
                <p class="ayet-ok">${esc(a.ok)}</p>
                ${mealHtml(k)}
                ${anlatim ? `<div data-anlatim="${anlatim}"></div>` : ''}
            </article>`;
    }
    // Mushaf satırları: kelimeler satır numarasına göre dizilir
    function mushafHtml(sayfa) {
        const satirlar = {};
        for (const k of sayfa.ayetler) {
            const a = AY[k];
            a.k.forEach((w, i) => {
                const html = kelimeBtn(k, i, w, sayfa).replace('class="w', `data-ay="${k}" class="w`);
                (satirlar[w.sat] ||= []).push({ html, k });
            });
            const son = a.k[a.k.length - 1].sat;
            satirlar[son].push({ html: ayetSonu(a.a), k });
        }
        let html = '', onceki = null;
        for (const n of Object.keys(satirlar).map(Number).sort((x, y) => x - y)) {
            const ilk = satirlar[n][0].k, a = AY[ilk];
            if (a.a === 1 && onceki !== ilk && a.k[0].sat === n) html += sureBasi(a.s);
            html += `<p class="satir" lang="ar" dir="rtl">${satirlar[n].map((x) => x.html).join(' ')}</p>`;
            onceki = satirlar[n][satirlar[n].length - 1].k;
        }
        return `<div class="mushaf">${html}</div>`;
    }

    // ---------- Kelime paneli ----------
    function kelimePanel(yer) {
        const [s, a, w] = yer.split(':'), k = `${s}:${a}`, ay = AY[k];
        if (!ay) return;
        const kel = ay.k[w - 1];
        const lem = kel.l && SOZ[kel.l];
        const ROL = { on: 'ön ek', gv: 'gövde', son: 'son ek' };
        const parca = kel.p.map((x) => `<li class="parca parca--${x[1]}"><b lang="ar" dir="rtl">${esc(x[0])}</b><span><small>${ROL[x[1]]}</small>${esc(x[3])}${x[2] && OGE[x[2]] ? ` · <a href="#/k/${x[2]}">${esc(OGE[x[2]].ad)}</a>` : ''}</span></li>`).join('');
        let lemHtml = '';
        if (lem) {
            const durum = lem.anlam ? '' : lem.og === 0 ? '<p class="pnote">Bu kelime ayrıca kelime olarak öğretilmez (edat, zamir, işaret ismi ya da özel isim); parçalarındaki bağlantıdan ilgili karta ulaşabilirsin.</p>' : lem.sayi < 3 ? '<p class="pnote">Bu kelime Kur\'an\'da az geçtiği için ayrıca öğretilmez; anlamı bu ayette verilmiştir.</p>' : '<p class="pnote">Bu kelime ileriki bir sayfada öğretilecek.</p>';
            lemHtml = `<h4>Sözlük biçimi</h4>
                <div class="lem"><b lang="ar" dir="rtl">${esc(lem.ar)}</b><span>${lem.anlam ? esc(lem.anlam) : esc(turAdi(lem))}</span></div>
                <p>${lem.kok ? `Kök: <a href="#/kok/${encodeURIComponent(lem.kok)}" class="kok">${esc(kokYaz(lem.kok))}</a> · ` : ''}Kur'an'da ${lem.sayi} kez geçer; ilk kez ${esc(ayRef(lem.ilk))}.</p>
                ${durum}`;
        }
        const ses = ay.seg ? `<button type="button" class="btn alt" data-kesit="${yer}">${IC.ear}${esc(KARI.ad)} kıraatinden dinle</button>` : '';
        openSheet(`<h3 id="sheetTitle" class="kel-ar" lang="ar" dir="rtl">${esc(kel.ar)}</h3>
            <p class="kel-ok">${esc(kel.ok)}</p>
            <p class="kel-tr">${esc(kel.tr)}</p>
            <p class="kel-t">${esc(kel.t)} · ${esc(ayRef(k))}, ${w}. kelime</p>
            <div class="btns">${ses}${kel.l && lem && lem.anlam ? `<a class="btn" href="#/k/${kel.l}">${IC.dict}Kelime kartı</a>` : ''}</div>
            <h4>Parçaları</h4><ul class="parcalar">${parca}</ul>
            ${lemHtml}
            <p class="kaynak-not">Kelime meali: ${kel.tk === 'd' ? 'QUL kelime meali, bu uygulamada düzeltildi' : 'QUL (quran.com) Türkçe kelime meali'}. Çözümleme: Quranic Arabic Corpus.</p>`, 'kelime');
    }
    document.addEventListener('click', (e) => {
        const ks = e.target.closest('[data-kesit]');
        if (ks) { const [s, a, w] = ks.dataset.kesit.split(':'); if (!kesitCal(`${s}:${a}`, w - 1)) toast('Bu kelimenin zamanlaması yok.'); return; }
        const kb = e.target.closest('main [data-w]');
        if (kb && !kb.closest('.quiz')) { kelimePanel(kb.dataset.w); }
    });

    // ---------- Ana ekran ----------
    function viewAna() {
        const c = copy();
        const n = tamamSayisi(), sira = siradakiSayfa();
        const bek = bekleyen().length;
        const kel = Object.keys(state.oge).filter((id) => id[0] === 'l').length, yapi = Object.keys(state.oge).length - kel;
        const devam = sira === null ? '' : sira === 0 ? `<a class="btn" href="#/s/0">${IC.go}${esc(c.start)}</a>`
            : `<a class="btn" href="#/s/${sira}">${IC.go}${esc(c.resume)}: ${sira}. sayfa</a>`;
        const cuzler = IDX.cuzler.map((cz) => {
            const ilk = cz.ilk.split(':').map(Number);
            const bitti = cz.yayinda && Array.from({ length: cz.sayfa[1] - cz.sayfa[0] + 1 }, (_, i) => cz.sayfa[0] + i).every((p) => state.tamam[p]);
            return cz.yayinda ? `<a class="cuz${bitti ? ' is-done' : ''}" href="#/c/${cz.no}"><b>${cz.no}</b><small>${esc(sureAd(ilk[0]))} ${ilk[1]}</small></a>`
                : `<span class="cuz is-soon" aria-label="${cz.no}. cüz: hazırlanıyor"><b>${cz.no}</b><small>Hazırlanıyor</small></span>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="giris"></div>
                    <div class="prog"><div class="bar hatim" role="progressbar" aria-label="Tamamlanan sayfalar" aria-valuemin="0" aria-valuemax="${TOPLAM_SAYFA}" aria-valuenow="${n}"><b style="width:${Math.max(n ? 1 : 0, pct(n, TOPLAM_SAYFA))}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="stats"><span><b>${kel}</b> kelime</span><span><b>${yapi}</b> ek, kalıp, konu</span><span><b>${bek}</b> bekleyen tekrar</span></div>
                    <div class="btns">${devam}${bek ? `<a class="btn alt" href="#/tekrar">${IC.repeat}Tekrar (${bek})</a>` : ''}</div>
                </section>
                ${BASLANGIC ? `<a class="seccard" href="#/s/0"><span class="ti">${kid() ? '🌱' : IC.book}</span><b>Başlangıç dersi</b><small>Kök ve kalıp, kelime türleri, en sık geçen on bir edat</small><span class="cnt">${state.tamam[0] ? 'Tamam' : 'Önce bunu oku'}</span></a>` : ''}
                <div class="listhead"><h2>Cüzler</h2><small>Medine mushafı · ${TOPLAM_SAYFA} sayfa</small></div>
                <div class="cuzler">${cuzler}</div>
                <p class="note"><b>Yöntem:</b> Her sayfada önce ${esc(KARI.ad)} kıraatini dinler, ayetleri kelime kelime okur, o sayfada ilk kez geçen kelime ve kuralları öğrenir, kısa bir alıştırma yaparsın. Öğrendiklerin aralıklı tekrarla (1, 3, 7, 16, 35 gün) hatırlatılır. İlerlemen yalnızca bu cihazda saklanır; <button type="button" class="linkbtn" id="yedekBtn">yedek al ya da geri yükle</button>.</p>
            </div>`;
        document.getElementById('yedekBtn').addEventListener('click', () => openSheet(yedekHtml(), 'yedek'));
        hsub.textContent = 'Ana ekran';
        document.title = 'Ayet Ayet Arapça';
        return '';
    }

    // ---------- Cüz ----------
    function viewCuz(no) {
        const cz = IDX.cuzler[no - 1];
        if (!cz || !cz.yayinda) { location.hash = '#/'; return ''; }
        const pk = PK[no];
        const sayfalar = pk.sayfalar.map((s) => `<a class="item${state.tamam[s.no] ? ' is-done' : ''}${s.no === siradakiSayfa() ? ' is-last' : ''}" href="#/s/${s.no}">
                <span class="item__no"><span>${s.no}</span>${IC.check}</span>
                <span class="item__ad">${esc(sayfaAraligi(s.no))}</span>
                <span class="item__konu">${s.kelime.length} yeni kelime${s.ogeler.length ? ` · ${s.ogeler.length} ek, kalıp ya da konu` : ''}</span>
                <span class="item__ar" lang="ar">${esc(AY[s.ayetler[0]].k[0].ar)}</span></a>`).join('');
        const top = pk.sayfalar.reduce((t, s) => t + s.kelime.length, 0), og = pk.sayfalar.reduce((t, s) => t + s.ogeler.length, 0);
        const bitti = pk.sayfalar.filter((s) => state.tamam[s.no]).length;
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Ana ekran</a><span class="pos">${bitti} / ${pk.sayfalar.length} sayfa</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? '📗 ' : ''}${no}. cüz</div>
                    <h1>${esc(ayRef(pk.sayfalar[0].ayetler[0]))} – ${esc(ayRef(pk.sayfalar[pk.sayfalar.length - 1].ayetler.slice(-1)[0]))}</h1>
                    <p class="lead">${pk.sayfalar.length} sayfa · ${top} yeni kelime · ${og} ek, kalıp ve dil bilgisi konusu</p>
                </section>
                <div class="items">${sayfalar}</div>
            </div>`;
        hsub.textContent = `${no}. cüz`;
        document.title = `${no}. cüz | Ayet Ayet Arapça`;
        return '';
    }

    // ---------- Sayfa dersi ----------
    const ADIM = [
        { id: 'dinle', ad: 'Dinle' }, { id: 'ayetler', ad: 'Ayetler' }, { id: 'yeni', ad: 'Yeni bilgiler' },
        { id: 'alistir', ad: 'Alıştır' }, { id: 'ozet', ad: 'Özet' }
    ];
    let ders = null;   // { p, adim, quiz }
    function ogeKart(id, sayfa) {
        if (id[0] === 'l') return lemmaKart(id, sayfa);
        const o = OGE[id];
        return `<section class="sc bilgi" data-tur="${o.tur}">
                <div class="tag">${kid() ? TUR_EMO[o.tur] + ' ' : ''}${esc(TUR[o.tur])}</div>
                <h2>${esc(o.ad)}</h2>
                <p class="term" lang="ar" dir="rtl">${esc(o.ar)}</p>
                <p class="bilgi__ok">${esc(o.okunus)}</p>
                <p class="lead">${esc(o.anlam)}</p>
                <p class="bilgi__acik">${esc(o.aciklama)}</p>
                ${ornekHtml(o)}
                <p class="quote bilgi__akil">${esc(o.akilda)}</p>
                <a class="more" href="#/k/${id}">Kartı aç</a>
            </section>`;
    }
    function ornekHtml(o) {
        if (!o.ornek) return '';
        const parca = o.ornek.split(':');
        const k = `${parca[0]}:${parca[1]}`, a = AY[k];
        if (!a) return '';
        const vurgu = new Set(parca[2] ? [+parca[2]] : o.kelimeler || []);
        return `<figure class="ornek"><p class="ayet-ar" lang="ar" dir="rtl">${a.k.map((w, i) => `<button type="button" class="w${vurgu.has(i + 1) ? ' is-vurgu' : ''}" data-w="${k}:${i + 1}">${esc(w.ar)}</button>`).join(' ')} ${ayetSonu(a.a)}</p>
                <figcaption>${a.mg ? '' : esc(a.meal) + ' '}<b>${esc(ayRef(k))}</b></figcaption></figure>`;
    }
    function lemmaOrnekYer(id) { const l = SOZ[id]; return l && l.ornek ? l.ornek : (LEM_YER[id] || [])[0]; }
    function lemmaKart(id, sayfa) {
        const l = SOZ[id];
        const yer = lemmaOrnekYer(id);
        const [s, a, w] = (yer || '').split(':');
        const ay = AY[`${s}:${a}`], kel = ay && ay.k[w - 1];
        return `<section class="sc bilgi" data-tur="kelime">
                <div class="tag">${kid() ? '🔤 ' : ''}Kelime · ${esc(turAdi(l))}</div>
                ${l.simge ? `<div class="simge-kutu">${simgeHtml(l.simge)}</div>` : ''}
                <p class="term" lang="ar" dir="rtl">${esc(l.ar)}</p>
                <h2>${esc(l.anlam)}</h2>
                <div class="stats">${l.kok ? `<a href="#/kok/${encodeURIComponent(l.kok)}"><span>Kök</span> <b lang="ar">${esc(kokYaz(l.kok))}</b></a>` : ''}<span>Kur'an'da <b>${l.sayi}</b> kez</span></div>
                ${l.akraba ? `<p class="akraba"><small>Türkçedeki akrabaları</small>${l.akraba.map((x) => `<span>${esc(x)}</span>`).join('')}</p>` : ''}
                ${l.not ? `<p class="bilgi__acik">${esc(l.not)}</p>` : ''}
                ${kel ? `<figure class="ornek"><p class="ayet-ar" lang="ar" dir="rtl">${ay.k.map((x, i) => `<button type="button" class="w${i + 1 === +w ? ' is-vurgu' : ''}" data-w="${s}:${a}:${i + 1}">${esc(x.ar)}</button>`).join(' ')} ${ayetSonu(+a)}</p>
                    <figcaption>Bu sayfada: <b lang="ar">${esc(kel.ar)}</b> · ${esc(kel.ok)} · ${esc(kel.tr)}</figcaption></figure>` : ''}
                <a class="more" href="#/k/${id}">Kartı aç</a>
            </section>`;
    }
    function adimNav(p, adim) {
        return `<nav class="adimlar" aria-label="Dersin adımları">${ADIM.map((a, i) => `<a href="#/s/${p}/${i + 1}"${i + 1 === adim ? ' aria-current="step"' : ''}${i + 1 < adim ? ' class="is-gecti"' : ''}><i>${i + 1}</i><span>${esc(a.ad)}</span></a>`).join('')}</nav>`;
    }
    function adimAlt(p, adim) {
        const geri = adim > 1 ? `<a class="btn alt" href="#/s/${p}/${adim - 1}">${IC.left}${esc(ADIM[adim - 2].ad)}</a>` : '';
        const ileri = adim < 5 ? `<a class="btn" href="#/s/${p}/${adim + 1}">${esc(ADIM[adim].ad)}${IC.right}</a>` : '';
        return `<div class="btns adim-alt">${geri}${ileri}</div>`;
    }
    function viewBaslangic(adim) {
        if (!BASLANGIC) { location.hash = '#/'; return ''; }
        adim = adim === 2 ? 2 : 1;
        const ogeler = BASLANGIC.ogeler;
        let govde;
        if (adim === 1) {
            govde = `<section class="sc expl"><div class="kick">Bu derste</div><p>${esc(BASLANGIC.ozet)}</p></section>
                ${ogeler.map((id) => ogeKart(id)).join('')}
                <div class="btns adim-alt"><a class="btn" href="#/s/0/2">Alıştır${IC.right}</a></div>`;
        } else govde = quizHtml('ders');
        app.innerHTML = `
            <div class="page in ders">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Ana ekran</a><span class="pos">Başlangıç</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? '🌱 ' : ''}Başlangıç dersi</div>
                    <h1>Önce temeller</h1>
                    <p class="lead">Kök ve kalıp, kelimenin türleri ve Kur'an'da en sık geçen edatlar.</p>
                    <div data-anlatim="${sayfaKaydi(0)}"></div>
                </section>
                ${govde}
            </div>`;
        if (adim === 2) quizBagla('ders');
        hsub.textContent = 'Başlangıç dersi';
        document.title = 'Başlangıç dersi | Ayet Ayet Arapça';
        return 'ders';
    }
    function viewSayfa(p, adim) {
        const s = SAYFA[p];
        if (!s) { location.hash = '#/'; return ''; }
        adim = Math.max(1, Math.min(5, adim || 1));
        if (!ders || ders.p !== p) ders = { p, quiz: null };
        if (p > state.son || adim === 1) { state.son = Math.max(state.son, p); save(); }
        const cz = sayfaCuz(p);
        let govde = '';
        if (adim === 1) {
            govde = `${viewbarSatir()}
                <div class="kiraat"><button type="button" class="btn" data-kiraat="sayfa" aria-pressed="false"><span class="k-ic">${IC.play}</span>Sayfayı dinle</button>
                    <button type="button" class="ibtn" data-k-tekrar aria-pressed="${K.tekrar}" aria-label="Ayeti tekrarla">${IC.rep1}<span class="lbl">Ayeti tekrarla</span></button>
                    <small>${esc(KARI.ad)} · ayet ayet</small></div>
                ${state.gorunum === 'satir' ? `<div class="delils">${mushafHtml(s)}</div>` : `<div class="delils mushaf mushaf--ayet">${s.ayetler.map((k) => { const a = AY[k]; return `${a.a === 1 ? sureBasi(a.s) : ''}<p class="satir" data-ay="${k}" lang="ar" dir="rtl">${a.k.map((w, i) => kelimeBtn(k, i, w, s)).join(' ')} ${ayetSonu(a.a)}</p><p class="ayet-ok">${esc(a.ok)}</p>`; }).join('')}</div>`}
                <p class="pnote"><b>İpucu:</b> Bir kelimeye dokununca anlamı, kökü ve parçaları açılır. Altı altın çizgili kelimeler bu sayfada öğretilecek.</p>`;
        } else if (adim === 2) {
            govde = `${viewbar({ kk: true })}<div class="ayetler delils">${s.ayetler.map((k) => (AY[k].a === 1 ? sureBasi(AY[k].s) : '') + ayetKart(k, s, `${sayfaKaydi(p)}#${k}`)).join('')}</div>`;
        } else if (adim === 3) {
            const ids = [...s.kelime, ...s.ogeler];
            govde = ids.length ? `<p class="pnote">Bu sayfada ilk kez geçen ${s.kelime.length} kelime${s.ogeler.length ? ` ve ${s.ogeler.length} ek, kalıp ya da dil bilgisi konusu` : ''}. Sözcüklerin altındaki ayete dokunarak kelimeyi bağlamında görebilirsin.</p>${ids.map((id) => ogeKart(id, s)).join('')}`
                : '<p class="pnote">Bu sayfada yeni öge yok; önceki sayfalarda öğrendiklerini bu ayetlerde yeniden görüyorsun.</p>';
        } else if (adim === 4) {
            govde = quizHtml('ders');
        } else {
            const kel = new Set(), bil = new Set();
            for (const k of s.ayetler) for (const w of AY[k].k) if (w.l) { kel.add(w.l); if (bilinen(w.l) || s.kelime.includes(w.l)) bil.add(w.l); }
            const kap = pct(bil.size, kel.size);
            govde = `<section class="sc expl"><div class="kick">Bu sayfa ne anlatıyor?</div><p>${esc(s.ozet)}</p></section>
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(s.akilda)}</p></section>
                <section class="sc"><div class="kick">Kapsama</div><p class="score">%${kap}</p><p class="lead">Bu sayfadaki ${kel.size} farklı kelimenin ${bil.size} tanesini tanıyorsun ya da bu derste öğrendin.</p>
                    <div class="btns">${state.tamam[p] ? `<span class="btn" aria-disabled="true">${IC.check}Tamamlandı</span>` : `<button type="button" class="btn" id="tamamBtn">${IC.check}Sayfayı tamamladım</button>`}${SAYFA[p + 1] ? `<a class="btn alt" href="#/s/${p + 1}">${p + 1}. sayfa${IC.right}</a>` : ''}</div></section>
                <p class="srccard src"><b>Kaynak:</b> Arapça metin Tanzil (Simple), meal Diyanet İşleri Başkanlığı. Özet bu uygulama için Diyanet mealine dayanılarak yazılmıştır.</p>`;
        }
        app.innerHTML = `
            <div class="page in ders">
                <div class="crumbs"><a class="nb" href="#/c/${cz}">${IC.left}${cz}. cüz</a><span class="pos">Sayfa ${p} / ${TOPLAM_SAYFA}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? '📖 ' : ''}${p}. sayfa · ${cz}. cüz</div>
                    <h1>${esc(sayfaAraligi(p))}</h1>
                    <div data-anlatim="${sayfaKaydi(p)}"></div>
                </section>
                ${adimNav(p, adim)}
                ${govde}
                ${adim !== 4 ? adimAlt(p, adim) : ''}
            </div>`;
        if (adim === 1 || adim === 2) {
            bindView();
            app.querySelectorAll('[data-kiraat]').forEach((b) => b.addEventListener('click', () => kiraatTikla(b.dataset.kiraat, b.dataset.kiraat === 'sayfa' ? s.ayetler : [b.dataset.kiraat])));
            const tb = app.querySelector('[data-k-tekrar]'); if (tb) tb.addEventListener('click', () => { K.tekrar = !K.tekrar; kDurum(); toast(K.tekrar ? 'Çalan ayet tekrarlanacak.' : 'Ayetler sırayla çalınacak.'); });
            app.querySelectorAll('[data-gorunum]').forEach((b) => b.addEventListener('click', () => { state.gorunum = b.dataset.gorunum; save(); render(false); }));
            kDurum(); kVurgu();
        }
        if (adim === 4) quizBagla('ders');
        const tb = document.getElementById('tamamBtn');
        if (tb) tb.addEventListener('click', () => sayfaBitir(p, tb));
        hsub.textContent = `${p}. sayfa · ${ADIM[adim - 1].ad}`;
        document.title = `${p}. sayfa: ${sayfaAraligi(p)} | Ayet Ayet Arapça`;
        return 'ders';
    }
    function viewbarSatir() {
        return `<div class="viewbar" role="group" aria-label="Görünüm">
                <div class="chips" style="grid-template-columns:repeat(3,minmax(0,1fr))">
                    <button type="button" class="chip" data-show="ok" aria-pressed="${state.show.ok}"><i aria-hidden="true"></i>Okunuş</button>
                    <button type="button" class="chip" data-gorunum="ayet" aria-pressed="${state.gorunum === 'ayet'}"><i aria-hidden="true"></i>Ayet ayet</button>
                    <button type="button" class="chip" data-gorunum="satir" aria-pressed="${state.gorunum === 'satir'}"><i aria-hidden="true"></i>Satır satır</button>
                </div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function sayfaBitir(p, el) {
        const ids = p === 0 ? BASLANGIC.ogeler : [...SAYFA[p].kelime, ...SAYFA[p].ogeler];
        ids.forEach(ekle);
        state.tamam[p] = Date.now();
        save();
        burst(el);
        toast(p === 0 ? 'Başlangıç dersi tamamlandı.' : `${p}. sayfa tamamlandı. ${ids.length} öge tekrar listene eklendi.`);
        if (!state.yedekUyari && tamamSayisi() >= 3) { state.yedekUyari = true; save(); setTimeout(() => openSheet(yedekHtml(true), 'yedek'), 900); }
        render(false);
    }

    // ---------- Alıştırma ----------
    let quiz = null;   // { tur: 'ders' | 'tekrar', sorular, i, puan, cevap, anahtar }
    function lemmaSecenek(id, n) {
        const havuz = shuffle(Object.keys(SOZ).filter((x) => x !== id && SOZ[x].anlam && ayrik(ilkAnlam(SOZ[x].anlam), ilkAnlam(SOZ[id].anlam))));
        return havuz.slice(0, n);
    }
    function soruUret(id) {
        if (id[0] === 'l') {
            const l = SOZ[id]; if (!l || !l.anlam) return null;
            const yer = lemmaOrnekYer(id); const [s, a, w] = (yer || '').split(':'); const ay = AY[`${s}:${a}`];
            const tipler = ['anlam', 'anlam'];
            if (ay) tipler.push('bul');
            if (l.kok) tipler.push('kok');
            if (ay && ay.seg && !kid()) tipler.push('dinle');
            const tip = tipler[Math.floor(Math.random() * tipler.length)];
            if (tip === 'anlam') {
                const sec = shuffle([id, ...lemmaSecenek(id, 3)]);
                return { id, tip, ust: 'Kelimenin anlamı', soru: `<p class="q-ar" lang="ar" dir="rtl">${esc(ay ? ay.k[w - 1].ar : l.ar)}</p>${ay ? `<p class="quiz__ref">${esc(ayRef(`${s}:${a}`))} · sözlük biçimi <span lang="ar">${esc(l.ar)}</span></p>` : ''}`, secenek: sec.map((x) => ({ v: x, h: esc(ilkAnlam(SOZ[x].anlam)) })), dogru: id, acik: `${l.ar}: ${l.anlam}` };
            }
            if (tip === 'bul') {
                const dogruW = `${s}:${a}:${w}`;
                return { id, tip, ust: 'Ayette bul', soru: `<p class="quiz__q">“${esc(ilkAnlam(l.anlam))}” anlamındaki kelimeye dokun.</p><p class="quiz__ref">${esc(ayRef(`${s}:${a}`))}</p>`, ayet: `${s}:${a}`, secenek: ay.k.map((x, i) => ({ v: `${s}:${a}:${i + 1}`, h: esc(x.ar), lem: x.l })), dogru: dogruW, dogruLem: id, acik: `${ay.k[w - 1].ar}: ${ay.k[w - 1].tr}` };
            }
            if (tip === 'kok') {
                const kokler = shuffle([...new Set(Object.values(SOZ).map((x) => x.kok).filter((x) => x && x !== l.kok))]).slice(0, 3);
                return { id, tip, ust: 'Kökü bul', soru: `<p class="q-ar" lang="ar" dir="rtl">${esc(ay ? ay.k[w - 1].ar : l.ar)}</p><p class="quiz__ref">${esc(ilkAnlam(l.anlam))}</p>`, secenek: shuffle([l.kok, ...kokler]).map((x) => ({ v: x, h: `<span lang="ar" dir="rtl" class="q-kok">${esc(kokYaz(x))}</span>` })), dogru: l.kok, acik: `Kök: ${kokYaz(l.kok)}` };
            }
            const digerler = shuffle(ay.k.map((x, i) => i).filter((i) => i !== w - 1 && ay.k[i].ar !== ay.k[w - 1].ar)).slice(0, 3);
            return { id, tip: 'dinle', ust: 'Dinle ve seç', soru: `<p class="quiz__q">Kâriden dinlediğin kelime hangisi?</p><div class="btns"><button type="button" class="btn alt" data-kesit="${s}:${a}:${w}">${IC.ear}Dinle</button></div>`, secenek: shuffle([w - 1, ...digerler]).map((i) => ({ v: `${s}:${a}:${i + 1}`, h: `<span lang="ar" dir="rtl" class="q-kok">${esc(ay.k[i].ar)}</span>` })), dogru: `${s}:${a}:${w}`, acik: `${ay.k[w - 1].ar}: ${ay.k[w - 1].tr}`, otoDinle: `${s}:${a}:${w}` };
        }
        const o = OGE[id]; if (!o) return null;
        const ayni = shuffle(Object.keys(OGE).filter((x) => x !== id && ayrik(OGE[x].anlam, o.anlam) && (OGE[x].tur === o.tur || ['ek', 'edat'].includes(o.tur) === ['ek', 'edat'].includes(OGE[x].tur)))).slice(0, 3);
        const soru = ['dilbilgisi', 'deyim'].includes(o.tur) ? `<p class="quiz__q">${esc(o.ad)}</p><p class="q-ar sm" lang="ar" dir="rtl">${esc(o.ar)}</p>` : `<p class="q-ar" lang="ar" dir="rtl">${esc(o.ar)}</p><p class="quiz__ref">${esc(TUR[o.tur])} · ${esc(o.okunus)}</p>`;
        return { id, tip: 'oge', ust: o.tur === 'dilbilgisi' ? 'Ne anlatır?' : 'Anlamı ne?', soru, secenek: shuffle([id, ...ayni]).map((x) => ({ v: x, h: esc(OGE[x].anlam) })), dogru: id, acik: `${o.ad}: ${o.akilda}` };
    }
    function quizKur(tur) {
        let ids;
        if (tur === 'tekrar') ids = shuffle(bekleyen()).slice(0, state.gunluk);
        else {
            const p = ders ? ders.p : 0;
            const yeni = p === 0 && location.hash.startsWith('#/s/0') ? BASLANGIC.ogeler : SAYFA[p] ? [...SAYFA[p].kelime, ...SAYFA[p].ogeler] : [];
            const n = copy().soruSay;
            ids = [...shuffle(yeni).slice(0, n), ...shuffle(bekleyen().filter((x) => !yeni.includes(x))).slice(0, 2)];
        }
        const sorular = ids.map(soruUret).filter(Boolean);
        quiz = { tur, sorular, i: 0, puan: 0, cevap: null, anahtar: location.hash };
    }
    function quizHtml(tur) {
        if (!quiz || quiz.tur !== tur || quiz.anahtar !== location.hash) quizKur(tur);
        const c = copy(), t = quiz.sorular.length;
        if (!t) return `<section class="sc"><div class="kick">${tur === 'tekrar' ? 'Tekrar' : 'Alıştırma'}</div><p class="lead">${esc(tur === 'tekrar' ? c.bitti : 'Bu sayfada alıştırılacak öge yok.')}</p>${tur === 'ders' ? '' : `<div class="btns">${siradakiSayfa() !== null ? `<a class="btn" href="#/ders">${IC.book}Derse devam</a>` : ''}</div>`}</section>${tur === 'ders' ? dersQuizSonrasi() : ''}`;
        if (quiz.i >= t) {
            return `<section class="sc quiz"><div class="kick">${kid() ? '🏁 ' : ''}Sonuç</div><p class="score">${quiz.puan}<small> / ${t}</small></p><p class="lead">${esc(c.result(quiz.puan, t))}</p>
                <div class="btns"><button type="button" class="btn alt" id="quizYeni">${IC.restart}Yeniden</button>${tur === 'tekrar' && bekleyen().length ? `<button type="button" class="btn" id="quizDevam">${IC.repeat}Devam (${bekleyen().length})</button>` : ''}</div></section>${tur === 'ders' ? dersQuizSonrasi() : ''}`;
        }
        const q = quiz.sorular[quiz.i], ans = quiz.cevap;
        const dogruMu = (v) => v === q.dogru || (q.dogruLem && q.secenek.find((x) => x.v === v && x.lem === q.dogruLem));
        const ok = ans !== null && dogruMu(ans);
        const secenek = q.tip === 'bul'
            ? `<p class="ayet-ar q-ayet" lang="ar" dir="rtl" role="group" aria-label="Ayetin kelimeleri">${q.secenek.map((x) => { let cls = 'w'; if (ans !== null) cls += dogruMu(x.v) ? ' is-right' : x.v === ans ? ' is-wrong' : ''; return `<button type="button" class="${cls}" data-ans="${x.v}"${ans !== null ? ' disabled' : ''}>${x.h}</button>`; }).join(' ')}</p>`
            : `<div class="opts" role="group" aria-label="Seçenekler">${q.secenek.map((x) => { let cls = 'opt2'; if (ans !== null) cls += dogruMu(x.v) ? ' is-right' : x.v === ans ? ' is-wrong' : ' is-dim'; return `<button type="button" class="${cls}" data-ans="${esc(x.v)}"${ans !== null ? ' disabled' : ''}>${x.h}</button>`; }).join('')}</div>`;
        return `<section class="sc quiz">
                <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${t} · ${quiz.puan} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, t)}%"></b></div></div>
                <p class="quiz__ask">${esc(q.ust)}</p>
                ${q.soru}
                ${secenek}
                ${ans !== null ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> ${esc(nokta(q.acik))} <a href="#/k/${q.id}">Kartı aç</a></div>
                    <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < t ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
            </section>`;
    }
    function dersQuizSonrasi() {
        const p = ders ? ders.p : 0;
        if (location.hash.startsWith('#/s/0')) return `<div class="btns adim-alt"><a class="btn alt" href="#/s/0/1">${IC.left}Ders</a>${state.tamam[0] ? `<a class="btn" href="#/s/${siradakiSayfa() || 1}">${IC.go}İlk sayfaya geç</a>` : '<button type="button" class="btn" id="basBitir">' + IC.check + 'Başlangıç dersini tamamladım</button>'}</div>`;
        return `<div class="btns adim-alt"><a class="btn alt" href="#/s/${p}/3">${IC.left}Yeni bilgiler</a><a class="btn" href="#/s/${p}/5">Özet${IC.right}</a></div>`;
    }
    function quizBagla(tur) {
        const q = quiz && quiz.sorular[quiz.i];
        app.querySelectorAll('[data-ans]').forEach((btn) => btn.addEventListener('click', () => {
            if (quiz.cevap !== null) return;
            quiz.cevap = btn.dataset.ans;
            const ok = quiz.cevap === q.dogru || (q.dogruLem && q.secenek.find((x) => x.v === quiz.cevap && x.lem === q.dogruLem));
            if (ok) quiz.puan++;
            if (state.oge[q.id] && (tur === 'tekrar' || state.oge[q.id].s <= bugun())) cevapla(q.id, !!ok);
            render(false);
            const nb = document.getElementById('nextQ'); if (nb) nb.focus({ preventScroll: true });
            if (ok) burst(app.querySelector('.is-right')); else if (navigator.vibrate) navigator.vibrate(40);
        }));
        const nb = document.getElementById('nextQ');
        if (nb) nb.addEventListener('click', () => { quiz.i++; quiz.cevap = null; render(false); app.querySelector('.quiz') && app.querySelector('.quiz').scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' }); });
        const yb = document.getElementById('quizYeni'); if (yb) yb.addEventListener('click', () => { quiz = null; render(false); });
        const db = document.getElementById('quizDevam'); if (db) db.addEventListener('click', () => { quiz = null; render(false); });
        const bb = document.getElementById('basBitir'); if (bb) bb.addEventListener('click', () => sayfaBitir(0, bb));
        if (q && q.otoDinle && quiz.cevap === null) setTimeout(() => { const [s, a, w] = q.otoDinle.split(':'); kesitCal(`${s}:${a}`, w - 1); }, 350);
    }
    function viewTekrar() {
        app.innerHTML = `<div class="page in">
                <section class="sc hero"><div class="kick">${kid() ? '🔁 ' : ''}Aralıklı tekrar</div><h1>Tekrar</h1>
                    <p class="lead">Zamanı gelen kelime ve kurallar. Doğru bildiğin öge daha uzun aralıkla (1, 3, 7, 16, 35 gün), yanlış bildiğin ertesi gün yeniden sorulur.</p>
                    <div class="stats"><span><b>${bekleyen().length}</b> bekleyen</span><span><b>${Object.keys(state.oge).length}</b> öğrenilen</span><span>Günlük en çok <b>${state.gunluk}</b></span></div></section>
                ${quizHtml('tekrar')}
            </div>`;
        quizBagla('tekrar');
        hsub.textContent = 'Tekrar';
        document.title = 'Tekrar | Ayet Ayet Arapça';
        return 'tekrar';
    }

    // ---------- Kartlar ----------
    function viewKart(id) {
        let html = '', baslik = '';
        const durum = state.oge[id] ? `<p class="kutu" aria-label="Tekrar kutusu ${state.oge[id].k} / 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= state.oge[id].k ? 'is-on' : ''}"></i>`).join('')}<small>${state.oge[id].d} doğru · ${state.oge[id].y} yanlış</small></p>` : '<p class="kutu"><small>Henüz tekrar listende değil; dersini tamamlayınca eklenir.</small></p>';
        if (id[0] === 'l' && SOZ[id]) {
            const l = SOZ[id]; baslik = l.ar;
            const sinir = enUzak() || 1;
            const yerler = (LEM_YER[id] || []).filter((y) => SAYFA_OF(y) <= Math.max(sinir, l.ders || 0)).slice(0, 5);
            html = `<section class="sc hero">
                    <div class="kick">${kid() ? '🔤 ' : ''}Kelime · ${esc(turAdi(l))}</div>
                    ${l.simge ? `<div class="simge-kutu">${simgeHtml(l.simge)}</div>` : ''}
                    <p class="term" lang="ar" dir="rtl">${esc(l.ar)}</p>
                    <h1>${esc(l.anlam || '—')}</h1>
                    <div class="stats">${l.kok ? `<a href="#/kok/${encodeURIComponent(l.kok)}"><span>Kök</span> <b lang="ar">${esc(kokYaz(l.kok))}</b></a>` : ''}<span>Kur'an'da <b>${l.sayi}</b> kez</span><span>İlk: <b>${esc(ayRef(l.ilk))}</b></span>${l.ders ? `<a href="#/s/${l.ders}/3"><span>Ders</span> <b>${l.ders}. sayfa</b></a>` : ''}</div>
                    ${durum}
                </section>
                ${l.akraba ? `<section class="sc"><div class="kick">Türkçedeki akrabaları</div><p class="akraba">${l.akraba.map((x) => `<span>${esc(x)}</span>`).join('')}</p><p class="pnote">Aynı Arapça kökten gelip Türkçede kullandığımız kelimeler.</p></section>` : ''}
                ${l.not ? `<section class="sc expl"><div class="kick">Not</div><p>${esc(l.not)}</p></section>` : ''}
                ${yerler.length ? `<h2 class="secttl">Okuduğun ayetlerde</h2><div class="ayetler">${yerler.map((y) => { const [s, a, w] = y.split(':'); const ay = AY[`${s}:${a}`]; return `<figure class="ornek"><p class="ayet-ar" lang="ar" dir="rtl">${ay.k.map((x, i) => `<button type="button" class="w${i + 1 === +w ? ' is-vurgu' : ''}" data-w="${s}:${a}:${i + 1}">${esc(x.ar)}</button>`).join(' ')} ${ayetSonu(+a)}</p><figcaption><b lang="ar">${esc(ay.k[w - 1].ar)}</b> · ${esc(ay.k[w - 1].tr)} · <a href="#/s/${SAYFA_OF(y)}/2">${esc(ayRef(`${s}:${a}`))}</a></figcaption></figure>`; }).join('')}</div>` : ''}
                <p class="srccard src"><b>Kaynak:</b> ${esc(KAYNAK.lugat || '')} Çözümleme ve sıklık: Quranic Arabic Corpus.</p>`;
        } else if (OGE[id]) {
            const o = OGE[id]; baslik = o.ad;
            html = `<section class="sc hero">
                    <div class="kick">${kid() ? TUR_EMO[o.tur] + ' ' : ''}${esc(TUR[o.tur])}</div>
                    <h1>${esc(o.ad)}</h1>
                    <p class="term" lang="ar" dir="rtl">${esc(o.ar)}</p>
                    <p class="bilgi__ok">${esc(o.okunus)}</p>
                    <p class="lead">${esc(o.anlam)}</p>
                    ${o.ders !== undefined ? `<div class="stats"><a href="${o.ders ? `#/s/${o.ders}/3` : '#/s/0'}"><span>Ders</span> <b>${o.ders ? o.ders + '. sayfa' : 'Başlangıç'}</b></a></div>` : ''}
                    ${durum}
                </section>
                <section class="sc expl"><div class="kick">Açıklama</div><p>${esc(o.aciklama)}</p></section>
                ${o.ornek ? `<h2 class="secttl">Örnek</h2>${ornekHtml(o)}` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(o.akilda)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> ${esc(KAYNAK[o.kaynak] || '')}</p>`;
        } else { location.hash = '#/sozluk'; return ''; }
        app.innerHTML = `<div class="page in"><div class="crumbs"><button type="button" class="nb" id="geriBtn">${IC.left}Geri</button></div>${html}</div>`;
        document.getElementById('geriBtn').addEventListener('click', () => (history.length > 1 ? history.back() : (location.hash = '#/sozluk')));
        hsub.textContent = baslik;
        document.title = `${baslik} | Ayet Ayet Arapça`;
        return id[0] === 'l' ? 'sozluk' : 'dilbilgisi';
    }
    function SAYFA_OF(yer) { const [s, a] = yer.split(':'); const k = `${s}:${a}`; for (const sf of Object.values(SAYFA)) if (sf.ayetler.includes(k)) return sf.no; return 0; }
    function viewKok(kok) {
        const liste = Object.entries(SOZ).filter(([, l]) => l.kok === kok).sort((x, y) => x[1].ilkSayfa - y[1].ilkSayfa);
        const sinir = enUzak();
        app.innerHTML = `<div class="page in">
                <div class="crumbs"><button type="button" class="nb" id="geriBtn">${IC.left}Geri</button></div>
                <section class="sc hero"><div class="kick">${kid() ? '🌳 ' : ''}Kök ağacı</div>
                    <p class="term kok-buyuk" lang="ar" dir="rtl">${esc(kokYaz(kok))}</p>
                    <p class="lead">Bu kökten türeyen ve yayındaki sayfalarda geçen ${liste.length} kelime. Kökü tanırsan ailesindeki kelimeleri tahmin edebilirsin.</p></section>
                <div class="items">${liste.map(([id, l]) => `<a class="item${bilinen(id) ? ' is-done' : ''}" href="#/k/${id}">
                    <span class="item__no">${IC.tree}</span>
                    <span class="item__ad">${l.anlam ? esc(ilkAnlam(l.anlam)) : l.ilkSayfa > sinir ? 'İleride öğreneceksin' : esc(turAdi(l))}</span>
                    <span class="item__konu">${esc(turAdi(l))} · Kur'an'da ${l.sayi} kez · ilk ${l.ilkSayfa}. sayfa</span>
                    <span class="item__ar" lang="ar">${esc(l.ar)}</span></a>`).join('')}</div>
            </div>`;
        document.getElementById('geriBtn').addEventListener('click', () => (history.length > 1 ? history.back() : (location.hash = '#/sozluk')));
        hsub.textContent = 'Kök: ' + kokYaz(kok);
        document.title = `${kokYaz(kok)} kökü | Ayet Ayet Arapça`;
        return 'sozluk';
    }

    // ---------- Sözlük ----------
    let sozlukFiltre = { q: '', tur: 'hepsi' };
    function viewSozluk() {
        const ids = Object.keys(state.oge).filter((id) => SOZ[id] || OGE[id]);
        const turu = (id) => (id[0] === 'l' ? 'kelime' : OGE[id].tur);
        const sat = (id) => {
            const l = SOZ[id], o = OGE[id], k = state.oge[id];
            const ar = l ? l.ar : o.ar, ad = l ? l.anlam : `${o.ad}: ${o.anlam}`;
            return `<a class="item" href="#/k/${id}" data-ara="${esc((ad + ' ' + (o ? o.okunus : '') + ' ' + ar).toLocaleLowerCase('tr'))}" data-tur="${turu(id)}">
                <span class="item__no kutu-no" aria-label="Kutu ${k.k}">${k.k}</span>
                <span class="item__ad">${esc(l ? ilkAnlam(l.anlam) : o.ad)}</span>
                <span class="item__konu">${esc(TUR[turu(id)])}${l ? (l.kok ? ' · kök ' + esc(kokYaz(l.kok)) : '') + ` · Kur'an'da ${l.sayi} kez` : ' · ' + esc(o.anlam)}</span>
                <span class="item__ar" lang="ar">${esc(ar)}</span></a>`;
        };
        const turler = ['hepsi', 'kelime', 'edat', 'ek', 'kalip', 'deyim', 'dilbilgisi'];
        app.innerHTML = `<div class="page in">
                <section class="sc hero"><div class="kick">${kid() ? '📚 ' : ''}Sözlüğüm</div><h1>Öğrendiklerin</h1>
                    <p class="lead">${ids.length ? `${ids.length} öge. Rakam, ögenin tekrar kutusudur: 5. kutudaki öge kalıcı olarak öğrenilmiş sayılır.` : 'Bir sayfanın dersini tamamladığında öğrendiğin kelime ve kurallar burada listelenir.'}</p></section>
                ${ids.length ? `<div class="ara"><input type="search" id="araKutu" placeholder="Ara: anlam, okunuş ya da Arapça" aria-label="Sözlükte ara" value="${esc(sozlukFiltre.q)}">
                    <div class="yerler" role="group" aria-label="Türe göre">${turler.map((t) => `<button type="button" data-tf="${t}" aria-pressed="${sozlukFiltre.tur === t}">${t === 'hepsi' ? 'Hepsi' : esc(TUR[t])}</button>`).join('')}</div></div>
                <div class="items" id="sozlukListe">${ids.sort((a, b) => (state.oge[a].k - state.oge[b].k)).map(sat).join('')}</div><p class="pnote" id="sozlukBos" hidden>Aramaya uyan öge yok.</p>` : `<div class="btns"><a class="btn" href="#/ders">${IC.book}Derse başla</a></div>`}
            </div>`;
        const uygula = () => {
            const q = sozlukFiltre.q.toLocaleLowerCase('tr').trim();
            let n = 0;
            app.querySelectorAll('#sozlukListe .item').forEach((el) => { const g = (!q || el.dataset.ara.includes(q)) && (sozlukFiltre.tur === 'hepsi' || el.dataset.tur === sozlukFiltre.tur); el.hidden = !g; if (g) n++; });
            const b = document.getElementById('sozlukBos'); if (b) b.hidden = n > 0;
            app.querySelectorAll('[data-tf]').forEach((b2) => b2.setAttribute('aria-pressed', String(b2.dataset.tf === sozlukFiltre.tur)));
        };
        const ak = document.getElementById('araKutu');
        if (ak) { ak.addEventListener('input', () => { sozlukFiltre.q = ak.value; uygula(); }); uygula(); }
        app.querySelectorAll('[data-tf]').forEach((b) => b.addEventListener('click', () => { sozlukFiltre.tur = b.dataset.tf; uygula(); }));
        hsub.textContent = 'Sözlüğüm';
        document.title = 'Sözlüğüm | Ayet Ayet Arapça';
        return 'sozluk';
    }

    // ---------- Dil bilgisi defteri ----------
    function viewDilbilgisi() {
        const sinir = enUzak();
        const gruplar = ['dilbilgisi', 'kalip', 'ek', 'edat', 'deyim'];
        const ogeler = Object.entries(OGE).sort((x, y) => x[1].ders - y[1].ders);
        const html = gruplar.map((g) => {
            const l = ogeler.filter(([, o]) => o.tur === g);
            if (!l.length) return '';
            return `<div class="listhead"><h2>${kid() ? TUR_EMO[g] + ' ' : ''}${esc(TUR[g])}</h2><small>${l.length}</small></div><div class="items">${l.map(([id, o]) => {
                const acik = o.ders === 0 || o.ders <= sinir;
                return acik ? `<a class="item${bilinen(id) ? ' is-done' : ''}" href="#/k/${id}"><span class="item__no"><span>${o.ders || '•'}</span>${IC.check}</span><span class="item__ad">${esc(o.ad)}</span><span class="item__konu">${esc(o.anlam)}</span><span class="item__ar" lang="ar">${esc(o.ar.split('·')[0].trim())}</span></a>`
                    : `<div class="item is-kilit" aria-label="${esc(o.ad)}: ${o.ders}. sayfada açılır"><span class="item__no">${IC.lock}</span><span class="item__ad">${esc(o.ad)}</span><span class="item__konu">${o.ders}. sayfada açılır</span></div>`;
            }).join('')}</div>`;
        }).join('');
        app.innerHTML = `<div class="page in">
                <section class="sc hero"><div class="kick">${kid() ? '📐 ' : ''}Dil bilgisi defteri</div><h1>Konular ve kalıplar</h1>
                    <p class="lead">Her konu, Kur'an'da ilk açık örneğinin geçtiği sayfada açılır. Örnekler hep okuduğun ayetlerden seçilir.</p></section>
                ${html}
            </div>`;
        hsub.textContent = 'Dil bilgisi';
        document.title = 'Dil bilgisi | Ayet Ayet Arapça';
        return 'dilbilgisi';
    }

    // ---------- Yedek ----------
    function yedekHtml(ilk) {
        return `<h3 id="sheetTitle">İlerlemeni yedekle</h3>
            ${ilk ? '<p>Güzel gidiyorsun. İlerlemen yalnızca bu cihazda, tarayıcının belleğinde saklanıyor. Tarayıcı verilerini silersen ya da telefon değiştirirsen kaybolur.</p>' : '<p>İlerlemen (tamamlanan sayfalar ve tekrar kutuları) yalnızca bu cihazda saklanır. Yedek dosyası alıp başka bir cihaza yükleyebilirsin.</p>'}
            <div class="btns"><button type="button" class="btn" id="disaAktar">${IC.save}Yedek dosyası indir</button><label class="btn alt" for="iceAktar">${IC.load}Yedekten yükle</label><input type="file" id="iceAktar" accept="application/json,.json" hidden></div>
            <h4>Günlük tekrar sınırı</h4><div class="yerler" role="group" aria-label="Günlük tekrar sınırı">${[10, 20, 40].map((n) => `<button type="button" data-gunluk="${n}" aria-pressed="${state.gunluk === n}">${n}</button>`).join('')}</div>`;
    }
    sheetBody.addEventListener('click', (e) => {
        const d = e.target.closest('#disaAktar');
        if (d) {
            const blob = new Blob([JSON.stringify({ uygulama: 'arapca', surum: 1, tarih: new Date().toISOString(), durum: state }, null, 1)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ayet-ayet-arapca-yedek-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
            return;
        }
        const g = e.target.closest('[data-gunluk]');
        if (g) { state.gunluk = +g.dataset.gunluk; save(); sheetBody.querySelectorAll('[data-gunluk]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.gunluk === state.gunluk))); }
    });
    sheetBody.addEventListener('change', (e) => {
        if (e.target.id !== 'iceAktar' || !e.target.files[0]) return;
        e.target.files[0].text().then((t) => {
            const j = JSON.parse(t);
            if (j.uygulama !== 'arapca' || !j.durum || typeof j.durum.oge !== 'object') throw new Error();
            if (!confirm('Bu cihazdaki ilerleme, yedekteki ilerlemeyle değiştirilecek. Devam edilsin mi?')) return;
            Object.assign(state, j.durum); save(); closeSheet(); toast('Yedek yüklendi.'); render(false);
        }).catch(() => toast('Bu dosya bir Ayet Ayet Arapça yedeği değil.'));
    });

    // ---------- Alt panel ve görünüm ----------
    let sheetReturn = null;
    function openSheet(html, kind) { sheetReturn = document.activeElement; sheetBody.innerHTML = html; sheetBg.dataset.kind = kind || ''; sheetBg.classList.remove('out'); sheetBg.classList.add('on'); document.getElementById('sheetX').focus(); }
    function closeSheet() {
        if (!sheetBg.classList.contains('on')) return;
        const done = () => { sheetBg.classList.remove('on', 'out'); sheetBg.dataset.kind = ''; if (sheetReturn && sheetReturn.focus && document.contains(sheetReturn)) sheetReturn.focus({ preventScroll: true }); };
        if (reduceMotion.matches) { done(); return; }
        sheetBg.classList.add('out'); setTimeout(done, 220);
    }
    document.getElementById('sheetX').addEventListener('click', closeSheet);
    sheetBg.addEventListener('click', (e) => { if (e.target === sheetBg) closeSheet(); else if (e.target.closest('#sheetBody a[href^="#"]')) closeSheet(); });
    document.addEventListener('keydown', (e) => {
        if (!sheetBg.classList.contains('on')) return;
        if (e.key === 'Escape') { closeSheet(); return; }
        if (e.key === 'Tab') {
            const f = Array.from(sheetBg.querySelectorAll('button, a[href], label[for], input:not([hidden])')).filter((x) => !x.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    function infoHtml() {
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Uygulamadaki her bilginin nereden geldiği aşağıda yazılıdır. Makineden gelen veri ile bu uygulama için yazılan açıklamalar ayrı tutulur.</p>
            <ul>
                <li><b>Kur'an metni:</b> Tanzil Quran Text (Simple), tanzil.net — değiştirilmeden.</li>
                <li><b>Meal:</b> Diyanet İşleri Başkanlığı Kur'an-ı Kerim Meali (Tanzil, tr.diyanet).</li>
                <li><b>Kıraat:</b> ${esc(KARI.ad)}, ayet ayet kayıtlar ve kelime zamanlaması: quran.com (Quranic Universal Library). Ses dosyaları quran.com sunucusundan çalınır.</li>
                <li><b>Kelime çözümlemesi:</b> kök, sözlük biçimi, tür, ekler ve i'râb etiketleri Quranic Arabic Corpus v0.4 (corpus.quran.com, GNU GPL), furqan.co düzeltmeleriyle.</li>
                <li><b>Kelime meali ve sayfa düzeni:</b> Türkçe kelime meali, transliterasyon, sayfa ve satır bilgisi quran.com / Quranic Universal Library (qul.tarteel.ai). Kelime meali yer yer bu uygulamada düzeltilmiştir; düzeltilen kelimeler kelime panelinde belirtilir.</li>
                <li><b>Okunuş:</b> quran.com transliterasyonundan kural tabanlı olarak Türkçe harflere çevrilmiştir. Yaklaşıktır; doğru okuyuş için kıraati dinleyin.</li>
                <li><b>Kelime anlamları:</b> ${esc(KAYNAK.lugat || '')}</li>
                <li><b>Dil bilgisi ve kalıplar:</b> ${esc(KAYNAK.gramer || '')}</li>
                <li><b>Sayfa özetleri:</b> bu uygulama için Diyanet mealine dayanılarak yazılmıştır.</li>
            </ul>
            <h4>Sesli anlatım</h4>
            <p>Türkçe anlatım bu uygulama için yazılmış metinden, yerel bir ses modeliyle (erkek sesi) üretilmiştir. Arapça kelimeler anlatımda okunmaz; Arapçanın sesi yalnızca kâri kaydından gelir.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Biz onu, anlayasınız diye Arapça bir Kur'an olarak indirdik.” (Yûsuf 2)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır. Bu uygulamanın sesli anlatımı her iki temada da aynıdır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; daha kısa alıştırmalar.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    function setTheme(t, o) { if (t === root.dataset.theme) return; store(THEME_KEY, t); withReveal(o, () => { root.setAttribute('data-theme', t); quiz = null; render(false); lookSync(); }); }
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
    // #/ · #/ders · #/c/<cüz> · #/s/<sayfa>[/<adım>] · #/a/<sure>/<ayet> · #/k/<öge> · #/kok/<kök> · #/tekrar · #/sozluk · #/dilbilgisi
    let lastHash = null;
    function render(animate) {
        if (!IDX) return;
        const h = location.hash.replace(/^#\/?/, '');
        const ms = h.match(/^s\/(\d+)(?:\/(\d))?$/), mc = h.match(/^c\/(\d+)$/), mk = h.match(/^k\/([\w-]+)$/), mr = h.match(/^kok\/(.+)$/), ma = h.match(/^a\/(\d+)\/(\d+)$/);
        let active;
        if (h === 'ders') { const p = siradakiSayfa(); location.replace(p === null ? '#/' : `#/s/${p}`); return; }
        if (ms) active = +ms[1] === 0 ? viewBaslangic(+ms[2] || 1) : viewSayfa(+ms[1], +ms[2] || 1);
        else if (mc) active = viewCuz(+mc[1]);
        else if (mk) active = viewKart(mk[1]);
        else if (mr) active = viewKok(decodeURIComponent(mr[1]));
        else if (ma) { const k = `${ma[1]}:${ma[2]}`; const p = SAYFA_OF(k); location.replace(p ? `#/s/${p}/2` : '#/'); return; }
        else if (h === 'tekrar') active = viewTekrar();
        else if (h === 'sozluk') active = viewSozluk();
        else if (h === 'dilbilgisi') active = viewDilbilgisi();
        else active = viewAna();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && !/^s\//.test(h) && !K.au.paused && !K.kesit) kDur();
        if (changed) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);

    // ---------- Başlangıç ----------
    app.innerHTML = '<div class="page"><section class="sc"><p class="lead">Ders paketleri yükleniyor…</p></section></div>';
    fetch('veri/indeks.json').then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((j) => { IDX = j; return Promise.all(yayinda().map((c) => paketYukle(c.no))); })
        .then(() => { route(); paint(); })
        .catch(() => { app.innerHTML = '<div class="page"><section class="sc"><div class="kick">Bağlantı</div><p class="lead">Ders paketleri yüklenemedi. İnternet bağlantını kontrol edip sayfayı yenile.</p><div class="btns"><button type="button" class="btn" onclick="location.reload()">Yenile</button></div></section></div>'; });
})();
