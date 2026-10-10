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

## Do wykonania po przygotowaniu toolchainu

Nie zbudowano nowej binarki. Nie uruchomiono `bun bd test`, testów warunku
resolvera w Rust ani testów na Androidzie. W środowisku tej weryfikacji
brakowało Bun, Rust, wymaganego Clang i Android NDK.
Dotychczasowe logi Androida i Windows dotyczą wcześniejszej bazy i binarek.

Na pełnym checkoutcie tagu z nałożonym patchem:

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
bun bd test test/cli/run/run_command.test.ts
bun bd test test/cli/install/termux-bin.test.ts
bun run rust:check-all
```

Test instalatora wymaga Androida. Test CWD wymaga ponadto montowania
odtwarzającego niedostępnego rodzica pamięci współdzielonej.
Po kompilacji binarkę należy sprawdzić na telefonie narzędziami
`tools/check-termux-runtime.sh` i `tools/check-shared-storage.sh`.
