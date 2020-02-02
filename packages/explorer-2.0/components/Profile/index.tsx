import { useState, useEffect } from 'react'
import { Styled, Box } from 'theme-ui'
import QRCode from 'qrcode.react'
import Copy from '../../public/img/copy.svg'
import Check from '../../public/img/check.svg'
import LinkIcon from '../../public/img/link.svg'
import { Transcoder, Delegator, ThreeBoxSpace } from '../../@types'
import { getDelegationStatusColor } from '../../lib/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Flex } from 'theme-ui'
import ReactTooltip from 'react-tooltip'
import Chip from '../Chip'
import EditProfile from '../EditProfile'
import ShowMoreText from 'react-show-more-text'
import Link from 'next/link'
import { nl2br } from '../../lib/utils'
import Button from '../Button'
import { useApolloClient } from '@apollo/react-hooks'

interface Props {
  account: string
  role: string
  refetch?: any
  hasLivepeerToken: boolean
  isMyDelegate: boolean
  threeBoxSpace: ThreeBoxSpace
  myAccount?: any
  delegator: Delegator
  transcoder: Transcoder
  isMyAccount: boolean
  status: string
}

export default ({
  myAccount,
  account,
  role = 'Orchestrator',
  hasLivepeerToken,
  isMyDelegate,
  delegator,
  status,
  refetch,
  transcoder,
  threeBoxSpace,
  isMyAccount = false,
  ...props
}: Props) => {
  const client = useApolloClient()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  return (
    <Box {...props}>
      <Box
        sx={{
          mb: [1, 1, 1, 2],
          width: [60, 60, 60, 70],
          height: [60, 60, 60, 70],
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

        <Box
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
      </Box>
      <Flex sx={{ alignItems: 'center', mb: '10px' }}>
        <CopyToClipboard text={account} onCopy={() => setCopied(true)}>
          <Styled.h1
            sx={{
              fontSize: [3, 3, 3, 5],
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {process.env.THREEBOX_ENABLED && threeBoxSpace && threeBoxSpace.name
              ? threeBoxSpace.name
              : account.replace(account.slice(5, 39), '…')}
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
      {process.env.THREEBOX_ENABLED && threeBoxSpace?.website && (
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
      {role === 'Tokenholder' && <Chip label={role} />}

      <Flex sx={{ display: ['flex', 'flex', 'flex', 'none'], mt: 2 }}>
        {(role === 'Orchestrator' || isMyDelegate) && (
          <Button
            sx={{ mr: 2 }}
            onClick={() =>
              client.writeData({
                data: {
                  stakingWidgetModalOpen: true,
                  selectedStakingAction: 'stake',
                },
              })
            }
          >
            Stake
          </Button>
        )}
        {isMyDelegate && (
          <Button
            onClick={() =>
              client.writeData({
                data: {
                  stakingWidgetModalOpen: true,
                  selectedStakingAction: 'unstake',
                },
              })
            }
            sx={{ color: 'red', borderColor: 'red' }}
            variant="outline"
          >
            Unstake
          </Button>
        )}
      </Flex>
      {process.env.THREEBOX_ENABLED && threeBoxSpace?.description && (
        <Box sx={{ mt: 3, a: { color: 'primary' } }}>
          <ShowMoreText
            lines={3}
            more={<span sx={{ color: 'primary' }}>Show more</span>}
            less={<span sx={{ color: 'primary' }}>Show Less</span>}
          >
            <Box
              sx={{ mt: 3, a: { color: 'primary' } }}
              dangerouslySetInnerHTML={{
                __html: nl2br(threeBoxSpace.description),
              }}
            />
          </ShowMoreText>
        </Box>
      )}
      {process.env.THREEBOX_ENABLED &&
        threeBoxSpace &&
        threeBoxSpace.addressLinks &&
        threeBoxSpace.addressLinks.length > 0 &&
        role != 'Orchestrator' && (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                p: '14px',
                borderRadius: 10,
                border: '1px dashed',
                borderColor: 'border',
              }}
            >
              <Box
                sx={{ mb: '6px', fontWeight: 600, fontSize: 0, color: 'muted' }}
              >
                External Account
              </Box>
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
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {link.address
                        .replace(link.address.slice(10, 34), '…')
                        .toLowerCase()}
                    </a>
                  </Link>
                ))}
              </Flex>
            </Box>
          </Box>
        )}
    </Box>
  )
}
