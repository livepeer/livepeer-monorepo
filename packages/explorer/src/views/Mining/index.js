import * as React from 'react'
import { Prompt } from 'react-router-dom'
import { Form, Field } from 'react-final-form'
import Confetti from 'react-dom-confetti'
import styled, { keyframes } from 'styled-components'
import MerkleMiner from '@livepeer/merkle-miner'
import { withProp } from '../../enhancers'
import { BasicModal, Button } from '../../components'
import enhance from './enhance'

type MiningViewProps = {}

const MiningView: React.ComponentType<MiningViewProps> = ({
  coinbase,
  history,
}) => {
  const { loading } = coinbase
  // temporarily hard-code valid address for testing
  const defaultAddress = '0x4fe9367ef5dad459ae9cc4265c69b1b10a4e1288' //coinbase.data.coinbase
  const contentLength = 51961420
  const closeModal = () => history.push(history.location.pathname)
  const formatError = err =>
    /sorry/i.test(err)
      ? err
      : `Sorry, mining is unavailable at this time. Please try again later. ${err}`
  return (
    <BasicModal title="Mine Livepeer Token">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TokenMiner
          allowManualEntry={false}
          contentLength={contentLength}
          defaultAddress={defaultAddress}
          formatError={formatError}
          input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
          onCancel={closeModal}
          onDone={e => {
            e.preventDefault()
            console.log('view account...')
            history.push(`/me?tour=true`)
          }}
          worker="QmQfp4zZ6p9CKy6tEwKMWqRtg1DSNG5pLsajg3Rjk3yTeW"
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
        gateway: 'http://dweb.link/ipfs',
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
      const error = `Sorry, but LPT cannot be mined for this account (${address}). Please use another account or try again when mining is unrestricted.`
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
  generateToken = async ({ address, proof }) => {
    try {
      // TODO: move into GraphQL schema
      console.log('generate token for address', address)
      console.log('with proof', proof)
      const { livepeer } = window
      await livepeer.config.eth.sendTransaction({
        ...livepeer.config.defaultTx,
        to: '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8',
        value: '0',
        data:
          `0x2c84bfa6000000000000000000000000${address.substr(2)}` +
          '0000000000000000000000000000000000000000000000000000000000000040' +
          '00000000000000000000000000000000000000000000000000000000000002c0' +
          proof,
      })
    } catch (err) {
      // Catch any error for now, so we always trigger success state
      console.warn(err)
    } finally {
      console.log('generated token!')
      this.setState({ done: true })
    }
  }
  render() {
    const { allowManualEntry, formatError, onCancel, onDone } = this.props
    const { address, done, error, progress, proof, ready } = this.state
    if (!ready && address) {
      return <p>Validating ETH address...</p>
    }
    return error ? (
      <React.Fragment>
        <p>{formatError(error)}</p>
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
    submitting,
    submitSucceeded,
    ...props
  }) => {
    // console.log(submitting, submitSucceeded, props)
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
    if (submitSucceeded && !submitting)
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
