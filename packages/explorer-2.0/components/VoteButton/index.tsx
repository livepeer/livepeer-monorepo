import { useWeb3React } from '@web3-react/core'
import gql from 'graphql-tag'
import { useWeb3Mutation } from '../../hooks'
import Button from '../Button'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'

export default ({ pollAddress, choiceId, children, ...props }) => {
  const context = useWeb3React()

  if (!context.active) {
    return null
  }

  const { vote }: any = useContext(MutationsContext)

  return (
    <Button
      onClick={() => vote({ variables: { pollAddress, choiceId } })}
      {...props}
    >
      {children}
    </Button>
  )
}
