import apiToken from './api-token'
import broadcaster from './broadcaster'
import objectStore from './object-store'
import orchestrator from './orchestrator'
import stream from './stream'
import user from './user'

// Annoying but necessary to get the routing correct
export default {
  'api-token': apiToken,
  broadcaster: broadcaster,
  'object-store': objectStore,
  orchestrator: orchestrator,
  stream: stream,
  user: user,
}
