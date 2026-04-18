#!/usr/bin/env bash
set -e

PATTERNS=(
  'sk-[A-Za-z0-9]{32,}'
  'AIza[0-9A-Za-z_-]{35}'
  'api_key[[:space:]]*=[[:space:]]*"[^"]{20,}"'
  'IMG_PILOT_KEY=[^[:space:]]{20,}'
  'RUNWAY_API_KEY=[^[:space:]]{20,}'
  'KLING_[A-Z_]+=[^[:space:]]{20,}'
)

DIFF=$(git diff --cached -U0)
for p in "${PATTERNS[@]}"; do
  if echo "$DIFF" | grep -E -q "$p"; then
    echo "Halftone pre-commit: detected API key pattern matching /$p/" >&2
    exit 1
  fi
done
