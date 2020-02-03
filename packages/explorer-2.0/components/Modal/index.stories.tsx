import { jsx, Flex } from 'theme-ui'
import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import Modal from './index'
import Button from '../Button'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import StakingFlow from '../StakingFlow'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

storiesOf('Modal', module)
  .add('Broadcasted', () => {
    const [isOpen, setOpen] = useState(true)

    return (
      <>
        <button onClick={() => setOpen(true)}>Toggle Modal</button>{' '}
        <Modal
          isOpen={isOpen}
          onDismiss={() => setOpen(false)}
          title="Broadcasted"
          Icon={Broadcast}
        >
          <StakingFlow amount={100} action="stake" account="0x..." />
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
              <Spinner sx={{ mr: 1 }} />
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
  .add('Successful Stake', () => {
    const [isOpen, setOpen] = useState(true)
    const { width, height } = useWindowSize()
    return (
      <>
        <button onClick={() => setOpen(true)}>Toggle Modal</button>{' '}
        <Modal
          isOpen={isOpen}
          onDismiss={() => setOpen(false)}
          title="Success!"
          Icon={() => <div sx={{ mr: 2 }}>🎊</div>}
        >
          <Confetti
            canvasRef={React.createRef()}
            width={width}
            height={height}
          />
          <StakingFlow amount={100} action="stake" account="0x..." />
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </Flex>
        </Modal>
      </>
    )
  })
  .add('Successful Unstake', () => {
    const [isOpen, setOpen] = useState(true)
    return (
      <>
        <button onClick={() => setOpen(true)}>Toggle Modal</button>{' '}
        <Modal
          isOpen={isOpen}
          onDismiss={() => setOpen(false)}
          title="Successfully Unstaked"
        >
          <StakingFlow amount={100} action="unstake" account="0x..." />
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </Flex>
        </Modal>
      </>
    )
  })
