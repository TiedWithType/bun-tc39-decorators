# Bun + TypeScript TC39 — dekorator DEBUG z natywnym HMR

**Dodatkowy audyt Termux (2026-10-07):** [ustalenia i test offline](docs/termux-audit.md).
Uruchom `sh tools/check-termux-runtime.sh bun-tc39`, aby sprawdzić między innymi
instalację lokalnego pakietu z `.bin`, `--bun`, sieć, procesy i obserwowanie plików.

Projekt do sprawdzenia dekoratorów TC39 w **Bun z poprawką runtime HMR**.
Dekorator `@DEBUG` weryfikuje argumenty `value` i `context` dla klasy,
metody, pola i auto-accessora. Wynik pokazuje się w jednym `alert`, na
stronie oraz w konsoli przeglądarki.

Serwer używa `development: { hmr: true }`. Kod TypeScript przetwarza sam
Bun. W projekcie nie ma pluginu transpilacji przez TypeScript.

**Patch zbiorczy dla Bun 1.4.3:**
[bun-1.4.3-termux-combined.patch](patches/bun-1.4.3-termux-combined.patch)
łączy poprawki HMR/dekoratorów TC39, CWD Androida, otwierania przeglądarki
i syscalli instalatora
w Termuksie. Nakładaj patch zbiorczy albo patche osobne.

