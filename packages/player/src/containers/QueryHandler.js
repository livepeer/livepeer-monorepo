/**
 * This file should handle all shared logic between the main and embedded players
 */

import React from 'react'
import * as qs from 'query-string'
import { Redirect } from 'react-router-dom'

export default props => {
  const { required = true, component: Child } = props
  const parsed = qs.parse(document.location.search)
  if (!parsed.url && required) {
    return <Redirect to="/" />
  }
  return <Child {...props} {...parsed} />
}
