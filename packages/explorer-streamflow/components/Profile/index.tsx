/** @jsx jsx */
import { Styled, jsx } from "theme-ui";
import QRCode from "qrcode.react";
import Chip from "../../components/Chip";

export default ({ address, styles = {}, variant = "primary", ...props }) => (
  <Styled.div sx={styles}>
    <QRCode
      style={{
        borderRadius: 1000,
        width: 70,
        height: 70,
        marginBottom: 4
      }}
      fgColor={`#${address.substr(2, 6)}`}
      value={address}
    />
    <Styled.h1 sx={{ mb: 2 }}>
      {address.replace(address.slice(7, 37), "…")}
    </Styled.h1>
    <Chip label="Orchestrator" />
  </Styled.div>
);
