# Bun 1.4.5 — build Termux ARM64

## Artefakt

Workflow: [Build Bun 1.4.5 for Termux (Android ARM64)](../.github/workflows/build-termux-binary-1.4.5.yml).

Po poprawnym zakończeniu GitHub Actions udostępnia artefakt:
- nazwa: `bun-1.4.5-termux-aarch64`;
- pliki: `build/release/bun` oraz `bun-termux-aarch64.sha256`;
- platforma: Android ARM64 / AArch64, target Android API 28+;
- retencja: 30 dni.

Nie wpisujemy z góry rozmiaru ani sumy SHA-256 — pochodzą z konkretnego runu i muszą zostać odczytane z artefaktu.

## Weryfikacja

Po rozpakowaniu:

```sh
sha256sum -c bun-termux-aarch64.sha256
file build/release/bun
readelf -l build/release/bun | grep -E 'interpreter.*linker64'
```

## Instalacja w Termuxie

```sh
install -Dm755 build/release/bun "$PREFIX/bin/bun-tc39"
bun-tc39 --version
bun-tc39 --revision
```

Build cross-kompilowany potwierdza format i architekturę artefaktu, ale nie stanowi testu uruchomienia na fizycznym urządzeniu.
