import { NextResponse } from 'next/server'
import { gql } from '@apollo/client'
import { createApolloClient } from '@/lib/apollo/client'

const REPO_STATS = gql`
  query RepoStats($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
      forkCount
      openIssues: issues(states: OPEN) {
        totalCount
      }
      openPRs: pullRequests(states: OPEN) {
        totalCount
      }
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 5) {
              nodes {
                message
                author {
                  name
                  date
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function GET() {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'GITHUB_ACCESS_TOKEN not configured — add it to .env.local' },
      { status: 503 },
    )
  }

  try {
    const client = createApolloClient()
    const { data } = await client.query({
      query: REPO_STATS,
      variables: { owner: 'Noransaber', name: 'devpulse' },
    })
    return NextResponse.json(data)
  } catch (err) {
    console.error('GitHub API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch from GitHub' },
      { status: 500 },
    )
  }
}
