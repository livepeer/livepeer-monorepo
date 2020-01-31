import { Styled, Flex } from 'theme-ui'
import ArrowRight from '../../public/img/arrow-right-long.svg'
import { Box } from 'theme-ui'

export default ({ action = 'stake', amount = 0, account }) => {
  return (
    <Flex
      sx={{
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 6,
        p: 3,
        alignItems: 'center',
        justifyContent: 'center',
        my: [4, 4, 4, 5],
      }}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <Box sx={{ mr: 2, fontFamily: 'monospace', fontSize: [3, 3, 3, 4] }}>
          {amount}
        </Box>
        <Box sx={{ fontSize: 1 }}>LPT</Box>
      </Flex>
      <ArrowRight
        sx={{
          mx: 3,
          transform: `rotate(${action == 'stake' ? '0' : '180deg'})`,
          color: action == 'stake' ? 'primary' : 'red',
        }}
      />
      <Styled.h3
        sx={{
          maxWidth: 100,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {account}
      </Styled.h3>
    </Flex>
  )
}
