import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"reading-flow", title:"reading-flow", group:"Eksperymentalne", description:"Dopasowuje kolejność nawigacji i odczytu do wizualnego układu Grid/Flex.", detect:()=>CSS.supports('reading-flow','grid-rows'), supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"To głównie dostępność i kolejność odczytu, nie optymalizacja szybkości.", code:".cards { display:grid; reading-flow:grid-rows; }" };
export class CssReadingFlow extends CssFeatureElement { static feature=feature; }
customElements.define("css-reading-flow", CssReadingFlow);
