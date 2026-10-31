import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./scroll-animations.component.html" with { type: "text" };
import styles from "./scroll-animations.component.css" with { type: "text" };
const feature: CssFeature = { id:"scroll-animations", title:"Scroll-driven Animations", group:"Zaawansowane", description:"Powiązuje animację z postępem przewijania lub widocznością elementu.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Transform i opacity zwykle są tańsze niż zmiany layoutu; sprawdź compositing.", code:styles };
@Component({ selector: "css-scroll-animations", template, styles, feature })
@Supports(() => CSS.supports('animation-timeline','scroll()') && CSS.supports('animation-timeline','view()'), feature)
export class CssScrollAnimations extends CssFeatureElement { static feature=feature; }
