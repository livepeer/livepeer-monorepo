import Box from "../Box";

const Index = ({ children, ...props }) => (
  <Box
    {...props}
    css={{
      border: "1px solid",
      borderRadius: 2,
      borderColor: "$muted",
      px: "$2",
      py: "4px",
      fontSize: 12,
    }}
  >
    {children}
  </Box>
);

export default Index;
