# Patche dla Bun 1.4.5

## Przypięta baza

Zestaw jest przygotowany dla oficjalnego tagu **bun-v1.4.5**, commit:

```text
a7733435cf40429e3b35c36072769df2052b80f1
```

Dostępne warianty:
- [minimalny patch TC39 decorators + HMR](../patches/bun-1.4.5-tc39-hmr.patch);
- [patch zbiorczy dla Termuksa](../patches/bun-1.4.5-termux-combined.patch).

Nie nakładaj obu wariantów na ten sam checkout. Patch zbiorczy już zawiera zmiany HMR.

## Przeniesienie z 1.4.4

Przed migracją porównano blob SHA plików źródłowych dotykanych przez patch 1.4.4 pomiędzy commitami 1.4.4 i 1.4.5. Pliki:
- `src/runtime/bake/bake.private.d.ts`
- `src/runtime/bake/hmr-module.ts`
- `test/bake/dev/bundle.test.ts`
- `src/resolver/resolver.rs`
- `test/cli/run/run_command.test.ts`
- `src/js/internal/serve_cli.ts`

mają identyczną zawartość w obu bazach. Dlatego zmiany kodu mogły zostać przeniesione bez ręcznego przepisywania hunków. Z nowych patchy usunięto stare metadane blobów `index`; baza jest jednoznacznie przypięta w workflow.

## Minimalny patch HMR

Patch udostępnia w syntetycznym module `bun:wrap` helpery dekoratorów standardowych i prywatnych elementów:
`__privateAdd`, `__privateGet`, `__privateIn`, `__privateMethod`, `__privateSet`, `__publicField`, `__decorateElement`, `__decoratorMetadata`, `__decoratorStart`, `__runInitializers`.

Nie zmienia transformacji TypeScript ani semantyki dekoratorów. Łączy istniejące helpery runtime z modułem HMR.

Test regresji obejmuje dekorator klasy, pola, metody, auto-accessor, metadane, inicjalizatory i prywatne elementy. Uruchamia osobno HMR klienta i serwera oraz aktualizuje moduł.

## Patch zbiorczy Termux

Patch zbiorczy zawiera:
- TC39 decorators + HMR;
- tolerowanie androidowego `ENOENT` dla niedostępnego przodka katalogu współdzielonego storage, bez maskowania błędu katalogu docelowego;
- otwieranie URL przez `termux-open-url` lub `xdg-open`;
- testy regresji dla uruchamiania skryptów w shared storage i instalowania binarek pakietów z ochroną symlinków.

## Nakładanie patchy

Minimalny wariant:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout a7733435cf40429e3b35c36072769df2052b80f1
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.5-tc39-hmr.patch -o ../bun-1.4.5-tc39-hmr.patch
git apply --check ../bun-1.4.5-tc39-hmr.patch
git apply ../bun-1.4.5-tc39-hmr.patch
git diff --check
```

Wariant Termux wykonaj na czystym checkoutcie zamiast minimalnego:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout a7733435cf40429e3b35c36072769df2052b80f1
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.5-termux-combined.patch -o ../bun-1.4.5-termux-combined.patch
git apply --check ../bun-1.4.5-termux-combined.patch
git apply ../bun-1.4.5-termux-combined.patch
git diff --check
```

## Testy

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
bun bd test test/cli/run/run_command.test.ts
bun bd test test/cli/install/termux-bin.test.ts
```

Test CWD jest warunkowy i wymaga Androida z montowaniem, które odtwarza `ENOENT` dla niedostępnego przodka. Testy Termux pomijają się na pozostałych platformach.

## Build Android ARM64

Workflow `.github/workflows/build-termux-binary-1.4.5.yml` buduje natywną binarkę dla Termux (Android ARM64, NDK r27c) i publikuje ją jako artefakt GitHub Actions:
- `build/release/bun`
- `bun-termux-aarch64.sha256`

Artefakt jest tymczasowy i ma retencję 30 dni. Po zakończeniu workflow pobierz ZIP z sekcji **Artifacts** danego uruchomienia. Workflow nie deklaruje testu na fizycznym urządzeniu; kompilacja i kontrola ELF nie zastępują testu runtime na telefonie.
