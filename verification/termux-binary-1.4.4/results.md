# Wyniki buildu Bun 1.4.4 — Termux ARM64

Data: 30 października 2026 r.

## Status

- Kompilacja GitHub Actions: **SUCCESS**.
- Cross-build release dla Android ARM64: zakończony.
- Kontrola ELF: potwierdzono AArch64, PIE i interpreter `/system/bin/linker64`.
- Suma SHA-256 binarki: sprawdzona po pobraniu artefaktu.
- Test uruchomienia na rzeczywistym urządzeniu: **nie wykonano**.

## Artefakt

[Otwórz workflow run](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41059523736) i pobierz artefakt `bun-1.4.4-termux-aarch64`.

- Ścieżka w ZIP: `build/release/bun`.
- Rozmiar: 113 290 272 bajty.
- SHA-256 binarki: `af859b178246aac981f2c4f7d0dcbc1d04598cc061586075e6c2d4935b593ec7`.
- SHA-256 archiwum ZIP: `4f70c3ef2704fe58fe0b8ceaed6c5615fb365ce95c8e5962877ee32f668f22f4`.
- Artefakt wygasa 29 listopada 2026 r.

## Weryfikacja po pobraniu

```sh
sha256sum -c bun-termux-aarch64.sha256
file build/release/bun
```

Oczekiwana suma kontrolna to `build/release/bun: OK`. Oczekiwany format to ELF 64-bit AArch64 z interpreterem `/system/bin/linker64`.

## Ograniczenia

Wyniki potwierdzają poprawną kompilację i statyczny format pliku, ale nie gwarantują działania na każdym wydaniu Androida/Termuksa. Należy osobno sprawdzić uruchomienie binarki i testy runtime na urządzeniu ARM64.
