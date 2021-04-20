import Box from "../Box";
import Flex from "../Flex";
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
          css={{ mb: "$6" }}
          header={<Box as="h4">Pending Transactions</Box>}
        >
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
                avatar={<Unlink css={{ color: "$primary", mr: "$3" }} />}
              >
                <Flex
                  css={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box css={{ mb: "2px" }}>
                      Unstaking from{" "}
                      {lock.delegate.id.replace(
                        lock.delegate.id.slice(7, 37),
                        "…"
                      )}
                    </Box>
                    <Box css={{ color: "$muted", fontSize: "$1" }}>
                      Tokens will be available for withdrawal in approximately{" "}
                      {lock.withdrawRound - parseInt(currentRound.id, 10)} days.
                    </Box>
                  </Box>
                  <Flex css={{ alignItems: "center" }}>
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
                    <Box css={{ ml: "$4" }}>
                      {" "}
                      <Box as="span" css={{ fontFamily: "$monospace" }}>
                        {abbreviateNumber(lock.amount, 4)}
                      </Box>{" "}
                      LPT
                    </Box>
                  </Flex>
                </Flex>
              </ListItem>
            );
          })}
        </List>
      )}
      {!!completedStakeTransactions.length && (
        <List header={<Box as="h4">Available for Withdrawal</Box>}>
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
                avatar={<Unlink css={{ color: "$primary", mr: "$3" }} />}
              >
                <Flex
                  css={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    Unstaked from{" "}
                    {lock.delegate.id.replace(
                      lock.delegate.id.slice(7, 37),
                      "…"
                    )}
                  </Box>

                  <Flex css={{ alignItems: "center" }}>
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
                    <Box css={{ ml: "$4" }}>
                      {" "}
                      <Box as="span" css={{ fontFamily: "$monospace" }}>
                        {abbreviateNumber(lock.amount, 3)}
                      </Box>{" "}
                      LPT
                    </Box>
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
