# Audyt Termux — 7 października 2026

Repo: `TiedWithType/bun-tc39-decorators`, HEAD `ff6be4d`.
Sprawdzono źródła Bun na bazie `bc7a813b10b6ef8accc00c931b9a501331ac8c5c`
z nałożonym `bun-1.4.3-termux-combined.patch`.
Nie uruchomiono binarki Androida na telefonie. Ustalenia z kodu nie są
potwierdzeniem wystąpienia każdego problemu na konkretnym urządzeniu.

## Ustalenia

| Priorytet | Problem | Dowód i skutek |
| --- | --- | --- |
| Wysoki | `SIGSYS` zamiast błędu errno podczas instalacji | `src/sys/linux_syscall.rs:93–128` wywołuje `openat2`; `src/sys/lib.rs:2785–2805` wywołuje syscall 452 (`fchmodat2`). Android może zakończyć proces przez seccomp, zanim uruchomi się fallback. Żaden z trzech patchy nie zmienia tych miejsc. |
| Wysoki | Analogiczna awaria przy starcie/spawn | `src/jsc/bindings/c-bindings.cpp:273–275,311,700` używa `close_range`; `src/jsc/bindings/bun-spawn.cpp:73` także je wywołuje. Jeśli telefon blokuje je przez `SECCOMP_RET_TRAP`, zagrożone są nawet start i procesy potomne. Wystąpienie wymaga sprawdzenia na urządzeniu. |
| Średni | `--bun` może uruchomić systemowy Node albo nie znaleźć `node` | `src/install/lib.rs:413–433` na Androidzie przypina katalog pod `/data/local/tmp`, ignorując `TMPDIR`. W `create_fake_temporary_node_executable`, około linii 592–607, nieudane `mkdir` zwraca `Ok(())` bez utworzenia shimów. Przy niezapisywalnym katalogu PATH nie dostaje podstawionego Node. |
| Średni | Dotychczasowy test CWD może użyć innej binarki | `tools/check-shared-storage.sh` wybierał binarkę przekazaną jako argument, ale `package.json` uruchamiał bare `bun` z PATH. Odtworzono błąd 127, gdy wybrana binarka istnieje, a `bun` nie jest na PATH. Przy innej instalacji Bun grozi mylący wynik. Poprawiono test. |

