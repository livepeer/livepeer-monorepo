const { HttpLink } = require("apollo-link-http");
const { SchemaLink } = require("apollo-link-schema");
const { setContext } = require("apollo-link-context");
const fetch = require("isomorphic-unfetch");
const { ApolloServer } = require("apollo-server");
const {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} = require("graphql-tools");
const axios = require("axios");
const {
  schema,
  introspectionQueryResultData
} = require("@livepeer/graphql-sdk");

//const globalAny: any = global
const isBrowser = typeof window !== "undefined";
const subgraphEndpoint =
  "https://api.thegraph.com/subgraphs/id/QmWgv8QvKw1thHCTGhnhhjG4UvfwBrXULNphZekyFwYJgC";
const threeBoxEndpoint = "https://api.3box.io/graph";

// Polyfill fetch() on the server (used by apollo-client)
// if (!isBrowser) {
//   globalAny.fetch = fetch
// }

async function createSchema() {
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch
  });

  const threeBoxServiceLink = new HttpLink({
    uri: threeBoxEndpoint,
    fetch
  });

  const createMutationsSchema = () => {
    const linkTypeDefs = `
      type Pool {
        rewardTokens: String
      }
      extend type Transcoder {
        pools: [Pool]
      }
    `;
    return mergeSchemas({
      schemas: [schema, linkTypeDefs]
    });
  };

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink
    });
    return executableSchema;
  };

  const create3BoxServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(threeBoxServiceLink),
      link: threeBoxServiceLink
    });
    return executableSchema;
  };

  const subgraphSchema = await createSubgraphServiceSchema();
  const threeBoxSchema = await create3BoxServiceSchema();
  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }

    extend type Transcoder {
      profile: Profile
    }
  `;
  const merged = mergeSchemas({
    schemas: [schema, subgraphSchema, threeBoxSchema, linkTypeDefs]
  });
  return merged;
}

createSchema().then(schema => {
  const server = new ApolloServer({ schema });
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
