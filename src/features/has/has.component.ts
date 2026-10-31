import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./has.component.html" with { type: "text" };
import styles from "./has.component.css" with { type: "text" };
const feature: CssFeature = { id:"has", title:":has()", group:"Stabilne", description:"Selektor rodzica zależny od potomka; przydatny do stanów formularzy bez JS.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Wąskie selektory zwykle łatwiejsze do optymalizacji; mierz przy częstych zmianach DOM.", code:styles };
@Component({ selector: "css-has", template, styles, feature })
@Supports(() => CSS.supports('selector(:has(*))'), feature)
export class CssHas extends CssFeatureElement { static feature=feature; }
