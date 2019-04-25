import jsdom from 'jsdom'
import fs from 'fs'

document.body.innerHTML = fs.readFileSync(
  __dirname + '/../public/index.html',
  'utf8',
)
