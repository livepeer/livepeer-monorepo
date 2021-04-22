import { useState, useEffect } from "react";
import Box from "../Box";
import Flex from "../Flex";
import Router from "next/router";
import Copy from "../../public/img/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "../Button";
import Utils from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import accountQuery from "../../queries/account.gql";
import { abbreviateNumber } from "../../lib/utils";

const Step4 = ({ goTo, nextStep }) => {
  const client = useApolloClient();
  const context = useWeb3React();
  const [copied, setCopied] = useState(false);
  const { data: dataMyAccount } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    skip: !context.active,
    ssr: false,
  });

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 4000);
    }
  }, [copied]);

  return (
    <Box css={{ pb: "$2" }}>
      <Box as="h3" css={{ mb: "$3" }}>
        Swap ETH for LPT
      </Box>
      <Box>
        <Box css={{ mb: "$3" }}>
          Don't have ETH? Get some on{" "}
          <Box
            as="a"
            href="https://coinbase.com"
            target="__blank"
            css={{
              color: "rgba(22, 82, 240)",
              textDecoration: "underline",
            }}
          >
            Coinbase
          </Box>{" "}
          and send to your address.
        </Box>
        <Box>My Address:</Box>
        <Box
          css={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "$monospace",
            mb: "$4",
          }}
        >
          <CopyToClipboard
            text={context.account}
            onCopy={() => setCopied(true)}
          >
            <Flex css={{ alignItems: "center" }}>
              <Box
                as="span"
                css={{ fontSize: "$2", fontFamily: "$monospace", mr: "$2" }}
              >
                {context.account.replace(context.account.slice(7, 37), "…")}
              </Box>
              <Copy
                css={{
                  mr: "$2",
                  cursor: "pointer",
                  width: 14,
                  height: 14,
                  color: "$text",
                }}
              />
            </Flex>
          </CopyToClipboard>
          {copied && (
            <Box as="span" css={{ fontSize: 12, color: "$text" }}>
              Copied
            </Box>
          )}
        </Box>
      </Box>

      <Box css={{ fontFamily: "$monospace", mb: "$2" }}>
        ETH Balance:{" "}
        <Box as="span" css={{ fontWeight: "bold" }}>
          {abbreviateNumber(
            +Utils.fromWei(dataMyAccount?.account?.ethBalance),
            2
          )}
        </Box>
      </Box>
      <Box css={{ fontFamily: "$monospace" }}>
        LPT Balance:{" "}
        <Box as="span" css={{ fontWeight: "bold" }}>
          {dataMyAccount?.account &&
            abbreviateNumber(
              +Utils.fromWei(dataMyAccount?.account?.tokenBalance),
              2
            )}
        </Box>
      </Box>
      <Button
        disabled={dataMyAccount?.account.tokenBalance === "0"}
        css={{ position: "absolute", right: 30, bottom: 16 }}
        onClick={async () => {
          client.writeQuery({
            query: gql`
              query {
                uniswapModalOpen
              }
            `,
            data: {
              uniswapModalOpen: false,
            },
          });
          if (dataMyAccount?.account.allowance === "0") {
            goTo(nextStep);
          } else {
            await Router.push("/");
            goTo(nextStep + 1);
          }
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default Step4;
