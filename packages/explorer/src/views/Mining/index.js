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

// Get external css file -- this might change during refactoring
import './style.css'

const api_addr = 'http://localhost:3000/random_address'
const contract_abi = require('./merklemine.json')
const contract_address = '0xEF90D389C64C623DE3FA3B6E0B694453D02B875F'
const gasPriceApi = 'https://ethgasstation.info/json/ethgasAPI.json'
const toAcc = '0x68ff3d810180ce319b223cb8e5c7527bcab1ed60'
//console.log(window.web3.eth.getBalance(window.web3.eth.coinbase).then(console.log))
/***
 * Returns data array which stores instructions for
 * mining Livepeer tokens
 */
const instructions = function() {
  let data = [
    {
      heading: '1. Log in to web 3 wallet',
      instruction: [
        'You will need a Web3 wallet such as MetaMask with enough Ethereum to pay for the Gas cost of executing the smart contracts that generate LPT tokens',
      ],
      imgSrc: 'static/images/download.jpeg',
    },
    {
      heading: '2. Set mining parameters',
      instruction: [
        'Selct your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
      ],
      imgSrc: 'static/images/download.jpeg',
    },
    {
      heading: '3. Earn lpt tokens',
      instruction: [
        'The Livepeer Mining smart contract will generate 2.4 LPT in each of the eligible Ethereum addresses. A portion of LPT generated will be allocated to you for claiming the address.',
        'Each round of mining generates tokens for 20 eligible Ethereum addresses.',
        'You do not need to provide the eligible ethereum addresses. Livepeer provides and submits the eligible Ethereum addresses for you.',
      ],
      imgSrc: 'static/images/download.jpeg',
    },
  ]
  return data
}

type MiningViewProps = {
  generateToken: ({ address: string, proof: string }) => Promise<*>,
}

