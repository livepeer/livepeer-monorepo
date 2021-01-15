import { Flex } from "theme-ui";
import QRCode from "qrcode.react";
import { textTruncate } from "../../lib/utils";

const ActiveCircle = ({ active }, props) => {
  return (
    <div
      className="status"
      sx={{
        position: "absolute",
        right: "-2px",
        bottom: "-2px",
        bg: active ? "primary" : "muted",
        border: "3px solid",
        borderColor: "background",
        boxSizing: "border-box",
        width: 14,
        height: 14,
        borderRadius: 1000,
        ...props.sx,
      }}
    />
  );
};

const Index = ({ threeBoxSpace, active, address }) => {
  return (
    <Flex sx={{ alignItems: "center" }}>
      <Flex sx={{ minWidth: 30, minHeight: 30, position: "relative", mr: 2 }}>
        {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && threeBoxSpace.image ? (
          <img
            sx={{
              objectFit: "cover",
              borderRadius: 1000,
              width: 30,
              height: 30,
              padding: "2px",
              border: "1px solid",
              borderColor: "muted",
            }}
            src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
          />
        ) : (
          <QRCode
            style={{
              borderRadius: 1000,
              width: 30,
              height: 30,
              padding: "2px",
              border: "1px solid",
              borderColor: "muted",
            }}
            fgColor={`#${address.substr(2, 6)}`}
            value={address}
          />
        )}
        <ActiveCircle active={active} />
      </Flex>

      <Flex
        sx={{
          color: "text",
          transition: "all .3s",
          borderBottom: "1px solid",
          borderColor: "transparent",
          justifyContent: "space-between",
          width: "100%",
          minWidth: "100%",
        }}>
        <Flex
          className="orchestratorLink"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <div sx={{ fontWeight: 600 }}>
            {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && threeBoxSpace.name
              ? textTruncate(threeBoxSpace.name, 15, "…")
              : address.replace(address.slice(5, 39), "…")}
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Index;
