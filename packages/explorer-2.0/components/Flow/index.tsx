import { Styled, Flex } from 'theme-ui'
import ArrowRight from '../../public/img/arrow-right-long.svg'
import { Box } from 'theme-ui'
import NumberFormat from 'react-number-format'

interface Props {
  action: string
  amount?: number | string
  account?: string
  reverse?: boolean
  currencyType?: string
}

const Index = ({
  action = 'stake',
  reverse = false,
  amount = 0,
  currencyType = 'LPT',
  account,
}: Props) => {
  return (
    <Flex
      sx={{
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 6,
        p: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: reverse ? 'row-reverse' : 'row',
        my: [4, 4, 4, 5],
      }}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <Box sx={{ mr: 2, fontFamily: 'monospace', fontSize: [2, 2, 2, 4] }}>
          <NumberFormat value={amount} displayType="text" decimalScale={13} />{' '}
          <span sx={{ fontSize: 1 }}>{currencyType}</span>
        </Box>
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

export default Index
