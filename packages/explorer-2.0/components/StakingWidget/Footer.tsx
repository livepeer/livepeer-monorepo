import Stake from "./Stake";
import Unstake from "./Unstake";
import { Account, Delegator, Transcoder, Round } from "../../@types";
import Utils from "web3-utils";
import {
  getDelegatorStatus,
  getHint,
  simulateNewActiveSetOrder,
} from "../../lib/utils";
import { useWeb3React } from "@web3-react/core";
import Warning from "./Warning";
import Box from "../Box";
import ConnectWallet from "./connect-wallet";

type FooterData = {
  transcoders: [Transcoder];
  action: string;
  amount: string;
  transcoder: Transcoder;
  delegator?: Delegator;
  currentRound: Round;
  account: Account;
};
interface Props {
  reset: Function;
  data: FooterData;
  css?: object;
}

const Footer = ({
  reset,
  data: {
    transcoders,
    delegator,
    transcoder,
    action,
    amount,
    account,
    currentRound,
  },
  css = {},
}: Props) => {
  const context = useWeb3React();

  if (!context.account) {
    return <ConnectWallet />;
  }

  const tokenBalance =
    account && parseFloat(Utils.fromWei(account.tokenBalance));
  const transferAllowance =
    account && parseFloat(Utils.fromWei(account.allowance));
  const delegatorStatus = getDelegatorStatus(delegator, currentRound);
  const isStaked =
    delegatorStatus === "Bonded" || delegatorStatus === "Unbonding"
      ? true
      : false;
  const stake = delegator?.pendingStake
    ? parseFloat(Utils.fromWei(delegator.pendingStake))
    : 0;
  const isMyTranscoder = delegator?.delegate?.id === transcoder?.id;
  const sufficientStake = delegator && amount && parseFloat(amount) <= stake;
  const canUnstake = isMyTranscoder && isStaked && parseFloat(amount) > 0;
  const newActiveSetOrder = simulateNewActiveSetOrder({
    action,
    transcoders: JSON.parse(JSON.stringify(transcoders)),
    amount: Utils.toWei(amount ? amount.toString() : "0"),
    newDelegate: transcoder.id,
    oldDelegate: delegator?.delegate?.id,
  });
  const { newPosPrev, newPosNext } = getHint(
    delegator?.delegate?.id,
    newActiveSetOrder
  );
  const {
    newPosPrev: currDelegateNewPosPrev,
    newPosNext: currDelegateNewPosNext,
  } = getHint(transcoder.id, newActiveSetOrder);

  if (action === "stake") {
    if (!isStaked) {
      delegator = {
        id: account?.id,
        lastClaimRound: { id: "0" },
      };
    }
    return (
      <Box css={{ ...css }}>
        <Stake
          delegator={delegator}
          to={transcoder.id}
          amount={amount}
          switching={!isMyTranscoder}
          tokenBalance={tokenBalance}
          transferAllowance={transferAllowance}
          reset={reset}
          hint={{
            oldDelegateNewPosPrev: newPosPrev,
            oldDelegateNewPosNext: newPosNext,
            currDelegateNewPosPrev: currDelegateNewPosPrev,
            currDelegateNewPosNext: currDelegateNewPosNext,
          }}
        />
      </Box>
    );
  }
  return (
    <Box css={{ ...css }}>
      <Unstake
        amount={amount}
        newPosPrev={newPosPrev}
        newPosNext={newPosNext}
        delegator={delegator}
        disabled={!canUnstake}
      />
      {renderUnstakeWarnings(
        amount,
        delegatorStatus,
        isStaked,
        sufficientStake,
        isMyTranscoder
      )}
    </Box>
  );
};

export default Footer;

function renderUnstakeWarnings(
  amount,
  delegatorStatus,
  isStaked,
  sufficientStake,
  isMyTranscoder
) {
  if (delegatorStatus === "Pending") {
    return (
      <Warning>
        Your account is in a pending state. You can unstake during the next
        round.
      </Warning>
    );
  }
  if (!isStaked) {
    return <Warning>One must stake before one can unstake.</Warning>;
  }
  if (!isMyTranscoder) {
    return <Warning>You're not staked to this orchestrator.</Warning>;
  }
  if (parseFloat(amount) && !sufficientStake) {
    return <Warning>Insufficient stake</Warning>;
  }
}
