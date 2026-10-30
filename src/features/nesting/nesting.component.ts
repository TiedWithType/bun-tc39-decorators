import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"nesting", title:"CSS Nesting", group:"Stabilne", description:"Natywne zagnieżdżanie reguł CSS bez preprocesora.", detect:()=>CSS.supports('selector(&)'), supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Zagnieżdżenie poprawia organizację, ale nie gwarantuje szybszego renderowania.", code:".button { color:white; &:hover { background: rebeccapurple; } }" };
export class CssNesting extends CssFeatureElement { static feature=feature; }
customElements.define("css-nesting", CssNesting);
