# Wyniki poprawki syscalli instalatora Termux

- Baza Bun: `bc7a813b10b6ef8accc00c931b9a501331ac8c5c`.
- Źródła ze wszystkimi czterema patchami: `daf9b8beba027bc8d04be41f86766ca4f8c91d31`.
- Patch zbiorczy i cztery patche osobne odtwarzają ten sam tree: `73f0265abd4f8402ed88a653a1a4d374dab470b6`.
- Kontrola CWD: po 5 testów dla konfiguracji Linux i Android na hoście; oczekiwany błąd bazowej wersji Android. To test predykatu, nie syscalli telefonu.
- Skrót przeglądarki: 9/9 kontroli rzeczywistego kodu z podstawionymi API procesu.
- Nowe cztery fixtures instalatora: 4/4 na oficjalnym Linux x64 Bun 1.4.2, po wyłączeniu warunku skipIf dla weryfikacji samych testów. To nie jest test nowej binarki Android.
- Istniejące regresje ochrony końcowego symlinka, symlinka katalogowego i końcowego slasha: 3/3 na tym samym Linux Bun.
- Diagnostyka Linux: 13/14; `getifaddrs` zwraca EPERM w środowisku hosta.
- Na telefonie przed poprawką potwierdzono SYS_SECCOMP dla openat2 oraz EXIT 159 w obu backendach instalacji.
- Testy nowej binarki na telefonie pozostają do wykonania.

Metadane pełnego buildu i kontroli ELF są w `build-info.json` i `binary-check.log`.
