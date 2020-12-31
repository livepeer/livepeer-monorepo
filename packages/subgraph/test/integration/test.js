const { createApolloFetch } = require('apollo-fetch')
const BN = require('bignumber.js')
const path = require('path')
const RPC = require('../../utils/rpc')
const execSync = require('child_process').execSync

const RoundsManagerABI = require('../../abis/RoundsManager.json')
const BondingManagerABI = require('../../abis/BondingManager.json')
const LivepeerTokenABI = require('../../abis/LivepeerToken.json')
const PollCreatorABI = require('../../abis/PollCreator.json')
const PollABI = require('../../abis/Poll.json')

const roundsManagerAddress = '0x5f8e26fAcC23FA4cbd87b8d9Dbbd33D5047abDE1'
const bondingManagerAddress = '0xA94B7f0465E98609391C623d0560C5720a3f2D33'
const livepeerTokenAddress = '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb'
const pollCreatorAddress = '0x4bf3A7dFB3b76b5B3E169ACE65f888A4b4FCa5Ee'

const defaults = { gas: 1000000 }

const RoundsManager = new web3.eth.Contract(
  RoundsManagerABI,
  roundsManagerAddress,
  defaults,
)
const BondingManager = new web3.eth.Contract(
  BondingManagerABI,
  bondingManagerAddress,
  defaults,
)
const Token = new web3.eth.Contract(
  LivepeerTokenABI,
  livepeerTokenAddress,
  defaults,
)
const PollCreator = new web3.eth.Contract(
  PollCreatorABI,
  pollCreatorAddress,
  defaults,
)

const srcDir = path.join(__dirname, '..')

let graphNodeIP = '127.0.0.1'
if (process.env.DOCKER) {
  graphNodeIP = 'graph-node'
}

const fetchSubgraphs = createApolloFetch({
  uri: `http://${graphNodeIP}:8000/subgraphs`,
})
const fetchSubgraph = createApolloFetch({
  uri: `http://${graphNodeIP}:8000/subgraphs/name/livepeer/livepeer`,
})

const exec = (cmd) => {
  try {
    return execSync(cmd, { cwd: srcDir, stdio: 'inherit' })
  } catch (e) {
    throw new Error(`Failed to run command \`${cmd}\``)
  }
}

