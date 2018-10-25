import * as React from 'react'
import { Form, Field } from 'react-final-form'
import MerkleMiner from '@livepeer/merkle-miner'
import ProgressBar from './helpers'
import MiningArea from './MiningArea'
import MiningProgress from './MiningProgress'
import MiningSuccess from './MiningSuccess'
import NoTokensPage from './NoTokens'
import RemainingTokens from './RemainingTokens'
import { withProp } from '../../enhancers'
import { Button } from '../../components'

const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    amtLpt,
    balance,
    cancelSave,
    changeGas,
    defaultAddress,
    done,
    edit,
    editGas,
    estimCost,
    gas,
    handleReset,
    handleSubmit,
    loading,
    lowBal,
    onCancel,
    onDone,
    progress,
    progressBar,
    proof,
    remainingTokens,
    saveGas,
    stakeTokens,
    subProofs,
    ...props
  }) => {
    return (
      <React.Fragment>
        <RemainingTokens
          progressBar={progressBar}
          remainingTokens={remainingTokens}
        />
        <div className="mining-area">
          {defaultAddress.length === 0 ? (
            <React.Fragment>
              <h2 className="instruct-heading">Mine livepeer token</h2>
              <p>
                In order to mine, you will need to log into your ETH account
                using the metamask plugin. If you are not sure how to do this,
                please read our guide:
              </p>
              <h3 style={{ margin: '30px' }}>
                <a
                  href="https://forum.livepeer.org/t/how-to-install-metamask-on-chrome-browser-to-enable-web-3-0/272"
                  target="_blank"
                >
                  How to Install MetaMask &rarr;
                </a>
              </h3>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Before Mining... if there are fewer than 5 LPT remaining, show the NoTokens page */}
              {loading && <p>Initializing miner...</p>}
              {parseInt(remainingTokens) <= 5 ? (
                <NoTokensPage />
              ) : (
                <React.Fragment>
                  <MiningArea
                    amtLpt={amtLpt}
                    balance={balance}
                    cancelSave={cancelSave}
                    changeGas={changeGas}
                    edit={edit}
                    editGas={editGas}
                    estimCost={estimCost}
                    gas={gas}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    lowBal={lowBal}
                    progress={progress}
                    saveGas={saveGas}
                  />

                  <MiningProgress
                    progressBar={progressBar}
                    loading={loading}
                    done={done}
                    progress={progress}
                    subProofs={subProofs}
                  />

                  <MiningSuccess
                    amtLpt={amtLpt}
                    handleReset={handleReset}
                    loading={loading}
                    progressBar={progressBar}
                    proof={proof}
                    stakeTokens={stakeTokens}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  },
)(Form)

export { MineProofForm }
