let instructions = function() {
  let data = {
    first: {
      heading: '1. Log in to Web 3 Wallet',
      instruction:
        'You will need a Web3 wallet such as MetaMask with enough Ethereum to pay for the Gas cost of executing the smart contracts that generate LPT tokens',
    },
    second: {
      heading: '2. Set Mining Parameters',
      instruction:
        'Selct your gas price. If your gas price is too low, the transaction might take longer or miners might not process your transaction.',
    },
    third: {
      heading: '3. Earn LPT tokens',
      instruction: `The Livepeer Mining smart contract will generate 2.4 LPT in each of the eligible Ethereum addresses. A portion of LPT generated will be allocated to you for claiming the address. <br>
                          Each round of mining generates tokens for 20 eligible Ethereum addresses. <br>
                          You do not need to provide the eligible ethereum addresses. Livepeer provides and submits the eligible Ethereum addresses for you.`,
    },
  }
  return data
}

export default instructions

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
