import { Flex, Box } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { abbreviateNumber } from '../../lib/utils'

const ProjectionBox = ({ action }) => {
  const GET_ROI = gql`
    {
      roi @client
      principle @client
    }
  `

  const { data } = useQuery(GET_ROI)

  return (
    <div
      sx={{
        borderRadius: 10,
        width: '100%',
        bg: 'background',
        mb: 2,
      }}
    >
      <Box sx={{ px: 2, py: 2 }}>
        <Box>
          <Flex
            sx={{
              fontSize: 0,
              mb: 2,
              justifyContent: 'space-between',
            }}
          >
            <div sx={{ color: 'muted' }}>
              {action == 'stake'
                ? 'Projected Rewards (1Y)'
                : 'Projected Opportunity Cost (1Y)'}
            </div>
            {action == 'stake' && (
              <div sx={{ fontFamily: 'monospace', color: 'muted' }}>
                +
                {data.principle
                  ? ((data.roi / data.principle) * 100).toFixed(2) + '%'
                  : 0 + '%'}
              </div>
            )}
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div sx={{ fontSize: 4, fontFamily: 'monospace' }}>
              +{abbreviateNumber(data.roi)}
            </div>
            <div sx={{ fontSize: 1 }}>LPT</div>
          </Flex>
        </Box>
      </Box>
    </div>
  )
}

export default ProjectionBox
