#!/usr/bin/env python3
"""docs/ uygulamalarının sesli anlatımını BU BİLGİSAYARDA, yerel modellerle üretir.

Kural (CLAUDE.md, 6. bölüm): ses yalnızca bu bilgisayarda, ~/tts-shorts içindeki yerel
modellerle üretilir. Bulut TTS, yapay zekâ API'si, başka bir makine, CI ya da bulut oturumu
kullanılmaz. Modeller bulunamazsa betik durur; başka bir yola geçilmez.

Girdi:  tools/<ad>-anlatim.json   (node tools/<ad>-anlatim.mjs ile üretilir)
          tam       bütün duraklar sırayla, tek kayıt  -> tam.mp3
          duraklar  her durak ayrı kayıt               -> <dosya>.mp3
Çıktı:  docs/<ad>/anlatim/<profil>/*.mp3  ve  docs/<ad>/anlatim/<profil>/kayitlar.json
Profil: yetiskin -> erkek sesi (Antalia-2 Mini)
        cocuk    -> kadın sesi (EMA Lightning)
        Kayıtta tema metni varsa (ör. "cocuk/<dosya>") o profilde o metin okunur.
İsteğe bağlı (anlatım dosyasında):
  ayarlar.profiller  yalnızca bu profiller (ör. ["yetiskin"]: Ayet Ayet Arapça)
  ayarlar.kbps       MP3 bit hızı (varsayılan 32; Ayet Ayet Arapça 24: ses hacmi)
  ayarlar.cikis      çıktı kökü, depo köküne göre (ör. "../arapca-ses": ayrı ses deposu);
                     kayıtlar <cikis>/<profil>/ altına yazılır (ortam değişkeni ANLATIM_CIKIS ile değiştirilebilir)
  "dosya": "c01/s002" alt klasöre yazar; parça {"bolum": "2:2"} kayıtta bir bölümün başını işaretler,
  bölümlerin [baş, son] saniyeleri kayitlar.json -> bolumler alanına yazılır

Kullanım (yalnızca standart kütüphane; motor TTS venv'inde çalışır):
    python3 tools/tts/seslendir.py dualar                  # iki profil, tam + duraklar
    python3 tools/tts/seslendir.py --hepsi                 # anlatım dosyası olan her uygulama
    python3 tools/tts/seslendir.py siyer --profil cocuk --kayit giris 01-dogum
    python3 tools/tts/seslendir.py esma --yalniz duraklar --yeniden

Metni değişmeyen kayıt yeniden üretilmez (kayitlar.json -> imza). Sentezlenen her cümle
TTS_ONBELLEK klasöründe saklanır; tam anlatım duraklarla aynı cümle seslerinden kurulur.

Ayarlar (ortam değişkeni):
    TTS_PYTHON    TTS venv'inin Python'u      (varsayılan ~/tts-shorts/venv/bin/python)
    TTS_HF_HOME   modellerin Hugging Face önbelleği (varsayılan ~/tts-shorts/hf-cache)
    TTS_ONBELLEK  cümle sesleri önbelleği     (varsayılan ~/tts-shorts/onbellek/hcguler-apps)
"""

import argparse
import array
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

KOK = Path(__file__).resolve().parents[2]
MOTOR = Path(__file__).resolve().parent / 'neural_tts.py'
EV = Path.home()
TTS_PYTHON = Path(os.environ.get('TTS_PYTHON', EV / 'tts-shorts/venv/bin/python'))
HF_HOME = Path(os.environ.get('TTS_HF_HOME', EV / 'tts-shorts/hf-cache'))
ONBELLEK = Path(os.environ.get('TTS_ONBELLEK', EV / 'tts-shorts/onbellek/hcguler-apps'))

PROFILLER = {
    'yetiskin': {'ses': 'erkek', 'etiket': 'erkek', 'motor': 'antalia-mini', 'ad': 'Antalia-2 Mini'},
    'cocuk': {'ses': 'kadin', 'etiket': 'kadın', 'motor': 'ema-lightning', 'ad': 'EMA Lightning'},
}
MODEL_KLASORU = {
    'antalia-mini': 'models--cloud0day3--antalia-mini',
    'ema-lightning': 'models--canberkkkkkk--ema-lightning',
}

