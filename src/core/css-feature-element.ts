export interface CssFeature { id:string; title:string; group:string; description:string; detect:()=>boolean; supportNote:string; performance:string; code:string; }
export abstract class CssFeatureElement extends HTMLElement {
 static feature: CssFeature;
 #root=this.attachShadow({mode:"open"});
 connectedCallback(){
  const f=(this.constructor as typeof CssFeatureElement).feature;
  let ok=false; try { ok=f.detect(); } catch {}
  this.#root.innerHTML=`<style>
  :host{display:block;color:var(--text,#eee9ff);font:inherit}*{box-sizing:border-box}
  article{height:100%;background:#191623;border:1px solid #393348;border-radius:16px;overflow:hidden}
  header{display:flex;justify-content:space-between;gap:10px;padding:16px 16px 8px}h2{font-size:1.04rem;margin:0;line-height:1.3}
  .group{font-size:.7rem;border:1px solid #49415b;border-radius:99px;padding:4px 8px;color:#c7bddf;white-space:nowrap}
  p{margin:8px 16px;color:#bdb6d0;font-size:.86rem;line-height:1.55}
  .status{margin:12px 16px;padding:9px;border-radius:8px;font-size:.78rem;background:${ok?'#123d31':'#49351a'};color:${ok?'#73e2b4':'#ffd080'}}
  h3{margin:16px 16px 8px;text-transform:uppercase;letter-spacing:.09em;font-size:.72rem;color:#bdb6d0}
  pre{margin:0 16px;padding:13px;background:#100f17;border:1px solid #393348;border-radius:10px;overflow:auto;color:#eee9ff;font: .78rem/1.65 ui-monospace,Consolas,monospace}
  .key{color:#c792ea}.prop{color:#82aaff}.value{color:#c3e88d}.num{color:#f78c6c}.punct{color:#89ddff}
  .actions{display:flex;align-items:center;gap:10px;padding:14px 16px 16px}button{font:inherit;cursor:pointer;background:#2b253b;border:1px solid #55466f;border-radius:8px;padding:8px 11px;color:white}output{font-size:.78rem;color:#82aaff}
  </style><article><header><h2>${this.#esc(f.title)}</h2><span class="group">${this.#esc(f.group)}</span></header>
  <p>${this.#esc(f.description)}</p><div class="status" role="status">${ok?'✓ Wykryto obsługę testowanej składni':'! Brak potwierdzenia obsługi składni'}</div>
  <p>${this.#esc(f.supportNote)}</p><h3>Przykładowy CSS</h3><pre><code>${this.#highlight(f.code)}</code></pre>
  <h3>Wydajność</h3><p>${this.#esc(f.performance)}</p><p>Mikrotest mierzy ogólną operację DOM/CSS, nie szybkość tej konkretnej funkcji.</p>
  <div class="actions"><button type="button">Uruchom mikrotest</button><output>Brak pomiaru</output></div></article>`;
  this.#root.querySelector('button')?.addEventListener('click',()=>this.#bench());
 }
 #esc(s:string){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]??c))}
 #highlight(s:string){return s.split('\n').map(line=>line.replace(/\s+/g,' ').trim().split(/(\s+|[{}();:,])/).map(token=>{
  const e=this.#esc(token); if(/^@[\w-]+$/.test(token))return '<span class="key">'+e+'</span>';
  if(/^[\w-]+$/.test(token))return '<span class="'+(/^(color|background|display|width|height|padding|margin|position|animation|grid-template-columns|border-radius|clip-path|transition|anchor-name|position-anchor|corner-shape|reading-flow|scroll-marker-group|column-rule|row-rule|container-type|font-size)$/.test(token)?'prop':'value')+'">'+e+'</span>';
  if(/^\d/.test(token)||/^#[\da-f]+$/i.test(token))return '<span class="num">'+e+'</span>';
  if(/^[{}();:,]$/.test(token))return '<span class="punct">'+e+'</span>'; return e;
 }).join('')).join('\n')}
 #bench(){const out=this.#root.querySelector('output');if(!out)return;const runs:number[]=[];for(let n=0;n<5;n++){const t=performance.now(),host=document.createElement('div');host.style.cssText='position:fixed;left:-9999px;display:grid;grid-template-columns:repeat(10,1fr);contain:layout style paint';const frag=document.createDocumentFragment();for(let i=0;i<200;i++){const el=document.createElement('div');el.style.cssText='height:8px;background:color-mix(in srgb,#8b5cf6 30%,transparent)';frag.append(el)}host.append(frag);document.body.append(host);host.querySelectorAll('div').forEach(el=>getComputedStyle(el).backgroundColor);host.remove();runs.push(performance.now()-t)}runs.sort((a,b)=>a-b);out.textContent='Mediana: '+runs[2].toFixed(2)+' ms / 200 węzłów'}
}