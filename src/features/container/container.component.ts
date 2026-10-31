import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./container.component.html" with { type: "text" };
import styles from "./container.component.css" with { type: "text" };
const feature: CssFeature = { id:"container", title:"Container Queries", group:"Stabilne", description:"Stylowanie komponentu zależnie od rozmiaru kontenera.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Zmiana wymiarów kontenera może powodować ponowne przeliczenie układu.", code:styles };
@Component({ selector: "css-container", template, styles })
@Supports(() => CSS.supports('container-type','inline-size'))
export class CssContainer extends CssFeatureElement { static feature=feature; }
