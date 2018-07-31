import axios from 'axios'
import * as React from 'react'
import { Prompt } from 'react-router-dom'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import styled, { keyframes } from 'styled-components'
import MerkleMiner from '@livepeer/merkle-miner'
import { withProp } from '../../enhancers'
import Web3 from 'web3'
import {
  BasicModal,
  Button,
  BasicNavbar,
  ScrollToTopOnMount,
} from '../../components'
import enhance from './enhance'
import { instructions, Instruction } from './instructions'

// Get external css file -- this might change during refactoring
import './style.css'

const BN = require('bn.js')

const multiMerkleMineAbi = require('./multi-merklemine.json')
const merkleMineAbi = require('./merklemine.json')
const tokenAbi = require('./token.json')

type MiningViewProps = {
  generateToken: ({ address: string, proof: string }) => Promise<*>,
}

const MiningView: React.ComponentType<MiningViewProps> = ({
  coinbase,
  generateToken,
  history,
}) => {
  var balance
  const { loading } = coinbase
  // You can hard-code a valid address for testing purpose
  // const defaultAddress = '0x4fe9367ef5dad459ae9cc4265c69b1b10a4e1288'
  const defaultAddress = coinbase.data.coinbase
  const contentLength = 51961420

  // Renders error when it occurs
  const renderError = err =>
    typeof err !== 'string' ? (
      err
    ) : (
      <p>
        {`Sorry, mining is unavailable at this time. Please try again later. ${err}`}
      </p>
    )
  // Generates instructions and store it in a constant
  const instruction = instructions().map((item, index) => {
    return <Instruction key={index} item={item} />
  })
  // Store instructions for header and footer
  const instruction_header = 'How to earn livepeer tokens'
  const instruction_footer = `You can repeat this process as many times as you like and increase your number of tokens.`

  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar />
      <div className="main">
        <div className="main-instruct">
          <h1>{instruction_header}</h1>
          {instruction}
          <p>{instruction_footer}</p>
          <br />
          <h2>Hardware / Software Requirements:</h2>
          <ul>
            <li>Operating System: Windows or Mac</li>
            <li>Access to the internet</li>
            <li>Web 3 wallet MetaMask</li>
          </ul>
        </div>
        <div className="token-area">
          {loading && (
            <div className="mining-area">
              <p>Loading...</p>
            </div>
          )}
          <div className="mining-area">
            {defaultAddress.length === 0 ? (
              <React.Fragment>
                <div className="mining-area">
                  <h2 className="instruct-heading">Mine livepeer token</h2>
                  <p>
                    In order to mine, you will need to log into your ETH account
                    using the metamask plugin. If you are not sure how to do
                    this, please read our guide:
                  </p>
                  <h3 style={{ margin: '30px' }}>
                    <a
                      href="https://forum.livepeer.org/t/how-to-install-metamask-on-chrome-browser-to-enable-web-3-0/272"
                      target="_blank"
                    >
                      How to Install MetaMask &rarr;
                    </a>
                  </h3>
                </div>
              </React.Fragment>
            ) : (
              <TokenMiner
                allowManualEntry={false}
                contentLength={contentLength}
                defaultAddress={defaultAddress}
                renderError={renderError}
                input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
                onGenerateToken={generateToken}
                history={history}
                onDone={e => {
                  e.preventDefault()
                  history.push(`/me?tour=true`)
                }}
                worker="QmbiSa3PSXwRw6aoCRUcEDB4F2c9jvz2UMZJJbyetPA9aY"
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const fade = keyframes`
  0% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
`

const ProgressBar = styled.div`
  animation: ${({ done }) =>
    !done ? `1s ${fade} ease-out alternate infinite` : ''};
`

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
      .contract(multiMerkleMineAbi)
      .at(process.env.REACT_APP_MULTI_MERKLE_MINE_CONTRACT)
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
  getAmountLpt = async => {
    window.web3.eth.getBlockNumber((err, res) => {
      if (err === null) {
        const con = window.web3.eth
          .contract(JSON.parse(merkleMineAbi.result))
          .at(process.env.REACT_APP_MERKLE_MINE_CONTRACT)
        con.callerTokenAmountAtBlock(res, (err, res) => {
          if (err === null) {
            this.setState({
              amtLpt: (
                res.mul(new BN(process.env.REACT_APP_NUM_ADDRESS)) /
                Math.pow(10, 18)
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
      .contract(JSON.parse(tokenAbi.result))
      .at(process.env.REACT_APP_TOKEN_ADDRESS)

    mkContract.balanceOf(
      process.env.REACT_APP_MERKLE_MINE_CONTRACT,
      (err, res) => {
        if (err === null) {
          const tokens = res.div(new BN(10).pow(new BN(18))).toString(10)
          this.setState({ tokensRemaining: tokens })
          return
        }
        console.log(err)
      },
    )
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
      process.env.REACT_APP_MERKLE_MINE_CONTRACT,
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
          console.log(txHash)
          this.setState({ progressBar: 3 })
          return
        }
        this.onError(err)
      },
    )
  }

  doneMining = async () => {
    this.setState({ progressBar: 3 })
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

  generateToken = async opts => {
    const maybeError = await this.props.onGenerateToken(opts)
    if (!maybeError) {
      this.setState({ done: true })
    } else {
      const [submitError] = Object.values(maybeError)
      if (!/User denied/.test(submitError)) {
        this.setState({
          error: (
            <React.Fragment>
              <div className="mining-area">
                <p>
                  Sorry, it looks like there was a problem generating your
                  token:
                </p>
                <p>{submitError}</p>
              </div>
            </React.Fragment>
          ),
        })
      }
    }
    return maybeError
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
        generateToken={this.generateToken}
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

const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    addressLocked,
    amtLpt,
    done,
    editGas,
    gas,
    gas_low,
    generateToken,
    lowBal,
    handleEdit,
    handleCancel,
    handleGas,
    estimCost,
    handleSave,
    handleSubmit,
    loading,
    onCancel,
    onDone,
    pristine,
    progress,
    progressBar,
    balance,
    proof,
    handleReset,
    stakeTokens,
    submitting,
    submitError,
    submitFailed,
    submitSucceeded,
    remainingTokens,
    valid,
    values,
    subProofs,
    ...props
  }) => {
    // console.log('MineProofForm', done, props)
    return (
      <React.Fragment>
        {progressBar <= 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              margin: '0px 0px 10px',
              paddingBottom: '10px',
            }}
          >
            <h1 id="tokens">
              Tokens remaining:{' '}
              {parseFloat(remainingTokens)
                .toFixed(2)
                .toLocaleString('en')}
            </h1>
            <div
              style={{
                margin: '10px auto',
                border: '1px solid #ccc',
                backgroundColor: '#afafaf',
                width: '90%',
              }}
            >
              <ProgressBar
                done={false}
                className="progress"
                style={{
                  background: 6 < 2 ? '#ccc' : 'var(--primary)',
                  width: `calc(${((10000000 - parseInt(remainingTokens)) /
                    10000000) *
                    100}%)`,
                  color: '#000',
                  margin: 0,
                }}
              >{`${(
                ((10000000 - parseInt(remainingTokens)) / 10000000) *
                100
              ).toFixed(2)}%`}</ProgressBar>
            </div>
          </div>
        )}
        <div className="mining-area">
          {/* Before Mining... */}
          {loading && <p>Initializing miner...</p>}
          {!loading && !progress && <h1>Your mining parameters</h1>}
          {!progress && (
            <React.Fragment>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label className="info-lbl">Account balance:</label>
                      <div className="help-tip">
                        <p>
                          The balance on your web3 enabled browser or wallet
                          plugin.
                        </p>
                      </div>
                    </td>
                    <td>
                      <strong>{balance}</strong> Ether
                    </td>
                  </tr>
                  {lowBal ? (
                    <tr>
                      <td colSpan="2">
                        You do not have sufficient funds in your web-3 wallet to
                        mine LPT tokens.
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  <tr>
                    <td>
                      <label className="info-lbl">Gas price:</label>
                      <div className="help-tip">
                        <p>
                          The current market price of 1 gas according to
                          EthGasStation.
                        </p>
                      </div>
                    </td>
                    <td>
                      {editGas ? (
                        <React.Fragment>
                          <a onClick={handleCancel}>Cancel</a>
                          <input
                            placeholder="Gas price: 999"
                            type="number"
                            value={gas}
                            onChange={handleGas}
                          />
                          <a
                            onClick={handleSave}
                            style={{
                              backgroundColor: '#000000',
                              color: '#FFFFFF',
                            }}
                          >
                            Ok
                          </a>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <label>
                            <strong>{gas}</strong>
                            Gwei
                          </label>
                          <a style={{ display: 'none' }} onClick={handleEdit}>
                            Edit
                          </a>
                        </React.Fragment>
                      )}
                    </td>
                  </tr>
                  {gas_low ? (
                    <tr>
                      <td colSpan="2">
                        By submitting a price that is lower than the current
                        market price of gas, you run the risk that your mining
                        transaction takes too long or it might not be mined at
                        all.
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                </tbody>
              </table>
              <hr />
            </React.Fragment>
          )}
          {!progress && (
            <React.Fragment>
              <h1>Estimated mining results</h1>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label>Estimated cost:</label>
                      <div className="help-tip">
                        <p>
                          Total total cost of one round of mining and generating
                          tokens for the 20 eligible ethereum addresses.
                        </p>
                      </div>
                    </td>
                    <td>
                      <label>
                        <strong>{estimCost}</strong>
                        Ether
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Estimated time:</label>
                      <div className="help-tip">
                        <p>
                          The time it takes to complete one round of mining.
                        </p>
                      </div>
                    </td>
                    <td>
                      <strong>1 - 5</strong>
                      Min
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Estimated number of LPT tokens you will earn:
                      <div className="help-tip">
                        <p>
                          The portion of the LPT tokens that will be issued to
                          you in one round of mining.
                        </p>
                      </div>
                    </td>
                    <td>
                      <strong>{amtLpt}</strong> LPT
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="center-div">
                <a
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: gas_low || lowBal ? '#ccc' : '#000000',
                  }}
                  className="primary-btn"
                >
                  Earn LPT
                </a>
              </div>
            </React.Fragment>
          )}
          {progressBar < 3 && progressBar >= 0 && <h1>Mining...</h1>}
          {progressBar >= 3 && <h1>Success!</h1>}
          {!loading &&
            progressBar >= 0 && (
              <div
                style={{
                  backgroundColor: '#FFF',
                  width: '90%',
                  margin: 'auto',
                  border: '1px solid #ccc',
                }}
              >
                <ProgressBar
                  className="progress"
                  done={progressBar === 3}
                  style={{
                    background:
                      /*progress.download + progress.tree < 2*/
                      progressBar < 3 ? '#ccc' : 'var(--primary)',
                    margin: 0,
                    transition: 'all .5s linear',
                    width: `calc(${(100 * progressBar) / 3}%)`,
                    color: '#000',
                  }}
                >
                  {`${((100 * progressBar) / 3) | 0}%`}
                </ProgressBar>
              </div>
            )}
          {/* During Mining... */}
          {!loading &&
            progressBar >= 0 &&
            progressBar < 3 && (
              <React.Fragment>
                <div
                  className="mining"
                  style={{
                    display: done ? 'none' : '',
                  }}
                >
                  <ol>
                    <li
                      style={{
                        opacity: progressBar >= 0 && progressBar < 2 ? 1 : 0.5,
                      }}
                    >
                      Initializing
                      <span
                        style={{
                          display: progressBar === 1 ? 'block' : 'none',
                        }}
                      >
                        Livepeer is gathering a list of 20 unclaimed eligible
                        Ethereum addresses to generate LPT tokens for.
                      </span>
                    </li>
                    <li
                      style={{
                        opacity: progress.tree !== 0 ? 1 : 0.5,
                      }}
                    >
                      Waiting for wallet approval
                      <span
                        style={{
                          display: progressBar === 2 ? 'block' : 'none',
                        }}
                      >
                        * Visit your web3 browser / plugin and approve the
                        transaction to generate LPT tokens.
                      </span>
                    </li>
                    <li style={{ opacity: subProofs ? 1 : 0.5 }}>
                      Generating tokens
                      <span style={{ display: subProofs ? 'block' : 'none' }}>
                        Executing the smart contracts for generating the LPT
                        tokens for the eligible Ethereum addresses and for you.
                      </span>
                      <span
                        style={{
                          display: subProofs ? 'block' : 'none',
                          color: 'red',
                        }}
                      >
                        If this is taking too long, you can speed up transaction
                        by increasing your gas price from your web3 wallet.
                      </span>
                    </li>
                  </ol>
                </div>
                <React.Fragment>
                  <p>
                    Almost there! Please remain patient as this process may take
                    several minutes.
                  </p>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      className="primary-btn"
                      style={{
                        backgroundColor: 'rgba(48, 39, 38, 0.8)',
                        textAlign: 'center',
                        width: 'auto',
                        fontSize: '14px',
                      }}
                      disabled
                    >
                      {progressBar === 2
                        ? `Waiting for your action...`
                        : `Mining... Please Wait`}
                    </Button>
                  </div>
                </React.Fragment>
              </React.Fragment>
            )}
          {!loading &&
            progressBar >= 3 && (
              <React.Fragment>
                <div className="success">
                  {proof ? (
                    <React.Fragment>
                      <p>
                        You have successfully mined LPT tokens and earned{' '}
                        {amtLpt}&nbsp; tokens. The tokens are now available in
                        your web3 wallet.
                      </p>
                      <p>There are two ways to earn additional LPT tokens:</p>
                      <ol>
                        <li>
                          Repeat this process by clicking the green "Repeat
                          Mining" button below.
                        </li>
                        <li>
                          Stake your LPT tokens : Delegate your LPT tokens to a
                          Livepeer transcoder and earn LPT's for contributing to
                          the LivePeer network.
                        </li>
                      </ol>
                      <div>
                        <a onClick={handleReset}>Repeat Mining</a>
                        <a onClick={stakeTokens}>Stake LPT tokens</a>
                      </div>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </div>
              </React.Fragment>
            )}
        </div>
      </React.Fragment>
    )
  },
)(Form)

export default enhance(MiningView)
