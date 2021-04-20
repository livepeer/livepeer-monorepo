import Box from "../Box";
import Flex from "../Flex";

const Index = ({
  title = null,
  subtitle = null,
  children = null,
  css = {},
  ...props
}) => {
  return (
    <Flex
      css={{
        flexDirection: "column",
        justifyContent: "flex-start",
        border: "1px solid",
        borderColor: "$border",
        p: "24px",
        borderRadius: 10,
        ...css,
      }}
      {...props}
    >
      {title && (
        <Box
          css={{ mb: "8px", fontWeight: 500, fontSize: "$1", color: "$muted" }}
        >
          {title}
        </Box>
      )}
      {subtitle}
      {children}
    </Flex>
  );
};

export default Index;
