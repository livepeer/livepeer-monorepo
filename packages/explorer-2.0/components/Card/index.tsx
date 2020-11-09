import { Flex } from 'theme-ui'

const Index = ({
  title = null,
  subtitle = null,
  children = null,
  ...props
}) => {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        border: '1px solid',
        borderColor: 'border',
        py: 3,
        px: 3,
        borderRadius: 6,
      }}
      {...props}
    >
      {title && (
        <div sx={{ mb: '8px', fontWeight: 500, fontSize: 0, color: 'muted' }}>
          {title}
        </div>
      )}
      {subtitle}
      {children}
    </Flex>
  )
}

export default Index
