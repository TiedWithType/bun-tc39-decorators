# Bun + TypeScript: dekoratory TC39 i Web Components

Przykładowy projekt pokazujący, jak zbudować własny dekorator klasy `@Component`
w TypeScript, zarejestrować Web Component i wyrenderować jego HTML oraz CSS
w Shadow DOM. Frontend i serwer działają z Bun, bez Vite i bez frameworka UI.

Projekt zawiera także **obejście błędu dekoratorów TC39 w przeglądarkowym HMR
Bun 1.4.2**. Plugin najpierw przetwarza TypeScript do JavaScript za pomocą
kompilatora TypeScript, a następnie przekazuje wynik bundlerowi Bun.

Na stronie znajdują się dwa liczniki. Każdy ma własny stan i własny Shadow DOM.
Kliknięcie pierwszego licznika nie zmienia drugiego.

> `hmr: true` działa z tym obejściem, ale aktualizacja komponentu powoduje pełne
> przeładowanie strony. Liczniki wracają wtedy do zera. Projekt nie implementuje
> podmiany zarejestrowanych klas Custom Elements ani zachowywania stanu po edycji.

## Wymagania

- Bun — przykład i obejście sprawdzono na **1.4.2**.
- Przeglądarka obsługująca Custom Elements, Shadow DOM i prywatne pola klas.
- Dostęp do rejestru pakietów podczas pierwszej instalacji.

Przeglądarka otrzymuje przetworzony JavaScript, więc nie musi natywnie obsługiwać
składni dekoratorów TypeScript. TypeScript jest zależnością projektu;
`@types/bun` dostarcza definicje typów do sprawdzania kodu.

## Szybki start

Pobierz repozytorium lub jego archiwum, a następnie w katalogu projektu wykonaj:

```bash
bun install
bun run dev
```

Otwórz **http://localhost:3000**.

Nie otwieraj `index.html` przez `file://`. Skrypt wskazany w HTML to plik `.ts`,
który musi zostać przetworzony i udostępniony przez serwer Bun.

Komendy uruchamiaj z katalogu, w którym znajdują się `package.json` oraz
`bunfig.toml`. To ważne dla załadowania pluginu.

### Dostęp z telefonu lub innego komputera

Serwer nasłuchuje na `0.0.0.0`. Na drugim urządzeniu w tej samej sieci użyj:

```text
http://ADRES_IP_KOMPUTERA:3000
```

`localhost` na telefonie wskazuje sam telefon. Port 3000 musi być dostępny
w zaporze komputera, a sieć musi pozwalać urządzeniom komunikować się ze sobą.

### Termux

Umieść projekt w katalogu domowym Termuxa, np. `~/projects/`, i uruchom te same
komendy. Katalogi współdzielone Androida, takie jak `/sdcard`, mogą powodować
problemy z instalacją pakietów i dowiązaniami. Projekt nie korzysta z wykrywania
interfejsów sieciowych Vite.

## Dostępne komendy

| Komenda | Działanie |
| --- | --- |
| `bun install` | Instaluje zależności. |
| `bun run dev` | Uruchamia `bun --hot server.ts`. |
| `bun run start` | Uruchamia serwer bez flagi `--hot`. |
| `bun run typecheck` | Sprawdza typy przez `tsc --noEmit`. |
| `bun run build` | Tworzy statyczną wersję w `dist/` z tym samym pluginem TC39. |

`start` samo w sobie nie włącza trybu produkcyjnego. Serwer wyłącza opcję
`development`, kiedy `NODE_ENV` wynosi `production`.

Na systemach z powłoką zgodną z Bash możesz wybrać inny port:

```bash
PORT=8080 bun run dev
```

Albo uruchomić serwer w trybie produkcyjnym:

```bash
NODE_ENV=production bun run start
```

To serwer korzystający ze źródeł i bundlowania przy uruchomieniu. W takim
wariancie TypeScript nadal musi być zainstalowany, ponieważ plugin używa go
podczas przetwarzania frontendu.

## Pliki projektu

