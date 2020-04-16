// Helper script to push a YAML file full of secrets to the CF workers
// defined in this directory. Needed to split up large secrets into 1kb
// chunks for CF.

const fs = require('fs')
const { safeLoad } = require('js-yaml')
const path = require('path')
const { spawn } = require('child_process')

async function push(env, data) {
  // Split big secrets into chunks
  const output = {}
  for (let [key, value] of Object.entries(data)) {
    if (value.length < 1000) {
      output[key] = value
      continue
    }
    let i = 0
    while (value.length > 0) {
      output[`${key}chunk${i}`] = value.slice(0, 1000)
      value = value.slice(1000)
      i += 1
    }
  }

  for (const [key, value] of Object.entries(output)) {
    const child = spawn('wrangler', ['secret', 'put', key, '-e', env], {
      stdio: ['pipe', 'inherit', 'inherit'],
      cwd: __dirname,
    })
    child.stdin.setEncoding('utf-8')
    child.stdin.write(`${value}\n`)
    child.stdin.end()
    await new Promise((resolve, reject) => {
      child.on('close', code => {
        console.log(code)
        resolve()
      })
    })
  }
}

module.exports = push

if (!module.parent) {
  const env = process.argv[2]
  const filePath = process.argv[3]

  const data = safeLoad(fs.readFileSync(filePath))
  push(env, data)
}
