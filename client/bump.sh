#!/bin/bash

npm version patch
current=$(npm -v)
git add .
git commit -m "Bump version to ${current}"