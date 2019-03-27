// @flow
import * as React from 'react'
import { BasicModal, StakingAlertsForm } from '../../components'

export type StakingAlertsViewProps = {
  history: History,
}

const StakingAlertsView: React.ComponentType<StakingAlertsViewProps> = ({
  history,
  ...props
}) => {
  const accountId = window.location.pathname.split('/')[2]
  const searchParams = new URLSearchParams(document.location.search)
  const action = searchParams.get('action')
  const frequency = searchParams.get('frequency')
  const closeModal = () => history.push(history.location.pathname)

  switch (action) {
    case 'confirm':
      return (
        <BasicModal
          title="Verification Successful"
          onClose={closeModal}
          closeIcon
        >
          <p style={{ lineHeight: '24px', marginBottom: 0 }}>
            {`Your email has been verified. We will send you an email with your earnings ${
              frequency === 'weekly'
                ? 'every Friday at 7AM EST (12PM UTC)'
                : 'on the 1st of every month at 7AM EST (12PM UTC)'
            }.`}
          </p>
        </BasicModal>
      )
    case 'unsubscribe':
      return (
        <BasicModal
          closeIcon
          title="Unsubscription Successful"
          onClose={closeModal}
        >
          <p style={{ lineHeight: '24px', marginBottom: 0 }}>
            {`You've been successfully unsubscribed from the ${
              frequency === 'weekly' ? 'weekly' : 'monthly'
            } email alert for the specified account.`}
          </p>
        </BasicModal>
      )
    default:
      return (
        <StakingAlertsForm
          history={history}
          accountId={accountId}
          closeModal={closeModal}
        />
      )
  }
}

export default StakingAlertsView
