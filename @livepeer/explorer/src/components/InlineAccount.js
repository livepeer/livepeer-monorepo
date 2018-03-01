// @flow
import * as React from 'react'
import styled from 'styled-components'
import Avatar from './Avatar'

type InlineAccountProps = {
  address: string,
}

const InlineAccount: React.ComponentType<InlineAccountProps> = styled(
  ({ address, className }) => (
    <div className={className}>
      <Avatar id={address} size={32} />
      <span className="address">{address}</span>
    </div>
  ),
)`
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  > .address {
    margin-left: 8px;
  }
`

export default InlineAccount
