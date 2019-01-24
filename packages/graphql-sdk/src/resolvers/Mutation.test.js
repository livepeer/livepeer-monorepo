import test from 'ava'
import { rebondFromUnbonded } from './Mutation'

const data = {
  delegate: {
    0xf1234d9987: {
      unbonds: {
        0: '300',
      },
    },
  },
  gas: {
    rebond: '300',
    rebondFromUnbonded: '30',
  },
}

const mockSDK = {
  livepeer: {
    rpc: {
      estimateGas: async (contract: string, methodName: string, args) => {
        return data['gas'][methodName]
      },
      rebondFromUnbonded: async (
        delegate: string,
        unbondingLockId: string,
        args,
      ) => {
        const res = {
          delegate: data.delegate[delegate],
          gas: args['gas'],
        }
        return res
      },
    },
  },
}
test.todo('approve()')
test.todo('bond()')
test.todo('claimEarnings()')
test.todo('sendTransaction()')
test.todo('unbond()')
test('Mutation rebondFromUnbonded mutation calls correct function', async t => {
  const val = {
    delegate: data.delegate[0xf1234d9987],
    gas: data.gas['rebondFromUnbonded'],
  }
  const result = await rebondFromUnbonded(
    {},
    {
      delegate: 0xf1234d9987,
      unbondingLockId: '0',
    },
    mockSDK,
  )
  t.deepEqual(val, result)
})
