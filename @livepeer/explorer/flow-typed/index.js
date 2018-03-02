declare type Delegator = {
  status: string,
  delegateAddress: string,
  bondedAmount: string,
  fees: string,
  delegatedAmount: string,
  lastClaimRound: string,
  startRound: string,
  withdrawRound: string,
}

declare type Account = {
  id: string,
  ethBalance: string,
  tokenBalance: string,
  delegator: Delegator,
}

declare type JobProfile = {
  name: string,
  bitrate: number,
  framerate: number,
  resolution: string,
}

declare type Job = {
  id: string,
  broadcaster: string,
  profiles: Array<JobProfile>,
  streamId: string,
}

declare type Broadcaster = {
  deposit: string,
  jobs: Array<Job>,
  withdrawBlock: string,
}

declare type Transcoder = {
  id: string,
  active: boolean,
  status: string,
  lastRewardRound: string,
  rewardCut: string,
  feeShare: string,
  pricePerSegment: string,
  pendingRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
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
  location: {
    search: string,
  },
  push: (url: string) => void,
  replace: (url: string) => void,
}

declare type Match = {
  path: string,
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
