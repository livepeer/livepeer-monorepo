/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { storiesOf } from '@storybook/react'
import ListItem from '../ListItem'

storiesOf('ListItem', module).add('default', () => (
  <ListItem>List Item 1</ListItem>
))
