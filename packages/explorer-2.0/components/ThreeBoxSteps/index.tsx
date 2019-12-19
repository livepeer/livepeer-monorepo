import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'

function getSteps(hasProfile) {
  if (hasProfile) {
    return ['Sign Message One', 'Sign Message Two']
  } else {
    return ['Sign Message One', 'Sign Message Two', 'Sign Message Three']
  }
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Sign the message in your Web3 wallet to continue.`
    case 1:
      return `Sign another message in your Web3 wallet`
    case 2:
      return `Last one. Promise!`
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
