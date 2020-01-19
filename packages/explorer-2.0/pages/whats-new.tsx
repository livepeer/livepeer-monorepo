/** @jsx jsx */
import React from 'react'
import { jsx, Styled, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Spinner from '../components/Spinner'
import gql from 'graphql-tag'
import Card from '../components/Card'
import moment from 'moment'
import Layout from '../layouts/main'
import Markdown from 'markdown-to-jsx'
import { withApollo } from '../lib/apollo'

const GET_CHANGEFEED = gql`
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

const WhatsNew = () => {
  const { data, loading } = useQuery(GET_CHANGEFEED)

  return (
    <Layout>
      {loading ? (
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
              mt: 5,
              mb: 5,
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Styled.h1 sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
              <span sx={{ mr: 2 }}>🌟</span> What's New
            </Styled.h1>
            <Styled.h3>Coming Up</Styled.h3>
            <ul sx={{ mb: 5, lineHeight: 2 }}>
              <li>Mobile support</li>
              <li>Earnings View</li>
              <li>Network statistics view</li>
              <li>Notifications system</li>
            </ul>

            <div>
              {data.projectBySlugs.releases.edges.map(
                ({ node }, i) =>
                  node.isPublished && (
                    <Card key={i} sx={{ flex: 1, mb: 4 }}>
                      <Styled.h3>{node.title}</Styled.h3>
                      <div
                        sx={{
                          lineHeight: 2,
                          mb: 3,
                          fontSize: 1,
                          color: 'muted',
                        }}
                      >
                        {moment(node.publishedAt).format('MMM Do, YYYY')}
                      </div>
                      <div
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'border',
                          pb: 3,
                          mb: 3,
                          a: { color: 'primary' },
                        }}
                      >
                        <Markdown>{node.description}</Markdown>
                      </div>
                      {Object.keys(groupByType(node.changes)).map((key, i) => {
                        return (
                          <div key={i} sx={{ mb: 2 }}>
                            <div
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
                            </div>
                            {groupByType(node.changes)[key].map((change, i) => (
                              <div key={i} sx={{ alignSelf: 'flexStart' }}>
                                <div sx={{ mb: 2 }}>{change.content}</div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </Card>
                  ),
              )}
            </div>
          </Flex>
        </>
      )}
    </Layout>
  )
}

export default withApollo(WhatsNew)
