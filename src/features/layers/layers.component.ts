import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./layers.component.html" with { type: "text" };
import styles from "./layers.component.css" with { type: "text" };
const feature: CssFeature = { id:"layers", title:"@layer", group:"Stabilne", description:"Warstwy kaskady jawnie ustalają priorytet grup reguł.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Głównie kontrola kaskady, nie bezpośrednia optymalizacja.", code:styles };
@Component({ selector: "css-layers", template, styles, feature })
@Supports(() => CSS.supports('color','revert-layer'), feature)
export class CssLayers extends CssFeatureElement { static feature=feature; }
