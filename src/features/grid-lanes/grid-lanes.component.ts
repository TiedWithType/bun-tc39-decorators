import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"grid-lanes", title:"CSS Grid Lanes / Masonry", group:"Eksperymentalne", description:"Układ masonry, w którym element trafia do toru z dostępnym miejscem.", detect:()=>CSS.supports('display','grid-lanes'), supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Porównaj z columns i biblioteką JS na tym samym zestawie elementów; obsługa ograniczona.", code:".masonry { display:grid-lanes; grid-template-columns:repeat(3,minmax(0,1fr)); gap:1rem; }" };
export class CssGridLanes extends CssFeatureElement { static feature=feature; }
customElements.define("css-grid-lanes", CssGridLanes);
