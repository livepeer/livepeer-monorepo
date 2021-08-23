import Box from "../Box";

const Footnote = ({ children }) => {
  return (
    <Box
      css={{
        pt: "$3",
        color: "gray",
        textAlign: "center",
        fontSize: "$1",
        lineHeight: 1.7,
      }}>
      {children}
    </Box>
  );
};

export default Footnote;
