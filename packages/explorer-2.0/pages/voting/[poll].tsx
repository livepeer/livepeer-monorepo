import Box from "../../components/Box";
import Flex from "../../components/Flex";
import { getLayout } from "../../layouts/main";
import fm from "front-matter";
import IPFS from "ipfs-mini";
import Card from "../../components/Card";
import VotingWidget from "../../components/VotingWidget";
import ReactMarkdown from "react-markdown";
import { abbreviateNumber } from "../../lib/utils";
import { withApollo } from "../../apollo";
import { useRouter } from "next/router";
import { useQuery, useApolloClient, gql } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import Spinner from "../../components/Spinner";
import { useEffect, useState } from "react";
import moment from "moment";
import { useWindowSize } from "react-use";
import BottomDrawer from "../../components/BottomDrawer";
import Button from "../../components/Button";
import Head from "next/head";
import { usePageVisibility } from "../../hooks";
import pollQuery from "../../queries/poll.gql";
import accountQuery from "../../queries/account.gql";
import voteQuery from "../../queries/vote.gql";
import FourZeroFour from "../404";
import { NextPage } from "next";
import { Status } from "./";

const Poll = () => {
  const router = useRouter();
  const context = useWeb3React();
  const client = useApolloClient();
  const { width } = useWindowSize();
  const isVisible = usePageVisibility();
  const [pollData, setPollData] = useState(null);
  const { query } = router;

  const pollId = query.poll.toString().toLowerCase();
  const pollInterval = 20000;

  const {
    data,
    startPolling: startPollingPoll,
    stopPolling: stopPollingPoll,
  } = useQuery(pollQuery, {
    variables: {
      id: pollId,
    },
    pollInterval,
  });

  const {
    data: myAccountData,
    startPolling: startPollingMyAccount,
    stopPolling: stopPollingMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval,
    skip: !context.active,
  });

  const {
    data: voteData,
    startPolling: startPollingVote,
    stopPolling: stopPollingVote,
  } = useQuery(voteQuery, {
    variables: {
      id: `${context?.account?.toLowerCase()}-${pollId}`,
    },
    pollInterval,
    skip: !context.active,
  });

  const {
    data: delegateVoteData,
    startPolling: startPollingDelegate,
    stopPolling: stopPollingDelegate,
  } = useQuery(voteQuery, {
    variables: {
      id: `${myAccountData?.delegator?.delegate?.id.toLowerCase()}-${pollId}`,
    },
    pollInterval,
    skip: !myAccountData?.delegator?.delegate,
  });

  useEffect(() => {
    if (!isVisible) {
      stopPollingPoll();
      stopPollingMyAccount();
      stopPollingVote();
      stopPollingDelegate();
    } else {
      startPollingPoll(pollInterval);
      startPollingMyAccount(pollInterval);
      startPollingVote(pollInterval);
      startPollingDelegate(pollInterval);
    }
  }, [
    isVisible,
    stopPollingPoll,
    stopPollingMyAccount,
    stopPollingVote,
    stopPollingDelegate,
    startPollingPoll,
    startPollingMyAccount,
    startPollingVote,
    startPollingDelegate,
  ]);

  useEffect(() => {
    const init = async () => {
      if (data) {
        const response = await transformData({
          poll: data.poll,
        });
        setPollData(response);
      }
    };
    init();
  }, [data]);

  if (!query?.poll) {
    return <FourZeroFour />;
  }

  if (!pollData) {
    return (
      <Flex
        css={{
          height: "calc(100vh - 100px)",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          "@bp3": {
            height: "100vh",
          },
        }}
      >
        <Spinner />
      </Flex>
    );
  }

  const noVoteStake = +pollData?.tally?.no || 0;
  const yesVoteStake = +pollData?.tally?.yes || 0;
  const totalVoteStake = noVoteStake + yesVoteStake;

  return (
    <>
      <Head>
        <title>Livepeer Explorer - Voting</title>
      </Head>
      <Flex css={{ justifyContent: "space-between", width: "100%" }}>
        <Flex
          css={{
            mt: "$3",
            pr: 0,
            width: "100%",
            flexDirection: "column",
            "@bp3": {
              width: "65%",
              mt: "$4",
            },
          }}
        >
          <Box css={{ mb: "$4", width: "100%" }}>
            <Flex
              css={{
                mb: "$2",
                alignItems: "center",
              }}
            >
              <Box css={{ mr: "$2" }}>Status:</Box>
              <Status
                color={pollData.status}
                css={{ textTransform: "capitalize", fontWeight: 700 }}
              >
                {pollData.status}
              </Status>
            </Flex>
            <Box
              as="h1"
              css={{
                fontSize: "$4",
                display: "flex",
                mb: "10px",
                alignItems: "center",
                "@bp2": {
                  fontSize: 26,
                },
              }}
            >
              {pollData.title} (LIP-{pollData.lip})
            </Box>
            <Box css={{ fontSize: "$1", color: "$muted" }}>
              {!pollData.isActive ? (
                <Box>
                  Voting ended on{" "}
                  {moment.unix(pollData.endTime).format("MMM Do, YYYY")} at
                  block {pollData.endBlock}
                </Box>
              ) : (
                <Box>
                  Voting ends in ~
                  {moment()
                    .add(pollData.estimatedTimeRemaining, "seconds")
                    .fromNow(true)}
                </Box>
              )}
            </Box>
            {pollData.isActive && (
              <Button
                css={{
                  display: "flex",
                  mt: "$3",
                  mr: "$3",
                  "@bp3": {
                    display: "none",
                  },
                }}
                onClick={() =>
                  client.writeQuery({
                    query: gql`
                      query {
                        bottomDrawerOpen
                      }
                    `,
                    data: {
                      bottomDrawerOpen: true,
                    },
                  })
                }
              >
                Vote
              </Button>
            )}
          </Box>

          <Box>
            <Box
              css={{
                display: "grid",
                gridGap: "$3",
                gridTemplateColumns: "100%",
                mb: "$3",
                "@bp2": {
                  gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))",
                },
              }}
            >
              <Card
                css={{ flex: 1, mb: 0 }}
                title={
                  <Flex css={{ alignItems: "center" }}>
                    <Box css={{ color: "$muted" }}>
                      Total Support ({pollData.quota / 10000}% needed)
                    </Box>
                  </Flex>
                }
                subtitle={
                  <Box
                    css={{
                      fontSize: "$6",
                      color: "$text",
                    }}
                  >
                    {pollData.totalSupport.toPrecision(5)}%
                  </Box>
                }
              >
                <Box css={{ mt: "$4" }}>
                  <Flex
                    css={{
                      fontSize: "$2",
                      mb: "$2",
                      justifyContent: "space-between",
                    }}
                  >
                    <Flex css={{ alignItems: "center" }}>
                      <Box css={{ color: "$muted" }}>
                        Yes (
                        {isNaN(yesVoteStake / totalVoteStake)
                          ? 0
                          : ((yesVoteStake / totalVoteStake) * 100).toPrecision(
                              5
                            )}
                        %)
                      </Box>
                    </Flex>
                    <Box as="span" css={{ fontFamily: "$monospace" }}>
                      {abbreviateNumber(yesVoteStake, 4)} LPT
                    </Box>
                  </Flex>
                  <Flex
                    css={{
                      fontSize: "$2",
                      justifyContent: "space-between",
                    }}
                  >
                    <Flex css={{ alignItems: "center" }}>
                      <Box css={{ color: "$muted" }}>
                        No (
                        {isNaN(noVoteStake / totalVoteStake)
                          ? 0
                          : ((noVoteStake / totalVoteStake) * 100).toPrecision(
                              5
                            )}
                        %)
                      </Box>
                    </Flex>
                    <Box as="span" css={{ fontFamily: "$monospace" }}>
                      {abbreviateNumber(noVoteStake, 4)} LPT
                    </Box>
                  </Flex>
                </Box>
              </Card>

              <Card
                css={{ flex: 1, mb: 0 }}
                title={
                  <Flex css={{ alignItems: "center" }}>
                    <Box css={{ color: "$muted" }}>
                      Total Participation ({pollData.quorum / 10000}% needed)
                    </Box>
                  </Flex>
                }
                subtitle={
                  <Box
                    css={{
                      fontSize: "$6",
                      color: "$text",
                    }}
                  >
                    {pollData.totalParticipation.toPrecision(5)}%
                  </Box>
                }
              >
                <Box css={{ mt: "$4" }}>
                  <Flex
                    css={{
                      fontSize: "$2",
                      mb: "$2",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box as="span" css={{ color: "$muted" }}>
                      Voters ({pollData.totalParticipation.toPrecision(5)}
                      %)
                    </Box>
                    <Box as="span">
                      <Box as="span" css={{ fontFamily: "$monospace" }}>
                        {abbreviateNumber(totalVoteStake, 4)} LPT
                      </Box>
                    </Box>
                  </Flex>
                  <Flex
                    css={{ fontSize: "$2", justifyContent: "space-between" }}
                  >
                    <Box as="span" css={{ color: "$muted" }}>
                      Nonvoters ({pollData.nonVoters.toPrecision(5)}
                      %)
                    </Box>
                    <Box as="span">
                      <Box as="span" css={{ fontFamily: "$monospace" }}>
                        {abbreviateNumber(pollData.nonVotersStake, 4)} LPT
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Card>
            </Box>
            <Card
              css={{
                mb: "$3",
                h2: { "&:first-of-type": { mt: 0 }, mt: "$3" },
                h3: { mt: "$3" },
                h4: { mt: "$3" },
                h5: { mt: "$3" },
                lineHeight: 1.5,
                a: {
                  color: "$primary",
                },
              }}
            >
              <ReactMarkdown source={pollData.text} />
            </Card>
          </Box>
        </Flex>

        {width > 1200 ? (
          <Flex
            css={{
              display: "none",
              position: "sticky",
              alignSelf: "flex-start",
              top: "$5",
              mt: "$4",
              minWidth: "30%",
              "@bp3": {
                display: "flex",
              },
            }}
          >
            <VotingWidget
              data={{
                poll: pollData,
                delegateVote: delegateVoteData?.vote,
                vote: voteData?.vote,
                myAccount: myAccountData,
              }}
            />
          </Flex>
        ) : (
          <BottomDrawer>
            <VotingWidget
              data={{
                poll: pollData,
                delegateVote: delegateVoteData?.vote,
                vote: voteData?.vote,
                myAccount: myAccountData,
              }}
            />
          </BottomDrawer>
        )}
      </Flex>
    </>
  );
};

async function transformData({ poll }) {
  const noVoteStake = +poll?.tally?.no || 0;
  const yesVoteStake = +poll?.tally?.yes || 0;
  const totalVoteStake = +poll?.totalVoteStake;
  const totalNonVoteStake = +poll?.totalNonVoteStake;
  const totalSupport = isNaN(yesVoteStake / totalVoteStake)
    ? 0
    : (yesVoteStake / totalVoteStake) * 100;
  const totalStake = totalNonVoteStake + totalVoteStake;
  const totalParticipation = (totalVoteStake / totalStake) * 100;
  const nonVotersStake = totalStake - totalVoteStake;
  const nonVoters = ((totalStake - totalVoteStake) / totalStake) * 100;

  const ipfs = new IPFS({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  const { gitCommitHash, text } = await ipfs.catJSON(poll.proposal);
  const response = fm(text);
  return {
    ...response.attributes,
    created: response.attributes.created.toString(),
    text: response.body,
    gitCommitHash,
    totalStake,
    totalSupport,
    totalParticipation,
    nonVoters,
    nonVotersStake,
    yesVoteStake,
    noVoteStake,
    ...poll,
  };
}

Poll.getLayout = getLayout;

export default withApollo({
  ssr: true,
})(Poll as NextPage);
