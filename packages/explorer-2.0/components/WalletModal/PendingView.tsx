import Box from "../Box";
import Flex from "../Flex";
import Spinner from "../Spinner";
import { SUPPORTED_WALLETS } from "../../lib/constants";
import Option from "./Option";
import { Injected } from "../../lib/connectors";

const PendingView = ({ connector }) => {
  const isMetamask = window["ethereum"] && window["ethereum"].isMetaMask;
  return (
    <Box>
      <Flex
        css={{
          alignItems: "center",
          border: "1px solid",
          borderColor: "$border",
          borderRadius: 10,
          p: "$3",
          mb: "$3",
        }}
      >
        <Spinner speed="1.5s" css={{ width: 20, height: 20, mr: "$3" }} />
        Initializing
      </Flex>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        if (option.connector === connector) {
          if (option.connector === Injected) {
            if (isMetamask && option.name !== "MetaMask") {
              return null;
            }
            if (!isMetamask && option.name === "MetaMask") {
              return null;
            }
          }
          return (
            <Option
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              Icon={option.icon}
            />
          );
        }
        return null;
      })}
    </Box>
  );
};

export default PendingView;
