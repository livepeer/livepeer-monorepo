import Box from "../Box";

const Step7 = () => {
  return (
    <Box css={{ py: "$2" }}>
      <Box as="h3" css={{ mb: "$3" }}>
        Stake
      </Box>
      <Box>
        You've made it to the final step! Enter the amount of LPT you'd like to
        stake towards this Orchestrator and hit "Stake".
      </Box>
    </Box>
  );
};

export default Step7;
