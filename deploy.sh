#!/bin/bash

rm -rf node_modules
rm packaga-lock.json
npm install
npm run deploy;
cp -aR ./build/* ./;
git add .;
git commit -am "build";
git push -f origin master;