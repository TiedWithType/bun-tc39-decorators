import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"has", title:":has()", group:"Stabilne", description:"Selektor rodzica zależny od potomka; przydatny do stanów formularzy bez JS.", detect:()=>CSS.supports('selector(:has(*))'), supportNote:"Wykrycie akceptacji składni nie gwarantuje pełnej implementacji. Sprawdź tabelę kompatybilności docelowej przeglądarki.", performance:"Wąskie selektory zwykle łatwiejsze do optymalizacji; mierz przy częstych zmianach DOM.", code:".card:has(input:checked) { border-color: oklch(70% 0.18 145); background: color-mix(in oklab, white 92%, green); }" };
export class CssHas extends CssFeatureElement { static feature=feature; }
customElements.define("css-has", CssHas);
