# Bun 1.4.4 — binarka Termux ARM64

## Pobranie

- **Platforma:** Android ARM64 / AArch64, API 28+ (Android 9+).
- **Plik w archiwum:** `build/release/bun`.
- **Rozmiar:** 113 290 272 bajty (ok. 108 MiB).
- **SHA-256 binarki:** `af859b178246aac981f2c4f7d0dcbc1d04598cc061586075e6c2d4935b593ec7`.
- **Archiwum:** `bun-1.4.4-termux-aarch64`, ID artefaktu `12980685769`.
- **Link do kompilacji:** [GitHub Actions run](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41059523736).
- **Wygaśnięcie artefaktu:** 29 listopada 2026 r. Artefakty Actions są tymczasowe.

Na stronie runu otwórz sekcję **Artifacts** i pobierz archiwum ZIP. Zawiera ono `build/release/bun` oraz `bun-termux-aarch64.sha256`.

## Sprawdzenie sumy

Po rozpakowaniu archiwum uruchom:

```sh
sha256sum -c bun-termux-aarch64.sha256
```

Oczekiwany wynik: `build/release/bun: OK`.

## Instalacja w Termuxie

Z katalogu rozpakowanego archiwum:

```sh
install -Dm755 build/release/bun "$PREFIX/bin/bun-tc39"
bun-tc39 --version
bun-tc39 --revision
```

Aby używać binarki pod nazwą `bun`, zainstaluj ją jako `"$PREFIX/bin/bun"` i sprawdź, czy `$PREFIX/bin` znajduje się w `PATH`.

## Informacje o kompilacji

- Wersja źródeł Bun: `1.4.4`.
- Bazowy commit źródeł: `38afee6c84fcf48c0edb2466aa4b27d287a59c30`.
- Toolchain: LLVM 23, Android NDK r27c (`27.2.12479018`), Java 17.
- Format: ELF 64-bit LSB PIE, AArch64, interpreter `/system/bin/linker64`, Android API 28.

Kompilacja i kontrola formatu ELF zakończyły się powodzeniem. Binarka i jej suma kontrolna zostały sprawdzone po pobraniu. Nie uruchamiano jej na rzeczywistym urządzeniu Android, więc działanie runtime na telefonie pozostaje niepotwierdzone.

## Raporty

- [Wyniki weryfikacji](../verification/termux-binary-1.4.4/results.md)
- [Metadane kompilacji](../verification/termux-binary-1.4.4/build-info.json)
