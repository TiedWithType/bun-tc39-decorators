import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./view-transitions.component.html" with { type: "text" };
import styles from "./view-transitions.component.css" with { type: "text" };
const feature: CssFeature = { id:"view-transitions", title:"View Transitions", group:"Zaawansowane", description:"Animuje przejście między stanami widoku przez API i pseudo-elementy CSS.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Koszt zależy od liczby przechwyconych elementów i powierzchni animacji.", code:styles };
@Component({ selector: "css-view-transitions", template, styles })
@Supports(() => 'startViewTransition' in document && CSS.supports('view-transition-name','demo'))
export class CssViewTransitions extends CssFeatureElement { static feature=feature; }
