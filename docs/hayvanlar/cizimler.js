// ============================================
// Kur'an'da Hayvanlar — hayvan çizimleri (renkli düz SVG)
// --------------------------------------------
// Her hayvan sade, çocuk dostu bir düz (flat) çizimdir. Şekiller renk sınıfı taşır; renkler CSS
// değişkenlerinden gelir (hayvanlar.css, ".ciz"):
//   a ana renk · b açık ton · c vurgu · f ek renk · bk gaga · d koyu ayrıntı (göz, bacak) · e beyaz / parıltı
//   sh gölge · g zemin · ln koyu çizgi · web ağ ipliği · wg kanat (yarı saydam) · wv dalga · dash uçuş izi
// Çocuk temasında her hayvanın kendi paleti (--k1…--k6) kullanılır; yetişkin temasında bütün renkler tek
// renge (altın) iner. İnsan ya da peygamber çizilmez; yalnızca hayvan, doğa ve eşya vardır.
// Kullanım: HAYVAN_CIZ('karinca', 'buyuk')  →  <svg …>
// ============================================
(function () {
    'use strict';
    const r1 = (n) => Math.round(n * 10) / 10;

    // Oturan, yuvarlak bir kuş (sağa bakar). cls: gövde rengi.
    function kus(x, y, s, cls) {
        const p = (dx, dy) => `${r1(x + dx * s)} ${r1(y + dy * s)}`;
        return `<path class="${cls}" d="M${p(-12, -2)} L${p(-25, -9)} L${p(-21, 4)} Z"/>
            <ellipse class="${cls}" cx="${r1(x)}" cy="${r1(y)}" rx="${r1(15 * s)}" ry="${r1(11 * s)}"/>
            <ellipse class="sh" cx="${r1(x - 2 * s)}" cy="${r1(y + 1 * s)}" rx="${r1(8 * s)}" ry="${r1(5.5 * s)}" transform="rotate(-12 ${r1(x - 2 * s)} ${r1(y + 1 * s)})"/>
            <circle class="${cls}" cx="${r1(x + 10 * s)}" cy="${r1(y - 9 * s)}" r="${r1(8 * s)}"/>
            <path class="bk" d="M${p(17, -11)} L${p(25, -8)} L${p(17, -5)} Z"/>
            <circle class="e" cx="${r1(x + 12 * s)}" cy="${r1(y - 10 * s)}" r="${r1(2.6 * s)}"/>
            <circle class="d" cx="${r1(x + 12.6 * s)}" cy="${r1(y - 10 * s)}" r="${r1(1.5 * s)}"/>
            <path class="ln" style="stroke-width:${r1(2 * s)}" d="M${p(-3, 10)} L${p(-4, 17)} M${p(4, 10)} L${p(4, 17)}"/>`;
    }
    // Uçan kuş (yandan görünüm, kanatlar açık).
    function ucan(x, y, s, cls) {
        const p = (dx, dy) => `${r1(x + dx * s)} ${r1(y + dy * s)}`;
        return `<path class="${cls}" d="M${p(-17, -3)} Q${p(-8, -14)} ${p(0, -1)} Q${p(8, -14)} ${p(17, -3)} Q${p(8, -5)} ${p(0, 5)} Q${p(-8, -5)} ${p(-17, -3)} Z"/>
            <circle class="${cls}" cx="${r1(x)}" cy="${r1(y + 1 * s)}" r="${r1(3.6 * s)}"/>`;
    }
    // Altıgen (bal peteği)
    function hex(cx, cy, r, cls) {
        const pts = [];
        for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i + Math.PI / 6; pts.push(`${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`); }
        return `<polygon class="${cls}" points="${pts.join(' ')}"/>`;
    }
    // Hüdhüdün tepesindeki taç tüyleri
    function tac(bx, by) {
        let out = '';
        [-62, -36, -10, 16, 42].forEach((deg) => {
            const t = (deg * Math.PI) / 180, dx = Math.sin(t), dy = -Math.cos(t);
            const cx = bx + dx * 11, cy = by + dy * 11, tx = bx + dx * 21, ty = by + dy * 21;
            out += `<ellipse class="a" cx="${r1(cx)}" cy="${r1(cy)}" rx="4" ry="11" transform="rotate(${deg} ${r1(cx)} ${r1(cy)})"/>`;
            out += `<ellipse class="d" cx="${r1(tx)}" cy="${r1(ty)}" rx="3" ry="3.6" transform="rotate(${deg} ${r1(tx)} ${r1(ty)})"/>`;
        });
        return out;
    }
    // Örümcek ağı (sol üst köşe)
    function ag() {
        const rays = [0, 18, 36, 54, 72, 90].map((d) => (d * Math.PI) / 180);
        let out = rays.map((t) => `<path class="web" d="M0 0 L${r1(Math.cos(t) * 66)} ${r1(Math.sin(t) * 66)}"/>`).join('');
        [18, 34, 50].forEach((r) => {
            const pts = rays.map((t) => `${r1(Math.cos(t) * r)} ${r1(Math.sin(t) * r)}`);
            out += `<path class="web" d="M${pts.join(' L')}"/>`;
        });
        return out;
    }
    // Deve gövdesi (sağa bakar, 120×120 içinde)
    function deve() {
        return `<rect class="a" x="34" y="70" width="6" height="32" rx="3"/><rect class="sh" x="34" y="70" width="6" height="32" rx="3"/>
            <rect class="a" x="74" y="70" width="6" height="32" rx="3"/><rect class="sh" x="74" y="70" width="6" height="32" rx="3"/>
            <rect class="a" x="42" y="70" width="6" height="32" rx="3"/><rect class="a" x="82" y="70" width="6" height="32" rx="3"/>
            <path class="ln" d="M29 62 Q22 66 24 78"/>
            <path class="a" d="M28 66 Q26 52 38 50 Q44 30 58 31 Q70 33 72 48 Q84 48 88 58 Q90 70 78 75 L36 75 Q28 73 28 66 Z"/>
            <path class="b" d="M45 42 Q56 31 67 42 Q56 37 45 42 Z"/>
            <path class="a" d="M80 56 Q92 50 94 36 Q95 28 100 26 L108 26 Q114 28 113 34 Q112 38 106 39 Q102 40 101 46 Q98 62 86 69 Z"/>
            <path class="a" d="M99 27 L100 20 L104 26 Z"/>
            <circle class="d" cx="104" cy="31" r="2"/>
            <path class="ln" style="stroke-width:2" d="M109 36 L113 36"/>`;
    }

    const C = {
        karinca: { renk: ['#c8553d', '#ee9b80', '#f4d35e', '#3d2b2b', '#7fb069', '#f4a261'], svg: `
            <ellipse class="g" cx="62" cy="102" rx="46" ry="5"/>
            <path class="f" d="M8 102 Q12 88 9 78 Q17 88 17 102 Z M104 102 Q106 86 113 78 Q111 92 113 102 Z"/>
            <path class="ln" d="M58 70 Q50 82 44 94 M64 72 Q64 84 62 96 M70 70 Q80 80 86 92"/>
            <ellipse class="a" cx="36" cy="66" rx="22" ry="16"/>
            <ellipse class="b" cx="30" cy="59" rx="8" ry="4.5"/>
            <circle class="a" cx="55" cy="66" r="4.5"/>
            <ellipse class="a" cx="66" cy="64" rx="11" ry="8.5"/>
            <path class="ln" d="M92 45 Q95 31 106 28 M85 45 Q83 30 90 22"/>
            <circle class="d" cx="106" cy="28" r="3"/><circle class="d" cx="90" cy="22" r="3"/>
            <circle class="a" cx="88" cy="56" r="13"/>
            <circle class="b" cx="83" cy="51" r="4"/>
            <circle class="e" cx="93" cy="55" r="3.8"/><circle class="d" cx="94" cy="55" r="2.1"/>
            <path class="ln" style="stroke-width:2" d="M90 63 Q94 66 98 62"/>` },
        hudhud: { renk: ['#e8955a', '#f8d2a8', '#ffffff', '#2b2b33', '#7fb069', '#2b2b33'], svg: `
            <ellipse class="g" cx="58" cy="104" rx="36" ry="4"/>
            <path class="d" d="M34 70 L8 60 L12 82 Z"/>
            <path class="e" d="M20 65 L18 77 L23 78 L25 67 Z"/>
            <path class="ln" d="M50 86 L48 101 M60 86 L62 101 M44 101 L52 101 M58 101 L66 101"/>
            <ellipse class="a" cx="54" cy="70" rx="26" ry="18"/>
            <ellipse class="b" cx="62" cy="77" rx="15" ry="8"/>
            <path class="d" d="M35 62 Q56 53 72 64 Q62 83 34 77 Q29 69 35 62 Z"/>
            <path class="ln" style="stroke:var(--he);stroke-width:3" d="M41 66 L63 64 M39 72 L60 73"/>
            ${tac(80, 41)}
            <circle class="a" cx="80" cy="50" r="13"/>
            <path class="d" d="M91 50 Q105 54 113 67 Q102 59 91 55 Z"/>
            <circle class="e" cx="84" cy="47" r="3.2"/><circle class="d" cx="84.8" cy="47" r="1.8"/>` },
        dortkus: { renk: ['#e76f51', '#2a9d8f', '#e9c46a', '#263238', '#5b8def', '#f4a261'], svg: `
            <path class="g" d="M0 106 L28 66 L48 88 L76 52 L120 106 Z"/>
            ${kus(30, 40, 0.95, 'a')}
            ${kus(90, 30, 0.95, 'c')}
            ${kus(34, 86, 0.95, 'f')}
            ${kus(88, 82, 0.95, 'b')}` },
        balik: { renk: ['#2a9db0', '#b6e6ec', '#f4a261', '#12343b', '#7cc6d6', '#f4a261'], svg: `
            <path class="wv" d="M6 106 Q16 100 26 106 T46 106 T66 106 T86 106 T106 106"/>
            <path class="c" d="M30 58 L8 37 Q15 58 8 81 Z"/>
            <path class="a" d="M26 58 Q48 26 84 36 Q106 44 108 58 Q106 72 84 80 Q48 90 26 58 Z"/>
            <path class="b" d="M40 66 Q66 84 102 66 Q88 78 66 80 Q50 79 40 66 Z"/>
            <path class="c" d="M52 37 Q63 17 80 34 Z"/>
            <path class="c" d="M60 62 Q72 55 76 69 Q67 71 60 62 Z"/>
            <path class="ln" style="stroke-width:2.4" d="M86 44 Q80 58 86 72"/>
            <path class="ln" style="stroke-width:1.8;opacity:.35" d="M52 48 q4 4 0 8 M62 44 q4 4 0 8 M72 44 q4 4 0 8 M57 56 q4 4 0 8 M67 54 q4 4 0 8"/>
            <circle class="e" cx="96" cy="52" r="5.2"/><circle class="d" cx="97" cy="52" r="2.7"/>
            <path class="ln" style="stroke-width:2" d="M106 61 Q102 62 104 65"/>
            <circle class="wv" cx="112" cy="36" r="3.5" style="stroke-width:2"/><circle class="wv" cx="105" cy="24" r="2.6" style="stroke-width:2"/><circle class="wv" cx="113" cy="14" r="2" style="stroke-width:2"/>` },
        disideve: { renk: ['#d9a35b', '#f2d29e', '#a3acb9', '#4a3423', '#5fb0d6', '#f4a261'], svg: `
            <ellipse class="g" cx="64" cy="106" rx="54" ry="4"/>
            <g transform="translate(20 15) scale(.85)">${deve()}</g>
            <rect class="c" x="3" y="80" width="30" height="24" rx="3"/>
            <path class="sh" d="M3 92 H33 M3 98 H33" style="fill:none;stroke:var(--h4);stroke-width:1.5"/>
            <ellipse class="c" cx="18" cy="80" rx="16" ry="5"/>
            <ellipse class="f" cx="18" cy="80" rx="11" ry="3"/>` },
        inek: { renk: ['#b07d56', '#f4b6b6', '#fdf7ec', '#2f2a26', '#7fb069', '#e8c07a'], svg: `
            <ellipse class="g" cx="60" cy="104" rx="46" ry="4"/>
            <path class="f" d="M6 104 Q10 92 8 84 Q14 92 15 104 Z"/>
            <path class="ln" d="M25 57 Q14 64 18 82"/><ellipse class="d" cx="18" cy="85" rx="3" ry="4"/>
            <rect class="a" x="30" y="74" width="8" height="26" rx="3.5"/><rect class="sh" x="30" y="74" width="8" height="26" rx="3.5"/>
            <rect class="a" x="70" y="74" width="8" height="26" rx="3.5"/><rect class="sh" x="70" y="74" width="8" height="26" rx="3.5"/>
            <rect class="a" x="40" y="74" width="8" height="26" rx="3.5"/><rect class="a" x="80" y="74" width="8" height="26" rx="3.5"/>
            <rect class="d" x="30" y="97" width="8" height="5" rx="2"/><rect class="d" x="40" y="97" width="8" height="5" rx="2"/><rect class="d" x="70" y="97" width="8" height="5" rx="2"/><rect class="d" x="80" y="97" width="8" height="5" rx="2"/>
            <rect class="a" x="24" y="46" width="66" height="36" rx="17"/>
            <ellipse class="c" cx="44" cy="58" rx="10" ry="7.5"/><ellipse class="c" cx="70" cy="56" rx="7" ry="6"/><ellipse class="c" cx="57" cy="72" rx="6" ry="4"/>
            <ellipse class="b" cx="64" cy="83" rx="6.5" ry="4"/>
            <rect class="a" x="80" y="46" width="14" height="20" rx="6"/>
            <ellipse class="a" cx="82" cy="45" rx="7" ry="3.4" transform="rotate(-20 82 45)"/><ellipse class="a" cx="111" cy="45" rx="7" ry="3.4" transform="rotate(20 111 45)"/>
            <path class="bk" d="M88 40 Q81 32 85 26 Q87 33 92 37 Z M105 40 Q112 32 108 26 Q106 33 101 37 Z"/>
            <ellipse class="a" cx="96.5" cy="52" rx="13" ry="15"/>
            <path class="c" d="M96.5 39 Q92 51 96.5 60 Q101 51 96.5 39 Z"/>
            <ellipse class="b" cx="97" cy="66" rx="11" ry="8"/>
            <circle class="d" cx="93" cy="66" r="1.7"/><circle class="d" cx="101" cy="66" r="1.7"/>
            <circle class="d" cx="91" cy="50" r="2.3"/><circle class="d" cx="102" cy="50" r="2.3"/>` },
        kurt: { renk: ['#7d8b9c', '#dfe5ec', '#4e5b6b', '#232a33', '#7fb069', '#4e5b6b'], svg: `
            <ellipse class="g" cx="62" cy="104" rx="48" ry="4"/>
            <path class="c" d="M27 58 Q8 58 9 80 Q17 70 29 68 Z"/>
            <rect class="a" x="32" y="68" width="7" height="32" rx="3"/><rect class="sh" x="32" y="68" width="7" height="32" rx="3"/>
            <rect class="a" x="70" y="68" width="7" height="32" rx="3"/><rect class="sh" x="70" y="68" width="7" height="32" rx="3"/>
            <rect class="a" x="42" y="68" width="7" height="32" rx="3"/><rect class="a" x="80" y="68" width="7" height="32" rx="3"/>
            <path class="a" d="M26 60 Q30 46 50 46 L76 46 Q89 48 89 60 Q89 72 76 74 L36 74 Q24 72 26 60 Z"/>
            <path class="c" d="M30 53 Q48 43 82 47 Q60 50 30 57 Z"/>
            <path class="b" d="M40 72 Q58 77 76 72 L75 74 L40 74 Z"/>
            <path class="b" d="M80 50 Q87 62 84 71 Q77 64 77 54 Z"/>
            <path class="a" d="M80 52 Q84 34 98 34 Q106 34 112 44 L118 50 Q116 54 110 54 Q104 56 98 58 Q88 62 80 52 Z"/>
            <path class="b" d="M98 46 Q108 46 116 50 Q110 54 100 54 Q96 52 98 46 Z"/>
            <path class="a" d="M85 41 L88 23 L97 36 Z"/><path class="c" d="M88.5 37 L89 29 L93.5 36 Z"/>
            <circle class="d" cx="117" cy="50" r="2.6"/>
            <ellipse class="d" cx="100" cy="42" rx="2.4" ry="1.8"/>` },
        kopek: { renk: ['#c68b4e', '#f3dcb7', '#8a5a2b', '#2b1d12', '#a39486', '#f4a261'], svg: `
            <path class="f" d="M0 108 L0 42 Q4 6 44 4 Q86 6 90 44 L92 108 Z"/>
            <path class="sh" style="opacity:.55" d="M14 108 L14 52 Q16 22 44 20 Q72 22 76 52 L76 108 Z"/>
            <ellipse class="g" cx="70" cy="104" rx="46" ry="4"/>
            <path class="a" d="M37 87 Q24 82 21 70 Q30 78 40 81 Z"/>
            <ellipse class="a" cx="66" cy="91" rx="26" ry="11"/>
            <ellipse class="a" cx="46" cy="89" rx="12" ry="10"/>
            <ellipse class="b" cx="64" cy="98" rx="16" ry="3.6"/>
            <rect class="a" x="78" y="93" width="31" height="7" rx="3.5"/>
            <rect class="a" x="76" y="98" width="30" height="6.5" rx="3.2"/><rect class="sh" x="76" y="98" width="30" height="6.5" rx="3.2"/>
            <ellipse class="b" cx="109" cy="96.5" rx="4" ry="3.6"/><ellipse class="b" cx="106" cy="101.5" rx="3.6" ry="3.2"/>
            <circle class="a" cx="92" cy="76" r="12"/>
            <ellipse class="b" cx="102" cy="80" rx="8" ry="6"/>
            <circle class="d" cx="109" cy="78" r="2.6"/>
            <path class="c" d="M84 67 Q77 76 82 89 Q89 82 89 69 Z"/>
            <circle class="d" cx="95" cy="73" r="1.9"/>` },
        karga: { renk: ['#4b5370', '#8590b5', '#9a6f4c', '#151821', '#7fb069', '#2a2d38'], svg: `
            <path class="f" d="M4 106 Q8 94 6 86 Q12 94 13 106 Z M16 106 Q18 98 17 92 Q22 98 22 106 Z"/>
            <path class="c" d="M60 108 Q86 82 118 108 Z"/>
            <circle class="c" cx="114" cy="92" r="2.6"/><circle class="c" cx="108" cy="86" r="2"/><circle class="c" cx="118" cy="84" r="1.8"/>
            <path class="ln" d="M48 78 L45 100 M59 80 L61 100 M40 100 L49 100 M57 100 L66 100"/>
            <path class="a" d="M28 48 L2 32 L9 56 Z"/>
            <ellipse class="a" cx="52" cy="58" rx="30" ry="20" transform="rotate(18 52 58)"/>
            <path class="b" d="M30 47 Q57 35 75 56 Q56 73 30 58 Z"/>
            <path class="sh" d="M36 52 Q55 47 68 58 Q54 64 36 56 Z"/>
            <circle class="a" cx="84" cy="72" r="14"/>
            <path class="bk" d="M95 71 L115 86 L93 83 Z"/>
            <circle class="e" cx="88" cy="67" r="3.2"/><circle class="d" cx="88.8" cy="67" r="1.8"/>` },
        fil: { renk: ['#8aa1b1', '#c3d2dc', '#f4ede1', '#2c3a44', '#7fb069', '#f4ede1'], svg: `
            <ellipse class="g" cx="60" cy="104" rx="50" ry="4"/>
            <path class="ln" style="stroke-width:2.5" d="M19 56 Q10 62 12 73"/>
            <rect class="a" x="24" y="70" width="13" height="31" rx="5"/><rect class="sh" x="24" y="70" width="13" height="31" rx="5"/>
            <rect class="a" x="62" y="72" width="13" height="29" rx="5"/><rect class="sh" x="62" y="72" width="13" height="29" rx="5"/>
            <rect class="a" x="40" y="72" width="13" height="29" rx="5"/><rect class="a" x="76" y="70" width="13" height="31" rx="5"/>
            <ellipse class="a" cx="50" cy="61" rx="33" ry="25"/>
            <circle class="a" cx="84" cy="52" r="20"/>
            <path class="a" d="M96 54 Q105 64 103 82 Q102 92 109 94 Q113 94 113 90 Q107 88 108 80 Q111 62 101 46 Z"/>
            <path class="b" d="M73 36 Q57 38 57 57 Q59 74 75 70 Q82 55 73 36 Z"/>
            <path class="sh" d="M73 36 Q76 54 75 70 Q82 55 73 36 Z"/>
            <path class="c" d="M94 63 Q100 72 109 70 Q100 66 98 59 Z"/>
            <circle class="d" cx="90" cy="46" r="2.5"/>
            <path class="c" d="M26 99 h3 M30 99 h3 M78 99 h3 M82 99 h3" style="stroke:var(--h3);stroke-width:2;stroke-linecap:round"/>` },
        ebabil: { renk: ['#4f6fa8', '#7fa3d9', '#a7c4ec', '#1f2a44', '#ffffff', '#f4a261'], svg: `
            <path class="f" style="opacity:.75" d="M14 54 Q14 44 24 44 Q28 34 40 38 Q50 34 54 44 Q64 44 64 54 Z"/>
            <path class="f" style="opacity:.75" d="M70 100 Q70 92 78 92 Q82 84 92 88 Q100 84 104 92 Q112 92 112 100 Z"/>
            ${ucan(30, 26, 1.15, 'a')}
            ${ucan(80, 20, 0.95, 'b')}
            ${ucan(60, 54, 1.35, 'a')}
            ${ucan(100, 52, 0.85, 'c')}
            ${ucan(26, 78, 0.9, 'b')}
            ${ucan(70, 80, 1.1, 'a')}
            ${ucan(42, 102, 0.75, 'c')}` },
        ari: { renk: ['#f4b400', '#fff3c4', '#f59e0b', '#2b2118', '#e8a33d', '#2b2118'], svg: `
            <path class="dash" d="M8 44 Q22 18 36 40 Q44 54 48 46"/>
            ${hex(20, 88, 10, 'f')}${hex(37.3, 88, 10, 'f')}${hex(28.7, 103, 10, 'f')}${hex(46, 103, 10, 'f')}
            ${hex(20, 88, 5.5, 'c')}${hex(37.3, 88, 5.5, 'c')}${hex(28.7, 103, 5.5, 'c')}
            <ellipse class="wg" cx="62" cy="30" rx="11" ry="17" transform="rotate(-25 62 30)"/>
            <ellipse class="wg" cx="79" cy="29" rx="9" ry="14" transform="rotate(22 79 29)"/>
            <path class="d" d="M45 52 L35 50 L45 57 Z"/>
            <ellipse class="a" cx="67" cy="53" rx="23" ry="16"/>
            <path class="d" d="M57 38.5 Q52 53 57 67.5 L63 68.8 Q58 53 63 37.4 Z M70 37.2 Q65 53 70 68.8 L76 67.6 Q71 53 76 38.4 Z"/>
            <ellipse class="b" cx="73" cy="45" rx="5" ry="2.4" style="opacity:.7"/>
            <path class="ln" style="stroke-width:2.4" d="M93 43 Q97 33 104 31 M88 42 Q87 32 92 27"/>
            <circle class="d" cx="91" cy="52" r="10.5"/>
            <circle class="e" cx="94" cy="49" r="2.8"/>
            <path class="ln" style="stroke:var(--he);stroke-width:1.8" d="M92 57 Q95 59 98 56"/>` },
        orumcek: { renk: ['#6b4f9e', '#a58bd3', '#bdb3d6', '#241a35', '#ffffff', '#6b4f9e'], svg: `
            ${ag()}
            <path class="web" d="M74 0 L74 46"/>
            <path class="ln" d="M68 60 Q56 46 48 52 M67 64 Q53 59 44 66 M68 69 Q55 72 48 84 M70 73 Q62 84 59 94 M80 60 Q92 46 100 52 M81 64 Q95 59 104 66 M80 69 Q93 72 100 84 M78 73 Q86 84 89 94"/>
            <circle class="a" cx="74" cy="71" r="14"/>
            <ellipse class="b" cx="74" cy="73" rx="5" ry="7.5"/>
            <circle class="a" cx="74" cy="54" r="8.5"/>
            <circle class="e" cx="70.8" cy="53" r="2.4"/><circle class="e" cx="77.2" cy="53" r="2.4"/>
            <circle class="d" cx="71" cy="53.4" r="1.2"/><circle class="d" cx="77" cy="53.4" r="1.2"/>` },
        sivrisinek: { renk: ['#5f8a68', '#c6dccb', '#9cc4a4', '#22302a', '#ffffff', '#22302a'], svg: `
            <ellipse class="g" cx="56" cy="106" rx="40" ry="3"/>
            <path class="ln" style="stroke-width:1.8" d="M42 56 Q30 64 18 72 M44 58 Q36 78 26 92 M48 58 Q48 80 42 100 M52 58 Q60 78 64 98 M54 56 Q72 70 88 82 M50 56 Q66 66 80 70"/>
            <ellipse class="wg" cx="58" cy="34" rx="20" ry="7" transform="rotate(-28 58 34)"/>
            <ellipse class="wg" cx="50" cy="36" rx="17" ry="6" transform="rotate(-62 50 36)"/>
            <ellipse class="a" cx="72" cy="60" rx="24" ry="6.5" transform="rotate(14 72 60)"/>
            <path class="ln" style="stroke:var(--h2);stroke-width:2" d="M62 54 L60 63 M71 56 L69 65 M80 58 L78 67"/>
            <ellipse class="a" cx="47" cy="52" rx="9" ry="8"/>
            <circle class="a" cx="35" cy="48" r="6.5"/>
            <circle class="d" cx="33" cy="46.5" r="3.2"/><circle class="e" cx="32" cy="45.5" r="1"/>
            <path class="ln" style="stroke-width:2" d="M30 51 L12 62 M33 42 Q30 34 24 32 M36 42 Q36 34 32 28"/>` },
        deve: { renk: ['#c9894a', '#ecc690', '#f6c445', '#3f2b1d', '#b9a8dc', '#f4a261'], svg: `
            <circle class="c" cx="22" cy="22" r="12"/>
            <path class="c" style="opacity:.45" d="M22 4 v-2 M22 42 v-2 M4 22 h-2 M42 22 h-2"/>
            <path class="f" d="M0 88 L24 58 L42 76 L62 50 L96 88 Z"/>
            <path class="g" d="M0 104 Q60 96 120 104 L120 112 L0 112 Z" style="opacity:.18"/>
            ${deve()}` },
        merhamet: { renk: ['#e76f6f', '#f7b2b2', '#e76f6f', '#5a2a2a', '#ffffff', '#e76f6f'], svg: `
            <path class="a" d="M60 104 Q12 74 16 44 Q20 18 46 22 Q56 24 60 36 Q64 24 74 22 Q100 18 104 44 Q108 74 60 104 Z"/>
            <path class="b" style="opacity:.6" d="M30 40 Q32 30 42 30" />
            <ellipse class="e" cx="60" cy="68" rx="12" ry="10"/>
            <ellipse class="e" cx="44" cy="52" rx="5" ry="6.5" transform="rotate(-20 44 52)"/>
            <ellipse class="e" cx="54" cy="45" rx="5" ry="6.5" transform="rotate(-6 54 45)"/>
            <ellipse class="e" cx="66" cy="45" rx="5" ry="6.5" transform="rotate(6 66 45)"/>
            <ellipse class="e" cx="76" cy="52" rx="5" ry="6.5" transform="rotate(20 76 52)"/>` }
    };

    // id → <svg>. cls: ek sınıf (buyuk, kucuk…). label verilirse role="img" + aria-label, yoksa aria-hidden.
    window.HAYVAN_CIZ = function (id, cls, label) {
        const c = C[id];
        if (!c) return '';
        const vars = c.renk.map((v, i) => `--k${i + 1}:${v}`).join(';');
        const a11y = label ? `role="img" aria-label="${String(label).replace(/"/g, '&quot;')}"` : 'aria-hidden="true" focusable="false"';
        return `<svg class="ciz${cls ? ' ' + cls : ''}" viewBox="0 0 120 112" style="${vars}" ${a11y}>${c.svg}</svg>`;
    };
    window.HAYVAN_CIZ.ids = Object.keys(C);
})();
