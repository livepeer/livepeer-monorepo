import { TextField } from 'rmwc/TextField'
import { useForm, useField } from 'react-final-form-hooks'
import axios from 'axios'
import EmailValidator from 'email-validator'
import { Radio } from 'rmwc/Radio'
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import styled from 'styled-components'
import Button from '../Button'
import { withRouter } from 'react-router-dom'
import BasicModal from '../BasicModal'

const recaptchaRef = React.createRef()

const StyledTextField = styled(TextField)`
  height: initial !important;
  padding-bottom: 8px;
`

const onSubmit = async values => {
  try {
    recaptchaRef.current.execute()
    await axios.post('https://livepeer.studio/confirmEmail', {
      email: values.email,
      delegatorAddress: values.delegatorAddress.toLowerCase(),
      frequency: values.frequency,
      optInRedirect: `https://explorer.livepeer.org/accounts/${
        values.delegatorAddress
      }/delegating?action=confirm&frequency=${
        values.frequency
      }#/staking-alerts`,
      unsubscribeRedirect: `https://explorer.livepeer.org/accounts/${
        values.delegatorAddress
      }/delegating?action=unsubscribe#/staking-alerts`,
    })
  } catch (e) {
    console.log(e)
  }
}

const validate = values => {
  const regex = /^0x[a-fA-F0-9]{40}$/g
  const errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!EmailValidator.validate(values.email)) {
    errors.email = 'Invalid email address'
  }
  if (!values.delegatorAddress) {
    errors.delegatorAddress = 'Required'
  }
  // Check if delegator address is valid
  else if (!regex.test(values.delegatorAddress)) {
    errors.delegatorAddress = 'Invalid Ethereum Address'
  }
  return errors
}

export default withRouter(({ accountId, history, closeModal }) => {
  let { form, handleSubmit, submitting, submitSucceeded } = useForm({
    onSubmit,
    validate,
    initialValues: {
      frequency: 'weekly',
      delegatorAddress: accountId,
      optInRedirect: 'Livepeer',
      unsubscribeRedirect: 'Livepeer',
    },
  })

  let email = useField('email', form)
  let delegatorAddress = useField('delegatorAddress', form)
  let frequency = useField('frequency', form)
  let optInRedirect = useField('optInRedirect', form)
  let unsubscribeRedirect = useField('unsubscribeRedirect', form)

  const emailError = !!(email.meta.touched && email.meta.error)
  if (submitSucceeded) {
    return (
      <BasicModal title="Verify Your Email" onClose={closeModal} closeIcon>
        <p style={{ lineHeight: '24px', marginBottom: 0 }}>
          A verification email has been sent to your email address. Please
          confirm it to complete the process.
        </p>
      </BasicModal>
    )
  } else {
    return (
      <BasicModal title="Staking Alerts" onClose={closeModal} closeIcon>
        <p style={{ lineHeight: '24px', marginBottom: 24 }}>
          Sign up to receive email alerts with your earnings and keep tabs on
          how your transcoder is performing.
        </p>
        <form noValidate onSubmit={handleSubmit}>
          <input type="hidden" {...delegatorAddress.input} />
          <input type="hidden" {...optInRedirect.input} />
          <input type="hidden" {...unsubscribeRedirect.input} />
          <div style={{ marginBottom: 24 }}>
            <label
              style={{ color: emailError ? '#b00020' : 'inherit' }}
              htmlFor="email"
            >
              My email address is*
            </label>
            <StyledTextField
              {...email.input}
              id="email"
              required
              placeholder="Email"
              type="email"
              invalid={emailError}
              fullwidth
            />
            <span
              style={{
                marginTop: 4,
                fontSize: 12,
                color: '#b00020',
              }}
            >
              {emailError ? email.meta.error : ''}
            </span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Email me</label>
            <div
              style={{ marginLeft: -10, display: 'flex', flexDirection: 'row' }}
            >
              <div style={{ marginRight: 8 }}>
                <Radio
                  onChange={e => frequency.input.onChange(e.target.value)}
                  value="weekly"
                  checked={frequency.input.value === 'weekly'}
                  id="weekly"
                  label="Weekly"
                />
              </div>
              <Radio
                onChange={e => frequency.input.onChange(e.target.value)}
                value="monthly"
                checked={frequency.input.value === 'monthly'}
                id="monthly"
                label="Monthly"
              />
            </div>
          </div>
          <ReCAPTCHA
            badget="inline"
            ref={recaptchaRef}
            size="invisible"
            sitekey="6LeEfJMUAAAAADy6m3uGNTW0go3Qvp6zDQyuCr-X"
          />
          <div>
            <Button style={{ margin: 0 }} disabled={submitting} type="submit">
              SIGN UP
            </Button>
            <div style={{ fontSize: 12, marginTop: 8 }}>
              One click unsubscription in email.
            </div>
          </div>
        </form>
      </BasicModal>
    )
  }
})
