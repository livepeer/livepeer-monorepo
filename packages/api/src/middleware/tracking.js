'use strict'

const tracking = {
  record: function record(store, tokenObject) {
    tokenObject.lastSeen = Date.now()
    store
      .replace(tokenObject)
      .then((_) => {
        // all good
      })
      .catch((e) => {
        console.log('tracking record error: ', e)
      })
  },
}

export default tracking
