import fetch from "isomorphic-fetch";

const NOTIFICATION_THRESHOLD = 5;

const query = `
  query deployment {
    subgraphDeployment(id: "QmRqkn956oCoKRNY7sGzg7HoMLjDBgUG16pgA83cxGSyxz") {
      latestEthereumBlockHash
      latestEthereumBlockNumber
    }
  }
`;

export async function getGraphBlock() {
  const res = await fetch("https://graph.livepeer.org/subgraphs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query
    })
  });
  const { data } = await res.json();
  const {
    latestEthereumBlockHash,
    latestEthereumBlockNumber
  } = data.subgraphDeployment;
  return [parseInt(latestEthereumBlockNumber), latestEthereumBlockHash];
}

export async function discordNotification(content) {
  const res = await fetch(
    "https://discordapp.com/api/webhooks/563852076615073792/NuijhpwYle3T51fG0Lx2X9VjL2nrN9AxtfAz5D6bTvt4A4eZPhRibo2rBBc46b3l475i/slack",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ text: content })
    }
  );
  console.log(await res.text());
}

export async function getPublicBlock() {
  const res = await fetch("https://api.blockcypher.com/v1/eth/main");
  const { height, hash } = await res.json();
  return [height, hash];
}

export async function poll() {
  const [lpNumber, lpHash] = await getGraphBlock();
  const [publicNumber, publicHash] = await getPublicBlock();
  const delta = publicNumber - lpNumber;
  if (delta > NOTIFICATION_THRESHOLD) {
    const message = `testing`;
    await discordNotification(
      `Livepeer subgraph is currently ${delta} blocks behind. <@150800399576596480>, you should look into that.`
    );
  }
}
