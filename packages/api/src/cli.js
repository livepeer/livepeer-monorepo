#!/usr/bin/env node

import makeApp from './index'
import parseCli from './parse-cli'

if (!module.parent) {
  require('dotenv').config()
  makeApp(parseCli())
}
