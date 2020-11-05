import { Styled } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default ({ goTo, nextStep }) => {
  const GET_WALLET_MODAL_STATUS = gql`
    {
      walletModalOpen @client
    }
  `

  const { data } = useQuery(GET_WALLET_MODAL_STATUS)
  if (data?.walletModalOpen) {
    goTo(nextStep)
  }

  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Connect Wallet</Styled.h2>
      <Styled.p>First things first. Let's connect your wallet.</Styled.p>
    </div>
  )
}
