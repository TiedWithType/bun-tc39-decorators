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
private_bin=''
trap 'rm -rf -- "$fixture" "$private_bin"' EXIT
private_bin=$(mktemp -d "${TMPDIR:-${HOME:-/tmp}}/bun-cwd-bin.XXXXXX")
# Shared storage cannot host executable symlinks. Pin nested `bun` in a private dir.
ln -s "$bun_bin" "$private_bin/bun"
PATH="$private_bin:$PATH"
export PATH
cd "$fixture"
printf '%s\n' '{"scripts":{"check":"bun index.ts"}}' > package.json
printf '%s\n' 'console.log("shared-storage-ok")' > index.ts
printf '%s\n' '1/3: bezpośrednie uruchomienie'
output=$("$bun_bin" index.ts)
[ "$output" = shared-storage-ok ]
printf '%s\n' "$output"
printf '%s\n' '2/3: bun run check'
output=$("$bun_bin" run check)
[ "$output" = shared-storage-ok ]
printf '%s\n' "$output"
printf '%s\n' '3/3: bun check'
output=$("$bun_bin" check)
[ "$output" = shared-storage-ok ]
printf '%s\n' "$output"
printf '%s\n' 'OK: wszystkie trzy polecenia zakończyły się sukcesem.'
