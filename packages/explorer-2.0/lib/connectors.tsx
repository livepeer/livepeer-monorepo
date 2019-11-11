import { Connectors } from "web3-react";
import PortisApi from "@portis/web3";

const {
  InjectedConnector,
  PortisConnector,
  NetworkOnlyConnector
} = Connectors;

const supportedNetworkURLs = {
  1: "https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e",
  4: "https://rinkeby.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e"
};

const Network = new NetworkOnlyConnector({
  providerURL: supportedNetworkURLs[1]
});

const Injected = new InjectedConnector({
  supportedNetworks: [1, 4]
});


const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: "0e9ac0c3-9184-4660-8492-6989cf3dc5d4",
  network: "mainnet"
});

export default {
  Injected,
  Network,
  Portis
};
