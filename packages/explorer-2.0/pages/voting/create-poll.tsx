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
import Utils from 'web3-utils'
import Head from 'next/head'

const CreatePoll = ({ projectOwner, projectName, gitCommitHash, lips }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const [sufficientAllowance, setSufficientAllowance] = useState(false)
  const [sufficientBalance, setSufficientBalance] = useState(false)
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })

  const accountQuery = gql`
    query($account: ID!) {
      account(id: $account) {
        pollCreatorAllowance
        tokenBalance
      }
    }
  `

  const { data } = useQuery(accountQuery, {
    variables: {
      account: context.account,
    },
    pollInterval: 10000,
    context: {
      library: context.library,
    },
    skip: !context.account,
  })

  useEffect(() => {
    if (data) {
      if (
        parseFloat(Utils.fromWei(data.account.pollCreatorAllowance)) >=
        (process.env.NETWORK === 'rinkeby' ? 10 : 100)
      ) {
        setSufficientAllowance(true)
      } else {
        setSufficientAllowance(false)
      }
      if (
        parseFloat(Utils.fromWei(data.account.tokenBalance)) >=
        (process.env.NETWORK === 'rinkeby' ? 10 : 100)
      ) {
        setSufficientBalance(true)
      } else {
        setSufficientBalance(false)
      }
    }
  }, [data, context.account])

  const [selectedProposal, setSelectedProposal] = useState(null)
  const { createPoll }: any = useContext(MutationsContext)

  useEffect(() => {
    if (lips.length) {
      setSelectedProposal({ gitCommitHash, text: lips[0].text })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Livepeer Explorer - Voting</title>
      </Head>
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
                sx={{ display: ['none', 'none', 'none', 'block'] }}
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
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                const hash = await ipfs.addJSON({
                  ...selectedProposal,
                })
                await createPoll({
                  variables: { proposal: hash },
                })
              } catch (e) {
                return {
                  error: e.message.replace('GraphQL error: ', ''),
                }
              }
            }}
          >
            {!lips.length && (
              <Box>
                There are currently no LIPs in a proposed state for which there
                hasn't been a poll created yet.
              </Box>
            )}
            {lips.map((lip, i) => (
              <Label
                key={i}
                sx={{
                  cursor: 'pointer',
                  p: 3,
                  mb: 2,
                  borderRadius: 10,
                  border: '1px solid',
                }}
              >
                <Flex
                  sx={{
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Flex sx={{ alignItems: 'center' }}>
                    <Radio
                      defaultChecked={i === 0}
                      onChange={() => {
                        setSelectedProposal({ gitCommitHash, text: lip.text })
                      }}
                      name="lip"
                    />
                    <Box sx={{ width: '100%' }}>
                      LIP-{lip.attributes.lip} - {lip.attributes.title}
                    </Box>
                  </Flex>
                  <a
                    sx={{
                      ml: 1,
                      minWidth: 108,
                      display: 'block',
                      color: 'primary',
                    }}
                    target="_blank"
                    href={`https://github.com/${projectOwner}/${projectName}/blob/master/LIPs/LIP-${lip.attributes.lip}.md`}
                  >
                    View Proposal
                  </a>
                </Flex>
              </Label>
            ))}
            {context.account &&
              !!lips.length &&
              (!data ? (
                <Flex
                  sx={{ alignItems: 'center', mt: 4, justifyContent: 'center' }}
                >
                  <Box sx={{ mr: 2 }}>Loading LPT Balance</Box>
                  <Spinner variant="styles.spinner" />
                </Flex>
              ) : (
                <Flex
                  sx={{
                    mt: 4,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {!sufficientAllowance && <PollTokenApproval />}
                  {sufficientAllowance && !sufficientBalance && (
                    <Box sx={{ color: 'muted', fontSize: 0 }}>
                      Insufficient balance. You need at least{' '}
                      {process.env.NETWORK === 'rinkeby' ? 10 : 100} LPT to
                      create a poll.
                    </Box>
                  )}
                  <Button
                    disabled={!sufficientAllowance || !sufficientBalance}
                    type="submit"
                    sx={{ ml: 2, alignSelf: 'flex-end' }}
                  >
                    Create Poll (
                    {process.env.NETWORK === 'rinkeby' ? '10' : '100'} LPT)
                  </Button>
                </Flex>
              ))}
          </form>
        </Box>
      </Flex>
    </>
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
    repository(owner: "${
      process.env.NETWORK === 'mainnet' ? 'livepeer' : 'adamsoffer'
    }", name: "LIPS") {
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
      pollsData.polls.map(async (poll) => {
        const obj = await ipfs.catJSON(poll.proposal)
        // check if proposal is valid format {text, gitCommitHash}
        if (obj?.text && obj?.gitCommitHash) {
          const transformedProposal = fm(obj.text)
          transformedProposal.attributes.lip
          createdPolls.push(transformedProposal.attributes.lip)
        }
      }),
    )
  }

  let lips = []
  data.repository.content.entries.map((lip: any) => {
    let transformedLip: any = fm(lip.content.text)
    transformedLip.attributes.created = transformedLip.attributes.created.toString()
    if (
      transformedLip.attributes.status === 'Proposed' &&
      !transformedLip.attributes['part-of'] &&
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
    revalidate: true,
  }
}
