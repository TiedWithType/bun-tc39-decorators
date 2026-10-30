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
  output{font-size:.76rem;font-weight:700;color:#5d438e;max-width:100%;overflow-wrap:anywhere}
  @media(max-width:440px){header{padding:16px 15px 7px;gap:8px}.group{max-width:42%;font-size:.66rem}p{margin-inline:15px}pre{margin-inline:15px;font-size:.73rem}.status{margin-inline:15px}.actions{padding:14px 15px 16px}}
  @media(prefers-reduced-motion:reduce){article,button{transition:none!important}}
  </style><article><header><h2>${this.#esc(f.title)}</h2><span class="group">${this.#esc(f.group)}</span></header>
  <p>${this.#esc(f.description)}</p><div class="status" role="status">${ok?'✓ Wykryto obsługę testowanej składni':'! Brak potwierdzenia obsługi składni'}</div>
  <p>${this.#esc(f.supportNote)}</p><h3>Przykładowy CSS</h3><pre><code>${this.#highlight(f.code)}</code></pre>
  <h3>Wydajność</h3><p>${this.#esc(f.performance)}</p><p>Mikrotest mierzy ogólną operację DOM/CSS, nie szybkość tej konkretnej funkcji.</p>
  <div class="actions"><button type="button">Uruchom mikrotest</button><output>Brak pomiaru</output></div></article>`;
  this.#root.querySelector('button')?.addEventListener('click',()=>this.#bench());
 }
 #esc(s:string){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]??c))}
 #highlight(s:string){return s.split('\n').map(line=>line.replace(/(\/\*[\s\S]*?\*\/|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|#[0-9a-fA-F]{3,8}\b|@[a-zA-Z-]+|\b\d+(?:\.\d+)?(?:%|px|rem|em|vh|vw|ms|s)?\b|--[\w-]+|\b[a-zA-Z-]+(?=\s*:)|[{}();:,])/g,token=>{const e=this.#esc(token);if(token.startsWith('/*'))return '<span class="comment">'+e+'</span>';if(token.startsWith('"')||token.startsWith("'"))return '<span class="string">'+e+'</span>';if(token.startsWith('@'))return '<span class="key">'+e+'</span>';if(token.startsWith('--'))return '<span class="value">'+e+'</span>';if(token.startsWith('#')||/^\d/.test(token))return '<span class="num">'+e+'</span>';if(/^[{}();:,]$/.test(token))return '<span class="punct">'+e+'</span>';if(/^[a-zA-Z-]+$/.test(token))return '<span class="prop">'+e+'</span>';return e})).join('\n')}
 #bench(){const out=this.#root.querySelector('output');if(!out)return;const runs:number[]=[];for(let n=0;n<5;n++){const t=performance.now(),host=document.createElement('div');host.style.cssText='position:fixed;left:-9999px;display:grid;grid-template-columns:repeat(10,1fr);contain:layout style paint';const frag=document.createDocumentFragment();for(let i=0;i<200;i++){const el=document.createElement('div');el.style.cssText='height:8px;background:color-mix(in srgb,#8b5cf6 30%,transparent)';frag.append(el)}host.append(frag);document.body.append(host);host.querySelectorAll('div').forEach(el=>getComputedStyle(el).backgroundColor);host.remove();runs.push(performance.now()-t)}runs.sort((a,b)=>a-b);out.textContent='Mediana: '+runs[2].toFixed(2)+' ms / 200 węzłów'}
}