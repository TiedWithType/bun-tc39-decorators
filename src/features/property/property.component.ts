import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./property.component.html" with { type: "text" };
import styles from "./property.component.css" with { type: "text" };
const feature: CssFeature = { id:"property", title:"@property", group:"Stabilne", description:"Rejestruje typowane custom properties i wartości początkowe.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Animacja typowanej wartości może być płynna, ale właściwości layoutowe nadal mogą być kosztowne.", code:styles };
@Component({ selector: "css-property", template, styles })
@Supports(() => 'registerProperty' in CSS)
export class CssProperty extends CssFeatureElement { static feature=feature; }
