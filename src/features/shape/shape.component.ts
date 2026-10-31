import { CssFeatureElement, type CssFeature } from "@core/css-feature-element";
import { Component, Supports } from "@core/decorators";
import template from "./shape.component.html" with { type: "text" };
import styles from "./shape.component.css" with { type: "text" };
const feature: CssFeature = { id:"shape", title:"shape() dla clip-path", group:"Nowe", description:"Opisuje responsywny kształt przez shape() używany w clip-path.", detect:()=>false, supportNote:"Test składni jest orientacyjny; nowe funkcje mogą być wdrażane częściowo albo wymagać flag. Sprawdź docelową przeglądarkę.", performance:"Złożone clipping paths mogą zwiększać koszt malowania; sprawdź animacje i liczbę elementów.", code:styles };
@Component({ selector: "css-shape", template, styles, feature })
@Supports(() => CSS.supports('clip-path','shape(from 0 0, line to 100% 0, line to 100% 100%, close)'), feature)
export class CssShape extends CssFeatureElement { static feature=feature; }
