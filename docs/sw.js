// ============================================
// Mektep — service worker (kapsam: /mektep/)
// --------------------------------------------
// SURUM, ONBELLEK listesindeki dosyaların içeriğinden üretilir:
//   node tools/pwa-surum.mjs
// docs/ altında bir şey değiştiğinde yayından önce bu komut çalıştırılır. Tarayıcı sw.js'nin
// değiştiğini görünce yeni sürümü arka planda indirir; sayfa "Yeni sürüm hazır" penceresini
// açar, kullanıcı "Güncelle" deyince yeni sürüm devreye girer (pwa.js).
//
// Strateji
//   · Uygulama dosyaları: önce önbellek, arka planda ağdan tazeleme (çevrimdışı çalışır).
//   · Google Fonts: önbellekte kalıcı.
//   · Ses kayıtları (Range istekleri) ve diğer siteler: doğrudan ağ, önbelleğe alınmaz.
// ============================================
const SURUM = '2026.11.22-b3116fe4';
const CEKIRDEK = 'apps-' + SURUM;
const FONTLAR = 'apps-fontlar';

const ONBELLEK = [
    './',
    'apps.js',
    'hub.js',
    'pwa.js',
    'medya.js',
    'anlatim.js',
    'anlatim.css',
    'launcher.js',
    'launcher.css',
    'favori.js',
    'favori.css',
    'manifest.webmanifest',
    'icons/icon.svg',
    'icons/icon-192.png',
    'icons/apple-touch-icon.png',
    'icons/favicon-32.png',
    'css/style.css',
    'js/site.js',
    'assets/icons.svg',
    'namaz.html',
    'ezberler/',
    'ezberler/ezberler.css',
    'ezberler/ezberler.js',
    'ezberler/data.js',
    'ezberler/audio/manifest.json',
    'kavram/',
    'kavram/kavram.css',
    'kavram/kavram.js',
    'kavram/data.js',
    'kavram/ayetler.js',
    'davranis/',
    'davranis/davranis.css',
    'davranis/davranis.js',
    'davranis/data.js',
    'davranis/ayetler.js',
    'esma/',
    'esma/esma.css',
    'esma/esma.js',
    'esma/data.js',
    'esma/isimler.js',
    'esma/ayetler.js',
    'peygamberler/',
    'peygamberler/peygamberler.css',
    'peygamberler/peygamberler.js',
    'peygamberler/data.js',
    'peygamberler/adlar.js',
    'peygamberler/ayetler.js',
    'siyer/',
    'siyer/siyer.css',
    'siyer/siyer.js',
    'siyer/data.js',
    'siyer/ayetler.js',
    'dualar/',
    'dualar/dualar.css',
    'dualar/dualar.js',
    'dualar/data.js',
    'dualar/metinler.js',
    'giyim/',
    'giyim/giyim.css',
    'giyim/giyim.js',
    'giyim/data.js',
    'giyim/ayetler.js',
    'giyim/cizimler.js',
    'sahabe/',
    'sahabe/sahabe.css',
    'sahabe/sahabe.js',
    'sahabe/data.js',
    'sahabe/ayetler.js',
    'sahabe/siyer-baglanti.js',
    'oruc/',
    'oruc/oruc.css',
    'oruc/oruc.js',
    'oruc/data.js',
    'oruc/ayetler.js',
    'oruc/kunye.js',
    'sureler/',
    'sureler/sureler.css',
    'sureler/sureler.js',
    'sureler/kunye.js',
    'sureler/data.js',
    'sureler/ayetler.js',
    'zekat/',
    'zekat/zekat.css',
    'zekat/zekat.js',
    'zekat/data.js',
    'zekat/hesap.js',
    'zekat/ayetler.js',
    'hayvanlar/',
    'hayvanlar/hayvanlar.css',
    'hayvanlar/hayvanlar.js',
    'hayvanlar/data.js',
    'hayvanlar/ayetler.js',
    'hayvanlar/adlar.js',
    'hayvanlar/cizimler.js',
    'mucizeler/',
    'mucizeler/mucizeler.css',
    'mucizeler/mucizeler.js',
    'mucizeler/data.js',
    'mucizeler/ayetler.js',
    'mucizeler/ifadeler.js',
    'arapca/',
    'arapca/arapca.css',
    'arapca/arapca.js',
    'arapca/simgeler.js',
    'arapca/veri/indeks.json',
    'arapca/veri/c01.json',
    'arapca/veri/c02.json',
    'arapca/veri/c03.json',
    'arapca/veri/c04.json',
    'arapca/veri/c05.json',
    'arapca/veri/c06.json',
    'arapca/veri/c07.json',
    'arapca/veri/c08.json'
];

self.addEventListener('install', (event) => {
    // Yeni sürüm hemen devreye girmez; kullanıcı onaylayınca (SKIP_WAITING) girer.
    event.waitUntil(caches.open(CEKIRDEK).then((cache) =>
        cache.addAll(ONBELLEK.map((u) => new Request(u, { cache: 'reload' })))
    ));
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys
            .filter((k) => k.startsWith('apps-') && k !== CEKIRDEK && k !== FONTLAR)
            .map((k) => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('message', (event) => {
    const tip = event.data && event.data.tip;
    if (tip === 'SKIP_WAITING') self.skipWaiting();
    if (tip === 'SURUM' && event.ports[0]) event.ports[0].postMessage({ surum: SURUM });
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    if (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video') return;
    const url = new URL(req.url);

    if (url.origin === 'https://fonts.gstatic.com') { event.respondWith(fontFile(req)); return; }
    if (url.origin === 'https://fonts.googleapis.com') { event.respondWith(fontCss(req, event)); return; }
    if (url.origin !== self.location.origin) return;
    if (url.pathname.endsWith('/sw.js')) return;

    event.respondWith(staleWhileRevalidate(req, event));
});

async function staleWhileRevalidate(req, event) {
    const nav = req.mode === 'navigate';
    const cache = await caches.open(CEKIRDEK);
    const cached = await cache.match(req, { ignoreSearch: nav });
    const network = fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
    }).catch(() => null);
    if (cached) {
        event.waitUntil(network);
        return cached;
    }
    const res = await network;
    if (res) return res;
    if (nav) {
        const home = await cache.match('./');
        if (home) return home;
    }
    return Response.error();
}

async function fontFile(req) {
    const cache = await caches.open(FONTLAR);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
    } catch (e) {
        return Response.error();
    }
}

async function fontCss(req, event) {
    const cache = await caches.open(FONTLAR);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    return (await network) || Response.error();
}
