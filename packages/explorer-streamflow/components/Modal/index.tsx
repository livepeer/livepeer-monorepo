/** @jsx jsx */
import React from 'react'
import { jsx, Styled, Flex } from 'theme-ui'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition } from 'react-spring'
// import '@reach/dialog/styles.css'

export default ({ isOpen, setOpen, Icon = () => <></>, title, children }) => {
  const transitions = useTransition(isOpen, null, {
    config: { duration: 150 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <Styled.div
              as={DialogOverlay}
              key={key}
              sx={{ background: 'rgba(0, 0, 0, 0.5)', ...props }}
              isOpen={isOpen}
              onDismiss={() => setOpen(false)}
            >
              <Styled.div
                as={DialogContent}
                sx={{ p: 3, bg: 'surface', borderRadius: 2 }}
                isOpen={isOpen}
              >
                <Flex sx={{ alignItems: 'center', mb: 3 }}>
                  {Icon && <Icon sx={{ color: 'text', mr: 2 }} />}
                  <Styled.h2>{title}</Styled.h2>
                </Flex>
                {children}
              </Styled.div>
            </Styled.div>
          ),
      )}
    </>
  )
}
