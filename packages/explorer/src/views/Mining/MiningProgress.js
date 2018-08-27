import React from 'react'
import { ProgressBar } from './helpers'
import { Button } from '../../components'

const MiningProgress = ({
  progressBar,
  loading,
  done,
  progress,
  subProofs,
}) => {
  return (
    <React.Fragment>
      {progressBar < 3 && progressBar >= 0 && <h1>Mining...</h1>}
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
                background: progressBar < 3 ? '#ccc' : 'var(--primary)',
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
                    Executing the smart contracts for generating the LPT tokens
                    for the eligible Ethereum addresses for you.
                  </span>
                  <span
                    style={{
                      display: subProofs ? 'block' : 'none',
                      color: 'red',
                    }}
                  >
                    If this is taking too long, you can speed up transaction by
                    increasing your gas price from your web3 wallet.
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
    </React.Fragment>
  )
}

export default MiningProgress