# Ses düzeni (saniye) ve kodlama. Değişirse SURUM artar; bütün kayıtlar yeniden kurulur.
SURUM = 1
BAS, SON, ARA = 0.3, 0.8, 0.35       # baştaki / sondaki sessizlik, duraklamasız parçalar arası
ESIK, PAY = 300, 0.04                # kırpma eşiği (16 bit genlik, ~-40 dBFS) ve kırpma payı
KODLAMA = ['-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', '24000', '-ac', '1',
           '-c:a', 'libmp3lame', '-b:a', '32k']
GRUP = 40                            # motora tek seferde verilen cümle sayısı


def dur(mesaj):
    print(f'seslendir: {mesaj}', file=sys.stderr)
    sys.exit(1)


def yerel_denetim():
    """Yalnızca bu bilgisayardaki motor ve modeller; yoksa durulur, başka yola geçilmez."""
    eksik = []
    if not TTS_PYTHON.is_file():
        eksik.append(f'TTS Python yok: {TTS_PYTHON}')
    for profil in PROFILLER.values():
        klasor = HF_HOME / 'hub' / MODEL_KLASORU[profil['motor']]
        if not klasor.is_dir():
            eksik.append(f"{profil['ad']} modeli yok: {klasor}")
    if not shutil.which('ffmpeg'):
        eksik.append('ffmpeg yok')
    if eksik:
        dur('yerel seslendirme kurulu değil; ses yalnızca bu bilgisayarda üretilir, '
            'bulut TTS ya da başka bir makine kullanılmaz.\n  ' + '\n  '.join(eksik)
            + '\n  Kurulum: tools/tts/README.md')


def soz(parca):
    if isinstance(parca, dict):   # bölüm işareti: ses yok
        return '', None
    metin, ara = (parca[0], parca[1]) if isinstance(parca, list) else (parca, None)
    metin = ' '.join(str(metin).replace('’', "'").replace('‘', "'").split())
    return metin, ara


def anahtar(motor, metin):
    return hashlib.sha1(f'{motor}\0{metin}'.encode()).hexdigest()[:20]


def cumle_dosyasi(motor, metin):
    return ONBELLEK / motor / f'{anahtar(motor, metin)}.wav'


def sentezle(motor, metinler):
    """Önbellekte olmayan cümleleri yerel motorla, çevrimdışı üretir."""
    eksik = sorted({m for m in metinler if m and not cumle_dosyasi(motor, m).is_file()})
    if not eksik:
        return
    (ONBELLEK / motor).mkdir(parents=True, exist_ok=True)
    ortam = {**os.environ, 'HF_HOME': str(HF_HOME), 'HF_HUB_OFFLINE': '1', 'TRANSFORMERS_OFFLINE': '1'}
    for i in range(0, len(eksik), GRUP):
        grup = eksik[i:i + GRUP]
        isler = [{'text': m, 'output_file': str(cumle_dosyasi(motor, m)) + '.tmp.wav'} for m in grup]
        print(f'  {motor}: cümle {i + 1}–{i + len(grup)} / {len(eksik)}', flush=True)
        sonuc = subprocess.run([str(TTS_PYTHON), '-I', str(MOTOR)], input=json.dumps({'engine': motor, 'jobs': isler}),
                               text=True, capture_output=True, env=ortam)
        if sonuc.returncode:
            dur(f'{motor} hata verdi: {sonuc.stderr.strip().splitlines()[-1:] or sonuc.returncode}')
        for is_ in isler:
            os.replace(is_['output_file'], is_['output_file'][:-8])


def oku(dosya):
    with wave.open(str(dosya), 'rb') as w:
        if w.getsampwidth() != 2 or w.getnchannels() != 1:
            dur(f'beklenmeyen WAV biçimi: {dosya}')
        hz = w.getframerate()
        ornek = array.array('h', w.readframes(w.getnframes()))
    if sys.byteorder == 'big':
        ornek.byteswap()
    bas = next((i for i, v in enumerate(ornek) if abs(v) > ESIK), 0)
    son = next((i for i in range(len(ornek) - 1, -1, -1) if abs(ornek[i]) > ESIK), len(ornek) - 1)
    pay = int(PAY * hz)
    return hz, ornek[max(0, bas - pay):min(len(ornek), son + pay + 1)]


def sessizlik(saniye, hz):
    return array.array('h', bytes(int(saniye * hz) * 2))


