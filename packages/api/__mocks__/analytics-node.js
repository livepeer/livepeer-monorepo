export default class SegmentAnalytics {
  constructor(apiKey, opts) {
    if (!apiKey) {
      throw new Error('no apiKey provided')
    }
  }

  track(trackingObj) {
    if (!trackingObj.userId) {
      throw new Error('no userId provided')
    }
    if (!trackingObj.event) {
      throw new Error('no event or event name provided')
    }
  }

  identify(identity) {
    if (!identity.userId) {
      throw new Error('no userId provided')
    }
    if (!identity.traits || !('email' in identity.traits)) {
      throw new Error('no email provided')
    }
  }
}
