/** @jsx jsx */
import { jsx, Flex, Styled } from 'theme-ui'
import Button from '../Button'

export default ({ children, ...props }) => {
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
        <div
          sx={{
            borderRadius: 1000,
            backgroundColor: 'surface',
            width: 30,
            height: 30,
            mr: 2,
            border: '1px solid',
            borderColor: 'border',
          }}
        />
        <div>
          <Styled.h4>Title</Styled.h4>
          <span sx={{ fontSize: 0, color: 'muted' }}>Subtitle</span>
        </div>
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
