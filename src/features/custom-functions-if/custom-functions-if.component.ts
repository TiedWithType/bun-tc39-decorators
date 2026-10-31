import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./custom-functions-if.component.html" with { type: "text" };
import styles from "./custom-functions-if.component.css" with { type: "text" };
const feature: CssFeature = { id:"custom-functions-if", title:"Nowe funkcje wartości CSS: if() / round()", group:"Nowe", description:"Funkcje matematyczne i warunkowe wartości CSS ułatwiają obliczenia bez JS.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Obliczenia wartości są zwykle tanie; unikaj wymuszania layoutu w pętli pomiarowej.", code:styles };
@Component({ selector: "css-custom-functions-if", template, styles })
@Supports(() => CSS.supports('width','calc(round(1.2, 1) * 1px)'))
export class CssCustomFunctionsIf extends CssFeatureElement { static feature=feature; }
