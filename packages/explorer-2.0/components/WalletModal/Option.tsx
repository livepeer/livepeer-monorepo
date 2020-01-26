import { Flex } from 'theme-ui'

export default ({
  link = null,
  clickable = true,
  size = null,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  ...props
}) => {
  return (
    <Flex
      onClick={onClick}
      sx={{
        cursor: clickable ? 'pointer' : 'default',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 10,
        p: 2,
        ':hover': {
          borderColor: 'primary',
        },
      }}
      {...props}
    >
      {name}
      {icon}
    </Flex>
  )
}
