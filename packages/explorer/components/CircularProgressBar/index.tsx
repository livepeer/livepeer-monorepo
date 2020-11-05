import { CircularProgressbar } from 'react-circular-progressbar'
import { Box } from 'theme-ui'
import { Flex } from '@theme-ui/components'

export default (props) => {
  const { children, ...otherProps } = props

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Box style={{ position: 'absolute' }}>
        <CircularProgressbar {...otherProps} />
      </Box>
      <Flex
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {props.children}
      </Flex>
    </Box>
  )
}
