/**
 * This file runs all of our integration tests with different stores, then combines their coverage
 * report to get the full coverage with all stores accounted for.
 */

const libCoverage = require('istanbul-lib-coverage')
const { createReporter } = require('istanbul-api')
const fs = require('fs-extra')
const { spawnSync, spawn } = require('child_process')
const path = require('path')
const klaw = require('klaw')
const uuid = require('uuid')

const BUILD_DEFINITIONS = {
  level: {
    LP_STORAGE: 'level',
  },
  postgres: {
    LP_STORAGE: 'postgres',
    LP_POSTGRES_URL: 'postgresql://postgres@localhost/livepeerapi',
  },
  'cloudflare-kv': {
    LP_STORAGE: 'cloudflare-cluster',
    LP_CLOUDFLARE_NAMESPACE: 'KV_TEST',
    LP_INSECURE_TEST_TOKEN: uuid(),
    LP_JWT_AUDIENCE: 'test_audience',
    LP_JWT_SECRET: 'extremelysecret',
  },
  'local-firestore': {
    LP_STORAGE: 'firestore',
  },
}

const runs = {}

const delay = ms => new Promise(r => setTimeout(r, ms))

const run = async (name, args) => {
  let cp
  if (name === 'cloudflare') {
    // Build a new package.json file that aliases all of our test mocks
    const pkgStr = fs.readFileSync(
      path.resolve(__dirname, 'package.json'),
      'utf8',
    )
    const nodePath = process.argv[0]
    const pkg = JSON.parse(pkgStr)
    delete pkg.dependencies
    delete pkg.devDependencies
    pkg.name = '@livepeer/api-test-build'
    const workerDistDir = path.resolve(__dirname, 'dist-worker')
    const mockDir = path.resolve(__dirname, '__mocks__')
    const testBuildDir = path.resolve(__dirname, 'test-build')
    fs.ensureDirSync(testBuildDir)
    for (const [name, pkgPath] of Object.entries(pkg.alias)) {
      const absPath = path.resolve(__dirname, pkgPath)
      const relPath = path.relative(testBuildDir, absPath)
      pkg.alias[name] = relPath
    }
    for await (const file of klaw(mockDir)) {
      if (!file.path.endsWith('.js')) {
        continue
      }
      const name = file.path.replace(mockDir, '').slice(1, -3) // strip leading slash and .js
      const outPath = path.relative(testBuildDir, file.path)
      pkg.alias[name] = outPath
    }
    const pkgOutStr = JSON.stringify(pkg, null, 2)
    await fs.writeFile(path.resolve(testBuildDir, 'package.json'), pkgOutStr)

    // Write secrets file
    await fs.writeFile(
      path.resolve(__dirname, 'src', 'worker-secrets.json'),
      JSON.stringify(args, null, 2),
      'utf8',
    )
    spawnSync('yarn', ['run', 'test:build'], {
      cwd: testBuildDir,
      stdio: 'inherit',
    })
    // const wrangler = path.resolve(__dirname, 'node_modules', '.bin', 'wrangler')
    // cp = spawn(
    //   process.argv[0],
    //   [wrangler, 'dev', '-e', 'test', '--ip', '127.0.0.1'],
    //   {
    //     cwd: workerDistDir,
    //     stdio: ['ignore', 'pipe', 'pipe'],
    //     detached: true,
    //   },
    // )
    // await new Promise((resolve, reject) => {
    //   cp.on('error', reject)
    //   cp.stdout.on('data', buf => {
    //     const text = buf.toString()
    //     console.log(text.trim())
    //     if (text.includes('Listening on')) {
    //       resolve()
    //     }
    //   })
    //   cp.stderr.on('data', buf => {
    //     const text = buf.toString()
    //     console.log(text.trim())
    //   })
    // })
    const wrangler = path.resolve(__dirname, 'node_modules', '.bin', 'wrangler')
    spawnSync(process.argv[0], [wrangler, 'publish', '-e', 'test'], {
      cwd: workerDistDir,
      stdio: 'inherit',
    })
  }
  const proc = spawnSync(
    process.argv[0],
    [
      path.resolve(__dirname, 'node_modules', '.bin', 'jest'),
      '--forceExit',
      '--coverage',
      '--runInBand',
      `--coverage-directory=coverage-${name}`,
      '--bail',
      '--testTimeout=60000',
      'src/controllers/user.test.js',
    ],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...args,
      },
    },
  )
  if (cp) {
    console.log('killing wrangler')
    process.kill(-cp.pid)
  }
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

;(async () => {
  for (const build of builds) {
    const def = BUILD_DEFINITIONS[build]
    if (!def) {
      throw new Error(`no build definition found for ${def}`)
    }
    await run(build, def)
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
