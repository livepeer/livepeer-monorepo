dirs=(
  $(find ./@livepeer -maxdepth 1 -type d | xargs -0)
)

for dir in "${dirs[@]:1}"; do
  echo "🛠 Building project -> ${dir:2}"
  echo '------------------'
  pushd $dir
  yarn build
  popd
  echo '\n'
done
