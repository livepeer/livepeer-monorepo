/**
 * This file should handle all shared logic between the main and embedded players
 */

import React from 'react'
import * as qs from 'query-string'
import { Redirect } from 'react-router-dom'

export default props => {
  const Child = props.component
  const parsed = qs.parse(document.location.search)
  if (!parsed.url) {
    return <Redirect to="/" />
  }
  return <Child key={parsed.url} {...parsed} />
}
