import { ApolloClient } from "apollo-client";
import {
  InMemoryCache,
  defaultDataIdFromObject,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { SchemaLink } from 'apollo-link-schema';
import { WebSocketLink } from "apollo-link-ws";
import schema from "../apollo";
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

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: { types: [] }
    }
  });

  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => {
    switch (object.__typename) {
      case 'ThreeBoxSpace': return object.id; // use the `id` field as the identifier
      default: return defaultDataIdFromObject(object); // fall back to default handling
    }
  }
    }).restore(
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

  const clientLink = new SchemaLink({ schema, context: (operation) => {
    const context = operation.getContext()
    return {
      ...context
    }
  }})

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
