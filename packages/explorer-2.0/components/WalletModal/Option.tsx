import Box from "../Box";
import Flex from "../Flex";

const Option = ({
  link = null,
  clickable = true,
  onClick = null,
  color,
  header,
  subheader = null,
  Icon = null,
  active = false,
  ...props
}) => {
  const content = (
    <Flex
      onClick={onClick}
      css={{
        bg: active ? "$surface" : "transparent",
        cursor: clickable ? "pointer" : "default",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid",
        borderColor: active ? "transparent" : "$border",
        borderRadius: 10,
        p: "$3",
        ":hover": {
          borderColor: "$primary",
        },
      }}
      {...props}
    >
      <Box>
        <Box>{header}</Box>
        {subheader && <Box css={{ mt: "$2", fontSize: "$1" }}>{subheader}</Box>}
      </Box>
      {Icon && <Icon style={{ width: 22, height: 22 }} />}
    </Flex>
  );

  if (link) {
    return (
      <Box as="a" target="__blank" href={link} css={{ color: "white" }}>
        {content}
      </Box>
    );
  }
  return content;
};

export default Option;