| Plik | Odpowiedzialność |
| --- | --- |
| `index.html` | Dokument strony i dwie instancje `<app-counter>`. |
| `src/main.ts` | Import komponentu uruchamiający jego dekorator. |
| `src/component.ts` | Dekorator `@Component`, definicje komponentów i klasa bazowa. |
| `src/counter.ts` | Licznik, szablon, style, stan i obsługa kliknięć. |
| `server.ts` | Serwer HTTP Bun, konfiguracja środowiska i odpowiedź 404. |
| `tc39.plugin.ts` | Przetwarzanie dekoratorów przez TypeScript przed bundlerem Bun. |
| `bunfig.toml` | Włączenie pluginu dla serwera frontendowego. |
| `build.ts` | Statyczny build z pluginem TC39. |
| `tsconfig.json` | Konfiguracja sprawdzania typów i nowych dekoratorów. |
| `package.json` | Zależności i skrypty. |
| `package-lock.json` | Lockfile wygenerowany przy instalacji zależności przez npm. |

`node_modules/` i `dist/` są pomijane przez Git. `bun install` może utworzyć
własny lockfile `bun.lock`; jeżeli go używasz, dodaj go do repozytorium po
instalacji.

## Jak działa dekorator TC39

Nowe dekoratory otrzymują dekorowaną wartość oraz obiekt kontekstu.
W przypadku dekoratora klasy są to konstruktor klasy i `ClassDecoratorContext`.

Fabryka `Component()` przyjmuje konfigurację i zwraca właściwy dekorator:

```ts
@Component({
  selector: "app-counter",
  template: `<button type="button">Dodaj +1</button>`,
  styles: `:host { display: block; }`,
})
export class CounterComponent extends ComponentElement {}
```

Konfiguracja zawiera:

| Opcja | Znaczenie |
| --- | --- |
| `selector` | Nazwa Custom Element, np. `app-counter`. |
| `template` | Zaufany fragment HTML renderowany wewnątrz Shadow DOM. |
| `styles` | Opcjonalny CSS umieszczany w Shadow DOM. |

Typ selektora wymaga myślnika, ale pełną poprawność nazwy sprawdza przeglądarka
przy wywołaniu `customElements.define()`.

Dekorator korzysta z `context.addInitializer()`. Inicjalizator klasy wykonuje
się po inicjalizacji jej pól statycznych. Jego `this` wskazuje finalną klasę,
co ma znaczenie także wtedy, gdy na klasie występują inne dekoratory.

Definicja komponentu trafia do `WeakMap`, gdzie kluczem jest konstruktor klasy.
Następnie dekorator rejestruje konstruktor:

```ts
customElements.define(options.selector, this);
```

Nie jest potrzebna dodatkowa ręczna rejestracja w `main.ts`. Sam import pliku
komponentu wystarcza do wykonania dekoratora.

### Dlaczego `experimentalDecorators: false`?

Opcja `experimentalDecorators: true` wybiera starszy mechanizm dekoratorów
TypeScript. Ten projekt korzysta z nowych dekoratorów zgodnych z propozycją
TC39 obsługiwaną przez TypeScript, więc ustawia tę opcję na `false`.

Nie włączaj `emitDecoratorMetadata`: przykład nie korzysta z metadanych
emitowanych przez starszy mechanizm ani z biblioteki `reflect-metadata`.

Dekorator w tym projekcie obsługuje klasy komponentów. Nie implementuje
dekoratorów parametrów, dependency injection ani mechanizmów Angulara.

## Shadow DOM i cykl życia

`ComponentElement` tworzy otwarty Shadow Root:

```ts
protected readonly root = this.attachShadow({ mode: "open" });
```

Po podłączeniu elementu do dokumentu `connectedCallback()` pobiera definicję
z `WeakMap`, renderuje szablon i dodaje element `<style>`.

Style strony nie wybierają bezpośrednio elementów wewnętrznych Shadow DOM.
Komponent może korzystać z dziedziczonych właściwości i zmiennych CSS;
`:host` pozwala stylować sam element komponentu.

Licznik rozszerza cykl życia klasy bazowej:

1. Wywołuje `super.connectedCallback()`, aby wyrenderować szablon.
2. Tworzy `AbortController` dla listenerów aktualnego podłączenia.
3. Pokazuje aktualny stan licznika.
4. Podpina listener kliknięcia przycisku.
5. W `disconnectedCallback()` usuwa listenery przez `abort()`.

Ponowne podłączenie tej samej instancji do DOM zachowuje jej prywatne pole
`#count`. Pełne przeładowanie strony tworzy nowe instancje i zeruje stan.

### Dane użytkownika

`template` jest renderowany przez `innerHTML` i powinien zawierać zaufany kod
aplikacji. Dynamiczne teksty, np. wartość licznika, ustawiaj przez
`textContent`. Nie wstawiaj do szablonu niesprawdzonych danych z formularzy
lub zewnętrznych źródeł.

