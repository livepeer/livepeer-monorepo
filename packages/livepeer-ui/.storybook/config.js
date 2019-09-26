import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { ThemeProvider, ColorMode, Styled } from 'theme-ui'
import CenterDecorator from '@storybook/addon-centered/react'
import theme from '../src/lib/theme'
import Reset from '../src/lib/reset'

const req = require.context('../src/components', true, /.stories.tsx$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)

const ThemeDecorator = storyFn => (
  <ThemeProvider theme={theme}>
    <Reset />
    <ColorMode />
    <Styled.root>{storyFn()}</Styled.root>
  </ThemeProvider>
)
addDecorator(ThemeDecorator)
addDecorator(CenterDecorator)