let waitForSubgraphToBeSynced = async () =>
  new Promise((resolve, reject) => {
    // Wait for up to four minutes
    let deadline = Date.now() + 240 * 1000
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

contract('Subgraph Integration Tests', (accounts) => {
  const TOKEN_UNIT = 10 ** 18
  const rpc = new RPC(web3)
  const voteMap = ['Yes', 'No']

  let transcoder1
  let transcoder2
  let delegator1
  let delegator2
  let delegator3
  let delegator4
  let delegator5
  let delegator6

  let rewardCut
  let feeShare
  let transcoder1StartStake
  let transcoder2StartStake
  let delegator1StartStake
  let delegator2StartStake
  let delegator3StartStake
  let roundLength
  let pollCreationCost
  let voters = {}

  const mineAndInitializeRound = async (roundLength) => {
    await rpc.waitUntilNextBlockMultiple(parseInt(roundLength))
    await RoundsManager.methods.initializeRound().send({ from: accounts[0] })
  }

  const getStake = async (addr) => {
    const currentRound = await RoundsManager.methods.currentRound().call()
    return await BondingManager.methods.pendingStake(addr, currentRound).call()
  }

  const tallyPollAndCheckResult = async () => {
    let yesTally = new BN(0)
    let noTally = new BN(0)

    for (voter in voters) {
      let voteStake = await getStake(voter)
      let nonVoteStake = new BN(0)
      if (voters[voter].registeredTranscoder) {
        let delegatorData = await BondingManager.methods
          .getDelegator(voter)
          .call()
        voteStake = delegatorData.delegatedAmount
        if (voters[voter].overrides.length) {
          for (const override of voters[voter].overrides) {
            let overrideVoteStake = await getStake(override)
            nonVoteStake = nonVoteStake.plus(new BN(overrideVoteStake))
          }
        }
      }

      if (voters[voter].choiceID == 0) {
        yesTally = new BN(yesTally)
          .plus(new BN(voteStake).minus(nonVoteStake))
          .toString(10)
      }
      if (voters[voter].choiceID == 1) {
        noTally = new BN(noTally)
          .plus(new BN(voteStake).minus(nonVoteStake))
          .toString(10)
      }
    }

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
      subgraphPollData.data.polls[0].tally
        ? web3.utils.toWei(subgraphPollData.data.polls[0].tally.yes)
        : '0',
      yesTally,
      'incorrect yes tally',
    )

    assert.equal(
      subgraphPollData.data.polls[0].tally
        ? web3.utils.toWei(subgraphPollData.data.polls[0].tally.no)
        : '0',
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
    delegator5 = accounts[6]
    delegator6 = accounts[7]

    await RoundsManager.methods.setRoundLength(20).send({ from: accounts[0] })

    pollCreationCost = await PollCreator.methods.POLL_CREATION_COST().call()
    roundLength = await RoundsManager.methods.roundLength().call()

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
    await Token.methods
      .transfer(delegator5, transferAmount)
      .send({ from: accounts[0] })
    await Token.methods
      .transfer(delegator6, transferAmount)
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
      .send({ from: transcoder1 })
    await BondingManager.methods
      .transcoder(rewardCut, feeShare)
      .send({ from: transcoder1 })

    // Register transcoder 2
    await Token.methods
      .approve(bondingManagerAddress, transcoder2StartStake)
      .send({ from: transcoder2 })
    await BondingManager.methods
      .bond(transcoder2StartStake, transcoder2)
      .send({ from: transcoder2 })
    await BondingManager.methods
      .transcoder(rewardCut, feeShare)
      .send({ from: transcoder2 })

    // Delegator 1 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator1StartStake)
      .send({
        from: delegator1,
      })
    await BondingManager.methods
      .bond(delegator1StartStake, transcoder1)
      .send({ from: delegator1 })

    // Delegator 2 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator2StartStake)
      .send({
        from: delegator2,
      })
    await BondingManager.methods.bond(delegator2StartStake, transcoder1).send({
      from: delegator2,
    })

    // Delegator 3 delegates to transcoder 1
    await Token.methods
      .approve(bondingManagerAddress, delegator3StartStake)
      .send({
        from: delegator3,
      })
    await BondingManager.methods.bond(delegator3StartStake, transcoder1).send({
      from: delegator3,
    })

    await mineAndInitializeRound(roundLength)

    // Create and deploy the subgraph
    exec('yarn prepare:development')
    exec('yarn codegen')

    if (process.env.DOCKER) {
      exec(`yarn create:docker`)
      exec(`yarn deploy:docker`)
    } else {
      exec(`yarn create:local`)
      exec(`yarn deploy:local`)
    }
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
        .send({ from: transcoder1 })
      await PollCreator.methods.createPoll(hash).send({ from: transcoder1 })
      await waitForSubgraphToBeSynced()

      let pollData = await fetchSubgraph({
        query: `{ polls { id } }`,
      })
      assert.equal(pollData.data.polls.length, 1, 'no poll created')
    }
    await createPollAndCheckResult()
  })

  it('correctly indexes vote choices', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id } }`,
    })
    const pollAddress = subgraphPollData.data.polls[0].id
    const Poll = new web3.eth.Contract(PollABI, pollAddress, defaults)

    voters = {
      [transcoder1]: {
        choiceID: 0,
        registeredTranscoder: true,
        overrides: [delegator1, delegator2, delegator3],
      },
      [delegator1]: {
        choiceID: 1,
        registeredTranscoder: false,
        overrides: [],
      },
      [delegator2]: {
        choiceID: 0,
        registeredTranscoder: false,
        overrides: [],
      },
      [delegator3]: {
        choiceID: 1,
        registeredTranscoder: false,
        overrides: [],
      },
    }

    for (voter in voters) {
      await Poll.methods.vote(voters[voter].choiceID).send({ from: voter })
    }

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
        voteMap[voters[vote.voter]],
        'incorrect vote choice',
      )
    }
  })

  it('correctly tallies poll after transcoder 1 calls reward', async () => {
    await mineAndInitializeRound(roundLength)
    await BondingManager.methods.reward().send({ from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder 2 calls reward', async () => {
    await BondingManager.methods.reward().send({ from: transcoder2 })
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
      .send({ from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder unbonds', async () => {
    let unbondAmount = 1000
    await BondingManager.methods
      .unbond(unbondAmount)
      .send({ from: transcoder1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder rebonds', async () => {
    await BondingManager.methods.rebond(0).send({ from: transcoder1 })
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
      .send({ from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator unbonds', async () => {
    let unbondAmount = 1000
    await BondingManager.methods.unbond(unbondAmount).send({ from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator rebonds', async () => {
    await BondingManager.methods.rebond(0).send({ from: delegator1 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator claims earnings', async () => {
    await mineAndInitializeRound(roundLength)
    await BondingManager.methods.reward().send({ from: transcoder1 })

    const currentRound = await RoundsManager.methods.currentRound().call()

    await BondingManager.methods
      .claimEarnings(currentRound)
      .send({ from: delegator1 })
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
      .send({ from: delegator4 })
    await mineAndInitializeRound(roundLength)
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator that has not voted unbonds from a transcoder that has', async () => {
    let unbondAmount = 500
    await BondingManager.methods.unbond(unbondAmount).send({ from: delegator4 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator that has not voted rebonds to a transcoder that has', async () => {
    await BondingManager.methods.rebond(0).send({ from: delegator4 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator 1 switches from transcoder 1 to transcoder 2', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator1,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder2)
      .send({ from: delegator1 })

    voters[transcoder1].overrides = voters[transcoder1].overrides.filter(
      (t) => t !== delegator1,
    )

    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator 5 bonds with unregistered transcoder (delegate 2)', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator5,
    })
    await BondingManager.methods
      .bond(bondAmount, delegator2)
      .send({ from: delegator5 })

    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator 2 registers as transcoder and inherits the voting power of delegator 5', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator2,
    })
    await BondingManager.methods
      .bond(bondAmount, delegator2)
      .send({ from: delegator2 })
    voters[transcoder1].overrides = voters[transcoder1].overrides.filter(
      (t) => t !== delegator2,
    )
    voters[delegator2].registeredTranscoder = true
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator 5 votes and overrides its delegate vote', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id } }`,
    })
    const pollAddress = subgraphPollData.data.polls[0].id
    const Poll = new web3.eth.Contract(PollABI, pollAddress, defaults)

    await Poll.methods.vote(1).send({ from: delegator5 })
    voters[delegator5] = {
      choiceID: 1,
      registeredTranscoder: false,
      overrides: [],
    }
    voters[delegator2].overrides.push(delegator5)
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator 5 claims earnings', async () => {
    await mineAndInitializeRound(roundLength)
    await BondingManager.methods.reward().send({ from: transcoder1 })
    await BondingManager.methods.reward().send({ from: delegator2 })
    const currentRound = await RoundsManager.methods.currentRound().call()

    await BondingManager.methods
      .claimEarnings(currentRound)
      .send({ from: delegator5 })

    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator moves stake to a transcoder that voted', async () => {
    let bondAmount = 1000
    await Token.methods.approve(bondingManagerAddress, bondAmount).send({
      from: delegator1,
    })
    await BondingManager.methods
      .bond(bondAmount, transcoder1)
      .send({ from: delegator1 })

    voters[transcoder1].overrides.push(delegator1)

    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after transcoder 1 resigns', async () => {
    let unbondAmount = await getStake(transcoder1)
    await BondingManager.methods
      .unbond(unbondAmount)
      .send({ from: transcoder1 })

    voters[transcoder1].registeredTranscoder = false
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after delegator with zero voting power votes', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id } }`,
    })
    const pollAddress = subgraphPollData.data.polls[0].id
    const Poll = new web3.eth.Contract(PollABI, pollAddress, defaults)

    await Poll.methods.vote(1).send({ from: delegator6 })
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })

  it('correctly tallies poll after polling period is over', async () => {
    let subgraphPollData = await fetchSubgraph({
      query: `{ polls { id, endBlock } }`,
    })

    // Fast forward to end block
    await rpc.waitUntilBlock(parseInt(subgraphPollData.data.polls[0].endBlock))
    await waitForSubgraphToBeSynced()
    await tallyPollAndCheckResult()
  })
})
