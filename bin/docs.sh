#!/bin/bash

cp README.md docs/README.md
for dir in @livepeer/*; do
  echo "🛠 Copy docs from package -> ${dir}"
  echo '----------------------'
  cd $dir
  yarn copy-docs
  cd ../../
  echo
done