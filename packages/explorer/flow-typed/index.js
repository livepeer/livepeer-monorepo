declare type Account = {
  broadcaster: Broadcaster,
  delegator: Delegator,
  ensName: string,
  ethBalance: string,
  id: string,
  tokenBalance: string,
  transcoder: Transcoder,
}

declare type Broadcaster = {
  deposit: string,
  jobs: Array<Job>,
  withdrawBlock: string,
}

declare type Coinbase = {
  coinbase: string,
}

declare type Delegator = {
  allowance: string,
  bondedAmount: string,
  id: string,
  delegateAddress: string,
  delegatedAmount: string,
  fees: string,
  lastClaimRound: string,
  pendingStake: string,
  pendingFees: string,
  startRound: string,
  status: string,
  withdrawAmount: string,
  withdrawRound: string,
  nextUnbondingLockId: string,
}

declare type Job = {
  id: string,
  broadcaster: string,
  profiles: Array<JobProfile>,
  streamId: string,
}

declare type JobProfile = {
  name: string,
  bitrate: number,
  framerate: number,
  resolution: string,
}

declare type Round = {
  id: string,
  initialized: boolean,
  lastInitializedRound: string,
  length: string,
  startBlock: string,
}

declare type Transcoder = {
  active: boolean,
  feeShare: string,
  id: string,
  lastRewardRound: string,
  pricePerSegment: string,
  pendingRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  rewardCut: string,
  status: string,
  totalStake: string,
}

declare type TxReceipt = {
  blockHash: string,
  blockNumber: string,
  contractAddress: string | void,
  cumulativeGasUsed: string,
  from: string,
  gasUsed: string,
  logs: string[],
  logsBloom: string,
  status: string,
  to: string,
  transactionHash: string,
  transactionIndex: string,
}

declare type TxObject = {
  blockHash: string,
  blockNumber: string,
  from: string,
  gas: string,
  gasPrice: string,
  hash: string,
  input: string,
  nonce: string,
  to: string,
  transactionIndex: string,
  value: string,
  v: string,
  r: string,
  s: string,
}

declare type GraphQLProps<D> = {
  data: D,
  error: Error | void,
  fetchMore: any => void,
  loading: boolean,
  refetch: any => void,
}

declare type History = {
  location: Location,
  push: (url: string) => void,
  replace: (url: string) => void,
}

declare type Match = {
  isExact: boolean,
  params: Object,
  path: string,
  url: string,
}

declare type MatchMap = {
  [key: string]: Match,
}

declare type Location = {
  hash: string,
  key: string,
  pathname: string,
  search: string,
  state: Object | void,
}

declare class TransactionStatus {
  /** info about the contract and method */
  abi: Object;
  /** is the transaction currently being created */
  active: boolean;
  /** transaction receipt is available */
  done: boolean;
  /** any errors that result from submitting the transaction */
  error: Error | void;
  /** hash of the actual transaction object */
  hash: string | void;
  /** identifier for this transaction */
  id: string;
  /** any meta information related to the transaction */
  meta: any;
  /** has the transaction been submitted */
  submitted: boolean;
  /** type of TransactionStatus (could be useful for serialization) */
  type: string;
  /** TransactionStatus constructor */
  constructor(props: Object): TransactionStatus;
  /** clones TransactionStatus and merges props */
  merge(props: Object | TransactionStatus): TransactionStatus;
  /** given a type and props, returns a new TransactionStatus */
  static create(type: string, props: Object): TransactionStatus;
}
