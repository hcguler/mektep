"""Türkçe yerel seslendirme motoru (EMA Lightning: kadın, Antalia-2 Mini: erkek), yalnızca bu bilgisayarda.

Herbadex Studio'daki (herbalhealtydemo/apps/studio/src/server/neural_tts.py) betiğin aynısıdır.
tools/tts/seslendir.py tarafından TTS venv'inin Python'u ile, çevrimdışı (HF_HUB_OFFLINE=1)
başlatılır: modeller HF_HOME içinde önceden bulunmalıdır; çalışırken hiçbir şey indirilmez,
metin bilgisayardan çıkmaz. stdin'den tek bir JSON nesnesi okur,

    {"engine": "ema-lightning" | "antalia-mini", "jobs": [{"text": "...", "output_file": "..."}]}

ve her iş için bir 48 kHz WAV yazar. Sabit tohum, aynı metnin hep aynı okunmasını sağlar.
"""

import json
import sys
import warnings


def load(engine: str):
    if engine == "ema-lightning":
        from ema_lightning import EMA

        return EMA(device="cpu")
    if engine == "antalia-mini":
        from antalia_mini import Antalia

        return Antalia(device="cpu")
    raise ValueError(f"unknown engine: {engine}")


def main() -> None:
    warnings.filterwarnings("ignore")
    request = json.load(sys.stdin)
    tts = load(request["engine"])
    for job in request["jobs"]:
        tts.say(job["text"], path=job["output_file"], seed=0)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # one line for the Studio error message
        print(f"{type(error).__name__}: {error}", file=sys.stderr)
        sys.exit(1)
