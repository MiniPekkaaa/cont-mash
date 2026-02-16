#!/bin/sh
set -e

echo "🔄 Applying database schema..."
npx prisma@6.19.2 db push --skip-generate

echo "🌱 Seeding database..."
npx tsx prisma/seed.ts || echo "⚠️ Seed skipped (may already exist)"

echo "🚀 Starting application..."
exec node server.js
