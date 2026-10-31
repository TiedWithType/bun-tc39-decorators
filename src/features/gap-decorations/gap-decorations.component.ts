import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./gap-decorations.component.html" with { type: "text" };
import styles from "./gap-decorations.component.css" with { type: "text" };
const feature: CssFeature = { id:"gap-decorations", title:"CSS Gap Decorations", group:"Nowe", description:"Dekoruje przerwy Grid, Flexbox i multi-column bez dodatkowych elementów DOM.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Może ograniczyć pseudo-elementy i markup separatorów; porównaj liczbę węzłów i paint.", code:styles };
@Component({ selector: "css-gap-decorations", template, styles })
@Supports(() => CSS.supports('row-rule','1px solid currentColor') || CSS.supports('column-rule','1px solid currentColor'))
export class CssGapDecorations extends CssFeatureElement { static feature=feature; }
