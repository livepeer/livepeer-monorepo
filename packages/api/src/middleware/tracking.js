'use strict'

const tracking = {
  record: function record (store, tokenObject) {
    tokenObject.lastSeen = Date.now()
    store.replace(tokenObject).then((_) => {
      // all good
    })
  }
}

export default tracking