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

/***
 * Returns data array which stores instructions for
 * mining Livepeer tokens
 */
const instructions = function() {
  let data = [
    {
      heading: '1. Log in to Web 3 Wallet',
      instruction: [
        'You will need a Web3 wallet such as MetaMask with enough Ethereum to pay for the Gas cost of executing the smart contracts that generate LPT tokens',
      ],
      imgSrc: 'static/images/download.jpeg',
    },
    {
      heading: '2. Set Mining Parameters',
      instruction: [
        'Selct your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
      ],
      imgSrc: 'static/images/download.jpeg',
    },
    {
      heading: '3. Earn LPT tokens',
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
  const instruction_header = 'How to Earn Livepeer Tokens'
  const instruction_footer = `You can repeat this process as many times as you like and increase your number of tokens.`
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  const acc = web3.eth.getCoinbase(res => {
    console.log(res)
    return res
  })
  console.log(acc)
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
            <h2> Tokens Remaining: 6,343,232</h2>
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
                <h2 className="instruct-heading">Mine Livepeer Token</h2>
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
    done: false,
    ready: false,
    error: '',
    proof: '',
    progress: null,
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
    let addresses = [
      '0x03032599cf173d66f5b8766404247599378e3604',
      '0x06e9d9aed50e4de9b16056f82d431f0c33eb9ec2',
      '0x0adcf4c94183464bb34a203c2121cc89456acd08',
    ]
    const { miner } = this
    const { input, contentLength } = this.props
    this.setState({ address, proof: '' })
    this.setState({ ready: true, progress: { tree: 0, download: 0 } })

    let proof = []

    console.log(contentLength)
    for (let i = 0, n = addresses.length; i < n; i++) {
      proof.push(await miner.getProof(input, addresses[i], contentLength))
    }
    console.log(proof)
    this.setState({
      proof: proof,
    })
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
        addressLocked={!allowManualEntry}
        done={done}
        generateToken={this.generateToken}
        initialValues={{ address }}
        loading={!ready && address}
        progress={progress}
        proof={proof}
        onCancel={onCancel}
        onDone={onDone}
        onSubmit={this.getProof}
      />
    )
  }
}

