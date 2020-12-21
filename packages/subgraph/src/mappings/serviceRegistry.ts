// Import event types from the registrar contract ABIs
import { ServiceURIUpdate as ServiceURIUpdateEvent } from '../types/ServiceRegistry/ServiceRegistry'

// Import entity types generated from the GraphQL schema
import { Transcoder } from '../types/schema'

export function serviceURIUpdate(event: ServiceURIUpdateEvent): void {
  let transcoder =
    Transcoder.load(event.params.addr.toHex()) ||
    new Transcoder(event.params.addr.toHex())

  // Update transcoder
  transcoder.serviceURI = event.params.serviceURI

  // Apply store updates
  transcoder.save()
}
