# Patche dla Bun 1.4.4

## Przypięta baza

Zestaw jest przygotowany dla oficjalnego tagu **bun-v1.4.4**, commit:

```text
38afee6c84fcf48c0edb2466aa4b27d287a59c30
```

Dostępne warianty:
- [minimalny patch TC39 decorators + HMR](../patches/bun-1.4.4-tc39-hmr.patch);
- [patch zbiorczy dla Termuksa](../patches/bun-1.4.4-termux-combined.patch).

Nie nakładaj obu wariantów na ten sam checkout. Patch zbiorczy już zawiera zmiany HMR.

## Minimalny patch HMR — szczegóły

### Problem

Podczas uruchomienia kodu ze standardowymi dekoratorami TC39 przez HMR, runtime klienta i serwera odwoływał się do helperów z syntetycznego modułu `bun:wrap`. W rejestracji tego modułu brakowało helperów używanych przez transformację dekoratorów. Błąd był widoczny m.in. jako:

```text
TypeError: import_bun_wrap.__decoratorStart is not a function
```

### Zmiany w źródłach

Patch `bun-1.4.4-tc39-hmr.patch` zmienia dokładnie trzy pliki:
1. `src/runtime/bake/bake.private.d.ts` — dodaje deklaracje dziesięciu helperów do modułu `bun:wrap`.
2. `src/runtime/bake/hmr-module.ts` — importuje helpery z `../../runtime.bun` i umieszcza je w obiekcie rejestrowanym przez `registerSynthetic("bun:wrap", ...)`.
3. `test/bake/dev/bundle.test.ts` — dodaje test klienta i test serwera, sprawdzające dekoratory i aktualizację modułu HMR.

Lista helperów: `__privateAdd`, `__privateGet`, `__privateIn`, `__privateMethod`, `__privateSet`, `__publicField`, `__decorateElement`, `__decoratorMetadata`, `__decoratorStart`, `__runInitializers`.

To połączenie już istniejących helperów z runtime Bun z syntetycznym modułem HMR. Patch nie zmienia semantyki dekoratorów ani samego transformera.

### Test regresji

Fixture obejmuje dekorator klasy, pola, metody i auto-accessora, metadane, inicjalizator klasy oraz prywatne pole i metodę. Testy uruchamiają fixture w runtime HMR klienta i serwera, a następnie zmieniają inicjalizator pola przez HMR.

Wynik początkowy:

```text
4:8:27:11:tc39:true
```

Po aktualizacji modułu:

```text
6:8:29:11:tc39:true
```

Testy uruchom na zbudowanym Bun:

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
```

## Patch zbiorczy — zakres Termux

Patch zbiorczy 1.4.4 łączy cztery części:

- **TC39 decorators + HMR:** opisane wyżej udostępnienie helperów w syntetycznym `bun:wrap`.
- **CWD w Termuksie:** w `src/resolver/resolver.rs` traktuje `ENOENT` na niedostępnym przodku jako nieprzezroczysty katalog wyłącznie na Androidzie, gdy przodek nie jest katalogiem docelowym. Błąd celu nadal pozostaje fatalny.
- **Otwieranie przeglądarki:** zmienia obsługę skrótu serwera Bun w `src/js/internal/serve_cli.ts`; Android używa `termux-open-url`, a następnie `xdg-open`, i zgłasza błędy procesu.
- **Test instalatora:** dodaje `test/cli/install/termux-bin.test.ts`, obejmujący instalowanie i chmod zagnieżdżonych poleceń pakietów oraz ochronę plików poza pakietem przez kontrolę symlinków.

### Co zostało pominięte celowo

W oficjalnym Bun 1.4.4 fallback dla `openat2` jest już realizowany przez sprawdzenie `is_android_kernel()` w `src/sys/linux_syscall.rs`. `src/sys/lib.rs` zawiera też ścieżkę `lchmod_no_fchmodat2()` dla Androida. Patch 1.4.4 nie aplikuje ponownie niskopoziomowych zmian z historycznego patcha 1.4.3; zachowuje testy regresji instalatora.

## Zastosowanie minimalnego patcha

W osobnym katalogu źródeł Bun:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout 38afee6c84fcf48c0edb2466aa4b27d287a59c30

curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.4-tc39-hmr.patch -o ../bun-1.4.4-tc39-hmr.patch
git apply --check ../bun-1.4.4-tc39-hmr.patch
git apply ../bun-1.4.4-tc39-hmr.patch
git diff --check
```

## Zastosowanie patcha zbiorczego

W czystym checkoutcie tej samej bazy:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout 38afee6c84fcf48c0edb2466aa4b27d287a59c30

curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.4-termux-combined.patch -o ../bun-1.4.4-termux-combined.patch
git apply --check ../bun-1.4.4-termux-combined.patch
git apply ../bun-1.4.4-termux-combined.patch
git diff --check
```

Przed kompilacją zapisz zastosowane zmiany jako commit, aby metadane rewizji odpowiadały zmodyfikowanemu checkoutowi.

## Testy zestawu zbiorczego

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
bun bd test test/cli/run/run_command.test.ts
bun bd test test/cli/install/termux-bin.test.ts
```

Testy zależne od Androida pomijają się na innych platformach. Test CWD wymaga środowiska, w którym katalog przodka pamięci współdzielonej rzeczywiście zwraca `ENOENT`.

## Stan weryfikacji

Stan na 30 października 2026:
- [Walidacja patchy — zakończona sukcesem](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41064304099): patch zbiorczy zastosowano do przypiętej bazy Bun 1.4.4, a build i testy workflow zakończyły się powodzeniem.
- [Build Termux ARM64 — zakończony sukcesem](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41059523736): wykonano release cross-build oraz kontrolę formatu ELF i interpretera Androida.

Build cross-kompilowany nie potwierdza jeszcze działania binarki na rzeczywistym telefonie. Testy runtime/HMR na Androidzie pozostają oddzielnym sprawdzeniem.

## Automatyczna weryfikacja

- `.github/workflows/validate-bun-1.4.4-hmr.yml` sprawdza samodzielne nakładanie wydzielonego patcha HMR na przypiętą bazę i ogranicza listę zmienionych plików do trzech oczekiwanych ścieżek.
- `.github/workflows/bun-1.4.4-patches.yml` nakłada patch zbiorczy, buduje Bun oraz uruchamia testy HMR i regresji Termuksa.
- `.github/workflows/build-termux-binary.yml` buduje binarkę Android ARM64.
