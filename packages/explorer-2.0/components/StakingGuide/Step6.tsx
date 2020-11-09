import { Styled } from 'theme-ui'
import Button from '../Button'

const Step6 = ({ goTo, nextStep }) => {
  return (
    <div sx={{ py: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Choose Orchestrator</Styled.h2>
      <Styled.p>
        It's your job as a tokenholder to research orchestrators based upon
        their past performance, statistics, rates they are charging, and any
        social campaigns that they’ve posted indicating why they believe they
        will do a good job for the network. Click on any orchestrator to view
        their on chain statistics.
      </Styled.p>
      <Button
        onClick={() => {
          goTo(nextStep)
        }}
        sx={{ position: 'absolute', right: 30, bottom: 16 }}
      >
        Next
      </Button>
    </div>
  )
}

export default Step6
