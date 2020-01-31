import { Styled } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export default ({ goTo, nextStep }) => {
  const GET_UNISWAP_MODAL_STATUS = gql`
    {
      uniswapModalOpen @client
    }
  `

  const { data } = useQuery(GET_UNISWAP_MODAL_STATUS)
  if (data?.uniswapModalOpen) {
    goTo(nextStep)
  }

  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Get LPT</Styled.h2>
      <Styled.p>
        You'll need LPT to stake. Let's swap some ETH for LPT on Uniswap.
      </Styled.p>
    </div>
  )
}
