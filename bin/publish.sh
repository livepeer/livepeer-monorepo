#!/usr/bin/env node

const { execSync } = require('child_process')
const edit = require('edit-json-file')
const cwd = process.cwd()
const packages = [
  // '@livepeer/apollo',
  '@livepeer/chroma',
  // '@livepeer/explorer',
  '@livepeer/graphql-sdk',
  '@livepeer/lpx',
  // '@livepeer/player',
  '@livepeer/sdk',
]

for (const dep of packages) {
  const { version: latest } = require(`${cwd}/${dep}/package.json`)
  for (const package of packages) {
    const file = edit(`${cwd}/${package}/package.json`, { autosave: true })
    const path = `dependencies.${dep}`
    const prev = file.get(path)
    if (!prev || prev === latest) continue
    console.log(`[${package}] upgrading ${dep}@${prev} -> ${latest}`)
    file.set(path, latest)
    execSync(`npm pack ${cwd}/${package}`)
  }
}