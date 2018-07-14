import * as React from 'react'
import { Prompt } from 'react-router-dom'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import styled, { keyframes } from 'styled-components'
import MerkleMiner from '@livepeer/merkle-miner'
import { withProp } from '../../enhancers'
import { BasicModal, Button } from '../../components'
import enhance from './enhance'

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
  const closeModal = () => history.push(history.location.pathname)
  const renderError = err =>
    typeof err !== 'string' ? (
      err
    ) : (
      <p
      >{`Sorry, mining is unavailable at this time. Please try again later. ${err}`}</p>
    )
  return (
    <BasicModal title="Mine Livepeer Token">
      {loading ? (
        <p>Loading...</p>
      ) : !defaultAddress ? (
        <React.Fragment>
          <p>
            In order to mine, you will need to log into your ETH account using a
            web3-enabled browser or plugin. If you are not sure how to do this,
            please read our guide:
          </p>
          <h3>
            <a
              href="https://forum.livepeer.org/t/how-to-install-metamask-on-chrome-browser-to-enable-web-3-0/272"
              target="_blank"
            >
              How to Install MetaMask &rarr;
            </a>
          </h3>
          <div style={{ textAlign: 'right', paddingTop: 24 }}>
            <Button onClick={closeModal}>Okay</Button>
          </div>
        </React.Fragment>
      ) : (
        <TokenMiner
          allowManualEntry={false}
          contentLength={contentLength}
          defaultAddress={defaultAddress}
          renderError={renderError}
          input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
          onCancel={closeModal}
          onGenerateToken={generateToken}
          onDone={e => {
            e.preventDefault()
            console.log('view account...')
            history.push(`/me?tour=true`)
          }}
          worker="QmbiSa3PSXwRw6aoCRUcEDB4F2c9jvz2UMZJJbyetPA9aY"
        />
      )}
    </BasicModal>
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
      if (address) await this.updateAddress(address)
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
    if (address && address !== nextProps.defaultAddress) {
      this.reset()
      this.setState({ address: nextProps.defaultAddress }, () =>
        this.componentDidMount(),
      )
    }
  }
  updateAddress = async address => {
    // Check eligibility
    const res = await fetch(
      `https://568kysoy9c.execute-api.us-east-1.amazonaws.com/prod/accounts/${address}`,
    )
    if (!res.ok) {
      const error = (
        <React.Fragment>
          <p>Sorry, but LPT cannot be mined for this account ({address}). </p>
          <p>
            <strong>
              Please use another account or try again when mining is open to all
              around late July or early August (block #6034099).
            </strong>
          </p>
          <p>
            Alternatively, join the{' '}
            <a href="https://livepeercommunity.org/" target="_blank">
              Decentralized Livepeer Community
            </a>{' '}
            to learn about other ways you can earn LPT and take part in
            community calls, meetups, hackathons, grant programs and more.
          </p>
        </React.Fragment>
      )
      this.setState({ error })
      return res
    }
    return res
  }
  reset = () => {
    this.setState({
      address: '',
      done: false,
      error: '',
      progress: null,
      proof: '',
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
    const { miner } = this
    const { input, contentLength } = this.props
    this.setState({ address, proof: '' })
    const { ok } = await this.updateAddress(address)
    this.setState({ ready: true, progress: { tree: 0, download: 0 } })
    if (ok)
      this.setState({
        proof: await miner.getProof(input, address.substr(2), contentLength),
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

const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    addressLocked,
    done,
    generateToken,
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
        {!loading &&
          !progress && (
            <p>
              Enter your ETH address and hit the button below to start mining.
              Once you are done, you may claim your token.
            </p>
          )}
        {!progress && (
          <React.Fragment>
            <Field
              component="input"
              name="address"
              placeholder="ETH address"
              type="text"
              disabled={addressLocked}
              style={{
                width: '100%',
                height: 48,
                padding: 8,
                fontSize: 16,
              }}
            />
            <p style={{ fontSize: 12, marginBottom: 0 }}>
              <strong>Note:</strong> The mining process takes approximately 1 -
              5 mins.
            </p>
            <div style={{ textAlign: 'right', paddingTop: 24 }}>
              {onCancel && (
                <Button disabled={loading} onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                className="primary"
                disabled={loading}
                onClick={handleSubmit}
                style={{ marginRight: 0 }}
              >
                Start Mining
              </Button>
            </div>
          </React.Fragment>
        )}
        {/* During Mining... */}
        {!loading &&
          progress && (
            <React.Fragment>
              <div
                style={{
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  paddingTop: 8,
                  display: done ? 'none' : '',
                }}
              >
                <p style={{ fontWeight: 400, padding: '0 16px' }}>
                  Mining Status:
                </p>
                <ol>
                  <li
                    style={{
                      textDecoration:
                        progress.download === 1 ? 'line-through' : '',
                      opacity: progress.download === 1 ? 0.5 : 1,
                    }}
                  >
                    Downloading Input Data ({(progress.download * 100).toFixed(
                      2,
                    )}%)
                  </li>
                  <li
                    style={{
                      textDecoration: progress.tree !== 0 ? 'line-through' : '',
                      opacity: progress.tree !== 0 ? 0.5 : 1,
                    }}
                  >
                    Preparing... ({(progress.tree === 0 ? 50 : 100).toFixed(2)}%)
                  </li>
                  <li
                    style={{
                      textDecoration: progress.tree === 1 ? 'line-through' : '',
                      opacity: progress.tree === 1 ? 0.5 : 1,
                    }}
                  >
                    Generating Merkle Proof ({(progress.tree * 100).toFixed(2)}%)
                  </li>
                </ol>
                <ProgressBar
                  done={progress.download + progress.tree === 2}
                  style={{
                    background:
                      progress.download + progress.tree < 2
                        ? '#ccc'
                        : 'var(--primary)',
                    borderRadius: 4,
                    margin: 16,
                    padding: '4px 8px',
                    textAlign: 'right',
                    transition: 'all .5s linear',
                    width: `calc(${(100 * (progress.download + progress.tree)) /
                      2}% - 32px)`,
                    color: '#000',
                  }}
                >{`${((100 * (progress.download + progress.tree)) / 2) |
                  0}%`}</ProgressBar>
              </div>
              <div>
                {proof ? (
                  <React.Fragment>
                    {done ? (
                      <p>
                        Congratulations! You are officially a Livepeer Token
                        holder and are able to participate as a delegator.
                        Please visit your account page to learn how to bond your
                        token and earn token rewards and ETH fees.
                      </p>
                    ) : (
                      <p>
                        Mining complete! You may now claim your Livepeer Token.
                      </p>
                    )}
                    <GenerateTokenForm
                      initialValues={{ address: values.address, proof }}
                      onCancel={onCancel}
                      onDone={onDone}
                      onSubmit={generateToken}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>
                      Almost there! Please remain patient as this process may
                      take several minutes.
                    </p>
                    <div style={{ textAlign: 'right' }}>
                      <Button className="primary" disabled>
                        Mining...Please Wait
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

export default enhance(MiningView)
