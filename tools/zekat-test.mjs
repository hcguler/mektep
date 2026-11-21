// Zekât ve Sadaka Rehberi — hesaplayıcı sınaması
// --------------------------------------------
// docs/zekat/hesap.js içindeki saf hesapla() ve sayiOku() fonksiyonlarını sınar: boş girdi, eksik fiyat,
// hatalı girdi, nisap altı, tam nisap, nisap üstü, borç fazlası, gümüş nisabı (bilgi), Türkçe sayı yazımı.
// Nisap ölçüsü data.js'ten okunur (80,18 g altın, 561,2 g gümüş).
// Kullanım:  node tools/zekat-test.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'docs', 'zekat');
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), sb);
vm.runInNewContext(fs.readFileSync(path.join(root, 'hesap.js'), 'utf8'), sb);
const { hesapla, sayiOku } = sb.window.ZekatHesap;
const D = sb.window.ZEKAT_DATA;
const ayar = { nisapGram: D.degerler.nisapAltin.gram, gumusNisapGram: D.degerler.nisapGumus.gram };
const h = (g) => hesapla(g, ayar);

let n = 0;
const test = (ad, fn) => { fn(); n++; console.log('  ✓ ' + ad); };
console.log('zekat-test: hesapla()');

// Türkçe sayı yazımı
test('sayı okuma: 1.234,56 · 1234,56 · 80.18 · 12 500 · ₺3.000 · 2,5 · boş · harf', () => {
    assert.equal(sayiOku('1.234,56'), 1234.56);
    assert.equal(sayiOku('1234,56'), 1234.56);
    assert.equal(sayiOku('80.18'), 80.18);
    assert.equal(sayiOku('12 500'), 12500);
    assert.equal(sayiOku('₺3.000'), 3000);
    assert.equal(sayiOku('2,5'), 2.5);
    assert.equal(sayiOku('1,234.56'), 1234.56);
    assert.equal(sayiOku('12.345.678'), 12345678);
    assert.equal(sayiOku(''), null);
    assert.equal(sayiOku('   '), null);
    assert.ok(Number.isNaN(sayiOku('abc')));
    assert.ok(Number.isNaN(sayiOku('1,2,3')));
});

test('boş girdi: durum "bos", zekât 0', () => {
    const r = h({});
    assert.equal(r.durum, 'bos'); assert.equal(r.zekat, 0);
    assert.equal(h({ nakit: '', borc: '' }).durum, 'bos');
});

test('altın fiyatı girilmeden varlık: durum "eksik"', () => {
    const r = h({ nakit: '500000' });
    assert.equal(r.durum, 'eksik'); assert.deepEqual([...r.eksik], ['altinFiyat']); assert.equal(r.zekat, 0);
});

test('gümüş gramı var, gümüş fiyatı yok: durum "eksik"', () => {
    const r = h({ altinFiyat: '4000', gumusGram: '100' });
    assert.equal(r.durum, 'eksik'); assert.deepEqual([...r.eksik], ['gumusFiyat']);
});

test('negatif ya da okunamayan girdi: durum "hata"', () => {
    assert.equal(h({ altinFiyat: '4000', nakit: '-5' }).durum, 'hata');
    assert.equal(h({ altinFiyat: 'dört bin', nakit: '5' }).durum, 'hata');
});

// Altın gram fiyatı 4.000 TL → nisap 80,18 × 4.000 = 320.720 TL
test('nisap = 80,18 g × gram fiyatı', () => {
    const r = h({ altinFiyat: '4.000' });
    assert.equal(r.nisap, 320720); assert.equal(r.durum, 'alti'); assert.equal(r.zekat, 0);
});

test('nisap altı: 300.000 TL nakit → zekât yok', () => {
    const r = h({ altinFiyat: '4.000', nakit: '300.000' });
    assert.equal(r.durum, 'alti'); assert.equal(r.net, 300000); assert.equal(r.zekat, 0);
});

test('tam nisap: net varlık nisaba eşit → zekât kırkta bir', () => {
    const r = h({ altinFiyat: '4.000', nakit: '320.720' });
    assert.equal(r.durum, 'ustu'); assert.equal(r.zekat, 8018);
});

test('tam nisap altın ile: 80,18 g altın → 2,0045 g altının değeri', () => {
    const r = h({ altinFiyat: '4000', altinGram: '80,18' });
    assert.equal(r.durum, 'ustu'); assert.equal(r.varlik, 320720); assert.equal(r.zekat, 8018);
});

test('nisap üstü: kalemler toplanır, borç düşülür, kırkta bir', () => {
    // 200.000 nakit + 50.000 döviz + 20 g × 4.000 altın + 100 g × 50 gümüş + 30.000 ticaret + 20.000 alacak − 25.000 borç
    const r = h({ altinFiyat: '4.000', nakit: '200.000', doviz: '50.000', altinGram: '20', gumusGram: '100', gumusFiyat: '50', ticaret: '30.000', alacak: '20.000', borc: '25.000' });
    assert.equal(r.varlik, 385000); assert.equal(r.borc, 25000); assert.equal(r.net, 360000);
    assert.equal(r.durum, 'ustu'); assert.equal(r.zekat, 9000);
    assert.deepEqual([...r.kalemler.map((k) => k.ad)], ['nakit', 'doviz', 'altin', 'gumus', 'ticaret', 'alacak']);
});

test('borç düşülünce nisabın altına inerse zekât yok', () => {
    const r = h({ altinFiyat: '4000', nakit: '400000', borc: '100000' });
    assert.equal(r.net, 300000); assert.equal(r.durum, 'alti'); assert.equal(r.zekat, 0);
});

test('borç fazlası: borç varlıktan çok → durum "borc-fazla", zekât yok', () => {
    const r = h({ altinFiyat: '4000', nakit: '100000', borc: '250000' });
    assert.equal(r.durum, 'borc-fazla'); assert.equal(r.net, -150000); assert.equal(r.zekat, 0);
});

test('gümüş nisabı yalnız bilgi: 561,2 g × gümüş fiyatı; hesap altınla yapılır', () => {
    const r = h({ altinFiyat: '4000', gumusFiyat: '50', nakit: '100000' });
    assert.equal(r.gumusNisap, 28060); assert.equal(r.nisap, 320720);
    assert.equal(r.durum, 'alti'); assert.equal(r.zekat, 0); // gümüş nisabının üstünde ama altın nisabının altında
});

test('kuruşa yuvarlama', () => {
    const r = h({ altinFiyat: '4.123,45', nakit: '1.000.000,99' });
    assert.equal(r.nisap, 330618.22); assert.equal(r.zekat, 25000.02);
});

console.log(`zekat-test: ${n} sınama geçti`);
