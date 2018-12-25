import * as React from 'react'
import Confetti from 'react-dom-confetti'

export default ({ active }) => (
  <Confetti
    active={active}
    config={{
      angle: 90,
      spread: 197,
      startVelocity: 45,
      elementCount: 50,
      decay: 0.9,
    }}
  />
)
