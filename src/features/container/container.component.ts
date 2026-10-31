import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"container", title:"Container Queries", group:"Stabilne", description:"Stylowanie komponentu zależnie od rozmiaru kontenera.", detect:()=>CSS.supports('container-type','inline-size'), supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Zmiana wymiarów kontenera może powodować ponowne przeliczenie układu.", code:".panel { container-type:inline-size; } @container (width > 16rem) { .card { grid-template-columns:8rem 1fr; } }" };
export class CssContainer extends CssFeatureElement { static feature=feature; }
customElements.define("css-container", CssContainer);
