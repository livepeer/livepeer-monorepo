import { Flex } from 'theme-ui'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'

function getSteps(hasProfile) {
  if (hasProfile) {
    return ['Sign message #1', 'Sign message #2']
  } else {
    return ['Sign message #1', 'Sign message #2', 'Sign message #3']
  }
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <Flex sx={{ flexDirection: 'column' }}>
          <img
            sx={{ borderRadius: 6, maxWidth: 200 }}
            src="/img/sign-message-screenshot-1.png"
          />
        </Flex>
      )
    case 1:
      return (
        <Flex sx={{ flexDirection: 'column' }}>
          <img
            sx={{ borderRadius: 6, maxWidth: 200 }}
            src="/img/sign-message-screenshot-2.png"
          />
        </Flex>
      )
    case 2:
      return (
        <Flex sx={{ flexDirection: 'column' }}>
          <img
            sx={{ borderRadius: 6, maxWidth: 200 }}
            src="/img/sign-message-screenshot-3.png"
          />
        </Flex>
      )
    default:
      return 'Unknown step'
  }
}
export default ({ hasProfile, activeStep }) => {
  let steps = getSteps(hasProfile)

  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel sx={{ fontFamily: 'primary' }}>{label}</StepLabel>
          <StepContent>
            <div>{getStepContent(index)}</div>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  )
}
