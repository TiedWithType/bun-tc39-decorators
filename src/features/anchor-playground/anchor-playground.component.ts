class AnchorPlayground extends HTMLElement {
 #root=this.attachShadow({mode:"open"});
 connectedCallback(){
 this.#root.innerHTML=`<style>
 @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
 :host{display:block;color:#2d2543;font:500 15px/1.5 'Quicksand',system-ui,sans-serif;margin-top:16px}*{box-sizing:border-box}
 .layout{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:16px}
 section{min-width:0;background:linear-gradient(145deg,#fff,#f6f0ff);border:1px solid #e3d9f3;border-radius:26px;padding:clamp(16px,3vw,24px);box-shadow:0 8px 30px #4733660b}
 h3{margin:0 0 6px;font-size:1.15rem;letter-spacing:-.03em}p{margin:0 0 18px;color:#6b617f;font-size:.88rem}
 .stage{position:relative;min-height:190px;padding:28px 18px;border-radius:20px;background:linear-gradient(135deg,#e5f4ff,#f4e9ff 55%,#ffe9f1);display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px}
 button{font:inherit;font-weight:700;cursor:pointer;border:1px solid #c9b9e9;border-radius:16px;padding:11px 15px;background:#fff;color:#453366;box-shadow:0 4px 12px #42315a12}button:focus-visible{outline:3px solid #8c6bd0;outline-offset:3px}
 .target{anchor-name:--demo-anchor}.tip{position:absolute;position-anchor:--demo-anchor;position-area:bottom;position-try-fallbacks:flip-block;justify-self:anchor-center;margin-block-start:8px;z-index:2;background:#342452;color:white;border:0;border-radius:13px;padding:9px 12px;max-width:220px;box-shadow:0 10px 24px #27153d30;display:none;font-size:.82rem}
 .stage.show-tip .tip{display:block;animation:pop .18s ease-out both}@keyframes pop{from{opacity:0;scale:.92}to{opacity:1;scale:1}}
 .note{margin-top:12px!important;padding:10px 12px;background:#fff;border-radius:12px;font-size:.8rem!important}
 .list{display:grid;gap:9px;margin:14px 0 12px;padding:0;list-style:none}.item{display:flex;align-items:center;gap:10px;padding:10px 11px;background:#fff;border:1px solid #e2d9ef;border-radius:15px;touch-action:pan-y;transition:background .15s,transform .15s;min-width:0}.item[draggable=true]{cursor:grab}.item.dragging{opacity:.4;transform:scale(.98)}.item.over{outline:2px dashed #7855b7;outline-offset:2px;background:#f0e8ff}.handle{font-size:1.1rem;color:#8b78aa;user-select:none}.item .name{flex:1;min-width:0;font-weight:700}.item button{padding:5px 9px;border-radius:10px;box-shadow:none;font-size:.8rem}
 .drop-hint{padding:12px;border:1px dashed #c7b7df;border-radius:14px;text-align:center;color:#75688c;font-size:.82rem}.status{font-size:.8rem;color:#574779;min-height:1.4em;margin-top:10px}
 @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
 </style><div class="layout">
 <section><h3>CSS Anchor Positioning</h3><p>Kliknij przycisk, aby pokazać tooltip. Jeśli przeglądarka obsługuje kotwice CSS, dymek ustawi się względem przycisku.</p>
 <div class="stage"><button class="target" aria-expanded="false">Kotwica · kliknij</button><div class="tip" role="status">Jestem pozycjonowany przez <code>position-anchor</code>.</div></div>
 <p class="note" role="status">Status wsparcia: sprawdzanie…</p></section>
 <section><h3>Drag &amp; drop</h3><p>Przeciągnij pozycję na inną. Możesz też użyć przycisków ↑ i ↓ — przydatne na ekranie dotykowym.</p>
 <ul class="list" aria-label="Lista do sortowania"><li class="item" draggable="true" data-id="html"><span class="handle" aria-hidden="true">⠿</span><span class="name">HTML · struktura</span><button data-move="-1" aria-label="Przenieś HTML w górę">↑</button><button data-move="1" aria-label="Przenieś HTML w dół">↓</button></li>
 <li class="item" draggable="true" data-id="css"><span class="handle" aria-hidden="true">⠿</span><span class="name">CSS · wygląd</span><button data-move="-1" aria-label="Przenieś CSS w górę">↑</button><button data-move="1" aria-label="Przenieś CSS w dół">↓</button></li>
 <li class="item" draggable="true" data-id="js"><span class="handle" aria-hidden="true">⠿</span><span class="name">JavaScript · zachowanie</span><button data-move="-1" aria-label="Przenieś JavaScript w górę">↑</button><button data-move="1" aria-label="Przenieś JavaScript w dół">↓</button></li>
 </ul><div class="drop-hint">Upuść element na innym elemencie, aby zmienić kolejność.</div><div class="status" aria-live="polite">Kolejność początkowa.</div></section></div>`;
 const root=this.#root, stage=root.querySelector<HTMLElement>(".stage")!, target=root.querySelector<HTMLButtonElement>(".target")!, note=root.querySelector<HTMLElement>(".note")!, tip=root.querySelector<HTMLElement>(".tip")!;
 const supported=CSS.supports("anchor-name","--demo-anchor")&&CSS.supports("position-anchor","--demo-anchor")&&CSS.supports("position-area","bottom");
 note.textContent=supported?"✓ Przeglądarka akceptuje deklaracje Anchor Positioning. Sprawdź położenie dymka.":"! Brak pełnej detekcji Anchor Positioning. Tooltip może nie pojawić się przy przycisku.";
 target.addEventListener("click",()=>{const shown=stage.classList.toggle("show-tip");target.setAttribute("aria-expanded",String(shown));if(!supported){tip.style.display=shown?"block":"none";tip.style.position="static";tip.style.margin="0"}}); 
 const list=root.querySelector<HTMLElement>(".list")!, status=root.querySelector<HTMLElement>(".status:last-child")!;
 let dragged:HTMLElement|null=null;
 const items=()=>[...list.querySelectorAll<HTMLElement>(".item")];
 const announce=()=>{status.textContent="Kolejność: "+items().map(el=>el.dataset.id?.toUpperCase()).join(" → ")};
 items().forEach(item=>{
 item.addEventListener("dragstart",e=>{dragged=item;item.classList.add("dragging");if(e.dataTransfer){e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",item.dataset.id??"")}});
 item.addEventListener("dragend",()=>{item.classList.remove("dragging");items().forEach(el=>el.classList.remove("over"));dragged=null;announce()});
 item.addEventListener("dragover",e=>{e.preventDefault();if(dragged&&dragged!==item)item.classList.add("over")});
 item.addEventListener("dragleave",()=>item.classList.remove("over"));
 item.addEventListener("drop",e=>{e.preventDefault();item.classList.remove("over");if(!dragged||dragged===item)return;const rect=item.getBoundingClientRect();list.insertBefore(dragged,e.clientY<rect.top+rect.height/2?item:item.nextSibling);announce()});
 item.querySelectorAll<HTMLButtonElement>("[data-move]").forEach(btn=>btn.addEventListener("click",()=>{const index=items().indexOf(item),next=index+Number(btn.dataset.move);if(next<0||next>=items().length)return;const other=items()[next];list.insertBefore(item,Number(btn.dataset.move)<0?other:item.nextSibling===other?other.nextSibling:item.nextSibling);if(Number(btn.dataset.move)>0)list.insertBefore(other,item);announce()}));
 });
 }
}
customElements.define("anchor-playground",AnchorPlayground);