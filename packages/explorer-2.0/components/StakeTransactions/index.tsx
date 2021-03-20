import { Flex, Styled } from "theme-ui";
import Utils from "web3-utils";
import Unlink from "../../public/img/unlink.svg";
import {
  abbreviateNumber,
  getHint,
  simulateNewActiveSetOrder,
} from "../../lib/utils";
import { UnbondingLock } from "../../@types";
import List from "../List";
import ListItem from "../ListItem";
import Restake from "../Restake";
import RestakeFromUnstaked from "../RestakeFromUnstaked";
import WithdrawStake from "../WithdrawStake";

const Index = ({ delegator, transcoders, currentRound, isMyAccount }) => {
  const pendingStakeTransactions: Array<UnbondingLock> = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound > parseInt(currentRound.id, 10)
  );
  const completedStakeTransactions: Array<UnbondingLock> = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound <= parseInt(currentRound.id, 10)
  );
  const isBonded = !!delegator.delegate;

  return (
    <>
      {!!pendingStakeTransactions.length && (
        <List
          sx={{ mb: 6 }}
          header={<Styled.h4>Pending Transactions</Styled.h4>}>
          {pendingStakeTransactions.map((lock) => {
            const newActiveSetOrder = simulateNewActiveSetOrder({
              action: "stake",
              transcoders: JSON.parse(JSON.stringify(transcoders)),
              amount: Utils.toWei(lock.amount),
              newDelegate: isBonded ? delegator.delegate.id : lock.delegate.id,
            });
            const { newPosPrev, newPosNext } = getHint(
              isBonded ? delegator.delegate.id : lock.delegate.id,
              newActiveSetOrder
            );
            return (
              <ListItem
                key={lock.id}
                avatar={<Unlink sx={{ color: "primary", mr: 2 }} />}>
                <Flex
                  sx={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <div>
                    <div sx={{ mb: "2px" }}>
                      Unstaking from{" "}
                      {lock.delegate.id.replace(
                        lock.delegate.id.slice(7, 37),
                        "…"
                      )}
                    </div>
                    <div sx={{ color: "muted", fontSize: 0 }}>
                      Tokens will be available for withdrawal in approximately{" "}
                      {lock.withdrawRound - parseInt(currentRound.id, 10)} days.
                    </div>
                  </div>
                  <Flex sx={{ alignItems: "center" }}>
                    {isMyAccount &&
                      (isBonded ? (
                        <Restake
                          unbondingLockId={lock.unbondingLockId}
                          newPosPrev={newPosPrev}
                          newPosNext={newPosNext}
                          delegator={delegator}
                        />
                      ) : (
                        <RestakeFromUnstaked
                          unbondingLockId={lock.unbondingLockId}
                          delegate={lock.delegate.id}
                          newPosPrev={newPosPrev}
                          newPosNext={newPosNext}
                          delegator={delegator}
                        />
                      ))}
                    <div sx={{ ml: 3 }}>
                      {" "}
                      <span sx={{ fontFamily: "monospace" }}>
                        {abbreviateNumber(lock.amount, 4)}
                      </span>{" "}
                      LPT
                    </div>
                  </Flex>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      )}
      {!!completedStakeTransactions.length && (
        <List header={<Styled.h4>Available for Withdrawal</Styled.h4>}>
          {completedStakeTransactions.map((lock) => {
            const newActiveSetOrder = simulateNewActiveSetOrder({
              action: "stake",
              transcoders: JSON.parse(JSON.stringify(transcoders)),
              amount: Utils.toWei(lock.amount),
              newDelegate: isBonded ? delegator.delegate.id : lock.delegate.id,
            });
            const { newPosPrev, newPosNext } = getHint(
              isBonded ? delegator.delegate.id : lock.delegate.id,
              newActiveSetOrder
            );
            return (
              <ListItem
                key={lock.id}
                avatar={<Unlink sx={{ color: "primary", mr: 2 }} />}>
                <Flex
                  sx={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <div>
                    Unstaked from{" "}
                    {lock.delegate.id.replace(
                      lock.delegate.id.slice(7, 37),
                      "…"
                    )}
                  </div>

                  <Flex sx={{ alignItems: "center" }}>
                    {isMyAccount && (
                      <>
                        {isBonded ? (
                          <Restake
                            unbondingLockId={lock.unbondingLockId}
                            newPosPrev={newPosPrev}
                            newPosNext={newPosNext}
                            delegator={delegator}
                          />
                        ) : (
                          <RestakeFromUnstaked
                            unbondingLockId={lock.unbondingLockId}
                            delegate={lock.delegate.id}
                            newPosPrev={newPosPrev}
                            newPosNext={newPosNext}
                            delegator={delegator}
                          />
                        )}
                        <WithdrawStake unbondingLockId={lock.unbondingLockId} />
                      </>
                    )}
                    <div sx={{ ml: 3 }}>
                      {" "}
                      <span sx={{ fontFamily: "monospace" }}>
                        {abbreviateNumber(lock.amount, 3)}
                      </span>{" "}
                      LPT
                    </div>
                  </Flex>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};

export default Index;
