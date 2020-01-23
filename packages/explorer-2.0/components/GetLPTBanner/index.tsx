import Button from '../Button'
import Banner from '../Banner'
import Router, { useRouter } from 'next/router'
import Utils from 'web3-utils'

export default ({ account, context }) => {
  const router = useRouter()
  let banner = null
  if (
    context.account &&
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    parseFloat(Utils.fromWei(account.tokenBalance)) == 0
  ) {
    banner = (
      <Banner
        label={
          <div sx={{ pr: 3, flex: 1 }}>Get Livepeer tokens for staking.</div>
        }
        button={
          <Button
            onClick={() =>
              Router.push(
                `${router.pathname}?openExchange=true`,
                `${router.asPath}?openExchange=true`,
              )
            }
          >
            Get LPT
          </Button>
        }
      />
    )
  }
  return <>{banner}</>
}
