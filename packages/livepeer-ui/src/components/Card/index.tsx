/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'

export default ({
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
        px: 2,
        borderRadius: 5,
      }}
      {...props}
    >
      <div sx={{ mb: '4px', fontWeight: 500, fontSize: 0, color: 'muted' }}>
        {title}
      </div>
      {subtitle}
      {children}
    </Flex>
  )
}
