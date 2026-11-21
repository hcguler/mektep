// ============================================
// Sesli anlatım oynatıcısı — apps/ altındaki çok dosyalı uygulamalar için ortak (apps/CLAUDE.md, 6. bölüm)
// --------------------------------------------
// Kayıtlar bu bilgisayarda tools/tts/seslendir.py ile üretilir ve sayfanın yanındaki anlatim/ klasöründedir:
//   anlatim/<profil>/kayitlar.json   başlık ve süre
//   anlatim/<profil>/<dosya>.mp3     tam.mp3 (bütün duraklar) ve durak başına bir kayıt
// Profil temadan gelir: yetişkin → erkek sesi (anlatim/yetiskin/), çocuk → kadın sesi (anlatim/cocuk/).
//
// Kullanım: sayfaya yer tutucu konur, oynatıcı onu kendisi doldurur (sonradan çizilen sayfalar dahil):
//   <div data-anlatim="tam giris"></div>     tam anlatım ve giriş, iki satır
//   <div data-anlatim="01-dogum"></div>      bir durak
//   <div data-anlatim="05-*"></div>          "05-" ile başlayan durak (dosya adı numarasıyla)
//   <div data-anlatim="c01/s002#2:2"></div>  bir kaydın bölümü (kayitlar.json → bolumler: { "2:2": [baş, son] })
// Kaydı olmayan satır gösterilmez. Çalan kaydın satırı sayfada yoksa altta küçük oynatıcı görünür.
// Başka bir ses (ör. Ezberler kıraati) başlayınca anlatım durur: window 'apps:ses' olayı.
// Sırayla dinle (varsayılan açık, 'apps:anlatim-sirali'): bir durak bitince kayitlar.json sırasıyla
// sıradaki durak aynı ses öğesinde hemen başlar; ekran kilitliyken de sürer. Kilit ekranı ve bildirim
// panelindeki oynatıcı (önceki/sonraki, ilerleme) ../medya.js ile kurulur; sayfa onu bu betikten önce yükler.
// Uygulama başına ayar (<html> öznitelikleri, isteğe bağlı):
//   data-anlatim-kok="/arapca-ses/"   kayıtlar başka bir klasörde / aynı kökenli başka bir sitede
//   data-anlatim-profil="yetiskin"    temadan bağımsız tek profil (ör. yalnızca yetişkin anlatımı olan uygulama)
// ============================================
(function () {
    'use strict';

    const root = document.documentElement;
    const SPEEDS = [1, 1.25, 1.5, 0.8];
    const HIZ_KEY = 'apps:anlatim-hiz', YER_KEY = 'apps:anlatim-yer', SIRA_KEY = 'apps:anlatim-sirali';
    const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
    const write = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const profil = () => root.dataset.anlatimProfil || (root.dataset.theme === 'cocuk' ? 'cocuk' : 'yetiskin');
    const KOK = (root.dataset.anlatimKok || 'anlatim/').replace(/\/?$/, '/');
    const UYG = document.title.split(/\s[|·–—-]\s/)[0].trim();
    const sesAdi = (p) => (p === 'cocuk' ? 'kadın sesi' : 'erkek sesi');
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fmt = (x) => { x = Math.max(0, Math.round(x || 0)); const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), s = String(x % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`; };
    const dk = (x) => (x >= 90 ? `${Math.round(x / 60)} dk` : fmt(x));
    const txt = (el, s) => { if (el.textContent !== s) el.textContent = s; };
    const svg = (b) => `<svg viewBox="0 0 24 24" aria-hidden="true">${b}</svg>`;
    const IC = {
        play: svg('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
        pause: svg('<path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" fill="currentColor"/>'),
        x: svg('<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
        sira: svg('<path d="M4 6h11M4 12h11M4 18h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15 15.5v5l4.5-2.5z" fill="currentColor"/>'),
        ses: svg('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')
    };

    // ---------- Kayıt listesi (profil başına bir kez) ----------
    const defter = {}, listeler = {};
    function kayitlar(p) {
        if (!defter[p]) defter[p] = fetch(`${KOK}${p}/kayitlar.json`).then((r) => (r.ok ? r.json() : null))
            .then((j) => (j && j.kayitlar) || {}).catch(() => ({})).then((l) => (listeler[p] = l));
        return defter[p];
    }
    // Sıralı çalma: tam anlatım dışındaki kayıtlar, kayitlar.json'daki sırayla (anlatım dosyasındaki durak sırası)
    const sirasi = (l) => Object.keys(l || {}).filter((k) => k !== 'tam');
    const bul = (k, liste) => {
        if (k.endsWith('*')) return Object.keys(liste).find((x) => x.startsWith(k.slice(0, -1)));
        const [a, b] = k.split('#');
        if (b) return liste[a] && liste[a].bolumler && liste[a].bolumler[b] ? k : null;
        return liste[k] ? k : null;
    };
    // Bölüm anahtarı ("kayıt#bölüm") için kaydın bilgisinden bölümün başı, sonu ve süresi
    const bilgiAl = (k, liste) => {
        const [a, b] = k.split('#');
        if (!b) return liste[k];
        const [bas, bit] = liste[a].bolumler[b];
        return { baslik: liste[a].baslik, sure: +(bit - bas).toFixed(2), bas, bit };
    };

    // ---------- Ses ----------
    const au = new Audio();
    au.preload = 'none';
    let cur = null;          // { p, k, baslik, sure, bas?, bit? } — bas/bit: bölüm çalarken kayıttaki sınırlar
    let hizI = Math.max(0, SPEEDS.indexOf(+read(HIZ_KEY, 1)));
    let hata = false, sonKayit = 0;
    let sirali = read(SIRA_KEY, '1') !== '0';
    const yerler = () => { try { return JSON.parse(read(YER_KEY, '{}')) || {}; } catch (e) { return {}; } };
    const yerAnahtar = (c) => `${location.pathname}|${c.p}|${c.k}`;
    function yerKaydet(sil) {
        if (!cur || cur.k !== 'tam') return;
        const y = yerler();
        if (sil || au.currentTime < 5) delete y[yerAnahtar(cur)]; else y[yerAnahtar(cur)] = Math.floor(au.currentTime);
        write(YER_KEY, JSON.stringify(y));
    }

    function cal(p, k, bilgi) {
        if (cur && cur.p === p && cur.k === k && !hata) {
            if (au.paused) baslat(); else au.pause();
            return;
        }
        yerKaydet();
        cur = { p, k, baslik: bilgi.baslik || '', sure: bilgi.sure || 0 };
        if (bilgi.bit) { cur.bas = +bilgi.bas; cur.bit = +bilgi.bit; }
        hata = false;
        au.src = `${KOK}${p}/${k.split('#')[0]}.mp3`;
        au.playbackRate = SPEEDS[hizI];
        const kalan = k === 'tam' ? yerler()[yerAnahtar(cur)] : cur.bas || 0;
        if (kalan && (cur.bit || kalan < cur.sure - 5)) au.addEventListener('loadedmetadata', () => { au.currentTime = kalan; }, { once: true });
        baslat();
        guncelle();
    }
    function baslat() {
        window.dispatchEvent(new CustomEvent('apps:ses', { detail: 'anlatim' }));
        medya(); // başka ses oturumu almışsa geri alır; parça değiştiyse bilgiyi yeniler
        const pr = au.play();
        if (pr && pr.catch) pr.catch(() => { /* hata olayı ayrıca işlenir */ });
    }
    function kapat() {
        yerKaydet();
        au.pause(); au.removeAttribute('src'); au.load();
        cur = null; hata = false;
        if (window.AppsMedya) window.AppsMedya.birak('anlatim');
        guncelle();
    }
    function hizDegistir() {
        hizI = (hizI + 1) % SPEEDS.length;
        au.playbackRate = SPEEDS[hizI];
        write(HIZ_KEY, String(SPEEDS[hizI]));
        guncelle();
    }
    const bolum = () => !!(cur && cur.bit);
    const sure = () => (bolum() ? cur.bit - cur.bas : isFinite(au.duration) && au.duration > 0 ? au.duration : (cur ? cur.sure : 0));
    const simdi = () => (cur ? Math.max(0, au.currentTime - (bolum() ? cur.bas : 0)) : 0);
    const git = (t) => { au.currentTime = (bolum() ? cur.bas : 0) + Math.max(0, Math.min(sure() - 0.2, t)); };
    function atla(sn) { if (cur && isFinite(au.duration)) git(simdi() + sn); }
    // Çalan kaydın sıradaki yeri: tam anlatım ve bölüm (kayıt#bölüm) sıraya girmez.
    function sira() {
        if (!cur || cur.k === 'tam' || cur.k.includes('#')) return null;
        const l = listeler[cur.p], s = sirasi(l), i = s.indexOf(cur.k);
        return i < 0 || s.length < 2 ? null : { s, i, l };
    }
    function komsu(d) {
        const q = sira(), n = q && q.s[q.i + d];
        if (n) cal(cur.p, n, bilgiAl(n, q.l));
    }
    function siraDegistir() {
        sirali = !sirali;
        write(SIRA_KEY, sirali ? '1' : '0');
        guncelle();
    }

    au.addEventListener('play', guncelle);
    au.addEventListener('pause', () => { yerKaydet(); guncelle(); });
    au.addEventListener('waiting', guncelle);
    au.addEventListener('playing', guncelle);
    au.addEventListener('timeupdate', () => {
        if (bolum() && au.currentTime >= cur.bit) { au.pause(); au.currentTime = cur.bas; guncelle(); return; }
        tik();
        if (Date.now() - sonKayit > 5000) { sonKayit = Date.now(); yerKaydet(); }
    });
    au.addEventListener('ended', () => {
        yerKaydet(true);
        // Sıradaki durak bekletmeden aynı öğede başlar (setTimeout yok: kilitli ekranda iOS engeller).
        const q = sirali && sira(), n = q && q.s[q.i + 1];
        if (n) { cal(cur.p, n, bilgiAl(n, q.l)); return; }
        au.currentTime = 0; guncelle();
    });
    au.addEventListener('error', () => { if (cur && au.getAttribute('src')) { hata = true; guncelle(); } });
    window.addEventListener('apps:ses', (e) => { if (e.detail !== 'anlatim' && cur) kapat(); });
    window.addEventListener('pagehide', () => yerKaydet());

    // Kilit ekranı / bildirim paneli oynatıcısı (../medya.js)
    function medya() {
        if (!window.AppsMedya || !cur) return;
        const q = sira();
        window.AppsMedya.ayarla('anlatim', {
            audio: au,
            baslik: cur.k === 'tam' ? 'Tam anlatım' : cur.baslik || 'Anlatım',
            sanatci: `${UYG} · ${sesAdi(cur.p)}`,
            album: q ? `Sesli anlatım · ${q.i + 1} / ${q.s.length}` : 'Sesli anlatım',
            oynat: baslat,
            duraklat: () => au.pause(),
            kapat,
            // Önceki: parçanın başındaysa önceki durak, değilse parçanın başı (müzik çalarlardaki gibi)
            onceki: q && q.i > 0 ? () => { if (simdi() > 3) git(0); else komsu(-1); } : null,
            sonraki: q && q.i < q.s.length - 1 ? () => komsu(1) : null,
            git,
            konum: () => ({ sure: sure(), simdi: simdi() })
        });
    }

    // ---------- Satırlar ----------
    const etiket = (k) => (k === 'tam' ? 'Tamamını dinle' : k === 'giris' ? 'Girişi dinle' : k.includes('#') ? 'Bu ayetin anlatımını dinle' : 'Bu bölümü dinle');
    function satir(p, k, bilgi, coklu) {
        const sb = coklu && k !== 'tam' && !k.includes('#');
        const alt = k === 'tam' ? `${dk(bilgi.sure)} · ${sesAdi(p)}` : `${fmt(bilgi.sure)} · ${sesAdi(p)}`;
        return `<div class="anl__row${k === 'tam' ? ' is-tam' : ''}${sb ? ' has-sira' : ''}" data-p="${p}" data-k="${esc(k)}" data-sure="${bilgi.sure || 0}" data-baslik="${esc(bilgi.baslik || '')}"${bilgi.bit ? ` data-bas="${bilgi.bas}" data-bit="${bilgi.bit}"` : ''}>
            <button type="button" class="anl__pp" aria-label="${etiket(k)}"><span class="i-play">${IC.play}</span><span class="i-pause">${IC.pause}</span></button>
            <div class="anl__meta"><b>${etiket(k)}</b><small class="anl__alt">${esc(alt)}</small></div>
            ${sb ? `<button type="button" class="anl__sira" aria-pressed="${sirali}" aria-label="Sırayla dinle" title="Sırayla dinle: bitince sıradaki bölüm başlar">${IC.sira}</button>` : ''}
            <button type="button" class="anl__hiz" aria-label="Okuma hızı">${SPEEDS[hizI]}×</button>
            <div class="anl__bar" role="slider" tabindex="0" aria-label="Anlatımda konum" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
        </div>`;
    }
    function doldur(el) {
        const p = profil();
        el.dataset.anlOn = p;
        el.classList.add('anl');
        const istek = (el.dataset.anlatim || '').split(/\s+/).filter(Boolean);
        kayitlar(p).then((liste) => {
            if (el.dataset.anlOn !== p) return;
            const rows = istek.map((k) => bul(k, liste)).filter(Boolean);
            el.hidden = !rows.length;
            const coklu = sirasi(liste).length > 1;
            el.innerHTML = rows.map((k) => satir(p, k, bilgiAl(k, liste), coklu)).join('');
            el.setAttribute('role', 'group');
            el.setAttribute('aria-label', 'Sesli anlatım');
            guncelle();
        });
    }
    // Yeni çizilen yer tutucuları doldurur. Yalnızca dolmamış öğelere yazar; böylece
    // gözlemcinin kendi yazdığı metinle yeniden tetiklenmesi döngüye girmez.
    function tara() {
        const p = profil();
        document.querySelectorAll('[data-anlatim]').forEach((el) => { if (el.dataset.anlOn !== p) doldur(el); });
        if (gorunurluk()) guncelle();
    }
    const satirBilgi = (row) => ({ baslik: row.dataset.baslik, sure: +row.dataset.sure, ...(row.dataset.bit ? { bas: +row.dataset.bas, bit: +row.dataset.bit } : {}) });
    const aktif = (row) => cur && row.dataset.p === cur.p && row.dataset.k === cur.k;

    document.addEventListener('click', (e) => {
        const row = e.target.closest('.anl__row, .anl-mini');
        if (!row) return;
        if (e.target.closest('.anl__hiz')) { hizDegistir(); return; }
        if (e.target.closest('.anl__sira')) { siraDegistir(); return; }
        if (e.target.closest('.anl-mini__x')) { kapat(); return; }
        if (e.target.closest('.anl__pp')) {
            if (row.classList.contains('anl-mini')) { if (au.paused) baslat(); else au.pause(); return; }
            cal(row.dataset.p, row.dataset.k, satirBilgi(row));
            return;
        }
        const bar = e.target.closest('.anl__bar');
        if (bar && (row.classList.contains('anl-mini') || aktif(row)) && isFinite(au.duration)) {
            const r = bar.getBoundingClientRect();
            git(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * sure());
        } else if (bar) {
            cal(row.dataset.p, row.dataset.k, satirBilgi(row));
        }
    });
    document.addEventListener('keydown', (e) => {
        const bar = e.target.closest && e.target.closest('.anl__bar');
        if (!bar || !cur) return;
        const row = bar.closest('.anl__row, .anl-mini');
        if (!row.classList.contains('anl-mini') && !aktif(row)) return;
        const adim = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -30, PageUp: 30 }[e.key];
        if (adim) { e.preventDefault(); atla(adim); }
        else if (e.key === 'Home') { e.preventDefault(); git(0); }
    });

    // ---------- Alttaki küçük oynatıcı ----------
    const mini = document.createElement('div');
    mini.className = 'anl-mini';
    mini.hidden = true;
    mini.setAttribute('role', 'region');
    mini.setAttribute('aria-label', 'Çalan anlatım');
    mini.innerHTML = `<div class="anl-mini__in">
        <button type="button" class="anl__pp" aria-label="Anlatımı oynat"><span class="i-play">${IC.play}</span><span class="i-pause">${IC.pause}</span></button>
        <div class="anl__meta"><b class="anl-mini__t"></b><small class="anl__alt"></small></div>
        <button type="button" class="anl__hiz" aria-label="Okuma hızı"></button>
        <button type="button" class="anl-mini__x" aria-label="Anlatımı kapat">${IC.x}</button>
        <div class="anl__bar" role="slider" tabindex="0" aria-label="Anlatımda konum" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
    </div>`;

    function durum() {
        if (!cur) return 'idle';
        if (hata) return 'error';
        if (au.paused) return 'paused';
        return au.readyState < 3 ? 'loading' : 'playing';
    }
    function guncelle() {
        const st = durum();
        document.querySelectorAll('.anl__row').forEach((row) => {
            const on = aktif(row);
            row.dataset.state = on ? st : 'idle';
            row.querySelector('.anl__pp').setAttribute('aria-label', on && st === 'playing' ? 'Anlatımı duraklat' : etiket(row.dataset.k));
            txt(row.querySelector('.anl__hiz'), SPEEDS[hizI] + '×');
            const sb = row.querySelector('.anl__sira');
            if (sb && sb.getAttribute('aria-pressed') !== String(sirali)) sb.setAttribute('aria-pressed', String(sirali));
            if (on && st === 'error') txt(row.querySelector('.anl__alt'), 'Ses yüklenemedi. Bağlantını kontrol edip yeniden dene.');
        });
        gorunurluk();
        if (cur) {
            mini.dataset.state = st;
            txt(mini.querySelector('.anl-mini__t'), cur.k === 'tam' ? 'Tam anlatım' : cur.baslik || 'Anlatım');
            txt(mini.querySelector('.anl__hiz'), SPEEDS[hizI] + '×');
            mini.querySelector('.anl__pp').setAttribute('aria-label', st === 'playing' ? 'Anlatımı duraklat' : 'Anlatımı oynat');
        }
        tik();
    }
    // Çalan kaydın satırı sayfada yoksa alttaki oynatıcı görünür. Değiştiyse true döner.
    function gorunurluk() {
        const g = !!cur && ![...document.querySelectorAll('.anl__row')].some(aktif);
        if (mini.hidden === !g) return false;
        mini.hidden = !g;
        document.body.classList.toggle('has-anl', g);
        return true;
    }
    function tik() {
        const d = sure(), t = simdi(), r = d ? Math.min(1, t / d) : 0;
        const yaz = (box) => {
            const bar = box.querySelector('.anl__bar');
            bar.querySelector('i').style.width = (r * 100).toFixed(2) + '%';
            bar.setAttribute('aria-valuenow', Math.round(r * 100));
            bar.setAttribute('aria-valuetext', `${fmt(t)} / ${fmt(d)}`);
            if (durum() !== 'error') txt(box.querySelector('.anl__alt'), `${fmt(t)} / ${fmt(d)} · ${sesAdi(cur.p)}`);
        };
        document.querySelectorAll('.anl__row').forEach((row) => {
            if (aktif(row)) yaz(row);
            else if (row.dataset.yazildi !== '0') {
                row.querySelector('.anl__bar i').style.width = '0';
                const k = row.dataset.k, s = +row.dataset.sure;
                txt(row.querySelector('.anl__alt'), k === 'tam' ? `${dk(s)} · ${sesAdi(row.dataset.p)}` : `${fmt(s)} · ${sesAdi(row.dataset.p)}`);
                row.dataset.yazildi = '0';
            }
            if (aktif(row)) row.dataset.yazildi = '1';
        });
        if (cur && !mini.hidden) yaz(mini);
    }

    // ---------- Başlangıç ----------
    function kur() {
        document.body.appendChild(mini);
        tara();
        guncelle();
        new MutationObserver(() => tara()).observe(document.body, { childList: true, subtree: true });
        // Tema değişince ses de değişir (yetişkin: erkek, çocuk: kadın).
        new MutationObserver(() => { if (cur && cur.p !== profil()) kapat(); tara(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur); else kur();
})();
