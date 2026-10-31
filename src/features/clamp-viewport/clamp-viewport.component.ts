import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./clamp-viewport.component.html" with { type: "text" };
import styles from "./clamp-viewport.component.css" with { type: "text" };
const feature: CssFeature = { id:"clamp-viewport", title:"clamp() + dvh/svh/lvh", group:"Stabilne", description:"Płynna skala wymiarów i jednostki viewportu przydatne na urządzeniach mobilnych.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Częste zmiany viewportu mogą wywołać layout; same funkcje są zwykle tanie.", code:styles };
@Component({ selector: "css-clamp-viewport", template, styles })
@Supports(() => CSS.supports('height','100dvh') && CSS.supports('font-size','clamp(1rem, 2vw, 2rem)'))
export class CssClampViewport extends CssFeatureElement { static feature=feature; }
