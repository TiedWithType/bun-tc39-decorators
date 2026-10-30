import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
const feature: CssFeature = { id:"corner-shape", title:"corner-shape", group:"Eksperymentalne", description:"Kontroluje geometrię narożników, np. squircle lub bevel.", detect:()=>CSS.supports('corner-shape','squircle'), supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Koszt zależy od implementacji malowania i kształtu; mierz na urządzeniu docelowym.", code:".tile { border-radius:28px; corner-shape:squircle; }" };
export class CssCornerShape extends CssFeatureElement { static feature=feature; }
customElements.define("css-corner-shape", CssCornerShape);
