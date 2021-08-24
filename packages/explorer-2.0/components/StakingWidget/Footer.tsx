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
import Footnote from "./Footnote";
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
  const isStaked = delegator?.bondedAmount && delegator?.bondedAmount !== "0";
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
          switching={!isMyTranscoder && isStaked}
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
        {+amount >= 0 && !isMyTranscoder && isStaked && (
          <Footnote>
            Enter "0" to move your delegated stake to this orchestrator.
          </Footnote>
        )}
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
      <Footnote>
        Your account is in a pending state. You can unstake during the next
        round.
      </Footnote>
    );
  }
  if (!isStaked) {
    return <Footnote>One must stake before one can unstake.</Footnote>;
  }
  if (!isMyTranscoder) {
    return <Footnote>You're not staked to this orchestrator.</Footnote>;
  }
  if (parseFloat(amount) && !sufficientStake) {
    return <Footnote>Insufficient stake</Footnote>;
  }
  return (
    <Footnote>
      Looking to move your delegated stake? No need to unstake. Simply navigate
      to the orchestrator you wish to switch to, enter "0" and hit stake.
    </Footnote>
  );
}
