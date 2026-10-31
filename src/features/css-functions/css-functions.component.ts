import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./css-functions.component.html" with { type: "text" };
import styles from "./css-functions.component.css" with { type: "text" };
const feature: CssFeature = { id:"css-functions", title:"CSS Custom Functions: @function", group:"Eksperymentalne", description:"Funkcje CSS definiowane przez autora i wywoływane jako wartości.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Mogą ograniczyć duplikację i JS, ale nie zakładaj poprawy szybkości bez testu.", code:styles };
@Component({ selector: "css-css-functions", template, styles, feature })
@Supports(() => CSS.supports('width','--scale(2)'), feature)
export class CssCssFunctions extends CssFeatureElement { static feature=feature; }
