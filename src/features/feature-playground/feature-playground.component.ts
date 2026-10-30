import { features } from "@core/features";

class FeaturePlayground extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #selected = features[0]?.id ?? "";
  #defaultHtml = `<main class="demo">
  <header class="demo-header">
    <span class="eyebrow">CSS playground</span>
    <h1>Testuj nowoczesny CSS</h1>
    <p>Zmieniaj HTML i CSS, a następnie uruchom przykład.</p>
  </header>
  <section class="card" id="card">
    <h2>Karta demonstracyjna</h2>
    <p>Przykładowy tekst do stylowania. <a href="#details">Link testowy</a></p>
    <label><input type="checkbox" checked> Zaznaczony stan formularza</label>
    <div class="demo-grid">
      <div class="demo-item">Element A</div><div class="demo-item">Element B</div><div class="demo-item">Element C</div>
    </div>
    <button type="button">Przycisk testowy</button>
    <details id="details"><summary>Więcej treści</summary><p>Dodatkowa zawartość do testów.</p></details>
  </section>
  <section class="demo-grid masonry">
    <article class="demo-item">Mały element</article>
    <article class="demo-item tall">Wyższy element<br>z dodatkową treścią</article>
    <article class="demo-item">Kolejny element</article>
  </section>
</main>`;
  connectedCallback() {
    const options = features.map((feature) => `<option value="${this.#esc(feature.id)}">${this.#esc(feature.title)} · ${this.#esc(feature.group)}</option>`).join("");
    this.#root.innerHTML = `<style>
      :host{display:block;color:#2d2544;font:500 15px/1.5 'Quicksand',system-ui,sans-serif}
      *{box-sizing:border-box}.panel{padding:clamp(16px,3vw,28px);border:1px solid #ded4f2;border-radius:28px;background:linear-gradient(145deg,#fff,#f8f4ff 65%,#eef8ff);box-shadow:0 12px 35px #3926530c}
      h2{margin:0 0 6px;font-size:1.45rem;letter-spacing:-.04em}p{color:#685e7c;margin:5px 0 16px}.controls{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end;margin:18px 0}
      label{display:grid;gap:7px;font-weight:700;font-size:.82rem;color:#51436e}select,textarea{width:100%;min-width:0;border:1px solid #d9cdea;border-radius:14px;padding:12px;background:#fff;color:#2d2544;font:500 .85rem/1.5 ui-monospace,SFMono-Regular,Consolas,monospace}
      select{font-family:inherit;font-weight:700}textarea{resize:vertical;min-height:210px;tab-size:2}button{border:1px solid #5f4796;border-radius:14px;background:#6550a4;color:white;padding:12px 16px;font:700 .86rem/1.2 'Quicksand',system-ui,sans-serif;cursor:pointer;min-height:44px}button.secondary{background:#fff;color:#58437f;border-color:#d9cdea}button:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #bba5ef;outline-offset:2px}
      .editors{display:grid;grid-template-columns:1fr 1fr;gap:14px}.editor{display:grid;gap:8px;min-width:0}.editor small{font-weight:500;color:#746987}.preview-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 10px}.preview-head h3{margin:0;font-size:1rem}.status{font-size:.78rem;color:#5c477e;font-weight:700}
      iframe{display:block;width:100%;height:390px;border:1px solid #ddd2f0;border-radius:18px;background:#fff}.actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}.note{font-size:.8rem;margin:12px 0 0}
      @media(max-width:680px){.editors{grid-template-columns:1fr}.controls{grid-template-columns:1fr}.controls button{width:100%}textarea{min-height:170px}iframe{height:360px}}
    </style>
    <section class="panel">
      <h2>Pracownia interaktywna</h2>
      <p>Każda funkcja z katalogu ma tu własny punkt startowy. Wybierz jedną z ${features.length} funkcji, edytuj przykładowy HTML/CSS i obserwuj rezultat na żywo. Eksperymentalna składnia może nie działać w każdej przeglądarce.</p>
      <div class="controls"><label>Funkcja CSS<select id="feature">${options}</select></label><button id="run" type="button">Uruchom przykład ↗</button></div>
      <div class="editors">
        <label class="editor">HTML <small>Edytowalny markup podglądu</small><textarea id="html" spellcheck="false"></textarea></label>
        <label class="editor">CSS <small>Kod wybranej funkcji — możesz go zmienić</small><textarea id="css" spellcheck="false"></textarea></label>
      </div>
      <div class="actions"><button id="reset" class="secondary" type="button">Przywróć przykład</button><button id="refresh" class="secondary" type="button">Odśwież podgląd</button></div>
      <div class="preview-head"><h3>Podgląd na żywo</h3><span class="status" id="status" role="status">Gotowy</span></div>
      <iframe title="Podgląd przykładu HTML i CSS" sandbox=""></iframe>
      <p class="note">Podgląd działa w odizolowanym iframe. Nie uruchamia skryptów z edytowanego HTML. Wsparcie składni zależy od przeglądarki.</p>
    </section>`;
    const select = this.#root.querySelector<HTMLSelectElement>("#feature")!;
    const html = this.#root.querySelector<HTMLTextAreaElement>("#html")!;
    const css = this.#root.querySelector<HTMLTextAreaElement>("#css")!;
    const frame = this.#root.querySelector<HTMLIFrameElement>("iframe")!;
    const status = this.#root.querySelector<HTMLElement>("#status")!;
    const getFeature = () => features.find((feature) => feature.id === this.#selected) ?? features[0];
    const loadFeature = () => {
      this.#selected = select.value;
      const feature = getFeature();
      css.value = feature?.code ?? "";
      html.value = this.#defaultHtml;
      this.#render(frame, html.value, css.value);
      status.textContent = `Załadowano: ${feature?.title ?? "przykład"}`;
    };
    const run = () => {
      this.#render(frame, html.value, css.value);
      status.textContent = "Podgląd odświeżony";
    };
    select.addEventListener("change", loadFeature);
    this.#root.querySelector("#run")?.addEventListener("click", run);
    this.#root.querySelector("#refresh")?.addEventListener("click", run);
    this.#root.querySelector("#reset")?.addEventListener("click", loadFeature);
    loadFeature();
  }
  #render(frame: HTMLIFrameElement, html: string, css: string) {
    frame.srcdoc = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      *{box-sizing:border-box}body{margin:0;padding:18px;background:#fbfaff;color:#302747;font:15px/1.5 system-ui,sans-serif}
      .demo{max-width:760px;margin:auto}.demo-header{padding:16px;margin-bottom:14px;border-radius:18px;background:linear-gradient(130deg,#eee3ff,#dff3ff)}.eyebrow{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#604a91}
      h1{font-size:1.6rem;line-height:1.1;margin:10px 0}h2{font-size:1.1rem;margin:0 0 8px}.card{padding:16px;border:1px solid #d9cfea;border-radius:18px;background:white;box-shadow:0 6px 20px #30274710}
      .demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}.demo-item{min-width:0;padding:14px;border:1px solid #d5c8ef;border-radius:12px;background:#eee5ff;overflow-wrap:anywhere}.demo-item.tall{min-height:125px;background:#dff2ff}
      button{border:0;border-radius:10px;padding:10px 14px;background:#6550a4;color:white;font-weight:700;cursor:pointer}label{display:block;margin:12px 0}details{margin-top:12px;padding:10px;border-radius:10px;background:#f2edff}a{color:#6546a0}
      @media(max-width:420px){.demo-grid{grid-template-columns:1fr 1fr}}
      ${css}
    </style></head><body>${html}</body></html>`;
  }
  #esc(value: string) {
    return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
  }
}
customElements.define("feature-playground", FeaturePlayground);
