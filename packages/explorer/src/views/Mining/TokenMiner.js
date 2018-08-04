import axios from 'axios'
import * as React from 'react'
import { Link } from 'react-router-dom'
import MerkleMiner from '@livepeer/merkle-miner'
import { Button } from '../../components'
import { MineProofForm } from './mineProofForm'

const BN = require('bn.js')

const Abi = require('./Abi.json')

/**
 * Defines contract addresses for
 * MerkleMine, MultiMerkleMine and LPT
 * currently contracts are only deployed on
 * MainNet and Rinkeby which holds the positions
 * 1 and 4. If contracts gets deployed on ropsten = 2
 * or Kovan = 3, then those filed could be placed here
 */
const netAddresses = {
  '1': {
    merkleMine: '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8',
    multiMerkleMine: '0x182ebf4c80b28efc45ad992ecbb9f730e31e8c7f',
    token: '0x58b6a8a3302369daec383334672404ee733ab239',
  },
  '2': {
    merkleMine: '',
    multiMerkleMine: '',
    token: '',
  },
  '3': {
    merkleMine: '',
    multiMerkleMine: '',
    token: '',
  },
  '4': {
    merkleMine: '0x3bb5c927b9dcf20c1dca97b93397d22fda4f5451',
    multiMerkleMine: '0x2ec3202aaeff2d3f7dd8571fe4a0bfc195ef6a17',
    token: '0x750809dbdb422e09dabb7429ffaa94e42021ea04',
  },
}

const numAddresses = 20

class TokenMiner extends React.Component {
  static defaultProps = {
    defaultAddress: '',
    allowManualEntry: false,
  }
  state = {
    address: this.props.defaultAddress,
    addresses: [],
    tokensRemaining: 0,
    done: false,
    progressBar: -1,
    ready: false,
    error: '',
    proof: '',
    estimatedCost: 0,
    gas: 0,
    progress: null,
    editGas: false,
    balance: '',
    contract: '',
  }

