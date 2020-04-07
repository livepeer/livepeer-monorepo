/**
 * Insecure database-modification thing used to run our test suite against
 * Cloudflare workers
 */
export default () => {
  return async (req, res, next) => {
    try {
      let { action, args } = req.body
      args = args.map(x => (x === 'UNDEFINED' ? undefined : x))
      // console.log(`DB BACKDOOR: req.store.${action}(${args.join(', ')})`)
      const result = await req.store[action](...args)
      if (result === undefined) {
        res.status(204)
        return res.end()
      }
      res.json(result)
    } catch (err) {
      res.status(err.status || 500)
      res.end(err.message)
    }
  }
}
