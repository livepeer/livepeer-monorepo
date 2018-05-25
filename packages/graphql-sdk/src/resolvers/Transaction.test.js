import test from 'ava'
import * as resolvers from './Transaction'

test('Transaction resolves fields', async t => {
  const obj = {
    blockNumber: '5631830',
    timeStamp: '1526599255',
    id: '0x7dfe3a8c03f484740073fafddc280a5d695c5e83d2cbb4e7663000fadcbdb437',
    nonce: '0',
    blockHash:
      '0x4960e87b111cce47d51e64994e7b2f218c15c2522ba733356e7b477c4a93d38d',
    transactionIndex: '154',
    from: '0x623117424ed6325f594318a74995f818c2758212',
    to: '0xe04d445f8a20e1d64cc249a0f86843c2381c0b5b',
    value: '400000000000000000',
    gas: '21000',
    gasPrice: '10000000000',
    isError: '0',
    status: '1',
    input: '0x',
    contractAddress: '',
    cumulativeGasUsed: '6195463',
    gasUsed: '21000',
    confirmations: '3460',
    // derived
    contract: '',
    method: '',
    params: [],
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
