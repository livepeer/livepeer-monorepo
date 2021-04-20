import Box from "../Box";

const Warning = ({ children }) => {
  return (
    <Box
      css={{
        pt: "$3",
        color: "$muted",
        textAlign: "center",
        fontSize: "$1",
        lineHeight: 1.7,
      }}
    >
      {children}
    </Box>
  );
};

export default Warning;
