# Termux: CouldntReadCurrentDirectory w /sdcard

[Zgłoszenie upstream #44565](https://github.com/oven-sh/bun/issues/44565) ·
[Patch](../patches/bun-termux-cwd.patch) ·
[Wyniki weryfikacji](../verification/termux-cwd/results.md)

## Objaw i przyczyna

Bun 1.4.3 uruchamia bezpośrednio plik, ale `bun dev` / `bun run dev` kończy się:

```text
error loading current directory
error: An internal error occurred (CouldntReadCurrentDirectory)
```

Problem występuje dla projektu w `/sdcard` / `/storage/emulated/0`.
Otrzymany strace pokazuje:

```text
getcwd("/storage/emulated/0/bun-realtime-crud", 4096) = 38
openat(AT_FDCWD, "/", O_RDONLY|O_CLOEXEC|O_DIRECTORY) = -1 EACCES
openat(AT_FDCWD, "/storage/", O_RDONLY|O_CLOEXEC|O_DIRECTORY) = -1 EACCES
openat(AT_FDCWD, "/storage/emulated/", O_RDONLY|O_CLOEXEC|O_DIRECTORY) = -1 ENOENT
+++ exited with 1 +++
```

`getcwd()` działa, a docelowy projekt jest dostępny. Otwieranie rodzica
`/storage/emulated/` zgłasza jednak ENOENT. Resolver już toleruje EACCES/EPERM
rodziców, lecz ENOENT przerywa przechodzenie do dostępnego projektu.
To inny przypadek niż wcześniejsze, zamknięte zgłoszenia
[#30859](https://github.com/oven-sh/bun/issues/30859) i
[#28220](https://github.com/oven-sh/bun/issues/28220).

## Zakres poprawki

W `src/resolver/resolver.rs` istniejąca obsługa niedostępnego rodzica obejmuje
również ENOENT, wyłącznie dla `target_os = "android"` i `queue_slice_len > 0`.
Rodzic otrzymuje pusty wpis bez deskryptora; resolver kontynuuje otwieranie
kolejnych komponentów przez ścieżki absolutne.

Błędy katalogu docelowego nadal są zgłaszane. Obsługa ENOTDIR/EISDIR i innych
błędów, np. EIO, pozostaje taka sama. ENOENT na innych platformach zachowuje
wcześniejsze znaczenie. Kod resolvera nie zawiera wyjątków dla nazw `/storage`.

Patch dotyczy uruchamiania skryptów. Współdzielona pamięć może nadal odmawiać
tworzenia symlinków podczas instalacji zależności. Binarkę Bun należy trzymać
w prywatnym katalogu Termuksa, nawet gdy projekt jest w pamięci współdzielonej.

## Pobranie i zastosowanie

Sprawdzona baza obu patchy: oficjalny tag `bun-v1.4.3`,
commit `c6da4a4d3010e5553438c60f6bd76d981976867c`.
[Weryfikacja na tagu wydania](../verification/bun-1.4.3-release/results.md).
Nałożenie na inną rewizję wymaga osobnej kontroli.

W checkoutcie **źródeł Bun**, nie projektu z dekoratorami:

```sh
git checkout --detach c6da4a4d3010e5553438c60f6bd76d981976867c
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-termux-cwd.patch -o bun-termux-cwd.patch
git apply --check bun-termux-cwd.patch
git apply bun-termux-cwd.patch
```

Do projektu `@DEBUG` z `hmr: true` zastosuj także patch dekoratorów:

```sh
curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-hmr-tc39.patch -o bun-hmr-tc39.patch
git apply --check bun-hmr-tc39.patch
git apply bun-hmr-tc39.patch
```

Patche dotyczą różnych plików i nakładają się razem na podaną bazę. Samo
pobranie patcha nie zmienia zainstalowanej binarki. Potrzebna jest kompilacja.

## Budowanie

Wymagane: Clang/LLD 23.1.2, przypięty Rust nightly-2026-09-15 i NDK r27c.
Pełny cross-build release dla Androida ARM64, API 28:

```sh
bun scripts/build.ts --profile=release --os=linux --arch=aarch64 \
  --abi=android --android-ndk=/absolutna/sciezka/android-ndk-r27c \
  --build-dir=build/android-aarch64 -j2
```

Gotowa binarka: `build/android-aarch64/bun`. Bez `--target=bun-rust` budowane
są również C++ i JavaScriptCore, a wynik jest kompletnym programem.

Dla dostępnej platformy hosta:

```sh
bun bd -j4 test test/cli/run/run_command.test.ts
# Gdy nałożono także patch HMR:
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
```

Test nowego patcha wykonuje się tylko na Androidzie z potwierdzonym ENOENT
podczas otwierania `/storage/emulated/` i dostępnym `/storage/emulated/0`.
Na zwykłym Linuksie i nieodtwarzających błędu montowaniach jest pomijany.

## Instalacja na telefonie i sprawdzenie

Po skopiowaniu nowej binarki do telefonu, z katalogu zawierającego plik `bun`:

```sh
install -Dm755 bun "$HOME/.local/bun-patched/bin/bun"
export PATH="$HOME/.local/bun-patched/bin:$PATH"
hash -r
bun --version
bun --revision
```

Użycie tej nazwy zapewnia też wybór poprawionej binarki przez skrypty package.json
wywołujące `bun`. Eksport PATH obowiązuje w bieżącej sesji.

W checkoutcie tego repozytorium:

```sh
sh tools/check-shared-storage.sh "$HOME/.local/bun-patched/bin/bun"
```

Skrypt tworzy własny tymczasowy projekt w `/storage/emulated/0`, sprawdza
bezpośrednie uruchomienie oraz `bun run check` i `bun check`, po czym usuwa
projekt. Oczekiwane są trzy wpisy `shared-storage-ok` i kod wyjścia 0.
Przy błędzie zatrzymuje się i zachowuje niezerowy kod wyjścia.

Potem sprawdź swój rzeczywisty projekt:

```sh
cd /storage/emulated/0/bun-realtime-crud
bun run dev
# Po zatrzymaniu serwera:
bun dev
```

## Wyizolowane sprawdzenie warunku na Linuksie

Z przypiętym `rustc` na PATH i checkoutem Bun z nałożonym patchem:

```sh
python3 tools/verify-ancestor-policy.py /absolutna/sciezka/bun-source
```

Skrypt wyciąga rzeczywisty warunek z resolvera. Sprawdza pięć przypadków
w konfiguracji Linux i Android, wykonując programy na hoście Linux.
Na bazowym kodzie oczekuje jednego błędu dla ENOENT rodzica; na poprawionym
obie serie muszą przejść. Oczekiwany błąd bazowego kodu nie oznacza błędu
całego sprawdzianu.

To test predykatu, nie syscalli ani całego resolvera. Pełny build Androida
przeszedł, ale binarka z nową poprawką CWD nie została uruchomiona na urządzeniu.
Test przed/po na telefonie pozostaje do wykonania.
