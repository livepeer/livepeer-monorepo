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
  clickAnywhereToClose?: boolean
  onDismiss?: Function
  Icon?: any
  ref?: any
}

const Index = ({
  isOpen = false,
  setOpen,
  Icon,
  title,
  className,
  children,
  ref,
  clickAnywhereToClose = true,
  showCloseButton = true,
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
        onDismiss={clickAnywhereToClose ? onDismiss : () => {}}
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
          <Box sx={{ position: 'relative', px: 4, py: 3 }}>
            {title && (
              <Box sx={{ position: 'relative' }}>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  {Icon && <Flex sx={{ mr: 2 }}>{Icon}</Flex>}
                  <Styled.h3 sx={{ width: '100%' }}>{title}</Styled.h3>
                  {showCloseButton && (
                    <CloseIcon
                      onClick={onDismiss}
                      sx={{
                        cursor: 'pointer',
                        zIndex: 1,
                        right: 20,
                        top: 20,
                        color: 'white',
                      }}
                    />
                  )}
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

export default Index
