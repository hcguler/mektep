// ============================================
// Kilit ekranı ve bildirim paneli oynatıcısı — apps/ altındaki bütün sesler için ortak (apps/CLAUDE.md, 6.5)
// --------------------------------------------
// Tarayıcının Media Session API'si ile ekran kilitliyken ya da uygulama arka plandayken telefonun
// bildirim panelinde / kilit ekranında müzik çalar gibi bir oynatıcı gösterir: başlık, kapak,
// oynat/duraklat, önceki/sonraki, ilerleme çubuğu.
//
// Sayfada tek bir oturum vardır; son çalmaya başlayan ses oturumun sahibidir. Böylece anlatım ile
// kıraat gibi iki ses birbirinin düğmelerini ele geçirmez.
//
// Kullanım (her parça başladığında, parça değiştiğinde yeniden çağrılır):
//   AppsMedya.ayarla('anlatim', {
//     audio,                       // çalan <audio> / new Audio() — her oynatıcı tek öğe kullanır
//     baslik, sanatci, album,      // bildirimde görünen metin
//     oynat(), duraklat(),         // yoksa audio.play() / audio.pause()
//     onceki(), sonraki(),         // sıradaki parça varsa verilir; yoksa düğme pasif olur
//     git(sn), konum() → { sure, simdi }   // bölüm çalan oynatıcı için (yoksa audio'nun kendisi)
//     kapat()                      // bildirimdeki "durdur"
//   });
//   AppsMedya.birak('anlatim');    // oynatıcı kapanınca
//
// Kurallar (iOS ve Android'de sorunsuz çalışması için):
//   · Önceki/sonraki verilirse 10 sn ileri/geri sarma tanımlanmaz (iOS ikisinden yalnızca birini gösterir).
//   · Parça bitince ('ended') sıradaki parça aynı audio öğesinde HEMEN başlatılır; setTimeout ile
//     beklenmez, yeni Audio() açılmaz. Ekran kilitliyken iOS gecikmeli ya da yeni öğeden çalmayı engeller.
// ============================================
(function () {
    'use strict';
    if (window.AppsMedya) return;

    const ms = 'mediaSession' in navigator && window.MediaMetadata ? navigator.mediaSession : null;
    const betik = document.currentScript && document.currentScript.src;
    const KOK = betik ? new URL('.', betik).href : new URL('./', location.href).href;
    const KAPAK = [
        { src: KOK + 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: KOK + 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ];
    const ISLER = ['play', 'pause', 'stop', 'previoustrack', 'nexttrack', 'seekto', 'seekbackward', 'seekforward'];
    const OLAYLAR = ['play', 'pause', 'playing', 'seeked', 'ratechange', 'loadedmetadata', 'durationchange', 'ended'];
    const set = (a, f) => { try { ms.setActionHandler(a, f || null); } catch (e) { /* bu işlem desteklenmiyor */ } };

    let aktif = null; // { sahip, o, au }

    function olcu() {
        const { o, au } = aktif;
        if (o.konum) { const k = o.konum() || {}; return { sure: +k.sure, simdi: +k.simdi }; }
        return { sure: au.duration, simdi: au.currentTime };
    }
    function konum() {
        if (!ms || !aktif || !ms.setPositionState) return;
        const { sure, simdi } = olcu();
        try {
            if (isFinite(sure) && sure > 0) {
                ms.setPositionState({ duration: sure, playbackRate: aktif.au.playbackRate || 1, position: Math.max(0, Math.min(sure, simdi || 0)) });
            }
        } catch (e) { /* eski tarayıcı */ }
    }
    function durum() {
        if (!ms || !aktif) return;
        try { ms.playbackState = aktif.au.paused ? 'paused' : 'playing'; } catch (e) { /* yok say */ }
        konum();
    }
    const dinle = (au, ac) => OLAYLAR.forEach((t) => au[ac ? 'addEventListener' : 'removeEventListener'](t, durum));

    function git(sn) {
        if (!aktif) return;
        const { o, au } = aktif;
        const { sure } = olcu();
        const t = Math.max(0, isFinite(sure) && sure > 0 ? Math.min(sure - 0.25, sn) : sn);
        if (o.git) o.git(t); else au.currentTime = t;
        konum();
    }

    function ayarla(sahip, o) {
        if (!ms || !o || !o.audio) return;
        if (!aktif || aktif.au !== o.audio) {
            if (aktif) dinle(aktif.au, false);
            dinle(o.audio, true);
        }
        aktif = { sahip, o, au: o.audio };
        const au = o.audio;
        try {
            ms.metadata = new MediaMetadata({ title: o.baslik || '', artist: o.sanatci || '', album: o.album || 'Mektep', artwork: o.kapak || KAPAK });
        } catch (e) { /* yok say */ }
        set('play', () => { if (o.oynat) o.oynat(); else au.play().catch(() => {}); });
        set('pause', () => { if (o.duraklat) o.duraklat(); else au.pause(); });
        set('stop', o.kapat ? () => o.kapat() : null);
        set('previoustrack', o.onceki || null);
        set('nexttrack', o.sonraki || null);
        set('seekto', (d) => { if (d && isFinite(d.seekTime)) git(d.seekTime); });
        const sira = !!(o.onceki || o.sonraki);
        set('seekbackward', sira ? null : (d) => git(olcu().simdi - ((d && d.seekOffset) || 10)));
        set('seekforward', sira ? null : (d) => git(olcu().simdi + ((d && d.seekOffset) || 10)));
        durum();
    }

    function birak(sahip) {
        if (!ms || !aktif || aktif.sahip !== sahip) return;
        dinle(aktif.au, false);
        aktif = null;
        ISLER.forEach((a) => set(a, null));
        try { ms.metadata = null; ms.playbackState = 'none'; } catch (e) { /* yok say */ }
    }

    window.AppsMedya = { ayarla, birak, sahip: () => (aktif ? aktif.sahip : null), destek: !!ms };
})();
