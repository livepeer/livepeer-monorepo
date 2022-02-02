import Box from "../Box";
import Flex from "../Flex";
import Utils from "web3-utils";
import { abbreviateNumber } from "../../lib/utils";
import VoteButton from "../VoteButton";
import { useWeb3React } from "@web3-react/core";
import Button from "../Button";
import ReactTooltip from "react-tooltip";
import { gql, useApolloClient } from "@apollo/client";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Check from "../../public/img/check.svg";
import Copy from "../../public/img/copy.svg";
import { useState, useEffect } from "react";
import Modal from "../Modal";

const Index = ({ data }) => {
  const context = useWeb3React();
  const client = useApolloClient();
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  const noVoteStake = parseFloat(data.poll?.tally?.no || "0");
  const yesVoteStake = parseFloat(data.poll?.tally?.yes || "0");
  const totalVoteStake = noVoteStake + yesVoteStake;
  const totalNonVoteStake = +data?.poll?.totalNonVoteStake;
  const votingPower = getVotingPower(data?.myAccount, data?.vote);

  let delegate = null;
  if (data?.myAccount?.delegator?.delegate) {
    delegate = data?.myAccount?.delegator?.delegate;
  }

  return (
    <Box css={{ width: "100%" }}>
      <Box>
        <Box
          css={{
            width: "100%",
            boxShadow:
              "rgba(0, 0, 0, 0.03) 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.06) 0px 16px 24px, rgba(0, 0, 0, 0.03) 0px 24px 32px",
            borderRadius: "$6",
            backgroundColor: "$surface",
            px: "$4",
            py: "$3",
          }}
        >
          <Box css={{ fontWeight: "bold", fontSize: "$4", mb: "$3" }}>
            Do you support LIP-{data.poll.lip}?
          </Box>
          <Box
            css={{
              mb: "$3",
              pb: "$3",
              borderBottom: "1px solid",
              borderColor: "$border",
            }}
          >
            <Box css={{ mb: "$3" }}>
              <Flex
                css={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  width: "100%",
                  height: 24,
                  mb: "8px",
                }}
              >
                <Box
                  css={{
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderTopRightRadius:
                      yesVoteStake / totalVoteStake === 1 ? 6 : 0,
                    borderBottomRightRadius:
                      yesVoteStake / totalVoteStake === 1 ? 6 : 0,
                    position: "absolute",
                    height: "100%",
                    bg: "rgba(255, 255, 255, .2)",
                    width: `${(yesVoteStake / totalVoteStake) * 100}%`,
                  }}
                />
                <Box
                  css={{
                    lineHeight: 1,
                    fontWeight: 500,
                    pl: "$2",
                    color: "$text",
                    fontSize: "$2",
                  }}
                >
                  Yes
                </Box>
                <Box
                  css={{
                    lineHeight: 1,
                    pr: "$2",
                    color: "$text",
                    fontSize: "$2",
                  }}
                >
                  {isNaN(yesVoteStake / totalVoteStake)
                    ? 0
                    : ((yesVoteStake / totalVoteStake) * 100).toPrecision(5)}
                  %
                </Box>
              </Flex>
              <Flex
                css={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  position: "relative",
                  height: 24,
                  width: "100%",
                }}
              >
                <Box
                  css={{
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderTopRightRadius:
                      noVoteStake / totalVoteStake === 1 ? 6 : 0,
                    borderBottomRightRadius:
                      noVoteStake / totalVoteStake === 1 ? 6 : 0,
                    position: "absolute",
                    height: "100%",
                    bg: "rgba(255, 255, 255, .2)",
                    width: `${(noVoteStake / totalVoteStake) * 100}%`,
                  }}
                />
                <Box
                  css={{
                    lineHeight: 1,
                    pl: "$2",
                    fontWeight: 500,
                    color: "$text",
                    fontSize: "$2",
                  }}
                >
                  No
                </Box>
                <Box
                  css={{
                    lineHeight: 1,
                    pr: "$2",
                    color: "$text",
                    fontSize: "$2",
                  }}
                >
                  {isNaN(noVoteStake / totalVoteStake)
                    ? 0
                    : ((noVoteStake / totalVoteStake) * 100).toPrecision(5)}
                  %
                </Box>
              </Flex>
            </Box>
            <Box css={{ fontSize: "$2", color: "$muted" }}>
              {data.poll.votes.length}{" "}
              {`${
                data.poll.votes.length > 1 || data.poll.votes.length === 0
                  ? "votes"
                  : "vote"
              }`}{" "}
              · {abbreviateNumber(totalVoteStake, 4)} LPT ·{" "}
              {!data.poll.isActive
                ? "Final Results"
                : moment
                    .duration(data.poll.estimatedTimeRemaining, "seconds")
                    .humanize() + " left"}
            </Box>
          </Box>

          {context.active ? (
            <>
              <Box>
                <Flex
                  css={{
                    fontSize: "$2",
                    mb: "$2",
                    justifyContent: "space-between",
                  }}
                >
                  <Box as="span" css={{ color: "$muted" }}>
                    My Delegate Vote{" "}
                    {delegate &&
                      `(${delegate.id.replace(delegate.id.slice(5, 39), "…")})`}
                  </Box>
                  <Box as="span" css={{ fontWeight: 500, color: "white" }}>
                    {data?.delegateVote?.choiceID
                      ? data?.delegateVote?.choiceID
                      : "N/A"}
                  </Box>
                </Flex>
                <Flex
                  css={{
                    mb: "$2",
                    fontSize: "$2",
                    justifyContent: "space-between",
                  }}
                >
                  <Box as="span" css={{ color: "$muted" }}>
                    My Vote (
                    {context.account.replace(context.account.slice(5, 39), "…")}
                    )
                  </Box>
                  <Box as="span" css={{ fontWeight: 500, color: "$white" }}>
                    {data?.vote?.choiceID ? data?.vote?.choiceID : "N/A"}
                  </Box>
                </Flex>
                {((!data?.vote?.choiceID && data.poll.isActive) ||
                  data?.vote?.choiceID) && (
                  <Flex
                    css={{ fontSize: "$2", justifyContent: "space-between" }}
                  >
                    <Box as="span" css={{ color: "$muted" }}>
                      My Voting Power
                    </Box>
                    <Box as="span" css={{ fontWeight: 500, color: "$white" }}>
                      <Box as="span">
                        {abbreviateNumber(votingPower, 4)} LPT (
                        {(
                          (+votingPower /
                            (totalVoteStake + totalNonVoteStake)) *
                          100
                        ).toPrecision(2)}
                        %)
                      </Box>
                    </Box>
                  </Flex>
                )}
              </Box>
              {data.poll.isActive && renderVoteButton(data)}
            </>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                client.writeQuery({
                  query: gql`
                    query {
                      walletModalOpen
                    }
                  `,
                  data: {
                    walletModalOpen: true,
                  },
                });
              }}
              css={{
                width: "100%",
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>
      {data.poll.isActive && (
        <Box
          css={{
            display: "none",
            mt: "$3",
            fontSize: "$1",
            borderRadius: 6,
            border: "1px solid",
            borderColor: "$border",
            p: "$3",
            "@bp3": {
              display: "block",
            },
          }}
        >
          <Box css={{ lineHeight: 1.8 }}>
            Are you an orchestrator?{" "}
            <Box
              as="span"
              onClick={() => setModalOpen(true)}
              css={{ color: "$primary", cursor: "pointer" }}
            >
              Follow these instructions
            </Box>{" "}
            if you prefer to vote with the Livepeer CLI.
          </Box>
        </Box>
      )}
      <Modal
        title="Livepeer CLI Voting Instructions"
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
      >
        <Box as="ol" css={{ pl: 15 }}>
          <Box as="li" css={{ mb: "$4" }}>
            <Box css={{ mb: "$3" }}>
              Run the Livepeer CLI and select the option to "Vote on a poll".
              When prompted for a contract address, copy and paste this poll's
              contract address:
            </Box>
            <Box
              css={{
                p: "$3",
                mb: "$2",
                position: "relative",
                color: "$primary",
                bg: "$background",
                borderRadius: 4,
                fontFamily: "$monospace",
              }}
            >
              {data.poll.id}
              <CopyToClipboard
                text={data.poll.id}
                onCopy={() => setCopied(true)}
              >
                <Flex
                  data-for="copyAddress"
                  data-tip={`${
                    copied ? "Copied" : "Copy poll address to clipboard"
                  }`}
                  css={{
                    ml: "$2",
                    mt: "3px",
                    position: "absolute",
                    right: 12,
                    top: 10,
                    cursor: "pointer",
                    borderRadius: 1000,
                    bg: "$surface",
                    width: 26,
                    height: 26,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReactTooltip
                    id="copyAddress"
                    className="tooltip"
                    place="left"
                    type="dark"
                    effect="solid"
                  />
                  {copied ? (
                    <Check
                      css={{
                        width: 12,
                        height: 12,
                        color: "$muted",
                      }}
                    />
                  ) : (
                    <Copy
                      css={{
                        width: 12,
                        height: 12,
                        color: "$muted",
                      }}
                    />
                  )}
                </Flex>
              </CopyToClipboard>
            </Box>
          </Box>
          <Box as="li" css={{ mb: "$4" }}>
            <Box css={{ mb: "$3" }}>
              The Livepeer CLI will prompt you for your vote. Enter 0 to vote
              "Yes" or 1 to vote "No".
            </Box>
          </Box>
          <Box as="li" css={{ mb: 0 }}>
            <Box css={{ mb: "$3" }}>
              Once your vote is confirmed, check back here to see it reflected
              in the UI.
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Index;

function renderVoteButton(data) {
  switch (data?.vote?.choiceID) {
    case "Yes":
      return (
        <VoteButton
          disabled={!(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)}
          css={{ mt: "$4", width: "100%" }}
          variant="red"
          choiceId={1}
          pollAddress={data.poll.id}
        >
          Change Vote To No
        </VoteButton>
      );
    case "No":
      return (
        <VoteButton
          disabled={!(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)}
          css={{ mt: "$4", width: "100%" }}
          choiceId={0}
          pollAddress={data.poll.id}
        >
          Change Vote To Yes
        </VoteButton>
      );
    default:
      return (
        <Box css={{ mt: "$4", display: "grid", gap: "$3", columns: 2 }}>
          <VoteButton
            disabled={
              !(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)
            }
            choiceId={0}
            pollAddress={data.poll.id}
          >
            Yes
          </VoteButton>
          <VoteButton
            disabled={
              !(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)
            }
            variant="red"
            choiceId={1}
            pollAddress={data.poll.id}
          >
            No
          </VoteButton>
        </Box>
      );
  }
}

function getVotingPower(myAccount, vote) {
  // if account is a delegate its voting power is its total stake minus its delegators' vote stake (nonVoteStake)
  if (myAccount?.account.id === myAccount?.delegator?.delegate.id) {
    if (vote?.voteStake) {
      return +vote.voteStake - +vote?.nonVoteStake;
    }
    return +myAccount?.delegator?.delegate?.totalStake - (vote?.nonVoteStake ? +vote.nonVoteStake : 0);
  }

  return Utils.fromWei(
    myAccount?.delegator?.pendingStake
      ? myAccount?.delegator?.pendingStake
      : "0"
  );
}
