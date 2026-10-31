import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./scope.component.html" with { type: "text" };
import styles from "./scope.component.css" with { type: "text" };
const feature: CssFeature = { id:"scope", title:"@scope", group:"Stabilne", description:"Ogranicza zasięg selektorów do poddrzewa DOM.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Pomaga kontrolować zakres stylów; :scope nie potwierdza samo w sobie pełnej obsługi @scope.", code:styles };
@Component({ selector: "css-scope", template, styles })
@Supports(() => CSS.supports('selector(:scope)'))
export class CssScope extends CssFeatureElement { static feature=feature; }
