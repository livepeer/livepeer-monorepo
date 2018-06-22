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
    progress: { download: 0, tree: 0 },
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
  return getResponseMessage(state)
}

/** Generates a merkle tree for the given input ArrayBuffer. This takes ~30s */
async function constructTree(state, payload: { hash: string }) {
  try {
    const { hash, input } = state
    const key = `${hash}_tree`
    const onProgress = n => {
      state.progress.tree = n
      if (n < 1)
        dispatch('constructTree', null, null, getResponseMessage(state))
    }
    if (hash !== payload.hash) {
      throw new Error(
        `Cannot create merkle tree for hash ${
          payload.hash
        }. Current input hash is ${hash}`,
      )
    }
    // Use cached merkle tree if available
    if (!state.tree) {
      const totalBranches = CACHING_ENABLED
        ? await localforage.getItem(`${key}_branch_total`)
        : 0
      if (totalBranches > 0) {
        const tree = []
        onProgress(0)
        for (let i = 0; i < totalBranches; i++) {
          const branch = await localforage.getItem(`${key}_branch_${i}`)
          if (!Array.isArray(branch))
            throw new Error('Malformed merkle tree branch')
          tree.push(branch)
          onProgress((i + 1) / totalBranches)
        }
        state.tree = tree
      }
      // Otherwise, generate new merkle tree
      else {
        // Create tree synchronously, but send progress events along the way
        state.tree = createTree(input, onProgress)
        if (CACHING_ENABLED) {
          const totalBranches = state.tree.length
          await localforage.setItem(`${key}_branch_total`, totalBranches)
          for (let i = 0; i < totalBranches; i++) {
            const branch = state.tree[i]
            const branchKey = `${key}_branch_${i}`
            await localforage.setItem(branchKey, branch)
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
      progress: state.progress,
      proof: state.proof,
    }
  } catch (err) {
    // Blow away cache
    if (CACHING_ENABLED) await localforage.removeItem(`${state.hash}_tree_len`)
    throw err
  }
}

/** Fetches input data via hash from IPFS gateway */
async function resolveHash(
  state,
  payload: { contentLength: ?number, gateway: string, hash: string },
) {
  const { gateway, hash } = payload
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
      state.progress.download = 1
    }
    // Otherwise, get data from ipfs
    else {
      let res = await fetch(`${gateway}/${hash}`)
      const contentLength =
        typeof payload.contentLength === 'number'
          ? // IPFS gateway response headers lack Access-Control-Expose-Headers
            payload.contentLength
          : res.headers.get('Content-Length')
      state.progress.download = 0
      dispatch(
        'resolveHash',
        null,
        null,
        getResponseMessage({ hash, ...state }),
      )
      // Emit progress if content length is available
      if (contentLength) {
        const total = parseInt(contentLength, 10)
        let loaded = 0
        let lastProgress = 0
        const responseStream = new ReadableStream({
          start(controller) {
            const reader = res.body.getReader()
            ;(async function read() {
              try {
                const { done, value } = await reader.read()
                if (done) return controller.close()
                loaded += value.byteLength
                const n = loaded / total
                state.progress.download = n
                if (n < 1 && n - lastProgress >= 0.01) {
                  lastProgress = n
                  dispatch(
                    'resolveHash',
                    null,
                    null,
                    getResponseMessage({ hash, ...state }),
                  )
                }
                controller.enqueue(value)
                read()
              } catch (err) {
                controller.error(err)
              }
            })()
          },
        })
        res = new Response(responseStream)
      }
      state.input = await res.arrayBuffer()
      if (CACHING_ENABLED) await localforage.setItem(hash, state.input)
    }
    // Update hash only once input data download is complete
    state.hash = hash
  }
  return getResponseMessage(state)
}

/** Returns a slimmed-down version of the state that can bbe sent across the write without perf issues */
function getResponseMessage(state) {
  return {
    hash: state.hash,
    root: state.root,
    address: state.address,
    progress: state.progress,
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
      dispatch(type, id, null, await f(state, payload))
    } catch (err) {
      console.log(`got error:`, id, type, err.message, err.stack)
      dispatch(type, id, err, null)
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
