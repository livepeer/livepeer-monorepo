import { Connectors } from "web3-react";
import PortisApi from "@portis/web3";

const {
  InjectedConnector,
  NetworkOnlyConnector,
  LedgerConnector,
  FortmaticConnector,
  PortisConnector
} = Connectors;

const supportedNetworkURLs = {
  1: "wss://mainnet.infura.io/ws/v3/39df858a55ee42f4b2a8121978f9f98e",
  4: "https://rinkeby.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e"
};

const defaultNetwork = 1;


const MetaMask = new InjectedConnector({
  supportedNetworks: [1, 4]
});

const Ledger = new LedgerConnector({
  supportedNetworkURLs,
  defaultNetwork
});

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
  network: "mainnet"
});

export default {
  MetaMask,
  Ledger,
  Portis
};
