import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./starting-style.component.html" with { type: "text" };
import styles from "./starting-style.component.css" with { type: "text" };
const feature: CssFeature = { id:"starting-style", title:"@starting-style", group:"Zaawansowane", description:"Definiuje styl początkowy elementu pojawiającego się w DOM lub po display:none.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Ogranicza potrzebę klas startowych w JS; test wykrywa tylko powiązaną deklarację.", code:styles };
@Component({ selector: "css-starting-style", template, styles })
@Supports(() => CSS.supports('transition-behavior','allow-discrete'))
export class CssStartingStyle extends CssFeatureElement { static feature=feature; }
