/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { storiesOf } from '@storybook/react'
import List from './index'
import ListItem from '../ListItem'

storiesOf('List', module).add('default', () => (
  <List header={<Styled.h3>Pending Stake Transactions</Styled.h3>}>
    <ListItem>a</ListItem>
  </List>
))
