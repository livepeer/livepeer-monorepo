import * as React from 'react'
import styled from 'styled-components'

import enhance from './enhance'
import { BasicModal } from '../../components'
import { MathBN } from '../../utils'

const ProtocolStatus = ({ history, currentRound, currentBlock }) => {
  const { id } = currentBlock.data
  const { startBlock, length } = currentRound.data
  const nextRoundStartBlock = MathBN.add(startBlock, length)
  const blocksUntilNextRound = MathBN.sub(nextRoundStartBlock - id)

  return (
    <BasicModal
      title="Protocol Status"
      onClose={() => {
        history.push(history.location.pathname)
      }}
    >
      {currentRound.initialized ? null : (
        <Wrapper>
          <Row>
            <LabelColumn>
              # Blocks Until Round {nextRoundStartBlock}:
            </LabelColumn>
            <ValueColumn>{blocksUntilNextRound}</ValueColumn>
          </Row>
        </Wrapper>
      )}
    </BasicModal>
  )
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
`
const LabelColumn = styled.p`
  text-align: right;
  min-width: 60%;
`
const ValueColumn = styled.p`
  margin-left: 10px;
  text-align: left;
`
export default enhance(ProtocolStatus)
