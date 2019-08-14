/** @jsx jsx */
import { Styled, jsx, Box, Flex } from 'theme-ui'

export const Row = ({ label, percentChange, symbol, earnings, ...props }) => (
  <Box {...props}>
    <Flex sx={{ fontSize: 1, mb: 3, justifyContent: 'space-between' }}>
      <Styled.div>{label}</Styled.div>
      <Styled.div sx={{ fontFamily: 'monospace', color: 'muted' }}>
        {percentChange}
      </Styled.div>
    </Flex>
    <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        {earnings}
        <Styled.h6 as="span" sx={{ ml: 1 }}>
          {symbol}
        </Styled.h6>
      </Styled.h2>
      <Styled.h2 as="div" sx={{ fontFamily: 'monospace' }}>
        {earnings}
      </Styled.h2>
    </Flex>
  </Box>
)
