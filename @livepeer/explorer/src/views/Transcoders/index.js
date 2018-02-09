import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
import { queries } from '@livepeer/graphql-sdk'
import BN from 'bn.js'
import styled from 'styled-components'
import {
  Cpu as CpuIcon,
  DownloadCloud as DownloadCloudIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Star as StarIcon,
  Zap as VideoIcon,
} from 'react-feather'
import {
  formatBalance,
  formatPercentage,
  pathInfo,
  promptForArgs,
  toBaseUnit,
} from '../../utils'
import {
  Avatar,
  Banner,
  BasicNavbar,
  BasicModal,
  Button,
  Content,
  MetricBox,
  PageHeading,
  ScrollToTopOnMount,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type Transcoder = {
  id: string,
  active: boolean,
  status: string,
  lastRewardRound: string,
  blockRewardCut: string,
  feeShare: string,
  pricePerSegment: string,
  pendingBlockRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  totalStake: string,
}

type Props = {
  history: {
    push: (url: string) => void,
    location: {
      search: string,
    },
  },
  loading: boolean,
  match: { path: string },
  onBondLPT: (url: string) => Promise<void>,
  transcoders: Array<Transcoder>,
}

const TranscodersView = ({
  error,
  history,
  loading,
  match,
  transcoders,
  approve,
  bondToken,
  modal,
  modalType,
  showModal,
  bonding,
  updateBonding,
  ...props
}) => {
  const canBond = window.livepeer.config.defaultTx.from !== EMPTY_ADDRESS
  const searchParams = new URLSearchParams(history.location.search)
  const sort = searchParams.get('sort') || 'totalStake'
  const order = searchParams.get('order') || 'desc'
  const asc = order === 'asc'
  const total = transcoders.length
  const compareFn = (a, b) => {
    const _a = new BN(a[sort], 10)
    const _b = new BN(b[sort], 10)
    const mul = asc ? 1 : -1
    return _a.cmp(_b) * mul
  }
  // console.log(props)
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <PageHeading>
          <CpuIcon color="#fff" size={32} />&nbsp;Transcoders
        </PageHeading>
      </Banner>
      <Content>
        {/** Empty State */ !total && (
          <p style={{ textAlign: 'center' }}>
            {loading && 'Loading transcoder data...'}
            {!loading && 'There are no transcoders'}
          </p>
        )}
        {/** Toolbar */ !total ? null : (
          <div style={{ display: 'flex' }}>
            <p>
              Showing 1 - {total} of {total}
            </p>
            <div
              style={{
                display: 'inline-flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
                  sort by: &nbsp;
                </span>
                <select
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('sort', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}
                >
                  <option value="totalStake">Total Stake</option>
                  <option value="blockRewardCut">Reward Cut</option>
                  <option value="feeShare">Fee Share</option>
                  <option value="pricePerSegment">Price</option>
                </select>
              </div>
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
                  order by: &nbsp;
                </span>
                <select
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('order', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Results */ [...transcoders].sort(compareFn).map(props => (
          <TranscoderCard
            key={props.id}
            {...props}
            onBond={async e => {
              updateBonding(bonding => {
                return {
                  ...bonding,
                  values: { to: props.id },
                }
              })
              return showModal(true)
              try {
                e.preventDefault()
                const args = promptForArgs([
                  {
                    ask: 'How Much LPT would you like to bond?',
                    format: toBaseUnit,
                  },
                ])
                if (args.length < 1)
                  return console.warn('Aborting transaction...')
                const [amount] = args
                if (
                  !window.confirm(
                    `# Bonding Confirmation\n\nYou are about to bond ${formatBalance(
                      amount,
                      18,
                    )} LPT to ${
                      props.id
                    }.\n\nDo you wish to continue?\n\n__Info__: By clicking "OK", MetaMask will prompt you twice -- first for an approval transaction, and then for the actual bonding transaction. You will be required to submit both in order to complete the bonding process.`,
                  )
                ) {
                  return console.warn('Aborting transaction...')
                }
                window.alert('Please approve the bond amount with MetaMask')
                await approve({ type: 'bond', amount })
                window.alert(
                  'Please confirm the bond transaction with MetaMask',
                )
                await bondToken({ to: props.id, amount })
                window.alert(
                  `# Congratulations\n\nYou have successfully bonded ${formatBalance(
                    amount,
                    18,
                  )} LPT to ${props.id}`,
                )
              } catch (err) {
                console.error(err)
                window.alert(
                  `# Unable to Bond\n\nLooks like there was a problem with the transaction:\n\n${
                    err.message
                  }`,
                )
              }
            }}
          />
        ))}
      </Content>
      {modal &&
        {
          bondApprove: (
            <BasicModal
              title="Bond to Transcoder"
              onClose={() => showModal(false)}
            >
              <p>{bonding.values.to}</p>
              <p>Enter an Amount</p>
              <input
                id="bondApproveAmount"
                type="text"
                style={{
                  width: '90%',
                  height: 48,
                  padding: 8,
                  fontSize: 16,
                }}
              />{' '}
              LPT
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 'normal' }}>Note</strong>: By
                clicking "Submit", MetaMask will prompt you twice — first for an
                approval transaction, and then for a bonding transaction. You
                must submit both in order to complete the bonding process.
              </p>
              <div style={{ textAlign: 'right', paddingTop: 24 }}>
                <Button onClick={() => showModal(false)}>Cancel</Button>
                <Button
                  onClick={async e => {
                    try {
                      const { value } = document.getElementById(
                        'bondApproveAmount',
                      )
                      const amount = toBaseUnit(value)
                      const { to } = bonding.values
                      await approve({ type: 'bond', amount })
                      await bondToken({ to, amount })
                    } catch (err) {
                      console.error(err)
                      window.alert(
                        `# Unable to Bond\n\nLooks like there was a problem with the transaction:\n\n${
                          err.message
                        }`,
                      )
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </BasicModal>
          ),
          bondConfirm: <BasicModal title="Confirm Bond" />,
          bondSuccess: <BasicModal title="Bond Success!" />,
          bondError: <BasicModal title="Bond Fail" />,
        }[modalType]}
    </React.Fragment>
  )
}

const TranscoderCard = ({ active, id, status, onBond, ...stats }) => {
  return (
    <TranscoderCardContainer>
      <TranscoderCardBasicInfo id={id} status={status} active={active} />
      <TranscoderStats {...stats} />
      {onBond && <TranscoderActionsPlaceholder />}
      {onBond && <TranscoderActions onBond={onBond} />}
    </TranscoderCardContainer>
  )
}

const TranscoderCardBasicInfo = ({ active, id, status }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: 240,
      }}
    >
      <Link to={`/accounts/${id}/transcoding`}>
        <Avatar id={id} size={32} />
      </Link>
      <div
        style={{
          display: 'inline-block',
          width: 128,
          padding: 7,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: 14,
        }}
      >
        <Link
          to={`/accounts/${id}/transcoding`}
          style={{ color: '#000', textDecoration: 'none' }}
        >
          {id.substr(0, 10)}...
        </Link>
      </div>
      <div
        style={{
          padding: 7,
          display: 'inline-block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: 14,
          color: active ? 'darkseagreen' : 'orange',
        }}
      >
        {active ? 'active' : 'inactive'}
      </div>
    </div>
  )
}

const TranscoderStats = ({
  blockRewardCut,
  feeShare,
  pricePerSegment,
  totalStake,
}) => {
  return (
    <div style={{ display: 'inline-block', minWidth: 320 }}>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 64 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Reward Cut</div>
        <div style={{ fontSize: 14 }}>
          {formatPercentage(blockRewardCut, 2)}%
        </div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 64 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Fee Share</div>
        <div style={{ fontSize: 14 }}>{formatPercentage(feeShare, 2)}%</div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 80 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Price</div>
        <div style={{ fontSize: 14 }}>{pricePerSegment} WEI</div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 128 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Total Stake</div>
        <div style={{ fontSize: 14 }}>{formatBalance(totalStake, 2)} LPT</div>
      </div>
    </div>
  )
}

const TranscoderActions = styled(({ className, onBond }) => {
  return (
    <div className={className}>
      <Button onClick={onBond} style={{ margin: 0 }}>
        <StarIcon size={12} />
        <span style={{ marginLeft: 8 }}>Bond</span>
      </Button>
    </div>
  )
})`
  display: inline-block;
  flex-grow: 1;
  text-align: right;
  background: #fff;
`

const TranscoderActionsPlaceholder = styled(({ className }) => {
  return (
    <div className={className}>
      <MoreHorizontalIcon size={32} color="rgba(0, 0, 0, .25)" />
    </div>
  )
})`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 32px;
  margin: auto;
  display: block;
  height: 32px;
  pointer-events: none;
`

const TranscoderCardContainer = styled.div`
  position: relative;
  display: inline-flex;
  flex-flow: row wrap;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 2px;
  padding: 16px;
  overflow: auto;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
  a:hover {
    text-decoration: underline !important;
  }
  ${TranscoderActions} {
    opacity: 0;
    transition: all 0.2s linear;
  }
  ${TranscoderActionsPlaceholder} {
    opacity: 1;
    transition: all 0.2s linear;
  }
  :hover {
    ${TranscoderActions} {
      opacity: 1;
    }
    ${TranscoderActionsPlaceholder} {
      opacity: 0;
    }
  }
`

export default enhance(TranscodersView)
