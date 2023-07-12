#!/bin/bash

rm -rf node_modules
rm -rf ./static
rm package-lock.json
git push origin :gh-pages
npm install
npm run deploy
cp -aR ./build/* ./
git add .
git commit -am "build"
git push -f origin master
