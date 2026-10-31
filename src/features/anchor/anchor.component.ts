import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./anchor.component.html" with { type: "text" };
import styles from "./anchor.component.css" with { type: "text" };
const feature: CssFeature = {
 id:"anchor", title:"Anchor Positioning", group:"Zaawansowane",
 description:"Pozycjonuj tooltipy i menu względem kotwicy bez ręcznego mierzenia współrzędnych w JavaScript.",
 detect:()=>false, supportNote:"Sprawdzane są trzy deklaracje CSS Anchor Positioning. Wsparcie zależy od wersji przeglądarki; użyj panelu poniżej, aby sprawdzić zachowanie w praktyce.",
 performance:"Może ograniczyć JS obliczający pozycje. Nadal sprawdzaj layout przy zmianie rozmiaru, przewijaniu i wielu kotwicach.", code:styles };
@Component({ selector: "css-anchor", template, styles, feature })
@Supports(() => CSS.supports("anchor-name","--target") && CSS.supports("position-anchor","--target") && CSS.supports("position-area","bottom"), feature)
export class CssAnchor extends CssFeatureElement { static feature=feature; }
