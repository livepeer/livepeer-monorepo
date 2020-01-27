import { Flex } from 'theme-ui'
import Spinner from '../Spinner'
import { SUPPORTED_WALLETS } from '../../lib/constants'
import Option from './Option'
import { Injected } from '../../lib/connectors'

export default ({ connector }) => {
  const isMetamask = window['ethereum'] && window['ethereum'].isMetaMask
  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'border',
          borderRadius: 10,

          p: 2,
          mb: 2,
        }}
      >
        <Spinner speed="1.5s" sx={{ width: 20, height: 20, mr: 2 }} />
        Initializing
      </Flex>
      {Object.keys(SUPPORTED_WALLETS).map(key => {
        const option = SUPPORTED_WALLETS[key]
        if (option.connector === connector) {
          if (option.connector === Injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null
            }
          }
          return (
            <Option
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              Icon={option.icon}
            />
          )
        }
        return null
      })}
    </>
  )
}
