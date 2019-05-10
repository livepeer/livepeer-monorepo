// Health check endpoint that returns 200 on /. Useful for Kubernetes
// deployments. Maybe eventually should check that our database connection and
// such are healthy.

import { Router } from 'express'

const router = Router()

const healthcheck = (req, res) => {
  res.status(200)
  // idk, say something cheerful to the health checker
  res.json({ ok: true })
}
router.get('/healthz', healthcheck)
router.get('/', healthcheck)

export default router
