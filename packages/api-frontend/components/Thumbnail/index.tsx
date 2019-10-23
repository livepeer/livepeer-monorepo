/** @jsx jsx */
import { Box, Styled, jsx } from 'theme-ui'

export default ({ id, stream }) => {
  const origin = new URL(document.location.href).origin
  const m3u8 = `${origin}/stream/${id}.m3u8`
  const href = `http://media.livepeer.org/play?url=${encodeURIComponent(m3u8)}`

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
          backgroundImage:
            'url("https://build.livepeer.live/example-screenshot.jpg")',
          backgroundSize: 'contain',
        }}
      />
      <Box
        style={{
          fontFamily: 'Akkurat-Mono, monospace',
          // whiteSpace: 'noWrap',
          overflow: 'hidden',
          fontSize: '0.6em',
          textAlign: 'center',
        }}
      >
        {id}
      </Box>
      <Box
        sx={{ fontFamily: 'body' }}
        style={{
          // whiteSpace: 'noWrap',
          overflow: 'hidden',
          // overflowText: 'ellipsis',
        }}
      >
        {name || <em>no title</em>}
      </Box>
    </a>
  )
}
