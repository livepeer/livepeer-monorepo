import * as React from 'react'

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

export default TokenMiner
