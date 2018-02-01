#!/bin/bash

for dir in @livepeer/*; do
  if [ $dir = '@livepeer/explorer' ]; then continue; fi
  if [ $dir = '@livepeer/player' ]; then continue; fi
  echo "🛠 Building package -> ${dir}"
  echo '------------------'
  cd $dir
  yarn build
  cd ../../
  echo
done