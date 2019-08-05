const QRCode = require("qrcode.react");

const styles = {
  borderRadius: 1000,
  width: 32,
  height: 32,
  marginRight: 8
};

export default ({ id }: any) => (
  <QRCode style={styles} fgColor={`#${id.substr(2, 6)}`} value={id} />
);
