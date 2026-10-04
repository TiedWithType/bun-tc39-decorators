# Bun + TypeScript TC39 — dekorator DEBUG z natywnym HMR

Projekt do sprawdzenia dekoratorów TC39 w **Bun z poprawką runtime HMR**.
Dekorator `@DEBUG` weryfikuje argumenty `value` i `context` dla klasy,
metody, pola i auto-accessora. Wynik pokazuje się w jednym `alert`, na
stronie oraz w konsoli przeglądarki.

Serwer używa `development: { hmr: true }`. Kod TypeScript przetwarza sam
Bun. W projekcie nie ma pluginu transpilacji przez TypeScript.

**Poprawka Bun:** [patch w repo](patches/bun-hmr-tc39.patch).
**Zgłoszenie upstream:** [oven-sh/bun #44463](https://github.com/oven-sh/bun/issues/44463).

**Poprawka Termux / współdzielonej pamięci:**
[patch CWD](patches/bun-termux-cwd.patch) ·
[instrukcja i diagnostyka](docs/termux-cwd.md) ·
[upstream #44565](https://github.com/oven-sh/bun/issues/44565).

## Szybki start — Termux

Wymagana jest poprawiona binarka Bun. Przygotowana wcześniej kompilacja
`bun-tc39` jest przeznaczona dla **Android ARM64 / aarch64, API 28+**
(Android 9 lub nowszy). Architektura telefonu: `uname -m`.

Projekt umieść w prywatnym katalogu Termuksa, np. pod `~`, a nie w `/sdcard`.

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
projekt diagnostyczny oraz patch do źródeł Bun.

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
| `patches/bun-hmr-tc39.patch` | Poprawka źródeł Bun z dwoma testami regresji |

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

## Zastosowanie patcha w źródłach Bun

Patch był budowany i testowany na commicie
`bc7a813b10b6ef8accc00c931b9a501331ac8c5c` (źródła Bun 1.4.3).
Zastosowanie na innych rewizjach wymaga osobnej weryfikacji.

W osobnym katalogu źródeł Bun:

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout bc7a813b10b6ef8accc00c931b9a501331ac8c5c
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/72304f8f6f1d85d4d2631e43f3d55339eb41c492/patches/bun-hmr-tc39.patch -o bun-hmr-tc39.patch
git apply --check bun-hmr-tc39.patch
git apply bun-hmr-tc39.patch
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
```

Budowanie Bun wymaga kompletnego toolchainu opisanego w jego repozytorium.
Przeprowadzona kompilacja korzystała z Clang 23.1.2 oraz
Rust nightly-2026-09-15. Kompilacja dla Androida używała dodatkowo NDK r27c,
profilu `android-release` i API 28.

Poprawka rejestruje w syntetycznym module `bun:wrap` istniejące helpery
TC39 oraz helpery pól i metod prywatnych, potrzebne m.in. do obniżania
składni dekorowanych auto-accessorów. Aktualizuje też deklaracje modułu.

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


## Patche Bun: dekoratory i współdzielona pamięć Androida

| Patch | Co naprawia | Zgłoszenie |
| --- | --- | --- |
| [bun-hmr-tc39.patch](patches/bun-hmr-tc39.patch) | Brak helperów TC39 w runtime HMR klienta i serwera | [#44463](https://github.com/oven-sh/bun/issues/44463) |
| [bun-termux-cwd.patch](patches/bun-termux-cwd.patch) | CouldntReadCurrentDirectory dla dostępnego projektu pod /storage/emulated/0, gdy rodzic zwraca ENOENT | [#44565](https://github.com/oven-sh/bun/issues/44565) |

Oba patche można nałożyć na źródła Bun w rewizji
`bc7a813b10b6ef8accc00c931b9a501331ac8c5c`. Projekt DEBUG z HMR wymaga poprawki
dekoratorów; sam patch CWD rozwiązuje inny problem. Szczegóły pobrania,
wspólnego nakładania i pełnej kompilacji dla Androida:
[docs/termux-cwd.md](docs/termux-cwd.md).

Do repo dodano również:

- [tools/check-shared-storage.sh](tools/check-shared-storage.sh): próbę uruchomienia trzech poleceń w tymczasowym projekcie na telefonie;
- [tools/verify-ancestor-policy.py](tools/verify-ancestor-policy.py): wyizolowany sprawdzian warunku resolvera na hoście Linux;
- [wyniki weryfikacji CWD](verification/termux-cwd/results.md) i [metadane buildu](verification/termux-cwd/build-info.json).

Pełny build Android ARM64 z patchem CWD przeszedł. Nowa binarka CWD nie była
uruchamiana na telefonie. Wyniki kompilacji i statycznej kontroli ELF są
oddzielone w dokumentacji od oczekiwanego testu działania na urządzeniu.
