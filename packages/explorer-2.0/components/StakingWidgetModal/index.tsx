import { DialogOverlay, DialogContent } from '@reach/dialog'
import { Box } from 'theme-ui'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import useWindowSize from 'react-use/lib/useWindowSize'
import { css, keyframes } from '@emotion/core'

const slideUp = keyframes`
  0% {
    transform: translate3d(0, 100%, 0);
  }

  100% {
    transform: translate3d(0,0%,0);
  }
`
export default ({ children }) => {
  const client = useApolloClient()
  const { width } = useWindowSize()

  const GET_STAKING_WIDGET_MODAL_STATUS = gql`
    {
      stakingWidgetModalOpen @client
    }
  `

  const { data } = useQuery(GET_STAKING_WIDGET_MODAL_STATUS)

  return (
    <Box>
      <Box
        as={DialogOverlay}
        isOpen={data?.stakingWidgetModalOpen && width < 1020}
        onDismiss={() =>
          client.writeData({
            data: {
              stakingWidgetModalOpen: false,
            },
          })
        }
        style={{
          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        <Box
          as={DialogContent}
          css={css`
            animation: ${slideUp} 0.3s ease;
          `}
          style={{
            position: 'fixed',
            bottom: 0,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            maxWidth: '100%',
            width: '100%',
            margin: 0,
            border: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
