import express from 'express'
import { json as jsonParser } from 'body-parser'

const app = express()

app.use(jsonParser())
app.post('/hook', (req, res) => {
  console.log(`Got hook: ${JSON.stringify(req.body)}`)
})

app.post('/different-hook', (req, res) => {
  console.log(`Got different hook: ${JSON.stringify(req.body)}`)
})

app.listen(process.env.PORT || 3006)
