import 'localforage'
import {
  createTree,
  fromHex,
  getProof,
  getRoot,
  hashLeaf,
  indexOf,
  toHex,
} from './utils'

// Check for IndexedDB support
const CACHING_ENABLED = localforage.supports(localforage.INDEXEDDB)

/** Setup main message handler for the worker */
self.onmessage = createMessageHandlers(
  // initial state
  {
    hash: '',
    input: null,
    tree: null,
    root: '',
    address: '',
    proof: '',
  },
  // message handlers
  {
    resolveHash,
    generateProof,
    constructTree,
  },
)

/** Generates a merkle proof for a given address. */
async function generateProof(
  state,
  payload: { hash: string, address: string },
) {
  const { hash, tree } = state
  const { address } = payload
  const key = `${hash}_${address}_proof`
  if (hash !== payload.hash) {
    throw new Error(
      `Cannot create proof for hash ${
        payload.hash
      }. Current input hash is ${hash}`,
    )
  }
  if (state.address !== address) {
    // Use cached proof if available
    const proof = CACHING_ENABLED ? await localforage.getItem(key) : null
    if (proof) {
      state.proof = proof
    }
    // Otherwise, generate merkle proof for given address
    else {
      // Merkle tree must exist before calculating new proofs
      if (!tree) throw new Error('Merkle tree has not been generated')
      const index = indexOf(tree[0], hashLeaf(fromHex(address)))
      state.proof = index === -1 ? '' : toHex(getProof(tree, index))
      // cache proof
      if (CACHING_ENABLED) await localforage.setItem(key, state.proof)
    }
    // Update address
    state.address = address
  }
  return {
    hash: state.hash,
    root: state.root,
    address: state.address,
    proof: state.proof,
  }
}

/** Generates a merkle tree for the given input ArrayBuffer. This takes ~30s */
async function constructTree(state, payload: { hash: string }) {
  try {
    const { hash, input } = state
    const key = `${hash}_tree`
    const onProgress = n => dispatch('constructTreeProgress', null, null, n)
    if (hash !== payload.hash) {
      throw new Error(
        `Cannot create merkle tree for hash ${
          payload.hash
        }. Current input hash is ${hash}`,
      )
    }
    // Use cached merkle tree if available
    if (!state.tree) {
      const treeLength = CACHING_ENABLED
        ? await localforage.getItem(`${key}_len`)
        : 0
      if (treeLength) {
        const tree = []
        onProgress(0)
        for (let i = 0; i < treeLength; i++) {
          const leaf = await localforage.getItem(`${key}_leaf_${i}`)
          tree.push(leaf)
          onProgress((i + 1) / treeLength)
        }
        state.tree = tree
      }
      // Otherwise, generate new merkle tree
      else {
        // Create tree synchronously, but send progress events along the way
        state.tree = createTree(input, onProgress)
        if (CACHING_ENABLED) {
          await localforage.setItem(`${key}_len`, state.tree.length)
          let i = 0
          for (const leaf of state.tree) {
            await localforage.setItem(`${key}_leaf_${i++}`, leaf)
          }
        }
      }
    }
    // Store merkle root in state
    state.root = toHex(getRoot(state.tree))
    return {
      hash: state.hash,
      root: state.root,
      address: state.address,
      proof: state.proof,
    }
  } catch (err) {
    // Blow away cache
    if (CACHING_ENABLED) await localforage.removeItem(`${state.hash}_tree_len`)
    throw err
  }
}

/** Fetches input data via hash from IPFS gateway */
async function resolveHash(state, payload: { gateway: string, hash: string }) {
  const { hash } = payload
  if (state.hash !== hash) {
    // reset state
    state.hash = ''
    state.input = null
    state.tree = null
    state.root = ''
    state.address = ''
    state.proof = ''
    // Use cached input data if available
    const input = CACHING_ENABLED ? await localforage.getItem(hash) : null
    if (input) {
      state.input = input
    }
    // Otherwise, get data from ipfs
    else {
      const res = await fetch(`${gateway}/${hash}`)
      state.input = await res.arrayBuffer()
      if (CACHING_ENABLED) await localforage.setItem(hash, state.input)
    }
    // Update hash
    state.hash = hash
  }
  return {
    hash: state.hash,
    root: state.root,
    address: state.address,
    proof: state.proof,
  }
}

/** Delegates payloads and state to message handlers */
function createMessageHandlers(
  initialState: any,
  handlers: { [string]: (Object, any) => any },
) {
  const state = initialState
  return async function onMessage({ data }): void {
    const { id, type, payload } = data
    const f = handlers[type]
    if (!f) throw new Error(`No handler for message type "${type}"`)
    try {
      dispatch(`${type}Success`, id, null, await f(state, payload))
    } catch (err) {
      console.log(`got error:`, id, type, err.message, err.stack)
      dispatch(`${type}Error`, id, err, null)
    }
  }
}

/** Respond to the main thread with a success or error */
function dispatch(
  type: string,
  id: number,
  error: Error | void,
  payload: any,
): void {
  self.postMessage({
    id,
    type,
    error: error ? { message: error.message || 'An error occurred' } : null,
    payload,
  })
}
