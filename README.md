# Modern CSS Lab — Web Components

Interaktywny katalog 24 nowoczesnych i eksperymentalnych funkcji CSS. Każda funkcja ma osobny Web Component w osobnym folderze, opis, przykład z kolorowaniem składni, wykrywanie obsługi przeglądarki i mikrobenchmark.

## Uruchomienie
```sh
bun install
bun run dev
```
Otwórz http://localhost:3000.

## Architektura
- `src/core/css-feature-element.ts` — wspólna baza, Shadow DOM, składnia i mikrobenchmark.
- `src/core/app.component.ts` — aplikacja i filtry.
- `src/core/features.ts` — importy i katalog.
- `src/features/<id>/<id>.component.ts` — osobny Web Component dla każdej funkcji.
- Aliasy: `@core/*`, `@features/*`.

## Interpretacja
Detekcja wykorzystuje `CSS.supports()` i odpowiednie API. Akceptacja składni nie gwarantuje pełnej zgodności. Mikrotest mierzy medianę 5 prób utworzenia 200 węzłów DOM i odczytu stylu obliczonego; **nie jest** benchmarkiem samej funkcji CSS. Dla porównań funkcji wykonuj test A/B z fallbackiem, tym samym DOM i tym samym urządzeniem.

## Zakres
`:has()`, CSS Nesting, `@layer`, Container Queries, `subgrid`, `@property`, `color-mix()`/OKLCH, `clamp()`/viewport units, `@scope`, Anchor Positioning, Scroll-driven Animations, View Transitions, Grid Lanes, `@starting-style`, discrete transitions, `sibling-index()`/`sibling-count()`, `corner-shape`, Gap Decorations, `reading-flow`, `shape()`, CSS Mixins, CSS Custom Functions, CSS Carousels, nowe funkcje matematyczne CSS.
