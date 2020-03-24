export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.type = 'NotFoundError'
    this.status = 404
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message)
    this.type = 'NotFoundError'
    this.status = 403
    this.message = message
  }
}

