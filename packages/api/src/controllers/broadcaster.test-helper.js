import { thing } from './broadcaster'

thing()
  .then(x => console.log(x))
  .catch(e => console.log(e))
