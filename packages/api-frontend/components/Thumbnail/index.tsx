/** @jsx jsx */
import { Box, Styled, jsx } from 'theme-ui'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default ({ streamId, stream, broadcasterName }) => {
  const m3u8 = `${broadcasterName}/stream/${streamId}.m3u8`
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
        {streamId}
      </Box>
      <Box
        sx={{ fontFamily: 'body' }}
        style={{
          // whiteSpace: 'noWrap',
          overflow: 'hidden',
          // overflowText: 'ellipsis',
        }}
      >
        {stream.title || <em>no title</em>}
      </Box>
    </a>
  )
}
