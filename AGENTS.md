# Mektep — yapay zekâ ajanları için notlar (AGENTS.md)

Statik GitHub Pages sitesi; `docs/` klasöründen yayınlanır (`https://hcguler.github.io/mektep/`).
Uygulama standartlarının tamamı (yapı, kaynak kesinliği, içerik kalıbı, tema, erişilebilirlik,
sesli anlatım, PWA, çalışma biçimi): `CLAUDE.md`. Yeni uygulama eklemeden ya da var olanı
değiştirmeden önce o dosya okunur.

## Sesli anlatım: yalnızca bu bilgisayarda (kesin kural)

- Text-to-speech (TTS) **yalnızca bu bilgisayarda**, yerel modellerle `tools/tts/seslendir.py` ile
  üretilir (yetişkin profili: erkek sesi, Antalia-2 Mini; çocuk profili: kadın sesi, EMA Lightning).
- Bulut TTS servisi, yapay zekâ ses API'si, tarayıcı `speechSynthesis`, başka bir makine, CI
  (GitHub Actions) ya da bulut/uzak ajan oturumu ile ses **üretilmez**; anlatım metni hiçbir dış
  servise gönderilmez.
- `~/tts-shorts` içindeki yerel modeller yoksa ses üretilmez ve başka bir yol denenmez: yalnızca
  anlatım metni hazırlanır, durum kullanıcıya bildirilir.
- Ayrıntı: `CLAUDE.md` 6. bölüm, `tools/tts/README.md`.

## Ses oynatıcıları: kilit ekranı ve sıralı çalma

- Ses çalan her oynatıcı ekran kilitliyken bildirim panelinde müzik çalar gibi görünür ve sıradaki
  kayda geçer. Bu yalnızca ortak `docs/medya.js` (`AppsMedya.ayarla` / `birak`) ile yapılır;
  `navigator.mediaSession` doğrudan kullanılmaz. Ayrıntı ve kesin kurallar: `CLAUDE.md` 6.5.
