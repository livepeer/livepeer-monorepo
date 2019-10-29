/** @jsx jsx */
import { Styled, Flex, jsx } from 'theme-ui'
import React from 'react'
import Label from '../Label'
import Checkbox from '../Checkbox'

export default ({
  label = null,
  description,
  icon: Icon,
  isActive = false,
  providerName,
  ...props
}) => (
  <div
    {...props}
    sx={{
      cursor: 'pointer',
      border: '1px solid',
      borderColor: isActive ? 'primary' : 'muted',
      borderRadius: 4,
      p: 3,
    }}
  >
    <Flex sx={{ justifyContent: 'space-between' }}>
      <Flex sx={{ mb: 2, alignItems: 'center' }}>
        <Icon sx={{ mr: 2 }} />
        {label && <Label>Recommended</Label>}
      </Flex>
      <Checkbox isActive={isActive} />
    </Flex>
    <Styled.h2 sx={{ mb: 2 }}>{providerName}</Styled.h2>
    <Styled.p>{description}</Styled.p>
  </div>
)
