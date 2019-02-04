import test from 'ava'
import '@livepeer/sdk'
import {
  approve,
  bond,
  rebond,
  rebondFromUnbonded,
  sendTransaction,
  unbond,
} from './Mutation'

const data = {
  mockTx: {
    blockNumber: '',
    contract: 'BondingManager',
    gasUsed: '',
    gasPrice: '',
    nonce: '',
    status: 'pending',
  },
  delegate: {
    '0xf1234d9987': {
      unbonds: {
        0: '300',
      },
      pendingStake: 3000,
      bondedAmount: 5000,
    },
  },
  gas: {
    approve: '10',
    bond: '310',
    rebond: '300',
    rebondFromUnbonded: '30',
    unbond: '500',
  },
}

const mockSDK = {
  livepeer: {
    config: {
      contracts: {
        BondingManager: {
          address: '0x32145667',
        },
      },
      defaultTx: {
        from: '0xf1234d9987',
      },
      eth: {
        sendTransaction: async ({}) => {
          return data.mockTx
        },
      },
    },
    rpc: {
      approveTokenBondAmount: async (amount: string, args) => {
        return {
          data: data.mockTx,
          gas: args['gas'],
        }
      },
      bondApprovedTokenAmount: async (to: string, amount: string, args) => {
        return {
          data: data.mockTx,
          gas: args['gas'],
        }
      },
      estimateGas: async (contract: string, methodName: string, args) => {
        return data['gas'][methodName]
      },
      rebond: async (unbondingLockId, args) => {
        return {
          data: data.mockTx,
          ...args,
        }
      },
      getDelegator: async delegator => {
        console.log(data.delegate[delegator])
        return data.delegate[delegator]
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
      unbond: async args => {
        return args
      },
    },
    utils: {
      getTxReceipt: async receipt => {
        return receipt
      },
    },
  },
}
/**
 * The idea here is that if I pass the approve method from Mutaton.js a mock SDK in the form of a ctx object
 * then it should be returning the correct values
 */
test('approve calls estimateGas and approveTokenBondAmount', async t => {
  const res = await approve(
    {},
    {
      amount: 5000,
      type: 'bond',
    },
    mockSDK,
  )
  t.deepEqual(
    {
      data: data.mockTx,
      gas: data.gas['approve'],
    },
    res,
  )
})

test('approve throws Approval type error', async t => {
  const type = 'some type'
  try {
    await approve(
      {},
      {
        amount: 5000,
        type: type,
      },
      mockSDK,
    )
    t.fail()
  } catch (err) {
    t.pass()
  }
})

test('bond calls correct methods', async t => {
  const res = await bond(
    {},
    {
      to: '0xF98',
      amount: '500',
    },
    mockSDK,
  )
  t.deepEqual(
    {
      data: data.mockTx,
      gas: data.gas['bond'],
    },
    res,
  )
})

test('rebond calls the correct method', async t => {
  const res = await rebond(
    {},
    {
      unbondingLockId: '1',
    },
    mockSDK,
  )

  t.deepEqual(
    {
      data: data.mockTx,
      gas: data.gas['rebond'],
      ...mockSDK.livepeer.config.defaultTx,
    },
    res,
  )
})

test('sendTransaction call correct methods', async t => {
  const res = await sendTransaction(
    {},
    {
      options: {},
    },
    mockSDK,
  )
  t.deepEqual(data.mockTx, res)
})

test('Mutation rebondFromUnbonded mutation calls correct function', async t => {
  const val = {
    delegate: data.delegate['0xf1234d9987'],
    gas: data.gas['rebondFromUnbonded'],
  }
  const result = await rebondFromUnbonded(
    {},
    {
      delegate: '0xf1234d9987',
      unbondingLockId: '0',
    },
    mockSDK,
  )
  t.deepEqual(val, result)
})

test('Unbond calls get Gas and rpc.unbond', async t => {
  t.deepEqual(
    {
      ...mockSDK.livepeer.config.defaultTx,
      gas: data.gas['unbond'],
    },
    await unbond({}, {}, mockSDK),
  )
})
test.todo('claimEarnings()')
