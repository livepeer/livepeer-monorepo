import * as React from 'react'
import { Form, Field } from 'react-final-form'
import styled, { keyframes } from 'styled-components'
import MerkleMiner from '@livepeer/merkle-miner'
import TableData from './TableData'
import { withProp } from '../../enhancers'
import { Button } from '../../components'

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

const MineProofForm: React.ComponentType<MineProofFormProps> = withProp(
  'component',
  ({
    addressLocked,
    amtLpt,
    done,
    editGas,
    gas,
    gas_low,
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
              {parseFloat(remainingTokens).toLocaleString('en', {
                maximumFractionDigits: 2,
              })}
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
                    <TableData
                      tableData="Account balance:"
                      help="The balance on your web3 enabled browser or wallet plugin."
                    />
                    <TableData
                      beforeData={balance.toString()}
                      tableData="Ether"
                    />
                  </tr>
                  {lowBal && (
                    <tr>
                      <TableData
                        tableData="You do not have sufficient funds in your web-3 wallet to mine LPT tokens."
                        colSpan="2"
                      />
                    </tr>
                  )}
                  <tr>
                    <TableData
                      tableData="Gas price:"
                      help="The current market price of 1 gas according to EthGasStation."
                    />
                    <TableData tableData="Gas price" beforeData={gas} />
                  </tr>
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
                    <TableData
                      tableData="Estimated cost:"
                      help={`Total total cost of one round of mining and generating
                          tokens for the 20 eligible ethereum addresses.`}
                    />
                    <TableData beforeData={estimCost} tableData="Ether" />
                  </tr>
                  <tr>
                    <TableData
                      tableData="Estimated time:"
                      help={`The time it takes to complete one round of mining.`}
                    />
                    <TableData beforeData="1 - 5" tableData="Min" />
                  </tr>
                  <tr>
                    <TableData
                      tableData="Estimated number of LPT tokens you will earn:"
                      help={`The portion of the LPT tokens that will be issued to
                          you in one round of mining.`}
                    />
                    <TableData beforeData={amtLpt} tableData="LPT" />
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
                  {' '}
                  {`${((100 * progressBar) / 3) | 0}%`}{' '}
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
                        tokens for the eligible Ethereum addresses for you.
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
                  {proof && (
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
                  )}
                </div>
              </React.Fragment>
            )}
        </div>
      </React.Fragment>
    )
  },
)(Form)

export { MineProofForm }
