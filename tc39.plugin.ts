import type { BunPlugin } from "bun";
import ts from "typescript";

// TypeScript emituje własne helpery TC39 przed transformacją HMR Bun.
// Dzięki temu frontend nie zależy od brakujących helperów w bun:wrap.
const tc39Plugin: BunPlugin = {
  name: "tc39-decorators",
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
      const source = await Bun.file(path).text();
      const result = ts.transpileModule(source, {
        fileName: path,
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          experimentalDecorators: false,
          emitDecoratorMetadata: false,
          useDefineForClassFields: true,
          importHelpers: false,
          noEmitHelpers: false,
          inlineSourceMap: true,
          inlineSources: true,
        },
      });
      const errors = result.diagnostics?.filter(
        (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
      );
      if (errors?.length) {
        throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
          getCanonicalFileName: (name) => name,
          getCurrentDirectory: () => process.cwd(),
          getNewLine: () => "\n",
        }));
      }
      return { contents: result.outputText, loader: "js" };
    });
  },
};

export default tc39Plugin;
