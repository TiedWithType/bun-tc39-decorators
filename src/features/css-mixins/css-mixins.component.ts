import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./css-mixins.component.html" with { type: "text" };
import styles from "./css-mixins.component.css" with { type: "text" };
const feature: CssFeature = { id:"css-mixins", title:"CSS Mixins: @mixin / @apply", group:"Eksperymentalne", description:"Proponowana składnia wielokrotnego użycia bloków deklaracji CSS z parametrami.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Brak natywnego wsparcia w przeglądarkach według aktualnej dokumentacji; preprocesor to inny przypadek.", code:styles };
@Component({ selector: "css-css-mixins", template, styles, feature })
@Supports(() => false, feature)
export class CssCssMixins extends CssFeatureElement { static feature=feature; }
