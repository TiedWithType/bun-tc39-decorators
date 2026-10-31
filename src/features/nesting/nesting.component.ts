import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./nesting.component.html" with { type: "text" };
import styles from "./nesting.component.css" with { type: "text" };
const feature: CssFeature = { id:"nesting", title:"CSS Nesting", group:"Stabilne", description:"Natywne zagnieżdżanie reguł CSS bez preprocesora.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Zagnieżdżenie poprawia organizację, ale nie gwarantuje szybszego renderowania.", code:styles };
@Component({ selector: "css-nesting", template, styles, feature })
@Supports(() => CSS.supports('selector(&)'), feature)
export class CssNesting extends CssFeatureElement { static feature=feature; }
