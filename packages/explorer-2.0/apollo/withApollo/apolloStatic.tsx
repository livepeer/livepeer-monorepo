import { ApolloClient } from "@apollo/client";

import createApolloClient from "./createApolloClient";

export default function apolloStatic(): ApolloClient<object> {
  if (typeof window !== "undefined") {
    throw new Error("Can only be used on the server");
  }
  return createApolloClient({}, null);
}
