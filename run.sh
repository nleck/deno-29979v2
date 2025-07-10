#!/bin/bash
set -e
BASE_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "${BASE_DIR}"
version="v2.3.6" # Works 
# version="v2.4.1" # Fails 

deno upgrade ${version}
echo -n "Starting... "
date

deno run \
  --v8-flags=--max-old-space-size=16384 \
  --allow-read --allow-write --allow-net \
  src/Learn.ts \
  --timeout=15 \
  --dir=./creatures \
  --verbose=true 

