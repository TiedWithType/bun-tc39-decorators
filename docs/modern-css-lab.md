# Modern CSS Lab — metodologia

Karty wyświetlają opis, przykład, test wsparcia, uwagi wydajnościowe i mikrobenchmark DOM.

- `CSS.supports()` sprawdza akceptację składni, nie pełną zgodność ze specyfikacją.
- Część at-rules nie ma uniwersalnego API detekcji; opis karty podaje ograniczenia.
- Funkcje eksperymentalne mogą wymagać flag lub być częściowo wdrożone.
- `@mixin`/`@apply` traktowane są jako test natywnego CSS, a nie preprocessora.

Mikrobenchmark tworzy 200 elementów, odczytuje style i podaje medianę z 5 prób. Dla rzeczywistego porównania należy przygotować wariant A/B, zbierać medianę i percentyle oraz osobno mierzyć style recalculation, layout, paint i płynność klatek.

## Struktura komponentów

Każda funkcja CSS znajduje się w osobnym katalogu `src/features/{name}/` i składa się z plików `{name}.component.ts`, `{name}.component.html` oraz `{name}.component.css`. Pliki HTML i CSS są importowane jako tekst przez Bun, więc widok i style pozostają oddzielone od logiki komponentu.

- `@Component({ selector, template, styles, feature })` rejestruje Web Component i wiąże jego szablon oraz arkusz stylów.
- `@Supports(() => CSS.supports(...), feature)` przypisuje test obsługi funkcji do metadanych komponentu. Można przekazać też pojedynczy warunek jako tekst.
- Oba dekoratory korzystają z dekoratorów standardowych TC39; `experimentalDecorators` pozostaje wyłączone.

Test `CSS.supports()` sprawdza akceptację deklaracji lub selektora, a nie gwarantuje pełnej implementacji ani zgodności zachowania. Dla nowych funkcji warto dodatkowo sprawdzić aktualną tabelę kompatybilności przeglądarek.
