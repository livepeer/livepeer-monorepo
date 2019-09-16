/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import Button from '../Button'
import Modal from '../Modal'
import StakeFlow from '../StakeFlow'
import Stake from './Stake'
import Unstake from './Unstake'
import CircularProgress from '@material-ui/core/CircularProgress'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'

export default ({ action, amount, context }) => {
  if (action == 'stake') {
    return <Stake amount={amount} context={context} />
  }
  return <Unstake amount={amount} context={context} />
}
