import { Box } from "theme-ui";
import Utils from "web3-utils";

const Index = ({ value, per }) => {
  if (per === "1m pixels") {
    return (
      <Box sx={{ fontFamily: "monospace" }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000).toString(), "gwei")
        )
          .toFixed(4)
          .toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>GWEI</span>
      </Box>
    );
  } else if (per === "1b pixels") {
    return (
      <Box sx={{ fontFamily: "monospace" }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000000).toString(), "gwei")
        )
          .toFixed(4)
          .toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>GWEI</span>
      </Box>
    );
  } else if (per === "1t pixels") {
    return (
      <Box sx={{ fontFamily: "monospace" }}>
        {parseFloat(
          Utils.fromWei(Math.round(value * 1000000000000).toString())
        ).toFixed(4)}
        <span sx={{ ml: 1, fontSize: 12 }}>ETH</span>
      </Box>
    );
  } else {
    return (
      <Box sx={{ fontFamily: "monospace" }}>
        {value.toLocaleString()}
        <span sx={{ ml: 1, fontSize: 12 }}>WEI</span>
      </Box>
    );
  }
};

export default Index;
