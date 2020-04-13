import Confetti from 'react-confetti'


export default ({ tx }) => {
  return (
    <Modal
      isOpen={tx?.txHash}
      onDismiss={() => {
        setIsModalOpen(false)
      }}
      title={isMined ? 'Success!' : 'Broadcasted'}
      Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
    >
      {isMined && (
        <Confetti canvasRef={React.createRef()} width={width} height={height} />
      )}
      <Flow action="stake" account={transcoder.id} amount={amount} />
      <Flex
        sx={{
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {txHash && !isMined && (
          <>
            <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
              <Spinner sx={{ mr: 2 }} />
              <div sx={{ color: 'text' }}>
                Waiting for your transaction to be mined.
              </div>
            </Flex>
            <Button
              sx={{
                mb: [2, 2, 0],
                justifyContent: 'center',
                width: ['100%', '100%', 'auto'],
                display: 'flex',
                alignItems: 'center',
              }}
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${
                process.env.NETWORK === 'rinkeby' ? 'rinkeby.' : ''
              }etherscan.io/tx/${txHash}`}
            >
              View on Etherscan <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
            </Button>
          </>
        )}
        {isMined && (
          <Button onClick={() => setIsModalOpen(false)} sx={{ ml: 'auto' }}>
            Done
          </Button>
        )}
      </Flex>
    </Modal>
  )
}

renderSwitch(tx) {
  switch(param) {
    case 'approve':
      return 'bar';
    default:
      return 'foo';
  }
}
