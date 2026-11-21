// ============================================
// Ezberler — uygulama mantığı
// İçerik: data.js (window.EZBER_DATA)
// Kıraat: audio/manifest.json içinde listelenen yerel dosyalar; yoksa uzak kaynak.
// Anlatım metinleri tools/ezberler-anlatim.json içinde tutulur; metin gösterilmez;
// kayıtları (anlatim/<profil>/) ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Tema (apps:tema) ve renk (theme) anahtarları bütün uygulamalarla ortaktır.
// ============================================
(function () {
    'use strict';

    const DATA = window.EZBER_DATA;
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const playerEl = document.getElementById('player');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---------- İçerik dizini ----------
    const SECTIONS = DATA.bolumler;
    const ALL = [];
    const BY_ID = {};
    SECTIONS.forEach((sec) => sec.ogeler.forEach((o, i) => {
        o._sec = sec; o._i = i;
        ALL.push(o); BY_ID[o.id] = o;
    }));

    // ---------- Kalıcı durum (bu uygulamaya özel) ----------
    const KEY = 'ezberler:v1';
    const state = { done: {}, show: { ar: true, tr: true, meal: true }, arSize: 2, repeat: 'off', last: null };
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (saved.done && typeof saved.done === 'object') state.done = saved.done;
        state.show = Object.assign(state.show, saved.show || {});
        if (Number.isInteger(saved.arSize)) state.arSize = Math.max(0, Math.min(4, saved.arSize));
        if (['off', 'ayet', 'sure'].includes(saved.repeat)) state.repeat = saved.repeat;
        if (saved.last && BY_ID[saved.last]) state.last = saved.last;
    } catch (e) { /* depolama kapalıysa varsayılanlarla devam */ }
    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ }
    }
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';

    // ---------- Temaya göre metinler (içerik aynı, ton farklı) ----------
    const COPY = {
        yetiskin: {
            kick: 'Bismillâh',
            title: 'Ezber<em>ler</em>',
            lead: 'Kısa sureler, namaz duaları ve zikirler; Arapçası, okunuşu, anlamı ve kısa tefsiriyle.',
            progress: (n, t) => n === 0 ? `${t} ezberden henüz hiçbiri tamamlanmadı.` : n === t ? 'Bütün ezberler tamamlandı. Allah kabul etsin.' : `${t} ezberden ${n} tanesi tamamlandı.`,
            resume: 'Devam et', start: 'Fâtiha ile başla', all: 'Bütün sureler',
            mark: 'Ezberledim', marked: 'Ezberlendi',
            markHint: 'İşaretlediklerin yalnızca bu cihazda saklanır.',
            toastDone: (ad) => `${ad} ezberlendi olarak işaretlendi.`,
            toastUndone: (ad) => `${ad} için işaret kaldırıldı.`,
            counterDone: 'Tamamlandı',
            secDone: (n, t) => `${t} ezberden ${n} tanesi tamamlandı`
        },
        cocuk: {
            kick: 'Hoş geldin',
            title: '<span class="emo">⭐</span> Bugün ne <em>ezberleyelim?</em>',
            lead: 'Dinle, tekrar et, yıldızını topla. Her ezber bir yıldız!',
            progress: (n, t) => n === 0 ? `${t} yıldız seni bekliyor.` : n === t ? 'Bütün yıldızları topladın! 🎉' : `${n} yıldız topladın, ${t - n} yıldız kaldı.`,
            resume: 'Devam et', start: 'Fâtiha ile başla', all: 'Bütün sureler',
            mark: 'Ezberledim! ⭐', marked: 'Ezberimde ⭐',
            markHint: 'Ezberleyince yıldızını al.',
            toastDone: (ad) => `Harikasın! ${ad} artık ezberinde. 🌟`,
            toastUndone: (ad) => `${ad} yıldızı geri bırakıldı.`,
            counterDone: 'Aferin, bitti! 🎉',
            secDone: (n, t) => n === t ? 'Hepsini topladın! 🎉' : `${n} yıldız topladın, ${t - n} yıldız kaldı`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    // ---------- Yardımcılar ----------
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>'),
        book: svg('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
        moon: svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M19 3v4M21 5h-4"/>'),
        beads: svg('<circle cx="12" cy="10" r="6.5" stroke-width="2.8" stroke-dasharray="0 3.4"/><path d="M12 16.5v4.5M10.2 21h3.6"/>'),
        check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.4),
        star: '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.6 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z"/></svg>',
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        right: svg('<path d="M9 5l7 7-7 7"/>', 2),
        play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 8 5.2z"/></svg>',
        pause: '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/></svg>',
        prev: svg('<path d="M19 20 9 12l10-8v16z"/><path d="M5 19V5"/>'),
        next: svg('<path d="M5 4l10 8-10 8V4z"/><path d="M19 5v14"/>'),
        repeat: svg('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2)
    };
    const EQ = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';
    const SEC_ICON = { sureler: ['book', '📖'], dualar: ['moon', '🤲'], zikirler: ['beads', '📿'] };
    const secIcon = (id) => { const s = SEC_ICON[id] || ['book', '📖']; return kid() ? `<span class="emo" aria-hidden="true">${s[1]}</span>` : IC[s[0]]; };
    const SHORT = { sureler: 'Sureler', dualar: 'Dualar', zikirler: 'Zikirler' };
    const doneCount = (list) => list.filter((o) => state.done[o.id]).length;
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);

    let toastTimer = null;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
    }
    function burst(fromEl) {
        if (!kid() || reduceMotion.matches) return;
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

    // ---------- Gezinme çubuğu ----------
    function drawNav(active) {
        const tabs = [{ id: '', href: '#/', ad: 'Giriş', alt: 'İlerleme ve bölümler', icon: IC.home, count: '' }]
            .concat(SECTIONS.map((s) => ({ id: s.id, href: '#/' + s.id, ad: SHORT[s.id] || s.ad, alt: s.aciklama, icon: IC[(SEC_ICON[s.id] || ['book'])[0]], count: `${doneCount(s.ogeler)}/${s.ogeler.length}` })));
        tabbar.innerHTML = tabs.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small>${t.count ? `<b aria-label="${esc(t.count.replace('/', ' / '))} ezberlendi">${t.count}</b>` : ''}</a>`).join('');
    }

    // ---------- Kıraat oynatıcısı ----------
    const REMOTE = [
        'https://everyayah.com/data/' + DATA.kari.klasor + '/',
        'https://verses.quran.com/Shuraym/mp3/'
    ];
    const local = new Set();
    fetch('audio/manifest.json', { cache: 'no-cache' })
        .then((r) => (r.ok ? r.json() : null))
        .then((m) => { if (m && Array.isArray(m.files)) m.files.forEach((f) => local.add(f)); })
        .catch(() => { /* manifest yoksa uzak kaynak kullanılır */ });

    const audio = new Audio();
    audio.preload = 'auto';
    const P = { item: null, tracks: [], idx: -1, playing: false, srcTry: 0, error: '' };

    function sources(code) {
        const list = REMOTE.map((base) => base + code + '.mp3');
        if (local.has(code)) list.unshift('audio/' + code + '.mp3');
        return list;
    }
    function tracksFor(item) {
        if (item.tur === 'sure') {
            const t = item.satirlar.map((s, i) => ({ code: s.ses, row: i, label: `Ayet ${i + 1} / ${item.satirlar.length}` }));
            if (item.no !== 1) t.unshift({ code: '001001', row: 'b', label: 'Besmele' });
            return t;
        }
        if (item.ses) return [{ code: item.ses, row: null, label: item.ad }];
        return [];
    }
    function load(idx, autoplay) {
        P.idx = idx; P.srcTry = 0; P.error = '';
        audio.src = sources(P.tracks[idx].code)[0];
        if (autoplay) play();
        markActive(true);
        syncPlayer();
        medya();
    }
    // Kilit ekranı / bildirim paneli oynatıcısı (../medya.js): ayet ayet önceki/sonraki
    function medya() {
        const t = P.idx >= 0 ? P.tracks[P.idx] : null;
        if (!window.AppsMedya || !t || !P.item) return;
        const single = P.tracks.length === 1;
        window.AppsMedya.ayarla('kiraat', {
            audio,
            baslik: single ? P.item.ad : `${P.item.ad} · ${t.label}`,
            sanatci: DATA.kari.ad,
            album: 'Ezberler · kıraat',
            oynat: play,
            duraklat: () => audio.pause(),
            kapat: () => { stopAudio(); syncPlayer(); },
            onceki: P.idx > 0 ? () => step(-1) : null,
            sonraki: P.idx < P.tracks.length - 1 ? () => step(1) : null
        });
    }
    function play() {
        const pr = audio.play();
        if (pr && pr.catch) pr.catch(() => { /* hata olayı ayrıca işlenir */ });
    }
    function toggle() {
        if (!P.tracks.length) return;
        if (P.idx < 0) { load(0, true); return; }
        if (P.error) { load(P.idx, true); return; }
        if (audio.paused) play(); else audio.pause();
    }
    function step(d) {
        const n = P.idx + d;
        if (n < 0 || n >= P.tracks.length) return;
        load(n, true);
    }
    function stopAudio() {
        audio.pause(); audio.removeAttribute('src'); audio.load();
        P.idx = -1; P.playing = false; P.error = '';
        markActive(false);
        if (window.AppsMedya) window.AppsMedya.birak('kiraat');
    }
    audio.addEventListener('play', () => { P.playing = true; syncPlayer(); window.dispatchEvent(new CustomEvent('apps:ses', { detail: 'kiraat' })); medya(); });
    // Sesli anlatım (../anlatim.js) başlayınca kıraat durur; ikisi aynı anda çalmaz.
    window.addEventListener('apps:ses', (e) => { if (e.detail !== 'kiraat' && P.idx >= 0) { stopAudio(); syncPlayer(); } });
    audio.addEventListener('pause', () => { P.playing = false; syncPlayer(); });
    audio.addEventListener('timeupdate', () => {
        const bar = playerEl.querySelector('.pline b');
        if (bar && audio.duration) bar.style.width = (100 * audio.currentTime / audio.duration) + '%';
    });
    audio.addEventListener('ended', () => {
        if (state.repeat === 'ayet') { audio.currentTime = 0; play(); return; }
        if (P.idx + 1 < P.tracks.length) { load(P.idx + 1, true); return; }
        if (state.repeat === 'sure') { load(0, true); return; }
        P.idx = -1; P.playing = false;
        markActive(false); syncPlayer();
        if (window.AppsMedya) window.AppsMedya.birak('kiraat');
    });
    audio.addEventListener('error', () => {
        if (P.idx < 0 || !audio.getAttribute('src')) return;
        const list = sources(P.tracks[P.idx].code);
        P.srcTry += 1;
        if (P.srcTry < list.length) { audio.src = list[P.srcTry]; play(); return; }
        P.playing = false;
        P.error = 'Ses yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.';
        syncPlayer();
    });

    function markActive(scroll) {
        app.querySelectorAll('.row.is-active').forEach((r) => r.classList.remove('is-active'));
        if (P.idx < 0) return;
        const t = P.tracks[P.idx];
        if (t.row == null) return;
        const el = app.querySelector(`.row[data-row="${t.row}"]`);
        if (!el) return;
        el.classList.add('is-active');
        if (scroll) {
            const r = el.getBoundingClientRect();
            if (r.top < 150 || r.bottom > window.innerHeight - 170) {
                el.scrollIntoView({ block: 'center', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
            }
        }
    }

    const REPEAT = { off: 'Tekrar kapalı', ayet: 'Ayeti tekrarla', sure: 'Sureyi tekrarla' };
    const repeatMode = () => (P.tracks.length === 1 && state.repeat === 'ayet' ? 'sure' : state.repeat);
    function buildPlayer() {
        const show = !!(P.item && P.tracks.length);
        playerEl.hidden = !show;
        document.body.classList.toggle('has-player', show);
        if (!show) { playerEl.innerHTML = ''; return; }
        const single = P.tracks.length === 1;
        playerEl.innerHTML = `
            <div class="player__in" role="region" aria-label="Kıraat: ${esc(DATA.kari.ad)}">
                <button type="button" class="pp" data-p="toggle" aria-label="Dinle">${IC.play}${IC.pause}</button>
                <div class="pmid">
                    <div class="ptitle">${EQ}<span></span></div>
                    <div class="pline"><b></b></div>
                    <div class="psub" aria-live="polite"></div>
                </div>
                ${single ? '' : `<button type="button" class="pbtn step" data-p="prev" aria-label="Önceki ayet">${IC.prev}</button><button type="button" class="pbtn step" data-p="next" aria-label="Sonraki ayet">${IC.next}</button>`}
                <button type="button" class="pbtn rep" data-p="repeat">${IC.repeat}<span></span></button>
            </div>`;
        syncPlayer();
    }
    function syncPlayer() {
        if (playerEl.hidden || !P.item) return;
        const t = P.idx >= 0 ? P.tracks[P.idx] : null;
        const single = P.tracks.length === 1;
        playerEl.dataset.state = P.error ? 'error' : P.playing ? 'playing' : 'idle';
        playerEl.classList.toggle('is-playing', P.playing);
        app.querySelector('.rows')?.classList.toggle('is-playing', P.playing);
        const pp = playerEl.querySelector('.pp');
        pp.setAttribute('aria-label', P.playing ? 'Duraklat' : P.error ? 'Yeniden dene' : 'Dinle');
        playerEl.querySelector('.ptitle span:last-child').textContent = t ? t.label : (single ? P.item.ad : 'Sureyi baştan dinle');
        playerEl.querySelector('.psub').textContent = P.error || `${P.item.ad} · ${DATA.kari.ad}`;
        if (P.idx < 0) playerEl.querySelector('.pline b').style.width = '0';
        const prev = playerEl.querySelector('[data-p="prev"]'), next = playerEl.querySelector('[data-p="next"]');
        if (prev) prev.disabled = P.idx <= 0;
        if (next) next.disabled = P.idx >= P.tracks.length - 1;
        const rep = playerEl.querySelector('.rep'), mode = repeatMode();
        rep.dataset.mode = mode;
        rep.setAttribute('aria-label', 'Tekrar modu: ' + REPEAT[mode]);
        rep.querySelector('span').textContent = single ? 'Tekrarla' : (mode === 'ayet' ? 'Ayet' : 'Sure');
    }
    playerEl.addEventListener('click', (e) => {
        const b = e.target.closest('[data-p]');
        if (!b || b.disabled) return;
        const a = b.dataset.p;
        if (a === 'toggle') toggle();
        else if (a === 'prev') step(-1);
        else if (a === 'next') step(1);
        else if (a === 'repeat') {
            const single = P.tracks.length === 1;
            const order = single ? ['off', 'sure'] : ['off', 'ayet', 'sure'];
            state.repeat = order[(order.indexOf(repeatMode()) + 1) % order.length];
            save(); syncPlayer();
            toast(single ? (state.repeat === 'off' ? 'Tekrar kapalı' : 'Bitince yeniden başlar') : REPEAT[state.repeat]);
        }
    });

    // ---------- Giriş ----------
    function viewHome() {
        const c = copy();
        const n = doneCount(ALL), total = ALL.length;
        const last = state.last && BY_ID[state.last];
        const target = last || ALL[0];
        const marks = SECTIONS.map((s) => `<span>${s.ogeler.map((o) => `<i class="${state.done[o.id] ? 'is-done' : ''}" title="${esc(o.ad)}"></i>`).join('')}</span>`).join('');
        const secs = SECTIONS.map((s) => {
            const d = doneCount(s.ogeler);
            return `<a class="seccard" href="#/${s.id}">
                <span class="ti">${secIcon(s.id)}</span>
                <b>${esc(s.ad)}</b>
                <small>${esc(s.aciklama)}</small>
                <span class="cnt">${d} / ${s.ogeler.length}</span>
            </a>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam"></div>
                    <div class="prog">
                        <div class="prog__num" aria-hidden="true">${n}<small> / ${total}</small></div>
                        <div class="bar" role="progressbar" aria-label="Ezber ilerlemesi" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><b style="width:${pct(n, total)}%"></b></div>
                        <p class="prog__txt">${esc(c.progress(n, total))}</p>
                        <div class="marks" aria-hidden="true">${marks}</div>
                    </div>
                    <div class="btns">
                        <a class="btn" href="#/o/${target.id}">${IC.go}${last ? esc(c.resume + ': ' + last.ad) : esc(c.start)}</a>
                        <a class="btn alt" href="#/sureler">${secIcon('sureler')}${esc(c.all)}</a>
                    </div>
                </section>
                <div class="secs">${secs}</div>
            </div>`;
        hsub.textContent = 'Giriş';
        document.title = 'Ezberler | Sureler, Namaz Duaları ve Zikirler';
        return '';
    }

    // ---------- Bölüm ----------
    function viewSection(sec) {
        const c = copy();
        const d = doneCount(sec.ogeler), t = sec.ogeler.length;
        const items = sec.ogeler.map((o, i) => {
            const done = !!state.done[o.id];
            const meta = o.tur === 'sure' ? `${o.ayetSayisi} ayet` : (o.sayac ? 'Sayaçlı' : '');
            return `<li><a class="item${done ? ' is-done' : ''}${state.last === o.id ? ' is-last' : ''}" href="#/o/${o.id}">
                <span class="item__no" aria-hidden="true"><span>${o.tur === 'sure' ? o.no : i + 1}</span>${kid() ? IC.star : IC.check}</span>
                <span class="item__ad">${esc(o.ad)}${done ? '<span class="sr"> (ezberlendi)</span>' : ''}</span>
                <span class="item__konu">${esc(o.konu)}</span>
                ${o.arAd || meta ? `<span class="item__ar"${o.arAd ? ' lang="ar"' : ''}>${o.arAd ? esc(o.arAd) : ''}${meta ? `<span class="item__meta">${esc(meta)}</span>` : ''}</span>` : ''}
            </a></li>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? secIcon(sec.id) + ' ' : ''}${t} ezber</div>
                    <h1>${esc(sec.ad)}</h1>
                    <p class="lead">${esc(sec.aciklama)}</p>
                    <div class="prog">
                        <div class="bar" role="progressbar" aria-label="${esc(sec.ad)} ilerlemesi" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${d}"><b style="width:${pct(d, t)}%"></b></div>
                        <p class="prog__txt">${esc(c.secDone(d, t))}</p>
                    </div>
                </section>
                <ol class="items">${items}</ol>
            </div>`;
        hsub.textContent = sec.ad;
        document.title = sec.ad + ' | Ezberler';
        return sec.id;
    }

    // ---------- Ezber sayfası ----------
    const counters = {};
    function viewItem(o) {
        const c = copy();
        const sec = o._sec;
        state.last = o.id; save();

        if (P.item !== o) { stopAudio(); P.item = o; P.tracks = tracksFor(o); }
        const playable = P.tracks.some((t) => t.row != null);
        const prev = sec.ogeler[o._i - 1], next = sec.ogeler[o._i + 1];
        const done = !!state.done[o.id];
        const sure = o.tur === 'sure';

        const kick = sure ? `${o.no}. sure` : o.tur === 'dua' ? 'Namaz duası' : 'Zikir';
        const sub = sure
            ? `Kur'an'ın ${o.no}. suresi. ${o.yer}'de inmiştir, ${o.ayetSayisi} ayettir. Adı “${o.anlam}” anlamına gelir.`
            : o.nezaman;

        const rowAttrs = (i, label) => (playable ? ` tabindex="0" role="button" aria-label="${esc(label)}"` : '');
        const b = DATA.besmele;
        const besmele = sure && o.no !== 1 ? `
            <li class="row is-besmele${playable ? ' is-playable' : ''}" data-row="b"${rowAttrs('b', 'Besmeleyi dinle')}>
                <span class="row__no">${EQ}Besmele</span>
                <p class="row__ar" lang="ar">${esc(b.ar)}</p>
                <p class="row__tr">${esc(b.tr)}</p>
                <p class="row__meal">${esc(b.meal)}</p>
            </li>` : '';
        const rows = o.satirlar.map((s, i) => `
            <li class="row${playable ? ' is-playable' : ''}" data-row="${i}"${rowAttrs(i, `${i + 1}. ayeti dinle`)}>
                ${sure ? `<span class="row__no">${EQ}Ayet ${i + 1}</span>` : ''}
                <p class="row__ar" lang="ar">${esc(s.ar)}</p>
                <p class="row__tr">${esc(s.tr)}</p>
                <p class="row__meal">${esc(s.meal)}</p>
            </li>`).join('');
        const chip = (k, label) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${label}</button>`;

        app.innerHTML = `
            <div class="page in">
                <div class="crumbs">
                    <a class="nb" href="#/${sec.id}">${IC.left}${esc(sec.ad)}</a>
                    <span class="pos">${o._i + 1} / ${sec.ogeler.length}</span>
                </div>
                <section class="sc hero">
                    <div class="kick">${esc(kick)}</div>
                    <h1>${esc(o.ad)}</h1>
                    ${o.arAd ? `<p class="head__ar" lang="ar">${esc(o.arAd)}</p>` : ''}
                    <p class="lead">${esc(sub)}</p>
                    <div data-anlatim="${o.id}"></div>
                    ${o.not ? `<p class="note"><b>Not:</b> ${esc(o.not)}</p>` : ''}
                </section>
                <div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                    <div class="chips">${chip('ar', 'Arapça')}${chip('tr', 'Okunuş')}${chip('meal', 'Anlam')}</div>
                    <div class="size" role="group" aria-label="Arapça yazı boyutu">
                        <button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button>
                        <button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button>
                    </div>
                </div>
                <ol class="rows" data-ar="${state.arSize}">${besmele}${rows}</ol>
                ${o.sayac ? '<section class="sc counter" id="counter" aria-label="Zikir sayacı"></section>' : ''}
                <section class="sc expl">
                    <div class="kick">${sure ? 'Kısa tefsir' : 'Kısa açıklama'}</div>
                    <p>${esc(o.tefsir)}</p>
                </section>
                <section class="sc memo">
                    <div class="kick">Akılda kalsın</div>
                    <p class="quote">${esc(o.akilda)}</p>
                </section>
                <p class="srccard src"><b>Kaynak:</b> ${esc(o.kaynak)}</p>
                <div class="done">
                    <button type="button" class="btn" id="done" aria-pressed="${done}">${kid() ? IC.star : IC.check}<span>${esc(done ? c.marked : c.mark)}</span></button>
                    <small>${esc(c.markHint)}</small>
                </div>
                <nav class="pager" aria-label="Önceki ve sonraki ezber">
                    ${prev ? `<a href="#/o/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/o/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;

        const rowsEl = app.querySelector('.rows');
        const applyShow = () => {
            ['ar', 'tr', 'meal'].forEach((k) => rowsEl.classList.toggle('hide-' + k, !state.show[k]));
            app.querySelectorAll('[data-show]').forEach((b2) => b2.setAttribute('aria-pressed', String(state.show[b2.dataset.show])));
            const sizeBtns = app.querySelectorAll('[data-size]');
            sizeBtns[0].disabled = state.arSize <= 0 || !state.show.ar;
            sizeBtns[1].disabled = state.arSize >= 4 || !state.show.ar;
            rowsEl.dataset.ar = state.arSize;
        };
        applyShow();
        app.querySelectorAll('[data-show]').forEach((b2) => b2.addEventListener('click', () => {
            const k = b2.dataset.show;
            const on = Object.keys(state.show).filter((x) => state.show[x]);
            if (state.show[k] && on.length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); applyShow();
        }));
        app.querySelectorAll('[data-size]').forEach((b2) => b2.addEventListener('click', () => {
            state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b2.dataset.size))); save(); applyShow();
        }));

        if (playable) {
            const playRow = (el) => {
                const idx = P.tracks.findIndex((t) => String(t.row) === el.dataset.row);
                if (idx < 0) return;
                if (idx === P.idx) toggle(); else load(idx, true);
            };
            rowsEl.addEventListener('click', (e) => { const el = e.target.closest('.row'); if (el) playRow(el); });
            rowsEl.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                const el = e.target.closest('.row'); if (!el) return;
                e.preventDefault(); playRow(el);
            });
        }

        const doneBtn = document.getElementById('done');
        doneBtn.addEventListener('click', () => {
            const now = !state.done[o.id];
            if (now) state.done[o.id] = true; else delete state.done[o.id];
            save();
            doneBtn.setAttribute('aria-pressed', String(now));
            doneBtn.querySelector('span').textContent = now ? copy().marked : copy().mark;
            toast(now ? copy().toastDone(o.ad) : copy().toastUndone(o.ad));
            if (now) burst(doneBtn);
            drawNav(sec.id);
        });

        if (o.sayac) drawCounter(o);
        buildPlayer();
        markActive(false);
        hsub.textContent = o.ad;
        document.title = o.ad + ' | Ezberler';
        return sec.id;
    }

    function drawCounter(o) {
        const el = document.getElementById('counter');
        if (!el) return;
        const st = counters[o.id] || (counters[o.id] = { step: 0, counts: o.sayac.map(() => 0) });
        const cur = o.sayac[st.step];
        const n = st.counts[st.step];
        const full = n >= cur.hedef;
        el.innerHTML = `
            <div class="kick">Sayaç</div>
            <button type="button" class="counter__btn${full ? ' is-full' : ''}" id="tap" style="--p:${pct(n, cur.hedef)}" aria-label="${esc(cur.ad)}: ${n} / ${cur.hedef}. Saymak için dokun.">
                <b>${n}</b><small>/ ${cur.hedef}</small>
            </button>
            <h3>${esc(full ? copy().counterDone : cur.ad)}</h3>
            ${o.sayac.length > 1 ? `<div class="counter__steps">${o.sayac.map((s, i) => `<button type="button" data-step="${i}" aria-pressed="${i === st.step}" class="${st.counts[i] >= s.hedef ? 'is-done' : ''}">${esc(s.ad)}</button>`).join('')}</div>` : ''}
            <button type="button" class="linkbtn" id="reset">Sıfırla</button>`;
        el.querySelector('#tap').addEventListener('click', (e) => {
            if (st.counts[st.step] >= cur.hedef) {
                if (st.step + 1 < o.sayac.length) { st.step += 1; drawCounter(o); document.getElementById('tap').focus(); }
                return;
            }
            st.counts[st.step] += 1;
            if (st.counts[st.step] >= cur.hedef) {
                if (navigator.vibrate) navigator.vibrate(st.step + 1 < o.sayac.length ? 60 : [60, 60, 120]);
                burst(e.currentTarget);
            } else if (navigator.vibrate) navigator.vibrate(8);
            drawCounter(o);
            const tap = document.getElementById('tap'); if (tap) tap.focus();
        });
        el.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => { st.step = Number(b.dataset.step); drawCounter(o); }));
        el.querySelector('#reset').addEventListener('click', () => { st.step = 0; st.counts = o.sayac.map(() => 0); drawCounter(o); });
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
        if (e.key === 'Tab') { // odak panelin içinde kalsın
            const f = Array.from(sheetBg.querySelectorAll('button, a[href]')).filter((x) => !x.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    function infoHtml() {
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Dinî içerikte doğruluk esastır. Her ezberin altında kaynağı ayrıca belirtilmiştir.</p>
            <ul>
                <li><b>Kur'an metni:</b> Tanzil Quran Text (tanzil.net); metin değiştirilmeden kullanılmıştır.</li>
                <li><b>Kıraat:</b> ${esc(DATA.kari.ad)}. Ayet ayet kayıtlar EveryAyah.com arşivinden alınır.</li>
                <li><b>Anlamlar:</b> sade bir dille yazılmıştır; Diyanet İşleri Başkanlığı meali esas alınmıştır.</li>
                <li><b>Kısa tefsirler:</b> Kur'an Yolu Tefsiri (Diyanet İşleri Başkanlığı), Elmalılı M. Hamdi Yazır'ın Hak Dini Kur'an Dili ve İbn Kesîr tefsiri esas alınarak özetlenmiştir.</li>
                <li><b>Dua ve zikirler:</b> Diyanet İlmihali ve her duanın altında belirtilen hadis kaynakları.</li>
            </ul>
            <h4>Mezhep</h4>
            <p>Namaz duaları Hanefî mezhebindeki uygulamaya göre sıralanmıştır. Diğer mezheplerdeki farklar için bir hocanıza ya da Diyanet İşleri Başkanlığı'nın ilmihal kaynaklarına başvurabilirsiniz.</p>
            <h4>Okunuşlar</h4>
            <p>Türkçe harflerle yazılan okunuşlar yalnızca yardımcıdır; Arapça harfleri tam karşılamaz. Doğru telaffuz için kıraati dinleyerek ve bir hocadan öğrenerek ezberlemek en iyisidir.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">Allah ezberlerimizi kalıcı kılsın.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4>
            <div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her ezberde cesaretlendirir.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya ve anlamaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // başka bir sekmede (ana ekran ya da öteki uygulama) seçim değişirse buraya da yansısın
    window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && (e.newValue === 'cocuk' || e.newValue === 'yetiskin') && e.newValue !== root.dataset.theme) { root.setAttribute('data-theme', e.newValue); render(false); lookSync(); paint(); }
        if (e.key === MODE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) { root.setAttribute('data-mode', e.newValue); lookSync(); paint(); }
    });

    // ---------- Yönlendirme ----------
    // #/  giriş · #/<bölüm>  liste · #/o/<id>  ezber
    let lastHash = null;
    function render(isNav) {
        const h = location.hash.replace(/^#\/?/, '');
        const m = h.match(/^o\/([\w-]+)$/);
        const sec = SECTIONS.find((s) => s.id === h);
        let active;
        if (m && BY_ID[m[1]]) {
            active = viewItem(BY_ID[m[1]]);
        } else {
            if (P.item) { stopAudio(); P.item = null; P.tracks = []; }
            buildPlayer();
            active = sec ? viewSection(sec) : viewHome();
        }
        drawNav(active);
        if (!isNav) app.querySelector('.page')?.classList.remove('in');
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
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
