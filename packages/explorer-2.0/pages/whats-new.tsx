import Box from "../components/Box";
import Flex from "../components/Flex";
import Spinner from "../components/Spinner";
import Card from "../components/Card";
import moment from "moment";
import { getLayout } from "../layouts/main";
import Markdown from "markdown-to-jsx";
import { withApollo } from "../apollo";
import { createApolloFetch } from "apollo-fetch";
import { useEffect, useState } from "react";
import Head from "next/head";

const query = `
  {
    projectBySlugs(organizationSlug: "livepeer", projectSlug: "explorer") {
      name
      releases {
        edges {
          node {
            title
            description
            isPublished
            publishedAt
            changes {
              type
              content
            }
          }
        }
      }
    }
  }
`;

function getBadgeColor(changeType) {
  if (changeType === "NEW") {
    return "$primary";
  } else if (changeType === "IMPROVED") {
    return "teal";
  } else if (changeType === "FIXED") {
    return "skyBlue";
  } else if (changeType === "REMOVED") {
    return "red";
  } else {
    return "blue";
  }
}

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const groupByType = groupBy("type");

const WhatsNew = () => {
  const [changeFeedData, setChangeFeedData] = useState(null);

  useEffect(() => {
    const apolloFetch = createApolloFetch({
      uri: `${window.location.origin}/api/graphql`,
    });
    async function getChangefeed() {
      const { data } = await apolloFetch({ query });
      setChangeFeedData(data);
    }
    getChangefeed();
  }, []);

  return (
    <>
      <Head>
        <title>Livepeer Explorer - What's New</title>
      </Head>
      {!changeFeedData ? (
        <Flex
          css={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Flex
            css={{
              mt: "$3",
              mb: "$4",
              width: "100%",
              flexDirection: "column",
              "@bp3": {
                mt: "$4",
              },
            }}
          >
            <Box
              as="h1"
              css={{
                fontSize: "$3",
                mb: "$4",
                display: "flex",
                alignItems: "center",
                "@bp2": {
                  fontSize: "$5",
                },
                "@bp3": {
                  mb: "$4",
                  fontSize: 26,
                },
              }}
            >
              <Box as="span" css={{ mr: "$3" }}>
                🌟
              </Box>{" "}
              What's New
            </Box>
            <Box css={{ img: { maxWidth: "100%" } }}>
              {changeFeedData.projectBySlugs.releases.edges.map(
                ({ node }, index1) =>
                  node.isPublished && (
                    <Card key={index1} css={{ flex: 1, mb: "$4" }}>
                      <Box as="h3">{node.title}</Box>
                      <Box
                        css={{
                          lineHeight: 2,
                          mb: "$3",
                          fontSize: "$2",
                          color: "$muted",
                        }}
                      >
                        {moment(node.publishedAt).format("MMM Do, YYYY")}
                      </Box>
                      <Box
                        css={{
                          borderBottom: "1px solid",
                          borderColor: "$border",
                          pb: "$4",
                          mb: "$4",
                          a: { color: "$primary" },
                          lineHeight: 1.5,
                        }}
                      >
                        <Markdown>{node.description}</Markdown>
                      </Box>
                      {Object.keys(groupByType(node.changes)).map(
                        (key, index2) => {
                          return (
                            <Box key={index2} css={{ mb: "$3" }}>
                              <Box
                                css={{
                                  fontSize: "14px",
                                  display: "inline-flex",
                                  textTransform: "uppercase",
                                  lineHeight: "1",
                                  fontWeight: "bold",
                                  margin: "0px",
                                  padding: "4px 16px",
                                  alignSelf: "flex-start",
                                  borderRadius: "4px",
                                  color: "$background",
                                  bg: getBadgeColor(key),
                                  mb: "$3",
                                }}
                              >
                                {key}
                              </Box>
                              {groupByType(node.changes)[key].map(
                                (change, index3) => (
                                  <Box
                                    as="ul"
                                    key={index3}
                                    css={{ pl: 20, alignSelf: "flexStart" }}
                                  >
                                    <Box as="li" css={{ mb: "$3" }}>
                                      {change.content}
                                    </Box>
                                  </Box>
                                )
                              )}
                            </Box>
                          );
                        }
                      )}
                    </Card>
                  )
              )}
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};

WhatsNew.getLayout = getLayout;

export default withApollo({
  ssr: false,
})(WhatsNew);
