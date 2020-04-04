const { createApolloFetch } = require('apollo-fetch')
const BN = require('bignumber.js')
const path = require('path')
const RPC = require('../../utils/rpc')
const execSync = require('child_process').execSync

const RoundsManagerABI = require('../../abis/RoundsManager_LIP12.json')
const ControllerABI = require('../../abis/Controller.json')
const BondingManagerABI = require('../../abis/BondingManager_LIP12.json')
const LivepeerTokenABI = require('../../abis/LivepeerToken.json')
const PollCreatorABI = require('../../abis/PollCreator.json')
const PollABI = require('../../abis/Poll.json')

const controllerAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
const roundsManagerAddress = '0x5f8e26fAcC23FA4cbd87b8d9Dbbd33D5047abDE1'
const bondingManagerAddress = '0xA94B7f0465E98609391C623d0560C5720a3f2D33'
const livepeerTokenAddress = '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb'
const pollCreatorAddress = '0x7414e38377D6DAf6045626EC8a8ABB8a1BC4B97a'

const Controller = new web3.eth.Contract(ControllerABI, controllerAddress)
const RoundsManager = new web3.eth.Contract(
  RoundsManagerABI,
  roundsManagerAddress,
)
const BondingManager = new web3.eth.Contract(
  BondingManagerABI,
  bondingManagerAddress,
)
const Token = new web3.eth.Contract(LivepeerTokenABI, livepeerTokenAddress)
const PollCreator = new web3.eth.Contract(PollCreatorABI, pollCreatorAddress)

const srcDir = path.join(__dirname, '..')

const fetchSubgraphs = createApolloFetch({
  uri: 'http://127.0.0.1:8000/subgraphs',
})
const fetchSubgraph = createApolloFetch({
  uri: 'http://127.0.0.1:8000/subgraphs/name/livepeer/livepeer',
})

const TOKEN_UNIT = new BN(10).pow(new BN(18)),

const exec = cmd => {
  try {
    return execSync(cmd, { cwd: srcDir, stdio: 'inherit' })
  } catch (e) {
    throw new Error(`Failed to run command \`${cmd}\``)
  }
}

const waitForSubgraphToBeSynced = async () =>
  new Promise((resolve, reject) => {
    // Wait for up 30 seconds
    let deadline = Date.now() + 30 * 1000
    // Function to check if the subgraph is synced
    const checkSubgraphSynced = async () => {
      try {
        let result = await fetchSubgraphs({
          query: `{ subgraphDeployments { synced } }`,
        })
        if (result.data.subgraphDeployments[0].synced) {
          resolve()
        } else if (result.data.subgraphDeployments[0].failed) {
          reject(new Error('Subgraph failed'))
        } else {
          throw new Error('reject or retry')
        }
      } catch (e) {
        if (Date.now() > deadline) {
          reject(new Error(`Timed out waiting for the subgraph to sync`))
        } else {
          setTimeout(checkSubgraphSynced, 500)
        }
      }
    }

    // Periodically check whether the subgraph has synced
    setTimeout(checkSubgraphSynced, 5000)
  })

