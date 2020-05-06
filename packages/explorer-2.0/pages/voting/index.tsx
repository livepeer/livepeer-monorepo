import { Flex, Styled } from 'theme-ui'
import { Text } from '@theme-ui/components'
import Ballot from '../../public/img/ballot.svg'
import { getLayout } from '../../layouts/main'
import { Box } from 'theme-ui'
import Button from '../../components/Button'
import { withApollo } from '../../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import Spinner from '../../components/Spinner'
import Card from '../../components/Card'
import IPFS from 'ipfs-mini'
import fm from 'front-matter'
import { useEffect, useState } from 'react'
import moment from 'moment'
import Link from 'next/link'
import gql from 'graphql-tag'

const Voting = () => {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })
  const allPollsQuery = require('../../queries/allPolls.gql')
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const { data } = useQuery(allPollsQuery, {
    pollInterval: 8000,
  })
  const { data: blockData } = useQuery(
    gql`
      {
        block(id: "latest")
      }
    `,
  )

  useEffect(() => {
    if (data && blockData) {
      let pollArr = []
      const init = async () => {
        if (!data.polls.length) {
          setLoading(false)
          return
        }
        await Promise.all(
          data.polls.map(async poll => {
            const obj = await ipfs.catJSON(poll.proposal)
            // only include proposals with valid format
            if (obj?.text && obj?.gitCommitHash) {
              const transformedProposal = fm(obj.text)
              if (
                !pollArr.filter(
                  p => p.attributes.lip === transformedProposal.attributes.lip,
                ).length
              ) {
                pollArr.push({
                  ...poll,
                  ...transformedProposal,
                })
              }
            }
          }),
        )
        setPolls(pollArr)
        setLoading(false)
      }
      init()
    }
  }, [data, blockData])

  return (
    <>
      {loading ? (
        <Flex
          sx={{
            height: [
              'calc(100vh - 100px)',
              'calc(100vh - 100px)',
              'calc(100vh - 100px)',
              '100vh',
            ],
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <Flex
          sx={{
            mt: [3, 3, 3, 5],
            width: '100%',
            flexDirection: 'column',
          }}
        >
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
              Voting
            </Styled.h1>
            <Link href="/voting/create-poll" as="/voting/create-poll">
              <a>
                <Button>Create Poll</Button>
              </a>
            </Link>
          </Flex>
          <Box>
            {polls
              .sort((a, b) => (a.endBlock > b.endBlock ? 1 : -1))
              .map(poll => (
                <Link
                  key={poll.id}
                  href="/voting/[poll]"
                  as={`/voting/${poll.id}`}
                >
                  <a sx={{ cursor: 'pointer', display: 'block', mb: 2 }}>
                    <Card sx={{ color: 'text', display: 'block' }}>
                      <Flex
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Box sx={{ mb: 1 }}>
                            {poll.attributes.title} (LIP {poll.attributes.lip})
                          </Box>
                          <Box sx={{ fontSize: 0, color: 'muted' }}>
                            {!poll.isActive ? (
                              <Box>
                                Voting ended on{' '}
                                {moment
                                  .unix(poll.endTime)
                                  .format('MMM Do, YYYY')}
                              </Box>
                            ) : (
                              <Box>
                                Voting ends in ~
                                {moment()
                                  .add(poll.estimatedTimeRemaining, 'seconds')
                                  .fromNow(true)}
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Text
                          variant={poll.status}
                          sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                        >
                          {poll.status}
                        </Text>
                      </Flex>
                    </Card>
                  </a>
                </Link>
              ))}
          </Box>
        </Flex>
      )}
    </>
  )
}

function removeDuplicates(originalArray, prop) {
  var newArray = []
  var lookupObject = {}

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i]
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i])
  }
  return newArray
}

Voting.getLayout = getLayout

export default withApollo({
  ssr: false,
})(Voting)