/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import React from 'react'
import { storiesOf } from '@storybook/react'
import List from './index'
import ListItem from '../ListItem'

storiesOf('List', module).add('default', () => (
  <List
    sx={{ minWidth: 600 }}
    header={<Styled.h4>Pending Stake Transactions</Styled.h4>}
  >
    <ListItem>List Item 1</ListItem>
    <ListItem>List Item 2</ListItem>
  </List>
))