contract('Subgraph Integration Tests', accounts => {
  const TOKEN_UNIT = 10 ** 18
  const bondAmount = new BN(1).times(TOKEN_UNIT)
  const rpc = new RPC(web3)

  let transcoder1
  let delegator1
  let delegator2
  let delegator3

  let rewardCut
  let feeShare
  let transcoder1StartStake
  let delegator1StartStake
  let delegator2StartStake
  let delegator3StartStake
  let roundLength
  let pollCreationCost

  const mineAndInitializeRound = async roundLength => {
    await rpc.waitUntilNextBlockMultiple(parseInt(roundLength))
    await RoundsManager.methods
      .initializeRound()
      .send({ gas: 1000000, from: accounts[0] })
  }

  const getStake = async addr => {
    const currentRound = await RoundsManager.methods.currentRound().call()
    return await BondingManager.methods.pendingStake(addr, currentRound).call()
  }

  before(async () => {
    transcoder1 = accounts[0]
    delegator1 = accounts[2]
    delegator2 = accounts[3]
    delegator3 = accounts[4]

    pollCreationCost = await PollCreator.methods.pollCreationCost().call()
    roundLength = await RoundsManager.methods.roundLength().call()
    await Controller.methods.unpause().send({ from: accounts[0] })

    const transferAmount = new BN(10).times(TOKEN_UNIT).toString()
    await Token.methods
      .transfer(transcoder1, transferAmount)
      .send({ from: accounts[0] })
    await Token.methods
      .transfer(delegator1, transferAmount)
      .send({ from: accounts[0] })
    await Token.methods
      .transfer(delegator2, transferAmount)
      .send({ from: accounts[0] })
    await Token.methods
      .transfer(delegator3, transferAmount)
      .send({ from: accounts[0] })

    await mineAndInitializeRound(roundLength)

    rewardCut = 50 // 50%
    feeShare = 5 // 5%
    transcoder1StartStake = 1000
    delegator1StartStake = 3000
    delegator2StartStake = 3000
    delegator3StartStake = 3000

    // Register transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, transcoder1StartStake)
      .send({ from: transcoder1 })
    await BondingManager.methods
      .bond(transcoder1StartStake, transcoder1)
      .send({ gas: 1000000, from: transcoder1 })
    await BondingManager.methods
      .transcoder(rewardCut, feeShare)
      .send({ gas: 1000000, from: transcoder1 })

    // Delegator 1 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator1StartStake)
      .send({
        from: delegator1,
      })
    await BondingManager.methods
      .bond(delegator1StartStake, transcoder1)
      .send({ gas: 1000000, from: delegator1 })

    // Delegator 2 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator2StartStake)
      .send({
        from: delegator2,
      })
    await BondingManager.methods.bond(delegator2StartStake, transcoder1).send({
      gas: 1000000,
      from: delegator2,
    })

    // Delegator 3 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator3StartStake)
      .send({
        from: delegator3,
      })
    await BondingManager.methods.bond(delegator3StartStake, transcoder1).send({
      gas: 1000000,
      from: delegator3,
    })

    await mineAndInitializeRound(roundLength)

    // Create and deploy the subgraph
    exec('yarn prepare:development')
    exec('yarn codegen')
    exec(`yarn create:local`)
    exec(`yarn deploy:local`)
  })

  it('subgraph does not fail', async () => {
    // Wait for the subgraph to be indexed, and not fail
    await waitForSubgraphToBeSynced()
  })

  it('correctly calculates reward shares for delegators and transcoders', async () => {
    const callRewardAndCheckStakes = async () => {
      const acceptableDelta = TOKEN_UNIT.div(new BN(1000)) // .001

      const t1StartStake = await getStake(transcoder1)
      const d1StartStake = await getStake(delegator1)
      const d2StartStake = await getStake(delegator2)
      const d3StartStake = await getStake(delegator3)
      const totalStartStake = new BN(t1StartStake)
        .plus(new BN(d1StartStake))
        .plus(new BN(d2StartStake))
        .plus(new BN(d3StartStake))

      await BondingManager.methods
        .reward()
        .send({ gas: 1000000, from: transcoder1 })

      await waitForSubgraphToBeSynced()
      // TODO: Assertions
    }

    await callRewardAndCheckStakes()
  })

  it('creates a poll', async () => {
    await waitForSubgraphToBeSynced()
    const createPollAndCheckResult = async () => {
      const hash = '0x1230000000000000000000000000000000000000'
      await Token.methods
        .approve(pollCreatorAddress, pollCreationCost)
        .send({ from: transcoder1, gas: 1000000 })

      await PollCreator.methods
        .createPoll(hash)
        .send({ gas: 1000000, from: transcoder1 })

      await waitForSubgraphToBeSynced()

      let pollData = await fetchSubgraph({
        query: `{ polls { id } }`,
      })
      assert.equal(pollData.data.polls.length, 1, 'no poll created')
    }
    await createPollAndCheckResult()
  })

  it('correctly tallies poll after polling period is over', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id, endBlock } }`,
    })
    const pollAddress = subgraphPollData.data.polls[0].id
    const Poll = new web3.eth.Contract(PollABI, pollAddress)

    // transcoder 1 votes yes
    await Poll.methods.yes().send({ gas: 1000000, from: transcoder1 })

    // delegator 1 votes no
    await Poll.methods.no().send({ gas: 1000000, from: delegator1 })

    // delegator 2 votes yes
    await Poll.methods.yes().send({ gas: 1000000, from: delegator2 })

    // delegator 3 votes no
    await Poll.methods.no().send({ gas: 1000000, from: delegator3 })

    await mineAndInitializeRound(roundLength)

    await BondingManager.methods
      .reward()
      .send({ gas: 1000000, from: transcoder1 })

    // Fast forward to end block
    await rpc.waitUntilBlock(parseInt(subgraphPollData.data.polls[0].endBlock))

    await waitForSubgraphToBeSynced()

    const t1Stake = await getStake(transcoder1)
    const d1Stake = await getStake(delegator1)
    const d2Stake = await getStake(delegator2)
    const d3Stake = await getStake(delegator3)
    const delegator = await BondingManager.methods
      .getDelegator(transcoder1)
      .call()

    const t1VoteStake = new BN(delegator.delegatedAmount).minus(
      new BN(d1Stake).plus(new BN(d2Stake)).plus(new BN(d3Stake)),
    )

    const yesTally = t1VoteStake.plus(new BN(d2Stake)).toString(10)
    const noTally = new BN(d1Stake).plus(new BN(d3Stake)).toString(10)

    subgraphPollData = await fetchSubgraph({
      query: `{
        polls {
          id
          tally {
            yes
            no
          }
        }
      }`,
    })

    assert.equal(
      subgraphPollData.data.polls[0].tally.yes,
      yesTally,
      'incorrect yes tally',
    )

    assert.equal(
      subgraphPollData.data.polls[0].tally.no,
      noTally,
      'incorrect no tally',
    )
  })
})
