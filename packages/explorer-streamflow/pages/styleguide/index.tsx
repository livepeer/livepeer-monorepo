/** @jsx jsx */
import { jsx, Styled, Box } from 'theme-ui'
import Typography from './typography'
import Colors from './colors'

export default () => (
  <Styled.root>
    <Box sx={{ m: 4 }}>
      <Styled.h1 sx={{ color: 'primary', fontSize: 8 }}>Style Guide</Styled.h1>
      <Typography />
      <Colors />
    </Box>
  </Styled.root>
)
