import yargs from 'yargs'
import path from 'path'
import os from 'os'

export default function parseCli(argv) {
  return (
    yargs
      .usage(
        `
    Livepeer API Node

    Options my also be provided as LP_ prefixed environment variables, e.g. LP_PORT=5000 is the same as --port=5000.

    --broadcaster and --orchestrator options should be of the form
    [{"address":"https://127.0.0.1:3086","cliAddress":"http://127.0.0.1:3076"}]
    `,
      )
      .env('LP_')
      //.strict(true)
      .options({
        port: {
          describe: 'port to listen on',
          default: 3004,
          demandOption: true,
          type: 'number',
        },
        storage: {
          describe: 'storage engine to use',
          default: 'level',
          demandOption: true,
          type: 'string',
          choices: [
            'level',
            'postgres',
            'cloudflare',
            'cloudflare-cluster',
            'firestore',
          ],
        },
        'db-path': {
          describe: 'path to LevelDB database',
          default: path.resolve(os.homedir(), '.livepeer', 'api'),
          type: 'string',
        },
        'postgres-url': {
          describe: 'url of a postgres database',
          type: 'string',
        },
        'cloudflare-namespace': {
          describe: 'namespace of a cloudflare database',
          type: 'string',
        },
        'cloudflare-account': {
          describe: 'account id of a cloudflare database',
          type: 'string',
        },
        'cloudflare-auth': {
          describe: 'auth of a cloudflare database',
          type: 'string',
        },
        'firestore-credentials': {
          describe:
            'JSON string of service account credentials for a GCP account',
          type: 'string',
        },
        'firestore-collection': {
          describe:
            'name of the top-level firestore collection for storing our data',
          type: 'string',
        },
        'client-id': {
          describe: 'google auth ID',
          type: 'string',
        },
        'trusted-domain': {
          describe: 'trusted google domain, example: livepeer.org',
          type: 'string',
        },
        'kube-namespace': {
          describe:
            "namespace of the Kubernetes cluster we're in. required for Kubernetes service discovery.",
          type: 'string',
        },
        'kube-broadcaster-service': {
          describe: 'name of the service we should look at for broadcasters.',
          type: 'string',
        },
        'kube-broadcaster-template': {
          describe:
            'template string of the form https://{{nodeName}}.example.com to give broadcasters external identity.',
          type: 'string',
          default: 'https://{{nodeName}}.livepeer.live',
        },
        'kube-orchestrator-service': {
          describe: 'name of the service we should look at for orchestrators.',
          type: 'string',
        },
        'kube-orchestrator-template': {
          describe:
            'template string of the form {{ip}} for the broadcaster webhook.',
          type: 'string',
          default: 'https://{{ip}}:8935',
        },
        'http-prefix': {
          describe: 'accept requests at this prefix',
          default: '/api',
          demandOption: true,
          type: 'string',
        },
        'fallback-proxy': {
          describe:
            'if a request would otherwise be a 404, send it here instead. useful for dev.',
          type: 'string',
        },
        'jwt-secret': {
          describe:
            'phrase used to sign JSON web token, a way to securely transmit information between parties',
          type: 'string',
        },
        'jwt-audience': {
          describe: 'identifies the recipients that the JWT is intended for',
          type: 'string',
        },
        broadcasters: {
          describe:
            'hardcoded list of broadcasters to return from /api/broadcaster.',
          type: 'string',
          default: '[]',
        },
        orchestrators: {
          describe:
            'hardcoded list of orchestrators to return from /api/orchestrator.',
          type: 'string',
          default: '[]',
        },
        supportAddr: {
          describe:
            'email address where outgoing emails originate. should be of the form name/email@example.com',
          type: 'string',
          coerce: supportAddr => {
            const split = supportAddr.split('/')
            if (split.length !== 2) {
              throw new Error(
                `supportAddr should be of the form name/email, got ${supportAddr}`,
              )
            }
            return split
          },
        },
        sendgridApiKey: {
          describe: 'sendgrid api key for sending emails',
          type: 'string',
        },
        sendgridTemplateId: {
          describe: 'sendgrid template id to use',
          type: 'string',
        },
        insecureTestToken: {
          describe:
            '[DO NOT USE EXCEPT FOR TESTING] token that test harness can use to bypass validation and access the database',
          type: 'string',
        },
        ingests: {
          describe:
            'list of ingest endpoints to use as options for /api/geolocate',
          type: 'string',
          default: '[]',
        },
      })
      .help()
      .parse(argv)
  )
}
