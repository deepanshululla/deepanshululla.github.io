#!/bin/bash

sudo npm install
sudo npm run deploy;
cp -aR ./build/* ./;
git add .;
git commit -am "build";
git push -f origin master;


