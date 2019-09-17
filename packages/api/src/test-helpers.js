import isoFetch from 'isomorphic-fetch'

/**
 * Clear the entire database! Not to be used outside of tests
 */
export async function clearDatabase(server) {
  for (const doc of await server.store.list()) {
    await server.store.delete(`${doc.kind}/${doc.id}`)
  }
}

export function fetch(server, path, args = {}) {
  return isoFetch(
    `http://localhost:${server.port}${server.httpPrefix}${path}`,
    args,
  )
}

export async function get(server, path) {
  return await fetch(server, path, { method: 'GET' })
}

export async function post(server, path, data) {
  return await fetch(server, path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
