import { ApolloServer } from "apollo-server-micro";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from "graphql-tools";
import Cors from "micro-cors";

const cors = Cors();

const createSchema = async () => {
  const changefeedServiceLink = new HttpLink({
    uri: "https://changefeed.app/graphql",
    fetch,
    headers: {
      Authorization: `Bearer ${process.env.CHANGEFEED_ACCESS_TOKEN}`,
    },
  });

  const createChangefeedServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(changefeedServiceLink),
      link: changefeedServiceLink,
    });
    return executableSchema;
  };

  const changefeedSchema = await createChangefeedServiceSchema();

  const merged = mergeSchemas({
    schemas: [changefeedSchema],
  });

  return merged;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const runHandler = (request, context, handler) =>
  new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body));
    handler(context, request, callback);
  });

const run = async (context, request) => {
  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
  });
  const handler = apolloServer.createHandler({ path: "/api/graphql" });
  const response = await runHandler(request, context, handler);
  return response;
};

export default cors(run);
