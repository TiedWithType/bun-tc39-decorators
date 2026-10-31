import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./reading-flow.component.html" with { type: "text" };
import styles from "./reading-flow.component.css" with { type: "text" };
const feature: CssFeature = { id:"reading-flow", title:"reading-flow", group:"Eksperymentalne", description:"Dopasowuje kolejność nawigacji i odczytu do wizualnego układu Grid/Flex.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"To głównie dostępność i kolejność odczytu, nie optymalizacja szybkości.", code:styles };
@Component({ selector: "css-reading-flow", template, styles })
@Supports(() => CSS.supports('reading-flow','grid-rows'))
export class CssReadingFlow extends CssFeatureElement { static feature=feature; }
