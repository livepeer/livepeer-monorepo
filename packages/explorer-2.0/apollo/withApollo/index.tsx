// https://github.com/TheRusskiy/next-apollo-ts
import App, { AppContext } from 'next/app'
import Head from 'next/head'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { NextPage, NextPageContext } from 'next'
import { useComponentWillMount, useComponentDidMount } from '../../hooks'
import { DeepMerger } from '@apollo/client/utilities'
import createApolloClient from './createApolloClient'

// On the client, we store the Apollo Client in the following variable.
// This prevents the client from reinitializing between page transitions.
let globalApolloClient: ApolloClient<object> | null = null

type WithApolloPageContext = NextPageContext & {
  apolloClient: ApolloClient<object>
  apolloState: object
}

function isAppContext(
  ctx: AppContext | WithApolloPageContext,
): ctx is AppContext {
  return Boolean((ctx as AppContext)?.ctx)
}

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerSideProps
 * @param {NextPageContext | NextAppContext} ctx
 */
export const initOnContext = (
  ctx: AppContext | WithApolloPageContext,
): WithApolloPageContext => {
  let appContext: AppContext | null = null
  let pageContext: WithApolloPageContext | null = null
  if (isAppContext(ctx)) {
    appContext = ctx as AppContext
    pageContext = appContext.ctx as WithApolloPageContext
  } else {
    pageContext = ctx as WithApolloPageContext
  }

  // We consider installing `withApollo({ ssr: true })` on global App level
  // as antipattern since it disables project wide Automatic Static Optimization.
  if (process.env.NODE_ENV === 'development') {
    if (appContext) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n',
      )
    }
  }

  // Initialize ApolloClient if not already done
  const apolloClient =
    pageContext.apolloClient ||
    initApolloClient(pageContext.apolloState || {}, pageContext)

  // We send the Apollo Client as a prop to the component to avoid calling initApollo() twice in the server.
  // Otherwise, the component would have to call initApollo() again but this
  // time without the context. Once that happens, the following code will make sure we send
  // the prop as `null` to the browser.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  apolloClient.toJSON = () => null

  // Add apolloClient to NextPageContext & NextAppContext.
  // This allows us to consume the apolloClient inside our
  // custom `getInitialProps({ apolloClient })`.
  pageContext.apolloClient = apolloClient

  return pageContext
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {NormalizedCacheObject} initialState
 * @param  {NextPageContext} ctx
 */
export const initApolloClient = (
  initialState: object,
  ctx: NextPageContext | null,
) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx)
  }

  return globalApolloClient
}

/**
 * Creates a withApollo HOC
 * that provides the apolloContext
 * to a next.js Page or AppTree.
 * @param  {Object} withApolloOptions
 * @param  {Boolean} [withApolloOptions.ssr=false]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */
type NextPageProps = {
  revalidate?: number
  generatedAt?: string
}

export const withApollo = ({ ssr = false } = {}) => (
  PageComponent: NextPage<NextPageProps>,
) => {
  const WithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: {
    apolloClient?: ApolloClient<object>
    apolloState: object
    revalidate?: number
    generatedAt?: string
  }) => {
    let client: ApolloClient<object>
    if (apolloClient) {
      // Happens on: getDataFromTree & next.js ssr
      client = apolloClient
    } else {
      // Happens on: next.js csr
      client = initApolloClient(apolloState, null)
      if (
        apolloState &&
        pageProps.generatedAt &&
        typeof window !== 'undefined'
      ) {
        // source:
        // https://github.com/apollographql/apollo-client/blob/a975320528d314a1b7eba131b97d045d940596d7/src/cache/inmemory/writeToStore.ts#L100
        // a normal "deep merge" seemed to work as well, but it's safer to use
        // Apollo's implementation
        const merger = new DeepMerger()
        client.cache.restore(merger.merge(apolloState, client.cache.extract()))
      }
    }

    // https://github.com/apollographql/apollo-client/issues/4814#issuecomment-604764404
    useComponentWillMount(() => {
      if (typeof window !== 'undefined') {
        let disableNetworkFetches = true
        const { revalidate, generatedAt } = pageProps
        if (revalidate && generatedAt) {
          const isOld: boolean =
            new Date().getTime() - new Date(generatedAt).getTime() >
            revalidate * 1000
          if (isOld) {
            disableNetworkFetches = false
          }
        }
        client.disableNetworkFetches = disableNetworkFetches
      }
    })

    useComponentDidMount(() => {
      if (typeof window !== 'undefined') {
        client.disableNetworkFetches = false
      }
    })

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component'
    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (
      ctx: WithApolloPageContext | AppContext,
    ) => {
      let appContext: AppContext | null = null
      let pageContext: WithApolloPageContext | null = null
      if (isAppContext(ctx)) {
        appContext = ctx as AppContext
        pageContext = appContext.ctx as WithApolloPageContext
      } else {
        pageContext = ctx as WithApolloPageContext
      }
      const { apolloClient } = initOnContext(ctx)

      // Run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(pageContext!)
      } else if (appContext) {
        pageProps = await App.getInitialProps(appContext)
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        const { AppTree } = ctx
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (pageContext?.res && pageContext?.res.finished) {
          return pageProps
        }

        // TODO: replace with react-ssr-prepass
        // https://codesandbox.io/s/knk2e?file=/lib/with-urql-client.js
        // Only if dataFromTree is enabled
        if (ssr && AppTree) {
          try {
            // Import `@apollo/react-ssr` dynamically.
            // We don't want to have this in our client bundle.
            const { getDataFromTree } = await import('@apollo/client/react/ssr')

            // Since AppComponents and PageComponents have different context types
            // we need to modify their props a little.
            let props
            if (appContext) {
              props = { ...pageProps, apolloClient }
            } else {
              props = { pageProps: { ...pageProps, apolloClient } }
            }

            // Take the Next.js AppTree, determine which queries are needed to render,
            // and fetch them. This method can be pretty slow since it renders
            // your entire AppTree once for every query. Check out apollo fragments
            // if you want to reduce the number of rerenders.
            // https://www.apollographql.com/docs/react/data/fragments/
            await getDataFromTree(<AppTree pageProps={pageProps} {...props} />)
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            // eslint-disable-next-line no-console
            console.error('Error while running `getDataFromTree`', error)
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind()
        }
      }

      return {
        ...pageProps,
        // Extract query data from the Apollo store
        apolloState: apolloClient.cache.extract(),
        // Provide the client for ssr. As soon as this payload
        // gets JSON.stringified it will remove itself.
        apolloClient,
      }
    }
  }

  return WithApollo
}
