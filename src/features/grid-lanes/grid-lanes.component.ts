import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./grid-lanes.component.html" with { type: "text" };
import styles from "./grid-lanes.component.css" with { type: "text" };
const feature: CssFeature = { id:"grid-lanes", title:"CSS Grid Lanes / Masonry", group:"Eksperymentalne", description:"Układ masonry, w którym element trafia do toru z dostępnym miejscem.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Porównaj z columns i biblioteką JS na tym samym zestawie elementów; obsługa ograniczona.", code:styles };
@Component({ selector: "css-grid-lanes", template, styles, feature })
@Supports(() => CSS.supports('display','grid-lanes'), feature)
export class CssGridLanes extends CssFeatureElement { static feature=feature; }
