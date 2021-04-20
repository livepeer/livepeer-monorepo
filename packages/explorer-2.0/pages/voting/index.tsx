import Box from "../../components/Box";
import Flex from "../../components/Flex";
import { getLayout } from "../../layouts/main";
import Button from "../../components/Button";
import { getStaticApolloProps, withApollo } from "../../apollo";
import { useQuery } from "@apollo/client";
import Spinner from "../../components/Spinner";
import Card from "../../components/Card";
import IPFS from "ipfs-mini";
import fm from "front-matter";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import Head from "next/head";
import { usePageVisibility } from "../../hooks";
import allPollsQuery from "../../queries/allPolls.gql";
import { NextPage } from "next";
import { styled } from "../../stitches.config";

type Params = {};
type Props = {};

export const Status = styled("div", {
  variants: {
    color: {
      passed: {
        color: "$primary",
      },
      rejected: {
        color: "$red",
      },
      active: {
        color: "$white",
      },
    },
  },
});

const Voting = () => {
  const isVisible = usePageVisibility();
  const pollInterval = 20000;
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data, startPolling, stopPolling } = useQuery(allPollsQuery, {
    pollInterval,
  });

  useEffect(() => {
    if (!isVisible) {
      stopPolling();
    } else {
      startPolling(pollInterval);
    }
  }, [isVisible, startPolling, stopPolling]);

  useEffect(() => {
    if (data) {
      const ipfs = new IPFS({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });
      const pollArr = [];
      const init = async () => {
        if (!data.polls.length) {
          setLoading(false);
          return;
        }
        await Promise.all(
          data.polls.map(async (poll) => {
            const obj = await ipfs.catJSON(poll.proposal);
            // only include proposals with valid format
            if (obj?.text && obj?.gitCommitHash) {
              const transformedProposal = fm(obj.text);
              if (
                !pollArr.filter(
                  (p) => p.attributes.lip === transformedProposal.attributes.lip
                ).length
              ) {
                pollArr.push({
                  ...poll,
                  ...transformedProposal,
                });
              }
            }
          })
        );
        setPolls(pollArr);
        setLoading(false);
      };
      init();
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Livepeer Explorer - Voting</title>
      </Head>
      {loading ? (
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
      ) : (
        <Flex
          css={{
            mt: "$3",
            width: "100%",
            flexDirection: "column",
            "@bp3": {
              mt: "$4",
            },
          }}
        >
          <Flex
            css={{
              mb: "$4",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              as="h1"
              css={{
                fontSize: "$4",
                display: "flex",
                alignItems: "center",
                "@bp2": {
                  fontSize: 26,
                },
              }}
            >
              Voting
            </Box>
            <Link href="/voting/create-poll" as="/voting/create-poll" passHref>
              <Button as="a" outline>
                Create Poll
              </Button>
            </Link>
          </Flex>
          <Box>
            {polls
              .sort((a, b) => (a.endBlock < b.endBlock ? 1 : -1))
              .map((poll) => (
                <Link
                  key={poll.id}
                  href="/voting/[poll]"
                  as={`/voting/${poll.id}`}
                >
                  <Box
                    as="a"
                    css={{ cursor: "pointer", display: "block", mb: "$3" }}
                  >
                    <Card css={{ color: "$text", display: "block" }}>
                      <Flex
                        css={{
                          flexDirection: "column-reverse",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          "@bp2": {
                            flexDirection: "row",
                            alignItems: "center",
                          },
                        }}
                      >
                        <Box>
                          <Box
                            as="h3"
                            css={{ fontWeight: 500, fontSize: "$3", mb: "$2" }}
                          >
                            {poll.attributes.title} (LIP {poll.attributes.lip})
                          </Box>
                          <Box css={{ fontSize: "$1", color: "$muted" }}>
                            {!poll.isActive ? (
                              <Box>
                                Voting ended on{" "}
                                {moment
                                  .unix(poll.endTime)
                                  .format("MMM Do, YYYY")}
                              </Box>
                            ) : (
                              <Box>
                                Voting ends in ~
                                {moment()
                                  .add(poll.estimatedTimeRemaining, "seconds")
                                  .fromNow(true)}
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Status
                          color={poll.status}
                          css={{
                            mb: "4px",
                            fontWeight: 700,
                            textTransform: "capitalize",
                            "@bp2": {
                              mb: 0,
                            },
                          }}
                        >
                          {poll.status}
                        </Status>
                      </Flex>
                    </Card>
                  </Box>
                </Link>
              ))}
          </Box>
        </Flex>
      )}
    </>
  );
};

Voting.getLayout = getLayout;

export default withApollo({
  ssr: false,
})(Voting as NextPage);

export const getStaticProps = getStaticApolloProps<Props, Params>(Voting, {
  revalidate: 1,
});
