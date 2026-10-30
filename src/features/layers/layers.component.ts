import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"layers", title:"@layer", group:"Stabilne", description:"Warstwy kaskady jawnie ustalają priorytet grup reguł.", detect:()=>CSS.supports('color','revert-layer'), supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Głównie kontrola kaskady, nie bezpośrednia optymalizacja.", code:"@layer reset, components, overrides; @layer components { .button { color: rebeccapurple; } }" };
export class CssLayers extends CssFeatureElement { static feature=feature; }
customElements.define("css-layers", CssLayers);
