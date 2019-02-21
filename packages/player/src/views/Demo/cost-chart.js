import React from 'react'

export default () => {
  const refCallback = ref => {
    console.log('got ref', ref)
  }
  return <svg ref={refCallback} />
}
