import React from 'react'

const MiningSuccess = ({
  amtLpt,
  handleReset,
  loading,
  progressBar,
  proof,
  stakeTokens,
}) => {
  return (
    <React.Fragment>
      {progressBar >= 3 && <h1>Success!</h1>}
      {!loading &&
        progressBar >= 3 && (
          <React.Fragment>
            <div className="success">
              {proof && (
                <React.Fragment>
                  <p>
                    You have successfully mined LPT tokens and earned {amtLpt}&nbsp;
                    tokens. The tokens are now available in your web3 wallet.
                  </p>
                  <p>There are two ways to earn additional LPT tokens:</p>
                  <ol>
                    <li>
                      Repeat this process by clicking the green "Repeat Mining"
                      button below.
                    </li>
                    <li>
                      Stake your LPT tokens : Delegate your LPT tokens to a
                      Livepeer transcoder and earn LPT's for contributing to the
                      LivePeer network.
                    </li>
                  </ol>
                  <div>
                    <a onClick={handleReset}>Repeat Mining</a>
                    <a onClick={stakeTokens}>Stake LPT tokens</a>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
    </React.Fragment>
  )
}

export default MiningSuccess
