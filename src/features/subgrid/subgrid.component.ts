import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"subgrid", title:"subgrid", group:"Stabilne", description:"Zagnieżdżona siatka współdzieli tory rodzica dla wyrównania kolumn i wierszy.", detect:()=>CSS.supports('grid-template-columns','subgrid'), supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Ułatwia układ bez wrapperów; koszt zależy od złożoności całej siatki.", code:".parent { display:grid; grid-template-columns:1fr 2fr; } .child { display:grid; grid-template-columns:subgrid; }" };
export class CssSubgrid extends CssFeatureElement { static feature=feature; }
customElements.define("css-subgrid", CssSubgrid);
