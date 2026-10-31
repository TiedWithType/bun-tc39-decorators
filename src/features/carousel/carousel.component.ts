import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./carousel.component.html" with { type: "text" };
import styles from "./carousel.component.css" with { type: "text" };
const feature: CssFeature = { id:"carousel", title:"CSS Carousels", group:"Eksperymentalne", description:"Nowe natywne mechanizmy karuzeli i markerów przewijania CSS.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Natywne przewijanie może ograniczyć JS; obrazy i liczba elementów nadal wpływają na płynność.", code:styles };
@Component({ selector: "css-carousel", template, styles })
@Supports(() => CSS.supports('scroll-marker-group','after'))
export class CssCarousel extends CssFeatureElement { static feature=feature; }
