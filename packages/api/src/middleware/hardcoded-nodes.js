/**
 * For development/other specialized cases we can hardcode the list of broadcasters and orchestrators with
 * --broadcaster and --orchestrator CLI parameters. This implements those.
 */

export default function hardcodedNodes({
  broadcasters,
  orchestrators,
  ingest,
}) {
  try {
    broadcasters = JSON.parse(broadcasters)
    orchestrators = JSON.parse(orchestrators)
    ingest = JSON.parse(ingest)
  } catch (e) {
    console.error('Error parsing LP_BROADCASTERS and LP_ORCHESTRATORS and LP_INGEST')
    throw e
  }
  return (req, res, next) => {
    if (!req.getBroadcasters) {
      req.getBroadcasters = async () => broadcasters
    }
    if (!req.getOrchestrators) {
      req.getOrchestrators = async () => orchestrators
    }
    if (!req.getIngest) {
      req.getIngest = async () => ingest
    }
    next()
  }
}
