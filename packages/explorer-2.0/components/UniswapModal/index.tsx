import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition, animated } from 'react-spring'
import { Box } from 'theme-ui'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import useWindowSize from 'react-use/lib/useWindowSize'

export default ({ children }) => {
  const client = useApolloClient()
  const { width } = useWindowSize()
  const AnimatedDialogOverlay = animated(DialogOverlay)
  const AnimatedDialogContent = animated(DialogContent)

  const GET_UNISWAP_MODAL_STATUS = gql`
    {
      uniswapModalOpen @client
    }
  `

  const { data } = useQuery(GET_UNISWAP_MODAL_STATUS)

  const animations = {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
  }
  const transitions = useTransition(data?.uniswapModalOpen, null, animations)

  return (
    <Box>
      {transitions.map(
        ({ item, props }: any) =>
          item && (
            <AnimatedDialogOverlay
              style={{ opacity: props.opacity }}
              onDismiss={() =>
                client.writeData({
                  data: {
                    uniswapModalOpen: false,
                  },
                })
              }
            >
              <AnimatedDialogContent
                style={{
                  height: '100%',
                  transform: props.y.interpolate(
                    value => `translate3d(0px, ${value}px, 0px)`,
                  ),
                }}
              >
                {children}
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          ),
      )}
    </Box>
  )
}
