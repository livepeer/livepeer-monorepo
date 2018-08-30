import React from 'react'
import { ProgressBar } from './helpers'

const RemainingTokens = ({ progressBar, remainingTokens }) => {
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
            >
              {`${(
                ((10000000 - parseInt(remainingTokens)) / 10000000) *
                100
              ).toFixed(2)}% `}{' '}
              of LPT distributed
            </ProgressBar>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default RemainingTokens
