#!/bin/sh
# Use an owned fixture; a Linux override checks this script, not the Android bug.
set -eu

storage=${BUN_SHARED_STORAGE:-/storage/emulated/0}
bun_bin=$(command -v "${1:-bun}") || {
  printf '%s\n' 'Nie znaleziono binarki Bun.' >&2
  exit 2
}
case "$bun_bin" in
  /*) ;;
  *) bun_bin="$(cd "$(dirname "$bun_bin")" && pwd)/$(basename "$bun_bin")" ;;
esac
if [ ! -d "$storage" ]; then
  printf 'Brak dostępu do katalogu: %s\n' "$storage" >&2
  exit 2
fi
fixture=$(mktemp -d "$storage/bun-cwd-check.XXXXXX")
trap 'rm -rf -- "$fixture"' EXIT
cd "$fixture"
printf '%s\n' '{"scripts":{"check":"bun index.ts"}}' > package.json
printf '%s\n' 'console.log("shared-storage-ok")' > index.ts
printf '%s\n' '1/3: bezpośrednie uruchomienie'
"$bun_bin" index.ts
printf '%s\n' '2/3: bun run check'
"$bun_bin" run check
printf '%s\n' '3/3: bun check'
"$bun_bin" check
printf '%s\n' 'OK: wszystkie trzy polecenia zakończyły się sukcesem.'
