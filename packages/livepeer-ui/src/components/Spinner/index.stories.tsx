/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { storiesOf } from '@storybook/react'
import Spinner from './index'

storiesOf('Spinner', module).add('default', () => <Spinner />)
