import { keyframes } from "../../stitches.config";
import Box from "../Box";

const rotate = keyframes({
  "100%": { transform: "rotate(360deg)" },
});

const Index = ({ css = {}, speed = "1s" }) => (
  <Box
    css={{
      border: "3px solid",
      borderColor: "$surface",
      borderRadius: "50%",
      borderTopColor: "$primary",
      width: 26,
      height: 26,
      maxWidth: 26,
      maxHeight: 26,
      animation: `${rotate} ${speed} linear`,
      animationIterationCount: "infinite",
      ...css,
    }}
  />
);

export default Index;
