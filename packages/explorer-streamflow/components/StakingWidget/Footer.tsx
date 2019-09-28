/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'

export default ({ transcoder, action, amount, account }) => {
  if (!account) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  console.log(account)

  if (action == 'stake') {
    return (
      <>
        <Stake
          account={account}
          disabled={true}
          transcoder={transcoder}
          amount={amount}
        />
      </>
    )
  }
  return (
    <Unstake
      account={account}
      disabled={true}
      transcoder={transcoder}
      amount={amount}
    />
  )
}
