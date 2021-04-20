import { CircularProgressbar } from "react-circular-progressbar";
import Box from "../Box";
import Flex from "../Flex";

const Index = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Box
      css={{
        position: "relative",
        width: "100%",
        height: "100%",
        ".CircularProgressbar": { verticalAlign: "initial" },
      }}
    >
      <Box
        style={{
          position: "absolute",
        }}
      >
        <CircularProgressbar {...otherProps} />
      </Box>
      <Flex
        css={{
          position: "absolute",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.children}
      </Flex>
    </Box>
  );
};

export default Index;
