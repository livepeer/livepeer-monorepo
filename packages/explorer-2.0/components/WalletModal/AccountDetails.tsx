import Box from "../Box";
import Flex from "../Flex";
import { useWeb3React } from "@web3-react/core";
import { isMobile } from "react-device-detect";
import { Injected, WalletLink } from "../../lib/connectors";
import CloseIcon from "../../public/img/close.svg";
import Button from "../Button";
import { SUPPORTED_WALLETS } from "../../lib/constants";

const AccountDetails = ({ onClose, openOptions }) => {
  const { account, connector } = useWeb3React();

  function formatConnectorName() {
    const isMetaMask =
      window["ethereum"] && window["ethereum"].isMetaMask ? true : false;
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== Injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <Box>{name}</Box>;
  }

  return (
    <Box>
      <Flex
        css={{
          justifyContent: "space-between",
          alignItems: "center",
          pt: "$3",
          px: "$2",
          pb: 0,
          "@bp3": {
            pt: "$4",
            px: "$4",
          },
        }}
      >
        <Box css={{ fontWeight: 500 }}>Account</Box>
        <Box
          css={{
            cursor: "pointer",
            right: 20,
            top: 20,
            color: "white",
          }}
        >
          <CloseIcon onClick={onClose} />
        </Box>
      </Flex>
      <Box
        css={{
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
          p: "$4",
        }}
      >
        <Box
          css={{
            border: "1px solid",
            borderColor: "$border",
            borderRadius: 10,
            p: "$3",
          }}
        >
          <Flex css={{ mb: "$3", justifyContent: "space-between" }}>
            {formatConnectorName()}
            {connector !== Injected && connector !== WalletLink && (
              <Button
                color="primary"
                outline
                size="small"
                onClick={() => {
                  (connector as any).close();
                }}
              >
                Disconnect
              </Button>
            )}
          </Flex>

          <Box
            as="a"
            css={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "$primary",
            }}
            href={`https://etherscan.io/address/${account}`}
            target="__blank"
          >
            {account} ↗
          </Box>
        </Box>
        {!(isMobile && (window["web3"] || window["ethereum"])) && (
          <Box css={{ textAlign: "center", mt: "$3" }}>
            <Button
              color="primary"
              outline
              onClick={() => {
                openOptions();
              }}
            >
              Connect to a different wallet
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AccountDetails;
