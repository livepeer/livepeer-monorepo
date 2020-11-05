import { Flex, Box } from 'theme-ui'

export default ({
  link = null,
  clickable = true,
  size = null,
  onClick = null,
  color,
  header,
  subheader = null,
  Icon = null,
  active = false,
  ...props
}) => {
  const content = (
    <Flex
      onClick={onClick}
      sx={{
        bg: active ? 'surface' : 'transparent',
        cursor: clickable ? 'pointer' : 'default',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: active ? 'transparent' : 'border',
        borderRadius: 10,
        p: 2,
        ':hover': {
          borderColor: 'primary',
        },
      }}
      {...props}
    >
      <Box>
        <Box>{header}</Box>
        {subheader && <Box sx={{ mt: 1, fontSize: 0 }}>{subheader}</Box>}
      </Box>
      {Icon && <Icon sx={{ width: 22, height: 22 }} />}
    </Flex>
  )

  if (link) {
    return (
      <a target="__blank" href={link} sx={{ color: 'white' }}>
        {content}
      </a>
    )
  }
  return content
}
