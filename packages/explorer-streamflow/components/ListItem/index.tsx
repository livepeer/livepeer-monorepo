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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:first-of-type': {
          borderTop: 0,
        },
      }}
      {...props}
    >
      <Flex sx={{ width: '100%', alignItems: 'center' }}>
        {avatar}
        {children}
      </Flex>
    </Flex>
  )
}
