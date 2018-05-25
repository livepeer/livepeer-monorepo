import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()

export const TransactionSubmitted = 'transactionSubmitted'

export const TransactionConfirmed = 'transactionConfirmed'

export const publish = (type, payload) => {
  pubsub.publish(type, payload)
}

export default {
  transactionSubmitted: {
    resolve: (obj, args, ctx) => {
      // Directly persist data to cache
      // console.log('got pending tx', obj)
      if (ctx && ctx.cache) cachePendingTransaction(ctx, obj)
      return obj
    },
    subscribe: (obj, args, ctx) => pubsub.asyncIterator(TransactionSubmitted),
  },
  transactionConfirmed: {
    resolve: (obj, args, ctx) => {
      // Directly remove data from cache
      // console.log('got confirmed tx', obj)
      if (ctx && ctx.cache) purgePendingTransaction(ctx, obj)
      return obj
    },
    subscribe: (obj, args, ctx) => pubsub.asyncIterator(TransactionConfirmed),
  },
}

function cachePendingTransaction({ persistor }, obj) {
  const { cache } = persistor.cache
  const { data } = cache.data
  // console.log(cache)
  const documentId = `Transaction:${obj.id}`
  const collectionId = `pendingTransactions({"address":"${obj.from}"})`
  const collection = data.ROOT_QUERY[collectionId] || []
  const document = data[documentId] || {}
  data.ROOT_QUERY[collectionId] = [
    { type: 'id', id: documentId, generated: false },
    ...collection,
  ]
  data[documentId] = {
    ...obj,
    params: { type: 'json', json: obj.params },
    __typename: 'Transaction',
  }
  persistor.persist()
}

function purgePendingTransaction({ persistor }, obj) {
  const { cache } = persistor.cache
  const { data } = cache.data
  const documentId = `Transaction:${obj.id}`
  const collectionId = `pendingTransactions({"address":"${obj.from}"})`
  const collection = data.ROOT_QUERY[collectionId] || []
  const document = data[documentId] || {}
  data.ROOT_QUERY[collectionId] = collection.filter(x => x.id !== documentId)
  data[documentId] = document.gasUsed
    ? document
    : {
        ...document,
        ...obj,
        params: { type: 'json', json: obj.params },
        __typename: 'Transaction',
      }
  data[`Delegator:${obj.from}`] = {
    lastClaimRound: obj.params._endRound,
    ...data[`Delegator:${obj.from}`],
  }
  persistor.persist()
}
