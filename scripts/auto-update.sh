#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/data/home/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH}"
export APP_DIR="/opt/data/home/proskillai"

cd "${APP_DIR}"

git fetch origin main

LOCAL_HASH="$(git rev-parse HEAD)"
REMOTE_HASH="$(git rev-parse origin/main)"

if [ "${LOCAL_HASH}" = "${REMOTE_HASH}" ]; then
  echo "Already up to date: ${LOCAL_HASH}"
  exit 0
fi

echo "Updating repository from ${LOCAL_HASH} to ${REMOTE_HASH}..."

git reset --hard origin/main

pnpm install
pnpm db:push
pnpm build

if pgrep -f "next start -p 3001" > /dev/null 2>&1; then
  pkill -f "next start -p 3001" || true
fi

if ! pgrep -f "daemon.sh" > /dev/null 2>&1; then
  nohup bash "${APP_DIR}/daemon.sh" > "${APP_DIR}/server.log" 2>&1 &
fi

CURRENT_HASH="$(git rev-parse HEAD)"
CURRENT_TIME="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "Update successfully completed to ${CURRENT_HASH} at ${CURRENT_TIME}"
