const { createApolloFetch } = require('apollo-fetch')
const BN = require('bignumber.js')
const path = require('path')
const RPC = require('../../utils/rpc')
const execSync = require('child_process').execSync

const RoundsManagerABI = require('../../abis/RoundsManager_streamflow.json')
const ControllerABI = require('../../abis/Controller.json')
const BondingManagerABI = require('../../abis/BondingManager_streamflow.json')
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

const defaults = { gas: 1000000 }

const TOKEN_UNIT = new BN(10).pow(new BN(18))

const exec = cmd => {
  try {
    return execSync(cmd, { cwd: srcDir, stdio: 'inherit' })
  } catch (e) {
    throw new Error(`Failed to run command \`${cmd}\``)
  }
}

let waitForSubgraphToBeSynced = async () =>
  new Promise((resolve, reject) => {
    // Wait for up to three minutes
    let deadline = Date.now() + 180 * 1000
    // Function to check if the subgraph is synced
    let checkSubgraphSynced = async () => {
      try {
        let result = await fetchSubgraphs({
          query: `{
            subgraphDeployments {
              synced
              failed
              latestEthereumBlockNumber
              ethereumHeadBlockNumber
            }
          }
        `,
        })
        let latestEthereumBlockNumber = parseInt(
          result.data.subgraphDeployments[0].latestEthereumBlockNumber,
        )
        let ethereumHeadBlockNumber = parseInt(
          result.data.subgraphDeployments[0].ethereumHeadBlockNumber,
        )
        if (
          latestEthereumBlockNumber == ethereumHeadBlockNumber &&
          !result.data.subgraphDeployments[0].failed
        ) {
          resolve()
        } else if (
          latestEthereumBlockNumber < ethereumHeadBlockNumber &&
          !result.data.subgraphDeployments[0].failed
        ) {
          throw new Error('reject or retry')
        } else {
          reject(new Error('Subgraph failed'))
        }
      } catch (e) {
        if (Date.now() > deadline) {
          reject(new Error(`Timed out waiting for the subgraph to sync`))
        } else {
          setTimeout(checkSubgraphSynced, 2000)
        }
      }
    }

    // Periodically check whether the subgraph has synced
    setTimeout(checkSubgraphSynced, 8000)
  })

