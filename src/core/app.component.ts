import { features } from "@core/features";
class CssLabApp extends HTMLElement {
 #root=this.attachShadow({mode:"open"});
 connectedCallback(){this.#root.innerHTML=`<style>
 :host{display:block;color:#f1edff;font:16px/1.5 Inter,system-ui,sans-serif}*{box-sizing:border-box}.shell{max-width:1440px;margin:auto;padding:clamp(16px,3vw,36px)}
 .hero{padding:clamp(22px,5vw,56px);border:1px solid #393348;border-radius:24px;background:radial-gradient(ellipse at 80% 0%,#43256c,transparent 50%),#191623}
 .eyebrow{color:#c6a7ff;text-transform:uppercase;letter-spacing:.15em;font-size:.74rem;font-weight:700}h1{font-size:clamp(2rem,5vw,4rem);line-height:1.04;letter-spacing:-.05em;margin:12px 0}p{color:#c2bbd3;max-width:900px}.pills,.filters{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.pill{border:1px solid #514563;border-radius:99px;padding:7px 11px;font-size:.8rem;color:#d9cafa}
 button{background:#201b2d;border:1px solid #443a57;border-radius:99px;color:#e8e1fa;padding:8px 13px;cursor:pointer;font:inherit}button[aria-pressed=true]{background:#7041a6;border-color:#a78bfa}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:16px;margin-top:18px;align-items:stretch}footer{color:#aaa2bf;font-size:.82rem;margin:28px 0}a{color:#c6a7ff}
 </style><main class="shell"><section class="hero"><div class="eyebrow">Modern CSS Lab · Bun + TypeScript</div><h1>Nowoczesny CSS.<br>Przykłady, wsparcie i pomiary.</h1>
 <p>Katalog stabilnych, nowych i eksperymentalnych funkcji CSS. Każda karta jest osobnym Web Componentem z własnego folderu, ma opis, kolorowaną składnię, detekcję przeglądarki i mikrotest.</p>
 <p><strong>Uwaga:</strong> wykrycie składni nie gwarantuje pełnej implementacji. Mikrotest mierzy ogólną operację DOM/CSS, a nie wydajność samej funkcji.</p>
 <div class="pills"><span class="pill">${features.length} komponentów</span><span class="pill">Shadow DOM</span><span class="pill">@core/* · @features/*</span></div></section>
 <nav class="filters" aria-label="Kategorie"><button data-filter="Wszystkie" aria-pressed="true">Wszystkie</button>${["Stabilne","Nowe","Zaawansowane","Eksperymentalne"].map(g=>`<button data-filter="${g}" aria-pressed="false">${g}</button>`).join("")}</nav>
 <section class="grid">${features.map(f=>`<css-${f.id} data-group="${f.group}"></css-${f.id}>`).join("")}</section>
 <footer>Sprawdź też <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank" rel="noreferrer">MDN CSS</a>. Wyniki zależą od przeglądarki, urządzenia i obciążenia. Dla wiarygodnych porównań testuj wariant z funkcją i fallback na identycznym zestawie danych.</footer></main>`;
 this.#root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{const selected=btn.dataset.filter??'Wszystkie';this.#root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));this.#root.querySelectorAll<HTMLElement>('.grid>*').forEach(card=>card.toggleAttribute('hidden',selected!=='Wszystkie'&&card.dataset.group!==selected))}))}
}
customElements.define("css-lab-app",CssLabApp);