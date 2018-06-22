import * as React from 'react'
import { Form, Field } from 'react-final-form'
// import EthereumTx from 'ethereumjs-tx'
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
  const defaultAddress = coinbase.data.coinbase
  const contentLength = 51961420
  const closeModal = () => history.push(history.location.pathname)
  const formatError = err =>
    /sorry/i.test(err)
      ? err
      : `Sorry, mining is unavailable at this time. Please try again later. ${err}`
  return (
    <BasicModal title="Mine Livepeer Token" onClose={closeModal}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TokenMiner
          allowManualEntry={true}
          contentLength={contentLength}
          defaultAddress={defaultAddress}
          formatError={formatError}
          input="QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r"
          onCancel={closeModal}
          worker="QmQfp4zZ6p9CKy6tEwKMWqRtg1DSNG5pLsajg3Rjk3yTeW"
        />
      )}
    </BasicModal>
  )
}

class TokenMiner extends React.Component {
  static defaultProps = {
    defaultAddress: '',
    allowManualEntry: false,
  }
  state = {
    address: this.props.defaultAddress,
    ready: false,
    error: '',
    proof: '',
    progress: null,
  }
  async componentDidMount() {
    try {
      const { worker } = this.props
      const { address } = this.state
      this.miner = await new MerkleMiner({
        gateway: 'http://localhost:8080/ipfs',
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
    // TODO: move into GraphQL schema
    console.log('generate token for address', address)
    console.log('with proof', proof)
    const { livepeer } = window
    livepeer.config.eth.sendTransaction({
      ...livepeer.config.defaultTx,
      to: '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8',
      value: '0',
      data:
        `0x2c84bfa6000000000000000000000000${address.substr(2)}` +
        '0000000000000000000000000000000000000000000000000000000000000040' +
        '00000000000000000000000000000000000000000000000000000000000002c0' +
        proof,
    })
  }
  render() {
    const { allowManualEntry, formatError, onCancel } = this.props
    const { address, error, progress, proof, ready } = this.state
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
        generateToken={this.generateToken}
        initialValues={{ address }}
        loading={!ready && address}
        progress={progress}
        proof={proof}
        onCancel={onCancel}
        onSubmit={this.getProof}
      />
    )
  }
}

const GenerateTokenForm: React.ComponentType<GenerateTokenFormProps> = withProp(
  'component',
  ({ handleSubmit, onCancel }) => {
    return (
      <React.Fragment>
        <Field component="input" name="address" type="hidden" />
        <Field component="input" name="proof" type="hidden" />
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel}>Cancel</Button>
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
    generateToken,
    handleSubmit,
    loading,
    onCancel,
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
    return (
      <React.Fragment>
        {loading && <p>Initializing miner...</p>}
        {!loading &&
          !progress && (
            <p>
              Ready to mine some LPT? Enter your ETH address and hit the button
              below to start mining!
            </p>
          )}
        {!loading &&
          progress && (
            <React.Fragment>
              <div
                style={{
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  paddingTop: 8,
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
                <div
                  style={{
                    background:
                      progress.download + progress.tree < 2
                        ? '#ccc'
                        : 'var(--primary)',
                    borderRadius: 4,
                    margin: 16,
                    padding: '4px 8px',
                    textAlign: 'right',
                    transition: 'all 1s linear',
                    width: `calc(${100 *
                      (progress.download + progress.tree) /
                      2}% - 32px)`,
                    color: '#000',
                  }}
                >{`${(100 * (progress.download + progress.tree) / 2) |
                  0}%`}</div>
              </div>
              <div>
                {proof ? (
                  <React.Fragment>
                    <p>
                      Mining complete! Now, you are ready to claim your Livepeer
                      Token.
                    </p>
                    <GenerateTokenForm
                      initialValues={{ address: values.address, proof }}
                      onCancel={onCancel}
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
        {!progress && (
          <React.Fragment>
            <Field
              component="input"
              name="address"
              placeholder="ETH address"
              type="text"
              style={{
                width: '100%',
                height: 48,
                padding: 8,
                fontSize: 16,
              }}
            />
            <div style={{ textAlign: 'right', paddingTop: 24 }}>
              <Button disabled={loading}>Cancel</Button>
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
      </React.Fragment>
    )
  },
)(Form)

export default enhance(MiningView)
