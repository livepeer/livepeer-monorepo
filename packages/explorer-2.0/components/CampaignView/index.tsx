import { Flex } from 'theme-ui'
import Card from '../Card'
import { abbreviateNumber, expandedPriceLabels } from '../../lib/utils'
import { Box } from 'theme-ui'
import { MdCheck, MdClose } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'
import Help from '../../public/img/help.svg'
import { useRef, useState } from 'react'
import Price from '../Price'
import {
  Menu,
  MenuItemRadioGroup,
  MenuItemRadio,
} from '@modulz/radix/dist/index.es'

const Index = ({ currentRound, transcoder }) => {
  const [isPriceSettingOpen, setIsPriceSettingOpen] = useState(false)
  const targetRef = useRef()
  const [priceSetting, setPriceSetting] = useState('1t pixels')
  const callsMade = transcoder.pools.filter((r) => r.rewardTokens != null)
    .length

  const PriceSettingToggle = () => (
    <span
      ref={targetRef}
      onClick={(e) => {
        e.stopPropagation()
        setIsPriceSettingOpen(true)
      }}
      sx={{
        cursor: 'pointer',
        fontSize: 12,
      }}
    >
      <span sx={{ mx: '4px' }}>/</span>
      <span
        title={`Price of transcoding per ${expandedPriceLabels[priceSetting]}`}
        sx={{
          color: 'text',
          borderBottom: '1px dashed',
          borderColor: 'text',
          transition: '.3s',
          ':hover': { color: 'primary' },
          ':active': { color: 'primary' },
        }}
      >
        {priceSetting}
      </span>
    </span>
  )
  return (
    <Box sx={{ pt: 4 }}>
      <Menu
        style={{
          background: '#1E2026',
          padding: 0,
          boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
        }}
        isOpen={isPriceSettingOpen}
        onClose={() => setIsPriceSettingOpen(false)}
        buttonRef={targetRef}
      >
        <MenuItemRadioGroup
          value={priceSetting}
          onChange={(value) => {
            setPriceSetting(value)
          }}
        >
          <MenuItemRadio value="pixel" label="1 pixel" />
          <MenuItemRadio value="1m pixels" label="1 million pixels" />
          <MenuItemRadio value="1b pixels" label="1 billion pixels" />
          <MenuItemRadio value="1t pixels" label="1 trillion pixels" />
        </MenuItemRadioGroup>
      </Menu>
      <Box
        sx={{
          display: 'grid',
          gridGap: [2, 2, 2],
          gridTemplateColumns: [
            'repeat(auto-fit, minmax(33%, 1fr))',
            'repeat(auto-fit, minmax(33%, 1fr))',
            'repeat(auto-fit, minmax(33%, 1fr))',
            `repeat(auto-fit, minmax(30%, 1fr))`,
          ],
        }}
      >
        <Card
          sx={{ flex: 1 }}
          title="Total Stake"
          subtitle={
            <Box
              sx={{
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {abbreviateNumber(transcoder.totalStake, 4)}
              <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
            </Box>
          }
        />
        <Card
          sx={{ flex: 1 }}
          title="Earned Fees"
          subtitle={
            <Box
              sx={{
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {transcoder.totalVolumeETH
                ? abbreviateNumber(transcoder.totalVolumeETH, 3)
                : 0}
              <span sx={{ ml: 1, fontSize: 12 }}>ETH</span>
            </Box>
          }
        />
        <Card
          title="Reward Calls"
          subtitle={
            <Flex
              sx={{
                alignItems: 'center',
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {callsMade}/{transcoder.pools.length}
            </Flex>
          }
        />
        <Card
          sx={{ flex: 1 }}
          title="Reward Cut"
          subtitle={
            <Box
              sx={{
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {!transcoder.rewardCut
                ? 0
                : parseInt(transcoder.rewardCut, 10) / 10000}
              %
            </Box>
          }
        />
        <Card
          sx={{ flex: 1 }}
          title="Fee Cut"
          subtitle={
            <Box
              sx={{
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {!transcoder.feeShare
                ? 0
                : 100 - parseInt(transcoder.feeShare, 10) / 10000}
              %
            </Box>
          }
        />
        <Card
          sx={{ flex: 1 }}
          title={
            <Flex sx={{ alignItems: 'center' }}>
              <Box>
                Price
                <PriceSettingToggle />
              </Box>
              <Flex>
                <ReactTooltip
                  id="tooltip-price"
                  className="tooltip-price"
                  place="top"
                  type="dark"
                  effect="solid"
                  getContent={() => {
                    return `Price of transcoding per ${expandedPriceLabels[priceSetting]}`
                  }}
                />
                <Help
                  key="tooltip-price"
                  data-tip=""
                  data-for="tooltip-price"
                  sx={{
                    color: 'muted',
                    cursor: 'pointer',
                    ml: 1,
                  }}
                />
              </Flex>
            </Flex>
          }
          subtitle={
            <Box
              sx={{
                fontSize: [3, 3, 4, 4],
                color: 'text',
                fontWeight: 500,
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {transcoder.price <= 0 ? (
                'N/A'
              ) : (
                <Price value={transcoder.price} per={priceSetting} />
              )}
            </Box>
          }
        />
        {transcoder?.lastRewardRound?.id && (
          <Card
            sx={{ flex: 1 }}
            title={
              <Flex sx={{ alignItems: 'center' }}>
                <Box sx={{ color: 'muted' }}>Last Reward Round</Box>
                <Flex>
                  <ReactTooltip
                    id="tooltip-last-reward-round"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <Help
                    data-tip="The last round that an orchestrator received rewards while active. A checkmark indicates it called reward for the current round."
                    data-for="tooltip-last-reward-round"
                    sx={{
                      color: 'muted',
                      cursor: 'pointer',
                      ml: 1,
                    }}
                  />
                </Flex>
              </Flex>
            }
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  position: 'relative',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                <Flex sx={{ alignItems: 'center' }}>
                  {transcoder.lastRewardRound.id}{' '}
                  {transcoder.active && (
                    <Flex>
                      {transcoder.lastRewardRound.id === currentRound.id ? (
                        <MdCheck
                          sx={{ fontSize: 2, color: 'primary', ml: 1 }}
                        />
                      ) : (
                        <MdClose sx={{ fontSize: 2, color: 'red', ml: 1 }} />
                      )}
                    </Flex>
                  )}
                </Flex>
              </Box>
            }
          />
        )}
      </Box>
    </Box>
  )
}

export default Index
