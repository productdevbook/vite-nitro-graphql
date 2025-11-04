import { useState } from 'react'

// GraphQL Query Helper
async function graphqlQuery(query: string, variables?: any) {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  return res.json()
}

export default function App() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuery = async (queryFn: () => Promise<any>, label: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await queryFn()
      setResult({ data, label })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getUser = () => handleQuery(
    () => graphqlQuery(`
      query GetUser($id: ID!) {
        getUser(id: $id) { id email name createdAt }
      }
    `, { id: "1" }),
    'Query Result'
  )

  const createUser = () => handleQuery(
    async () => {
      const randomId = Math.floor(Math.random() * 10000)
      return graphqlQuery(`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) { id email name createdAt }
        }
      `, {
        input: {
          email: `user${randomId}@example.com`,
          name: `Demo User ${randomId}`,
        },
      })
    },
    'Mutation Result'
  )

  const getAllUsers = () => handleQuery(
    () => Promise.all([
      graphqlQuery(`query { getUser(id: "1") { id email name createdAt } }`),
      graphqlQuery(`query { getUser(id: "2") { id email name createdAt } }`),
    ]),
    'All Users'
  )

  return (
    <div style={{
      display: 'flex',
      gap: '60px',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      alignItems: 'center'
    }}>
      {/* Left Panel */}
      <div style={{ flex: '0 0 200px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '16px',
          alignItems: 'center'
        }}>
          <a
            href="https://v3.nitro.build"
            target="_blank"
            rel="noopener noreferrer"
            style={{ transition: 'transform 0.2s' }}
          >
            <img src="/nitro.svg" alt="Nitro" style={{ width: '48px', height: '48px' }} />
          </a>
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ transition: 'transform 0.2s' }}
          >
            <img src="/vite.svg" alt="Vite" style={{ width: '48px', height: '48px' }} />
          </a>
          <a
            href="https://github.com/productdevbook/nitro-graphql"
            target="_blank"
            rel="noopener noreferrer"
            style={{ transition: 'transform 0.2s' }}
          >
            <img
              src="https://graphql.org/img/logo.svg"
              alt="GraphQL"
              style={{ width: '48px', height: '48px' }}
            />
          </a>
        </div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#222',
          margin: '0 0 8px 0',
          lineHeight: 1.2
        }}>
          GraphQL Demo
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#999',
          margin: 0,
          fontWeight: 400
        }}>
          with React
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, maxWidth: '900px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '16px',
            color: '#666',
            margin: '0 0 15px 0',
            fontWeight: 500
          }}>
            Examples
          </h3>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            <button
              onClick={getUser}
              disabled={loading}
              style={{
                padding: '14px 28px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                background: '#10b981',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                opacity: loading ? 0.7 : 1
              }}
            >
              Get User
            </button>

            <button
              onClick={createUser}
              disabled={loading}
              style={{
                padding: '14px 28px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                background: '#3b82f6',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                opacity: loading ? 0.7 : 1
              }}
            >
              Create User
            </button>

            <button
              onClick={getAllUsers}
              disabled={loading}
              style={{
                padding: '14px 28px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 500,
                background: '#f59e0b',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                opacity: loading ? 0.7 : 1
              }}
            >
              Get All Users
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div style={{
          padding: '24px',
          background: '#1e1e1e',
          borderRadius: '10px',
          minHeight: '200px',
          color: '#e0e0e0',
          fontSize: '14px',
          overflowX: 'auto',
          lineHeight: 1.6
        }}>
          {loading && (
            <em style={{ color: '#888' }}>Loading...</em>
          )}

          {error && (
            <>
              <div style={{
                color: '#ff6b6b',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                ✗ Error
              </div>
              <pre style={{ color: '#ff6b6b', margin: 0 }}>{error}</pre>
            </>
          )}

          {result && !loading && !error && (
            <>
              <div style={{
                color: '#10b981',
                fontWeight: 600,
                marginBottom: '12px',
                fontSize: '15px'
              }}>
                ✓ {result.label}
              </div>
              <pre style={{
                background: '#2d2d2d',
                color: '#e0e0e0',
                padding: '16px',
                borderRadius: '6px',
                fontSize: '13px',
                border: '1px solid #3d3d3d',
                overflowX: 'auto',
                margin: 0
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </>
          )}

          {!loading && !error && !result && (
            <em style={{ color: '#888' }}>Click a button to see results...</em>
          )}
        </div>
      </div>
    </div>
  )
}
