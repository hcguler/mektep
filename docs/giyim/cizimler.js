// ============================================
// Giyim ve Görünüş — çizimler (SVG)
// --------------------------------------------
// Bütün figürler yüzsüzdür ve genel insan figürüdür; peygamberlerin ve sahabenin yüzü, bedeni çizilmez
// (docs/planlar/README.md). Renkler CSS değişkenlerinden gelir (giyim.css: .cz ve --cz-*), böylece iki tema ve
// açık / koyu renkte çizim kendiliğinden uyar.
//
// GIYIM_CIZIM.ciz(ad, secenek) → SVG metni.  GIYIM_CIZIM.bilgi[ad] → { alt, not, liste? }
// Örtünme çizimleri (erkek-avret, kadin-avret) secenek.mezhep ile ('hanefi' | 'safii') sınırı gösterir.
// ============================================
(function () {
    'use strict';

    const svg = (vb, body, alt) => `<svg class="cz" viewBox="${vb}" role="img" aria-label="${alt}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
    const ok = (x, y) => `<g class="cz-ok" transform="translate(${x} ${y})"><circle r="13"/><path d="M-6 0l4 4 8-8"/></g>`;
    const no = (x, y) => `<g class="cz-no" transform="translate(${x} ${y})"><circle r="13"/><path d="M-5-5l10 10M5-5-5 5"/></g>`;
    const uyari = (x, y) => `<g class="cz-uy" transform="translate(${x} ${y})"><circle r="13"/><path d="M0-6v7M0 5.5v.5"/></g>`;
    const HATCH = '<defs><pattern id="czh" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" class="cz-zn-bg"/><path d="M0 0v8" class="cz-zn-ln"/></pattern></defs>';

    // ---------- Figürler (yüzsüz) ----------
    // Erkek: kısa saç, sakal ve kısaltılmış bıyık; gömlek ve pantolon. Göbek ≈ y150, diz ≈ y232.
    function erkek() {
        return `<g class="cz-fig">
            <path class="cz-c2" d="M76 166h88l-6 112h-30l-8-86-8 86H82z"/>
            <ellipse class="cz-sh" cx="97" cy="282" rx="17" ry="6"/><ellipse class="cz-sh" cx="143" cy="282" rx="17" ry="6"/>
            <path class="cz-c1" d="M80 94q40-12 80 0l10 76H70z"/>
            <path class="cz-c1" d="M80 95 60 166l13 5 17-52zM160 95l20 71-13 5-17-52z"/>
            <circle class="cz-sk" cx="66" cy="176" r="8"/><circle class="cz-sk" cx="174" cy="176" r="8"/>
            <path class="cz-ln" d="M120 100v66M112 108h0M112 124h0M112 140h0"/>
            <rect class="cz-sk" x="111" y="72" width="18" height="18" rx="6"/>
            <circle class="cz-sk" cx="120" cy="54" r="24"/>
            <path class="cz-hr" d="M96 52c0-18 11-27 24-27s24 9 24 27c-3-7-10-12-24-12s-21 5-24 12z"/>
            <path class="cz-hr" d="M97 56c1 22 10 34 23 35 13-1 22-13 23-35-3 8-9 12-14 13-3-3-6-4-9-4s-6 1-9 4c-5-1-11-5-14-13z"/>
            <path class="cz-hr cz-biyik" d="M110 66c4-3 7-3 10-1 3-2 6-2 10 1-4 1-7 1-10 0-3 1-6 1-10 0z"/>
        </g>`;
    }
    // Kadın: başörtüsü yakaların üzerine; bol, uzun elbise; yüz, eller ve ayaklar açık.
    function kadin(m) {
        const ayakOrtulu = m === 'safii';
        return `<g class="cz-fig">
            <ellipse class="${ayakOrtulu ? 'cz-c2' : 'cz-sk'}" cx="104" cy="286" rx="12" ry="5"/><ellipse class="${ayakOrtulu ? 'cz-c2' : 'cz-sk'}" cx="136" cy="286" rx="12" ry="5"/>
            <path class="cz-c1" d="M92 108h56l30 176H62z"/>
            <path class="cz-ln" d="M120 128v150M98 200q22 8 44 0"/>
            <path class="cz-c1" d="M94 110 62 184l13 6 30-58zM146 110l32 74-13 6-30-58z"/>
            <circle class="cz-sk" cx="68" cy="192" r="8"/><circle class="cz-sk" cx="172" cy="192" r="8"/>
            <path class="cz-c2" d="M120 22c-27 0-36 24-34 46-5 20-9 40 4 54 9 10 20 14 30 14s21-4 30-14c13-14 9-34 4-54 2-22-7-46-34-46z"/>
            <path class="cz-c2-d" d="M92 92q28 22 56 0"/>
            <ellipse class="cz-sk" cx="120" cy="60" rx="15" ry="19"/>
        </g>`;
    }
    // Çocuk: yuvarlak hatlar, kısa saç, tişört ve pantolon.
    function cocuk(x, y, s) {
        return `<g class="cz-fig" transform="translate(${x || 0} ${y || 0}) scale(${s || 1})">
            <path class="cz-c2" d="M90 176h60l-4 92h-22l-4-62-4 62H94z"/>
            <ellipse class="cz-sh" cx="105" cy="271" rx="13" ry="5"/><ellipse class="cz-sh" cx="135" cy="271" rx="13" ry="5"/>
            <path class="cz-c3" d="M92 122q28-8 56 0l8 58H84z"/>
            <path class="cz-c3" d="M92 123 76 168l11 4 13-36zM148 123l16 45-11 4-13-36z"/>
            <circle class="cz-sk" cx="81" cy="175" r="7"/><circle class="cz-sk" cx="159" cy="175" r="7"/>
            <rect class="cz-sk" x="113" y="104" width="14" height="14" rx="5"/>
            <circle class="cz-sk" cx="120" cy="82" r="27"/>
            <path class="cz-hr" d="M93 80c0-20 12-31 27-31s27 11 27 31c-5-9-14-14-27-14s-22 5-27 14z"/>
        </g>`;
    }

    // ---------- Örtünme sınırı ----------
    function erkekAvret(m) {
        const saf = m === 'safii';
        // Hanefî: göbek altından diz kapağı dahil; Şâfiî / Hanbelî: göbek ve diz kapağı hariç
        const y1 = 152, y2 = saf ? 224 : 242;
        return svg('0 0 240 300', `${HATCH}${erkek()}
            <rect class="cz-zn" x="70" y="${y1}" width="100" height="${y2 - y1}" rx="10"/>
            <circle class="cz-diz${saf ? '' : ' is-in'}" cx="97" cy="233" r="7"/><circle class="cz-diz${saf ? '' : ' is-in'}" cx="143" cy="233" r="7"/>
            <path class="cz-olc" d="M184 ${y1}h12M190 ${y1}v${y2 - y1}M184 ${y2}h12"/>
            <circle class="cz-gobek" cx="120" cy="148" r="3"/>`,
            saf ? 'Erkeğin örtmesi gereken yer, Şâfiî ve Hanbelî mezhebine göre: göbek ile diz kapağı arası, ikisi de hariç' : 'Erkeğin örtmesi gereken yer, Hanefî mezhebine göre: göbek altından diz kapağına kadar, diz kapağı dahil');
    }
    function kadinAvret(m) {
        const saf = m === 'safii';
        const halka = (cx, cy, rx, ry) => `<ellipse class="cz-acik" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
        return svg('0 0 240 300', `${kadin(m)}${halka(120, 60, 21, 25)}${halka(68, 192, 14, 14)}${halka(172, 192, 14, 14)}${saf ? '' : halka(104, 286, 18, 10) + halka(136, 286, 18, 10)}`,
            saf ? 'Kadın, Şâfiî ve Hanbelî mezhebine göre namazda: yüz ve eller dışında bütün beden örtülür; ayaklar da örtülür' : 'Kadın, Hanefî mezhebine göre: yüz, eller ve ayaklar dışında, sarkan saçlar dahil bütün beden örtülür');
    }

    // ---------- Konu çizimleri ----------
    const D = {
        'uclu': () => svg('0 0 360 300', `<g transform="translate(-30 4) scale(.98)">${erkek()}</g><g transform="translate(150 4) scale(.98)">${kadin()}</g>${cocuk(60, 40, .9)}`, 'Bir erkek, bir kadın ve bir çocuk; yüzsüz, sade figürler'),
        'iki': () => svg('0 0 360 300', `<g transform="translate(-20 4)">${erkek()}</g><g transform="translate(140 4)">${kadin()}</g>`, 'Bir erkek ve bir kadın, her biri kendi kıyafetiyle'),
        'cocuk': () => svg('0 0 240 300', cocuk(0, 14, 1), 'Tişört ve pantolon giymiş bir çocuk'),
        'erkek-avret': (o) => erkekAvret(o && o.mezhep),
        'kadin-avret': (o) => kadinAvret(o && o.mezhep),
        'aski': () => svg('0 0 240 220', `<path class="cz-ln2" d="M120 40a12 12 0 1 1 12 12c-6 0-12 4-12 10v6"/><path class="cz-ln2" d="M120 68 40 110h160z"/>
            <path class="cz-c1" d="M66 110h108l14 18-22 10v62H74v-62l-22-10z"/><path class="cz-ln" d="M120 112v88M104 112l16 18 16-18"/>
            <path class="cz-ac" d="M178 52l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/>`, 'Askıda bir gömlek; elbise bir nimettir'),
        'mescid': () => svg('0 0 240 220', `<path class="cz-c2" d="M50 200V110q0-60 70-80 70 20 70 80v90z"/><path class="cz-bg" d="M86 200v-70q0-34 34-48 34 14 34 48v70z"/>
            <path class="cz-ac" d="M120 8a10 10 0 1 0 8 16 8 8 0 1 1-8-16z"/><path class="cz-ln2" d="M120 26v8"/>
            <g transform="translate(78 92) scale(.36)">${erkek()}</g>`, 'Mescid kapısında güzel giyinmiş biri'),
        'damla': () => svg('0 0 240 220', `<path class="cz-c1" d="M70 90h100l14 18-20 9v73H76v-73l-20-9z"/><path class="cz-ln" d="M120 92v98"/>
            <path class="cz-su" d="M170 24c14 18 22 30 22 42a22 22 0 0 1-44 0c0-12 8-24 22-42z"/>
            <path class="cz-ac" d="M60 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM196 120l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>`, 'Temiz bir gömlek ve bir su damlası'),
        'fitrat': () => svg('0 0 300 120', [['M-8-6l16 12M-8 6 8-6', 'Sünnet'], ['M-8 4q8-14 16 0', 'Kasık'], ['M-9 2q4-6 9-2 5-4 9 2', 'Bıyık'], ['M-6 6V-4a6 6 0 0 1 12 0v10', 'Tırnak'], ['M-8 0h16M0-8v16', 'Koltuk altı']]
            .map((g, i) => `<g transform="translate(${30 + i * 60} 46)"><circle class="cz-rozet" r="24"/><text class="cz-no-t" y="5">${i + 1}</text></g><text class="cz-etk" x="${30 + i * 60}" y="100">${g[1]}</text>`).join(''), 'Fıtrattan sayılan beş temizlik'),
        'ayakkabi': () => svg('0 0 280 180', `<g transform="translate(150 40)"><path class="cz-c1" d="M10 20q0-16 18-16h20q16 0 18 22l2 50q2 22-20 22H34q-24 0-24-26z"/><path class="cz-ln" d="M24 30h30M24 44h30"/></g>
            <g transform="translate(40 40)"><path class="cz-c2" d="M80 20q0-16-18-16H42Q26 4 24 26l-2 50q-2 22 20 22h14q24 0 24-26z"/><path class="cz-ln" d="M36 30h30M36 44h30"/></g>
            <g class="cz-sira" transform="translate(190 160)"><circle r="14"/><text y="5">1</text></g><g class="cz-sira is-2" transform="translate(92 160)"><circle r="14"/><text y="5">2</text></g>
            <text class="cz-etk" x="190" y="32">Sağ</text><text class="cz-etk" x="92" y="32">Sol</text>`, 'Bir çift ayakkabı: önce sağ, sonra sol giyilir'),
        'yasak': () => svg('0 0 300 130', [
            ['<path class="cz-ln2" d="M-14 14 10-10M6-14l8 8M-16 16l-3 3"/>', 'Dövme'],
            ['<path class="cz-ln2" d="M-10-14 0 14 10-14"/>', 'Kaş aldırma'],
            ['<path class="cz-ln2" d="M-14 10q6-26 14-24 8-2 14 24M-6 12q2-14 6-16 4 2 6 16"/>', 'Saç ekleme']
        ].map((g, i) => `<g transform="translate(${55 + i * 95} 52)"><circle class="cz-rozet" r="30"/>${g[0]}<path class="cz-cizgi" d="M-21-21 21 21"/></g><text class="cz-etk" x="${55 + i * 95}" y="115">${g[1]}</text>`).join(''), 'Dövme, kaş aldırma ve saç ekleme süs amacıyla yapılmaz'),
        'tarak': () => svg('0 0 240 200', `<rect class="cz-c2" x="40" y="60" width="160" height="34" rx="10"/><path class="cz-ln2" d="${Array.from({ length: 14 }, (_, i) => `M${52 + i * 10.5} 94v40`).join('')}"/>
            <path class="cz-hr-ln" d="M30 170q40-30 90-10t90-10"/><path class="cz-hr-ln" d="M30 184q40-30 90-10t90-10"/>
            <path class="cz-ac" d="M206 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/>`, 'Bir tarak ve taranmış saç telleri'),
        'boya': () => svg('0 0 320 170', [['cz-gri', 'Ağarmış'], ['cz-kina', 'Kına, kahve'], ['cz-siyah', 'Siyah']].map((h, i) => `<g transform="translate(${55 + i * 105} 64)">
            <circle class="cz-sk" r="34"/><path class="${h[0]}" d="M-34-2c0-26 15-38 34-38S34-28 34-2c-6-12-18-18-34-18s-28 6-34 18z"/>
            <path class="${h[0]}" d="M-30 6c2 24 14 36 30 37 16-1 28-13 30-37-5 10-12 14-18 15-4-3-8-4-12-4s-8 1-12 4c-6-1-13-5-18-15z"/></g>
            <text class="cz-etk" x="${55 + i * 105}" y="158">${h[1]}</text>`).join('') + ok(195, 30) + uyari(300, 30), 'Ağarmış saç ve sakal kınayla ya da kahverengiyle boyanabilir; siyahtan kaçınılır'),
        'hilye': () => svg('0 0 220 260', `<rect class="cz-cerceve" x="14" y="10" width="192" height="240" rx="14"/><rect class="cz-cerceve2" x="26" y="22" width="168" height="216" rx="8"/>
            <circle class="cz-c2" cx="110" cy="96" r="52"/><circle class="cz-bg" cx="110" cy="96" r="40"/>
            <path class="cz-hl" d="M84 86h52M80 98h60M86 110h48"/>
            <path class="cz-ac" d="M58 160a40 40 0 0 0 104 0 34 34 0 0 1-104 0z"/>
            <path class="cz-hl" d="M60 198h100M70 212h80"/>
            <circle class="cz-ac" cx="48" cy="46" r="6"/><circle class="cz-ac" cx="172" cy="46" r="6"/><circle class="cz-ac" cx="48" cy="214" r="6"/><circle class="cz-ac" cx="172" cy="214" r="6"/>`, 'Hilye levhası düzeninde süsleme; kişi çizilmez'),
        'sakal': () => svg('0 0 240 220', `<circle class="cz-sk" cx="120" cy="104" r="62"/>
            <ellipse class="cz-sk" cx="58" cy="108" rx="9" ry="14"/><ellipse class="cz-sk" cx="182" cy="108" rx="9" ry="14"/>
            <path class="cz-hr" d="M58 100c0-46 28-66 62-66s62 20 62 66c-8-18-26-30-62-30s-54 12-62 30z"/>
            <path class="cz-hr" d="M62 112c2 56 26 86 58 88 32-2 56-32 58-88-7 20-22 30-34 32-8-7-16-9-24-9s-16 2-24 9c-12-2-27-12-34-32z"/>
            <path class="cz-hr cz-biyik" d="M96 136c10-7 17-7 24-3 7-4 14-4 24 3-10 2-17 2-24 0-7 2-14 2-24 0z"/>
            <path class="cz-olc" d="M200 150h12M206 150v46M200 196h12"/><text class="cz-etk" x="206" y="214">bir tutam</text>`, 'Bırakılmış sakal ve kısaltılmış bıyık'),
        'kaz': () => svg('0 0 300 180', `<g transform="translate(80 84)"><circle class="cz-sk" r="50"/><ellipse class="cz-sk" cx="-50" cy="6" rx="7" ry="11"/><ellipse class="cz-sk" cx="50" cy="6" rx="7" ry="11"/>
            <path class="cz-hr" d="M-12-50q12-6 24 0l-2 18q-10-4-20 0z"/><path class="cz-hr" d="M-46-14q4-14 14-22l4 14q-8 4-12 14z"/><path class="cz-hr" d="M30-36q12 8 16 22l-10 4q-4-8-10-12z"/></g>
            <g transform="translate(220 84)"><circle class="cz-sk" r="50"/><ellipse class="cz-sk" cx="-50" cy="6" rx="7" ry="11"/><ellipse class="cz-sk" cx="50" cy="6" rx="7" ry="11"/>
            <path class="cz-hr" d="M-50 0c0-36 22-52 50-52s50 16 50 52c-6-14-22-24-50-24S-44-14-50 0z"/></g>${no(124, 34)}${ok(264, 34)}`, 'Solda başın yer yer kazındığı kaz‘, sağda düzgün kesilmiş saç'),
        'yuzuk': () => svg('0 0 300 170', `<g transform="translate(90 80)"><circle class="cz-altin" r="36"/><circle class="cz-bg" r="26"/><path class="cz-altin" d="M-10-44h20l-4-12h-12z"/></g>
            <g transform="translate(210 80)"><circle class="cz-gumus" r="36"/><circle class="cz-bg" r="26"/><path class="cz-gumus" d="M-10-44h20l-4-12h-12z"/></g>
            ${no(132, 40)}${ok(252, 40)}<text class="cz-etk" x="90" y="152">Altın (erkeğe)</text><text class="cz-etk" x="210" y="152">Gümüş</text>`, 'Altın yüzük erkeğe yasaktır; gümüş yüzük takılabilir'),
        'etek': () => svg('0 0 320 260', `<g transform="translate(40 10)"><circle class="cz-sk" cx="40" cy="24" r="16"/><path class="cz-c1" d="M18 46h44l14 170H4z"/><ellipse class="cz-sh" cx="28" cy="222" rx="10" ry="4"/><ellipse class="cz-sh" cx="52" cy="222" rx="10" ry="4"/></g>
            <g transform="translate(200 10)"><circle class="cz-sk" cx="40" cy="24" r="16"/><path class="cz-c1" d="M18 46h44l14 170q40 4 50 20H-6z"/></g>
            <path class="cz-zemin" d="M10 240h300"/><text class="cz-etk" x="80" y="256">Tevazu</text><text class="cz-etk" x="250" y="256">Kibirle sürümek</text>${no(296, 30)}`, 'Elbiseyi kibirle yerde sürümek yasaklanmıştır'),
        'nitelik': () => svg('0 0 330 230', [['cz-ince', 'İnce', 0], ['cz-dar', 'Dar', 0], ['cz-c1', 'Bol ve kalın', 1]].map((d, i) => `<g transform="translate(${15 + i * 105} 10)">
            <path class="${d[0]}" d="M${i === 1 ? '34 30h22l6 64-4 74H32l-4-74z' : '28 30h34l20 150H8z'}"/><circle class="cz-c2" cx="45" cy="18" r="13"/></g>
            <text class="cz-etk" x="${60 + i * 105}" y="214">${d[1]}</text>${d[2] ? ok(100 + i * 105, 30) : no(100 + i * 105, 30)}`).join(''), 'Örtü teni gösterecek kadar ince ya da vücut hatlarını belli edecek kadar dar olmamalıdır'),
        'kadin-sac': () => svg('0 0 240 180', `<path class="cz-hr-ln" d="M30 60q50-20 90 0t90 0M30 80q50-20 90 0t90 0M30 100q50-20 90 0t90 0"/>
            <path class="cz-olc" d="M150 40v80"/><g transform="translate(150 140)"><circle class="cz-ln2" cx="-12" cy="16" r="9"/><circle class="cz-ln2" cx="12" cy="16" r="9"/><path class="cz-ln2" d="M-6 9 10-24M6 9-10-24"/></g>
            <text class="cz-etk" x="70" y="140">Kısaltmak caiz</text>`, 'Saç telleri ve makas: saçı kısaltmak caizdir')
    };

    const BILGI = {
        'erkek-avret': { not: 'Taralı alan örtülmesi farz olan yerdir. Daire işaretleri diz kapağıdır.' },
        'kadin-avret': { not: 'Halkayla gösterilen yerler (yüz, eller ve Hanefî’de ayaklar) açık kalabilir; bunların dışındaki beden örtülür.' },
        'fitrat': { liste: ['Sünnet olmak', 'Kasık kıllarını temizlemek', 'Bıyığı kısaltmak', 'Tırnakları kesmek', 'Koltuk altı kıllarını temizlemek'] },
        'hilye': { not: 'Peygamberlerin ve sahabenin yüzü, bedeni çizilmez. Gelenekte bu bilgiler hilye levhalarına yazıyla yazılır.' }
    };

    window.GIYIM_CIZIM = {
        ciz: (ad, secenek) => (D[ad] ? D[ad](secenek || {}) : ''),
        var: (ad) => !!D[ad],
        bilgi: BILGI
    };
})();
