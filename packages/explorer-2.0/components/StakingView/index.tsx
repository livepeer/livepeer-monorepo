import Box from "../Box";
import Flex from "../Flex";
import Utils from "web3-utils";
import { abbreviateNumber, checkAddressEquality } from "../../lib/utils";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import Card from "../../components/Card";
import Link from "next/link";
import StakeTransactions from "../StakeTransactions";
import ReactTooltip from "react-tooltip";
import Button from "../Button";
import HelpIcon from "../HelpIcon";

const Index = ({ delegator, transcoders, protocol, currentRound }) => {
  const router = useRouter();
  const query = router.query;
  const context = useWeb3React();
  const isMyAccount = checkAddressEquality(
    context?.account,
    query.account.toString()
  );

  if (!delegator?.bondedAmount) {
    if (isMyAccount) {
      return (
        <Box css={{ pt: "$4" }}>
          <Box css={{ mr: "$3", mb: "$3" }}>
            You haven't staked LPT. Stake with an Orchestrator to begin earning
            rewards and a share of the fees being paid into the Livepeer
            network.
          </Box>
          <Link href="/" passHref>
            <Button as="a" size="small" outline>
              View Orchestrators
            </Button>
          </Link>
        </Box>
      );
    } else {
      return <Box css={{ pt: "$4" }}>Nothing here.</Box>;
    }
  }

  const pendingStake = parseFloat(Utils.fromWei(delegator.pendingStake));
  const unbonded = delegator.unbonded ? +delegator.unbonded : 0;

  const rewards =
    pendingStake + (unbonded ? unbonded : 0) - +delegator.principal;
  const totalActiveStake = +protocol.totalActiveStake;

  return (
    <Box css={{ pt: "$4" }}>
      {delegator.delegate && (
        <Link
          href={`/accounts/[account]/[slug]`}
          as={`/accounts/${delegator.delegate.id}/campaign`}
          passHref>
          <Card
            as="a"
            css={{
              mb: "$3",
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
            }}
            title="Staked with"
            subtitle={
              <Box
                css={{
                  fontSize: "$6",
                  color: "$text",
                }}>
                {process.env.NEXT_PUBLIC_THREEBOX_ENABLED &&
                delegator.delegate.threeBoxSpace.name
                  ? delegator.delegate.threeBoxSpace.name
                  : delegator.delegate.id.replace(
                      delegator.delegate.id.slice(7, 37),
                      "…"
                    )}
              </Box>
            }
          />
        </Link>
      )}
      <Box
        css={{
          display: "grid",
          gridGap: "$3",
          gridTemplateColumns: "100%",
          mb: "$5",
          "@bp2": {
            gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))",
          },
        }}>
        <Card
          css={{ flex: 1, mb: 0 }}
          title={
            <Flex css={{ alignItems: "center" }}>
              <Box css={{ color: "$muted" }}>Staked balance</Box>
              <Flex>
                <ReactTooltip
                  id="tooltip-total-staked"
                  className="tooltip"
                  place="top"
                  type="dark"
                  effect="solid"
                />
                <HelpIcon
                  data-tip="This is the amount currently delegated to an Orchestrator."
                  data-for="tooltip-total-staked"
                />
              </Flex>
            </Flex>
          }
          subtitle={
            <Box
              css={{
                mb: "$4",
                fontSize: "$6",
                color: "$text",
                fontFamily: "$monospace",
              }}>
              {abbreviateNumber(pendingStake, 5)}
              <Box as="span" css={{ ml: "$2", fontSize: "$2" }}>
                LPT
              </Box>
            </Box>
          }>
          <Box css={{ mt: "auto" }}>
            <Box
              css={{
                display: "block",
                top: "-22px",
                position: "relative",
              }}>
              <Box as="img" src="/img/squiggle.svg" />
            </Box>
            <Flex
              css={{
                fontSize: "$2",
                mb: "$2",
                justifyContent: "space-between",
              }}>
              <Flex css={{ alignItems: "center" }}>
                <Box css={{ color: "$muted" }}>Lifetime Unstaked</Box>
                <Flex>
                  <ReactTooltip
                    id="tooltip-unstaked"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <HelpIcon
                    data-tip="This is the amount unstaked over the lifetime of this account."
                    data-for="tooltip-unstaked"
                  />
                </Flex>
              </Flex>
              <Box as="span" css={{ fontFamily: "$monospace" }}>
                {unbonded > 0 ? (
                  <Box as="span" css={{ color: "$red" }}>
                    -{abbreviateNumber(unbonded, 3)} LPT
                  </Box>
                ) : (
                  0
                )}
              </Box>
            </Flex>
            <Flex css={{ fontSize: "$2", justifyContent: "space-between" }}>
              <Flex css={{ alignItems: "center" }}>
                <Box css={{ color: "$muted" }}>Lifetime Rewards</Box>
                <Flex>
                  <ReactTooltip
                    id="tooltip-rewards"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <HelpIcon
                    data-tip="Account's total rewards earned all-time."
                    data-for="tooltip-rewards"
                  />
                </Flex>
              </Flex>
              <Box as="span">
                <Box
                  as="span"
                  css={{ color: "$primary", fontFamily: "$monospace" }}>
                  +{abbreviateNumber(rewards, 6)} LPT
                </Box>
              </Box>
            </Flex>
          </Box>
        </Card>
        {delegator.delegate && (
          <Card
            css={{ flex: 1, mb: 0 }}
            title={
              <Flex css={{ alignItems: "center" }}>
                <Box css={{ color: "$muted" }}>Stake Equity</Box>
                <Flex>
                  <ReactTooltip
                    id="tooltip-equity"
                    className="tooltip"
                    place="top"
                    type="dark"
                    effect="solid"
                  />
                  <HelpIcon
                    data-tip="Account's equity relative to the entire network."
                    data-for="tooltip-equity"
                  />
                </Flex>
              </Flex>
            }
            subtitle={
              <Box
                css={{
                  mb: "auto",
                  fontSize: "$6",
                  color: "$text",
                  fontFamily: "$monospace",
                }}>
                {totalActiveStake === 0
                  ? 0
                  : ((pendingStake / totalActiveStake) * 100).toPrecision(4)}
                %
              </Box>
            }>
            <Box css={{ mt: "$4" }}>
              <Flex
                css={{
                  fontSize: "$2",
                  mb: "$2",
                  justifyContent: "space-between",
                }}>
                <Box as="span" css={{ color: "$muted" }}>
                  Account{" "}
                  <Box as="span" css={{ color: "$text" }}>
                    (
                    {totalActiveStake === 0
                      ? 0
                      : ((pendingStake / totalActiveStake) * 100).toPrecision(
                          4
                        )}
                    %)
                  </Box>
                </Box>
                <Box as="span">
                  <Box as="span" css={{ fontFamily: "$monospace" }}>
                    {abbreviateNumber(pendingStake, 5)}
                  </Box>
                </Box>
              </Flex>
              <Flex
                css={{
                  fontSize: "$2",
                  mb: "$2",
                  justifyContent: "space-between",
                }}>
                <Box as="span" css={{ color: "$muted" }}>
                  Orchestrator{" "}
                  <Box as="span" css={{ color: "$text" }}>
                    (
                    {totalActiveStake === 0
                      ? 0
                      : (
                          (+delegator.delegate.totalStake / totalActiveStake) *
                          100
                        ).toPrecision(4)}
                    %)
                  </Box>
                </Box>
                <Box as="span">
                  <Box as="span" css={{ fontFamily: "$monospace" }}>
                    {abbreviateNumber(+delegator.delegate.totalStake, 3)}
                  </Box>
                </Box>
              </Flex>

              <Flex
                css={{
                  fontSize: "$2",
                  justifyContent: "space-between",
                }}>
                <Box as="span" css={{ color: "$muted" }}>
                  Rest of Network{" "}
                  <Box as="span" css={{ color: "$text" }}>
                    (
                    {(totalActiveStake === 0
                      ? 0
                      : ((totalActiveStake -
                          +delegator.delegate.totalStake -
                          pendingStake) /
                          totalActiveStake) *
                        100
                    ).toPrecision(4)}
                    %)
                  </Box>
                </Box>
                <Box as="span">
                  <Box as="span" css={{ fontFamily: "$monospace" }}>
                    {abbreviateNumber(
                      totalActiveStake === 0
                        ? 0
                        : totalActiveStake -
                            +delegator.delegate.totalStake -
                            pendingStake,
                      3
                    )}
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Card>
        )}
      </Box>
      <StakeTransactions
        transcoders={transcoders}
        delegator={delegator}
        currentRound={currentRound}
        isMyAccount={isMyAccount}
      />
    </Box>
  );
};

export default Index;
