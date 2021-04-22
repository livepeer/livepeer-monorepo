import Button from "../Button";
import Box from "../Box";

const Step6 = ({ onClose }) => {
  return (
    <Box css={{ py: "$2" }}>
      <Box as="h3" css={{ mb: "$3" }}>
        Choose Orchestrator
      </Box>
      <Box>
        It's your job as a delegator to research orchestrators based upon their
        past performance, statistics, rates they are charging, and any social
        campaigns that they’ve posted indicating why they believe they will do a
        good job for the network. Click on any orchestrator to view their on
        chain statistics. Once you've chosen an orchestrator, enter the amount
        of LPT you'd like to stake in the staking widget and hit "Stake".
      </Box>
      <Button
        css={{ position: "absolute", right: 30, bottom: 16 }}
        onClick={onClose}
      >
        Finish
      </Button>
    </Box>
  );
};

export default Step6;
