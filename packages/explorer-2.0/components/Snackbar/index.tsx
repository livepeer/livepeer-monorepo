import Box from "../Box";
import Flex from "../Flex";
import Close from "../../public/img/close.svg";

const Index = ({ children, onClose }) => (
  <Box
    css={{
      borderRadius: "3px",
      backgroundColor: "text",
      position: "fixed",
      transform: "translateX(-50%)",
      left: "50%",
      fontSize: "14px",
      padding: "16px 24px",
      boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#282828",
      bottom: "24px",
      zIndex: "100",
    }}
  >
    <Flex css={{ alignItems: "center" }}>
      <Box>{children}</Box>
      <Close onClick={onClose} css={{ cursor: "pointer", ml: "$4" }} />
    </Flex>
  </Box>
);

export default Index;
