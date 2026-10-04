# Weryfikacja patcha Termux CWD — 2026-10-04

Źródła Bun: `bc7a813b10b6ef8accc00c931b9a501331ac8c5c`.
Zgłoszenie: [oven-sh/bun #44565](https://github.com/oven-sh/bun/issues/44565).

| Sprawdzenie | Wynik | Dowód |
| --- | --- | --- |
| Pełny Linux x64 debug/ASAN build i testy CLI | 8 pass, 2 skip, 0 fail; 24 asercje | [linux-cli.log](linux-cli.log) |
| Workspace Rust | 3 ok, 0 failed, 9 skipped | [rust-check-all.log](rust-check-all.log) |
| Pełny build release ARM64/Android | 1189 kroków, sukces; kontrole statyczne przeszły | [android-build.log](android-build.log) |
| Wyizolowany warunek resolvera | 5 pass Linux i 5 pass Android cfg; bazowy warunek: oczekiwane 4 pass / 1 fail | [ancestor-policy.log](ancestor-policy.log) |
| Nałożenie obu patchy na czystą bazę | Nakładają się razem; plik resolvera zgodny ze skompilowanym źródłem | git apply --check i rzeczywiste nałożenie na bazowe pliki |
| Skrypt diagnostyczny | Trzy polecenia przeszły na Linuksie; kontrolowany błąd zachowuje kod 7 i usuwa fixture | Sprawdzenie składni sh i uruchomienia skryptu |

Dwa pominięcia testów CLI to test Windows i nowy test Androida.
Zaliczone targety Rust: x86_64-unknown-linux-gnu, aarch64-linux-android,
aarch64-unknown-freebsd. Dziewięć pominięć nie oznacza zaliczenia tych targetów.

Binarka Androida jest plikiem ELF AArch64 z loaderem `/system/bin/linker64`,
korzystającym z libc.so, libm.so i libdl.so. Nie zawiera zależności od wersji
symboli GLIBC. Pełna kontrola buildu: 686 eksportów, 389 importów,
3 inicjalizatory i brak zduplikowanych silnych symboli.
[Metadane i SHA256 binarki](build-info.json).

Wyniki buildu i metadane dotyczą **patcha CWD**. Wcześniejsza weryfikacja
patcha dekoratorów jest opisana w głównym README. Sprawdzenie wspólnego
nakładania patchy nie jest testem wykonania binarki zawierającej oba patche.

**Nie wykonano testu poprawionej binarki CWD na urządzeniu Android.**
Testy predykatu używają konfiguracji cfg na hoście Linux. Linuxowa próba
skryptu diagnostycznego sprawdza jego działanie i sprzątanie, nie odtwarza
błędu montowania Androida. Przed/po na telefonie pozostaje do sprawdzenia.