def kur(motor, parcalar, hedef, kodlama=KODLAMA):
    """Cümle seslerini duraklamalarla birleştirir, ses seviyesini eşitler, MP3 yazar.
    Süreyi ve bölüm sınırlarını ({ad: [baş, son]}, saniye) döndürür."""
    hz, ses = None, array.array('h')
    sozler = [soz(p) for p in parcalar]
    basla = []   # (bölüm adı, örnek sayısı)
    for n, (metin, ara) in enumerate(sozler):
        if isinstance(parcalar[n], dict):
            basla.append((parcalar[n]['bolum'], len(ses)))
            continue
        if not metin:
            continue
        h, ornek = oku(cumle_dosyasi(motor, metin))
        if hz is None:
            hz = h
            ses.extend(sessizlik(BAS, hz))
        ses.extend(ornek)
        bosluk = SON if n == len(sozler) - 1 else (ara if ara is not None else ARA)
        ses.extend(sessizlik(bosluk, hz))
    if sys.byteorder == 'big':
        ses.byteswap()
    hedef.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as gecici:
        ham = Path(gecici) / 'ham.wav'
        with wave.open(str(ham), 'wb') as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(hz)
            w.writeframes(ses.tobytes())
        cikti = Path(gecici) / 'cikti.mp3'
        sonuc = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(ham), *kodlama,
                                '-map_metadata', '-1', str(cikti)], capture_output=True, text=True)
        if sonuc.returncode:
            dur(f'ffmpeg hata verdi: {sonuc.stderr.strip()[-300:]}')
        shutil.move(str(cikti), hedef)
    bolumler = {}
    for i, (ad, ornek) in enumerate(basla):
        son = basla[i + 1][1] if i + 1 < len(basla) else len(ses)
        bolumler[ad] = [round(ornek / hz, 2), round(son / hz, 2)]
    return round(len(ses) / hz, 2), bolumler


def tema_metni(dosya):
    return '/' in dosya and dosya.split('/', 1)[0] in PROFILLER


def kayitlar_secimi(veri, profil):
    """Profilde okunacak kayıtlar: tam + her durak. Durağın bu profile ait tema metni
    ("<profil>/<dosya>") varsa o okunur; tam anlatım her profilde veri['tam'] metnidir."""
    tema = {d['dosya'].split('/', 1)[1]: d for d in veri['duraklar'] if d['dosya'].startswith(profil + '/')}
    secim = {d['dosya']: tema.get(d['dosya'], d) for d in veri['duraklar'] if not tema_metni(d['dosya'])}
    if 'tam' in veri:
        secim['tam'] = veri['tam']
    return secim