Źródło upstream: [issue #39060](https://github.com/oven-sh/bun/issues/39060).
[PR #39775](https://github.com/oven-sh/bun/pull/39775) proponuje szerszą obsługę
seccomp/SIGSYS; podczas audytu był otwarty i niezmergowany. Samo przechwycenie
errno nie wystarcza, gdy system wysyła sygnał. Zmiana musi zachować kontrolę
symlinków i ograniczenie ścieżek do katalogu pakietu.

### Rzeczy, które wymagają rozróżnienia

- `os.networkInterfaces()` w tej bazie już zwraca `{}` na Androidzie przy
  `EACCES`/`EPERM` z `getifaddrs` (`src/runtime/node/node_os.rs:854–865`).
  To zapobiega wcześniejszemu wyjątkowi, ale nie dostarcza adresu Wi-Fi.
  Vite może więc nie wypisać adresu LAN mimo działającego serwera.
- `node:child_process` dla `shell: true` już wybiera `sh` na Androidzie
  (`src/js/node/child_process.ts:1041`). Nie znaleziono tutaj potrzeby
  kolejnego patcha `/bin/sh`.
- `os.tmpdir()` respektuje `TMPDIR`, lecz bez `TMPDIR`, `TMP`, `TEMP` używa
  `/data/local/tmp` (`src/js/node/os.ts:15–16`). To warunkowa pułapka środowiska;
  normalna sesja Termux zwykle ustawia poprawny `TMPDIR`.
- Poprawka CWD nie naprawia braku symlinków i wykonywania plików w pamięci
  współdzielonej. Do instalacji pakietów z `.bin` nadal używaj katalogu prywatnego.

## Weryfikacja tutaj

- Patch zbiorczy nakłada się na zadeklarowaną bazę; `git diff --check` przechodzi.
- Weryfikator rzeczywistego kodu skrótu przeglądarki: 9/9.
- Poprawiony test CWD: 3/3 na Linuksie z zastępczą ścieżką pamięci współdzielonej.
  To test skryptu, nie odtworzenie montowania Androida.
- Zainstalowany do diagnostyki oficjalny Linux x64 Bun: `1.4.2+744846f84`.
  Testy informacji o runtime, tmpdir, shell, spawn, HTTP, fs.watch, wymuszenia
  Bun zamiast Node, dwóch instalacji lokalnego pakietu i dwóch kontroli `.bin`
  przeszły: 11/12. `networkInterfaces` zwróciło EPERM w tym środowisku Linux;
  nie jest to wynik testu Androida.
- Dodatkowy izolowany filtr seccomp na Linux x64, `SECCOMP_RET_TRAP` dla
  syscalli 437 (`openat2`) i osobno 452 (`fchmodat2`): oba uruchomienia
  `bun install --ignore-scripts --backend=copyfile` dla lokalnej paczki
  z `bin/cli.js` zakończyły się SIGSYS (`subprocess.returncode = -31`).
  Nie wykonano tego eksperymentu na zbudowanym Bun 1.4.3 z repo.
- Nie kompilowano nowego Bun Android. Nie zmieniano trzech patchy runtime.

Log: `verification/termux-audit/linux-runtime.log`.

## Test na telefonie

Rozpakuj paczkę do prywatnego katalogu Termux. Potrzebne są `sh`, `tar`,
`readlink`, `mktemp` i badana binarka Bun. Z katalogu z `tools`:

```sh
sh tools/check-termux-runtime.sh bun-tc39 > termux-runtime.log 2>&1
cat termux-runtime.log
```

Możesz podać absolutną ścieżkę do binarki zamiast `bun-tc39`.
Skrypt nie instaluje niczego w Twoim projekcie. Tworzy prywatne fixture,
lokalną paczkę tar z wpisem `bin`, nie uruchamia lifecycle scripts i nie
pobiera pakietów z registry. Po zakończeniu usuwa swoje katalogi.
Test HTTP używa loopback i automatycznego portu. Każdy test działa w osobnym
procesie, więc SIGSYS jednego procesu pozwala zbierać dalsze wyniki.
Log nie wypisuje wszystkich zmiennych środowiska ani adresów interfejsów.

Ważne wyniki: `EXIT: 159` zwykle oznacza SIGSYS; nieudany `forcedNode`
pokazuje problem z wymuszeniem runtime. Brak listy interfejsów jest ostrzeżeniem,
nie błędem całego testu. Kontrola `.bin` sprawdza dowiązanie, właściwy cel
i bit wykonywalności; sam kod wyjścia instalatora nie wystarcza.

Test CWD w pamięci współdzielonej pozostaje osobny:

```sh
sh tools/check-shared-storage.sh bun-tc39
```

Otwieranie przeglądarki i HMR trzeba sprawdzić interaktywnie przez istniejący
`server.ts`: `bun-tc39 --watch server.ts`, wejście na `http://localhost:3000`,
zmiana pliku oraz `o` + Enter. Automatyczne testy powyżej ich nie potwierdzają.

## Kolejność dalszych poprawek

1. Po logu z urządzenia ustalić, które syscalle kończą proces. Jeśli potrzeba,
   użyć `strace` na minimalnej instalacji lokalnego pakietu.
2. Dla `--bun` przenieść shimy do prywatnego katalogu wyznaczanego w runtime,
   z zachowaniem kontroli właściciela, trybu katalogu i ochrony przed self-loop.
3. Dla seccomp zweryfikować rozwiązanie upstream oraz zachowanie spawn/watch
   i ochronę ścieżek. Nie zastępować `RESOLVE_BENEATH` bezwarunkowym `openat`.
4. Dopiero po weryfikacji przebudować wspólną binarkę i zaktualizować sumy SHA.

## Potwierdzenie i poprawka po audycie

Log z telefonu potwierdził SIGSYS/SECCOMP dla openat2 w obu backendach instalacji.
Test --bun przeszedł na tej konfiguracji; ryzyko z audytu nie wystąpiło.
Dodano [patch instalatora](termux-install-syscalls.md) i uwzględniono go
w patchu zbiorczym. Nową binarkę trzeba ponownie sprawdzić na urządzeniu.
