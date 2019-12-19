/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Styled, jsx } from 'theme-ui'
import QRCode from 'qrcode.react'
import Copy from '../../public/img/copy.svg'
import ReactTooltip from 'react-tooltip'
import Check from '../../public/img/check.svg'
import LinkIcon from '../../public/img/link.svg'
import { Transcoder, Delegator, ThreeBoxSpace } from '../../@types'
import { getDelegationStatusColor } from '../../lib/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Flex } from 'theme-ui'
import Chip from '../Chip'
import EditProfile from '../EditProfile'
import ShowMoreText from 'react-show-more-text'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'

interface Props {
  account: string
  role: string
  refetch?: any
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
  refetch,
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
        {process.env.THREEBOX_ENABLED &&
        threeBoxSpace &&
        threeBoxSpace.image ? (
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
            {process.env.THREEBOX_ENABLED && threeBoxSpace && threeBoxSpace.name
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
        {process.env.THREEBOX_ENABLED && isMyAccount && threeBoxSpace && (
          <EditProfile
            account={account}
            refetch={refetch}
            threeBoxSpace={threeBoxSpace}
          />
        )}
      </Flex>
      {process.env.THREEBOX_ENABLED && threeBoxSpace && threeBoxSpace.website && (
        <Flex sx={{ mb: 2, alignItems: 'center' }}>
          <LinkIcon sx={{ color: 'muted', mr: 1 }} />
          <a
            sx={{ fontSize: 1, color: 'primary' }}
            href={threeBoxSpace.website}
            target="__blank"
            rel="noopener noreferrer"
          >
            {threeBoxSpace.website.replace(/(^\w+:|^)\/\//, '')}
          </a>
        </Flex>
      )}
      {isLivepeerAware && <Chip label={role} />}

      {process.env.THREEBOX_ENABLED &&
        threeBoxSpace &&
        threeBoxSpace.description && (
          <div sx={{ mt: 3, a: { color: 'primary' } }}>
            <ShowMoreText
              lines={3}
              more={<span sx={{ color: 'primary' }}>Show more</span>}
              less={<span sx={{ color: 'primary' }}>Show Less</span>}
            >
              <div>{threeBoxSpace.description}</div>
            </ShowMoreText>
          </div>
        )}
      {process.env.THREEBOX_ENABLED &&
        threeBoxSpace &&
        threeBoxSpace.addressLinks &&
        threeBoxSpace.addressLinks.length > 0 &&
        role != 'Orchestrator' && (
          <div sx={{ mt: 3 }}>
            <div
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                p: '14px',
                borderRadius: 10,
                border: '1px dashed',
                borderColor: 'border',
              }}
            >
              <div
                sx={{ mb: '6px', fontWeight: 600, fontSize: 0, color: 'muted' }}
              >
                External Account
              </div>
              <Flex>
                {threeBoxSpace.addressLinks.map((link, i) => (
                  <Link
                    href={`/accounts/[account]/[slug]`}
                    as={`/accounts/${link.address}/campaign`}
                    passHref
                    key={i}
                  >
                    <a
                      sx={{
                        mr: threeBoxSpace.addressLinks.length - 1 == i ? 0 : 1,
                        borderRadius: 6,
                        display: 'inline-flex',
                        bg: 'surface',
                        py: '4px',
                        px: '12px',
                        fontSize: 0,
                        fontWeight: 600,
                        color: 'primary',
                      }}
                    >
                      {link.address
                        .replace(link.address.slice(10, 34), '…')
                        .toLowerCase()}
                    </a>
                  </Link>
                ))}
              </Flex>
            </div>
          </div>
        )}
    </div>
  )
}
