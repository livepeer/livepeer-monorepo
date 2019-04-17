import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URL, DISCORD_NOTIFICATION_URL, DISCORD_USER } from './config'

const NOTIFICATION_THRESHOLD = 5

const query = `
{
	subgraphs(where: {name: "livepeer"}) {
    currentVersion {
      deployment {
        latestEthereumBlockNumber
        latestEthereumBlockHash
      }
    }
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
  } = data.subgraphs[0].currentVersion.deployment
  return [parseInt(latestEthereumBlockNumber), latestEthereumBlockHash]
}

export async function discordNotification(content) {
  console.log(`notifying: ${content}`)
  // Note that DISCORD_NOTIFICATION_URL should be Discord's "Slack" format messages
  const res = await fetch(DISCORD_NOTIFICATION_URL, {
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
    await discordNotification(
      `Livepeer subgraph is currently ${delta} blocks behind. <@${DISCORD_USER}>, you should look into that. Most recent block: https://etherscan.io/block/${lpNumber}`,
    )
  } else {
    console.log(`Livepeer subgraph only ${delta} blocks behind, exiting.`)
  }
}

poll()
