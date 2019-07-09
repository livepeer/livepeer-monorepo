import React, { useState } from 'react'
import styled from 'styled-components'
import Popup from 'reactjs-popup'

const AlertDialog = styled.div``

export default ({ openTrigger }) => {
  return (
    <div>
      <Popup open={openTrigger} />
    </div>
  )
}
