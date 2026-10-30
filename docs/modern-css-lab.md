# Modern CSS Lab — metodologia

Karty wyświetlają opis, przykład, test wsparcia, uwagi wydajnościowe i mikrobenchmark DOM.

- `CSS.supports()` sprawdza akceptację składni, nie pełną zgodność ze specyfikacją.
- Część at-rules nie ma uniwersalnego API detekcji; opis karty podaje ograniczenia.
- Funkcje eksperymentalne mogą wymagać flag lub być częściowo wdrożone.
- `@mixin`/`@apply` traktowane są jako test natywnego CSS, a nie preprocessora.

Mikrobenchmark tworzy 200 elementów, odczytuje style i podaje medianę z 5 prób. Dla rzeczywistego porównania należy przygotować wariant A/B, zbierać medianę i percentyle oraz osobno mierzyć style recalculation, layout, paint i płynność klatek.