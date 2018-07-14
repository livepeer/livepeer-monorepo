import * as React from 'react'
import styled from 'styled-components'
import enhance from './enhance'
import { BasicModal, Button } from '../../components'
import { MathBN } from '../../utils'

const ProtocolStatus = ({
  coinbase,
  history,
  initializeRound,
  currentRound,
  currentBlock,
}) => {
  const authenticated = !!coinbase.data.coinbase
  const { id: currentBlockNum } = currentBlock.data
  const {
    id: currentRoundNum,
    initialized,
    startBlock,
    length,
  } = currentRound.data
  const nextRoundStartBlock = MathBN.add(startBlock, length)
  const nextRoundNum = MathBN.add(currentRoundNum, '1')
  const blocksUntilNextRound = MathBN.sub(nextRoundStartBlock - currentBlockNum)
  const loading = currentBlock.loading && currentRound.loading
  const canInitialize = !(loading || initialized || !authenticated)
  const closeModal = () => history.push(history.location.pathname)
  return (
    <BasicModal title="Protocol Status" onClose={closeModal}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Wrapper>
          <Row>
            <LabelColumn>Blocks Until Round #{nextRoundNum}:</LabelColumn>
            <ValueColumn>
              {initialized ? blocksUntilNextRound : 'N/A'}
            </ValueColumn>
          </Row>
        </Wrapper>
      )}
      <div style={{ textAlign: 'right', paddingTop: 24 }}>
        <Button onClick={closeModal}>
          {canInitialize ? 'Cancel' : 'Done'}
        </Button>
        {canInitialize && (
          <Button className="primary" onClick={initializeRound}>
            Initialize Round
          </Button>
        )}
      </div>
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
