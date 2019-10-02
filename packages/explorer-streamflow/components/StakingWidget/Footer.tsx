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

  if (action == 'stake') {
    return (
      <>
        <Stake
          account={account}
          disabled={true}
          transcoder={transcoder}
          amount={amount}
        />
        <div
          sx={{
            px: 2,
            pt: 2,
            color: 'muted',
            textAlign: 'center',
            fontSize: 0,
          }}
        >
          {account &&
            parseInt(account.tokenBalance) == 0 &&
            `You have 0 LPT in your wallet.`}
        </div>
      </>
    )
  }
  return (
    <>
      <Unstake
        account={account}
        disabled={true}
        transcoder={transcoder}
        amount={amount}
      />
      <div
        sx={{
          px: 2,
          pt: 2,
          color: 'muted',
          textAlign: 'center',
          fontSize: 0,
        }}
      >
        {`One must stake before one can unstake.`}
      </div>
    </>
  )
}
