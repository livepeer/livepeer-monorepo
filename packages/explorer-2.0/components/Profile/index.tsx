/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Copy from '../../public/img/copy.svg'
import Check from '../../public/img/check.svg'
import Link from '../../public/img/link.svg'
import { Transcoder, Delegator, ThreeBoxSpace } from '../../@types'
import { getDelegationStatusColor } from '../../lib/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Flex } from 'theme-ui'
import ReactTooltip from 'react-tooltip'
import Chip from '../Chip'
import EditProfile from '../EditProfile'
import gql from 'graphql-tag'
import ShowMoreText from 'react-show-more-text'

interface Props {
  account: string
  role: string
  hasLivepeerToken: boolean
  threeBoxSpace: ThreeBoxSpace
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
  threeBoxSpace,
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
        {threeBoxSpace && threeBoxSpace.image ? (
          <img
            sx={{
              objectFit: 'cover',
              borderRadius: 1000,
              width: '100%',
              height: '100%',
            }}
            src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
          />
        ) : (
          <QRCode
            style={{
              borderRadius: 1000,
              width: '100%',
              height: '100%',
            }}
            bgColor="#9326E9"
            fgColor={`#${account.substr(2, 6)}`}
            value={account}
          />
        )}

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
      <Flex sx={{ alignItems: 'center', mb: '10px' }}>
        <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
          <Styled.h1 sx={{ display: 'flex', alignItems: 'center' }}>
            {threeBoxSpace && threeBoxSpace.name
              ? threeBoxSpace.name
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
        {isMyAccount && (
          <EditProfile account={account} threeBoxSpace={threeBoxSpace} />
        )}
      </Flex>
      {threeBoxSpace && threeBoxSpace.url && (
        <Flex sx={{ mb: 2, alignItems: 'center' }}>
          <Link sx={{ color: 'muted', mr: 1 }} />
          <a
            sx={{ fontSize: 1, color: 'primary' }}
            href=""
            target="__blank"
            rel="noopener noreferrer"
          >
            {threeBoxSpace.url.replace(/(^\w+:|^)\/\//, '')}
          </a>
        </Flex>
      )}
      {isLivepeerAware && <Chip label={role} />}
      {threeBoxSpace && threeBoxSpace.description && (
        <div sx={{ mt: 3 }}>
          <ShowMoreText
            lines={3}
            more={<span sx={{ color: 'primary' }}>Show more</span>}
            less={<span sx={{ color: 'primary' }}>Show Less</span>}
          >
            {threeBoxSpace.description}
          </ShowMoreText>
        </div>
      )}
    </div>
  )
}
