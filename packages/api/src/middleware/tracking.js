'use strict'

// function trackingFactory(params) {
//   return async (req, res, next) => {
//     let authToken = req.headers.authorization
//     if (!authToken) {
//       // TODO log error here
//     }


//     console.log('tracking: ', req.user, req.headers.authorization)
//     return next()
//   }
// }

// export default trackingFactory

const tracking = {
  record: function record (store, tokenObject) {
    console.log('debug: tracking record trigger')
    tokenObject.lastSeen = new Date()
    store.replace(tokenObject).then((_) => {
      // all good
      console.log('all good')
    }).catch((e) => {
      // TODO Log error 
    })
  }
}

export default tracking