**Osobna poprawka HMR:** [patch w repo](patches/bun-hmr-tc39.patch).
**Zgłoszenie upstream:** [oven-sh/bun #44463](https://github.com/oven-sh/bun/issues/44463).

**Poprawka Termux / współdzielonej pamięci:**
[patch CWD](patches/bun-termux-cwd.patch) ·
[instrukcja i diagnostyka](docs/termux-cwd.md) ·
[upstream #44565](https://github.com/oven-sh/bun/issues/44565).

**Poprawka instalatora (SIGSYS):**
[patch](patches/bun-termux-install-syscalls.patch) ·
[opis i testy](docs/termux-install-syscalls.md).

**Poprawka skrótu przeglądarki:**
[patch](patches/bun-termux-open-browser.patch) ·
[upstream #44570](https://github.com/oven-sh/bun/issues/44570).

## Szybki start — Termux

Wymagana jest poprawiona binarka Bun. Przygotowana wcześniej kompilacja
`bun-tc39` jest przeznaczona dla **Android ARM64 / aarch64, API 28+**
(Android 9 lub nowszy). Architektura telefonu: `uname -m`.

Ostatni wspólny build ma wersję `1.4.3` i revision `1.4.3+daf9b8beb`.
Zawiera wszystkie cztery patche. Przeszedł kompilację i kontrole statyczne
ELF oraz 14/14 kontroli runtime na telefonie, w tym instalacje default
i copyfile oraz oba testy ochrony symlinków.
Wyniki: [verification/termux-install-syscalls/results.md](verification/termux-install-syscalls/results.md).

Projekt diagnostyczny umieść w prywatnym katalogu Termuksa, np. pod `~`.

```sh
cd ~
git clone https://github.com/TiedWithType/bun-tc39-decorators.git
cd bun-tc39-decorators
bun-tc39 install
bun-tc39 --watch server.ts
```

Otwórz **http://localhost:3000** w przeglądarce telefonu. Jeśli ta kompilacja
jest zainstalowana jako `bun`, używaj `bun` zamiast `bun-tc39`.

Zmiana portu:

```sh
PORT=3001 bun-tc39 --watch server.ts
```

Jeśli masz pobraną paczkę z binarką, instalację wykonaj z jej rozpakowanego
katalogu:

```sh
sha256sum -c SHA256SUMS
install -m 755 bun "$PREFIX/bin/bun-tc39"
bun-tc39 --version
bun-tc39 --revision
```

Binarka Androida nie jest zawarta w tym repozytorium. Znajduje się tu
projekt diagnostyczny, patche osobne oraz patch zbiorczy do źródeł Bun.

## Start na komputerze

Zainstaluj lub zbuduj Bun zawierający poprawkę. Następnie:

```sh
git clone https://github.com/TiedWithType/bun-tc39-decorators.git
cd bun-tc39-decorators
bun install
bun run dev
```

Skrypty `dev` i `start` wywołują program o nazwie `bun`. Jeżeli poprawiona
binarka ma nazwę `bun-tc39`, uruchamiaj bezpośrednio
`bun-tc39 --watch server.ts`, jak w instrukcji Termuksa.

## Oczekiwany wynik

Po załadowaniu strony pojawia się jeden alert zaczynający się od:

```text
DEBUG: WSZYSTKIE SPRAWDZENIA OK
```

Poniżej są wyniki dla wszystkich czterech rodzajów dekorowanych elementów.

| Element | Oczekiwane `context.kind` | Oczekiwane `value` |
| --- | --- | --- |
| Klasa `Counter` | `class` | Konstruktor, czyli funkcja |
| Metoda `increment` | `method` | Oryginalna funkcja metody |
| Pole `count` | `field` | `undefined` |
| Auto-accessor `score` | `accessor` | Obiekt z funkcjami `get` i `set` |

Wartość `2` z deklaracji `count = 2` **nie jest argumentem `value`
dekoratora pola**. Inicjalizacja pola następuje później. Auto-accessor to
składnia `accessor score = 5`, nie zwykła para getter/setter.

Raport pozostaje widoczny na stronie. Przycisk **Pokaż alert ponownie**
pokazuje ten sam wynik. W konsoli wpis `@DEBUG` zawiera rzeczywiste
`value`, `context` oraz raport dla danego elementu.

Projekt nie zakłada kolejności wywołań dekoratorów: sprawdza obecność
wszystkich czterech rodzajów. Kolejność wpisów w raporcie może być inna
niż kolejność deklaracji w kodzie.

## Co sprawdza DEBUG

Dla każdego wywołania:

- czy `context` jest obiektem;
- czy `context.name` jest stringiem lub symbolem;
- czy `context.addInitializer` jest funkcją;
- czy `context.metadata` jest obiektem;
- czy `value` ma postać właściwą dla danego rodzaju elementu.

Dla elementów klasy sprawdza też:

- booleany `context.static` i `context.private`;
- funkcję `context.access.has`;
- `context.access.get` dla odczytywalnych elementów;
- `context.access.set` dla pól, accessorów i setterów.

Funkcje `context.access` nie są wywoływane podczas dekorowania, ponieważ
instancja jeszcze nie istnieje. Sprawdzana jest ich obecność i typ.
Projekt weryfikuje obiekt `metadata` dostarczany przez Bun; nie wymaga
od przeglądarki własnej implementacji `Symbol.metadata`.

`DEBUG` zwraca `void`, więc zachowuje oryginalny element bez zmian.
Po utworzeniu instancji projekt dodatkowo sprawdza:

1. Pole `count` ma początkowo wartość `2`.
2. `increment()` zwraca `3` i aktualizuje właściwą instancję.
3. Accessor odczytuje `5`, a po zapisie zwraca `9`.
4. Raporty zawierają wszystkie cztery dekorowane elementy.

To projekt diagnostyczny, nie pełny zestaw testów zgodności specyfikacji TC39.

## Pliki projektu

| Plik | Rola |
| --- | --- |
| `src/debug.ts` | Dekorator `DEBUG`, sprawdzenia argumentów i zebrane raporty |
| `src/main.ts` | Klasa `Counter`, sprawdzenie instancji i wyświetlenie alertu |
| `index.html` | Strona, przycisk, raport i obsługa błędów runtime |
| `server.ts` | `Bun.serve`, entry point HTML i `hmr: true` |
| `tsconfig.json` | Standardowe dekoratory, ścisłe sprawdzanie typów |
| `patches/bun-hmr-tc39.patch` | Poprawka HMR z dwoma testami regresji |
| `patches/bun-termux-open-browser.patch` | Obsługa narzędzi Termuksa dla skrótu `o + Enter` |
| `patches/bun-termux-install-syscalls.patch` | Android: fallback openat2 i zmiana uprawnień bez fchmodat2 |
| `patches/bun-1.4.3-termux-combined.patch` | Cztery poprawki razem: HMR, CWD, przeglądarka i instalator |

W `tsconfig.json` ustawiono `experimentalDecorators: false`.
Projekt nie korzysta z dawnej sygnatury TypeScript
`target, propertyKey, descriptor`.

## HMR, --watch i alert

`bun --watch server.ts` restartuje proces serwera po zmianie obserwowanych
plików. `development: { hmr: true }` obsługuje zmiany kodu strony przez
dev server Bun. Są to dwa odrębne mechanizmy.

Projekt nie deklaruje `import.meta.hot.accept()`. Po zmianie modułu Bun
może przeładować stronę w całości; wtedy alert pokazuje się ponownie.
To pozwala ocenić natywne dekoratory w bundlu HMR już podczas pierwszego
załadowania, a także po zmianie kodu.

Dla szybkiej próby zmień tekst raportu lub nazwę klasy, zapisz plik
i sprawdź aktualny alert. Zmiana `count = 2` wymaga również aktualizacji
oczekiwanych wartości w `runtimeChecks`, jeśli chcesz uzyskać wynik OK.

## Gdy coś nie działa

Jeśli pojawi się:

```text
TypeError: import_bun_wrap.__decoratorStart is not a function
```

sprawdź, czy serwer rzeczywiście uruchamia poprawiona binarka. Samo
pobranie pliku `.patch` do tego projektu nie zmienia zainstalowanego Bun.
Patch stosuje się w **repozytorium źródeł Bun**, po czym trzeba zbudować binarkę.

Obsługa błędów w `index.html` jest instalowana przed modułem aplikacji.
Próbuje pokazać alert `BŁĄD RUNTIME: ...` zarówno dla błędów JavaScript,
jak i nieobsłużonych odrzuceń Promise. Gdy serwer nie dostarczy skryptu,
sprawdź także terminal i konsolę przeglądarki.

## Zastosowanie patcha zbiorczego w źródłach Bun

Sprawdzona baza: `bc7a813b10b6ef8accc00c931b9a501331ac8c5c` (Bun 1.4.3).
Patch zbiorczy zawiera wszystkie cztery poprawki. Stosuj go na czystej bazie;
nie nakładaj go dodatkowo na źródła z nałożonymi patchami osobnymi.
Na innej rewizji potrzebna jest osobna weryfikacja.

W osobnym katalogu **źródeł Bun**:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout bc7a813b10b6ef8accc00c931b9a501331ac8c5c
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.3-termux-combined.patch -o ../bun-1.4.3-termux-combined.patch
git apply --check ../bun-1.4.3-termux-combined.patch
git apply ../bun-1.4.3-termux-combined.patch
git diff --check
```

Testy na obsługiwanym hoście po przygotowaniu toolchainu Bun:

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
bun bd test test/cli/run/run_command.test.ts
```

Test CWD wymaga Androida i montowania odtwarzającego błąd niedostępnego
rodzica; na innych platformach jest pomijany. Szczegóły:
[docs/termux-cwd.md](docs/termux-cwd.md).

Przed kompilacją zapisz zastosowane zmiany jako commit w checkoutcie Bun.
Build pobiera revision z HEAD, więc commit powinien zawierać wszystkie patche.
Pełny release Android ARM64 z Clang 23.1.2, Rust nightly-2026-09-15 i NDK r27c:

```sh
bun scripts/build.ts --profile=release --os=linux --arch=aarch64 \
  --abi=android --android-ndk=/absolutna/sciezka/android-ndk-r27c \
  --build-dir=build/android-aarch64 --canary=off -j2
```

Gotowa binarka: `build/android-aarch64/bun`, API 28+. Ostatni wspólny build
powstał z lokalnego commita źródeł
`daf9b8beba027bc8d04be41f86766ca4f8c91d31`. Jego `--revision` zawiera
`1.4.3+daf9b8beb`; nowy commit utworzony samodzielnie będzie miał własną rewizję.
Metadane: [build-info.json](verification/termux-install-syscalls/build-info.json).

Poprawka HMR rejestruje helpery TC39 oraz pól i metod prywatnych w module
`bun:wrap`. CWD obsługuje niedostępnego rodzica na Androidzie. Poprawka skrótu
wybiera `termux-open-url`, a następnie `xdg-open` z PATH i raportuje błędy
uruchomienia. Nie wywołuje bezpośrednio `/system/bin/am`.

## Weryfikacja

- Projekt `DEBUG` przeszedł sprawdzanie typów TypeScript.
- Bundle HMR z poprawionego Bun przeszedł sprawdzenie czterech dekoratorów,
  początkowego alertu oraz przycisku w emulowanym DOM (happy-dom).
- Dwa testy regresji patcha przeszły na zbudowanym Bun dla Linux x86_64:
  klient i serwer, również po aktualizacji źródła.
- Kompilacja Android ARM64 zakończyła się powodzeniem i przeszła statyczne
  kontrole binarki. Nie była uruchamiana na telefonie ani w emulatorze Androida.

Sprawdzanie typów po instalacji zależności:

```sh
bun x --bun tsc --noEmit
```

Jeżeli używasz nazwy `bun-tc39`:

```sh
bun-tc39 x --bun tsc --noEmit
```


## Patche Bun: HMR, CWD i przeglądarka w Termuksie

| Patch | Co naprawia | Zgłoszenie |
| --- | --- | --- |
| [bun-hmr-tc39.patch](patches/bun-hmr-tc39.patch) | Brak helperów TC39 w runtime HMR klienta i serwera | [#44463](https://github.com/oven-sh/bun/issues/44463) |
| [bun-termux-cwd.patch](patches/bun-termux-cwd.patch) | CouldntReadCurrentDirectory przy niedostępnym rodzicu dostępnego projektu w pamięci współdzielonej Androida | [#44565](https://github.com/oven-sh/bun/issues/44565) |
| [bun-termux-open-browser.patch](patches/bun-termux-open-browser.patch) | SecurityException z `/system/bin/am` po `o + Enter` | [#44570](https://github.com/oven-sh/bun/issues/44570) |
| [bun-termux-install-syscalls.patch](patches/bun-termux-install-syscalls.patch) | SIGSYS przy instalacji pakietów z bin/cli.js na Androidzie | [#39060](https://github.com/oven-sh/bun/issues/39060) |
| [bun-1.4.3-termux-combined.patch](patches/bun-1.4.3-termux-combined.patch) | Wszystkie cztery poprawki w jednym patchu | Powyższe zgłoszenia |

Zalecany wspólny wariant to **patch zbiorczy**. Osobne patche pozwalają
wybrać pojedynczą poprawkę. Wszystkie odnoszą się do bazy
`bc7a813b10b6ef8accc00c931b9a501331ac8c5c`.

Narzędzia i wyniki:

- [tools/check-termux-runtime.sh](tools/check-termux-runtime.sh): testy offline instalatora, .bin, symlinków, --bun i runtime.
- [tools/check-shared-storage.sh](tools/check-shared-storage.sh): test CWD na telefonie.
- [tools/verify-ancestor-policy.py](tools/verify-ancestor-policy.py): test warunku resolvera na hoście.
- [tools/verify-opener.mjs](tools/verify-opener.mjs): sprawdzenia rzeczywistego bloku skrótu ze źródeł z zastąpionymi API procesu.
- [Wyniki skrótu](verification/termux-open-browser/opener-source-checks.log): 9/9 sprawdzeń kodu, bez uruchamiania Androida.
- [Kontrola binarki](verification/termux-open-browser/binary-check.log) i [metadane wspólnego buildu](verification/termux-open-browser/build-info.json).

Weryfikator skrótu uruchom z checkoutu tego projektu, podając ścieżkę
poprawionych źródeł Bun:

```sh
node tools/verify-opener.mjs ../bun-source/src/js/internal/html.ts
```

Pełny build z czterema patchami i kontrole ELF przeszły. Binarka nie była
uruchamiana na telefonie ani w emulatorze. Testy kodu ze zastąpionymi API
nie potwierdzają działania ActivityManager na konkretnym urządzeniu.

Wyniki nowej poprawki instalatora: [opis weryfikacji](verification/termux-install-syscalls/results.md),
[log budowania](verification/termux-install-syscalls/android-build.log),
[kontrola ELF](verification/termux-install-syscalls/binary-check.log).
