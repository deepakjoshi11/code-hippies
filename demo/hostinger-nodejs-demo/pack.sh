#!/usr/bin/env bash
# Builds hostinger-nodejs-demo.zip with app.js/package.json at the archive root,
# which is what hPanel's File Manager "Extract" expects.
set -euo pipefail
cd "$(dirname "$0")"
rm -f hostinger-nodejs-demo.zip
zip -rq hostinger-nodejs-demo.zip app.js package.json README.md public -x '*.DS_Store'
echo "built $(pwd)/hostinger-nodejs-demo.zip"
