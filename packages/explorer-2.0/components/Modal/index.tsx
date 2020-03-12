import React from 'react'
import { Styled, Flex, Box } from 'theme-ui'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import CloseIcon from '../../public/img/close.svg'

interface Props {
  isOpen?: boolean
  children: React.ReactNode
  setOpen?: Function
  title?: React.ReactNode
  className?: string
  showCloseButton?: boolean
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
  showCloseButton = false,
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
              ? { maxWidth: 700, bg: 'surface', borderRadius: 16 }
              : {
                  borderRadius: 16,
                  margin: '40px auto',
                  height: 'calc(100vh - 80px)',
                }
          }
        >
          <Box sx={{ position: 'relative', px: 4, pt: 3, pb: 4 }}>
            {showCloseButton && (
              <CloseIcon
                onClick={onDismiss}
                sx={{
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: 1,
                  right: 20,
                  top: 20,
                  color: 'white',
                }}
              />
            )}
            {title && (
              <Box sx={{ position: 'relative' }}>
                <Flex sx={{ alignItems: 'center', mb: 5 }}>
                  {Icon && <Icon sx={{ color: 'text', mr: 2 }} />}
                  <Styled.h3 sx={{ width: '100%' }}>{title}</Styled.h3>
                </Flex>
              </Box>
            )}
            {children}
          </Box>
        </Box>
      </Box>
    </>
  )
}