  async componentDidMount() {
    await window.web3.version.getNetwork((err, res) => {
      if (err === null) {
        this.setState({ netAddresses: netAddresses[res] })
        return
      }
      this.setState({
        netAddresses: {
          merkleMine: process.env.REACT_APP_MERKLE_MINE_CONTRACT,
          multiMerkleMine: process.env.REACT_APP_MULTI_MERKLE_MINE_CONTRACT,
          token: process.env.REACT_APP_TOKEN_ADDRESS,
        },
      })
    })
    try {
      window.onbeforeunload = () => true
      const { worker } = this.props
      const { address } = this.state
      this.miner = await new MerkleMiner({
        gateway: 'https://gateway.ipfs.io/ipfs',
        workerHash: worker,
        onResolveHash: this.onResolveHash,
        onConstructTree: this.onConstructTree,
        onError: this.onError,
      })
      this.setState({ ready: true })
      await this.getAccountBal()
      await this.getCurrentGasPrices()
      await this.determineEstimetedCost()
      await this.getAmountLpt()
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
    this.state.contract = window.web3.eth
      .contract(Abi.MultiMerkleMine)
      .at(this.state.netAddresses.multiMerkleMine)
    this.getBalance()
  }

  componentWillUnmount() {
    window.onbeforeunload = null
  }

  componentWillReceiveProps(nextProps) {
    const { address } = this.state
    if (address && address == nextProps.defaultAddress) {
      this.reset()
      this.setState({ address: nextProps.defaultAddress }, () =>
        this.componentDidMount(),
      )
    }
  }
  // This function gets the amount of token that miner addres will be allocated
  getAmountLpt = async () => {
    window.web3.eth.getBlockNumber(async (err, res) => {
      if (err === null) {
        const con = window.web3.eth
          .contract(Abi.MerkleMine)
          .at(this.state.netAddresses.merkleMine)
        con.callerTokenAmountAtBlock(res, (err, res) => {
          if (err === null) {
            this.setState({
              amtLpt: (
                res.mul(
                  new BN(numAddresses || process.env.REACT_APP_NUM_ADDRESS),
                ) / Math.pow(10, 18)
              ).toString(10),
            })
            return
          }
          this.setState({ amtLpt: 0 })
        })
        return
      }
      this.setState({ amtLpt: 0 })
    })
  }
  /**
   * This is a helper method used for preparing
   * the proofs to be passed to multiGenerate smart contract
   */
  encodeProofSize = proof => {
    const proofSize = proof.length / 2

    let res = proofSize.toString('16')
    let len = res.length

    while (len < 64) {
      res = '0' + res
      len++
    }

    return res
  }
  // Used to get ether amount to display
  getAccountBal = async () => {
    await window.web3.eth.getBalance(
      window.web3.eth.defaultAccount,
      (err, result) => {
        if (err === null) {
          let myBalance = window.web3.fromWei(result)
          this.setState({ balance: parseFloat(myBalance.toString(10)) })
        }
      },
    )
  }

  getBalance = async () => {
    let mkContract = window.web3.eth
      .contract(Abi.token)
      .at(this.state.netAddresses.token)

    mkContract.balanceOf(this.state.netAddresses.merkleMine, (err, res) => {
      if (err === null) {
        const tokens = res.div(new BN(10).pow(new BN(18))).toString(10)
        this.setState({ tokensRemaining: tokens })
        return
      }
      console.log(err)
    })
  }

  // Reset the app to  original state
  reset = () => {
    this.setState({
      done: false,
      subProofs: false,
      error: '',
      progress: null,
      proof: [],
      address: this.props.defaultAddress,
      addresses: [],
      progressBar: -1,
      proof: '',
      progress: null,
      editGas: false,
    })
    this.getAmountLpt()
    this.getBalance()
    this.getCurrentGasPrices()
  }

  // Show error if called
  onError = err => {
    console.error(err)
    return this.setState({
      error: err.message,
    })
  }

  onResolveHash = (err, data) => {
    if (err) {
      console.error(err)
      return this.setState({
        error: err.message,
      })
    }
    console.log(`Loading ${data.hash} from ipfs...`, data.progress.download)
    this.setState({ progress: data.progress })
  }

  onConstructTree = (err, data) => {
    if (err) {
      console.error(err)
      return this.setState({
        error: err.message,
      })
    }
    console.log('generating merkle tree...', data.progress.tree)
    this.setState({ progress: data.progress })
  }

  /**
   * Helper method used to prepare proofs to be passed to
   * multiGenerate smart contract
   */
  extendedBufArrToHex = proofs => {
    return (
      '0x' +
      proofs
        .map(proof => {
          return this.encodeProofSize(proof) + proof
        })
        .join('')
    )
  }

  /**
   * Used to get minable addresses from server
   */
  getAddresses = async () => {
    // Make get request to API
    await axios
      .get(process.env.REACT_APP_LAMBDA_API)
      .then(res => {
        this.setState({ addresses: JSON.parse(res.data.body) })
        this.setState({ progressBar: 1 })
      })
      .catch(err => {
        this.setState({ error: err.toString() })
        return
      })
  }

  /**
   * Used to generate the proofs
   */
  generateProof = async () => {
    const { miner } = this
    const { input, contentLength } = this.props
    // Constant to hold proofs
    const proofs = []
    // Loop through addresses and generate proofs
    for (const addr of this.state.addresses) {
      proofs.push(await miner.getProof(input, addr.substr(2), contentLength))
      this.setState({ progressBar: this.state.progressBar + 1 / 20 })
    }

    let proof
    proof = this.extendedBufArrToHex(proofs)
    this.setState({ proof: proof })
    this.setState({ progressBar: 2 })
  }

  /**
   * This method calls all the necessary methods
   * to multi merkle mine of users behalf
   */
  getProof = async () => {
    this.setState({ ready: true, progress: { tree: 0, download: 0 } })
    // Do nothing if balance or gas is low
    if (this.state.gas_low || this.state.lowBal) return
    // Set the state of the mining progress
    this.setState({ progressBar: 0 })
    // Get minable addresses from server
    await this.getAddresses()
    // If no addresses have been returned then show error
    if (this.state.addresses.length <= 0) {
      this.setState({
        error: `
          Error getting addresses from server.
          This might be a netwok problem. Please try again later. If the problem
          persists contact livepeer administrators in their discord group.
        `,
      })
      return
    }
    // Generate proofs
    await this.generateProof()
    // Mine addresses
    await this.multiMerkleMine()
  }
  // Used to get current gas price
  getCurrentGasPrices = async () => {
    let response = await axios.get(process.env.REACT_APP_GAS_PRICE_API)
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10,
    }
    this.setState({ currGas: prices.medium })
    this.setState({ gas: prices.medium })
    this.setState({ prevGas: prices.medium })
  }
  /**
   * This method checks with EVM to determine if merkle mining is finished
   */
  getTransactionReceiptMined = async (txHash, interval) => {
    const transactionReceiptAsync = function(resolve, reject) {
      window.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          reject(error)
        } else if (receipt == null) {
          setTimeout(
            () => transactionReceiptAsync(resolve, reject),
            interval ? interval : 500,
          )
        } else {
          resolve(receipt)
        }
      })
    }
    if (Array.isArray(txHash)) {
      return Promise.all(
        txHash.map(oneTxHash =>
          this.getTransactionReceiptMined(oneTxHash, interval),
        ),
      )
    } else if (typeof txHash === 'string') {
      return new Promise(transactionReceiptAsync)
    } else {
      throw new Error('Invalid Type: ' + txHash)
    }
  }

  multiMerkleMine = async () => {
    await this.state.contract.multiGenerate(
      this.state.netAddresses.merkleMine,
      this.state.addresses,
      this.state.proof,
      {
        from: window.web3.eth.coinbase,
        gas: 3200000,
        gasPrice: window.web3.toWei(this.state.gas, 'gwei'),
      },
      async (err, txHash) => {
        if (err === null) {
          this.setState({ subProofs: true })
          this.setState({ progressBar: 2.2 })
          await this.getTransactionReceiptMined(txHash).then(function(
            tsHash,
          ) {})
          this.setState({ progressBar: 3 })
          return
        }
        this.onError(err)
      },
    )
  }

  handleGas = async e => {
    e.preventDefault()
    this.determineEstimetedCost()
    this.setState({ prevGas: this.state.gas })
    this.setState({ gas: parseFloat(e.target.value) })
    try {
      if (e.target.value * 100 < this.state.currGas * 100) {
        this.setState({ gas_low: true })
      } else {
        this.setState({ gas_low: false })
      }
    } catch (err) {
      this.setState({ gas_low: true })
    }
  }

  determineEstimetedCost = async () => {
    let cost = await window.web3.fromWei(this.state.gas * 3200000, 'gwei')
    this.setState({ estimatedCost: cost })
    if (100 * cost > this.state.balance * 100) {
      this.setState({ lowBal: true })
    }
  }

  stakeTokens = async => {
    this.props.history.push('/transcoders')
  }

  /**
   * Controller for edit and cancel button in token
   * miner
   */
  editGas = async e => {
    e.preventDefault()
    this.determineEstimetedCost()
    this.setState({ editGas: !this.state.editGas })
    this.setState({ prevGas: this.state.gas })
  }

  cancelEditGas = async e => {
    e.preventDefault()
    this.setState({ gas: this.state.prevGas })
    this.determineEstimetedCost()
    if (parseFloat(this.state.gas) * 100 < this.state.currGas * 100) {
      this.setState({ gas_low: true })
    } else {
      this.setState({ gas_low: false })
    }
    this.setState({ editGas: !this.state.editGas })
  }

  render() {
    const { allowManualEntry, renderError, onCancel, onDone } = this.props
    const { address, done, error, progress, proof, ready } = this.state
    if (!ready && address) {
      return <p>Validating ETH address...</p>
    }
    return error ? (
      <React.Fragment>
        <div className="mining-area">
          {renderError(error)}
          <div style={{ textAlign: 'right', paddingTop: 24 }}>
            <Button onClick={this.reset}>Home</Button>
            {allowManualEntry && (
              <Button className="primary" onClick={this.reset}>
                Try another address
              </Button>
            )}
          </div>
        </div>
      </React.Fragment>
    ) : (
      <MineProofForm
        handleSave={() => {
          this.setState({ editGas: false })
        }}
        lowBal={this.state.lowBal}
        addressLocked={!allowManualEntry}
        done={done}
        editGas={this.state.editGas}
        handleGas={this.handleGas}
        gas_low={this.state.gas_low}
        estimCost={this.state.estimatedCost}
        gas={this.state.gas}
        handleCancel={this.cancelEditGas}
        handleEdit={this.editGas}
        stakeTokens={this.stakeTokens}
        initialValues={{ address }}
        loading={!ready && address}
        onCancel={onCancel}
        onDone={onDone}
        balance={this.state.balance}
        onSubmit={this.getProof}
        progress={progress}
        handleReset={this.reset}
        progressBar={this.state.progressBar}
        proof={proof}
        subProofs={this.state.subProofs}
        amtLpt={this.state.amtLpt}
        remainingTokens={this.state.tokensRemaining}
      />
    )
  }
}

export default TokenMiner
