# Termux: SIGSYS podczas instalacji programów z pakietów

Patch: [bun-termux-install-syscalls.patch](../patches/bun-termux-install-syscalls.patch).
Baza: `bc7a813b10b6ef8accc00c931b9a501331ac8c5c` (Bun 1.4.3).
Patch zbiorczy zawiera tę poprawkę razem z HMR/TC39, CWD i otwieraniem przeglądarki.

## Potwierdzenie na urządzeniu

Na Android ARM64 binarka `1.4.3+f5d709368` przeszła testy tmpdir,
interfejsów sieciowych, shell/spawn, HTTP, fs.watch i `--bun`.
Instalacja lokalnego pakietu z `bin/cli.js` kończyła się jednak sygnałem 31,
zarówno z domyślnym backendem, jak i `--backend=copyfile`.
Strace w obu przypadkach wskazuje:

```text
openat2(..., "bin", {flags=O_RDONLY|O_CLOEXEC|O_PATH, resolve=RESOLVE_BENEATH}, 24)
SIGSYS {si_code=SYS_SECCOMP, si_syscall=__NR_openat2, si_arch=AUDIT_ARCH_AARCH64}
```

Program kończy się przed zmianą uprawnień. Ten log potwierdza blokadę
`openat2`, ale nie ustala, czy ten telefon blokuje również `fchmodat2`.
Powiązane upstream: [#39060](https://github.com/oven-sh/bun/issues/39060).

## Działanie patcha

1. `openat2_beneath()` na Androidzie zwraca `ENOSYS` bez wykonywania syscalla.
   Instalator przechodzi do swojej istniejącej kontroli `realpath` katalogu
   pakietu i rodzica celu. Kontrola symlinków poza pakiet nie jest usuwana.
   Linux nadal korzysta z dotychczasowego `openat2(RESOLVE_BENEATH)`.
2. `lchmod()` na Androidzie używa `fchmodat(AT_SYMLINK_NOFOLLOW)` z Bionic,
   zamiast bezpośredniego wywołania syscalla 452. Implementacja Bionic otwiera
   ścieżkę z `O_PATH | O_NOFOLLOW | O_CLOEXEC`, a potem zmienia uprawnienia
   przez deskryptor. Nie wymaga odczytu pliku i nie chmoduje celu symlinka.
   Implementacje innych platform pozostają bez zmian.

Źródła Bionic:
[fchmodat.cpp](https://android.googlesource.com/platform/bionic/+/refs/heads/main/libc/bionic/fchmodat.cpp),
[fchmod.cpp](https://android.googlesource.com/platform/bionic/+/refs/heads/main/libc/bionic/fchmod.cpp).

Jest to poprawka dwóch ścieżek instalatora dla natywnej binarki Android/Bionic.
Nie instaluje globalnego handlera SIGSYS ani LD_PRELOAD. Nie obejmuje
`openat2_in_root` w trasach katalogowych serwera, `close_range` ani innych
wywołań systemowych. Istniejący fallback `realpath` nie daje tych samych
atomowych gwarancji rozwiązywania ścieżki co `RESOLVE_BENEATH`; patch nie
wprowadza nowego algorytmu resolvera.

## Testy

Patch dodaje `test/cli/install/termux-bin.test.ts`: cztery testy Androida,
bez zależności z registry. Sprawdzają instalację z backendem domyślnym
i copyfile, poprawne dowiązanie `.bin`, bit wykonywalności oraz ochronę
pliku wskazanego przez końcowy symlink i katalog poza pakietem.

W checkoutcie źródeł Bun z gotową binarką jako runtime testów:

```sh
bun test test/cli/install/termux-bin.test.ts
```

Dla telefonu bez checkoutu całego Bun użyj narzędzi z tego repo:

```sh
sh tools/check-termux-runtime.sh bun-patched > termux-runtime.log 2>&1
```

W Nushell:

```nu
^sh tools/check-termux-runtime.sh bun-patched out+err> termux-runtime.log
```

Nowy diagnostyczny runner sprawdza również dwa przypadki symlinków.
Wynik bez błędów nie potwierdza interaktywnego HMR i skrótu przeglądarki;
te należy sprawdzić przez `bun-patched --watch server.ts`.

Aktualne metadane i wyniki budowania:
`verification/termux-install-syscalls/`. Weryfikacja binarki na telefonie
po tej poprawce pozostaje do wykonania; log sprzed poprawki jej nie zastępuje.
