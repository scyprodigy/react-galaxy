#!/bin/bash

# Stop on error
set -e

echo "📦 Building project..."

# Build your frontend (假設輸出在 dist/)
npm run build

echo "🚀 Deploying to GitHub Pages..."

# 部署 dist 資料夾到 gh-pages 分支
gh-pages -d dist

echo "✅ Deployment complete!"