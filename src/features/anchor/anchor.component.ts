import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = {
 id:"anchor", title:"Anchor Positioning", group:"Zaawansowane",
 description:"Pozycjonuj tooltipy i menu względem kotwicy bez ręcznego mierzenia współrzędnych w JavaScript.",
 detect:()=>CSS.supports("anchor-name","--target") && CSS.supports("position-anchor","--target") && CSS.supports("position-area","bottom"),
 supportNote:"Sprawdzane są trzy deklaracje CSS Anchor Positioning. Wsparcie zależy od wersji przeglądarki; użyj panelu poniżej, aby sprawdzić zachowanie w praktyce.",
 performance:"Może ograniczyć JS obliczający pozycje. Nadal sprawdzaj layout przy zmianie rozmiaru, przewijaniu i wielu kotwicach.",
 code:`.anchor { anchor-name: --target; }\n.tooltip {\n  position: absolute;\n  position-anchor: --target;\n  position-area: bottom;\n  margin-block-start: .5rem;\n  position-try-fallbacks: flip-block;\n}`
};
export class CssAnchor extends CssFeatureElement { static feature=feature; }
customElements.define("css-anchor", CssAnchor);