## Dodanie własnego komponentu

Utwórz `src/hello-world.ts`:

```ts
import { Component, ComponentElement } from "./component";

@Component({
  selector: "hello-world",
  template: `<p>Cześć, Kamil!</p>`,
  styles: `
    :host { display: block; padding: 16px; }
    p { color: #9575cd; }
  `,
})
export class HelloWorldComponent extends ComponentElement {}
```

Dodaj import w `src/main.ts`:

```ts
import "./counter";
import "./hello-world";
```

Następnie umieść element w `index.html`:

```html
<hello-world></hello-world>
```

Możesz utworzyć wiele instancji tego samego elementu. Każda dostaje własną
instancję klasy i własny Shadow Root. Nie rejestruj dwóch różnych klas pod
identycznym selektorem.

Jeśli nadpisujesz `connectedCallback()`, wywołaj metodę klasy bazowej przed
wyszukiwaniem elementów szablonu:

```ts
override connectedCallback(): void {
  super.connectedCallback();
  const paragraph = this.root.querySelector("p");
  if (paragraph) paragraph.textContent = "Komponent został podłączony";
}
```

## Błąd Bun: dekoratory a przeglądarkowe HMR

W sprawdzonym przykładzie z Bun 1.4.2 i `development: { hmr: true }` kod
frontendu wygenerowany przez Bun wywoływał:

```js
import_bun_wrap.__decoratorStart(_base);
```

Runtime HMR nie udostępniał tej funkcji. Rezultatem był błąd:

```text
TypeError: import_bun_wrap.__decoratorStart is not a function
```

Błąd występował już podczas pierwszego załadowania strony, przed rejestracją
Custom Element. Sam warunek `customElements.get()` nie naprawia tego problemu.

### Co zmienia plugin?

`tc39.plugin.ts` przechwytuje pliki `.ts` przez `build.onLoad()` i przetwarza
je za pomocą `typescript.transpileModule()`.

TypeScript emituje własne helpery, m.in. `__esDecorate` i `__runInitializers`.
Plugin zwraca wynik jako JavaScript (`loader: "js"`). Bundler Bun nie musi już
transformować składni dekoratora TC39 ani odwoływać się do brakujących helperów
TC39 w `bun:wrap`.

Dla serwera plugin włącza `bunfig.toml`:

```toml
[serve.static]
plugins = ["./tc39.plugin.ts"]
```

Statyczny build uruchamiany przez `build.ts` przekazuje ten sam plugin do
`Bun.build()`. Obie ścieżki korzystają więc z tej samej transformacji.

To **obejście w projekcie**, a nie poprawka kodu źródłowego lub binarki Bun.
Nie ma gwarancji, że ten sam błąd występuje we wszystkich wersjach Bun.

### Dlaczego po edycji następuje pełne przeładowanie?

Rejestr Custom Elements nie pozwala usunąć definicji ani podmienić konstruktora
zarejestrowanego pod daną nazwą. HMR może ponownie wykonać moduł komponentu,
co prowadziłoby do błędu ponownej rejestracji.

Dekorator wykrywa istniejący selektor. W środowisku HMR wywołuje
`window.location.reload()` i kończy inicjalizator bez ponownego `define()`.
Nowy dokument ma świeży rejestr Custom Elements i ładuje aktualny kod.
Poza HMR powtórna rejestracja zgłasza czytelny błąd.

Nie dodawaj `import.meta.hot.accept()` do tych komponentów bez zaprojektowania
pełnego mechanizmu aktualizacji. Samo pominięcie `define()` zachowałoby starą
klasę zamiast zastosować zmienioną implementację.

### `--hot`, `--watch` i `hmr: true`

| Mechanizm | Dotyczy | Zachowanie |
| --- | --- | --- |
| `bun --hot server.ts` | Runtime serwera | Przeładowuje kod bez restartowania całego procesu; globalny stan może przetrwać. |
| `bun --watch server.ts` | Runtime serwera | Restartuje proces po zmianie śledzonych plików. |
| `development: { hmr: true }` | Frontend serwowany przez Bun | Włącza runtime HMR i komunikację zmian z przeglądarką. |

W tym projekcie skrypt `dev` używa `--hot`, a serwer włącza frontendowe HMR.
Są to dwa osobne mechanizmy. Możesz uruchomić `bun --watch server.ts`, jeżeli
wolisz pełny restart serwera po zmianach.

## Sprawdzenie typów i build

```bash
bun run typecheck
bun run build
```

`transpileModule()` przetwarza składnię pojedynczych plików, ale nie sprawdza
semantycznie całego projektu. Dlatego komenda `typecheck` jest osobnym krokiem.

Pliki z `dist/` można udostępnić dowolnym serwerem statycznym. W takim wariancie
odbiorca strony nie potrzebuje Bun ani TypeScript — otrzymuje HTML i JavaScript.

Używaj `bun run build`, aby wykonać build z pluginem. Bezpośrednie
`bun build index.html` nie jest skryptem skonfigurowanym w tym projekcie.

## Zakres przeprowadzonej walidacji

Podczas przygotowania przykładu sprawdzono:

- typy całego projektu przez `tsc --noEmit`;
- statyczny build z pluginem;
- wykonanie dekoratora i rejestrację Custom Element;
- renderowanie HTML i CSS w Shadow DOM;
- niezależny stan dwóch liczników i obsługę kliknięć;
- odłączenie i ponowne podłączenie komponentu w pierwotnym przykładzie;
- aktualizację TS przez rzeczywisty WebSocket serwera Bun;
- żądanie przeładowania i nowy dokument z aktualnym kodem;
- działanie kliknięcia w statycznym bundlu.

Sprawdzenia DOM wykonywano w **happy-dom**. W teście aktualizacji zliczano
żądanie `location.reload()` i tworzono nowy dokument z aktualnym bundłem.
Pełny test w Chromium nie został wykonany. Testy pomocnicze użyte podczas
przygotowania nie są częścią tego repozytorium; powyższa lista opisuje wykonane
sprawdzenia, a nie zestaw testów dostępny przez skrypt `test`.

## Rozwiązywanie problemów

### Nadal pojawia się `__decoratorStart is not a function`

Sprawdź, czy uruchamiasz serwer z katalogu projektu, czy istnieje `bunfig.toml`
i czy jego ścieżka wskazuje `./tc39.plugin.ts`. Zainstaluj zależności przez
`bun install`. Po zmianie konfiguracji pluginu zatrzymaj i uruchom serwer ponownie.

### `Cannot find package "typescript"`

Wykonaj `bun install`. Plugin używa TypeScript również w serwerze uruchamianym
w trybie produkcyjnym, dlatego pakiet znajduje się w `dependencies`.

### Nazwa komponentu jest już zarejestrowana

Sprawdź, czy dwie różne klasy nie mają identycznego `selector` i czy komponent
nie jest rejestrowany dodatkowo ręcznie. W środowisku bez HMR duplikat powinien
zgłaszać błąd, zamiast ukrywać problem konfiguracji.

### Po zapisie kodu licznik wraca do zera

To oczekiwane: strona jest przeładowywana, aby zastosować nową klasę komponentu.
Projekt nie zachowuje stanu w `sessionStorage`, `localStorage` ani bazie danych.

### Port jest zajęty

Zatrzymaj poprzednią instancję serwera lub uruchom przykład z innym `PORT`.

### Style z `index.html` nie zmieniają przycisku

Przycisk znajduje się w Shadow DOM. Umieść jego style w opcji `styles`
komponentu. Do stylowania elementu zewnętrznego służy `:host`.

### Edytor pokazuje inne błędy dekoratorów

Sprawdź, czy edytor korzysta z TypeScript zainstalowanego w projekcie i czy
odczytuje właściwy `tsconfig.json`. Nie włączaj starszego mechanizmu
`experimentalDecorators: true`.

## Ograniczenia przykładu

- Plugin obsługuje `.ts`; projekt nie demonstruje TSX ani JSX.
- Szablony i CSS są stringami w konfiguracji dekoratora.
- Nie ma reaktywności, routingu, DI ani dekoratorów właściwości.
- Aktualizacja komponentu przeładowuje stronę i zeruje jej stan.
- Implementacja nie jest rozbudowanym frameworkiem ani pełnym zamiennikiem Angulara.

## Dokumentacja źródłowa

- [TypeScript 5.0 — nowe dekoratory](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [Propozycja TC39 Decorators](https://github.com/tc39/proposal-decorators)
- [Bun — fullstack dev server](https://bun.sh/docs/bundler/fullstack)
- [Bun — frontendowe HMR](https://bun.sh/docs/bundler/hot-reloading)
- [Bun — pluginy bundlera](https://bun.sh/docs/bundler/plugins)
- [Bun — tryby `--hot` i `--watch`](https://bun.sh/docs/runtime/watch-mode)
- [MDN — Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [MDN — Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
