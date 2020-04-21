import { Flex, Box } from "@theme-ui/components";
import { useLayoutEffect, useRef } from "react";

export default ({ children, onClose }) => {
  // Slightly hacky mechanism for focusing first input when first opened, if present
  useLayoutEffect(() => {
    const { current } = outerRef;
    if (current) {
      const input = (current as HTMLElement).querySelector("input");
      if (input) {
        input.focus();
      }
    }
  }, []);
  const outerRef = useRef();
  return (
    <Flex
      ref={outerRef}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: [4, 4],
          maxWidth: "500px"
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </Box>
    </Flex>
  );
};
