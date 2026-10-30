export interface CssFeature { id:string; title:string; group:string; description:string; detect:()=>boolean; supportNote:string; performance:string; code:string; }
export abstract class CssFeatureElement extends HTMLElement {
 static feature: CssFeature;
 #root=this.attachShadow({mode:"open"});
 connectedCallback(){
  const f=(this.constructor as typeof CssFeatureElement).feature;
  let ok=false;try{ok=f.detect()}catch{}
  this.#root.innerHTML=`<style>
  :host{display:block;min-width:0;color:#302747;font:inherit;--card-border:#e3d9f2;--muted:#6b617f}
  :host([hidden]){display:none!important}
  *{box-sizing:border-box}
  article{position:relative;display:flex;flex-direction:column;height:100%;min-width:0;overflow:hidden;border:1px solid var(--card-border);border-radius:26px;background:linear-gradient(150deg,#fff 0%,#fbf8ff 72%,#f2edff 100%);box-shadow:0 7px 24px #3f2d570a;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
  article:hover{transform:translateY(-3px);box-shadow:0 13px 32px #3f2d5716;border-color:#c9b6eb}
  header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:19px 19px 8px}
  h2{font-size:1.08rem;font-weight:700;letter-spacing:-.025em;line-height:1.3;margin:0;min-width:0;overflow-wrap:anywhere}
  .group{flex:0 0 auto;max-width:45%;font-size:.7rem;line-height:1.3;font-weight:700;text-align:center;border:1px solid #e0d5f3;border-radius:99px;padding:6px 9px;color:#5d438e;background:#f0e7ff;white-space:normal;overflow-wrap:anywhere}
  p{margin:9px 19px;color:var(--muted);font-size:.86rem;line-height:1.58;overflow-wrap:anywhere}
  .status{margin:12px 19px 4px;padding:10px 12px;border-radius:14px;font-size:.78rem;font-weight:700;line-height:1.45;background:${ok?'#d9f5e8':'#fff0d2'};color:${ok?'#176849':'#80520c'};border:1px solid ${ok?'#b8e9d4':'#f3d9a5'}}
  h3{margin:18px 19px 8px;text-transform:uppercase;letter-spacing:.1em;font-size:.69rem;font-weight:700;color:#716582}
  pre{margin:0 19px;padding:14px;min-width:0;background:#282139;border:1px solid #46385f;border-radius:16px;overflow:auto;color:#f8f1ff;font:.78rem/1.7 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2;white-space:pre}
  code{font:inherit}.key{color:#e0b7ff}.prop{color:#9ed8ff}.value{color:#c7f2b5}.num{color:#ffb99f}.punct{color:#c9c0dd}.comment{color:#a8a0ba;font-style:italic}.string{color:#ffdc91}
  .actions{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:auto;padding:16px 19px 19px}
  button{font:inherit;font-size:.8rem;font-weight:700;cursor:pointer;background:#e8ddff;border:1px solid #d4c2fa;border-radius:14px;padding:10px 13px;color:#49336f;transition:transform .16s ease,background .16s ease}
  button:hover{transform:translateY(-1px);background:#ded0ff}button:focus-visible{outline:3px solid #8b6de0;outline-offset:3px}
  .example{margin:0 19px;border:1px solid #e2d9ef;border-radius:16px;overflow:hidden;background:white}.example iframe{display:block;width:100%;height:190px;border:0;background:white}.html-code{max-height:150px;overflow:auto;font-size:.72rem}.html-code code{white-space:pre-wrap;overflow-wrap:anywhere}\n  output{font-size:.76rem;font-weight:700;color:#5d438e;max-width:100%;overflow-wrap:anywhere}
  @media(max-width:440px){.example{margin-inline:15px}header{padding:16px 15px 7px;gap:8px}.group{max-width:42%;font-size:.66rem}p{margin-inline:15px}pre{margin-inline:15px;font-size:.73rem}.status{margin-inline:15px}.actions{padding:14px 15px 16px}}
  @media(prefers-reduced-motion:reduce){article,button{transition:none!important}}
  </style><article><header><h2>${this.#esc(f.title)}</h2><span class="group">${this.#esc(f.group)}</span></header>
  <p>${this.#esc(f.description)}</p><div class="status" role="status">${ok?'✓ Wykryto obsługę testowanej składni':'! Brak potwierdzenia obsługi składni'}</div>
  <p>${this.#esc(f.supportNote)}</p><h3>Przykładowy CSS</h3><pre><code>${this.#highlight(f.code)}</code></pre>
  <h3>Przykład przypisany do funkcji</h3><div class="example"><iframe title="Podgląd przykładu CSS" sandbox=""></iframe></div><h3>HTML przykładu</h3><pre class="html-code"><code></code></pre>
  <h3>Wydajność</h3><p>${this.#esc(f.performance)}</p><p>Mikrotest mierzy ogólną operację DOM/CSS, nie szybkość tej konkretnej funkcji.</p>
  <div class="actions"><button class="bench" type="button">Uruchom mikrotest</button><output>Brak pomiaru</output></div></article>`;
  const sample=this.#example(f.id); const frame=this.#root.querySelector<HTMLIFrameElement>('iframe'); if(frame)frame.srcdoc=`<!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:16px;background:#fff;color:#302747;font:14px/1.5 system-ui,sans-serif}*{box-sizing:border-box}.demo-card{padding:14px;border:1px solid #d9cfea;border-radius:14px;background:#fbf8ff}.demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.demo-item{padding:10px;border-radius:10px;background:#e9ddff;min-width:0}.demo-button{padding:8px 12px;border:0;border-radius:9px;background:#6550a4;color:white;font-weight:700}.demo-muted{color:#655b79}.demo-swatches{display:flex;gap:8px;flex-wrap:wrap}.demo-swatch{width:48px;height:48px;border-radius:10px;background:#bca7ef}.demo-pill{display:inline-block;padding:6px 10px;border-radius:99px;background:#e4f3ff}.demo-item:nth-child(2){background:#dff2ff}.demo-item:nth-child(3){background:#ffe5f0}</style><style>${f.code}</style><body>${sample.html}</body></html>`; const htmlCode=this.#root.querySelector('.html-code code'); if(htmlCode)htmlCode.textContent=sample.html;
  this.#root.querySelector('button.bench')?.addEventListener('click',()=>this.#bench());
 }
 #esc(s:string){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]??c))}
 #highlight(s:string){return s.split('\n').map(line=>line.replace(/(\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|#[0-9a-fA-F]{3,8}\b|@[a-zA-Z-]+|\b\d+(?:\.\d+)?(?:%|px|rem|em|vh|vw|ms|s)?\b|--[\w-]+|\b[a-zA-Z-]+(?=\s*:)|[{}();:,])/g,token=>{const e=this.#esc(token);if(token.startsWith('/*'))return '<span class="comment">'+e+'</span>';if(token.startsWith('"')||token.startsWith("'"))return '<span class="string">'+e+'</span>';if(token.startsWith('@'))return '<span class="key">'+e+'</span>';if(token.startsWith('--'))return '<span class="value">'+e+'</span>';if(token.startsWith('#')||/^\d/.test(token))return '<span class="num">'+e+'</span>';if(/^[{}();:,]$/.test(token))return '<span class="punct">'+e+'</span>';if(/^[a-zA-Z-]+$/.test(token))return '<span class="prop">'+e+'</span>';return e})).join('\n')}
 #example(id:string):{html:string}{
  const examples:Record<string,string>={
   "has":'<section class="demo-card"><h3>:has() · stan rodzica</h3><label><input type="checkbox" checked> Zaznaczona opcja</label><p class="demo-muted">Obramowanie karty zależy od stanu pola.</p></section>',
   "nesting":'<section class="demo-card nesting-card"><h3>Nesting</h3><p>Style zagnieżdżone w selektorze rodzica.</p><button class="demo-button">Najedź na mnie</button></section>',
   "layers":'<div class="demo-card layer-box"><strong>@layer</strong><p>Sprawdź kolejność warstw kaskady.</p></div>',
   "container":'<section class="demo-card container-demo"><strong>Container query</strong><p>Zmień szerokość podglądu, by zobaczyć reakcję komponentu.</p><div class="demo-item">Element reagujący na rozmiar kontenera</div></section>',
   "subgrid":'<div class="demo-grid subgrid-demo"><div class="demo-item">Nagłówek A<br><small>Treść</small></div><div class="demo-item">Dłuższy nagłówek B<br><small>Treść</small></div><div class="demo-item">Nagłówek C<br><small>Treść</small></div></div>',
   "property":'<section class="demo-card"><strong>Animowana własna właściwość</strong><div class="property-track"><div class="property-fill"></div></div><p class="demo-muted">Zarejestrowana właściwość może interpolować wartości.</p></section>',
   "color-mix":'<section class="demo-card"><strong>color-mix()</strong><div class="demo-swatches"><div class="demo-swatch"></div><div class="demo-swatch mix-a"></div><div class="demo-swatch mix-b"></div></div><p class="demo-muted">Kolory mieszane w CSS.</p></section>',
   "clamp-viewport":'<section class="demo-card"><p class="clamp-title">Responsywny nagłówek</p><p class="demo-muted">Rozmiar tekstu oparty na clamp() i viewport.</p></section>',
   "scope":'<section class="demo-card scope-demo"><p>Poza zakresem</p><div class="scope-root"><p>W zakresie @scope</p><button class="demo-button">Przycisk w zakresie</button></div></section>',
   "anchor":'<section class="demo-card"><button class="demo-button anchor-trigger">Punkt kotwiczenia</button><div class="anchor-tooltip">Dymek pozycjonowany względem kotwicy</div><p class="demo-muted">Anchor Positioning</p></section>',
   "scroll-animations":'<section class="demo-card"><p>Przewiń wnętrze tego panelu ↓</p><div class="scroll-area"><div class="scroll-space"></div><div class="scroll-reveal">Element animowany podczas przewijania</div><div class="scroll-space"></div></div></section>',
   "view-transitions":'<section class="demo-card"><strong>View Transitions</strong><div class="transition-card">Widok A</div><p class="demo-muted">Przykład pokazuje element, który może uczestniczyć w przejściu widoku.</p></section>',
   "grid-lanes":'<section class="demo-grid masonry"><div class="demo-item">Krótki</div><div class="demo-item tall">Wyższy element z dodatkowym tekstem</div><div class="demo-item">Średni element</div><div class="demo-item">Jeszcze jeden</div><div class="demo-item tall">Dłuższa zawartość</div><div class="demo-item">Krótki</div></section>',
   "starting-style":'<section class="demo-card"><dialog open class="starting-dialog">Nowy element — @starting-style</dialog><p class="demo-muted">Stan początkowy dla wejścia elementu.</p></section>',
   "discrete":'<section class="demo-card"><div class="discrete-box">transition-behavior: allow-discrete</div><p class="demo-muted">Przykład przejścia właściwości dyskretnej.</p></section>',
   "sibling-index":'<section class="demo-card"><strong>sibling-index()</strong><div class="sibling-row"><span>1</span><span>2</span><span>3</span><span>4</span></div></section>',
   "corner-shape":'<section class="demo-card corner-demo"><strong>corner-shape</strong><p>Zaokrąglenia i kształty narożników.</p></section>',
   "gap-decorations":'<section class="demo-card"><strong>gap decorations</strong><div class="gap-demo"><div class="demo-item">A</div><div class="demo-item">B</div><div class="demo-item">C</div></div></section>',
   "reading-flow":'<section class="demo-card"><strong>reading-flow</strong><div class="reading-grid"><div class="demo-item">Pierwszy</div><div class="demo-item">Drugi</div><div class="demo-item">Trzeci</div></div><p class="demo-muted">Przepływ czytania w układzie CSS.</p></section>',
   "shape":'<section class="demo-card shape-demo"><div class="shape-blob"></div><p>Tekst przepływa wokół kształtu utworzonego przez shape-outside. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent blandit.</p></section>',
   "css-mixins":'<section class="demo-card"><strong>CSS mixins</strong><div class="mixin-box">Przykładowy element dla eksperymentalnych miksinów.</div></section>',
   "css-functions":'<section class="demo-card"><strong>CSS @function</strong><div class="function-box">Wartość wyliczana przez funkcję CSS.</div><p class="demo-muted">Obsługa zależy od implementacji przeglądarki.</p></section>',
   "carousel":'<section class="demo-card"><strong>CSS carousel</strong><div class="carousel-demo"><div class="demo-item">Karta 1</div><div class="demo-item">Karta 2</div><div class="demo-item">Karta 3</div></div><p class="demo-muted">Przewijaj poziomo.</p></section>',
   "custom-functions-if":'<section class="demo-card"><strong>Warunkowe funkcje CSS</strong><div class="if-box">Wynik reguły warunkowej</div><p class="demo-muted">Składnia eksperymentalna może nie być obsługiwana.</p></section>'
  };
  return {html:examples[id]??'<section class="demo-card"><strong>Przykład CSS</strong><p>Przykład jest przypisany do tego komponentu.</p><div class="demo-grid"><div class="demo-item">A</div><div class="demo-item">B</div><div class="demo-item">C</div></div></section>'};
 }

 #bench(){const out=this.#root.querySelector('output');if(!out)return;const runs:number[]=[];for(let n=0;n<5;n++){const t=performance.now(),host=document.createElement('div');host.style.cssText='position:fixed;left:-9999px;display:grid;grid-template-columns:repeat(10,1fr);contain:layout style paint';const frag=document.createDocumentFragment();for(let i=0;i<200;i++){const el=document.createElement('div');el.style.cssText='height:8px;background:color-mix(in srgb,#8b5cf6 30%,transparent)';frag.append(el)}host.append(frag);document.body.append(host);host.querySelectorAll('div').forEach(el=>getComputedStyle(el).backgroundColor);host.remove();runs.push(performance.now()-t)}runs.sort((a,b)=>a-b);out.textContent='Mediana: '+runs[2].toFixed(2)+' ms / 200 węzłów'}
}