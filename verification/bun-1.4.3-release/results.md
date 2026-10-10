# Patche na oficjalnym Bun 1.4.3 — 10 października 2026

Baza: tag [`bun-v1.4.3`](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.3),
commit `c6da4a4d3010e5553438c60f6bd76d981976867c`.
Repozytorium patchy przed zmianą: `f69aa08fed2f0938476961f825f64311b1df8693`.

## Zmiana

Poprzednie patche powstały na bazie `bc7a813b10b6ef8accc00c931b9a501331ac8c5c`,
sprzed oficjalnego wydania. Na tagu zmienił się kod resolvera oraz kontekst
testu CWD: deklaracja `let cwd: string` ma teraz typ `string | undefined`.
Stary patch CWD i stary patch zbiorczy nie nakładają się na ten test.

Odświeżono kontekst, pozycje bloków i identyfikatory plików w tych dwóch
patchach. Logika wszystkich czterech poprawek i ich testy pozostały bez zmian.
Uaktualniono instrukcje oraz domyślną bazę `verify-ancestor-policy.py`.

## Wykonane sprawdzenia

Pobrano osiem istniejących plików zmienianych przez patche z oficjalnego tagu.
Ich pełną zawartość zweryfikowano identyfikatorami Git blob i użyto do
lokalnych testów nakładania. Nie był to pełny checkout przeznaczony do buildu.
Dziewiąty zmieniany plik jest nowym testem instalatora dodawanym przez patch.
Identyfikatory źródeł: [source-blobs.json](source-blobs.json).

- Każdy z czterech patchy osobno: `git apply --check --index`, nakładanie
  oraz `git diff --cached --check` — OK.
- Patch zbiorczy: te same kontrole — OK.
- Cztery patche zastosowane kolejno i patch zbiorczy dają identyczne bajty
  wszystkich dziewięciu zmienianych plików oraz identyczne drzewa Git.
- Stary patch zbiorczy odtwarza konflikt w `run_command.test.ts`;
  poprawiony patch nakłada się poprawnie.
- Odwrócenie patcha zbiorczego przywraca dokładne bazowe drzewo Git.
- `verify-opener.mjs` na poprawionym `src/js/internal/html.ts`: 9/9.
  To wykonanie kodu skrótu z zastąpionymi API procesu, bez urządzenia Android.
- Składnia Python po zmianie domyślnej bazy weryfikatora: OK.

Logi: [nakładanie patchy](patch-application.log),
[skrót przeglądarki](opener-source-checks.log).

## Nowa kompilacja i testy — 10 października 2026

Pobrano pełny checkout oficjalnego tagu, nałożono patch zbiorczy i utworzono
commit źródeł `230ba940a2a6bf8c10947b5f0eb73c061b640dba`.
Zbudowano release Android ARM64/API 28 oraz Linux x64 debug z ASAN.
Dane źródeł, toolchainu, komendy i sumę binarki zawiera
[build-info.json](build-info.json).

| Sprawdzenie | Wynik |
| --- | --- |
| Build Android ARM64 release | OK |
| Ścisły `verify-binary.ts` bez `--warn-only` | OK |
| Kontrola powielonych silnych symboli | 0 |
| ELF ARM64, PIE, loader Androida, API 28, wyrównanie 16 KB | OK |
| Build Linux x64 debug/ASAN | OK |
| TC39/HMR na oficjalnym Bun 1.4.3 bez patcha | 2 oczekiwane błędy |
| TC39/HMR na nowym buildzie Linux (`bun bd test`) | 2 passed, 0 failed |
| `run_command.test.ts` na nowym buildzie Linux | 8 passed, 2 skipped, 0 failed |
| Predykat resolvera w Rust: Linux / konfiguracja Android | 5/5 + 5/5 |
| Predykat resolvera z bazy, konfiguracja Android | Oczekiwany błąd rodzica ENOENT |
| Kod skrótu przeglądarki z zastąpionymi API procesu | 9/9 |
| Testy nowej binarki na urządzeniu Android | Nie uruchomiono |

Baseline HMR odtwarza brak `__decoratorStart` po stronie klienta i serwera.
Poprawiony build przechodzi inicjalizację dekorowanych elementów oraz zmianę
modułu przez HMR. Oba wygenerowane runtime'y zawierają 10 dodanych eksportów
helperów. Test CWD zależny od montowania pamięci Androida oraz test Windows
zostały pominięte na Linuxie.

Binarka Androida ma 94 478 608 bajtów i SHA-256:

```text
40470c49089bfb57b05f1469066381ddc744262c1160167e9ee1ec287e377a2f
```

Ładuje wyłącznie `libc.so`, `libm.so` i `libdl.so`; interpreter to
`/system/bin/linker64`. Segmenty LOAD mają wyrównanie 16 i 64 KB,
stos nie jest wykonywalny, nie ma segmentu LOAD RWX ani TLS.
Wyrównanie ELF spełnia wymaganie loadera dla stron 16 KB; działania runtime
na urządzeniu ze stronami 16 KB nie testowano.

Logi: [Android build](android-build.log), [kontrole binarki](android-binary-checks.log),
[ELF](android-elf.log), [Linux build](native-build.log),
[HMR baseline](hmr-baseline.log), [HMR z patchem](hmr-patched.log),
[polecenie run](run-command-tests.log), [predykat resolvera](ancestor-policy.log).

W tym środowisku archiwa rozpakowywano z `TAR_OPTIONS=--no-same-owner`.
Ninja używał dwóch zadań, a linker dwóch wątków i jednego zadania ThinLTO.
Na czas linkowania Androida wstrzymano build Linux, aby zmieścić się w 8 GiB RAM.
Nie zmieniano logiki patchy ani źródeł Bun poza nałożeniem patcha zbiorczego.
Nie uruchamiano pełnej macierzy `rust:check-all` dla innych systemów i architektur.

## Do sprawdzenia na telefonie

Nowa paczka zawiera binarkę, sumy SHA-256, instrukcję oraz istniejące narzędzia
`tools/check-termux-runtime.sh` i `tools/check-shared-storage.sh`.
Testy instalatora wymagają rzeczywistego Androida, a test CWD dodatkowo
montowania odtwarzającego niedostępnego rodzica pamięci współdzielonej.
Wcześniejsze 14/14 kontroli na telefonie dotyczą innej binarki (`daf9b8beb`).
