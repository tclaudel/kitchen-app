#!/bin/sh
set -eu

: "${OPENCODE_SERVER_PASSWORD:?OPENCODE_SERVER_PASSWORD must be set}"

opencode serve \
  --hostname "${OPENCODE_SERVER_HOSTNAME:-127.0.0.1}" \
  --port "${OPENCODE_SERVER_PORT:-4096}" \
  --print-logs \
  >/tmp/opencode.log 2>&1 &

exec node server.js
