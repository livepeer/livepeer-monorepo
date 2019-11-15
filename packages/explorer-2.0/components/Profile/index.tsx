/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Chip from '../../components/Chip'
import Copy from '../../public/img/copy.svg'
import Check from '../../public/img/check.svg'
import { Transcoder, Delegator } from '../../@types'
import { getDelegationStatusColor } from '../../lib/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Flex } from 'theme-ui'
import ReactTooltip from 'react-tooltip'

interface Props {
  account: string
  role: string
  hasLivepeerToken: boolean
  delegator: Delegator
  transcoder: Transcoder
  isMyAccount: boolean
  status: string
}

export default ({
  account,
  role = 'Orchestrator',
  hasLivepeerToken,
  delegator,
  status,
  transcoder,
  isMyAccount = false,
  ...props
}: Props) => {
  const isLivepeerAware =
    hasLivepeerToken || role == 'Orchestrator' || role == 'Tokenholder'

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  return (
    <div {...props}>
      <div
        sx={{
          mb: 2,
          width: 70,
          height: 70,
          position: 'relative',
        }}
      >
        <QRCode
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 1000,
          }}
          fgColor={`#${account.substr(2, 6)}`}
          value={account}
        />

        <div
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '-2px',
            bg: getDelegationStatusColor(status),
            border: '5px solid #131418',
            boxSizing: 'border-box',
            width: 24,
            height: 24,
            borderRadius: 1000,
          }}
        />
      </div>
      <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
        <Styled.h1 sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {isMyAccount
            ? 'My Account'
            : account.replace(account.slice(7, 37), '…')}
          <Flex
            data-for="copy"
            data-tip={`${copied ? 'Copied' : 'Copy address to clipboard'}`}
            sx={{
              ml: 1,
              mt: '3px',
              cursor: 'pointer',
              borderRadius: 1000,
              bg: 'surface',
              width: 26,
              height: 26,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReactTooltip
              id="copy"
              className="tooltip"
              place="top"
              type="dark"
              effect="solid"
            />
            {copied ? (
              <Check
                sx={{
                  width: 12,
                  height: 12,
                  color: 'muted',
                }}
              />
            ) : (
              <Copy
                sx={{
                  width: 12,
                  height: 12,
                  color: 'muted',
                }}
              />
            )}
          </Flex>
        </Styled.h1>
      </CopyToClipboard>
      {isLivepeerAware && <Chip label={role} />}
    </div>
  )
}
