// ============================================
// Kur'an'da Hayvanlar — uygulama mantığı
// İçerik: data.js (HAYVAN_DATA); ayetler: ayetler.js (HAYVAN_AYETLER), Arapça adlar: adlar.js (HAYVAN_ADLAR);
// ikisini de tools/hayvanlar-uret.mjs üretir. Çizimler: cizimler.js (HAYVAN_CIZ).
// Anlatım metinleri tools/hayvanlar-anlatim.json içindedir; metin gösterilmez; kayıtları (anlatim/<profil>/)
// ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// ============================================
(function () {
    'use strict';

    const DATA = window.HAYVAN_DATA;
    const AYET = window.HAYVAN_AYETLER || {};
    const ADLAR = window.HAYVAN_ADLAR || {};
    const CIZ = window.HAYVAN_CIZ || (() => '');
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.hayvanlar.map((h, i) => Object.assign({ n: i + 1 }, h));
    const BY = Object.fromEntries(ALL.map((h) => [h.id, h]));
    const GRUP = Object.fromEntries(DATA.gruplar.map((g) => [g.id, g]));
    const HADIS = DATA.hadisler;
    const T = ALL.length;
    const dosya = (h) => String(h.n).padStart(2, '0') + '-' + h.id;
    const sureNo = (r) => +String(r).split(':')[0];
    const sureAd = (r) => (AYET[r] ? AYET[r].sure : '');
    const hayvanSureleri = (h) => [...new Set(h.ayetler.map(sureAd))];
    const sureYazi = (h) => { const s = hayvanSureleri(h); return s.length > 1 ? s.slice(0, -1).join(', ') + ' ve ' + s[s.length - 1] + ' sureleri' : s[0] + ' suresi'; };

    // ---------- Kalıcı durum ----------
    const KEY = 'hayvanlar:v1';
    const state = { seen: {}, show: { ar: true, ok: true, meal: true }, arSize: 2, best: { sure: 0, kissa: 0 }, last: null };
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
    const seenCount = () => ALL.filter((h) => state.seen[h.id]).length;

    const COPY = {
        yetiskin: {
            kick: 'Kur’an’da', title: 'Kur’an’da <em>Hayvanlar</em>',
            lead: 'Kur’an’da adı geçen on beş hayvan: hangi surede, hangi olayda geçtikleri, ayetlerin anlattığı ve bize bıraktıkları ders.',
            progress: (n) => n === 0 ? `${T} hayvanın sayfası seni bekliyor.` : n === T ? 'Bütün hayvanların sayfasını okudun.' : `${T} hayvandan ${n} tanesini okudun.`,
            resume: 'Devam et', start: 'İlk hayvandan başla', cocukBaslik: 'Bu hayvandan bir ders',
            right: 'Doğru.', wrong: 'Yanlış.',
            result: (n, t) => n === t ? 'Hepsi doğru.' : n >= t * 0.7 ? 'Güzel bir sonuç.' : 'Hayvanların sayfalarına göz atıp yeniden dene.',
            best: (n) => `En iyi sonucun: ${n}`
        },
        cocuk: {
            kick: 'Kur’an’daki hayvan dostlarımız', title: '<span class="emo">🐾</span> Kur’an’da <em>Hayvanlar</em>',
            lead: 'Karınca, arı, fil, hüdhüd… Kur’an’da on beş hayvan var! Hangi surede geçtiklerini ve bize ne öğrettiklerini keşfedelim.',
            progress: (n) => n === 0 ? `${T} hayvan seni bekliyor! 👋` : n === T ? 'Hepsini tanıdın! 🎉' : `${n} hayvanı tanıdın, ${T - n} hayvan kaldı.`,
            resume: 'Devam et', start: 'Hadi keşfedelim', cocukBaslik: 'Sen de böyle yap',
            right: 'Harika, doğru! 🌟', wrong: 'Bu sefer olmadı.',
            result: (n, t) => n === t ? 'Hepsini bildin! 🎉' : n >= t * 0.7 ? 'Çok iyi gidiyorsun! 🌟' : 'Hayvanların sayfalarına bakıp yeniden dene!',
            best: (n) => `En iyi skorun: ${n}`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        paw: svg('<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>'),
        heart: svg('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
        quiz: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3"/><path d="M12 17h.01"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        go: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 2),
        restart: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
        book: svg('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>'),
        person: svg('<path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.4 7.2 17.9l.9-5.4L4.2 8.7l5.4-.8z"/>')
    };
    const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);
    const refTxt = (r) => { const a = AYET[r]; return a ? `${a.sure} ${a.no}` : r; };
    const ciz = (h, cls, label) => `<span class="ciz-kutu${cls ? ' ' + cls : ''}" style="--hc:${h.renk}">${CIZ(h.id, '', label)}</span>`;
    function ayBlock(r) {
        const a = AYET[r];
        if (!a) return '';
        return `<div class="ay"><p class="ayet-ar" lang="ar">${esc(a.ar)}</p><p class="ayet-meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${a.no}. ${String(a.no).includes('-') ? 'ayetler' : 'ayet'}</p></div>`;
    }
    function hadisHtml(id, opt) {
        const x = HADIS[id];
        if (!x) return '';
        const o = opt || {};
        const hay = o.hayvan ? ALL.find((h) => h.hadis === id) : null;
        return `<figure class="hadis">
                ${o.baslik ? `<h3>${esc(x.baslik)}</h3>` : ''}
                <blockquote>${esc(x.metin)}</blockquote>
                <figcaption><b>${esc(x.kaynak)}</b><br>Ravi: ${esc(x.ravi)} · Hadis anlam olarak, kısaltılarak aktarılmıştır.</figcaption>
                <p class="ders"><b>${kid() ? '💡 ' : ''}Bu hadisten:</b> ${esc(kid() && x.cocuk ? x.cocuk : x.ders)}</p>
                ${hay ? `<a class="git" href="#/h/${hay.id}">${esc(hay.ad)} sayfası ${IC.go}</a>` : ''}
            </figure>`;
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
        { id: '', href: '#/', ad: 'Hayvanlar', alt: 'On beş hayvan', icon: IC.paw },
        { id: 'merhamet', href: '#/merhamet', ad: 'Merhamet', alt: 'Hayvanlara iyilik hadisleri', icon: IC.heart },
        { id: 'oyun', href: '#/oyun', ad: 'Oyunlar', alt: 'Hangi surede? Kimin hikâyesi?', icon: IC.quiz }
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
            const kartlar = ALL.filter((h) => h.grup === g.id).map((h) => `<li><a class="kart" href="#/h/${h.id}" style="--hc:${h.renk}">
                    ${ciz(h)}
                    <b>${esc(h.ad)}</b><small>${esc(sureYazi(h))}</small>
                    ${state.seen[h.id] ? `<span class="tik" aria-hidden="true">✓</span><span class="sr"> (okundu)</span>` : ''}</a></li>`).join('');
            return `<section class="grup" aria-labelledby="g-${g.id}"><div class="grup__head"><h2 id="g-${g.id}">${kid() ? `<span class="emo" aria-hidden="true">${g.emo}</span> ` : ''}${esc(g.ad)}</h2><small>${esc(g.alt)}</small></div><ul class="kartlar">${kartlar}</ul></section>`;
        }).join('');
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="prog"><div class="bar" role="progressbar" aria-label="Okunan hayvanlar" aria-valuemin="0" aria-valuemax="${T}" aria-valuenow="${n}"><b style="width:${pct(n, T)}%"></b></div><p class="prog__txt">${esc(c.progress(n))}</p></div>
                    <div class="btns">${last ? `<a class="btn" href="#/h/${last.id}">${IC.go}${esc(c.resume + ': ' + last.ad)}</a>` : `<a class="btn" href="#/h/${ALL[0].id}">${IC.go}${esc(c.start)}</a>`}<a class="btn alt" href="#/oyun">${IC.quiz}Oyunlar</a></div>
                </section>
                ${gruplar}
                <p class="note"><b>Not:</b> Ayetler Tanzil metninden, anlamları Diyanet İşleri Başkanlığı mealinden alınmıştır. Ayetin söylemediği ayrıntılar (bir hayvanın adı, türü ya da sayısı gibi) yazılmaz. Çizimler yalnızca hayvanları ve doğayı gösterir; insan ve peygamber çizilmez.</p>
            </div>`;
        hsub.textContent = 'Hayvanlar';
        document.title = 'Kur’an’da Hayvanlar';
        return '';
    }

    // ---------- Hayvan sayfası ----------
    function viewHayvan(h) {
        const c = copy();
        const prev = ALL[h.n - 2], next = ALL[h.n];
        state.seen[h.id] = true; state.last = h.id; save();
        const g = GRUP[h.grup];
        const baglar = [];
        if (h.kissa && h.kissa.p) baglar.push(`<a class="bag" href="../peygamberler/#/p/${h.kissa.p}">${IC.person}<span><small>Peygamberler Yolculuğu’nda</small><b>${esc(h.kissa.pAd || h.kissa.ad)}</b></span></a>`);
        [...new Set(h.ayetler.map(sureNo))].forEach((no) => {
            const r = h.ayetler.find((x) => sureNo(x) === no);
            baglar.push(`<a class="bag" href="../sureler/#/s/${no}">${IC.book}<span><small>Sureler Atlası’nda</small><b>${esc(sureAd(r))} suresi</b></span></a>`);
        });
        const kaynak = ['Kur’an-ı Kerîm, ' + h.ayetler.map(refTxt).join('; ') + ' (meal: ' + DATA.meal + ')'];
        if (h.hadis) kaynak.push(HADIS[h.hadis].kaynak);
        kaynak.push(...h.kaynak);
        const ay = h.ayetler.map(ayBlock).join('');
        app.innerHTML = `
            <div class="page in" style="--hc:${h.renk}">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Hayvanlar</a><span class="pos">${h.n} / ${T}</span></div>
                <section class="sc hero">
                    ${ciz(h, 'buyuk', h.ad + ' çizimi')}
                    <div class="kick">${kid() ? g.emo + ' ' : ''}${esc(g.ad)}</div>
                    <h1>${esc(h.ad)}</h1>
                    <div class="adar"><span class="ar" lang="ar">${esc(ADLAR[h.id] || '')}</span><span class="ok">${esc(h.okunus)}</span><span class="an">“${esc(h.anlam)}”</span></div>
                    ${viewbar()}
                    <p class="lead">${esc(h.kisa)}</p>
                    <div data-anlatim="${dosya(h)}"></div>
                    ${kid() ? `<p class="cocuk-not"><span aria-hidden="true">💡</span> ${esc(h.cocuk)}</p>` : ''}
                    ${baglar.length ? `<div class="baglar">${baglar.join('')}</div>` : ''}
                </section>
                <section class="blok" aria-labelledby="b-ayet">
                    <h2 id="b-ayet">${kid() ? '📖 ' : ''}Ayet${h.ayetler.length > 1 || h.ayetler[0].includes('-') ? 'ler' : ''}</h2>
                    <div class="ayetler delils">${ay}</div>
                </section>
                <section class="blok" aria-labelledby="b-aciklama">
                    <h2 id="b-aciklama">${kid() ? '🔎 ' : ''}Ayet ne anlatıyor?</h2>
                    <div class="aciklama">${h.aciklama.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
                    ${h.gorusFarki ? `<p class="pnote"><b>Görüş farkı:</b> ${esc(h.gorusFarki)}</p>` : ''}
                    ${h.not ? `<p class="pnote"><b>Not:</b> ${esc(h.not)}</p>` : ''}
                </section>
                ${h.hadis ? `<section class="blok" aria-labelledby="b-hadis"><h2 id="b-hadis">${kid() ? '🌙 ' : ''}Hadis</h2>${hadisHtml(h.hadis, { baslik: true })}</section>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(h.akilda)}</p></section>
                ${kid() ? '' : `<p class="pnote"><b>${esc(c.cocukBaslik)}:</b> ${esc(h.cocuk)}</p>`}
                <p class="srccard src"><b>Kaynak:</b> ${kaynak.map(esc).join(' · ')}.</p>
                <nav class="pager" aria-label="Önceki ve sonraki hayvan">
                    ${prev ? `<a href="#/h/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/h/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = h.ad;
        document.title = `${h.ad} | Kur’an’da Hayvanlar`;
        return '';
    }

    // ---------- Merhamet ----------
    function viewMerhamet() {
        const list = DATA.merhamet.sira.map((id) => hadisHtml(id, { baslik: true, hayvan: true })).join('');
        app.innerHTML = `
            <div class="page in" style="--hc:#e76f6f">
                <section class="sc hero">
                    <span class="ciz-kutu buyuk" style="--hc:#e76f6f">${CIZ('merhamet')}</span>
                    <div class="kick">${kid() ? '🤍 ' : ''}Merhamet</div>
                    <h1>Hayvanlara <em>merhamet</em></h1>
                    <p class="lead">${esc(DATA.merhamet.giris)}</p>
                    <div data-anlatim="merhamet"></div>
                </section>
                <div class="merhamet-liste">${list}</div>
                <p class="note"><b>Not:</b> Hadisler yalnızca Buhârî ve Müslim’den, anlam olarak ve kısaltılarak aktarılmıştır. Buhârî numarası genel hadis numarası, Müslim numarası M. Fuâd Abdülbâkî numarasıdır.</p>
            </div>`;
        hsub.textContent = 'Merhamet';
        document.title = 'Merhamet | Kur’an’da Hayvanlar';
        return 'merhamet';
    }

    // ---------- Oyunlar ----------
    const OYUN = {
        sure: { ad: 'Hangi surede?', alt: 'Hayvanı gör, geçtiği sureyi bul.', ornek: 'ari',
            havuz: () => ALL,
            soru: (h) => `${h.ad} hangi surede geçer?`,
            dogru: (h) => sureAd(h.ayetler[0]),
            yanlislar: (h) => { const own = new Set(hayvanSureleri(h)); return [...new Set(ALL.flatMap(hayvanSureleri))].filter((s) => !own.has(s)); },
            aciklama: (h) => `${h.ad}: ${h.ayetler.map((r) => refTxt(r)).join('; ')}.` },
        kissa: { ad: 'Kimin hikâyesi?', alt: 'Hayvanı gör, geçtiği kıssayı bul.', ornek: 'karinca',
            havuz: () => ALL.filter((h) => h.kissa),
            soru: (h) => `${h.ad} kimin hikâyesinde geçer?`,
            dogru: (h) => h.kissa.ad,
            yanlislar: (h) => [...new Set(ALL.filter((x) => x.kissa).map((x) => x.kissa.ad))].filter((k) => k !== h.kissa.ad),
            aciklama: (h) => `${h.ad}: ${h.kisa}` }
    };
    const ROUND = 10;
    let quiz = null;
    const rnd = (n) => Math.floor(Math.random() * n);
    const karistir = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    function newQuiz(tur) {
        const O = OYUN[tur];
        const list = karistir(O.havuz()).slice(0, ROUND).map((h) => ({ h, secenek: karistir([O.dogru(h), ...karistir(O.yanlislar(h)).slice(0, 3)]) }));
        quiz = { tur, list, i: 0, score: 0, answered: null };
    }
    function viewOyunlar() {
        const kart = (tur) => { const O = OYUN[tur], h = BY[O.ornek]; return `<a class="oyunkart" href="#/oyun/${tur}" style="--hc:${h.renk}">${ciz(h)}<b>${esc(O.ad)}</b><small>${esc(O.alt)}</small><span class="en">${esc(copy().best(state.best[tur] || 0))} / ${Math.min(ROUND, O.havuz().length)}</span></a>`; };
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '🎲 ' : ''}Oyunlar</div>
                    <h1>Ne kadar <em>hatırlıyorsun?</em></h1>
                    <p class="lead">Hayvanların hangi surede ve kimin hikâyesinde geçtiğini bul.</p>
                </section>
                <div class="oyunlar">${kart('sure')}${kart('kissa')}</div>
            </div>`;
        hsub.textContent = 'Oyunlar';
        document.title = 'Oyunlar | Kur’an’da Hayvanlar';
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
            app.innerHTML = `<div class="page in"><section class="sc hero"><div class="kick">${kid() ? '🏁 ' : ''}${esc(O.ad)}</div><p class="score">${n}<small> / ${total}</small></p><p class="lead">${esc(c.result(n, total))}</p><p class="prog__txt" style="margin-top:8px">${esc(c.best(state.best[tur]))}</p><div class="btns"><button type="button" class="btn" id="again">${IC.restart}Yeniden başla</button><a class="btn alt" href="#/oyun">${IC.quiz}Oyunlar</a></div></section></div>`;
            document.getElementById('again').addEventListener('click', () => { newQuiz(tur); render(true); });
            if (n === total) burst(app.querySelector('.score'));
        } else {
            const q = quiz.list[quiz.i], ans = quiz.answered, dogru = O.dogru(q.h);
            const ok = ans !== null && ans === dogru;
            const btn = (s, i) => {
                let cls = 'opt2';
                if (ans !== null) cls += s === dogru ? ' is-right' : s === ans ? ' is-wrong' : ' is-dim';
                return `<button type="button" class="${cls}" data-ans="${i}"${ans !== null ? ' disabled' : ''}><span>${esc(s)}</span>${ans !== null && s === dogru ? '<span class="mark" aria-label="doğru cevap">✓</span>' : ''}</button>`;
            };
            app.innerHTML = `
                <div class="page in" style="--hc:${q.h.renk}"><section class="sc">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${total} · ${quiz.score} doğru</span><div class="bar" aria-hidden="true"><b style="width:${pct(quiz.i, total)}%"></b></div></div>
                    ${ciz(q.h, 'quiz__ciz')}
                    <p class="quiz__ask">${kid() ? '🤔 ' : ''}${esc(O.ad)}</p>
                    <p class="quiz__q">${esc(O.soru(q.h))}</p>
                    <div class="opts" role="group" aria-label="Seçenekler">${q.secenek.map(btn).join('')}</div>
                    ${ans !== null ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status"><b>${esc(ok ? c.right : c.wrong)}</b> ${ok ? '' : `Doğru cevap: ${esc(dogru)}. `}${esc(O.aciklama(q.h))} <a href="#/h/${q.h.id}">Sayfasını aç</a></div>
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
        document.title = `${O.ad} | Kur’an’da Hayvanlar`;
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
            <p>Her hayvanın sayfasında hangi bilginin nereden geldiği ayrı ayrı yazılır.</p>
            <ul>
                <li><b>Kur’an:</b> Arapça metin Tanzil Quran Text (Simple), değiştirilmeden. Meal: ${esc(DATA.meal)}. Hayvanın Arapça adı da ayetin Tanzil metninden alınır.</li>
                <li><b>Tefsir bağlamı:</b> TDV İslâm Ansiklopedisi’nin ilgili maddeleri (islamansiklopedisi.org.tr): “Neml Sûresi”, “Hüdhüd”, “Yûnus”, “Sâlih”, “Bakara Sûresi”, “Ashâb-ı Kehf”, “Hâbil ve Kābil”, “Fîl Sûresi”, “Ebrehe”, “Nahl Sûresi”, “Ankebût Sûresi”, “Gāşiye Sûresi”. Müfessirler arasında görüş farkı olan yerlerde sayfada “Görüş farkı” notu vardır.</li>
                <li><b>Hadis:</b> Yalnızca Buhârî ve Müslim. Hadisler anlam olarak, kısaltılarak aktarılır. Buhârî numarası genel hadis numarası, Müslim numarası M. Fuâd Abdülbâkî numarasıdır. Künyeler otomatik olarak denetlenmiştir.</li>
            </ul>
            <h4>Ölçü</h4>
            <p>Ayetin söylemediği ayrıntı yazılmaz: Ashâb-ı Kehf’in köpeğinin adı, Hz. Yûnus’u yutan balığın türü, Hz. İbrâhîm’in kuşlarının türü ya da Hz. Âdem’in oğullarının adları gibi bilgiler Kur’an’da yoktur. Hayvanların yaratılışı üzerine bilimsel “mucize” iddialarına yer verilmez.</p>
            <h4>Görseller</h4>
            <p>Çizimler yalnızca hayvanları, doğayı ve eşyayı gösterir; insan ve peygamber çizilmez. Çocuk temasında renkli, yetişkin temasında tek renklidir.</p>
            <h4>Bağlantılar</h4>
            <p>Peygamber kıssaları Peygamberler Yolculuğu’na, sureler Sureler Atlası’na bağlanır.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da bilgi hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, uygulama ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli çizimler, sıcak renkler.', ['#ffb703', '#c8553d', '#2a9db0'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; tek renkli çizimler.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ hayvanlar · #/h/<id> · #/merhamet · #/oyun · #/oyun/sure · #/oyun/kissa
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mh = h.match(/^h\/([\w-]+)$/), mo = h.match(/^oyun\/(sure|kissa)$/);
        let active;
        if (mh && BY[mh[1]]) active = viewHayvan(BY[mh[1]]);
        else if (h === 'merhamet') active = viewMerhamet();
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
