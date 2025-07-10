#!/bin/bash
set -e
BASE_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "${BASE_DIR}"

echo -n "Starting... "
date

deno run \
  --v8-flags=--max-old-space-size=8192 \
  --allow-read --allow-write --allow-net \
  src/Learn.ts \
  --timeout=45 \
  --dir=./creatures \
  --verbose=true 

