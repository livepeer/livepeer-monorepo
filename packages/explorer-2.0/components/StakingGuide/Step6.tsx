import { Styled } from "theme-ui";
import Button from "../Button";

const Step6 = ({ onClose }) => {
  return (
    <div sx={{ py: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Choose Orchestrator</Styled.h2>
      <Styled.p>
        It's your job as a delegator to research orchestrators based upon their
        past performance, statistics, rates they are charging, and any social
        campaigns that they’ve posted indicating why they believe they will do a
        good job for the network. Click on any orchestrator to view their on
        chain statistics. Once you've chosen an orchestrator, enter the amount
        of LPT you'd like to stake in the staking widget and hit "Stake".
      </Styled.p>
      <Button
        sx={{ position: "absolute", right: 30, bottom: 16 }}
        onClick={onClose}>
        Finish
      </Button>
    </div>
  );
};

export default Step6;
