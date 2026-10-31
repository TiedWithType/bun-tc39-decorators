export type FeatureConstructor = typeof HTMLElement & { feature: import("@core/css-feature-element").CssFeature; template?: string; styles?: string };
export interface ComponentOptions { selector: string; template: string; styles: string }
export type SupportTest = string | (() => boolean);

export function Supports(test: SupportTest) {
  return function <T extends FeatureConstructor>(value: T, _context: ClassDecoratorContext<T>) {
    value.feature.detect = typeof test === "string"
      ? () => CSS.supports(test)
      : test;
  };
}

export function Component(options: ComponentOptions) {
  return function <T extends FeatureConstructor>(value: T, _context: ClassDecoratorContext<T>) {
    value.template = options.template;
    value.styles = options.styles;
    value.feature.template = options.template;
    value.feature.code = options.styles;
    if (!customElements.get(options.selector)) customElements.define(options.selector, value);
  };
}
