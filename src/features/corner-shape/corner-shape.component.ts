import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./corner-shape.component.html" with { type: "text" };
import styles from "./corner-shape.component.css" with { type: "text" };
const feature: CssFeature = { id:"corner-shape", title:"corner-shape", group:"Eksperymentalne", description:"Kontroluje geometrię narożników, np. squircle lub bevel.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Koszt zależy od implementacji malowania i kształtu; mierz na urządzeniu docelowym.", code:styles };
@Component({ selector: "css-corner-shape", template, styles })
@Supports(() => CSS.supports('corner-shape','squircle'))
export class CssCornerShape extends CssFeatureElement { static feature=feature; }
