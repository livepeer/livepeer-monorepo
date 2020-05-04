import { Flex, Styled } from 'theme-ui'
import Ballot from '../../public/img/ballot.svg'
import { getLayout } from '../../layouts/main'
import IPFS from 'ipfs-mini'
import fm from 'front-matter'
import { Box } from 'theme-ui'
import Button from '../../components/Button'
import { createApolloFetch } from 'apollo-fetch'
import { Radio, Label, Spinner } from '@theme-ui/components'
import { useState, useEffect, useContext } from 'react'
import gql from 'graphql-tag'
import { useWeb3React } from '@web3-react/core'
import PollTokenApproval from '../../components/PollTokenApproval'
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../../lib/apollo'
import { useApolloClient } from '@apollo/react-hooks'
import { MutationsContext } from '../../contexts'

const CreatePoll = ({ projectOwner, projectName, gitCommitHash, lips }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const [pollCreationEnabled, setPollCreationEnabled] = useState(false)
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })

  const accountQuery = gql`
    query($account: ID!) {
      account(id: $account) {
        pollCreatorAllowance
      }
    }
  `

  const { data } = useQuery(accountQuery, {
    variables: {
      account: context.account,
    },
    pollInterval: 5000,
    context: {
      library: context.library,
    },
    skip: !context.account,
  })

  useEffect(() => {
    if (data) {
      if (parseFloat(data.account.pollCreatorAllowance) >= 100) {
        setPollCreationEnabled(true)
      }
    }
  }, [data])

  const [selectedProposal, setSelectedProposal] = useState(null)
  const { createPoll }: any = useContext(MutationsContext)

  return (
    <Flex
      sx={{
        mt: [3, 3, 3, 5],
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Box>
        <Flex
          sx={{
            mb: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Styled.h1
            sx={{
              fontSize: [3, 3, 4, 5],
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Ballot
              sx={{
                width: [20, 20, 20, 26],
                height: [20, 20, 20, 26],
                color: 'primary',
                mr: 2,
              }}
            />
            Create Poll
          </Styled.h1>
          {!context.account && (
            <Button
              onClick={() => {
                client.writeData({
                  data: {
                    walletModalOpen: true,
                  },
                })
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Flex>
        <form
          onSubmit={async e => {
            e.preventDefault()
            try {
              const hash = await ipfs.addJSON({
                gitCommitHash,
                selectedProposal,
              })
              await createPoll({
                variables: { proposal: hash },
              })
            } catch (e) {
              console.log(e)
            }
          }}
        >
          {lips.map((lip, i) => (
            <Label
              key={i}
              sx={{
                cursor: 'pointer',
                p: 3,
                mb: 2,
                borderRadius: 10,
                border: '1px solid',
                // borderColor: 'primary',
              }}
            >
              <Flex sx={{ width: '100%', alignItems: 'center' }}>
                <Radio
                  defaultChecked={i === 0}
                  onChange={() => {
                    setSelectedProposal({ gitCommitHash, text: lip.text })
                  }}
                  name="lip"
                />
                <Flex sx={{ width: '100%', justifyContent: 'space-between' }}>
                  <Box>
                    LIP-{lip.attributes.lip} - {lip.attributes.title}
                  </Box>
                  <a
                    sx={{ color: 'primary' }}
                    target="_blank"
                    href={`https://github.com/${projectOwner}/${projectName}/blob/master/LIPs/LIP-${lip.attributes.lip}.md`}
                  >
                    View Proposal
                  </a>
                </Flex>
              </Flex>
            </Label>
          ))}

          {context.account &&
            (!data ? (
              <Flex
                sx={{ alignItems: 'center', mt: 4, justifyContent: 'center' }}
              >
                <Box sx={{ mr: 2 }}>Loading LPT Balance</Box>
                <Spinner variant="styles.spinner" />
              </Flex>
            ) : (
              <Flex sx={{ mt: 4, justifyContent: 'flex-end' }}>
                {parseFloat(data?.account?.pollCreatorAllowance) < 100 && (
                  <PollTokenApproval />
                )}
                <Button
                  disabled={!pollCreationEnabled}
                  type="submit"
                  sx={{ ml: 2, alignSelf: 'flex-end' }}
                >
                  Create Poll (100 LPT)
                </Button>
              </Flex>
            ))}
        </form>
      </Box>
    </Flex>
  )
}

CreatePoll.getLayout = getLayout

export default withApollo({
  ssr: false,
})(CreatePoll)

export async function getStaticProps() {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })
  const lipsQuery = `
  {
    repository(owner: "adamsoffer", name: "LIPS") {
      owner {
        login
      }
      name
      defaultBranchRef {
        target {
          oid
        }
      }
      content: object(expression: "master:LIPs/") {
        ... on Tree {
          entries {
            content: object {
              commitResourcePath
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
  `
  const apolloFetch = createApolloFetch({
    uri: 'https://api.github.com/graphql',
  })

  apolloFetch.use(({ options }, next) => {
    if (!options.headers) {
      options.headers = {} // Create the headers object if needed.
    }
    options.headers[
      'authorization'
    ] = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`

    next()
  })
  const { data } = await apolloFetch({ query: lipsQuery })
  const apolloSubgraphFetch = createApolloFetch({
    uri: process.env.SUBGRAPH,
  })
  const { data: pollsData } = await apolloSubgraphFetch({
    query: `{ polls { proposal } }`,
  })

  let createdPolls = []
  if (pollsData) {
    await Promise.all(
      pollsData.polls.map(async poll => {
        const { proposal } = await ipfs.catJSON(poll.proposal)
        const transformedProposal = fm(proposal.text)
        transformedProposal.attributes.lip
        createdPolls.push(transformedProposal.attributes.lip)
      }),
    )
  }

  let lips = []
  data.repository.content.entries.map((lip: any) => {
    let transformedLip: any = fm(lip.content.text)
    transformedLip.attributes.created = transformedLip.attributes.created.toString()
    if (
      transformedLip.attributes.status === 'Proposed' &&
      !createdPolls.includes(transformedLip.attributes.lip)
    )
      lips.push({ ...transformedLip, text: lip.content.text })
  })

  return {
    props: {
      projectOwner: data.repository.owner.login,
      projectName: data.repository.name,
      gitCommitHash: data.repository.defaultBranchRef.target.oid,
      lips: lips.sort((a, b) => (a.attributes.lip < b.attributes.lip ? 1 : -1)),
    },
    unstable_revalidate: true,
  }
}
