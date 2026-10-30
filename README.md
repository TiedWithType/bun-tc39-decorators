# Bun TC39 Decorators — diagnostyka

Projekt demonstracyjny sprawdzający standardowe dekoratory TC39 w Bun. Dekorator `@DEBUG` kontroluje argumenty `value` i `context` dla klasy, metody, pola oraz auto-accessora. Wyniki są widoczne na stronie i w konsoli.

## Wymagania

- Bun **1.4.4** lub kompatybilna binarka z obsługą używanych dekoratorów i HMR.
- Node nie jest wymagany do uruchamiania serwera.
- Port domyślny: `3000`.

## Uruchomienie

```sh
bun install
bun run dev
```

Otwórz http://localhost:3000. Serwer działa z obserwowaniem plików, a zmiany w kodzie mogą być przeładowywane przez HMR.

Aby użyć własnej binarki Bun, uruchom ją bezpośrednio:

```sh
bun-tc39 --watch server.ts
```

Port można zmienić zmienną środowiskową:

```sh
PORT=3001 bun run dev
```

## Termux — Android ARM64

Dostępna jest przygotowana binarka dla Androida ARM64 / AArch64, API 28+. Instrukcja zawiera sumę SHA-256, sposób instalacji oraz ograniczenia weryfikacji:

- [Gotowa binarka Bun dla Termuksa](docs/bun-1.4.4-termux-binary.md)
- [Wyniki kontroli binarki](verification/termux-binary-1.4.4/results.md)
- [Metadane buildu](verification/termux-binary-1.4.4/build-info.json)

Binarka została skompilowana i sprawdzona statycznie. Nie potwierdzono jeszcze jej działania na rzeczywistym urządzeniu Android. Artefakt GitHub Actions jest tymczasowy i może wygasnąć.

## Co sprawdza przykład

- poprawność podstawowych właściwości obiektu `context`;
- rodzaj elementu: `class`, `method`, `field`, `accessor`;
- zachowanie instancji po zastosowaniu dekoratorów;
- wyświetlenie raportu i obsługę błędów runtime.

To projekt diagnostyczny, a nie pełny zestaw testów zgodności ze specyfikacją TC39.

## Struktura

- `src/debug.ts` — dekorator i walidacja argumentów.
- `src/main.ts` — przykładowa klasa i sprawdzenia runtime.
- `index.html` — interfejs raportu.
- `server.ts` — serwer Bun z HMR.
- `tools/` — pomocnicze skrypty diagnostyczne.
- `verification/termux-binary-1.4.4/` — raport i metadane binarki Android ARM64.
