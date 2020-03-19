/**
 * This file runs all of our integration tests with different stores, then combines their coverage
 * report to get the full coverage with all stores accounted for.
 */

const libCoverage = require('istanbul-lib-coverage')
const { createReporter } = require('istanbul-api')
const fs = require('fs-extra')
const { spawnSync } = require('child_process')
const path = require('path')
const klaw = require('klaw')

const BUILD_DEFINITIONS = {
  level: ['--storage=level'],
  postgres: [
    '--storage=postgres',
    '--postgres-url=postgresql://postgres@localhost/livepeerapi',
  ],
  cloudflare: ['--storage=cloudflare'],
}

const runs = {}

const run = async (name, args) => {
  if (name === "cloudflare") {
    console.log("building test app")
    // Build a new package.json file that aliases all of our test mocks
    const pkgStr = fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8");
    const pkg = JSON.parse(pkgStr);
    const testBuildDir = path.resolve(__dirname, "test-build");
    fs.ensureDirSync(testBuildDir);
    const mockDir = path.resolve(__dirname, "__mocks__");
    for (const [name, pkgPath] of Object.entries(pkg.alias)) {
      const absPath = path.resolve(__dirname, pkgPath);
      const relPath = path.relative(testBuildDir, absPath);
      pkg.alias[name] = relPath
    }
    for await (const file of klaw(mockDir)) {
      if (!file.path.endsWith(".js")) {
        continue;
      }
      const name = file.path.replace(mockDir, "").slice(1, -3); // strip leading slash and .js
      const outPath = path.relative(testBuildDir, file.path);
      pkg.alias[name] = outPath;
    }
    const pkgOutStr = JSON.stringify(pkg, null, 2);
    await fs.writeFile(path.resolve(testBuildDir, "package.json"), pkgOutStr)
  }
  process.exit(0)
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

let builds = process.argv.slice(2)

if (builds.length === 0) {
  builds = ['level', 'postgres', 'cloudflare']
}

// run('level', ['--storage=level'])
// run('postgres', [
//   '--storage=postgres',
//   '--postgres-url=postgresql://postgres@localhost/livepeerapi',
// ])
// run('cloudflare', ['--storage=cloudflare'])


// https://github.com/facebook/jest/issues/2418#issuecomment-423806659
const normalizeJestCoverage = obj => {
  const result = obj
  Object.entries(result).forEach(([k, v]) => {
    if (v.data) result[k] = v.data
  })
  return result
}

(async() => {
  for (const build of builds) {
    const def = BUILD_DEFINITIONS[build];
    if (!def) {
      throw new Error(`no build definition found for ${def}`)
    }
    await run(build, def);
  }
  
  const map = libCoverage.createCoverageMap()
  for (const data of Object.values(runs)) {
    map.merge(normalizeJestCoverage(data))
  }
  
  const reporter = createReporter()
  reporter.addAll(['json', 'lcov', 'text'])
  reporter.write(map)
  process.exit(0)
  
})()
