for dir in @livepeer/*; do
  if [[ $dir == '@livepeer/explorer' ]]; then continue; fi
  if [[ $dir == '@livepeer/player' ]]; then continue; fi
  echo "🛠 Building project -> ${dir}"
  echo '------------------'
  pushd $dir
  yarn build
  popd
  echo '\n'
done