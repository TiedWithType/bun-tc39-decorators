import type { CssFeature } from "@core/css-feature-element";

export interface ComponentOptions {
  selector: string;
  template: string;
  styles: string;
  feature: CssFeature;
}
export type SupportTest = string | (() => boolean);

export function Supports(test: SupportTest, feature: CssFeature) {
  return function (_value: Function, _context: ClassDecoratorContext) {
    feature.detect = typeof test === "string"
      ? () => CSS.supports(test)
      : test;
  };
}

export function Component(options: ComponentOptions) {
  return function <T extends abstract new (...args: any[]) => HTMLElement>(value: T, _context: ClassDecoratorContext<T>) {
    options.feature.template = options.template;
    options.feature.code = options.styles;
    if (!customElements.get(options.selector)) customElements.define(options.selector, value as CustomElementConstructor);
  };
}
