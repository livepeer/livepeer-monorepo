/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'

export default props => (
  <Flex
    sx={{
      alignItems: 'center',
    }}
  >
    {props.icon && props.icon}
    <Box
      as="input"
      type="text"
      variant="input"
      sx={{
        display: 'block',
        outline: 'none',
        width: '100%',
        appearance: 'none',
        fontSize: 2,
        lineHeight: 'inherit',
        border: 0,
        color: 'inherit',
        bg: 'transparent',
      }}
      {...props}
    />
  </Flex>
)
