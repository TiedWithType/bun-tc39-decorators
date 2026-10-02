export interface ComponentOptions {
  selector: `${string}-${string}`;
  template: string;
  styles?: string;
}

const definitions = new WeakMap<Function, Readonly<ComponentOptions>>();

export abstract class ComponentElement extends HTMLElement {
  protected readonly root = this.attachShadow({ mode: "open" });

  connectedCallback(): void {
    const options = definitions.get(this.constructor);
    if (!options) throw new Error("Brakuje dekoratora @Component.");

    // Szablon pochodzi z kodu aplikacji. Nie wstawiaj tu danych użytkownika.
    this.root.innerHTML = options.template;
    const style = document.createElement("style");
    style.textContent = options.styles ?? "";
    this.root.prepend(style);
  }
}

export function Component(options: ComponentOptions) {
  // TC39: dekorator otrzymuje wartość klasy i obiekt context.
  return function <T extends new () => ComponentElement>(
    _value: T,
    context: ClassDecoratorContext<T>,
  ): void {
    // Inicjalizator klasy wykonuje się po inicjalizacji jej pól statycznych.
    // `this` jest ostateczną klasą, również przy innych dekoratorach.
    context.addInitializer(function () {
      if (customElements.get(options.selector)) {
        if (import.meta.hot) {
          // HMR może wykonać moduł przed decyzją o pełnym reloadzie.
          // Nowy dokument ma świeży rejestr Custom Elements.
          window.location.reload();
          return;
        }
        throw new Error(`Komponent ${options.selector} jest już zarejestrowany.`);
      }
      definitions.set(this, Object.freeze({ ...options }));
      customElements.define(options.selector, this);
    });
  };
}
