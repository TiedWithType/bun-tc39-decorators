import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./sibling-index.component.html" with { type: "text" };
import styles from "./sibling-index.component.css" with { type: "text" };
const feature: CssFeature = { id:"sibling-index", title:"sibling-index() / sibling-count()", group:"Nowe", description:"Używa indeksu i liczby elementów rodzeństwa w obliczeniach CSS.", detect:()=>false, supportNote:"Detekcja jest orientacyjna; obsługa składni nie oznacza pełnej zgodności. Sprawdź aktualną tabelę kompatybilności.", performance:"Może zastąpić generowanie stylów w JS; sprawdź duże drzewa i częste zmiany.", code:styles };
@Component({ selector: "css-sibling-index", template, styles })
@Supports(() => CSS.supports('width','calc(sibling-index() * 1px)') && CSS.supports('width','calc(sibling-count() * 1px)'))
export class CssSiblingIndex extends CssFeatureElement { static feature=feature; }
