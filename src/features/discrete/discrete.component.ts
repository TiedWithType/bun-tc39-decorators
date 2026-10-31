import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./discrete.component.html" with { type: "text" };
import styles from "./discrete.component.css" with { type: "text" };
const feature: CssFeature = { id:"discrete", title:"transition-behavior: allow-discrete", group:"Zaawansowane", description:"Umożliwia przejścia wybranych właściwości dyskretnych, np. display.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Nie gwarantuje szybszego renderowania; umożliwia płynne zmiany stanów.", code:styles };
@Component({ selector: "css-discrete", template, styles })
@Supports(() => CSS.supports('transition-behavior','allow-discrete'))
export class CssDiscrete extends CssFeatureElement { static feature=feature; }
