import { NetworkStatus, useQuery } from "@apollo/client";
import Box from "../Box";
import Table from "./Table";
import { useEffect } from "react";
import Spinner from "../Spinner";
import { usePageVisibility } from "../../hooks";
import winningTicketsQuery from "../../queries/winningTicketsQuery.gql";

const Index = ({ pageSize = 10, title = "" }) => {
  const isVisible = usePageVisibility();
  const pollInterval = 20000;

  const variables = {
    orderBy: "timestamp",
    orderDirection: "desc",
  };

  const { data, networkStatus, startPolling, stopPolling } = useQuery(
    winningTicketsQuery,
    {
      variables,
      notifyOnNetworkStatusChange: true,
      pollInterval,
    }
  );

  useEffect(() => {
    if (!isVisible) {
      startPolling(pollInterval);
    } else {
      stopPolling();
    }
  }, [isVisible, startPolling, stopPolling]);

  return (
    <Box className="tour-step-6">
      {title && (
        <Box as="h2" css={{ fontWeight: 500, fontSize: 18, mb: "$3" }}>
          {title}
        </Box>
      )}
      <Box
        css={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 10px",
          position: "relative",
          pt: "$3",
          mb: "$4",
          minHeight: 500,
          width: "100%",
          background: "rgba(255, 255, 255, 0.01)",
          border: "1px solid",
          borderColor: "rgba(194,201,209,.15)",
          borderRadius: 10,
        }}
      >
        {/* Show loading indicator if this is the first time time fetching or we're refetching
        https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts */}
        {!data || networkStatus === NetworkStatus.refetch ? (
          <Box
            css={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              top: "calc(50%)",
              left: "50%",
              height: "500px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Spinner />
          </Box>
        ) : (
          <Box>
            <Table
              pageSize={pageSize}
              data={{
                tickets: data.tickets,
                currentRound: data.protocol.currentRound,
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Index;
