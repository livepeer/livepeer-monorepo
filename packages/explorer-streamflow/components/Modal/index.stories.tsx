/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import Modal from './index'
import Button from '../Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'
import StakeFlow from '../StakeFlow'

storiesOf('Modal', module).add('default', () => {
  const [isOpen, setOpen] = useState(true)

  return (
    <>
      <button onClick={() => setOpen(true)}>Toggle Modal</button>{' '}
      <Modal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Broadcasted"
        Icon={Broadcast}
      >
        <StakeFlow />
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
            <div sx={{ color: 'primary', mr: 1 }}>
              <CircularProgress size={16} color="inherit" />
            </div>
            <div sx={{ color: 'text' }}>
              Waiting for your transaction to be mined.
            </div>
          </Flex>
          <Button
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setOpen(false)}
          >
            View on Etherscan <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
          </Button>
        </Flex>
      </Modal>
    </>
  )
})
