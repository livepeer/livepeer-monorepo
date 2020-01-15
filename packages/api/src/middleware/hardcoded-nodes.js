/**
 * For development/other specialized cases we can hardcode the list of broadcasters and orchestrators with
 * --broadcaster and --orchestrator CLI parameters. This implements those.
 */

export default function hardcodedNodes({ broadcasters, orchestrators }) {
  try {
    broadcasters = JSON.parse(broadcasters)
    orchestrators = JSON.parse(orchestrators)
  } catch (e) {
    console.error('Error parsing LP_BROADCASTERS and LP_ORCHESTRATORS')
    throw e
  }
  return (req, res, next) => {
    if (!req.getBroadcasters) {
      req.getBroadcasters = async () => broadcasters
    }
    if (!req.getOrchestrators) {
      req.getOrchestrators = async () => orchestrators
    }
    next()
  }
}
