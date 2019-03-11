import React, { useState, useEffect } from 'react'

export default props => {
  const importPromise = props.asyncComponent
  const [Component, setComponent] = useState(null)

  // Use an effect hook so the subcomponent only loads when the import changes
  useEffect(
    () => {
      importPromise.then(mod => {
        // Need to pass a function to setComponent or it executes the imported component
        // https://github.com/facebook/react/issues/14087
        setComponent(() => mod.default)
      })
    },
    [importPromise],
  )

  // Still loading
  if (!Component) {
    return <div />
  }
  return <Component {...props} />
}
