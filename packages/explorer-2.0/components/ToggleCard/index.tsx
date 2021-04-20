import Label from "../Label";
import Checkbox from "../Checkbox";
import Box from "../Box";
import Flex from "../Flex";

const Index = ({
  label = null,
  description,
  icon: Icon,
  isActive = false,
  providerName,
  ...props
}) => (
  <Box
    {...props}
    css={{
      cursor: "pointer",
      border: "1px solid",
      borderColor: isActive ? "$primary" : "$muted",
      borderRadius: "$4",
      p: "$4",
    }}
  >
    <Flex css={{ justifyContent: "space-between" }}>
      <Flex css={{ mb: "$3", alignItems: "center" }}>
        <Icon css={{ mr: "$3" }} />
        {label && <Label>Recommended</Label>}
      </Flex>
      <Checkbox isActive={isActive} />
    </Flex>
    <Box as="h2" css={{ mb: "$3" }}>
      {providerName}
    </Box>
    <Box>{description}</Box>
  </Box>
);

export default Index;
