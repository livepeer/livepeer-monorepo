dirs=(
  $(find ./@livepeer -maxdepth 1 -type d | xargs -0)
)

for dir in "${dirs[@]:1}"; do
  if [[ "${dir:2}" == '@livepeer/explorer' ]]; then continue; fi
  if [[ "${dir:2}" == '@livepeer/player' ]]; then continue; fi
  echo "🛠 Building project -> ${dir:2}"
  echo '------------------'
  pushd $dir
  yarn build
  popd
  echo '\n'
done
