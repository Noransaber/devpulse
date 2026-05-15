import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    }),
    cache: new InMemoryCache(),
  })
}
