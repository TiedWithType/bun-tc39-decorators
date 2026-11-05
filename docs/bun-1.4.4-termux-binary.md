# Bun 1.4.4 — gotowa binarka Termux ARM64

## Pobranie

- **Binarka:** `build/release/bun` w artefakcie ZIP.
- **Platforma:** Android ARM64 / AArch64, API 28+ (Android 9+).
- **Rozmiar pliku:** 113 290 272 bajty (ok. 108 MiB).
- **SHA-256 binarki:** `af859b178246aac981f2c4f7d0dcbc1d04598cc061586075e6c2d4935b593ec7`.
- **Build:** [GitHub Actions — run #3, zakończony sukcesem](https://github.com/TiedWithType/bun-runtime-patches/actions/runs/41059523736).
- **Artefakt:** `bun-1.4.4-termux-aarch64`, ID `12980685769`.
- **Wygaśnięcie artefaktu:** 29 listopada 2026 r. Artefakty Actions są tymczasowe.

Pobierz ZIP z sekcji **Artifacts** na stronie runu. W środku znajdują się:
`build/release/bun` i `bun-termux-aarch64.sha256`.

## Weryfikacja sumy

W katalogu, w którym rozpakowano ZIP, uruchom:

```sh
sha256sum -c bun-termux-aarch64.sha256
```

Oczekiwany wynik to `build/release/bun: OK`.

## Instalacja w Termuxie

Z katalogu rozpakowanego artefaktu:

```sh
install -Dm755 build/release/bun "$PREFIX/bin/bun-tc39"
bun-tc39 --version
bun-tc39 --revision
```

Aby używać jej pod nazwą `bun`, zainstaluj ją jako `"$PREFIX/bin/bun"` zamiast
`bun-tc39`. Upewnij się, że katalog `$PREFIX/bin` jest w `PATH`.

## Pochodzenie buildu

- Wersja źródeł Bun: `1.4.4`.
- Bazowy commit upstream: `38afee6c84fcf48c0edb2466aa4b27d287a59c30`.
- Repo patchy i workflow: commit `98d56b549ce8fd21f53989ca59d2d9c88f496830`.
- Patch: `patches/bun-1.4.4-termux-combined.patch`.
- Kompilator: LLVM 23; Android NDK r27c (`27.2.12479018`).
- Format binarki potwierdzony lokalnie: ELF 64-bit LSB PIE, AArch64, interpreter
  `/system/bin/linker64`, target Android 28.

Build workflow zakończył się sukcesem, a binarka i jej suma kontrolna zostały
pobrane i sprawdzone. Nie uruchamiano jej na rzeczywistym urządzeniu Android
w ramach tej weryfikacji; testy runtime na telefonie pozostają osobnym krokiem.
