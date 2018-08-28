// @flow
import * as React from 'react'
import styled from 'styled-components'
import Avatar from '../Avatar'
import type { InlineAccountProps } from './props'

const InlineAccount: React.ComponentType<InlineAccountProps> = styled(
  ({ address, border, className, truncate }) => (
    <div className={className}>
      <Avatar id={address} size={32} />
      <span className="address">
        {!truncate ? address : `${address.substr(0, truncate)}...`}
      </span>
    </div>
  ),
)`
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  box-shadow: ${({ border }) =>
    border ? '0 0 0 1px rgba(0, 0, 0, .15)' : 'none'};
  padding: 8px;
  border-radius: 4px;
  > .address {
    margin-left: 8px;
    text-decoration: none;
    color: #000;
  }
`

export default InlineAccount
