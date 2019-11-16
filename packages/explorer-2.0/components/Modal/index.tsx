/** @jsx jsx */
import React from 'react'
import { jsx, Styled, Flex } from 'theme-ui'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition } from 'react-spring'

interface Props {
  isOpen: boolean
  children: React.ReactNode
  setOpen?: Function
  title?: React.ReactNode
  className?: string
  onDismiss?: Function
  Icon?: any
  ref?: any
}

export default ({
  isOpen = false,
  setOpen,
  Icon,
  title,
  className,
  children,
  ref,
  onDismiss,
  ...props
}: Props) => {
  return (
    <>
      {isOpen && (
        <Styled.div
          as={DialogOverlay}
          sx={{ background: 'rgba(0, 0, 0, 0.5)', ...props }}
          isOpen={isOpen}
          onDismiss={() => {
            if (onDismiss) {
              onDismiss()
            } else {
              setOpen(false)
            }
          }}
          {...props}
        >
          <Styled.div
            ref={ref}
            className={className}
            as={DialogContent}
            sx={
              title
                ? { p: 3, bg: 'surface', borderRadius: 2 }
                : {
                    margin: '40px auto',
                    p: 0,
                    height: 'calc(100vh - 80px)',
                  }
            }
            isOpen={isOpen}
          >
            {title && (
              <Flex sx={{ alignItems: 'center', mb: 3 }}>
                {Icon && <Icon sx={{ color: 'text', mr: 2 }} />}
                <Styled.h2>{title}</Styled.h2>
              </Flex>
            )}
            {children}
          </Styled.div>
        </Styled.div>
      )}
    </>
  )
}
