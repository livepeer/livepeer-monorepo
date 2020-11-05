import { Styled } from 'theme-ui'
import { ColorPalette } from '@theme-ui/style-guide'

const Colors = () => {
  return (
    <section id="colors">
      <Styled.h2 sx={{ fontSize: 6 }}>Colors</Styled.h2>
      <ColorPalette omit={[]} />
    </section>
  )
}

export default Colors
