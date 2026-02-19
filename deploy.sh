#!/bin/bash
set -e

echo "==> Cleaning previous build artifacts..."
rm -rf node_modules
rm -rf ./static
rm -f package-lock.json

echo "==> Deleting remote gh-pages branch (if exists)..."
git push origin :gh-pages 2>/dev/null || echo "    (gh-pages branch did not exist, skipping)"

echo "==> Installing dependencies..."
npm install --loglevel=warn

echo "==> Building and deploying to gh-pages..."
npm run deploy

echo "==> Copying build output to repo root..."
cp -aR ./build/* ./
touch .nojekyll

echo "==> Committing and pushing to master..."
git add .
git commit -am "build" || echo "    (nothing to commit)"
git push -f origin master

echo "==> Deploy complete!"
