import { NextPageContext } from "next";
import {
  ApolloClient,
  ApolloLink,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import createSchema from "../createSchema";
import LivepeerSDK from "@livepeer/sdk";
import { execute } from "graphql/execution/execute";

export default function createApolloClient(
  initialState: object,
  _ctx: NextPageContext | null
) {
  // The `ctx` (NextPageContext) will only be present on the server.
  // use it to extract auth headers (ctx.req) or similar.

  let cache = new InMemoryCache().restore(
    (initialState || {}) as NormalizedCacheObject
  );

  cache.writeQuery({
    query: gql`
      {
        walletModalOpen
        bottomDrawerOpen
        selectedStakingAction
        uniswapModalOpen
        roundStatusModalOpen
        txSummaryModal {
          __typename
          open
          error
        }
        txConfirmationModal {
          __typename
          open
          error
        }
        txs
        tourOpen
        roi
        principle
      }
    `,
    data: {
      walletModalOpen: false,
      bottomDrawerOpen: false,
      selectedStakingAction: "",
      uniswapModalOpen: false,
      roundStatusModalOpen: false,
      txSummaryModal: {
        __typename: "TxSummaryModal",
        open: false,
        error: false,
      },
      txConfirmationModal: {
        __typename: "TxConfirmationModal",
        open: false,
        error: false,
      },
      txs: [],
      tourOpen: false,
      roi: 0.0,
      principle: 0.0,
    },
  });

  const link = new ApolloLink((operation) => {
    return new Observable((observer) => {
      Promise.resolve(createSchema())
        .then(async (data) => {
          let context = operation.getContext();
          let provider = context?.library?._web3Provider
            ? context.library._web3Provider
            : process.env.NEXT_PUBLIC_NETWORK === "rinkeby"
            ? process.env.NEXT_PUBLIC_RPC_URL_4
            : process.env.NEXT_PUBLIC_RPC_URL_1;
          let sdk = await LivepeerSDK({
            controllerAddress: process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS,
            pollCreatorAddress: process.env.NEXT_PUBLIC_POLL_CREATOR_ADDRESS,
            provider,
            account: context?.account,
          });

          return execute(
            data,
            operation.query,
            null,
            {
              livepeer: sdk,
              ...context,
            },
            operation.variables,
            operation.operationName
          );
        })
        .then((data) => {
          if (!observer.closed) {
            observer.next(data);
            observer.complete();
          }
        })
        .catch((error) => {
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache,
  });
}