contract('Subgraph Integration Tests', accounts => {
  const TOKEN_UNIT = 10 ** 18
  const bondAmount = new BN(1).times(TOKEN_UNIT)
  const rpc = new RPC(web3)

  let transcoder1
  let delegator1
  let delegator2
  let delegator3
  let delegator4

  let rewardCut
  let feeShare
  let transcoder1StartStake
  let delegator1StartStake
  let delegator2StartStake
  let delegator3StartStake
  let delegator4StartStake
  let roundLength
  let pollCreationCost

  const mineAndInitializeRound = async roundLength => {
    await rpc.waitUntilNextBlockMultiple(parseInt(roundLength))
    await RoundsManager.methods
      .initializeRound()
      .send({ ...defaults, from: accounts[0] })
  }

  const getStake = async addr => {
    const currentRound = await RoundsManager.methods.currentRound().call()
    return await BondingManager.methods.pendingStake(addr, currentRound).call()
  }

  const tallyPollAndCheckResult = async ({ afterSwitch = false } = {}) => {
    const t1Stake = await getStake(transcoder1)
    const t2Stake = await getStake(transcoder2)
    const d1Stake = await getStake(delegator1)
    const d2Stake = await getStake(delegator2)
    const d3Stake = await getStake(delegator3)
    const delegator = await BondingManager.methods
      .getDelegator(transcoder1)
      .call()

    let nonVoteStake = new BN(d1Stake)
      .plus(new BN(d2Stake))
      .plus(new BN(d3Stake))
    if (afterSwitch) {
      nonVoteStake = nonVoteStake.minus(new BN(d1Stake))
    }

    const t1VoteStake = new BN(delegator.delegatedAmount).minus(nonVoteStake)

    const yesTally = t1VoteStake.plus(new BN(d2Stake)).toString(10)
    const noTally = new BN(d1Stake).plus(new BN(d3Stake)).toString(10)

    let subgraphPollData = await fetchSubgraph({
      query: `{
        polls {
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
  }

  before(async () => {
    transcoder1 = accounts[0]
    transcoder2 = accounts[1]
    delegator1 = accounts[2]
    delegator2 = accounts[3]
    delegator3 = accounts[4]
    delegator4 = accounts[5]

    pollCreationCost = await PollCreator.methods.pollCreationCost().call()
    roundLength = await RoundsManager.methods.roundLength().call()
    await Controller.methods.unpause().send({ from: accounts[0] })

    const transferAmount = new BN(10).times(TOKEN_UNIT).toString()
    await Token.methods
      .transfer(transcoder1, transferAmount)
      .send({ from: accounts[0] })
    await Token.methods
      .transfer(transcoder2, transferAmount)
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
    await Token.methods
      .transfer(delegator4, transferAmount)
      .send({ from: accounts[0] })

    await mineAndInitializeRound(roundLength)

    rewardCut = 50 // 50%
    feeShare = 5 // 5%
    transcoder1StartStake = 1000
    transcoder2StartStake = 1000
    delegator1StartStake = 3000
    delegator2StartStake = 3000
    delegator3StartStake = 3000
    delegator4StartStake = 3000

    // Register transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, transcoder1StartStake)
      .send({ from: transcoder1 })
    await BondingManager.methods
      .bond(transcoder1StartStake, transcoder1)
      .send({ ...defaults, from: transcoder1 })
    await BondingManager.methods
      .transcoder(rewardCut, feeShare)
      .send({ ...defaults, from: transcoder1 })

    // Register transcoder 2
    await Token.methods
      .approve(bondingManagerAddress, transcoder2StartStake)
      .send({ from: transcoder2 })
    await BondingManager.methods
      .bond(transcoder1StartStake, transcoder2)
      .send({ ...defaults, from: transcoder2 })
    await BondingManager.methods
      .transcoder(rewardCut, feeShare)
      .send({ ...defaults, from: transcoder2 })

    // Delegator 1 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator1StartStake)
      .send({
        from: delegator1,
      })
    await BondingManager.methods
      .bond(delegator1StartStake, transcoder1)
      .send({ ...defaults, from: delegator1 })

    // Delegator 2 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator2StartStake)
      .send({
        from: delegator2,
      })
    await BondingManager.methods.bond(delegator2StartStake, transcoder1).send({
      ...defaults,
      from: delegator2,
    })

    // Delegator 3 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator3StartStake)
      .send({
        from: delegator3,
      })
    await BondingManager.methods.bond(delegator3StartStake, transcoder1).send({
      ...defaults,
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

  it('creates a poll', async () => {
    const createPollAndCheckResult = async () => {
      const hash = web3.utils.fromAscii(
        'QmWBPdeDCi8uxQrUyTV38xwaeYxgmjQmx1Zkiw4vgQhj7x',
      )
      await Token.methods
        .approve(pollCreatorAddress, pollCreationCost)
        .send({ from: transcoder1, ...defaults })
      await PollCreator.methods
        .createPoll(hash)
        .send({ ...defaults, from: transcoder1 })
      await waitForSubgraphToBeSynced()

      let pollData = await fetchSubgraph({
        query: `{ polls { id } }`,
      })
      assert.equal(pollData.data.polls.length, 1, 'no poll created')
    }
    await createPollAndCheckResult()
  })

  it('correctly indexes vote choices', async () => {
    const voters = {}
    voters[transcoder1] = 0
    voters[delegator1] = 1
    voters[delegator2] = 0
    voters[delegator3] = 1

    const voteMapping = ['Yes', 'No']

    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id } }`,
    })
    const pollAddress = subgraphPollData.data.polls[0].id
    const Poll = new web3.eth.Contract(PollABI, pollAddress)

    await Promise.all(
      (function() {
        let calls = []
        for (voter in voters) {
          calls.push(Poll.methods.vote(voters[voter]).send({ from: voter }))
        }
        return calls
      })(),
    )

    await waitForSubgraphToBeSynced()

    subgraphPollData = await fetchSubgraph({
      query: `{
        vote: votes(where: {voter: "${transcoder1.toLowerCase()}" }) {
          choiceID
          voter
        }
        vote: votes(where: {voter: "${delegator1.toLowerCase()}" }) {
          choiceID
          voter
        }
        vote: votes(where: {voter: "${delegator2.toLowerCase()}" }) {
          choiceID
          voter
        }
        vote: votes(where: {voter: "${delegator3.toLowerCase()}" }) {
          choiceID
          voter
        }
      }`,
    })

    for (vote in subgraphPollData.data) {
      assert.equal(
        vote[0].choiceID,
        voteMapping[voters[vote.voter]],
        'incorrect vote choice',
      )
    }
  })

  it('correctly tallies poll after reward', async () => {
    await mineAndInitializeRound(roundLength)
    await BondingManager.methods
      .reward()
      .send({ ...defaults, from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder bonds', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: transcoder1,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder1)
      .send({ ...defaults, from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder unbonds', async () => {
    let unbondAmount = 1000
    await BondingManager.methods
      .unbond(unbondAmount)
      .send({ ...defaults, from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder rebonds', async () => {
    await BondingManager.methods
      .rebond(0)
      .send({ ...defaults, from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator bonds', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator1,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder1)
      .send({ ...defaults, from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator unbonds', async () => {
    let unbondAmount = 1000
    await BondingManager.methods
      .unbond(unbondAmount)
      .send({ ...defaults, from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator rebonds', async () => {
    await BondingManager.methods
      .rebond(0)
      .send({ ...defaults, from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator claims earnings', async () => {
    await mineAndInitializeRound(roundLength)
    await BondingManager.methods
      .reward()
      .send({ ...defaults, from: transcoder1 })

    const currentRound = await RoundsManager.methods.currentRound().call()

    await BondingManager.methods
      .claimEarnings(currentRound)
      .send({ ...defaults, from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator that has not voted bonds to a transcoder that has', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator4,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder1)
      .send({ ...defaults, from: delegator4 })
    await mineAndInitializeRound(roundLength)
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator that has not voted unbonds to a transcoder that has', async () => {
    let unbondAmount = 500
    await BondingManager.methods
      .unbond(unbondAmount)
      .send({ ...defaults, from: delegator4 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator that has not voted rebonds to a transcoder that has', async () => {
    await BondingManager.methods
      .rebond(0)
      .send({ ...defaults, from: delegator4 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator switches transcoders', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator1,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder2)
      .send({ ...defaults, from: delegator1 })

    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult({ afterSwitch: true })
  })

  it('correctly tallies poll after polling period is over', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id, endBlock } }`,
    })

    // Fast forward to end block
    await rpc.waitUntilBlock(parseInt(subgraphPollData.data.polls[0].endBlock))
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult({ afterSwitch: true })
  })
})
