export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.type = 'NotFoundError'
    this.status = 404
  }
}
