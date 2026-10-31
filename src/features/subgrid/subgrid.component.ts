import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./subgrid.component.html" with { type: "text" };
import styles from "./subgrid.component.css" with { type: "text" };
const feature: CssFeature = { id:"subgrid", title:"subgrid", group:"Stabilne", description:"Zagnieżdżona siatka współdzieli tory rodzica dla wyrównania kolumn i wierszy.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Ułatwia układ bez wrapperów; koszt zależy od złożoności całej siatki.", code:styles };
@Component({ selector: "css-subgrid", template, styles, feature })
@Supports(() => CSS.supports('grid-template-columns','subgrid'), feature)
export class CssSubgrid extends CssFeatureElement { static feature=feature; }
