import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";

const source = readFileSync(resolve(process.argv[2]), "utf8");
const start = source.indexOf('        case "o\\n":');
const end = source.indexOf('        case "h\\n":', start);
assert(start >= 0 && end > start, "Cannot locate the actual browser shortcut");
const shortcut = source.slice(start, end);
const url = "http://localhost:3000/?q=a%20b&literal=$(echo-test)";

async function run({ platform = "android", tools = {}, exitCode = 0, failure } = {}) {
  const calls = [];
  const warnings = [];
  const tasks = [];
  const context = {
    process: { platform },
    server: { url: { toString: () => url } },
    console: { error: text => warnings.push(text) },
    Bun: {
      which: name => tools[name] ?? null,
      spawn: argv => {
        calls.push(Array.from(argv));
        if (failure === "spawn") throw new Error("ENOENT");
        const exited = failure === "wait" ? Promise.reject(new Error("wait failed")) : Promise.resolve(argv[0] === "/system/bin/am" ? 1 : exitCode);
        tasks.push(exited.catch(() => {}));
        return { exited };
      },
    },
  };
  vm.runInNewContext(`switch ("o\\n") { ${shortcut} }`, context);
  await Promise.all(tasks);
  await Promise.resolve();
  return { calls, warnings };
}

const cases = [
  ["Termux opener and literal URL argument", async () => {
    const result = await run({ tools: { "termux-open-url": "/termux/bin/termux-open-url", "xdg-open": "/termux/bin/xdg-open" } });
    assert.deepEqual(result, { calls: [["/termux/bin/termux-open-url", url]], warnings: [] });
  }],
  ["xdg-open fallback", async () => {
    const result = await run({ tools: { "xdg-open": "/termux/bin/xdg-open" } });
    assert.deepEqual(result, { calls: [["/termux/bin/xdg-open", url]], warnings: [] });
  }],
  ["missing helpers preserve server", async () => {
    const result = await run();
    assert.deepEqual(result.calls, []);
    assert.deepEqual(result.warnings, [`Could not find termux-open-url or xdg-open. Open ${url} in your browser.`]);
  }],
  ...["spawn", "wait"].map(failure => [`${failure} failure preserves server`, async () => {
    const result = await run({ tools: { "termux-open-url": "/termux/bin/termux-open-url" }, failure });
    assert.deepEqual(result.calls, [["/termux/bin/termux-open-url", url]]);
    assert.deepEqual(result.warnings, [`Could not open the browser. Open ${url} in your browser.`]);
  }]),
  ["nonzero child exit is reported", async () => {
    const result = await run({ tools: { "termux-open-url": "/termux/bin/termux-open-url" }, exitCode: 1 });
    assert.deepEqual(result.warnings, [`Could not open the browser (exit code 1). Open ${url} in your browser.`]);
  }],
  ...[["linux", "xdg-open"], ["darwin", "open"], ["win32", "start"]].map(([platform, opener]) => [platform, async () => {
    assert.deepEqual(await run({ platform }), { calls: [[opener, url]], warnings: [] });
  }]),
];

let failures = 0;
for (const [name, check] of cases) {
  try {
    await check();
    console.log(`PASS: ${name}`);
  } catch (error) {
    failures++;
    console.log(`FAIL: ${name}: ${error.message}`);
  }
}
console.log(`${cases.length - failures}/${cases.length} source-level checks passed; no Android device was used.`);
process.exitCode = failures ? 1 : 0;
