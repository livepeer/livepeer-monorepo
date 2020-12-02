import { Styled } from 'theme-ui'
import { useWeb3React } from '@web3-react/core'
import { gql, useApolloClient } from '@apollo/client'

const Step2 = ({ goTo, nextStep }) => {
  const { active } = useWeb3React()
  const client = useApolloClient()

  if (active) {
    client.writeQuery({
      query: gql`
        query {
          walletModalOpen
        }
      `,
      data: {
        walletModalOpen: false,
      },
    })
    goTo(nextStep)
  }

  return (
    <div>
      <Styled.h2 sx={{ mb: 2 }}>Choose Wallet Provider</Styled.h2>
      <Styled.p>
        Select your preferred wallet. You can change your selected wallet or
        address later.
      </Styled.p>
    </div>
  )
}

export default Step2
