/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import Button from '../Button'

export default ({ avatar = null, children, ...props }) => {
  return (
    <Flex
      sx={{
        borderTop: '1px solid',
        borderColor: 'border',
        py: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:first-of-type': {
          borderTop: 0,
        },
      }}
      {...props}
    >
      <Flex sx={{ alignItems: 'center' }}>
        {avatar}
        <div>{children}</div>
      </Flex>
      <div>
        <Button sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}>
          Rebond
        </Button>

        <Button sx={{ py: 1, variant: 'buttons.secondary' }}>Withdraw</Button>
      </div>
    </Flex>
  )
}
