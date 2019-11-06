/** @jsx jsx */
import React from 'react'
import { jsx, Styled, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Spinner from '../components/Spinner'
import { withApollo } from '../lib/apollo'
import gql from 'graphql-tag'
import Card from '../components/Card'
import moment from 'moment'
import { getLayout } from '../layouts/main'

const GET_CHANGEFEED = gql`
  {
    projectBySlugs(organizationSlug: "livepeer", projectSlug: "explorer") {
      name
      releases {
        edges {
          node {
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

const WhatsNew = () => {
  const { data, loading } = useQuery(GET_CHANGEFEED)

  return (
    <>
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
              <li>3Box integration</li>
              <li>Protocol status widget</li>
              <li>Network statistics view</li>
              <li>Onboarding tutorial</li>
              <li>Notifications system</li>
            </ul>

            <div>
              {data.projectBySlugs.releases.edges.map(
                ({ node }, i) =>
                  node.isPublished && (
                    <Card key={i} sx={{ flex: 1, mb: 4 }}>
                      <Styled.h3>The First Release</Styled.h3>
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
                        }}
                      >
                        {node.description}
                      </div>
                      {node.changes.map((change, i) => (
                        <div key={i} sx={{ alignSelf: 'flexStart' }}>
                          <div
                            sx={{
                              fontSize: '14px',
                              display: 'inline-flex',
                              textTransform: 'uppercase',
                              lineHeight: '1',
                              fontWeight: 'bold',
                              margin: '0px',
                              padding: '4px 16px',
                              borderRadius: '4px',
                              color: 'background',
                              backgroundColor: 'primary',
                              mb: 2,
                            }}
                          >
                            {change.type}
                          </div>
                          <div>{change.content}</div>
                        </div>
                      ))}
                    </Card>
                  ),
              )}
            </div>
          </Flex>
        </>
      )}
    </>
  )
}

WhatsNew.getLayout = getLayout
WhatsNew.displayName = ''
export default WhatsNew
