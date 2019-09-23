# Livepeer UI

React primitive UI components built with [Theme UI](https://theme-ui.com)

## Getting Started

Install Livepeer UI and its peer dependencies.

```bash
yarn add @livepeer/ui theme-ui @emotion/core @mdx-js/react
```

Import the Livepeer UI theme object and add it to your application by passing it in as a prop to the theme-ui ThemeProvider.

```jsx
// basic usage
import React from 'react'
import { ThemeProvider } from 'theme-ui'
import { theme } from '@livepeer/ui'

export default props => (
  <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
)
```

Import a Livepeer UI component inside your application.

```jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Button } from '@livepeer/ui'

export default props => <Button>Rebass</Button>
```

The sx prop lets you style elements inline, using values from the Livepeer UI theme.

```jsx
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Button } from '@livepeer/ui'

export default props => <Button sx={{ mb: 2 }}>Rebass</Button>
```