const MiningView: React.ComponentType<MiningViewProps> = ({
  coinbase,
  generateToken,
  history,
}) => {
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
          <div>
            <h2> Tokens remaining: 6,343,232</h2>
            <ProgressBar
              done={false}
              className="progress"
              style={{
                background: 6 < 2 ? '#ccc' : 'var(--primary)',
                width: `calc(${(100 * 1.3) / 2}% - 32px)`,
                color: '#000',
              }}
            >{`${((100 * 1.3) / 2) | 0}%`}</ProgressBar>
          </div>
          <div className="mining-area">
            {loading ? (
              <p>Loading...</p>
            ) : !defaultAddress ? (
              <React.Fragment>
                <h2 className="instruct-heading">Mine livepeer token</h2>
                <p>
                  In order to mine, you will need to log into your ETH account
                  using a web3-enabled browser or plugin. If you are not sure
                  how to do this, please read our guide:
                </p>
                <h3>
                  <a
                    href="https://forum.livepeer.org/t/how-to-install-metamask-on-chrome-browser-to-enable-web-3-0/272"
                    target="_blank"
                  >
                    How to Install MetaMask &rarr;
                  </a>
                </h3>
              </React.Fragment>
            ) : (
              <TokenMiner
                allowManualEntry={false}
                contentLength={contentLength}
                defaultAddress={defaultAddress}
                renderError={renderError}
                input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
                onGenerateToken={generateToken}
                onDone={e => {
                  e.preventDefault()
                  // This should be removed
                  //console.log('view account...')
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
    done: false,
    progressBar: -1,
    ready: false,
    error: '',
    proof: '',
    estimatedCost: 0,
    gas: 32,
    progress: null,
    editGas: false,
    balance: '',
    contract: window.web3.eth
      .contract(contract_abi)
      .at('0xEF90D389C64C623DE3FA3B6E0B694453D02B875F'),
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
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
    await this.getAccountBal()
    await this.getCurrentGasPrices()
    await this.determineEstimetedCost()
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
  // Might remove this function when refactoring
  updateAddress = async address => {
    return true
  }

  // Used to get ether amout to display
  getAccountBal = async () => {
    await window.web3.eth.getBalance(
      window.web3.eth.defaultAccount,
      (err, result) => {
        if (err === null) {
          let myBalance = window.web3.fromWei(result, 'ether')
          this.setState({ balance: myBalance.c[0] })
        }
      },
    )
  }

  // Reset the app to  original state
  reset = () => {
    this.setState({
      address: '',
      done: false,
      error: '',
      progress: null,
      proof: [],
      ready: false,
    })
  }
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

  getProof = async ({ address }) => {
    this.setState({ progressBar: 0 })
    this.setState({ ready: true, progress: { tree: 0, download: 0 } })
    const { miner } = this
    const { input, contentLength } = this.props
    await axios
      .get(api_addr)
      .then(res => {
        this.setState({ addresses: res })
        this.setState({ progressBar: 1 })
      })
      .catch(console.log)

    const proofs = []
    // Loop through addresses and generate proofs
    for (const addr of this.state.addresses.data) {
      proofs.push(
        await miner.getProof(input, addr.address.substr(2)),
        contentLength,
      )
    }
    this.setState({ proof: proofs })
    this.setState({ progressBar: 2 })
    this.multiMerkleMine()
  }

  // Used to get current gas price
  getCurrentGasPrices = async () => {
    let response = await axios.get(gasPriceApi)
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10,
    }

    this.setState({ currGas: prices.medium })
    this.setState({ gas: prices.medium })
  }

  multiMerkleMine = async () => {
    console.log(toAcc)
    window.web3.eth
      .sendRawTransaction({
        from: window.web3.eth.coinbase,
        to: toAcc,
        value: 19,
        gasLimit: 21000,
        gasPrice: 1 * 1000000,
      })
      .call()
      .then(res => {
        console.log(res)
        if (res !== null) {
          this.setState({ progressBar: 3 })
        }
      })
      .catch(console.log)
  }

  handleGas = async e => {
    this.setState({ gas: e.target.value })
    if (this.state.gas * 100 < this.state.currGas * 100) {
      this.setState({ gas_low: true })
    } else {
      this.setState({ gas_low: false })
    }
  }

  determineEstimetedCost = async () => {
    let cost = await window.web3.fromWei(
      this.state.currGas * 1000000000 * 2600000,
      'ether',
    )
    console.log(cost)
    this.setState({ estimatedCost: cost })
    if (100 * cost > this.state.balance * 100) {
      this.setState({ lowBal: true })
    }
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
              <p>
                Sorry, it looks like there was a problem generating your token:
              </p>
              <p>{submitError}</p>
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
    e.preventDefault
    this.setState({ editGas: !this.state.editGas })
    this.setState({ gas_low: false })
    this.setState({ gas: this.state.currGas })
  }

  render() {
    const { allowManualEntry, renderError, onCancel, onDone } = this.props
    const { address, done, error, progress, proof, ready } = this.state
    if (!ready && address) {
      return <p>Validating ETH address...</p>
    }
    return error ? (
      <React.Fragment>
        {renderError(error)}
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          <Button onClick={onCancel}>Cancel</Button>
          {allowManualEntry && (
            <Button className="primary" onClick={this.reset}>
              Try another address
            </Button>
          )}
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
        handleCancel={this.editGas}
        handleEdit={this.editGas}
        initialValues={{ address }}
        loading={!ready && address}
        onCancel={onCancel}
        onDone={onDone}
        balance={this.state.balance}
        onSubmit={this.getProof}
        progress={progress}
        progressBar={this.state.progressBar}
        proof={proof}
      />
    )
  }
}

const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    addressLocked,
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
    reset,
    submitting,
    submitError,
    submitFailed,
    submitSucceeded,
    valid,
    values,
    ...props
  }) => {
    // console.log('MineProofForm', done, props)
    return (
      <React.Fragment>
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
                    <div class="help-tip">
                      <p>
                        This is the inline help tip! It can contain all kinds of
                        HTML. Style it as you please.
                      </p>
                    </div>
                  </td>
                  <td>
                    <strong>{balance}</strong> Ether
                  </td>
                </tr>
                {lowBal ? (
                  <tr>
                    <td colspan="2">
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
                    <div class="help-tip">
                      <p>
                        This is the inline help tip! It can contain all kinds of
                        HTML. Style it as you please.
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
                          style={{ backgroundColor: 'red' }}
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
                        <a onClick={handleEdit}>Edit</a>
                      </React.Fragment>
                    )}
                  </td>
                </tr>
                {gas_low ? (
                  <tr>
                    <td colspan="2">
                      By submitting a price that is lower than the current
                      &nbsp; market price of gas, you run the risk that your
                      mining &nbsp; transaction takes too long or it might not
                      be mined at &nbsp; all.
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
                    <div class="help-tip">
                      <p>
                        This is the inline help tip! It can contain all kinds of
                        HTML. Style it as you please.
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
                    <div class="help-tip">
                      <p>
                        This is the inline help tip! It can contain all kinds of
                        HTML. Style it as you please.
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
                    Estimated number of LPT tokens to earn:
                    <div class="help-tip">
                      <p>
                        This is the inline help tip! It can contain all kinds of
                        HTML. Style it as you please.
                      </p>
                    </div>
                  </td>
                  <td>
                    <strong>1.845</strong> LPT
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="center-div">
              <a onClick={handleSubmit} className="primary-btn">
                Earn LPT
              </a>
            </div>
          </React.Fragment>
        )}
        {progressBar < 5 && progressBar >= 0 && <h1>Mining...</h1>}
        {progressBar >= 5 && <h1>Seccess!</h1>}
        {!loading &&
          progressBar >= 0 && (
            <div style={{ backgroundColor: '#FFF' }}>
              <ProgressBar
                className="progress"
                done={progressBar === 5}
                style={{
                  background:
                    /*progress.download + progress.tree < 2*/
                    progressBar < 5 ? '#ccc' : 'var(--primary)',
                  margin: 0,
                  transition: 'all .5s linear',
                  width: `calc(${(100 * progressBar) / 5}% - 32px)`,
                  color: '#000',
                }}
              >
                {`${((100 * progressBar) / 5) | 0}%`}
              </ProgressBar>
            </div>
          )}
        {/* During Mining... */}
        {!loading &&
          progress && (
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
                        display: progressBar === 0 ? 'block' : 'none',
                        color: 'red',
                      }}
                    >
                      Livepeer is gathering a list of 20 unlciamed &nbsp;
                      eligible Ethereum addresses to generate LPT tokens for.
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
                        color: 'red',
                      }}
                    >
                      * Visit your web3 browser / plugin and approve the
                      transaction to generate LPT tokens.
                    </span>
                  </li>
                  <li
                    style={{
                      opacity: progressBar === 3 ? 1 : 0.5,
                    }}
                  >
                    Claiming accounts
                  </li>
                  <li
                    style={{
                      opacity: progressBar === 4 ? 1 : 0.5,
                    }}
                  >
                    Generating tokens
                  </li>
                </ol>
              </div>
              <div className="success">
                {proof ? (
                  <React.Fragment>
                    {done ? (
                      <React.Fragment>
                        <p>
                          You have successfully mined LPT tokens and earned 1.4
                          tokens. The tokens are now available in your web3
                          wallet.
                        </p>
                        <p>There are two ways to earn additional LPT tokens:</p>
                        <ol>
                          <li>
                            Repeat Mining: Repeat this process by going back to
                            the main.
                          </li>
                          <li>
                            Stake your LPT tokens : Delegate your LPT tokens to
                            a Livepeer transcoder and earn LPT's for
                            contributing to the LivePeer network.
                          </li>
                        </ol>
                        <div>
                          <a>Repeat Mining</a>
                          <a>Stake LPT tokens</a>
                        </div>
                      </React.Fragment>
                    ) : (
                      <p>
                        Mining complete! You may now claim your Livepeer Token.
                      </p>
                    )}
                    {/*
                    <GenerateTokenForm
                      initialValues={{ address: values.address, proof }}
                      onCancel={onCancel}
                      onDone={onDone}
                      onSubmit={generateToken}
                    />*/}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>
                      Almost there! Please remain patient as this process may
                      take several minutes.
                    </p>
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        className="primary-btn"
                        style={{
                          backgroundColor: 'rgba(48, 39, 38, 0.8)',
                          minWidth: '300px',
                          width: '400px',
                        }}
                        disabled
                      >
                        Mining... Please Wait
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </React.Fragment>
          )}
      </React.Fragment>
    )
  },
)(Form)

class Image extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <img src={this.props.imgSrc} alt="" />
  }
}

class Instruction extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="chip">
        {this.props.item.imgSrc && <Image imgSrc={this.props.item.imgSrc} />}
        <h2>{this.props.item.heading}</h2>
        {this.props.item.instruction.map((item, index) => {
          return <p key={index}>{item}</p>
        })}
      </div>
    )
  }
}
export default enhance(MiningView)
