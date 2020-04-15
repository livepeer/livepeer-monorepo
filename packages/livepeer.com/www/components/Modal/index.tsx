import { Flex, Box } from "@theme-ui/components";

export default ({ children, onClose }) => {
  return (
    <Flex
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
          padding: [4, 4]
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </Box>
    </Flex>
  );
};
