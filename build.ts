import tc39Plugin from "./tc39.plugin";

const result = await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  target: "browser",
  minify: true,
  plugins: [tc39Plugin],
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}
console.log("Build gotowy: dist/");
