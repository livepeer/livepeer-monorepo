const Protocol = `
  type Protocol {
    "Protocol paused"
    paused: Boolean!

    "Protocol id"
    id: String!
  }
`

export default () => [Protocol]
