import QRCode from "qrcode.react";
import { textTruncate } from "../../lib/utils";
import Box from "../Box";
import Flex from "../Flex";

const ActiveCircle = ({ css = {}, active }) => {
  return (
    <Box
      className="status"
      css={{
        position: "absolute",
        right: "-2px",
        bottom: "-2px",
        bg: active ? "$primary" : "$muted",
        border: "3px solid",
        borderColor: "$background",
        boxSizing: "border-box",
        width: 14,
        height: 14,
        borderRadius: 1000,
        ...css,
      }}
    />
  );
};

const Index = ({ threeBoxSpace, active, address }) => {
  return (
    <Flex css={{ alignItems: "center" }}>
      <Flex
        css={{ minWidth: 30, minHeight: 30, position: "relative", mr: "$3" }}>
        {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && threeBoxSpace?.image ? (
          <Box
            as="img"
            css={{
              objectFit: "cover",
              borderRadius: 1000,
              width: 30,
              height: 30,
              padding: "2px",
              border: "1px solid",
              borderColor: "$muted",
            }}
            src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
          />
        ) : (
          <QRCode
            style={{
              borderRadius: 1000,
              width: 24,
              height: 24,
              padding: "2px",
              border: "1px solid",
              borderColor: "rgba(255,255,255,.6)",
            }}
            fgColor={`#${address.substr(2, 6)}`}
            value={address}
          />
        )}
        <ActiveCircle active={active} />
      </Flex>

      <Flex
        css={{
          color: "$text",
          transition: "all .3s",
          borderBottom: "1px solid",
          borderColor: "transparent",
          justifyContent: "space-between",
          width: "100%",
          minWidth: "100%",
        }}>
        <Flex
          className="orchestratorLink"
          css={{
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Box css={{ fontWeight: 600 }}>
            {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && threeBoxSpace?.name
              ? textTruncate(threeBoxSpace.name, 12, "…")
              : address.replace(address.slice(5, 36), "…")}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Index;
