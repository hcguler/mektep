# tools/tts — yerel sesli anlatım

`docs/` uygulamalarının sesli anlatımı **yalnızca bu bilgisayarda**, yerel modellerle üretilir.
Bulut TTS, yapay zekâ API'si, başka bir makine, CI ya da bulut oturumu kullanılmaz; metin
bilgisayardan çıkmaz. Modeller bulunamazsa `seslendir.py` durur, başka bir yola geçilmez.

Bu bir stüdyo değildir: arayüz, sunucu, yayın işi yoktur. Yalnızca anlatım metninden MP3 üretir.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `neural_tts.py` | Motor. Herbadex Studio'daki (`herbalhealtydemo/apps/studio/src/server/neural_tts.py`) betiğin aynısı: stdin'den `{"engine", "jobs"}` JSON'u okur, her iş için 48 kHz WAV yazar. TTS venv'inin Python'u ile, `HF_HUB_OFFLINE=1` çalışır. |
| `seslendir.py` | Sürücü (yalnızca standart kütüphane + `ffmpeg`). `tools/<ad>-anlatim.json` okur, motoru çağırır, cümleleri duraklamalarla birleştirir, ses seviyesini eşitler, MP3 yazar. |

## Profiller ve sesler

| Profil (`apps:tema`) | Ses (`apps:ses`) | Motor | Lisans |
| --- | --- | --- | --- |
| `yetiskin` | erkek | Antalia-2 Mini (`antalia-mini`) | Apache-2.0, sentetik ses |
| `cocuk` | kadın | EMA Lightning (`ema-lightning`) | Apache-2.0, sentetik ses |

İçerik iki profilde aynıdır. Anlatım dosyasında bir durağın tema metni varsa (`cocuk/<dosya>`),
o profilde o metin okunur.

## Girdi ve çıktı

- Girdi: `tools/<ad>-anlatim.json` (`node tools/<ad>-anlatim.mjs` ile üretilir, elle düzenlenmez).
  - `tam`: bütün duraklar sırayla, tek kayıt (`tools/lib/tam-anlatim.mjs`).
  - `duraklar`: her durak ayrı kayıt (parçalı anlatım).
- Çıktı: `docs/<ad>/anlatim/<profil>/tam.mp3`, `docs/<ad>/anlatim/<profil>/<dosya>.mp3` ve
  `docs/<ad>/anlatim/<profil>/kayitlar.json` (başlık, süre, imza).
- Ses: mono, 24 kHz, MP3 32 kbps, `loudnorm` −18 LUFS. Baştan 0,3 sn, sondan 0,8 sn sessizlik;
  duraklamasız parçalar arasında 0,35 sn; tam anlatımda duraklar arasında en az 1,6 sn.
- Metni değişmeyen kayıt yeniden üretilmez (`imza`). Sentezlenen her cümle
  `~/tts-shorts/onbellek/hcguler-apps/` altında saklanır; tam anlatım duraklarla aynı cümle
  seslerinden kurulur.
- Uygulamada çalma: ortak oynatıcı `docs/anlatim.js` (`data-anlatim` yer tutucuları; bkz. `CLAUDE.md` 6.4).
- Tek dosyalık uygulamalar (`docs/<ad>.html`) desteklenmez. Namaz Yolculuğu'nun kayıtları
  (`docs/namaz-audio/`) olduğu gibi kalır.

## Kullanım

```bash
node tools/dualar-anlatim.mjs                       # önce metin
python3 tools/tts/seslendir.py dualar               # iki profil, tam + duraklar
python3 tools/tts/seslendir.py --hepsi              # anlatım dosyası olan her uygulama
python3 tools/tts/seslendir.py siyer --profil cocuk --kayit giris 01-dogum
python3 tools/tts/seslendir.py esma --yalniz duraklar --yeniden
```

Hız (i7-10750H, ekran kartı yok): cümle başına ~1 sn. İki profil ayrı süreçte aynı anda
çalıştırılabilir (`OMP_NUM_THREADS=6` ile).

## Kurulum (bir kez; Herbadex Studio ile ortak)

```bash
cd ~/tts-shorts
python3 -m venv --without-pip venv && python3 -m pip --python venv/bin/python install pip
venv/bin/python -m pip install --index-url https://download.pytorch.org/whl/cpu torch
venv/bin/python -m pip install "ema-lightning==1.1.2" "antalia-mini[hub]==1.0.1" soundfile
HF_HOME=~/tts-shorts/hf-cache venv/bin/python -c "from ema_lightning import EMA; from antalia_mini import Antalia; EMA('cpu'); Antalia(device='cpu')"
```

Son komut modelleri bir kez indirir (63 MB); sonra her şey çevrimdışıdır. Ayarlar:
`TTS_PYTHON`, `TTS_HF_HOME`, `TTS_ONBELLEK` (bkz. `seslendir.py` başı).
