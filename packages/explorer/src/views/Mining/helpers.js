import styled, { keyframes } from 'styled-components'

const fade = keyframes`
  0% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
`

const ProgressBar = styled.div`
  animation: ${({ done }) =>
    !done ? `1s ${fade} ease-out alternate infinite` : ''};
`

/**
 * Defines contract addresses for
 * MerkleMine, MultiMerkleMine and LPT
 * currently contracts are only deployed on
 * MainNet and Rinkeby which holds the positions
 * 1 and 4. If contracts gets deployed on ropsten = 2
 * or Kovan = 3, then those filed could be placed here
 */
const netAddresses = {
  '1': {
    merkleMine: '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8',
    multiMerkleMine: '0x182ebf4c80b28efc45ad992ecbb9f730e31e8c7f',
    token: '0x58b6a8a3302369daec383334672404ee733ab239',
  },
  '2': {
    merkleMine: '',
    multiMerkleMine: '',
    token: '',
  },
  '3': {
    merkleMine: '',
    multiMerkleMine: '',
    token: '',
  },
  '4': {
    merkleMine: '0x3bb5c927b9dcf20c1dca97b93397d22fda4f5451',
    multiMerkleMine: '0x2ec3202aaeff2d3f7dd8571fe4a0bfc195ef6a17',
    token: '0x750809dbdb422e09dabb7429ffaa94e42021ea04',
  },
}

const numAddresses = 20

export { ProgressBar, netAddresses, numAddresses }
