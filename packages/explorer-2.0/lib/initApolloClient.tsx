import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, split, Observable } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import LivepeerSDK from "@adamsoffer/livepeer-sdk";
import schema from "../apollo";
import { graphql, print } from "graphql";
import { getMainDefinition } from "apollo-utilities";

const isProd = process.env.NODE_ENV === "production";

const graphqlAPI = isProd
  ? 'https://explorer.livepeer.org/api/graphql'
  : 'http://localhost:3009/api/graphql'

let apolloClient = null;

export default (initialState = {}) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
};

function createApolloClient(initialState = {}) {
  const isBrowser = typeof window !== "undefined";

  const clientLink = new ApolloLink(
    operation =>
      new Observable(observer => {
        (async () => {
          let { query, variables, operationName, getContext } = operation;
          let context = getContext();
          let sdk = await LivepeerSDK({
            account: context.account ? context.account : "",
            gas: 2.1 * 1000000, // Default gas limit to send with transactions (2.1m wei)
            provider: context.provider
              ? context.provider
              : "https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e"
          });
          graphql(
            schema,
            print(query),
            null,
            {
              ...context,
              livepeer: sdk
            },
            variables,
            operationName
          )
            .then(result => {
              observer.next(result);
              observer.complete();
            })
            .catch(e => {
              return observer.error(e);
            });
        })();
      })
  );

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: { types: [] }
    }
  });

  const cache = new InMemoryCache({ fragmentMatcher }).restore(
    initialState || {}
  );

  cache.writeData({
    data: {
      tourOpen: false,
      roi: 0.0,
      principle: 0.0,
      selectedTranscoder: {
        __typename: "Transcoder",
        index: 0,
        rewardCut: null,
        id: null
      }
    }
  });

  const httpLink = new HttpLink({
    uri: graphqlAPI
  });


  const wsLink: any = process.browser ? new WebSocketLink({
    uri: `wss://api.thegraph.com/subgraphs/name/livepeer/livepeer`,
    options: {
      reconnect: true,
    },
  }) : () => {};


  const link = split(
    operation => {
      const mainDefinition: any = getMainDefinition(operation.query);
      return (
        mainDefinition.kind === "OperationDefinition" &&
        mainDefinition.operation === "subscription"
      );
    },
    wsLink,
    split(
      operation => {
        const mainDefinition: any = getMainDefinition(operation.query);
        return (
          mainDefinition.kind === "OperationDefinition" &&
          mainDefinition.operation === "mutation"
        );
      },
      clientLink,
      httpLink
    )
  );

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link,
    resolvers: {},
    cache
  });
}
