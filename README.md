# Bun Runtime Patches

Zbiór poprawek dla [Bun](https://github.com/oven-sh/bun), skoncentrowany na:
- obsłudze standardowych dekoratorów TC39 w runtime HMR po stronie klienta i serwera;
- działaniu Bun w Termuksie na Androidzie ARM64;
- diagnostyce CWD, otwierania przeglądarki oraz instalowania pakietów.

Repozytorium przechowuje patche źródłowe, workflow GitHub Actions, narzędzia diagnostyczne i raporty weryfikacji. Nie zawiera aplikacji demonstracyjnej ani kodu frontendowego.

## Najważniejsza poprawka: TC39 decorators w HMR

**Wydzielony patch:** [`patches/bun-1.4.4-tc39-hmr.patch`](patches/bun-1.4.4-tc39-hmr.patch)

**Baza:** oficjalny Bun `1.4.4`, commit `38afee6c84fcf48c0edb2466aa4b27d287a59c30` (tag `bun-v1.4.4`).

### Objaw

Kod korzystający ze standardowych dekoratorów TC39 może działać w zwykłym wykonaniu, a kończyć się błędem po uruchomieniu w trybie developerskim z HMR:

```text
TypeError: import_bun_wrap.__decoratorStart is not a function
```

Problem dotyczył zarówno runtime HMR przeglądarki (client), jak i runtime HMR po stronie serwera. Transpilowany kod odwoływał się do helperów dekoratorów przez syntetyczny moduł `bun:wrap`, ale moduł tworzony przez HMR nie udostępniał pełnego zestawu helperów obecnych w runtime Bun. W efekcie import helpera, np. `__decoratorStart`, zwracał wartość niezdefiniowaną.

### Co zmienia patch

Patch jest celowo niewielki i obejmuje trzy pliki źródeł Bun:

| Plik w Bun | Zmiana |
| --- | --- |
| `src/runtime/bake/bake.private.d.ts` | Deklaruje brakujące eksporty modułu `bun:wrap`, aby typy syntetycznego modułu uwzględniały helpery standardowych dekoratorów oraz pól i metod prywatnych. |
| `src/runtime/bake/hmr-module.ts` | Importuje helpery z `../../runtime.bun` i rejestruje je w obiekcie przekazywanym do `registerSynthetic("bun:wrap", ...)`. Dzięki temu moduł używany przez HMR udostępnia te same funkcje, których oczekuje kod po transformacji. |
| `test/bake/dev/bundle.test.ts` | Dodaje dwa testy regresji: osobno dla klienta i serwera. Testy sprawdzają pierwsze uruchomienie oraz aktualizację modułu przez HMR. |

Do syntetycznego modułu trafia dziesięć helperów:

- prywatne elementy i pola: `__privateAdd`, `__privateGet`, `__privateIn`, `__privateMethod`, `__privateSet`, `__publicField`;
- standardowe dekoratory: `__decorateElement`, `__decoratorMetadata`, `__decoratorStart`, `__runInitializers`.

Patch **nie implementuje od nowa semantyki dekoratorów** i nie zmienia transformacji TypeScript. Udostępnia w ścieżce HMR funkcje, które Bun już posiada w swoim runtime, ale których brakowało w rejestracji syntetycznego modułu.

### Co obejmują testy regresji

Fixture testowy używa:
- dekoratora klasy i `context.metadata`;
- `context.addInitializer()`;
- dekoratora pola z funkcją inicjalizującą;
- dekoratora metody;
- dekoratora auto-accessora;
- prywatnego pola `#hidden` i prywatnej metody `#secret()`.

Test klienta i test serwera sprawdzają ten sam wynik początkowy:

```text
4:8:27:11:tc39:true
```

Następnie HMR zmienia inicjalizator pola z `value = 2` na `value = 3`. Oczekiwany wynik po aktualizacji:

```text
6:8:29:11:tc39:true
```

Dzięki temu test nie sprawdza wyłącznie istnienia symbolu `__decoratorStart`: wykonuje dekoratory, inicjalizatory, metadane, prywatne elementy i ponowne przetworzenie modułu.

## Zastosowanie samego patcha HMR

Patch należy nakładać na przypiętą bazę Bun 1.4.4. Nie zakładaj, że będzie pasował do innej wersji lub rewizji.

```sh
git clone https://github.com/oven-sh/bun.git bun-source
cd bun-source
git checkout 38afee6c84fcf48c0edb2466aa4b27d287a59c30

curl -fL https://raw.githubusercontent.com/TiedWithType/bun-tc39-decorators/main/patches/bun-1.4.4-tc39-hmr.patch \
  -o ../bun-1.4.4-tc39-hmr.patch

git apply --check ../bun-1.4.4-tc39-hmr.patch
git apply ../bun-1.4.4-tc39-hmr.patch
git diff --check
```

Po zastosowaniu patcha zapisz zmiany jako commit, zbuduj Bun i uruchom test:

```sh
git add -A
git commit -m "Fix TC39 decorators in Bun HMR runtime"

bun run build
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
```

## Patch zbiorczy dla Termuksa

**Patch:** [`patches/bun-1.4.4-termux-combined.patch`](patches/bun-1.4.4-termux-combined.patch)  
**Instrukcja:** [`docs/bun-1.4.4-patches.md`](docs/bun-1.4.4-patches.md)

Patch zbiorczy zawiera poprawkę HMR/TC39 oraz zmiany związane z Androidem i Termuksem:

1. **CWD w pamięci współdzielonej Androida.** Resolver toleruje `ENOENT` zwracany przy otwieraniu niedostępnego przodka ścieżki, wyłącznie na Androidzie i tylko wtedy, gdy przodek nie jest katalogiem docelowym. Błąd samego katalogu docelowego nadal jest zgłaszany. Dodany test odtwarza przypadek montowania, w którym `/storage/emulated/` jest niedostępny, a `/storage/emulated/0` pozostaje osiągalny.
2. **Otwieranie przeglądarki.** Skrót serwera Bun na Androidzie próbuje najpierw `termux-open-url`, a potem `xdg-open`. Obsługiwane są również błędy uruchomienia i niezerowy kod wyjścia. Zastępuje to próbę bezpośredniego użycia `/system/bin/am`, które w Termuksie może kończyć się `SecurityException`.
3. **Instalowanie poleceń pakietów.** Testy regresji sprawdzają instalację zagnieżdżonego wpisu `bin` dla domyślnego backendu i `copyfile`, utworzenie poprawnego dowiązania w `.bin`, bit wykonywalności oraz ochronę plików wskazywanych przez końcowe i nadrzędne symlinki.

W Bun 1.4.4 część niskopoziomowych obejść instalatora dla `openat2` i `fchmodat2` jest już obecna w upstream. Dlatego zestaw 1.4.4 nie nakłada ponownie tych zmian z historycznego patcha 1.4.3; zachowuje testy regresji instalatora.

**Wybierz jeden wariant na dany checkout:**
- minimalny zakres — zastosuj `bun-1.4.4-tc39-hmr.patch`;
- wszystkie poprawki z zestawu Termux — zastosuj `bun-1.4.4-termux-combined.patch`.

Nie nakładaj patcha HMR dodatkowo na patch zbiorczy, ponieważ patch zbiorczy już zawiera te same zmiany HMR.

### Testy zestawu zbiorczego

```sh
bun bd test test/bake/dev/bundle.test.ts -t "TC39 decorators"
bun bd test test/cli/run/run_command.test.ts
bun bd test test/cli/install/termux-bin.test.ts
```

Testy zależne od środowiska Android są pomijane na innych platformach. Test CWD wymaga montowania, które rzeczywiście zwraca `ENOENT` dla niedostępnego przodka.

## Automatyczna weryfikacja i status

Repozytorium zawiera workflow:
- `.github/workflows/validate-bun-1.4.4-hmr.yml` — sprawdza, czy wydzielony patch HMR nakłada się na przypięty commit Bun 1.4.4 i modyfikuje wyłącznie trzy oczekiwane pliki;
- `.github/workflows/bun-1.4.4-patches.yml` — nakłada patch zbiorczy, buduje Bun i uruchamia testy HMR oraz regresji Termuksa;
- `.github/workflows/build-termux-binary.yml` — przygotowuje binarkę Android ARM64;
- `.github/workflows/publish-termux-release.yml` — publikuje zweryfikowany artefakt jako GitHub Release.

W historii Actions:
- [walidacja patchy Bun 1.4.4 — sukces](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41064304099);
- [build Bun 1.4.4 dla Termuksa ARM64 — sukces](https://github.com/TiedWithType/bun-tc39-decorators/actions/runs/41059523736).

Build Android ARM64 oraz kontrola formatu ELF zakończyły się powodzeniem. **Ta weryfikacja nie oznacza testu binarki na fizycznym telefonie Android** — uruchomienie na rzeczywistym urządzeniu pozostaje osobnym krokiem. Szczegóły, SHA-256 i instalacja: [`docs/bun-1.4.4-termux-binary.md`](docs/bun-1.4.4-termux-binary.md).

## Struktura repozytorium

| Katalog | Zawartość |
| --- | --- |
| `patches/` | Wydzielone poprawki HMR, patche Termux oraz wersjonowane patche zbiorcze. |
| `.github/workflows/` | Walidacja patchy, cross-build Android ARM64 i publikacja release. |
| `docs/` | Opisy problemów, instrukcje nakładania patchy i diagnostyka. |
| `tools/` | Skrypty diagnostyczne i weryfikatory. |
| `verification/` | Logi, wyniki testów, metadane buildów i kontrole binarek. |

## Zgodność wersji

Patche są przypisane do konkretnej bazy źródeł. W szczególności:
- patch `bun-1.4.4-tc39-hmr.patch` i patch zbiorczy 1.4.4 są przygotowane dla commita `38afee6c84fcf48c0edb2466aa4b27d287a59c30`;
- patch zbiorczy 1.4.3 jest historycznym zestawem dla swojej własnej bazy i nie powinien być nakładany na Bun 1.4.4;
- dla innej wersji Bun należy najpierw odświeżyć kontekst patcha, sprawdzić jego nakładanie i uruchomić testy regresji.
