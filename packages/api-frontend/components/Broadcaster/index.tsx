/** @jsx jsx */
import { Box, Styled, jsx } from 'theme-ui'

export default ({ address, deposit, reserve }) => {
  const href = `https://etherscan.io/address/${address}`

  return (
    <a
      href={href}
      target="_blank"
      style={{
        // backgroundColor: 'red',
        width: '210px',
        flexDirection: 'column',
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        margin: '5px',
        cursor: 'pointer',
        color: 'white',
      }}
    >
      <Styled.div
        style={{
          width: '210px',
          paddingTop: '56.25%',
          flexShrink: 1,
          backgroundImage:
            'url("https://beonair.com/wp-content/uploads/2019/04/sports-broadcasting.jpg")',
          backgroundSize: 'contain',
        }}
      />
      <Box
        sx={{ fontFamily: 'body' }}
        style={{
          // whiteSpace: 'noWrap',
          overflow: 'hidden',
          flexGrow: 1,
          flex: 1,
          // overflowText: 'ellipsis',
        }}
      >
        Address: {address} {'Deposit: '} {deposit} {'Reserve: '} {reserve}
      </Box>
    </a>
  )
}
