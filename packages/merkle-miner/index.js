import MerkleMiner from './dist/merkle-miner.es'
import workerHash from './hash'
;(async () => {
  const append = (...xs) => {
    document.body.innerText += xs.join(' ').trim() + '\n'
  }
  const write = (...xs) => {
    document.body.innerText = xs.join(' ').trim() + '\n'
  }
  const replace = (...xs) => {
    let { innerText } = document.body
    innerText = innerText.split('\n').filter(x => x)
    innerText.splice(-1, 1)
    innerText.push(xs.join(' ').trim() + '\n')
    document.body.innerText = innerText.join('\n')
  }
  const miner = (window.miner = await new MerkleMiner({
    gateway: 'http://localhost:8080/ipfs',
    workerHash,
    onResolveHashSuccess: ({ hash }) => {
      append(`got ${hash} from ipfs...`)
    },
    onConstructTreeProgress: n => {
      n === 0
        ? append('generating merkle tree...', n)
        : replace('generating merkle tree...', n)
    },
    onConstructTreeSuccess: () => {
      replace('generated merkle tree!')
    },
    onResolveHashError: console.error,
    onConstructTreeError: console.error,
  }))

  write('Mining merkle proof...')
  const proof = await miner.getProof(
    'QmQbvkaw5j8TFeeR7c5Cs2naDciUVq9cLWnV3iNEzE784r',
    '4fe9367ef5dad459ae9cc4265c69b1b10a4e1288',
  )
  append('proof!', proof)
})()