/*
const GenerateTokenForm: React.ComponentType<GenerateTokenFormProps> = withProp(
  'component',
  ({
    handleSubmit,
    onCancel,
    onDone,
    reset,
    submitting,
    submitError,
    submitFailed,
    submitSucceeded,
    ...props
  }) => {
    const confetti = (
      <Confetti
        active={submitSucceeded}
        config={{
          angle: 90,
          spread: 197,
          startVelocity: 45,
          elementCount: 50,
          decay: 0.9,
        }}
      />
    )
    if (submitFailed && submitError && !/User denied/.test(submitError)) {
      return (
        <React.Fragment>
          {confetti}
          <p>
            There was an error submitting your transaction. See error message
            below for more details:
          </p>
          <pre>
            <textarea disabled readOnly style={{ height: 320, width: '100%' }}>
              {submitError}
            </textarea>
          </pre>
          <p>
            You can also{' '}
            <Link to="/me/overview">view your recent protocol activity</Link> on
            your account overview page.
          </p>
          <div style={{ textAlign: 'right', paddingTop: 24 }}>
            {onCancel && <Button onClick={onCancel}>Cancel</Button>}
            <Button onClick={reset}>Try Again</Button>
          </div>
        </React.Fragment>
      )
    }
    if (submitSucceeded)
      return (
        <React.Fragment>
          {confetti}
          <div style={{ textAlign: 'right' }}>
            {onCancel && <Button onClick={onCancel}>Cancel</Button>}
            <Button className="primary" onClick={onDone}>
              View Account
            </Button>
          </div>
        </React.Fragment>
      )
    return (
      <React.Fragment>
        {confetti}
        <Field component="input" name="address" type="hidden" />
        <Field component="input" name="proof" type="hidden" />
        <div style={{ textAlign: 'right' }}>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
          <Button className="primary" onClick={handleSubmit}>
            Claim Token
          </Button>
        </div>
      </React.Fragment>
    )
  },
)(Form)
*/
const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    addressLocked,
    done,
    editGas,
    gas,
    generateToken,
    handleEdit,
    handleCancel,
    handleGas,
    handleSave,
    handleSubmit,
    loading,
    onCancel,
    onDone,
    pristine,
    progress,
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
        {!loading && !progress && <h1>Your Mining Parameters</h1>}
        {!progress && (
          <React.Fragment>
            <form>
              <br />
              <br />
              <label className="info-lbl">Account balance:</label>
              <div className="gas-info">
                <label>
                  <strong>1.845</strong>
                  Ether
                </label>
              </div>
              <br />
              <br />
              <label className="info-lbl">Gas price:</label>
              {editGas && (
                <div className="gas-info">
                  <input
                    placeholder="Gas price: 999"
                    value={gas}
                    onChange={handleGas}
                  />
                  <a onClick={handleCancel}>Cancel</a>
                  <a onClick={handleSave} style={{ backgroundColor: 'red' }}>
                    Save
                  </a>
                </div>
              )}
              {!editGas && (
                <React.Fragment>
                  <div className="gas-info">
                    <label>
                      <strong>32</strong>
                      Gwei
                    </label>
                    <a>Edit</a>
                  </div>
                </React.Fragment>
              )}
              <br />
              <br />
              <hr />
            </form>
          </React.Fragment>
        )}
        {!progress && (
          <React.Fragment>
            <h1>Estimated Mining Results</h1>
            <br />
            <br />
            <label>Estimated cost:</label>
            <div className="gas-info">
              <label>
                <strong>0.4</strong>
                Ether
              </label>
            </div>
            <br />
            <br />
            <label>Estimated time:</label>
            <div className="gas-info">
              <label>
                <strong>1 - 5</strong>
                Min
              </label>
            </div>
            <br />
            <br />
            <label>Estimated number of LPT Tokens to earn:</label>
            <div className="gas-info">
              <label>
                <strong>1.845</strong>
                Ether
              </label>
            </div>
            <br />
            <div className="center-div">
              <a onClick={handleSubmit} className="primary-btn">
                Earn LPT
              </a>
            </div>
          </React.Fragment>
        )}
        {progress && <h1>Mining...</h1>}
        {proof && <h1>Seccess!</h1>}
        {!loading &&
          (progress || proof) && (
            <div style={{ backgroundColor: '#FFF' }}>
              <ProgressBar
                className="progress"
                /*done={progress.download + progress.tree === 2}*/
                done={5 === 2}
                style={{
                  background:
                    /*progress.download + progress.tree < 2*/
                    1 < 2 ? '#ccc' : 'var(--primary)',
                  margin: 0,
                  transition: 'all .5s linear',
                  width: `calc(${
                    /*(100 * (progress.download + progress.tree))*/ 120 / 2
                  }% - 32px)`,
                  color: '#000',
                }}
              >
                {`${
                  /*(100 * (progress.download + progress.tree))*/ (130 / 2) | 0
                }%`}
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
                      textDecoration:
                        progress.download === 1 ? 'line-through' : '',
                      opacity: progress.download === 1 ? 0.5 : 1,
                    }}
                  >
                    Initializing
                  </li>
                  <li
                    style={{
                      textDecoration: progress.tree !== 0 ? 'line-through' : '',
                      opacity: progress.tree !== 0 ? 0.5 : 1,
                    }}
                  >
                    Waiting for wallet approval
                  </li>
                  <li
                    style={{
                      textDecoration: progress.tree === 1 ? 'line-through' : '',
                      opacity: progress.tree === 1 ? 0.5 : 1,
                    }}
                  >
                    Claiming accounts
                  </li>
                  <li
                    style={{
                      textDecoration: progress.tree === 1 ? 'line-through' : '',
                      opacity: progress.tree === 1 ? 0.5 : 1,
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
    return <img src={this.props.imgSrc} />
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
