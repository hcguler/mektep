// ============================================
// Zekât ve Sadaka Rehberi — hesaplayıcı (saf fonksiyonlar, DOM yok)
// --------------------------------------------
// Hüküm vermez, yalnızca aritmetik yapar (plan: "hüküm ile hesap ayrı"). Sonuç her zaman yaklaşıktır.
//   net varlık = (nakit + döviz + altın + gümüş + ticaret malı + alacak) − bu yıl ödenecek borç
//   nisap      = 80,18 g × altın gram fiyatı (Din İşleri Yüksek Kurulu; data.js → degerler.nisapAltin)
//   net ≥ nisap ise zekât = net × 1/40 (kırkta bir, yüzde iki buçuk)
// Gümüş nisabı (561,2 g) yalnızca bilgi olarak hesaplanır (gümüş gram fiyatı girilirse); ölçü altındır.
// Ağ isteği yoktur; fiyatları kullanıcı girer. tools/zekat-test.mjs bu dosyayı sınar.
// ============================================
(function (g) {
    'use strict';

    // Türkçe sayı yazımı: "1.234,56" · "1234,56" · "80.18" · "12 500" · "₺ 3.000" → sayı.
    // Hem nokta hem virgül varsa sondaki ondalık ayracıdır. Yalnız nokta varsa ve 1.234 / 12.345.678 biçimindeyse
    // binlik ayracı sayılır; aksi hâlde ondalıktır. Boş girdi null, okunamayan girdi NaN döner.
    function sayiOku(v) {
        if (v == null) return null;
        if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
        let s = String(v).replace(/[\s  ]/g, '').replace(/₺|TL|tl|gr|g$/g, '');
        if (s === '') return null;
        if (!/^[+-]?[\d.,]+$/.test(s)) return NaN;
        const v1 = s.lastIndexOf(','), n1 = s.lastIndexOf('.');
        if (v1 >= 0 && n1 >= 0) {
            const ond = v1 > n1 ? ',' : '.';
            const bin = ond === ',' ? '.' : ',';
            s = s.split(bin).join('');
            if (s.split(ond).length > 2) return NaN;
            s = s.replace(ond, '.');
        } else if (v1 >= 0) {
            if (s.split(',').length > 2) { if (/^[+-]?\d{1,3}(,\d{3})+$/.test(s)) s = s.split(',').join(''); else return NaN; }
            else s = s.replace(',', '.');
        } else if (n1 >= 0) {
            if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(s)) s = s.split('.').join('');
            else if (s.split('.').length > 2) return NaN;
        }
        const n = Number(s);
        return Number.isFinite(n) ? n : NaN;
    }

    const kurus = (x) => Math.round(x * 100) / 100;
    const ALANLAR = ['altinFiyat', 'nakit', 'doviz', 'altinGram', 'gumusGram', 'gumusFiyat', 'ticaret', 'alacak', 'borc'];

    // girdi: { altinFiyat, nakit, doviz, altinGram, gumusGram, gumusFiyat, ticaret, alacak, borc } (sayı ya da metin)
    // ayar:  { nisapGram: 80.18, gumusNisapGram: 561.2 }
    // dönüş: { durum, hatalar, eksik, kalemler, varlik, borc, net, nisap, gumusNisap, zekat, oran }
    //   durum: 'bos' | 'eksik' | 'hata' | 'alti' | 'ustu' | 'borc-fazla'
    function hesapla(girdi, ayar) {
        const a = Object.assign({ nisapGram: 80.18, gumusNisapGram: 561.2 }, ayar || {});
        const x = {}, hatalar = [], eksik = [];
        for (const k of ALANLAR) {
            const n = sayiOku((girdi || {})[k]);
            if (Number.isNaN(n)) hatalar.push(k);
            else if (n != null && n < 0) hatalar.push(k);
            x[k] = n;
        }
        const out = { durum: 'bos', hatalar, eksik, kalemler: [], varlik: 0, borc: 0, net: 0, nisap: null, gumusNisap: null, zekat: 0, oran: 1 / 40 };
        if (hatalar.length) { out.durum = 'hata'; return out; }
        const v = (k) => x[k] || 0;
        const herhangi = ['nakit', 'doviz', 'altinGram', 'gumusGram', 'ticaret', 'alacak', 'borc'].some((k) => v(k) > 0);
        if (!herhangi && !v('altinFiyat')) return out; // boş girdi
        if (!(v('altinFiyat') > 0)) eksik.push('altinFiyat');
        if (v('gumusGram') > 0 && !(v('gumusFiyat') > 0)) eksik.push('gumusFiyat');
        if (eksik.length) { out.durum = 'eksik'; return out; }
        const kalemler = [
            ['nakit', v('nakit')],
            ['doviz', v('doviz')],
            ['altin', v('altinGram') * v('altinFiyat')],
            ['gumus', v('gumusGram') * v('gumusFiyat')],
            ['ticaret', v('ticaret')],
            ['alacak', v('alacak')]
        ].filter(([, t]) => t > 0).map(([ad, t]) => ({ ad, tutar: kurus(t) }));
        out.kalemler = kalemler;
        out.varlik = kurus(kalemler.reduce((s, k) => s + k.tutar, 0));
        out.borc = kurus(v('borc'));
        out.net = kurus(out.varlik - out.borc);
        out.nisap = kurus(a.nisapGram * v('altinFiyat'));
        if (v('gumusFiyat') > 0) out.gumusNisap = kurus(a.gumusNisapGram * v('gumusFiyat'));
        if (!herhangi) { out.durum = 'alti'; return out; } // yalnız fiyat girilmiş: nisap gösterilir
        if (out.net <= 0 && out.borc > 0) { out.durum = 'borc-fazla'; return out; }
        if (out.net >= out.nisap) { out.durum = 'ustu'; out.zekat = kurus(out.net / 40); }
        else out.durum = 'alti';
        return out;
    }

    const api = { sayiOku, hesapla, ALANLAR };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    g.ZekatHesap = api;
})(typeof window !== 'undefined' ? window : globalThis);
