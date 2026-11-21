#!/usr/bin/env python3
"""Ezberler — Suûd eş-Şüreym ayet kayıtlarını indirir.

data.js içindeki surelerin her ayeti (ve Âyetü'l-Kürsî) için mp3 dosyasını
docs/ezberler/audio/ klasörüne indirir ve audio/manifest.json dosyasını yazar.
Uygulama, manifest'te listelenen dosyaları yerelden; listelenmeyenleri uzak
kaynaktan çalar.

Kullanım:
    python3 tools/ezberler-ses-indir.py          # eksikleri indir
    python3 tools/ezberler-ses-indir.py --force  # hepsini yeniden indir

Yalnızca Python standart kütüphanesi gerekir.
"""
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent / "apps" / "ezberler"
AUDIO = ROOT / "audio"

# Sırayla denenir; ilk çalışan kaynak kullanılır. Dosya adı: SSSAAA.mp3 (sure + ayet).
SOURCES = [
    "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/",
    "https://everyayah.com/data/Saood_ash-Shuraym_64kbps/",
    "https://verses.quran.com/Shuraym/mp3/",
]
HEADERS = {"User-Agent": "Mozilla/5.0 (ezberler-audio-fetch; +https://hcguler.github.io/mektep/ezberler/)"}


def load_codes():
    text = (ROOT / "data.js").read_text(encoding="utf-8")
    data = json.loads(text[text.index("{", text.index("window.EZBER_DATA")): text.rindex("}") + 1])
    codes = ["001001"]  # besmele
    for bolum in data["bolumler"]:
        for oge in bolum["ogeler"]:
            if oge.get("ses"):
                codes.append(oge["ses"])
            for satir in oge["satirlar"]:
                if satir.get("ses"):
                    codes.append(satir["ses"])
    return sorted(set(codes)), data["kari"]["ad"]


def looks_like_mp3(blob):
    if len(blob) < 2000:
        return False
    return blob[:3] == b"ID3" or (blob[0] == 0xFF and (blob[1] & 0xE0) == 0xE0)


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


def main():
    force = "--force" in sys.argv
    codes, kari = load_codes()
    AUDIO.mkdir(exist_ok=True)
    have, failed, downloaded = [], [], 0
    used = set()

    for code in codes:
        target = AUDIO / f"{code}.mp3"
        if target.exists() and not force and looks_like_mp3(target.read_bytes()):
            have.append(code)
            continue
        ok = False
        for base in SOURCES:
            for attempt in range(2):
                try:
                    blob = fetch(base + code + ".mp3")
                    if looks_like_mp3(blob):
                        target.write_bytes(blob)
                        ok = True
                        used.add(base)
                        break
                except (urllib.error.URLError, TimeoutError, ConnectionError):
                    time.sleep(1 + attempt)
            if ok:
                break
        if ok:
            downloaded += 1
            have.append(code)
            print(f"  indirildi  {code}.mp3")
        else:
            failed.append(code)
            print(f"  BAŞARISIZ  {code}.mp3")
        time.sleep(0.15)

    manifest = {
        "kari": kari,
        "kaynak": sorted(used) or None,
        "files": sorted(have),
    }
    (AUDIO / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    total = sum((AUDIO / f"{c}.mp3").stat().st_size for c in have)
    print(f"\n{len(have)}/{len(codes)} dosya hazır ({downloaded} yeni indirildi, {total / 1e6:.1f} MB).")
    if failed:
        print("İndirilemeyenler:", ", ".join(failed))
    return 1 if not have or len(failed) > len(codes) // 2 else 0


if __name__ == "__main__":
    sys.exit(main())
