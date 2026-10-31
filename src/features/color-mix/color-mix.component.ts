import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./color-mix.component.html" with { type: "text" };
import styles from "./color-mix.component.css" with { type: "text" };
const feature: CssFeature = { id:"color-mix", title:"color-mix() + OKLCH", group:"Stabilne", description:"Mieszanie kolorów i przestrzeń OKLCH dla kontrolowanej jasności i chromy.", detect:()=>false, supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Koszt zwykle marginalny wobec layoutu i malowania.", code:styles };
@Component({ selector: "css-color-mix", template, styles, feature })
@Supports(() => CSS.supports('color','color-mix(in oklab, red, blue)') && CSS.supports('color','oklch(60% 0.2 30)'), feature)
export class CssColorMix extends CssFeatureElement { static feature=feature; }
