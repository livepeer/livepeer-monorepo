import fetch from 'isomorphic-fetch'
import { SUBGRAPH_ID, SUBGRAPH_URL, DISCORD_URL } from './config'

const NOTIFICATION_THRESHOLD = 5

const query = `
  query deployment {
    subgraphDeployment(id: "${SUBGRAPH_ID}") {
      latestEthereumBlockHash
      latestEthereumBlockNumber
    }
  }
`

export async function getGraphBlock() {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })
  const { data } = await res.json()
  const {
    latestEthereumBlockHash,
    latestEthereumBlockNumber,
  } = data.subgraphDeployment
  return [parseInt(latestEthereumBlockNumber), latestEthereumBlockHash]
}

export async function discordNotification(content) {
  // Note that DISCORD_URL should be Discord's "Slack" format messages
  const res = await fetch(DISCORD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ text: content }),
  })
  await res.text()
}

export async function getPublicBlock() {
  const res = await fetch('https://api.blockcypher.com/v1/eth/main')
  const { height, hash } = await res.json()
  return [height, hash]
}

export async function poll() {
  const [lpNumber, lpHash] = await getGraphBlock()
  const [publicNumber, publicHash] = await getPublicBlock()
  const delta = publicNumber - lpNumber
  if (delta >= NOTIFICATION_THRESHOLD) {
    const message = `testing`
    await discordNotification(
      `Livepeer subgraph is currently ${delta} blocks behind. <${DISCORD_USER}>, you should look into that. Most recent block: https://etherscan.io/block/${lpNumber}`,
    )
  }
}
