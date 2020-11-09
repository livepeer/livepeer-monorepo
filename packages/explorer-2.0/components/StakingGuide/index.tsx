import { useState, useEffect } from 'react'
import { Styled, Flex } from 'theme-ui'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import Button from '../Button'
import dynamic from 'next/dynamic'
import { useWeb3React } from '@web3-react/core'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Step7 from './Step7'
import gql from 'graphql-tag'
import { Box } from 'theme-ui'
import accountQuery from '../../queries/account.gql'

const Tour: any = dynamic(() => import('reactour'), { ssr: false })
const GET_TOUR_OPEN = gql`
  {
    tourOpen @client
  }
`

const Index = ({ children, ...props }) => {
  const client = useApolloClient()
  const [open, setOpen] = useState(false)
  const [tourKey, setTourKey] = useState(0)
  const context = useWeb3React()
  const [nextStep, setNextStep] = useState(1)
  const inititalSteps = []
  const [steps, setSteps] = useState([...inititalSteps])
  const [tourStyles, setTourStyles] = useState({
    backgroundColor: '#131418',
    maxWidth: 'auto',
  })

  const { data: dataMyAccount } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    skip: !context.active,
    ssr: false,
  })
  const { data } = useQuery(GET_TOUR_OPEN)

  useEffect(() => {
    if (nextStep === 6) {
      setTourStyles({
        ...tourStyles,
        maxWidth: '270px',
      })
    } else {
      setTourStyles({
        ...tourStyles,
        maxWidth: 'auto',
      })
    }
  }, [nextStep])

  useEffect(() => {
    setSteps([
      {
        selector: '.tour-step-1',
        content: ({ goTo }) => <Step1 goTo={goTo} nextStep={nextStep} />,
        style: tourStyles,
      },
      {
        selector: '.tour-step-2',
        content: ({ goTo }) => <Step2 goTo={goTo} nextStep={nextStep} />,
        style: tourStyles,
      },

      {
        selector: '.tour-step-3',
        content: ({ goTo }) => <Step3 goTo={goTo} nextStep={nextStep} />,
        style: tourStyles,
      },
      {
        selector: '.tour-step-4',
        content: ({ goTo }) => <Step4 goTo={goTo} nextStep={nextStep} />,
        style: tourStyles,
      },
      {
        style: tourStyles,
        content: ({ goTo }) => {
          return <Step5 goTo={goTo} nextStep={nextStep} />
        },
      },
      {
        action: (node) => node.focus(),
        selector: '.tour-step-6',
        content: ({ goTo }) => {
          return <Step6 goTo={goTo} nextStep={nextStep} />
        },
        style: tourStyles,
      },
      {
        action: (node) => node.focus(),
        selector: '.tour-step-7',
        content: () => {
          return <Step7 />
        },
        style: tourStyles,
      },
    ])
  }, [dataMyAccount?.account, context.active, nextStep, tourStyles])

  return (
    <Box {...props}>
      <Button
        sx={{ mt: 2, width: '100%' }}
        variant="rainbow"
        onClick={async () => {
          setOpen(true)
        }}
      >
        {children}
      </Button>

      <Tour
        disableDotsNavigation={true}
        disableKeyboardNavigation={['right', 'left']}
        key={tourKey}
        showButtons={false}
        accentColor="#E926BE"
        maskSpace={10}
        startAt={context.active ? 2 : 0}
        isOpen={data ? data.tourOpen : false}
        nextButton={<Button>Next</Button>}
        closeWithMask={false}
        onRequestClose={() => {
          client.writeData({
            data: {
              tourOpen: false,
            },
          })
          setTourKey(tourKey + 1)
        }}
        getCurrentStep={(curr) => {
          setNextStep(curr + 1)
        }}
        steps={steps}
      />

      {open && (
        <Styled.div
          as={DialogOverlay}
          sx={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onDismiss={() => setOpen(false)}
        >
          <Flex
            as={DialogContent}
            sx={{ p: 0, bg: 'surface', borderRadius: 2 }}
          >
            <Flex
              sx={{
                background: 'linear-gradient(180deg, #2C785F 0%, #00ED6D 100%)',
                minWidth: 220,
                width: 220,
                flexDirection: 'column',
                px: 3,
                py: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[
                'Connect Wallet',
                'Get LPT',
                'Unlock LPT',
                'Choose Orchestrator',
                'Stake',
              ].map((title, i) => (
                <Flex
                  key={i}
                  sx={{ flexDirection: 'column', alignItems: 'center' }}
                >
                  <Flex
                    sx={{
                      color: 'rgba(255, 255, 255, .5)',
                      border: '4px solid',
                      borderRadius: 1000,
                      borderColor: 'rgba(255, 255, 255, .5)',
                      width: '40px',
                      height: '40px',
                      fontWeight: 500,
                      fontSize: 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </Flex>
                  <div
                    sx={{
                      lineHeight: '24px',
                      textAlign: 'center',
                      fontWeight: 500,
                      mt: 1,
                      mb: i == 4 ? 0 : 1,
                    }}
                  >
                    {title}
                  </div>
                  {!(i == 4) && (
                    <div
                      sx={{
                        width: 1,
                        mb: 2,
                        height: 18,
                        backgroundColor: 'rgba(255, 255, 255, .5)',
                      }}
                    />
                  )}
                </Flex>
              ))}
            </Flex>
            <Flex
              sx={{
                width: '100%',
                py: 5,
                px: 4,
                alignItems: 'flex-start',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Styled.h1 as="h2" sx={{ mb: 2 }}>
                Welcome to the Livepeer Staking Guide
              </Styled.h1>
              <Styled.p>
                Not sure how to get started? No worries, we’ve got you covered.
              </Styled.p>
              <Styled.p>
                Our staking guide takes you step-by-step through the process of
                staking your first Livepeer tokens.
              </Styled.p>
              <Button
                sx={{ justifySelf: 'flex-start', mt: 2 }}
                variant="secondary"
                onClick={() => {
                  setOpen(false)
                  client.writeData({
                    data: {
                      tourOpen: true,
                    },
                  })
                }}
              >
                Let's Get Started
              </Button>
            </Flex>
          </Flex>
        </Styled.div>
      )}
    </Box>
  )
}

export default Index
