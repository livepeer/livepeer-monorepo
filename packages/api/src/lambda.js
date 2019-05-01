import awsServerlessExpress from 'aws-serverless-express'
import makeApp from './index'
import config from './lambda.config'
import { timeout } from './util'
import fetch from 'isomorphic-fetch'

let server

makeApp(config).then(({ app }) => {
  server = awsServerlessExpress.createServer(app)
})

export const handler = async (event, context) => {
  try {
    await timeout(1000, async () => {
      await fetch('https://1.1.1.1')
    })
  } catch (e) {
    throw new Error(`no internet: ${e.message}`)
  }
  awsServerlessExpress.proxy(server, event, context)
}
