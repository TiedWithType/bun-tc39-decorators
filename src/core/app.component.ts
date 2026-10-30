import { features } from "@core/features";
import "@features/anchor-playground/anchor-playground.component";

class CssLabApp extends HTMLElement {
 #root=this.attachShadow({mode:"open"});
 connectedCallback(){
  this.#root.innerHTML=`<style>
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
  :host{display:block;color:#25213a;font:500 16px/1.55 'Quicksand',system-ui,sans-serif;--ink:#25213a;--muted:#625b78;--purple:#6750a4;--lavender:#e9ddff;--blue:#c6e7ff;--pink:#ffd8e8;--mint:#c9f2e4}
  *{box-sizing:border-box} .shell{max-width:1500px;margin:auto;padding:clamp(16px,3vw,40px)}
  .hero{position:relative;isolation:isolate;overflow:hidden;padding:clamp(24px,5vw,64px);border:1px solid #ded4f6;border-radius:36px;background:linear-gradient(125deg,#f6edff 0%,#e2f2ff 52%,#ffe8f1 100%);box-shadow:0 18px 55px #45345a12}
  .hero:before,.hero:after{content:"";position:absolute;z-index:-1;border-radius:50%;filter:blur(1px);pointer-events:none}.hero:before{width:260px;height:260px;right:-45px;top:-100px;background:#d2b8ff99}.hero:after{width:180px;height:180px;right:22%;bottom:-135px;background:#a6e5ffb0}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff9;padding:8px 13px;border:1px solid #fff;border-radius:99px;color:#59448d;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  h1{max-width:900px;font-size:clamp(2.35rem,6.4vw,5.5rem);line-height:.98;letter-spacing:-.065em;margin:24px 0 18px;font-weight:700;color:#2e2448}
  p{max-width:850px;color:var(--muted);margin:10px 0}.pills{display:flex;gap:9px;flex-wrap:wrap;margin-top:24px}.pill{border:1px solid #fff;background:#ffffffa8;border-radius:99px;padding:8px 13px;font-size:.82rem;font-weight:700;color:#51416e}
  .tools{display:grid;grid-template-columns:minmax(220px,1fr) auto;gap:12px;align-items:center;margin:26px 0 12px}
  .search{display:flex;align-items:center;gap:10px;min-width:0;padding:0 16px;background:#fff;border:1px solid #ded6ed;border-radius:18px;box-shadow:0 4px 18px #34245108}.search span{font-size:1.1rem;color:#70618e}.search input{width:100%;min-width:0;padding:14px 0;border:0;outline:0;background:transparent;color:var(--ink);font:inherit}.search:focus-within{outline:3px solid #cdb7ff;outline-offset:2px}
  .count{font-size:.85rem;color:#625779;font-weight:700;white-space:nowrap}
  .filters{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0 20px;padding:4px 0}button{font:inherit;font-weight:700;cursor:pointer;transition:transform .18s ease,background .18s ease,box-shadow .18s ease}button:hover{transform:translateY(-2px)}button:focus-visible{outline:3px solid #8b6de0;outline-offset:3px}
  .filter{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid #e1d9ee;border-radius:99px;padding:9px 14px;color:#514767;box-shadow:0 3px 10px #32214808}.filter[aria-pressed=true]{background:#6550a4;color:white;border-color:#6550a4;box-shadow:0 5px 14px #6550a42b}.filter small{font-size:.7rem;opacity:.75}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:18px;margin-top:12px;align-items:stretch}
  .section-title{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-top:30px}.section-title h2{font-size:clamp(1.35rem,3vw,2rem);letter-spacing:-.04em;margin:0;color:#302747}.section-title p{font-size:.86rem;margin:4px 0 0}
  .empty{padding:28px;border:1px dashed #b7a9d0;border-radius:20px;text-align:center;color:#655a7c;background:#ffffff9c}
  footer{color:#6e657f;font-size:.82rem;margin:34px 0 12px;padding:18px 4px;border-top:1px solid #e2d9ef}a{color:#60469b}
  @media(max-width:680px){.tools{grid-template-columns:1fr}.count{white-space:normal}.hero{border-radius:26px}.grid{grid-template-columns:minmax(0,1fr)}}
  @media(prefers-reduced-motion:reduce){*,*:before,*:after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
  </style>
  <main class="shell">
   <section class="hero"><div class="eyebrow">✦ Modern CSS Lab · Bun + TypeScript</div>
    <h1>Nowoczesny CSS,<br>który możesz dotknąć.</h1>
    <p>Przeglądaj nowoczesne i eksperymentalne funkcje CSS. Sprawdzaj przykłady, wsparcie przeglądarki i uruchamiaj mikrotesty — w ekspresyjnym, pastelowym motywie inspirowanym Material 3 Expressive.</p>
    <p><strong>Ważne:</strong> wykrycie składni nie gwarantuje pełnej implementacji. Wynik mikrotestu zależy od urządzenia i nie jest rankingiem funkcji CSS.</p>
    <div class="pills"><span class="pill">${features.length} komponentów CSS</span><span class="pill">Shadow DOM</span><span class="pill">Quicksand</span><span class="pill">@core/* · @features/*</span></div>
   </section>
   <section class="section-title"><div><h2>Eksploruj funkcje</h2><p>Filtruj po kategorii albo wpisz nazwę, właściwość lub opis.</p></div></section>
   <div class="tools"><label class="search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Np. anchor, grid, animacje…" aria-label="Szukaj funkcji CSS"></label><div class="count" aria-live="polite"></div></div>
   <nav class="filters" aria-label="Filtr kategorii"><button class="filter" data-filter="Wszystkie" aria-pressed="true">Wszystkie <small></small></button>${["Stabilne","Nowe","Zaawansowane","Eksperymentalne"].map(g=>`<button class="filter" data-filter="${g}" aria-pressed="false">${g} <small></small></button>`).join("")}</nav>
   <section class="grid" aria-label="Katalog funkcji CSS">${features.map(f=>`<css-${f.id} data-group="${f.group}" data-search="${this.#esc([f.title,f.group,f.description,f.code].join(" "))}"></css-${f.id}>`).join("")}</section>
   <p class="empty" hidden>Nie znaleziono funkcji. Zmień wyszukiwaną frazę lub kategorię.</p>
   <section class="section-title"><div><h2>Pracownia interaktywna</h2><p>Każda karta ma przypisany do swojej funkcji stały przykład HTML i podgląd CSS. Anchor Positioning oraz drag & drop sprawdzisz w osobnej demonstracji.</p></div></section>
   <anchor-playground></anchor-playground>
   <footer>Dokumentacja: <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noreferrer">MDN CSS</a> · Czcionka: Quicksand · Funkcje eksperymentalne mogą wymagać flag lub nie być obsługiwane.</footer>
  </main>`;
  const root=this.#root, cards=[...root.querySelectorAll<HTMLElement>(".grid > *")], search=root.querySelector<HTMLInputElement>('input[type="search"]')!, count=root.querySelector<HTMLElement>(".count")!, empty=root.querySelector<HTMLElement>(".empty")!;
  let selected="Wszystkie";
  const apply=()=>{const q=search.value.trim().toLocaleLowerCase("pl");let visible=0;cards.forEach(card=>{const show=(selected==="Wszystkie"||card.dataset.group===selected)&&(!q||(card.dataset.search??"").toLocaleLowerCase("pl").includes(q));card.hidden=!show;visible+=Number(show)});count.textContent=`Wyświetlono ${visible} z ${cards.length} funkcji`;empty.hidden=visible!==0;root.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(btn=>{btn.setAttribute("aria-pressed",String(btn.dataset.filter===selected));const small=btn.querySelector("small");if(small)small.textContent=String(btn.dataset.filter==="Wszystkie"?cards.length:cards.filter(c=>c.dataset.group===btn.dataset.filter).length)})};
  root.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{selected=btn.dataset.filter??"Wszystkie";apply()}));
  search.addEventListener("input",apply);apply();
 }
 #esc(s:string){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]??c))}
}
customElements.define("css-lab-app",CssLabApp);