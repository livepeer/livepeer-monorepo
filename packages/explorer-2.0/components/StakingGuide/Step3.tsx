import { Styled } from 'theme-ui'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const Step3 = ({ goTo, nextStep }) => {
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

export default Step3
