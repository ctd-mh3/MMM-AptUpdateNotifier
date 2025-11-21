#!/usr/bin/env bash
set -euo pipefail

# Quiet update (do as root)
if ! sudo apt-get update -qq 2>/dev/null; then
  # If update fails still continue to try to count, but log to stderr
  echo "DEBUG: apt-get update failed (continuing)" >&2
fi

# Option A: use apt-get simulation and count 'Inst' lines (robust)
count=$(sudo apt-get -s upgrade 2>/dev/null | awk '/^Inst /{c++}END{print c+0}')

# Option B: alternatively use apt list --upgradable (filter header)
# count=$(sudo apt list --upgradable 2>/dev/null | sed '1d' | grep -c . || true)

# Output only the number to stdout
printf '%s\n' "$count"
