import React from 'react'
import { Styled, Flex, Box } from 'theme-ui'
import { DialogOverlay, DialogContent } from '@reach/dialog'

interface Props {
  isOpen?: boolean
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
      <Box
        as={DialogOverlay}
        isOpen={isOpen}
        sx={{
          background: 'rgba(0, 0, 0, 0.5)',
          ...props,
        }}
        onDismiss={onDismiss}
        {...props}
      >
        <Box
          ref={ref}
          className={className}
          as={DialogContent}
          sx={
            title
              ? { maxWidth: 700, bg: 'surface', borderRadius: 10 }
              : {
                  borderRadius: 10,
                  margin: '40px auto',
                  height: 'calc(100vh - 80px)',
                }
          }
        >
          <Box sx={{ p: 3 }}>
            {title && (
              <Flex sx={{ alignItems: 'center', mb: 4 }}>
                {Icon && <Icon sx={{ color: 'text', mr: 2 }} />}
                <Styled.h2>{title}</Styled.h2>
              </Flex>
            )}
            {children}
          </Box>
        </Box>
      </Box>
    </>
  )
}
