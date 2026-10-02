import { Component, ComponentElement } from "./component";

@Component({
  selector: "app-counter",
  template: `
    <section>
      <h2>Licznik kliknięć</h2>
      <p aria-live="polite">Wynik: <strong id="count">0</strong></p>
      <button type="button">Dodaj +1</button>
    </section>
  `,
  styles: `
    :host { display: block; margin: 16px 0; }
    section { padding: 24px; border: 1px solid #ffffff20; border-radius: 16px; background: #1e1e24; }
    h2 { margin: 0 0 12px; font-size: 1.2rem; }
    p { color: #b6b6c6; }
    strong { color: #e8e8f0; }
    button { padding: 12px 18px; border: 0; border-radius: 10px; background: #9575cd; color: #171320; font: inherit; font-weight: 600; cursor: pointer; }
    button:hover { background: #b39ddb; }
    button:focus-visible { outline: 2px solid white; outline-offset: 4px; }
  `,
})
export class CounterComponent extends ComponentElement {
  #count = 0;
  #events?: AbortController;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#events?.abort();
    this.#events = new AbortController();
    this.#update();

    this.root.querySelector("button")!.addEventListener("click", () => {
      this.#count += 1;
      this.#update();
    }, { signal: this.#events.signal });
  }

  disconnectedCallback(): void {
    this.#events?.abort();
  }

  #update(): void {
    this.root.querySelector("#count")!.textContent = String(this.#count);
  }
}
