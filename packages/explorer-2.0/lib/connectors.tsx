import { InjectedConnector } from "@web3-react/injected-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_1 as string,
  4: process.env.NEXT_PUBLIC_RPC_URL_4 as string,
};

export const Network = new NetworkConnector({
  defaultChainId: process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? 4 : 1,
  urls: RPC_URLS,
});

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 4, 1337],
});

// mainnet only
export const Portis = new PortisConnector({
  dAppId: process.env.NEXT_PUBLIC_PORTIS_DAPP_ID,
  networks: [1],
});

// mainnet only
export const Fortmatic = new FortmaticConnector({
  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_API_KEY,
  chainId: 1,
});

// mainnet only
export const WalletLink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "Livepeer Explorer",
  appLogoUrl: "https://explorer.livepeer.org/img/logo-icon.svg",
});

export const WalletConnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});
