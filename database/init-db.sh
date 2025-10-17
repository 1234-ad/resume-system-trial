#!/bin/sh
set -e

echo "Waiting for Postgres..."
until psql "$DATABASE_URL" -c '\q' >/dev/null 2>&1; do
  sleep 1
done

echo "Applying schema"
psql "$DATABASE_URL" -f /docker-entrypoint-initdb.d/schema.sql
