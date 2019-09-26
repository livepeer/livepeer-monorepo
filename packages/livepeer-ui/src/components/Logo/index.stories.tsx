/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { storiesOf } from '@storybook/react'
import Logo from './index'

storiesOf('Logo', module).add('default', () => <Logo sx={{ color: 'text' }} />)
