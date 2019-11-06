import { Connectors } from "web3-react";
import PortisApi from "@portis/web3";

const {
  InjectedConnector,
  PortisConnector
} = Connectors;

const Injected = new InjectedConnector({
  supportedNetworks: [1, 4]
});


const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: "0e9ac0c3-9184-4660-8492-6989cf3dc5d4",
  network: "mainnet"
});

export default {
  Portis,
  Injected
};
