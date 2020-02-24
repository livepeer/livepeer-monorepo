import { Flex } from 'theme-ui'
import Play from '../../public/img/play.svg'
import { useWeb3React } from '@web3-react/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

const GET_ROUND = gql`
  {
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default () => {
  const context = useWeb3React()
  let { data, loading, error } = useQuery(GET_ROUND, {
    pollInterval: 20000,
    ssr: false,
  })

  if (loading) {
    return null
  }

  if (error) {
    console.log(error)
  }

  return (
    <Flex
      sx={{
        py: 1,
        px: 2,
        fontSize: 0,
        fontWeight: 600,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'surface',
        borderRadius: 5,
      }}
    >
      <Flex
        sx={{ alignItems: 'center', fontFamily: 'monospace', color: 'primary' }}
      >
        <Play sx={{ width: 10, height: 10, mr: 1 }} />
        {context.chainId
          ? context.chainId == 1
            ? 'Mainnet'
            : 'Rinkeby'
          : 'Mainnet'}
      </Flex>
      <div sx={{ height: 16, mx: 1, backgroundColor: 'border', width: 1 }} />
      <div sx={{ fontFamily: 'monospace' }}>
        Round{' '}
        <div sx={{ display: 'inline-flex', fontFamily: 'monospace' }}>
          #{data.currentRound[0].id}
        </div>
      </div>
    </Flex>
  )
}
