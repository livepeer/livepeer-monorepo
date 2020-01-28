/**
 * This file runs all of our integration tests with different stores, then combines their coverage
 * report to get the full coverage with all stores accounted for.
 */

const libCoverage = require('istanbul-lib-coverage')
const { createReporter } = require('istanbul-api')
const fs = require('fs')
const { spawnSync } = require('child_process')
const path = require('path')

const runs = {}

const run = (name, args) => {
  const proc = spawnSync(
    process.argv[0],
    [
      path.resolve(__dirname, 'node_modules', '.bin', 'jest'),
      '--forceExit',
      '--coverage',
      '--runInBand',
      `--coverage-directory=coverage-${name}`,
      'src',
    ],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        TEST_PARAMS: JSON.stringify(args),
      },
    },
  )
  const data = fs.readFileSync(
    path.resolve(__dirname, `coverage-${name}`, 'coverage-final.json'),
    'utf8',
  )
  if (proc.status !== 0) {
    process.exit(proc.status || 1)
  }
  runs[name] = JSON.parse(data)
}

run('level', ['--storage=level'])
run('postgres', [
  '--storage=postgres',
  '--postgres-url=postgresql://postgres@localhost/livepeerapi',
])
run('cloudflare', ['--storage=cloudflare'])

// https://github.com/facebook/jest/issues/2418#issuecomment-423806659
const normalizeJestCoverage = obj => {
  const result = obj
  Object.entries(result).forEach(([k, v]) => {
    if (v.data) result[k] = v.data
  })
  return result
}

const map = libCoverage.createCoverageMap()
for (const data of Object.values(runs)) {
  map.merge(normalizeJestCoverage(data))
}

const reporter = createReporter()
reporter.addAll(['json', 'lcov', 'text'])
reporter.write(map)
process.exit(0)
