#!/bin/sh
# Offline tests. Each Bun invocation is isolated so SIGSYS does not stop the suite.
set -u
ulimit -c 0 2>/dev/null || :
probe_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 2
bun_bin=$(command -v "${1:-bun}") || exit 2
case "$bun_bin" in
  /*) ;;
  *) bun_bin="$(cd "$(dirname "$bun_bin")" && pwd)/$(basename "$bun_bin")" ;;
esac
# Resolve a possible bun-tc39 symlink for the --bun identity assertion.
bun_bin=$(readlink -f "$bun_bin") || exit 2
scratch_base=${TMPDIR:-${PREFIX:+$PREFIX/tmp}}
if [ -z "$scratch_base" ] || [ ! -d "$scratch_base" ]; then
  scratch_base=${HOME:-/tmp}
fi
fixture=$(mktemp -d "$scratch_base/bun-runtime-check.XXXXXX") || exit 2
trap 'rm -rf -- "$fixture"' EXIT
export BUN_PROBE_ROOT="$fixture" BUN_PROBE_EXE="$bun_bin"
failures=0
run() {
  label=$1
  shift
  printf '\n=== %s ===\n' "$label"
  "$@"
  status=$?
  printf 'EXIT: %s\n' "$status"
  if [ "$status" -ne 0 ]; then failures=$((failures + 1)); fi
}
for test in info tmpdir network shell spawn http watch; do
  run "$test" "$bun_bin" "$probe_dir/termux-runtime-probe.mjs" "$test"
done

# Do not pin `node`/`bun` here: test Bun's actual --bun substitution.
mkdir "$fixture/forced" || exit 2
cp "$probe_dir/termux-runtime-probe.mjs" "$fixture/forced/probe.mjs" || exit 2
printf '%s\n' '{"scripts":{"probe":"node probe.mjs forcedNode"}}' > "$fixture/forced/package.json"
cd "$fixture/forced" || exit 2
run 'bun run --bun: wymuszenie właściwego runtime' "$bun_bin" run --bun probe

# A local tarball with bin/cli.js triggers bin validation and chmod, without registry access.
mkdir -p "$fixture/package/bin" || exit 2
printf '%s\n' '{"name":"bun-termux-probe-bin","version":"1.0.0","bin":{"probe-bin":"bin/cli.js"}}' > "$fixture/package/package.json"
printf '%s\n' '#!/usr/bin/env node' 'console.log("local-bin-ok")' > "$fixture/package/bin/cli.js"
tar -czf "$fixture/probe.tgz" -C "$fixture" package || exit 2
for backend in default copyfile; do
  mkdir "$fixture/install-$backend" || exit 2
  cd "$fixture/install-$backend" || exit 2
  printf '%s\n' '{"dependencies":{"bun-termux-probe-bin":"file:../probe.tgz"}}' > package.json
  export BUN_INSTALL_CACHE_DIR="$fixture/cache-$backend"
  if [ "$backend" = default ]; then
    run "lokalny bun install: $backend" "$bun_bin" install --ignore-scripts
  else
    run "lokalny bun install: $backend" "$bun_bin" install --ignore-scripts --backend=copyfile
  fi
  if [ "$status" -eq 0 ]; then
    run "kontrola .bin: $backend" "$bun_bin" "$probe_dir/termux-runtime-probe.mjs" installResult
  fi
done
for test in symlinkFinal symlinkParent; do
  run "$test" "$bun_bin" "$probe_dir/termux-runtime-probe.mjs" "$test"
done
printf '\nZakończono. Nieudane testy: %s. EXIT 159 zwykle oznacza SIGSYS.\n' "$failures"
[ "$failures" -eq 0 ]
