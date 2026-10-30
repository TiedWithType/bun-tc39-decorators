import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"property", title:"@property", group:"Stabilne", description:"Rejestruje typowane custom properties i wartości początkowe.", detect:()=>'registerProperty' in CSS, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Animacja typowanej wartości może być płynna, ale właściwości layoutowe nadal mogą być kosztowne.", code:"@property --progress { syntax:'<percentage>'; inherits:false; initial-value:0%; } .bar { width:var(--progress); }" };
export class CssProperty extends CssFeatureElement { static feature=feature; }
customElements.define("css-property", CssProperty);
