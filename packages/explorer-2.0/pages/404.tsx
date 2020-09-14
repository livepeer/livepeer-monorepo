import { Flex, Box } from '@theme-ui/components'

function Error() {
  return (
    <Flex
      sx={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'background',
      }}
    >
      <Box
        sx={{
          fontSize: 5,
          pr: 3,
          mr: 3,
          borderRight: '1px solid',
          borderColor: 'white',
        }}
      >
        404
      </Box>
      <p>This page could not be found</p>
    </Flex>
  )
}

export default Error
