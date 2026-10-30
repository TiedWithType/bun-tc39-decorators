import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"scope", title:"@scope", group:"Stabilne", description:"Ogranicza zasięg selektorów do poddrzewa DOM.", detect:()=>CSS.supports('selector(:scope)'), supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Pomaga kontrolować zakres stylów; :scope nie potwierdza samo w sobie pełnej obsługi @scope.", code:"@scope (.card) to (.card__footer) { a { color: oklch(65% 0.2 300); } }" };
export class CssScope extends CssFeatureElement { static feature=feature; }
customElements.define("css-scope", CssScope);
