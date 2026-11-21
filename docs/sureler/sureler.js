// ============================================
// Sureler Atlası — uygulama mantığı
// Künye: kunye.js (SURE_KUNYE, tools/sureler-uret.mjs üretir: Tanzil verisi, elle düzenlenmez).
// Yorum: data.js (SURE_DATA: konu özetleri, görüş farkları). Öne çıkan ayetler: ayetler.js (SURE_AYETLER).
// Anlatım metinleri tools/sureler-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/)
// ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const K = window.SURE_KUNYE;
    const DATA = window.SURE_DATA;
    const AYET = window.SURE_AYETLER || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!K || !DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const OZ = DATA.ozetler, IH = DATA.ihtilaf;
    const TEMA = Object.fromEntries(DATA.temalar.map((t) => [t.id, t]));
    const N = K.length;
    const TOPLAM = K.reduce((n, k) => n + k.ayet, 0);
    const BY_INIS = K.slice().sort((a, b) => a.inis - b.inis);
    const MAXAY = Math.max(...K.map((k) => k.ayet));
    const MEKKI_SON = Math.max(...K.filter((k) => k.tur === 'mekki').map((k) => k.inis));
    // Ekranda gösterilen tür: belirgin görüş farkı varsa "ihtilaf", yoksa Tanzil'deki tür
    const tur = (k) => (IH[k.no] && IH[k.no].derece === 'guclu' ? 'ihtilaf' : k.tur);
    const TUR_AD = { mekki: 'Mekkî', medeni: 'Medenî', ihtilaf: 'Görüş farkı' };
    const oyunda = (k) => !IH[k.no];
    // anlatım kaydının adı: 001-fatiha (tools/sureler-anlatim.mjs ile aynı kural)
    const slug = (s) => s.toLocaleLowerCase('tr').replace(/[’‘'`]/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const dosya = (k) => String(k.no).padStart(3, '0') + '-' + slug(k.ad);

    // ---------- Kalıcı durum ----------
    const KEY = 'sureler:v1';
    const SORTS = ['mushaf', 'inis', 'ayet'], FILTS = ['hepsi', 'mekki', 'medeni', 'ozet'];
    const state = { sort: 'mushaf', filt: 'hepsi', seen: {}, show: { ar: true, meal: true }, arSize: 2, best: { mm: 0, once: 0 }, last: null };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if (SORTS.includes(s.sort)) state.sort = s.sort;
        if (FILTS.includes(s.filt)) state.filt = s.filt;
        if (s.seen && typeof s.seen === 'object') state.seen = s.seen;
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
        if (s.best && typeof s.best === 'object') state.best = Object.assign(state.best, s.best);
        if (Number.isInteger(s.last) && s.last >= 1 && s.last <= N) state.last = s.last;
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';
    let query = '';

    const COPY = {
        yetiskin: {
            kick: 'Kur’an-ı Kerîm', title: 'Sureler <em>Atlası</em>',
            lead: 'Kur’an’ın 114 suresi bir atlasta: adı ve anlamı, Mekkî mi Medenî mi, iniş sırası, ayet sayısı. Her surenin konusu ve öne çıkan ayetiyle.',
            right: 'Doğru.', wrong: 'Yanlış.',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Atlasa göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Kur’an’ın sureleri', title: '<span class="emo">🗺️</span> Sureler <em>Atlası</em>',
            lead: 'Kur’an’da 114 sure var! Her birinin adı, nerede indiği ve kaç ayet olduğu burada. Bir sureye dokun, ne anlattığını keşfet!',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Atlasa bakıp yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        grid: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>'),
        map: svg('<circle cx="8" cy="9" r="5"/><circle cx="17" cy="15" r="4"/><path d="M12 12l2 1"/>'),
        line: svg('<path d="M3 12h18"/><path d="M6 8v8M10 6v12M14 9v6M18 7v10"/>'),
        quiz: svg('<path d="M4 7h11M4 12h7M4 17h11"/><path d="m16 10 3 3-3 3"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
        ezber: svg('<path d="M12 5v16"/><path d="M20 19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a5 5 0 0 0-4 2 5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const sayiAd = (k) => `${k.ayet} ayet`;
    const cuzTxt = (k) => (k.cuz[0] === k.cuz[1] ? `${k.cuz[0]}` : `${k.cuz[0]}–${k.cuz[1]}`);
    const sayfaTxt = (k) => (k.sayfa[0] === k.sayfa[1] ? `${k.sayfa[0]}` : `${k.sayfa[0]}–${k.sayfa[1]}`);
    const trLower = (s) => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’‘'`-]/g, '').replace(/ı/g, 'i').replace(/\s+/g, '');

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
        { id: '', href: '#/', ad: 'Atlas', alt: '114 sure, ara ve sırala', icon: IC.grid },
        { id: 'harita', href: '#/harita', ad: 'Harita', alt: 'Mekke ve Medine sureleri', icon: IC.map },
        { id: 'inis', href: '#/inis', ad: 'İniş', alt: 'İniş sırası şeridi', icon: IC.line },
        { id: 'oyun', href: '#/oyun', ad: 'Oyunlar', alt: 'Mekkî mi? Hangisi önce?', icon: IC.quiz }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // ---------- Atlas ----------
    function liste() {
        let l = K.slice();
        if (state.filt === 'mekki' || state.filt === 'medeni') l = l.filter((k) => k.tur === state.filt);
        if (state.filt === 'ozet') l = l.filter((k) => OZ[k.no]);
        const q = trLower(query.trim());
        if (q) l = l.filter((k) => String(k.no) === q || trLower(k.ad).includes(q) || (OZ[k.no] && trLower(OZ[k.no].anlam).includes(q)));
        if (state.sort === 'inis') l.sort((a, b) => a.inis - b.inis);
        else if (state.sort === 'ayet') l.sort((a, b) => b.ayet - a.ayet || a.no - b.no);
        return l;
    }
    function hucre(k) {
        const t = tur(k), o = OZ[k.no];
        const w = Math.max(8, Math.round(Math.sqrt(k.ayet / MAXAY) * 100));
        const ust = state.sort === 'inis' ? `İniş ${k.inis}` : state.sort === 'ayet' ? `${k.no}. sure` : k.no;
        const lbl = `${k.no}. ${k.ad} suresi, ${k.ayet} ayet, ${TUR_AD[t]}, iniş sırası ${k.inis}${o ? ', konu özeti var' : ''}${state.seen[k.no] ? ', açıldı' : ''}`;
        return `<li><a class="su t-${t}${state.seen[k.no] ? ' is-seen' : ''}" href="#/s/${k.no}" aria-label="${esc(lbl)}">
                <span class="su__no">${esc(ust)}</span><b class="su__ad">${esc(k.ad)}</b><span class="su__ay">${k.ayet} ayet</span>
                ${o ? `<span class="su__mk" aria-hidden="true"><span class="oz"></span><span class="emo">${o.emo}</span></span>` : ''}
                <i class="su__bar${t === 'ihtilaf' ? ' hatch' : ''}" style="--w:${w}%" aria-hidden="true"></i></a></li>`;
    }
    function drawGrid() {
        const l = liste();
        const g = app.querySelector('#grid'), c = app.querySelector('#count');
        if (!g) return;
        g.innerHTML = l.length ? l.map(hucre).join('') : '';
        const ayt = l.reduce((n, k) => n + k.ayet, 0);
        c.textContent = l.length ? `${l.length} sure · ${ayt} ayet` : 'Aramaya uyan sure yok.';
    }
    function viewAtlas() {
        const c = copy();
        const mk = K.filter((k) => k.tur === 'mekki').length, md = N - mk;
        const nOz = Object.keys(OZ).length;
        const seg = (v, l) => `<button type="button" data-sort="${v}" aria-pressed="${state.sort === v}">${l}</button>`;
        const fl = (v, l, cls) => `<button type="button" data-filt="${v}" aria-pressed="${state.filt === v}"${cls ? ` class="${cls}"` : ''}>${cls ? '<i aria-hidden="true"></i>' : ''}${l}</button>`;
        const last = state.last && K[state.last - 1];
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="giris"></div>
                    <div class="stats"><span><b>${N}</b> sure</span><span><b>${TOPLAM}</b> ayet</span><span class="t-mekki"><i aria-hidden="true"></i><b>${mk}</b> Mekkî</span><span class="t-medeni"><i aria-hidden="true"></i><b>${md}</b> Medenî</span></div>
                    <div class="btns">${last ? `<a class="btn" href="#/s/${last.no}">${IC.go}${esc('Devam et: ' + last.ad)}</a>` : `<a class="btn" href="#/s/1">${IC.go}Fâtiha’dan başla</a>`}<a class="btn alt" href="#/oyun">${IC.quiz}Oyunlar</a></div>
                </section>
                <div class="tools-bar" role="search">
                    <label class="search"><span class="sr">Sure ara: ad ya da numara</span>${IC.search}<input id="q" type="search" inputmode="search" autocomplete="off" placeholder="Sure ara: ad ya da numara" value="${esc(query)}"></label>
                    <div class="seg" role="group" aria-label="Sıralama">${seg('mushaf', 'Mushaf')}${seg('inis', 'İniş')}${seg('ayet', 'Ayet sayısı')}</div>
                    <div class="filt" role="group" aria-label="Süz">${fl('hepsi', 'Hepsi')}${fl('mekki', 'Mekkî', 't-mekki')}${fl('medeni', 'Medenî', 't-medeni')}${fl('ozet', `Konusu anlatılan (${nOz})`)}</div>
                </div>
                <p class="count" id="count" aria-live="polite"></p>
                <ol class="grid" id="grid" aria-label="Sureler"></ol>
                <div class="legend" aria-hidden="true"><span class="t-mekki"><i></i>Mekkî</span><span class="t-medeni"><i></i>Medenî</span><span class="t-ihtilaf"><i class="hatch"></i>Görüş farkı</span><span><i class="dot"></i>Konu özeti var</span><span>Alt çizgi: ayet sayısı</span></div>
                <p class="note"><b>Not:</b> Ayet sayısı, Mekkî/Medenî oluşu ve iniş sırası Tanzil verisinden otomatik alınır (Kûfe sayımı, toplam ${TOPLAM} ayet). İniş sırası geleneksel bir listeye dayanır ve yaklaşıktır. Mekkî/Medenî oluşunda âlimler arasında belirgin görüş farkı olan ${Object.values(IH).filter((x) => x.derece === 'guclu').length} sure “Görüş farkı” diye gösterilir.</p>
            </div>`;
        drawGrid();
        const qi = app.querySelector('#q');
        qi.addEventListener('input', () => { query = qi.value; drawGrid(); });
        qi.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const l = liste(); if (l.length === 1) location.hash = '#/s/' + l[0].no; } });
        app.querySelectorAll('[data-sort]').forEach((b) => b.addEventListener('click', () => {
            state.sort = b.dataset.sort; save();
            app.querySelectorAll('[data-sort]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            drawGrid();
        }));
        app.querySelectorAll('[data-filt]').forEach((b) => b.addEventListener('click', () => {
            state.filt = b.dataset.filt; save();
            app.querySelectorAll('[data-filt]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            drawGrid();
        }));
        hsub.textContent = 'Atlas';
        document.title = 'Sureler Atlası';
        return '';
    }

    // ---------- Sure sayfası ----------
    function viewbar() {
        const chip = (k, l) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${l}</button>`;
        return `<div class="viewbar" role="group" aria-label="Ayette gösterilecek metinler">
                <div class="chips" style="grid-template-columns:repeat(2,minmax(0,1fr))">${chip('ar', 'Arapça')}${chip('meal', 'Anlam')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const boxes = app.querySelectorAll('.delils');
        const apply = () => {
            boxes.forEach((b) => { ['ar', 'meal'].forEach((k) => b.classList.toggle('hide-' + k, !state.show[k])); b.dataset.ar = state.arSize; });
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            const sb = app.querySelectorAll('[data-size]');
            if (sb.length) { sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; }
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            if (state.show[k] && Object.values(state.show).filter(Boolean).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }
    function viewSure(k) {
        const o = OZ[k.no], ih = IH[k.no], t = tur(k);
        const prev = K[k.no - 2], next = K[k.no];
        state.seen[k.no] = true; state.last = k.no; save();
        const yer = t === 'ihtilaf' ? 'Görüş farkı' : k.tur === 'mekki' ? 'Mekke' : 'Medine';
        const kunye = `<div class="kunye">
                <div><b>${k.ayet}</b><small>ayet</small></div>
                <div><a href="#/inis/${k.no}" aria-label="İniş sırası ${k.inis}, iniş şeridinde göster"><b>${k.inis}.</b><small>iniş sırası ›</small></a></div>
                <div class="t-${t}"><b>${esc(yer)}</b><small>${t === 'ihtilaf' ? 'Tanzil: ' + TUR_AD[k.tur] : 'iniş yeri'}</small></div>
                <div><b>${cuzTxt(k)}</b><small>cüz · sayfa ${sayfaTxt(k)}</small></div>
            </div>`;
        const ihNot = ih ? `<p class="pnote"><b>${ih.derece === 'guclu' ? 'Âlimler arasında farklı görüş vardır.' : 'Farklı bir rivayet de vardır.'}</b> ${esc(ih.not)}<small>Kaynak: ${esc(ih.kaynak)}</small></p>` : '';
        let yorum;
        if (o) {
            const a = AYET[o.oneCikan];
            const h = o.hadis;
            const kaynak = [...o.kaynak];
            if (a) kaynak.push(`Öne çıkan ayet: ${a.sure} ${a.no}. Meal: ${DATA.meal}`);
            if (h) kaynak.push(h.kaynak + ' (hadis anlam olarak aktarılmıştır)');
            yorum = `
                <div class="blk__ttl"><span>Konu</span><small>Kaynaklı özet</small></div>
                <section class="sc expl"><div class="kick">${kid() ? o.emo + ' Bu sure ne anlatıyor?' : 'Ne anlatıyor?'}</div>${kid() ? `<p class="lead" style="margin:0 0 12px">${esc(o.cocuk)}</p>` : ''}<p>${esc(o.konu)}</p>
                    <div class="temalar">${o.tema.map((x) => `<span>${kid() ? `<em aria-hidden="true">${TEMA[x].emo}</em>` : ''}${esc(TEMA[x].ad)}</span>`).join('')}</div></section>
                ${a ? `<h2 class="secttl">Öne çıkan ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</h2>${viewbar()}<div class="delils"><div class="ay"><p class="ayet-ar" lang="ar">${esc(a.ar)}</p><p class="ayet-meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p></div></div>` : ''}
                ${h ? `<h2 class="secttl">Hadis</h2><figure class="hadis"><blockquote>${esc(h.metin)}</blockquote><figcaption><b>${esc(h.kaynak)}</b><br>Ravi: ${esc(h.ravi)}</figcaption></figure>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(o.akilda)}</p></section>
                <p class="srccard src"><b>Kaynak:</b> ${kaynak.map(esc).join('. ')}.</p>`;
        } else {
            yorum = `<section class="sc"><div class="kick">Konu</div><p class="ozet-yok">Konu özeti hazırlanıyor.</p><p class="prog__txt" style="margin-top:8px">Bu surenin konusu, kaynaklarıyla karşılaştırıldıktan sonra eklenecek.</p></section>`;
        }
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Atlas</a><span class="pos">${k.no} / ${N}</span></div>
                <section class="sc hero t-${t}">
                    <span class="badge">${t === 'ihtilaf' ? 'Görüş farkı' : TUR_AD[k.tur] + ' sure'}</span>
                    <h1>${kid() && o ? `<span class="emo">${o.emo}</span> ` : ''}${esc(k.ad)} Suresi</h1>
                    <p class="head__ar" lang="ar">${esc(k.ar)}</p>
                    ${o ? `<p class="lead">Adının anlamı: ${esc(o.anlam)}</p>` : ''}
                    ${o ? `<div data-anlatim="${dosya(k)}"></div>` : ''}
                    ${k.ezber ? `<div class="btns"><a class="btn" href="../ezberler/#/o/${encodeURIComponent(k.ezber)}">${IC.ezber}Ezberle</a></div>` : ''}
                </section>
                <div class="blk__ttl"><span>Künye</span><small>Tanzil verisi</small></div>
                ${kunye}
                ${ihNot}
                ${yorum}
                <nav class="pager" aria-label="Önceki ve sonraki sure">
                    ${prev ? `<a href="#/s/${prev.no}"><small>Önceki · ${prev.no}</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/s/${next.no}"><small>Sonraki · ${next.no}</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = `${k.no}. ${k.ad}`;
        document.title = `${k.ad} Suresi | Sureler Atlası`;
        return '';
    }

    // ---------- Harita: Mekke / Medine kümeleri ----------
    function tas(k) {
        const t = tur(k), z = Math.round(44 + Math.sqrt(k.ayet / MAXAY) * 22);
        const zayif = IH[k.no] && IH[k.no].derece === 'zayif';
        return `<a class="tas t-${t}${zayif ? ' zayif' : ''}" href="#/s/${k.no}" style="--z:${z}px" aria-label="${esc(`${k.no}. ${k.ad}, ${k.ayet} ayet${zayif ? ', farklı rivayet var' : ''}`)}" title="${esc(`${k.ad} · ${k.ayet} ayet`)}"><span>${k.no}</span></a>`;
    }
    function viewHarita() {
        const gr = { mekki: [], medeni: [], ihtilaf: [] };
        K.forEach((k) => gr[tur(k)].push(k));
        const ay = (l) => l.reduce((n, k) => n + k.ayet, 0);
        const kume = (id, ad, alt) => `<section class="kume t-${id}"><h2>${ad}<small>${gr[id].length} sure · ${ay(gr[id])} ayet</small></h2><p>${alt}</p><div class="taslar">${gr[id].map(tas).join('')}</div></section>`;
        const T = ay(K);
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🗺️ ' : ''}Harita</div>
                    <h1>Mekke ve Medine sureleri</h1>
                    <p class="lead">Her kare bir sure; büyüklüğü ayet sayısını gösterir. Bir kareye dokun, sure açılsın.</p>
                    <div class="oran" role="img" aria-label="Ayetlerin dağılımı: Mekkî ${ay(gr.mekki)}, Medenî ${ay(gr.medeni)}, görüş farkı olan surelerde ${ay(gr.ihtilaf)} ayet" style="margin-top:18px"><i class="t-mekki" style="width:${(100 * ay(gr.mekki)) / T}%"></i><i class="t-medeni" style="width:${(100 * ay(gr.medeni)) / T}%"></i><i class="t-ihtilaf hatch" style="width:${(100 * ay(gr.ihtilaf)) / T}%"></i></div>
                    <p class="prog__txt" style="margin-top:8px">Mekkî surelerde ${ay(gr.mekki)} ayet (%${pct(ay(gr.mekki), T)}), Medenî surelerde ${ay(gr.medeni)} ayet (%${pct(ay(gr.medeni), T)}), görüş farkı olan surelerde ${ay(gr.ihtilaf)} ayet.</p>
                </section>
                ${kume('mekki', 'Mekke’de inenler', 'Hicretten önce inen sureler. Çoğu kısadır; tevhid, peygamberlik ve âhiret inancını işler.')}
                ${kume('medeni', 'Medine’de inenler', 'Hicretten sonra inen sureler. Daha uzundur; ibadet, aile ve toplum hayatına dair hükümler de getirir.')}
                ${kume('ihtilaf', 'Görüş farkı olanlar', 'Mekkî mi Medenî mi olduğu konusunda âlimler arasında belirgin görüş farkı olan sureler.')}
                <p class="note"><b>Not:</b> Kesik çizgili kareler, farklı bir rivayeti bulunan ama çoğunluk görüşü açık olan surelerdir. Mekkî/Medenî ayrımında yaygın ölçü hicrettir: hicretten önce inen Mekkî, sonra inen Medenî sayılır. Gruplar Tanzil verisine, görüş farkları TDV İslâm Ansiklopedisi’nin sure maddelerine göredir. Bazı surelerin yalnızca birkaç ayetinin farklı yerde indiği söylenir; bunlar burada ayrıca gösterilmez.</p>
            </div>`;
        hsub.textContent = 'Harita';
        document.title = 'Harita | Sureler Atlası';
        return 'harita';
    }

    // ---------- İniş şeridi ----------
    function viewInis(sel) {
        const selK = sel && K[sel - 1];
        const x = (i) => ((i - 0.5) / N) * 100;
        const bars = BY_INIS.map((k) => `<i class="t-${tur(k)}${tur(k) === 'ihtilaf' ? ' hatch' : ''}${selK === k ? ' is-on' : ''}" style="--h:${Math.round(10 + Math.sqrt(k.ayet / MAXAY) * 90)}%"></i>`).join('');
        const row = (k) => `<li><a class="t-${tur(k)}${selK === k ? ' is-on' : ''}" id="i-${k.no}" href="#/s/${k.no}"><span class="n">${k.inis}</span><b>${esc(k.ad)}</b><small>Mushafta ${k.no}. sure${tur(k) === 'ihtilaf' ? ' · görüş farkı var' : ''}${OZ[k.no] ? ' · konusu anlatıldı' : ''}</small><span class="ay-n">${k.ayet} ayet</span></a></li>`;
        const mk = BY_INIS.filter((k) => k.inis <= MEKKI_SON), md = BY_INIS.filter((k) => k.inis > MEKKI_SON);
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '⏳ ' : ''}İniş sırası</div>
                    <h1>Sureler hangi sırayla indi?</h1>
                    <p class="lead">Soldan sağa iniş sırası; her çubuk bir sure, boyu ayet sayısını gösterir. Kesik çizgi hicreti işaret eder.</p>
                    <div class="serit" role="img" aria-label="İniş sırası şeridi: ilk ${MEKKI_SON} sure Mekke döneminde, sonraki ${N - MEKKI_SON} sure Medine döneminde indi${selK ? `; seçili sure ${selK.ad}, iniş sırası ${selK.inis}` : ''}" style="margin-top:18px">
                        <div class="serit__bar">${bars}<span class="serit__hicret" style="left:${(MEKKI_SON / N) * 100}%"></span></div>
                        <div class="serit__axis" aria-hidden="true"><span style="left:0">1</span><span style="left:${x(MEKKI_SON)}%">${MEKKI_SON}</span><span style="left:100%">${N}</span></div>
                        <div class="serit__key" aria-hidden="true"><span class="t-mekki"><i></i>Mekkî</span><span class="t-medeni"><i></i>Medenî</span><span class="t-ihtilaf"><i class="hatch"></i>Görüş farkı</span><span><i class="hic"></i>Hicret</span></div>
                    </div>
                </section>
                <div class="donem t-mekki"><div><h2>Mekke dönemi</h2><small>İniş sırası 1–${MEKKI_SON} · ${mk.length} sure</small></div></div>
                <ol class="inis">${mk.map(row).join('')}</ol>
                <p class="hicret"><span>Hicret (622): Peygamberimiz Mekke’den Medine’ye göç etti.</span><a href="../siyer/#/o/hicret">Siyer Çizelgesi’nde oku ›</a></p>
                <div class="donem t-medeni"><div><h2>Medine dönemi</h2><small>İniş sırası ${MEKKI_SON + 1}–${N} · ${md.length} sure</small></div></div>
                <ol class="inis">${md.map(row).join('')}</ol>
                <p class="note"><b>Not:</b> İniş sırası, Tanzil verisinin kullandığı geleneksel listeye göredir; kaynaklarda farklı sıralamalar da vardır, bu yüzden sıra yaklaşık kabul edilmelidir. Uzun surelerin ayetleri yıllar içinde parça parça inmiştir; listede surenin inmeye başladığı yer esas alınır. Görüş farkı olan sureler Tanzil’in verdiği yerde gösterilir.</p>
            </div>`;
        if (selK) requestAnimationFrame(() => { const el = document.getElementById('i-' + selK.no); if (el) { el.scrollIntoView({ block: 'center', behavior: reduceMotion.matches ? 'auto' : 'smooth' }); el.focus({ preventScroll: true }); } });
        hsub.textContent = 'İniş sırası';
        document.title = 'İniş sırası | Sureler Atlası';
        return 'inis';
    }

    // ---------- Oyunlar ----------
    const ROUND = 10;
    let quiz = null;
    const rnd = (n) => Math.floor(Math.random() * n);
    const HAVUZ = K.filter(oyunda);
    function karistir(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; }
    function newQuiz(tip) {
        let list;
        if (tip === 'mm') {
            // Medenî sureler azınlıkta; yarı yarıya dengelenir
            const mk = karistir(HAVUZ.filter((k) => k.tur === 'mekki')), md = karistir(HAVUZ.filter((k) => k.tur === 'medeni'));
            list = karistir([...mk.slice(0, ROUND / 2), ...md.slice(0, ROUND / 2)]);
        } else {
            // İniş sırası yaklaşık olduğundan yalnızca sırası en az 20 farklı olan çiftler sorulur
            list = []; const used = new Set(); let guard = 0;
            while (list.length < ROUND && guard++ < 2000) {
                const a = HAVUZ[rnd(HAVUZ.length)], b = HAVUZ[rnd(HAVUZ.length)];
                if (a === b || Math.abs(a.inis - b.inis) < 20) continue;
                const key = [a.no, b.no].sort().join('|');
                if (used.has(key)) continue;
                used.add(key); list.push([a, b]);
            }
        }
        quiz = { tip, list, i: 0, score: 0, answered: null };
    }
    function viewOyunlar() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🎲 ' : ''}Oyunlar</div>
                    <h1>Ne kadar biliyorsun?</h1>
                    <p class="lead">Her oyun on soru. Mekkî/Medenî oluşunda görüş farkı bulunan sureler oyunlara girmez.</p>
                </section>
                <div class="oyunlar">
                    <a class="oyun-kart" href="#/oyun/mm"><span class="ti" aria-hidden="true">${kid() ? '🕋' : IC.map}</span><b>Mekkî mi, Medenî mi?</b><small>Sure Mekke’de mi indi, Medine’de mi? · ${esc(copy().best(state.best.mm))}</small></a>
                    <a class="oyun-kart" href="#/oyun/once"><span class="ti" aria-hidden="true">${kid() ? '⏳' : IC.line}</span><b>Hangisi daha önce indi?</b><small>İki sureden önce ineni seç · ${esc(copy().best(state.best.once))}</small></a>
                </div>
                <p class="note"><b>Not:</b> Cevaplar Tanzil verisine göredir. “Hangisi daha önce indi?” oyununda iniş sırası yaklaşık olduğu için yalnızca sıraları birbirinden epey uzak sureler karşılaştırılır.</p>
            </div>`;
        hsub.textContent = 'Oyunlar';
        document.title = 'Oyunlar | Sureler Atlası';
        return 'oyun';
    }
    function viewOyun(tip) {
        if (!quiz || quiz.tip !== tip) newQuiz(tip);
        const c = copy();
        const total = quiz.list.length;
        const ad = tip === 'mm' ? 'Mekkî mi, Medenî mi?' : 'Hangisi daha önce indi?';
        if (quiz.i >= total) {
            const n = quiz.score;
            if (n > state.best[tip]) { state.best[tip] = n; save(); }
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}Sonuç · ${esc(ad)}</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best[tip]))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/oyun">${IC.quiz}Oyunlar</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(tip); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const ans = quiz.answered;
            let body, ok, fb;
            if (tip === 'mm') {
                const k = quiz.list[quiz.i];
                const btn = (v) => {
                    let cls = '';
                    if (ans) cls = v === k.tur ? ' is-right' : v === ans ? ' is-wrong' : '';
                    return `<button type="button" class="t-${v}${cls}" data-ans="${v}"${ans ? ' disabled' : ''}><b>${v === 'mekki' ? 'Mekkî' : 'Medenî'}</b><small>${v === 'mekki' ? 'Hicretten önce' : 'Hicretten sonra'}</small></button>`;
                };
                ok = ans && ans === k.tur;
                body = `<p class="quiz__ask">Mekkî mi, Medenî mi?</p>
                    <p class="soru-sure">${kid() && OZ[k.no] ? `<span class="emo">${OZ[k.no].emo}</span> ` : ''}${esc(k.ad)} Suresi</p>
                    <p class="soru-ar" lang="ar">${esc(k.ar)}</p><p class="soru-alt">${k.no}. sure · ${k.ayet} ayet</p>
                    <div class="ikili mm" role="group" aria-label="Seçenekler" style="margin-top:16px">${btn('mekki')}${btn('medeni')}</div>`;
                fb = `${esc(k.ad)} ${k.tur === 'mekki' ? 'Mekke’de' : 'Medine’de'} inmiştir; iniş sırası ${k.inis}. <a href="#/s/${k.no}">Sureyi aç</a>`;
            } else {
                const [a, b] = quiz.list[quiz.i];
                const first = a.inis < b.inis ? a : b;
                const card = (k) => {
                    let cls = '';
                    if (ans) cls = k === first ? ' is-right' : String(k.no) === ans ? ' is-wrong' : '';
                    return `<button type="button" class="${cls.trim()}" data-ans="${k.no}"${ans ? ' disabled' : ''}>${kid() && OZ[k.no] ? `<span aria-hidden="true" style="font-size:1.5rem">${OZ[k.no].emo}</span>` : ''}<b>${esc(k.ad)}</b><small>${k.no}. sure · ${k.ayet} ayet</small>${ans ? `<span class="yr">İniş sırası ${k.inis}</span>` : ''}</button>`;
                };
                ok = ans && ans === String(first.no);
                body = `<p class="quiz__ask">Sıralama</p><p class="quiz__q">Hangisi daha önce indi?</p>
                    <div class="ikili" role="group" aria-label="Seçenekler" style="margin-top:16px">${card(a)}<span class="veya" aria-hidden="true">YA DA</span>${card(b)}</div>`;
                fb = `Önce inen: ${esc(first.ad)} (iniş sırası ${first.inis}). <a href="#/inis/${first.no}">Şeritte göster</a>`;
            }
            app.innerHTML = `
                <div class="page in"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    ${body}
                    ${ans ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> ${fb}</div>
                        <div class="btns"><button type="button" class="btn" id="nextQ">${IC.go}${quiz.i + 1 < total ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section></div>`;
            app.querySelectorAll('[data-ans]').forEach((btn) => btn.addEventListener('click', () => {
                if (quiz.answered) return;
                quiz.answered = btn.dataset.ans;
                const cur = quiz.list[quiz.i];
                const right = tip === 'mm' ? quiz.answered === cur.tur : quiz.answered === String((cur[0].inis < cur[1].inis ? cur[0] : cur[1]).no);
                if (right) quiz.score += 1;
                render(false);
                const nb = document.getElementById('nextQ'); if (nb) nb.focus();
                if (right) burst(app.querySelector('.ikili .is-right')); else if (navigator.vibrate) navigator.vibrate(40);
            }));
            const nb = document.getElementById('nextQ');
            if (nb) nb.addEventListener('click', () => { quiz.i += 1; quiz.answered = null; render(true); window.scrollTo(0, 0); });
        }
        hsub.textContent = ad;
        document.title = `${ad} | Sureler Atlası`;
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
            const f = Array.from(sheetBg.querySelectorAll('button, a[href]')).filter((x) => !x.disabled);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    function infoHtml() {
        const g = Object.values(IH).filter((x) => x.derece === 'guclu').length, z = Object.values(IH).length - g;
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Atlasta iki tür bilgi vardır ve ekranda ayrı gösterilir: otomatik alınan <b>künye</b> ve kaynaklarla karşılaştırılarak yazılan <b>konu özeti</b>.</p>
            <ul>
                <li><b>Künye:</b> Tanzil Quran Metadata (tanzil.net): ayet sayısı (Kûfe sayımı, toplam ${TOPLAM}), Mekkî/Medenî oluşu, iniş sırası, cüz ve sayfa. Sayfa numarası Medine mushafına (604 sayfa) göredir. Veri, fawazahmed0/quran-api ile karşılaştırılmıştır.</li>
                <li><b>Görüş farkları:</b> TDV İslâm Ansiklopedisi’nin sure maddeleri. ${g} surede belirgin görüş farkı (“Görüş farkı”), ${z} surede zayıf görülen farklı bir rivayet vardır; bunların hiçbiri oyunlara girmez.</li>
                <li><b>Konu özeti:</b> Kendi cümlelerimizle; her biri TDV İslâm Ansiklopedisi’nin ilgili sure maddesiyle karşılaştırılmıştır.</li>
                <li><b>Öne çıkan ayet:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}.</li>
                <li><b>Hadis:</b> Yalnızca Buhârî ve Müslim; anlam olarak, kısaltılarak aktarılır. Buhârî numarası genel hadis numarası, Müslim numarası M. Fuâd Abdülbâkî numarasıdır.</li>
            </ul>
            <h4>İniş sırası</h4>
            <p>İniş sırası, rivayetlere dayanan geleneksel bir listeye göredir; kaynaklarda farklı sıralamalar da vardır. Uzun sureler yıllar içinde parça parça inmiştir. Bu yüzden sıra yaklaşık kabul edilmelidir.</p>
            <h4>Ezberle</h4>
            <p>Ezberler uygulamasında bulunan surelerin sayfasında “Ezberle” düğmesi vardır; sure Ezberler’de açılır.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; her surede bir simge.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ atlas · #/s/<no> sure · #/harita · #/inis[/<no>] · #/oyun · #/oyun/mm · #/oyun/once
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const ms = h.match(/^s\/(\d{1,3})$/), mi = h.match(/^inis(?:\/(\d{1,3}))?$/), mo = h.match(/^oyun\/(mm|once)$/);
        let active;
        if (ms && K[+ms[1] - 1]) active = viewSure(K[+ms[1] - 1]);
        else if (h === 'harita') active = viewHarita();
        else if (mi) active = viewInis(mi[1] && +mi[1]);
        else if (mo) active = viewOyun(mo[1]);
        else if (h === 'oyun') active = viewOyunlar();
        else active = viewAtlas();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && /^oyun\//.test(lastHash) && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed && !/^inis\/\d/.test(h)) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
