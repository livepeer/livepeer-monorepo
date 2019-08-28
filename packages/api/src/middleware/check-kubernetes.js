export default function checkKubernetes() {
  return (req, res, next) => {
    // Requires Kubernetes. Currently.
    if (!req.kubeApi) {
      res.status(502)
      return res.json({
        errors: ['not yet implemented outside of kubernetes'],
      })
    }
    next()
  }
}
