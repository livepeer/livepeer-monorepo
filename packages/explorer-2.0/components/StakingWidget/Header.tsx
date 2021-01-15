import { Styled, Flex } from "theme-ui";
import QRCode from "qrcode.react";

const Header = ({ transcoder }) => {
  return (
    <Styled.h4
      as="h3"
      sx={{
        pt: 2,
        pb: 1,
        px: 2,
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
      }}>
      <Flex sx={{ minWidth: 40, minHeight: 40, position: "relative", mr: 2 }}>
        {process.env.NEXT_PUBLIC_THREEBOX_ENABLED &&
        transcoder?.threeBoxSpace &&
        transcoder?.threeBoxSpace.image ? (
          <img
            sx={{
              objectFit: "cover",
              borderRadius: 1000,
              width: 40,
              height: 40,
            }}
            src={`https://ipfs.infura.io/ipfs/${transcoder?.threeBoxSpace.image}`}
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
      <Flex sx={{ flexDirection: "column" }}>
        <Styled.h4 sx={{ fontSize: 20 }}>
          {process.env.NEXT_PUBLIC_THREEBOX_ENABLED &&
          transcoder?.threeBoxSpace.name
            ? transcoder?.threeBoxSpace.name
            : transcoder?.id.replace(transcoder?.id.slice(7, 37), "…")}
        </Styled.h4>
        <div
          sx={{
            fontWeight: "normal",
            color: "muted",
            fontSize: 1,
            lineHeight: 1.5,
            textTransform: "initial",
          }}></div>
      </Flex>
    </Styled.h4>
  );
};

export default Header;
