export default class MerkleMiner {
  constructor({
    // IPFS http gateway
    gateway = 'https://gateway.ipfs.io/ipfs',
    // IPFS web worker hash
    // workerHash,
    workerHash,
    // Event handlers
    ...handlers
  } = {}) {
    this.gateway = gateway
    this.workerHash = workerHash
    this.handlers = handlers
    console.log(handlers)
    this.messageId = 0
    return this.init()
  }
  async init(): Promise<MerkleMiner> {
    const res = await fetch(`${this.gateway}/${this.workerHash}`)
    const text = await res.text()
    const blob = new Blob([text], { type: 'application/javascript' })
    this.worker = new Worker(URL.createObjectURL(blob))
    this.worker.addEventListener('error', err => {
      if (this.handlers.onError) this.handlers.onError(err)
    })
    this.worker.addEventListener('message', ({ data }) => {
      const { type, error, payload } = data
      const methodName = `on${type[0].toUpperCase()}${type.substr(1)}`
      const f = this.handlers[methodName]
      if (f) f(error, payload)
    })
    return this
  }
  async getProof(
    hash: string,
    address: string,
    contentLength: ?number,
  ): Promise<string> {
    await this.resolveHash(hash, contentLength)
    await this.constructTree(hash)
    return this.generateProof(hash, address)
  }
  async resolveHash(hash: string, contentLength: ?number): Promise<void> {
    await this.postMessage({
      type: 'resolveHash',
      payload: { hash, gateway: this.gateway, contentLength },
    })
    return
  }
  async constructTree(hash: string): Promise<string> {
    const { root } = await this.postMessage({
      type: 'constructTree',
      payload: { hash },
    })
    return root
  }
  async generateProof(hash: string, address: string): Promise<string> {
    const { proof } = await this.postMessage({
      type: 'generateProof',
      payload: { hash, address },
    })
    return proof
  }
  postMessage(msg: Object): Promise<any> {
    return new Promise((fulfill, reject) => {
      const id = this.messageId++
      const { worker } = this
      function onMessage({ data }) {
        const { error, payload } = data
        if (data.id === id) {
          worker.removeEventListener('message', onMessage)
          return error ? reject(error) : fulfill(payload)
        }
      }
      worker.addEventListener('message', onMessage)
      worker.postMessage(Object.assign({}, msg, { id }))
    })
  }
}
