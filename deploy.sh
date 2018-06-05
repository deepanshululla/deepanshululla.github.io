#!/bin/bash

npm run deploy;
cp -aR ./build/* ./;
git add .;
git commit -am "build";
git push origin master;