def uygulama(ad, profiller, yalniz, kayit, yeniden):
    kaynak = KOK / 'tools' / f'{ad}-anlatim.json'
    klasor = KOK / 'docs' / ad
    if not kaynak.is_file():
        dur(f'{kaynak.relative_to(KOK)} yok; önce node tools/{ad}-anlatim.mjs')
    if not klasor.is_dir():
        dur(f'docs/{ad}/ klasörü yok (tek dosyalık uygulama; ör. Namaz Yolculuğu kayıtları docs/namaz-audio/ olduğu gibi kalır)')
    veri = json.loads(kaynak.read_text(encoding='utf-8'))
    ayar = veri.get('ayarlar', {})
    if ayar.get('profiller'):
        profiller = [x for x in profiller if x in ayar['profiller']]
    kodlama = [f"{ayar['kbps']}k" if x == '32k' else x for x in KODLAMA] if ayar.get('kbps') else KODLAMA
    cikis_kok = klasor / 'anlatim'
    if ayar.get('cikis'):
        # ANLATIM_CIKIS: depo bir git worktree'sinde açıksa ses deposunun gerçek yolu
        cikis_kok = Path(os.environ['ANLATIM_CIKIS']).resolve() if os.environ.get('ANLATIM_CIKIS') else (KOK / ayar['cikis']).resolve()
        if not cikis_kok.is_dir():
            dur(f'{ad}: çıktı klasörü yok: {cikis_kok} (ayrı ses deposunu oraya klonlayın)')
    for profil in profiller:
        p = PROFILLER[profil]
        motor, cikti = p['motor'], cikis_kok / profil
        defter_yolu = cikti / 'kayitlar.json'
        defter = json.loads(defter_yolu.read_text(encoding='utf-8')) if defter_yolu.is_file() else {}
        eski = defter.get('kayitlar', {})
        secim = kayitlar_secimi(veri, profil)
        if yalniz == 'tam':
            secim = {k: v for k, v in secim.items() if k == 'tam'}
        elif yalniz == 'duraklar':
            secim = {k: v for k, v in secim.items() if k != 'tam'}
        if kayit:
            bilinmeyen = set(kayit) - set(secim)
            if bilinmeyen:
                dur(f'{ad}: kayıt yok: {", ".join(sorted(bilinmeyen))}')
            secim = {k: v for k, v in secim.items() if k in kayit}
        is_listesi = []
        for dosya, d in secim.items():
            sozler = [soz(x) for x in d['parcalar']]
            isaret = [x for x in d['parcalar'] if isinstance(x, dict)]
            imza = hashlib.sha1(json.dumps([SURUM, kodlama, BAS, SON, ARA, motor, sozler] + ([isaret] if isaret else []), ensure_ascii=False).encode()).hexdigest()[:16]
            if yeniden or eski.get(dosya, {}).get('imza') != imza or not (cikti / f'{dosya}.mp3').is_file():
                is_listesi.append((dosya, d, imza))
        print(f'{ad} / {profil} ({p["etiket"]} sesi, {p["ad"]}): {len(is_listesi)} / {len(secim)} kayıt üretilecek', flush=True)
        sentezle(motor, [soz(x)[0] for _, d, _ in is_listesi for x in d['parcalar']])
        for dosya, d, imza in is_listesi:
            sure, bolumler = kur(motor, d['parcalar'], cikti / f'{dosya}.mp3', kodlama)
            eski[dosya] = {'baslik': d.get('baslik', ''), 'sure': sure, 'imza': imza, **({'bolumler': bolumler} if bolumler else {})}
            print(f'  {dosya}.mp3  {int(sure // 60)}:{int(sure % 60):02d}', flush=True)
        if not kayit and not yalniz:
            # Anlatım dosyasından çıkan kayıtların sesi de silinir.
            for fazla in set(eski) - set(secim):
                (cikti / f'{fazla}.mp3').unlink(missing_ok=True)
                del eski[fazla]
        sira = ['tam'] + [d['dosya'] for d in veri['duraklar'] if not tema_metni(d['dosya'])]
        defter = {
            '_aciklama': f'{ad} sesli anlatım kayıtları, {profil} profili ({p["etiket"]} sesi). '
                         'tools/tts/seslendir.py ile bu bilgisayarda, yerel modelle üretildi; elle düzenlemeyin. '
                         'sure: saniye; imza: metin ve ses ayarlarının özeti.',
            'profil': profil, 'ses': p['ses'], 'motor': motor,
            'kayitlar': {k: eski[k] for k in sira if k in eski},
        }
        cikti.mkdir(parents=True, exist_ok=True)
        defter_yolu.write_text(json.dumps(defter, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def main():
    ap = argparse.ArgumentParser(description='docs/ sesli anlatımını yerel modellerle bu bilgisayarda üretir.')
    ap.add_argument('uygulamalar', nargs='*', help='tools/<ad>-anlatim.json adları (ör. dualar siyer)')
    ap.add_argument('--hepsi', action='store_true', help='docs/<ad>/ klasörü olan her anlatım dosyası')
    ap.add_argument('--profil', choices=list(PROFILLER), action='append', help='yalnızca bu profil (tekrarlanabilir)')
    ap.add_argument('--yalniz', choices=['tam', 'duraklar'], help='yalnızca tam ya da parçalı anlatım')
    ap.add_argument('--kayit', nargs='+', help='yalnızca bu kayıtlar (dosya adı; tam için "tam")')
    ap.add_argument('--yeniden', action='store_true', help='metin değişmemiş olsa da yeniden kur')
    a = ap.parse_args()
    adlar = a.uygulamalar
    if a.hepsi:
        adlar = sorted(f.name[:-len('-anlatim.json')] for f in (KOK / 'tools').glob('*-anlatim.json')
                       if (KOK / 'docs' / f.name[:-len('-anlatim.json')]).is_dir())
    if not adlar:
        ap.error('uygulama adı ya da --hepsi verin')
    yerel_denetim()
    for ad in adlar:
        uygulama(ad, a.profil or list(PROFILLER), a.yalniz, a.kayit, a.yeniden)


if __name__ == '__main__':
    main()
