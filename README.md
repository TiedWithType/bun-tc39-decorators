# Modern CSS Lab — Expressive You

Interaktywny katalog nowoczesnego i eksperymentalnego CSS z 24 Web Components.

## Uruchomienie
```sh
bun run dev
```
Otwórz http://localhost:3000.

## Interfejs
- Motyw inspirowany **Material 3 Expressive / Expressive You**: pastelowe powierzchnie, mocna typografia, duże promienie i animacje z uwzględnieniem `prefers-reduced-motion`.
- Krój Quicksand.
- Wyszukiwanie pełnotekstowe i filtry kategorii z licznikami.
- CSS Anchor Positioning: interaktywny tooltip, detekcja składni i informacja o wsparciu.
- Drag & drop do zmiany kolejności oraz przyciski dostępne na dotyku/klawiaturze.

## Struktura i aliasy
Każdy przykład ma osobny folder w `src/features/<id>/`. Wspólne komponenty w `src/core/`. Aliasy `@core/*` i `@features/*`.

## Pomiar
Mikrobenchmark kart mierzy medianę pięciu prób tworzenia 200 węzłów DOM i odczytu stylów. Nie jest to benchmark wydajności konkretnej funkcji CSS. Detekcja składni nie gwarantuje pełnej zgodności implementacji.
