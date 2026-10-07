import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const test = process.argv[2];
const root = process.env.BUN_PROBE_ROOT;
assert(root, 'Brak BUN_PROBE_ROOT');
function binSafety(parentSymlink) {
  const dir = join(root, parentSymlink ? 'parent-symlink' : 'final-symlink');
  const packageDir = join(dir, 'packages/tool');
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(join(dir, 'outside'));
  fs.writeFileSync(join(dir, 'package.json'), JSON.stringify({ workspaces: ['packages/*'] }));
  fs.writeFileSync(join(dir, 'bunfig.toml'), '[install]\nlinker = "hoisted"\n');
  fs.writeFileSync(join(packageDir, 'package.json'), JSON.stringify({
    name: 'termux-tool', version: '1.0.0',
    bin: { 'termux-tool': parentSymlink ? 'linked/victim.js' : 'payload' },
  }));
  const victim = join(dir, 'outside/victim.js');
  fs.writeFileSync(victim, 'do not make me executable');
  fs.chmodSync(victim, 0o600);
  fs.symlinkSync(parentSymlink ? join(dir, 'outside') : victim,
    join(packageDir, parentSymlink ? 'linked' : 'payload'));
  const child = Bun.spawnSync([process.execPath, 'install', '--ignore-scripts'], {
    cwd: dir, env: { ...process.env, BUN_INSTALL_CACHE_DIR: join(dir, 'cache') }, timeout: 15000,
  });
  assert.equal(child.exitCode, 0, child.stderr.toString());
  assert.equal(fs.statSync(victim).mode & 0o777, 0o600, 'Zmieniono uprawnienia pliku poza pakietem');
  assert.equal(fs.existsSync(join(dir, 'node_modules/.bin/termux-tool')), !parentSymlink);
}
const check = {
  info() {
    console.log(JSON.stringify({ bun: Bun.version, revision: Bun.revision,
      platform: process.platform, arch: process.arch, execPath: process.execPath,
      tmpdir: os.tmpdir(), opener: Bun.which('termux-open-url') ?? Bun.which('xdg-open') }, null, 2));
  },
  tmpdir() {
    const dir = fs.mkdtempSync(join(os.tmpdir(), 'bun-probe-'));
    fs.rmdirSync(dir);
  },
  network() {
    const names = Object.keys(os.networkInterfaces());
    console.log(JSON.stringify(names));
    if (!names.length) console.log('UWAGA: brak listy interfejsów; to nie oznacza braku sieci.');
  },
  shell() {
    const child = spawnSync('printf shell-ok', { shell: true, encoding: 'utf8', timeout: 5000 });
    assert.ifError(child.error);
    assert.equal(child.status, 0, child.stderr);
    assert.equal(child.stdout, 'shell-ok');
  },
  spawn() {
    const child = Bun.spawnSync(['sh', '-c', 'printf spawn-ok'], { timeout: 5000 });
    assert.equal(child.exitCode, 0, child.stderr.toString());
    assert.equal(child.stdout.toString(), 'spawn-ok');
  },
  async http() {
    const server = Bun.serve({ hostname: '127.0.0.1', port: 0,
      fetch() { return new Response('http-ok'); } });
    try {
      const response = await fetch(`http://127.0.0.1:${server.port}`, { signal: AbortSignal.timeout(5000) });
      assert.equal(await response.text(), 'http-ok');
    } finally { await server.stop(true); }
  },
  async watch() {
    const path = join(root, 'watched.txt');
    fs.writeFileSync(path, 'before');
    let watcher, timer;
    try {
      await new Promise((resolve, reject) => {
        watcher = fs.watch(path, resolve);
        watcher.on('error', reject);
        timer = setTimeout(() => reject(new Error('Brak zdarzenia fs.watch w 5 s')), 5000);
        fs.writeFileSync(path, 'after');
      });
    } finally { clearTimeout(timer); watcher?.close(); }
  },
  forcedNode() {
    assert.equal(typeof process.versions.bun, 'string', '--bun uruchomiło zwykły Node');
    assert.equal(process.execPath, process.env.BUN_PROBE_EXE, 'Uruchomiono inną binarkę Bun');
    console.log('forced-node-ok');
  },
  installResult() {
    const link = 'node_modules/.bin/probe-bin';
    const target = 'node_modules/bun-termux-probe-bin/bin/cli.js';
    assert(fs.lstatSync(link).isSymbolicLink(), 'Brak dowiązania .bin');
    assert.equal(fs.realpathSync(link), fs.realpathSync(target), 'Błędny cel .bin');
    assert(fs.statSync(target).mode & 0o100, 'Cel bin nie jest wykonywalny');
  },
  symlinkFinal() { binSafety(false); },
  symlinkParent() { binSafety(true); },
};
assert.equal(typeof check[test], 'function', `Nieznany test: ${test}`);
await check[test]();
console.log(`PASS: ${test}`);
