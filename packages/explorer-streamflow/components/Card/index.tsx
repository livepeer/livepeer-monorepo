/** @jsx jsx */
import { jsx, Box, Flex, Styled } from 'theme-ui'

export default ({
  title = null,
  subtitle = null,
  children = null,
  ...props
}) => {
  return (
    <Box
      sx={{
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
    </Box>
  )
}
