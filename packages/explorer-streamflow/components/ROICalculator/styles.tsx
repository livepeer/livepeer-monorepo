/** @jsx jsx */
import { Styled, jsx, Box, Flex } from 'theme-ui'

function abbreviateNumber(value) {
  let newValue = value
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let suffixNum = 0
  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  newValue = Number.parseFloat(newValue).toPrecision(3)

  newValue += suffixes[suffixNum]
  return newValue
}

export const Row = ({ label, percentChange, symbol, earnings, ...props }) => (
  <Box {...props}>
    <Flex sx={{ fontSize: 0, mb: 1, justifyContent: 'space-between' }}>
      <Styled.div sx={{ fontWeight: 500 }}>{label}</Styled.div>
      <Styled.div sx={{ fontFamily: 'monospace', color: 'muted' }}>
        {percentChange}
      </Styled.div>
    </Flex>
    <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        {abbreviateNumber(earnings)}
        <Styled.h6 as="span" sx={{ ml: 1 }}>
          {symbol}
        </Styled.h6>
      </Styled.h2>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        ${abbreviateNumber((earnings * 6.3).toFixed(2))}
      </Styled.h2>
    </Flex>
  </Box>
)

export const Input = ({ variant = 'primary', ...props }) => (
  <Styled.div
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      mb: 3,
      position: 'relative'
    }}>
    <Styled.div
      as="input"
      {...props}
      sx={{
        backgroundColor: 'transparent',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        borderBottom: '1px solid',
        borderColor: 'muted',
        p: 1,
        color: 'text',
        boxShadow: 'none',
        width: '100%',
        outline: 'none',
        fontSize: 26,
        fontFamily: 'monospace',
        '&::-webkit-inner-spin-button': {
          WebkitAppearance: 'none'
        },
        '&::-webkit-outer-spin-button': {
          WebkitAppearance: 'none'
        }
      }}
    />
    <Styled.div sx={{ fontWeight: 'bold', right: 0, position: 'absolute' }}>
      LPT
    </Styled.div>
  </Styled.div>
)
