import { Styled, Box, Flex } from 'theme-ui'
import Spinner from '../components/Spinner'
import Card from '../components/Card'
import moment from 'moment'
import Layout from '../layouts/main'
import Markdown from 'markdown-to-jsx'
import { withApollo } from '../lib/apollo'
import { createApolloFetch } from 'apollo-fetch'
import { useEffect, useState } from 'react'

const query = `
  {
    projectBySlugs(organizationSlug: "livepeer", projectSlug: "explorer") {
      name
      releases {
        edges {
          node {
            title
            description
            isPublished
            publishedAt
            changes {
              type
              content
            }
          }
        }
      }
    }
  }
`

function getBadgeColor(changeType) {
  if (changeType === 'NEW') {
    return 'primary'
  } else if (changeType === 'IMPROVED') {
    return 'teal'
  } else if (changeType === 'FIXED') {
    return 'skyBlue'
  } else if (changeType === 'REMOVED') {
    return 'red'
  } else {
    return 'blue'
  }
}

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})

const groupByType = groupBy('type')

export default withApollo(() => {
  const uri = 'https://explorer.livepeer.org/api/graphql'
  const [data, setData] = useState(null)
  const apolloFetch = createApolloFetch({ uri })

  useEffect(() => {
    async function getChangefeed() {
      const { data } = await apolloFetch({ query })
      setData(data)
    }
    getChangefeed()
  })

  return (
    <Layout title="Livepeer Explorer - What's New" headerTitle="What's New">
      {!data ? (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Flex
            sx={{
              mt: [3, 3, 3, 5],
              mb: 5,
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Styled.h1
              sx={{
                fontSize: [3, 3, 4, 5],
                mb: [3, 3, 3, 5],
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span sx={{ mr: 2 }}>🌟</span> What's New
            </Styled.h1>
            {/* <Styled.h3>Coming Up</Styled.h3>
            <ul sx={{ mb: 5, lineHeight: 2 }}>
              <li>Earnings View</li>
              <li>Network statistics view</li>
              <li>Notifications system</li>
            </ul> */}

            <Box sx={{ img: { maxWidth: '100%' } }}>
              {data.projectBySlugs.releases.edges.map(
                ({ node }, i) =>
                  node.isPublished && (
                    <Card key={i} sx={{ flex: 1, mb: 4 }}>
                      <Styled.h3>{node.title}</Styled.h3>
                      <Box
                        sx={{
                          lineHeight: 2,
                          mb: 3,
                          fontSize: 1,
                          color: 'muted',
                        }}
                      >
                        {moment(node.publishedAt).format('MMM Do, YYYY')}
                      </Box>
                      <Box
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'border',
                          pb: 3,
                          mb: 3,
                          a: { color: 'primary' },
                        }}
                      >
                        <Markdown>{node.description}</Markdown>
                      </Box>
                      {Object.keys(groupByType(node.changes)).map((key, i) => {
                        return (
                          <Box key={i} sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                fontSize: '14px',
                                display: 'inline-flex',
                                textTransform: 'uppercase',
                                lineHeight: '1',
                                fontWeight: 'bold',
                                margin: '0px',
                                padding: '4px 16px',
                                alignSelf: 'flex-start',
                                borderRadius: '4px',
                                color: 'background',
                                bg: getBadgeColor(key),
                                mb: 2,
                              }}
                            >
                              {key}
                            </Box>
                            {groupByType(node.changes)[key].map((change, i) => (
                              <Box key={i} sx={{ alignSelf: 'flexStart' }}>
                                <Box sx={{ mb: 2 }}>{change.content}</Box>
                              </Box>
                            ))}
                          </Box>
                        )
                      })}
                    </Card>
                  ),
              )}
            </Box>
          </Flex>
        </>
      )}
    </Layout>
  )
})
