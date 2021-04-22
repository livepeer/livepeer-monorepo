import QRCode from "qrcode.react";
import Box from "../Box";
import Flex from "../Flex";

const Header = ({ transcoder, delegateProfile }) => {
  return (
    <Box
      as="h3"
      css={{
        pt: "$3",
        pb: "$2",
        px: "$3",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
      }}>
      <Flex
        css={{ minWidth: 40, minHeight: 40, position: "relative", mr: "$3" }}>
        {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && delegateProfile?.image ? (
          <Box
            as="img"
            css={{
              objectFit: "cover",
              borderRadius: 1000,
              width: 40,
              height: 40,
            }}
            src={`https://ipfs.infura.io/ipfs/${delegateProfile.image}`}
          />
        ) : (
          <QRCode
            style={{
              borderRadius: 1000,
              width: 40,
              height: 40,
            }}
            fgColor={`#${transcoder?.id.substr(2, 6)}`}
            value={transcoder?.id}
          />
        )}
      </Flex>
      <Flex css={{ flexDirection: "column" }}>
        <Box as="h4" css={{ fontSize: 20 }}>
          {process.env.NEXT_PUBLIC_THREEBOX_ENABLED && delegateProfile?.name
            ? delegateProfile.name
            : transcoder.id.replace(transcoder.id.slice(7, 37), "…")}
        </Box>
        <Box
          css={{
            fontWeight: "normal",
            color: "$muted",
            fontSize: "$2",
            lineHeight: 1.5,
            textTransform: "initial",
          }}
        />
      </Flex>
    </Box>
  );
};

export default Header;
