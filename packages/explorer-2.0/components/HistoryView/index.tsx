import { Flex, Box } from "theme-ui";
import { abbreviateNumber } from "../../lib/utils";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Spinner from "../../components/Spinner";
import ListItem from "../ListItem";
import Unlink from "../../public/img/unlink.svg";
import Link from "../../public/img/link.svg";
import LPT from "../../public/img/lpt.svg";
import ETH from "../../public/img/eth.svg";
import Play from "../../public/img/play.svg";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import historyQuery from "../../queries/historyView.gql";

const Index = () => {
  const router = useRouter();
  const query = router.query;
  const account = query.account as string;

  const { data, loading, error, fetchMore, stopPolling } = useQuery(
    historyQuery,
    {
      variables: {
        account: account.toLowerCase(),
        first: 10,
        skip: 0,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (error) {
    console.error(error);
  }

  if (loading && !data) {
    return (
      <Flex
        sx={{
          pt: 4,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Spinner />
      </Flex>
    );
  }

  if (!data?.transactions?.length) {
    return <div sx={{ pt: 5 }}>No history</div>;
  }

  const events = data.transactions.reduce(
    (res, { events: e }) => res.concat(e),
    []
  );

  return (
    <InfiniteScroll
      sx={{ overflow: "hidden !important" }}
      scrollThreshold={0.5}
      dataLength={data && data.transactions.length}
      next={async () => {
        stopPolling();
        if (!loading && data.transactions.length >= 10) {
          try {
            await fetchMore({
              variables: {
                skip: data.transactions.length,
              },
              updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                if (!fetchMoreResult) {
                  return previousResult;
                }
                return {
                  ...previousResult,
                  transactions: [
                    ...previousResult.transactions,
                    ...fetchMoreResult.transactions,
                  ],
                };
              },
            });
          } catch (e) {
            return e;
          }
        }
      }}
      hasMore={true}>
      <div sx={{ mt: 3, mb: 4, pb: 6, position: "relative" }}>
        <div sx={{ pb: 2 }}>
          {events.map((event: any, i: number) => renderSwitch(event, i))}
        </div>
        {loading && data.transactions.length >= 10 && (
          <Flex
            sx={{
              position: "absolute",
              transform: "translateX(-50%)",
              left: "50%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Spinner />
          </Flex>
        )}
      </div>
    </InfiniteScroll>
  );
};

export default Index;

function renderSwitch(event: any, i: number) {
  console.log(event);
  switch (event.__typename) {
    case "BondEvent":
      return (
        <ListItem
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          key={i}
          avatar={<Link sx={{ color: "primary", mr: 2 }} />}>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Staked with{" "}
                {event.newDelegate.id.replace(
                  event.newDelegate.id.slice(7, 37),
                  "…"
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.additionalAmount, 3)}
              </span>{" "}
              LPT
            </div>
          </Flex>
        </ListItem>
      );
    case "NewRoundEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <Play sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Initialized round</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              Round #
              <span sx={{ fontFamily: "monospace" }}>{event.round.id}</span>
            </div>
          </Flex>
        </ListItem>
      );
    case "RebondEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={<Link sx={{ color: "primary", mr: 2 }} />}>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Restaked with{" "}
                {event.delegate.id.replace(event.delegate.id.slice(7, 37), "…")}
              </Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </span>{" "}
              LPT
            </div>
          </Flex>
        </ListItem>
      );
    case "UnbondEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={<Unlink sx={{ color: "primary", mr: 2 }} />}>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>
                Unstaked from{" "}
                {event.delegate.id.replace(event.delegate.id.slice(7, 37), "…")}
              </Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                -{abbreviateNumber(event.amount, 3)}
              </span>{" "}
              LPT
            </div>
          </Flex>
        </ListItem>
      );
    case "RewardEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Claimed inflationary token reward</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.rewardTokens, 3)}
              </span>{" "}
              LPT
            </div>
          </Flex>
        </ListItem>
      );
    case "TranscoderUpdateEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Updated orchestrator cut</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ textAlign: "right", fontSize: 1, ml: 3 }}>
              <Box>
                <span sx={{ fontFamily: "monospace" }}>
                  {event.rewardCut / 10000}% R
                </span>{" "}
              </Box>
              <Box>
                <span sx={{ fontFamily: "monospace" }}>
                  {(100 - event.feeShare / 10000)
                    .toFixed(2)
                    .replace(/[.,]00$/, "")}
                  % F
                </span>{" "}
              </Box>
            </div>
          </Flex>
        </ListItem>
      );
    case "WithdrawStakeEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Withdrew unstaked tokens</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </span>{" "}
              LPT
            </div>
          </Flex>
        </ListItem>
      );
    case "WithdrawFeesEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Withdrew earned fees</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                {abbreviateNumber(event.amount, 3)}
              </span>{" "}
              ETH
            </div>
          </Flex>
        </ListItem>
      );
    case "WinningTicketRedeemedEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Redeemed winning ticket</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.faceValue, 3)}
              </span>{" "}
              ETH
            </div>
          </Flex>
        </ListItem>
      );
    case "DepositFundedEvent":
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Deposit funded</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </span>{" "}
              ETH
            </div>
          </Flex>
        </ListItem>
      );
    case "ReserveFundedEvent":
      // Ignore funded reserve events where amount is 0
      // (unable to do this on the graphql query as of now)
      if (+event.amount === 0) {
        return;
      }
      return (
        <ListItem
          sx={{
            cursor: "pointer",
            px: 2,
            "&:hover": { backgroundColor: "rgba(255, 255, 255, .04)" },
          }}
          onClick={() =>
            window.open(
              `https://etherscan.io/tx/${event.transaction.id}`,
              "_blank"
            )
          }
          key={i}
          avatar={
            <ETH sx={{ width: 20, height: 20, color: "primary", mr: 2 }} />
          }>
          <Flex
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Box>
              <Box>Reserve funded</Box>
              <Box sx={{ fontSize: 12, color: "muted" }}>
                {moment
                  .unix(event.transaction.timestamp)
                  .format("MM/DD/YYYY h:mm:ss a")}{" "}
                -- Round #{event.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {" "}
              <span sx={{ fontFamily: "monospace" }}>
                +{abbreviateNumber(event.amount, 3)}
              </span>{" "}
              ETH
            </div>
          </Flex>
        </ListItem>
      );
    default:
      return null;
  }
}
