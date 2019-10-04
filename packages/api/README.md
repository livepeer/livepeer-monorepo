# Livepeer API Node

## How to dev

```
yarn install
yarn run build
node -r esm src/cli.js --help
```

## Local go-livepeer

If you want to test everything end-to-end locally including go-livepeer video streaming, you can run
`yarn run go-livepeer` to boot up a broadcaster and orchestrator that the development API server knows
about.

## Testing

To run the unit tests in development, you can run `npm run test:local`. The
full `npm run test` suite runs against every store and amalgamates the runs to
ensure full test coverage.
