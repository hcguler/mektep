// ============================================
// Oruç Rehberi — uygulama mantığı
// İçerik: data.js (ORUC_DATA), ayet metinleri: ayetler.js (ORUC_AYETLER), dua metni ve derecesi: kunye.js
// (ORUC_KUNYE); ikisini tools/oruc-uret.mjs üretir. Anlatım metni tools/oruc-anlatim.json içindedir; sayfada
// gösterilmez. Kayıtlar üretildiğinde ../anlatim.js data-anlatim yer tutucularından çalar (apps/CLAUDE.md, 6. bölüm).
// Namaz ve imsak vakti hesaplanmaz; yalnızca namazvakitleri.diyanet.gov.tr bağlantısı verilir.
// ============================================
(function () {
    'use strict';

    const DATA = window.ORUC_DATA;
    const AY = window.ORUC_AYETLER || {};
    const KUNYE = window.ORUC_KUNYE || {};
    const root = document.documentElement;
    const app = document.getElementById('app');
    const tabbar = document.getElementById('tabbar');
    const hsub = document.getElementById('hsub');
    const toastEl = document.getElementById('toast');
    const sheetBg = document.getElementById('sheetBg');
    const sheetBody = document.getElementById('sheetBody');
    if (!DATA || !app) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ALL = DATA.konular.map((k, i) => Object.assign({ n: i + 1 }, k));
    const BY = Object.fromEntries(ALL.map((k) => [k.id, k]));
    const BOL = Object.fromEntries(DATA.bolumler.map((b) => [b.id, b]));
    const HK = DATA.hukumler;
    const T = ALL.length;
    const AYET_SAY = new Set(ALL.flatMap((k) => k.ayetler || [])).size;
    const HADIS_SAY = ALL.reduce((s, k) => s + (k.hadisler || []).length, 0);
    const kayitAdi = (k) => `${String(k.n).padStart(2, '0')}-${k.id}`;
    // Kavram Haritası (../kavram/#/k/<id>) kimlikleri; üretici bunların orada bulunduğunu denetler.
    const KAVRAM = { farz: 'Farz', vacip: 'Vacip', sunnet: 'Sünnet', mustehab: 'Müstehab', 'mekruh-tenzihen': 'Tenzîhen mekruh', 'mekruh-tahrimen': 'Tahrîmen mekruh', haram: 'Haram', niyet: 'Niyet', ruhsat: 'Ruhsat', zaruret: 'Zaruret', guc: 'Güç yetirme' };
    const kavramUrl = (id) => `../kavram/#/k/${id}`;

    // ---------- Kalıcı durum (yalnızca görünüm tercihleri; takip ve sayaç yok) ----------
    const KEY = 'oruc:v1';
    const state = { show: { ar: true, okunus: true, meal: true }, arSize: 2 };
    try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        state.show = Object.assign(state.show, s.show || {});
        if (Number.isInteger(s.arSize)) state.arSize = Math.max(0, Math.min(4, s.arSize));
    } catch (e) { /* varsayılanlarla devam */ }
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* yok say */ } };
    const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
    const kid = () => root.dataset.theme === 'cocuk';

    const COPY = {
        yetiskin: {
            kick: 'Kur’an, sahih sünnet ve Diyanet', title: 'Oruç <em>Rehberi</em>',
            lead: 'Orucum bozuldu mu? Kaza mı, kefaret mi? Hastayım, yolcuyum, ne yapmalıyım? Hangi günler oruç tutulmaz? Ramazan ve nafile oruçların hükümleri, kaynağıyla.',
            bozarAlt: 'Günlük hayattan durumlar: bozar mı, bozmaz mı?',
            dogru: ['Doğru.', 'Evet, doğru.', 'Doğru cevap.'], yanlis: 'Doğru cevap şu:',
            bitti: (d, t) => d === t ? 'Bütün soruları doğru bildiniz.' : `${t} sorudan ${d} tanesini doğru bildiniz.`
        },
        cocuk: {
            kick: 'Ben de oruç tutuyorum! 🌙', title: '<span class="emo">🌙</span> Oruç <em>Rehberi</em>',
            lead: 'Oruç, ergenlik çağına giren büyüklere farzdır. Sana henüz farz değil; ama alıştırma için sen de tutabilirsin! Orucu neler bozar, neler bozmaz? Hadi öğrenelim.',
            bozarAlt: 'Bil bakalım: bu orucu bozar mı? 🤔',
            dogru: ['Harika, doğru! 🎉', 'Aferin, bildin! ⭐', 'Süpersin! 🌟'], yanlis: 'Olsun, yeni bir şey öğrendin! 💡 Doğrusu şu:',
            bitti: (d, t) => d === t ? 'Hepsini bildin, maşallah! 🎉' : `${t} sorudan ${d} tanesini bildin. Her soru yeni bir bilgi! 🌟`
        }
    };
    const copy = () => COPY[root.dataset.theme] || COPY.yetiskin;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (body, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    const IC = {
        rehber: svg('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>'),
        oyun: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><circle cx="12" cy="17.3" r=".4" fill="currentColor"/>'),
        takvim: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="1.6"/>'),
        left: svg('<path d="M15 5l-7 7 7 7"/>', 2),
        right: svg('<path d="m9 5 7 7-7 7"/>', 2),
        search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
        dis: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>')
    };
    const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ’'‘]/g, '');
    const hk = (id, lg) => (id && HK[id] ? `<span class="hk${lg ? ' lg' : ''}" data-hk="${id}" title="${esc(HK[id].aciklama)}">${esc(lg ? HK[id].tam : HK[id].ad)}</span>` : '');
    const dis = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
    const tarihTr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'][m - 1]} ${y}`; };

    let toastTimer = null;
    function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600); }

    // ---------- Gezinme ----------
    const TABS = [
        { id: '', href: '#/', ad: 'Rehber', alt: 'Bölümler ve konular', icon: IC.rehber },
        { id: 'bozar-mi', href: '#/bozar-mi', ad: 'Bozar mı?', alt: 'Kendini dene', icon: IC.oyun },
        { id: 'nafile', href: '#/nafile', ad: 'Çizelge', alt: 'Nafile ve tutulmayan günler', icon: IC.takvim }
    ];
    function drawNav(active) { tabbar.innerHTML = TABS.map((t) => `<a href="${t.href}"${t.id === active ? ' aria-current="page"' : ''}>${t.icon}<span>${esc(t.ad)}</span><small>${esc(t.alt)}</small></a>`).join(''); }

    // ---------- Parçalar ----------
    function konuKart(k) {
        return `<li><a class="og" href="#/k/${k.id}"><span class="th" aria-hidden="true">${k.emo}</span>
                <b>${esc(k.ad)}</b><span class="oz">${esc(k.kisa)}</span>${hk(k.hukum)}</a></li>`;
    }
    const liste = (ks) => `<ul class="ogeler">${ks.map(konuKart).join('')}</ul>`;
    function bolumKartlari(aktif) {
        return `<nav class="bolumler" aria-label="Bölümler">${DATA.bolumler.map((b, i) => `<a class="bk" href="#/b/${b.id}"${b.id === aktif ? ' aria-current="true"' : ''}><span class="emo" aria-hidden="true">${b.emo}</span><span class="n">${i + 1}. bölüm · ${ALL.filter((k) => k.bolum === b.id).length} konu</span><b>${esc(b.ad)}</b><small>${esc(b.alt)}</small></a>`).join('')}</nav>`;
    }
    function ctaKartlari() {
        return `<div class="ctas">
            <a class="cta" href="#/bozar-mi"><span class="emo" aria-hidden="true">❓</span><b>Bozar mı?</b><small>${esc(copy().bozarAlt)}</small><span class="go">${IC.right}</span></a>
            <a class="cta" href="#/nafile"><span class="emo" aria-hidden="true">📅</span><b>Oruç çizelgesi</b><small>Nafile oruçlar ve oruç tutulmayan günler, hicrî aylara göre.</small><span class="go">${IC.right}</span></a>
        </div>`;
    }

    // ---------- Ana ekran ----------
    let aramaMetni = '';
    function viewHome() {
        const c = copy();
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${esc(c.kick)}</div>
                    <h1>${c.title}</h1>
                    <p class="lead">${esc(c.lead)}</p>
                    <div data-anlatim="tam giris"></div>
                    <div class="stats"><span><b>${DATA.bolumler.length}</b> bölüm</span><span><b>${T}</b> konu</span><span><b>${AYET_SAY}</b> ayet grubu</span><span><b>${HADIS_SAY}</b> sahih hadis</span></div>
                </section>
                ${ctaKartlari()}
                <div class="filters">
                    <label class="search">${IC.search}<span class="sr">Konu ara</span><input type="search" id="ara" placeholder="Ara: diş, iğne, yolcu, fidye, Aşure…" value="${esc(aramaMetni)}" autocomplete="off"></label>
                </div>
                <div id="sonuc" aria-live="polite"></div>
                ${bolumKartlari()}
            </div>`;
        const sonuc = document.getElementById('sonuc'), ara = document.getElementById('ara');
        const ciz = () => {
            const q = norm(aramaMetni.trim());
            if (!q) { sonuc.innerHTML = ''; return; }
            const ks = ALL.filter((k) => norm([k.ad, k.kisa, k.aciklama.join(' '), k.ornek || '', k.hukum ? HK[k.hukum].tam : '', BOL[k.bolum].ad].join(' ')).includes(q));
            sonuc.innerHTML = ks.length ? `<section class="grup"><h2>Arama<small>${ks.length} konu</small></h2>${liste(ks)}</section>` : '<p class="empty">Bu aramaya uyan konu yok.</p>';
        };
        ciz();
        ara.addEventListener('input', () => { aramaMetni = ara.value; ciz(); });
        hsub.textContent = 'Rehber';
        document.title = 'Oruç Rehberi';
        return '';
    }

    // ---------- Bölüm ----------
    function viewBolum(b) {
        const ks = ALL.filter((k) => k.bolum === b.id);
        const i = DATA.bolumler.indexOf(b);
        const cocukNot = b.id === 'ruhsat' && kid() ? '<p class="kutu ornek">🧒 Sen henüz küçüksün; oruç sana farz değil. Tuttuğun her oruç güzel bir alıştırma! <a href="#/k/cocuk">Çocuk ve oruç</a></p>' : '';
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/">${IC.left}Rehber</a><span class="pos">${i + 1} / ${DATA.bolumler.length}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? b.emo + ' ' : ''}${i + 1}. bölüm</div>
                    <h1>${esc(b.ad)}</h1>
                    <p class="lead">${esc(b.alt)}</p>
                </section>
                ${cocukNot}
                ${liste(ks)}
                <nav class="pager" aria-label="Önceki ve sonraki bölüm">
                    ${i > 0 ? `<a href="#/b/${DATA.bolumler[i - 1].id}"><small>Önceki bölüm</small><b>${esc(DATA.bolumler[i - 1].ad)}</b></a>` : ''}
                    ${i < DATA.bolumler.length - 1 ? `<a class="next" href="#/b/${DATA.bolumler[i + 1].id}"><small>Sonraki bölüm</small><b>${esc(DATA.bolumler[i + 1].ad)}</b></a>` : ''}
                </nav>
            </div>`;
        hsub.textContent = b.ad;
        document.title = `${b.ad} | Oruç Rehberi`;
        return '';
    }

    // ---------- Konu sayfası ----------
    function viewbar(keys) {
        const ad = { ar: 'Arapça', okunus: 'Okunuş', meal: 'Anlam' };
        const chip = (k) => `<button type="button" class="chip" data-show="${k}" aria-pressed="${state.show[k]}"><i aria-hidden="true"></i>${ad[k]}</button>`;
        return `<div class="viewbar" role="group" aria-label="Gösterilecek metinler">
                <div class="chips" style="--n:${keys.length}">${keys.map(chip).join('')}</div>
                <div class="size" role="group" aria-label="Arapça yazı boyutu"><button type="button" data-size="-1" aria-label="Arapça yazıyı küçült">ع</button><button type="button" data-size="1" aria-label="Arapça yazıyı büyüt">ع</button></div>
            </div>`;
    }
    function bindView() {
        const boxes = app.querySelectorAll('.metinler');
        const apply = () => {
            boxes.forEach((box) => { ['ar', 'okunus', 'meal'].forEach((k) => box.classList.toggle('hide-' + k, !state.show[k])); box.dataset.ar = state.arSize; });
            app.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(state.show[b.dataset.show])));
            app.querySelectorAll('.viewbar').forEach((vb) => { const sb = vb.querySelectorAll('[data-size]'); sb[0].disabled = state.arSize <= 0 || !state.show.ar; sb[1].disabled = state.arSize >= 4 || !state.show.ar; });
        };
        apply();
        app.querySelectorAll('[data-show]').forEach((b) => b.addEventListener('click', () => {
            const k = b.dataset.show;
            const keys = Array.from(b.closest('.viewbar').querySelectorAll('[data-show]')).map((x) => x.dataset.show);
            if (state.show[k] && keys.filter((x) => state.show[x]).length === 1) { toast('En az bir metin açık kalmalı.'); return; }
            state.show[k] = !state.show[k]; save(); apply();
        }));
        app.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => { state.arSize = Math.max(0, Math.min(4, state.arSize + Number(b.dataset.size))); save(); apply(); }));
    }
    function degerKutu(ad) {
        const v = DATA.degerler[ad];
        if (!v || v.tutar == null) return `<div class="kutu deger"><b>Güncel tutar</b><span class="tutar">—</span>Güncel tutar için Diyanet’in açıklamasına bakın.</div>`;
        return `<div class="kutu deger"><b>${esc(v.ne[0].toLocaleUpperCase('tr') + v.ne.slice(1))}</b>
            <span class="tutar">${esc(String(v.tutar))} ${esc(v.birim)}</span>
            ${tarihTr(v.tarih)} tarihinde Diyanet İşleri Başkanlığı Din İşleri Yüksek Kurulu’nun açıkladığı asgari tutar; ${esc(v.donem)} geçerlidir.
            <small>${esc(v.not)} Kaynak: ${dis(v.url, v.kaynak)}.</small></div>`;
    }
    function hadisKart(h, riv) {
        return `<figure class="hadis"><p>“${esc(h.metin)}”</p><figcaption class="ravi"><span>Râvi: <b>${esc(h.ravi)}</b></span><span>${esc(h.kaynak)}</span></figcaption>${riv ? `<p class="sihhat"><b>Sıhhat:</b> ${esc(h.sihhat)}</p>` : ''}</figure>`;
    }
    function viewKonu(k) {
        const prev = ALL[k.n - 2], next = ALL[k.n];
        const b = BOL[k.bolum];
        const ayetler = (k.ayetler || []).filter((r) => AY[r]);
        const dua = k.dua && KUNYE[k.dua.kunye];
        const h = k.hukum && HK[k.hukum];
        const kavramlar = (k.kavramlar || []).filter((c) => KAVRAM[c]);
        const hkRow = h ? `<div class="hkrow">${hk(k.hukum, true)}${h.kavram ? `<a class="kv" href="${kavramUrl(h.kavram)}">${esc(KAVRAM[h.kavram] || h.ad)} nedir? →</a>` : ''}</div>` : '';
        const vakit = k.vakitBaglantisi ? `<p class="kutu">🕰️ <b>Vakitler:</b> Bu uygulama imsak ve iftar vaktini hesaplamaz. Bulunduğunuz yerin vakti için ${dis(DATA.vakitler, 'Diyanet namaz vakitleri')} sayfasına bakın.</p>` : '';
        app.innerHTML = `
            <div class="page in">
                <div class="crumbs"><a class="nb" href="#/b/${b.id}">${IC.left}${esc(b.ad)}</a><span class="pos">${k.n} / ${T}</span></div>
                <section class="sc hero">
                    <div class="kick">${kid() ? k.emo + ' ' : ''}${esc(b.ad)}</div>
                    <h1>${esc(k.ad)}</h1>
                    <p class="lead">${esc(k.kisa)}</p>
                    ${hkRow}
                    <div data-anlatim="${kayitAdi(k)}"></div>
                </section>
                ${k.saglik ? '<p class="kutu uyari">🩺 <b>Sağlık:</b> Bu bilgi tıbbi tavsiye değildir. Kendi durumunuz için doktorunuza ve müftülüğe danışın.</p>' : ''}
                ${k.id === 'cocuk' && kid() ? '<p class="kutu ornek">🌙 <b>Ben de oruç tutuyorum!</b> Oruç sana henüz farz değil; tuttuğun her oruç, büyüyünce kolayca tutman için güzel bir alıştırma. Zorlanırsan büyüklerine söyle.</p>' : ''}
                <section class="sc expl"><div class="kick">Kısaca</div>${k.aciklama.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
                ${k.ornek ? `<p class="kutu ornek"><b>Örnek:</b> ${esc(k.ornek)}</p>` : ''}
                ${k.mezhep ? `<p class="kutu mezhep"><b>Mezhep farkı:</b> ${esc(k.mezhep)}</p>` : ''}
                ${k.deger ? degerKutu(k.deger) : ''}
                ${vakit}
                ${k.baglanti ? `<a class="cta" href="${esc(k.baglanti.href)}"><span class="emo" aria-hidden="true">💚</span><b>${esc(k.baglanti.ad)}</b><small>Fitre, zekât ve sadakanın ayrıntıları.</small><span class="go">${IC.right}</span></a>` : ''}
                ${dua ? `<section class="blok"><h2>Dua <small>${esc(dua.kaynak)}</small></h2>${viewbar(['ar', 'okunus', 'meal'])}<div class="metinler"><div class="dua"><p class="ar" lang="ar">${esc(dua.ar)}</p><p class="okunus">${esc(k.dua.okunus)}</p><p class="meal">${esc(k.dua.anlam)}</p><p class="ref">${esc(dua.kaynak)} · Arapça metin: hadith-api (Ebû Dâvûd)</p></div></div></section>` : ''}
                ${ayetler.length ? `<section class="blok"><h2>Kur’an</h2>${dua ? '' : viewbar(['ar', 'meal'])}<div class="metinler">${ayetler.map((r) => { const a = AY[r]; return `<div class="ayet"><p class="ar" lang="ar">${esc(a.ar)}</p><p class="meal">${esc(a.meal)}</p><p class="ref">${esc(a.sure)} Suresi, ${esc(a.no)}. ayet</p></div>`; }).join('')}</div></section>` : ''}
                ${(k.hadisler || []).length ? `<section class="blok"><h2>Sünnet <small>sahih hadis</small></h2>${k.hadisler.map((x) => hadisKart(x)).join('')}</section>` : ''}
                ${(k.rivayetler || []).length ? `<section class="blok"><h2>Rivayet <small>Ebû Dâvûd, Tirmizî</small></h2>${k.rivayetler.map((x) => hadisKart(x, true)).join('')}</section>` : ''}
                ${kavramlar.length ? `<section class="blok"><h2>Kavram Haritası</h2><nav class="chiprow" aria-label="İlgili kavramlar">${kavramlar.map((c) => `<a href="${kavramUrl(c)}">${esc(KAVRAM[c])}</a>`).join('')}</nav></section>` : ''}
                <section class="sc memo"><div class="kick">Akılda kalsın</div><p class="quote">${esc(k.akilda)}</p></section>
                <div class="srccard src"><b>Kaynak</b><ul class="srclist">${k.kaynak.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>${ayetler.length ? `<p class="srclist">Arapça: Tanzil. Meal: ${esc(DATA.meal)}.</p>` : ''}${(k.hadisler || []).length ? '<p class="srclist">Hadis metinleri anlam olarak aktarılmıştır.</p>' : ''}<p class="srclist">SSS: Diyanet, Oruç Sıkça Sorulanlar · İlmihal: Diyanet İlmihali I, Oruç bölümü.</p></div>
                <nav class="pager" aria-label="Önceki ve sonraki konu">
                    ${prev ? `<a href="#/k/${prev.id}"><small>Önceki</small><b>${esc(prev.ad)}</b></a>` : ''}
                    ${next ? `<a class="next" href="#/k/${next.id}"><small>Sonraki</small><b>${esc(next.ad)}</b></a>` : ''}
                </nav>
            </div>`;
        bindView();
        hsub.textContent = k.ad;
        document.title = `${k.ad} | Oruç Rehberi`;
        return '';
    }

    // ---------- Bozar mı? ----------
    const SECENEK = ['bozmaz', 'bozar-kaza', 'bozar-kefaret'];
    let quiz = null;
    function karistir(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
    function yeniOyun() { quiz = { list: karistir(DATA.sorular).slice(0, 10), i: 0, dogru: 0, cevap: null }; }
    function viewOyun() {
        if (!quiz) yeniOyun();
        const c = copy();
        const t = quiz.list.length;
        if (quiz.i >= t) {
            app.innerHTML = `
                <div class="page in">
                    <section class="sc hero quiz">
                        <div class="kick">Bozar mı?</div>
                        <p class="score">${quiz.dogru}<small> / ${t}</small></p>
                        <p class="lead">${esc(c.bitti(quiz.dogru, t))}</p>
                        <div class="btns"><button type="button" class="btn" id="tekrar">Yeniden oyna</button><a class="btn alt" href="#/b/bozan">Orucu bozanlar</a><a class="btn alt" href="#/b/bozmayan">Bozmayanlar</a></div>
                    </section>
                </div>`;
            document.getElementById('tekrar').addEventListener('click', () => { yeniOyun(); render(true); document.getElementById('app').focus({ preventScroll: true }); });
            hsub.textContent = 'Bozar mı?';
            document.title = 'Bozar mı? | Oruç Rehberi';
            return 'bozar-mi';
        }
        const s = quiz.list[quiz.i], k = BY[s.konu];
        const cevaplandi = quiz.cevap !== null;
        const opt = (id) => {
            let cls = '';
            if (cevaplandi) cls = id === s.cevap ? ' is-right' : id === quiz.cevap ? ' is-wrong' : ' is-dim';
            const mark = cevaplandi && id === s.cevap ? '<span class="mark">✓</span>' : cevaplandi && id === quiz.cevap ? '<span class="mark">✗</span>' : '';
            return `<button type="button" class="opt2${cls}" data-c="${id}" data-cevap="${id}"${cevaplandi ? ' disabled' : ''}><span class="dot" style="background:var(--c)" aria-hidden="true"></span>${esc(HK[id].tam)}${mark}</button>`;
        };
        const ok = quiz.cevap === s.cevap;
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero quiz">
                    <div class="quiz__top"><span class="quiz__count">Soru ${quiz.i + 1} / ${t} · ${quiz.dogru} doğru</span><div class="bar" role="progressbar" aria-label="İlerleme" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${quiz.i}"><b style="width:${Math.round((100 * quiz.i) / t)}%"></b></div></div>
                    <p class="quiz__ask">${kid() ? '🤔 ' : ''}Oruçluyken…</p>
                    <h1 class="quiz__q">${esc(s.soru)}</h1>
                    <p class="quiz__ref">Bu, orucumu bozar mı?</p>
                    <div class="opts" role="group" aria-label="Cevaplar">${SECENEK.map(opt).join('')}</div>
                    ${cevaplandi ? `<div class="fb ${ok ? 'ok' : 'no'}" role="status">
                        <p><b>${esc(ok ? c.dogru[quiz.i % c.dogru.length] : c.yanlis)}</b> ${hk(s.cevap, true)}</p>
                        <p>${esc(s.aciklama || k.aciklama[0])}</p>
                        ${k.mezhep ? `<p><b>Mezhep farkı:</b> ${esc(k.mezhep)}</p>` : ''}
                        <p><b>Kaynak:</b> ${esc(k.kaynak.join('; '))} · <a href="#/k/${k.id}">${esc(k.ad)} konusunu aç</a></p>
                    </div>
                    <div class="btns"><button type="button" class="btn" id="sonraki">${quiz.i + 1 < t ? 'Sonraki soru' : 'Sonucu gör'}</button></div>` : ''}
                </section>
            </div>`;
        app.querySelectorAll('[data-cevap]').forEach((bt) => bt.addEventListener('click', () => {
            if (quiz.cevap !== null) return;
            quiz.cevap = bt.dataset.cevap;
            if (quiz.cevap === s.cevap) quiz.dogru++;
            render(false);
            const nx = document.getElementById('sonraki'); if (nx) nx.focus({ preventScroll: true });
        }));
        const nx = document.getElementById('sonraki');
        if (nx) nx.addEventListener('click', () => { quiz.i++; quiz.cevap = null; render(true); window.scrollTo(0, 0); const f = app.querySelector('[data-cevap]'); if (f) f.focus({ preventScroll: true }); });
        hsub.textContent = 'Bozar mı?';
        document.title = 'Bozar mı? | Oruç Rehberi';
        return 'bozar-mi';
    }

    // ---------- Çizelge ----------
    const TUR = { tavsiye: 'Tavsiye', farz: 'Farz', mekruh: 'Mekruh', yasak: 'Tutulmaz' };
    function viewNafile() {
        app.innerHTML = `
            <div class="page in">
                <section class="sc hero">
                    <div class="kick">${kid() ? '📅 ' : ''}Hicrî aylara göre</div>
                    <h1>Oruç <em>çizelgesi</em></h1>
                    <p class="lead">Tavsiye edilen nafile oruçlar ve oruç tutulmayan günler. Hicrî tarihlerin bu yılki karşılığı için Diyanet’in takvimine bakın.</p>
                    <div class="legend2 hkrow">${Object.entries(TUR).map(([t, ad]) => `<span class="tg" data-t="${t}">${ad}</span>`).join('')}</div>
                </section>
                <div class="cizelge">${DATA.cizelge.map((a) => `<section class="ay"><h3>${esc(a.ay)}</h3><ul>${a.satirlar.map((r) => `<li><a href="#/k/${r.konu}"><span class="gun">${esc(r.gun)}</span><span class="ne"><span class="tg" data-t="${r.tur}">${TUR[r.tur]}</span>${esc(r.ad)}</span></a></li>`).join('')}</ul></section>`).join('')}</div>
                <p class="kutu">🕰️ <b>Vakitler:</b> İmsak ve iftar vakitleri yere göre değişir; uygulama hesaplamaz. ${dis(DATA.vakitler, 'Diyanet namaz vakitleri')}</p>
            </div>`;
        hsub.textContent = 'Çizelge';
        document.title = 'Oruç çizelgesi | Oruç Rehberi';
        return 'nafile';
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
        return `<h3 id="sheetTitle">Kaynaklar</h3>
            <p>Hükümler Diyanet İşleri Başkanlığı’na göre verilmiştir. Hanefî görüş ana metindir; Şâfiî mezhebinin farkı yalnızca önemli yerlerde ayrıca yazılmıştır.</p>
            <ul>${DATA.kaynaklar.map((s) => `<li><b>${s.url ? dis(s.url, s.ad) : esc(s.ad)}</b> ${esc(s.not)}</li>`).join('')}</ul>
            <h4>Hüküm rozetleri</h4>
            <ul>${Object.entries(HK).map(([id, h]) => `<li>${hk(id)} ${esc(h.aciklama)}.</li>`).join('')}</ul>
            <h4>Not</h4>
            <p>Bu uygulama bir öğrenme rehberidir; kişiye özel fetva ve tıbbi tavsiye vermez. Kişisel durumunuz için Diyanet’e (müftülükler, 190 Alo Fetva hattı) ve sağlıkla ilgili konularda doktorunuza danışın.</p>
            <h4>Hata bildirimi</h4>
            <p>Bir yazım ya da anlam hatası görürseniz <a href="https://github.com/hcguler/mektep/issues" target="_blank" rel="noopener">bildirin</a>; düzeltelim.</p>
            <p class="amin">“Allah size kolaylık ister, zorluk istemez.” (Bakara 185)</p>`;
    }
    function lookHtml() {
        const t = root.dataset.theme, m = root.dataset.mode;
        const opt = (attr, val, on, title, desc, sw) => `<button type="button" class="opt" ${attr}="${val}" aria-pressed="${on}"><span class="sws">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</span><b>${title}</b><small>${desc}</small></button>`;
        return `<h3 id="sheetTitle">Görünüm</h3><p>Tema, Mektep ana ekranındaki seçimle ve diğer uygulamalarla ortaktır.</p>
            <h4>Tema</h4><div class="optrow">${opt('data-set-theme', 'cocuk', t === 'cocuk', 'Çocuk', 'Renkli ve sıcak; kısa cümleler.', ['#ffb703', '#7b61ff', '#219ebc'])}${opt('data-set-theme', 'yetiskin', t === 'yetiskin', 'Yetişkin', 'Sakin ve ciddi; okumaya odaklanır.', ['#1d5a47', '#dab56d', '#f3ecdf'])}</div>
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
    // #/ rehber · #/b/<bölüm> · #/k/<konu> · #/bozar-mi · #/nafile
    let lastHash = null;
    function render(animate) {
        const h = location.hash.replace(/^#\/?/, '');
        const mk = h.match(/^k\/([\w-]+)$/), mb = h.match(/^b\/([\w-]+)$/);
        let active;
        if (mk && BY[mk[1]]) active = viewKonu(BY[mk[1]]);
        else if (mb && BOL[mb[1]]) active = viewBolum(BOL[mb[1]]);
        else if (h === 'bozar-mi') active = viewOyun();
        else if (h === 'nafile') active = viewNafile();
        else active = viewHome();
        drawNav(active);
        if (!animate) app.querySelectorAll('.page.in').forEach((p) => p.classList.remove('in'));
    }
    function route() {
        const h = location.hash.replace(/^#\/?/, '');
        const changed = lastHash !== null && lastHash !== h;
        if (changed && lastHash === 'bozar-mi' && quiz && quiz.i >= quiz.list.length) quiz = null;
        lastHash = h;
        render(true);
        if (changed) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
    }
    window.addEventListener('hashchange', route);
    route();
    paint();
})();
