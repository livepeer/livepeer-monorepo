import { useState } from 'react'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition, animated } from 'react-spring'
import { Box } from 'theme-ui'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default ({ children }) => {
  const client = useApolloClient()
  const AnimatedDialogOverlay = animated(DialogOverlay)
  const AnimatedDialogContent = animated(DialogContent)

  const GET_STAKING_WIDGET_MODAL_STATUS = gql`
    {
      stakingWidgetModalOpen @client
    }
  `

  const { data } = useQuery(GET_STAKING_WIDGET_MODAL_STATUS)

  const animations = {
    from: { opacity: 0, y: '100%' },
    enter: { opacity: 1, y: '0%' },
    leave: { opacity: 0, y: '100%' },
  }
  const transitions = useTransition(
    data?.stakingWidgetModalOpen,
    null,
    animations,
  )

  return (
    <Box>
      {transitions.map(
        ({ item, props }: any) =>
          item && (
            <AnimatedDialogOverlay
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
                opacity: props.opacity,
              }}
            >
              <AnimatedDialogContent
                style={{
                  transform: props.y.interpolate(
                    value => `translate3d(0px, ${value}, 0px)`,
                  ),
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
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          ),
      )}
    </Box>
  )
}
