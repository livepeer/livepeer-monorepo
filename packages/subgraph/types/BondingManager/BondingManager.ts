import {
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class TranscoderUpdate extends EthereumEvent {
  get params(): TranscoderUpdateParams {
    return new TranscoderUpdateParams(this);
  }
}

export class TranscoderUpdateParams {
  _event: TranscoderUpdate;

  constructor(event: TranscoderUpdate) {
    this._event = event;
  }

  get transcoder(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get pendingRewardCut(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pendingFeeShare(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get pendingPricePerSegment(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get registered(): boolean {
    return this._event.parameters[4].value.toBoolean();
  }
}

export class TranscoderEvicted extends EthereumEvent {
  get params(): TranscoderEvictedParams {
    return new TranscoderEvictedParams(this);
  }
}

export class TranscoderEvictedParams {
  _event: TranscoderEvicted;

  constructor(event: TranscoderEvicted) {
    this._event = event;
  }

  get transcoder(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TranscoderResigned extends EthereumEvent {
  get params(): TranscoderResignedParams {
    return new TranscoderResignedParams(this);
  }
}

export class TranscoderResignedParams {
  _event: TranscoderResigned;

  constructor(event: TranscoderResigned) {
    this._event = event;
  }

  get transcoder(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TranscoderSlashed extends EthereumEvent {
  get params(): TranscoderSlashedParams {
    return new TranscoderSlashedParams(this);
  }
}

export class TranscoderSlashedParams {
  _event: TranscoderSlashed;

  constructor(event: TranscoderSlashed) {
    this._event = event;
  }

  get transcoder(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get finder(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get penalty(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get finderReward(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Reward extends EthereumEvent {
  get params(): RewardParams {
    return new RewardParams(this);
  }
}

export class RewardParams {
  _event: Reward;

  constructor(event: Reward) {
    this._event = event;
  }

  get transcoder(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Bond extends EthereumEvent {
  get params(): BondParams {
    return new BondParams(this);
  }
}

export class BondParams {
  _event: Bond;

  constructor(event: Bond) {
    this._event = event;
  }

  get newDelegate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oldDelegate(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get delegator(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get additionalAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get bondedAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Unbond extends EthereumEvent {
  get params(): UnbondParams {
    return new UnbondParams(this);
  }
}

export class UnbondParams {
  _event: Unbond;

  constructor(event: Unbond) {
    this._event = event;
  }

  get delegate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get delegator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get unbondingLockId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get withdrawRound(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Rebond extends EthereumEvent {
  get params(): RebondParams {
    return new RebondParams(this);
  }
}

export class RebondParams {
  _event: Rebond;

  constructor(event: Rebond) {
    this._event = event;
  }

  get delegate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get delegator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get unbondingLockId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WithdrawStake extends EthereumEvent {
  get params(): WithdrawStakeParams {
    return new WithdrawStakeParams(this);
  }
}

export class WithdrawStakeParams {
  _event: WithdrawStake;

  constructor(event: WithdrawStake) {
    this._event = event;
  }

  get delegator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get unbondingLockId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get withdrawRound(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WithdrawFees extends EthereumEvent {
  get params(): WithdrawFeesParams {
    return new WithdrawFeesParams(this);
  }
}

export class WithdrawFeesParams {
  _event: WithdrawFees;

  constructor(event: WithdrawFees) {
    this._event = event;
  }

  get delegator(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class SetController extends EthereumEvent {
  get params(): SetControllerParams {
    return new SetControllerParams(this);
  }
}

export class SetControllerParams {
  _event: SetController;

  constructor(event: SetController) {
    this._event = event;
  }

  get controller(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class ParameterUpdate extends EthereumEvent {
  get params(): ParameterUpdateParams {
    return new ParameterUpdateParams(this);
  }
}

export class ParameterUpdateParams {
  _event: ParameterUpdate;

  constructor(event: ParameterUpdate) {
    this._event = event;
  }

  get param(): string {
    return this._event.parameters[0].value.toString();
  }
}

export class BondingManager__getTranscoderEarningsPoolForRoundResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;
  value7: BigInt;
  value8: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt,
    value7: BigInt,
    value8: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
    this.value8 = value8;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromUnsignedBigInt(this.value0));
    map.set("value1", EthereumValue.fromUnsignedBigInt(this.value1));
    map.set("value2", EthereumValue.fromUnsignedBigInt(this.value2));
    map.set("value3", EthereumValue.fromUnsignedBigInt(this.value3));
    map.set("value4", EthereumValue.fromUnsignedBigInt(this.value4));
    map.set("value5", EthereumValue.fromUnsignedBigInt(this.value5));
    map.set("value6", EthereumValue.fromUnsignedBigInt(this.value6));
    map.set("value7", EthereumValue.fromUnsignedBigInt(this.value7));
    map.set("value8", EthereumValue.fromBoolean(this.value8));
    return map;
  }
}

export class BondingManager__getDelegatorUnbondingLockResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromUnsignedBigInt(this.value0));
    map.set("value1", EthereumValue.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class BondingManager__getTranscoderResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromUnsignedBigInt(this.value0));
    map.set("value1", EthereumValue.fromUnsignedBigInt(this.value1));
    map.set("value2", EthereumValue.fromUnsignedBigInt(this.value2));
    map.set("value3", EthereumValue.fromUnsignedBigInt(this.value3));
    map.set("value4", EthereumValue.fromUnsignedBigInt(this.value4));
    map.set("value5", EthereumValue.fromUnsignedBigInt(this.value5));
    map.set("value6", EthereumValue.fromUnsignedBigInt(this.value6));
    return map;
  }
}

export class BondingManager__getDelegatorResult {
  value0: BigInt;
  value1: BigInt;
  value2: Address;
  value3: BigInt;
  value4: BigInt;
  value5: BigInt;
  value6: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: Address,
    value3: BigInt,
    value4: BigInt,
    value5: BigInt,
    value6: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromUnsignedBigInt(this.value0));
    map.set("value1", EthereumValue.fromUnsignedBigInt(this.value1));
    map.set("value2", EthereumValue.fromAddress(this.value2));
    map.set("value3", EthereumValue.fromUnsignedBigInt(this.value3));
    map.set("value4", EthereumValue.fromUnsignedBigInt(this.value4));
    map.set("value5", EthereumValue.fromUnsignedBigInt(this.value5));
    map.set("value6", EthereumValue.fromUnsignedBigInt(this.value6));
    return map;
  }
}

export class BondingManager extends SmartContract {
  static bind(address: Address): BondingManager {
    return new BondingManager("BondingManager", address);
  }

  maxEarningsClaimsRounds(): BigInt {
    let result = super.call("maxEarningsClaimsRounds", []);
    return result[0].toBigInt();
  }

  isValidUnbondingLock(_delegator: Address, _unbondingLockId: BigInt): boolean {
    let result = super.call("isValidUnbondingLock", [
      EthereumValue.fromAddress(_delegator),
      EthereumValue.fromUnsignedBigInt(_unbondingLockId)
    ]);
    return result[0].toBoolean();
  }

  delegatorStatus(_delegator: Address): i32 {
    let result = super.call("delegatorStatus", [
      EthereumValue.fromAddress(_delegator)
    ]);
    return result[0].toI32();
  }

  getNextTranscoderInPool(_transcoder: Address): Address {
    let result = super.call("getNextTranscoderInPool", [
      EthereumValue.fromAddress(_transcoder)
    ]);
    return result[0].toAddress();
  }

  getTranscoderEarningsPoolForRound(
    _transcoder: Address,
    _round: BigInt
  ): BondingManager__getTranscoderEarningsPoolForRoundResult {
    let result = super.call("getTranscoderEarningsPoolForRound", [
      EthereumValue.fromAddress(_transcoder),
      EthereumValue.fromUnsignedBigInt(_round)
    ]);
    return new BondingManager__getTranscoderEarningsPoolForRoundResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt(),
      result[7].toBigInt(),
      result[8].toBoolean()
    );
  }

  getTranscoderPoolSize(): BigInt {
    let result = super.call("getTranscoderPoolSize", []);
    return result[0].toBigInt();
  }

  activeTranscoderSet(param0: BigInt): BigInt {
    let result = super.call("activeTranscoderSet", [
      EthereumValue.fromUnsignedBigInt(param0)
    ]);
    return result[0].toBigInt();
  }

  getDelegatorUnbondingLock(
    _delegator: Address,
    _unbondingLockId: BigInt
  ): BondingManager__getDelegatorUnbondingLockResult {
    let result = super.call("getDelegatorUnbondingLock", [
      EthereumValue.fromAddress(_delegator),
      EthereumValue.fromUnsignedBigInt(_unbondingLockId)
    ]);
    return new BondingManager__getDelegatorUnbondingLockResult(
      result[0].toBigInt(),
      result[1].toBigInt()
    );
  }

  targetContractId(): Bytes {
    let result = super.call("targetContractId", []);
    return result[0].toBytes();
  }

  getTranscoderPoolMaxSize(): BigInt {
    let result = super.call("getTranscoderPoolMaxSize", []);
    return result[0].toBigInt();
  }

  getTotalBonded(): BigInt {
    let result = super.call("getTotalBonded", []);
    return result[0].toBigInt();
  }

  getTranscoder(_transcoder: Address): BondingManager__getTranscoderResult {
    let result = super.call("getTranscoder", [
      EthereumValue.fromAddress(_transcoder)
    ]);
    return new BondingManager__getTranscoderResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt()
    );
  }

  numActiveTranscoders(): BigInt {
    let result = super.call("numActiveTranscoders", []);
    return result[0].toBigInt();
  }

  isRegisteredTranscoder(_transcoder: Address): boolean {
    let result = super.call("isRegisteredTranscoder", [
      EthereumValue.fromAddress(_transcoder)
    ]);
    return result[0].toBoolean();
  }

  unbondingPeriod(): BigInt {
    let result = super.call("unbondingPeriod", []);
    return result[0].toBigInt();
  }

  getTotalActiveStake(_round: BigInt): BigInt {
    let result = super.call("getTotalActiveStake", [
      EthereumValue.fromUnsignedBigInt(_round)
    ]);
    return result[0].toBigInt();
  }

  isActiveTranscoder(_transcoder: Address, _round: BigInt): boolean {
    let result = super.call("isActiveTranscoder", [
      EthereumValue.fromAddress(_transcoder),
      EthereumValue.fromUnsignedBigInt(_round)
    ]);
    return result[0].toBoolean();
  }

  getFirstTranscoderInPool(): Address {
    let result = super.call("getFirstTranscoderInPool", []);
    return result[0].toAddress();
  }

  transcoderStatus(_transcoder: Address): i32 {
    let result = super.call("transcoderStatus", [
      EthereumValue.fromAddress(_transcoder)
    ]);
    return result[0].toI32();
  }

  electActiveTranscoder(
    _maxPricePerSegment: BigInt,
    _blockHash: Bytes,
    _round: BigInt
  ): Address {
    let result = super.call("electActiveTranscoder", [
      EthereumValue.fromUnsignedBigInt(_maxPricePerSegment),
      EthereumValue.fromFixedBytes(_blockHash),
      EthereumValue.fromUnsignedBigInt(_round)
    ]);
    return result[0].toAddress();
  }

  pendingStake(_delegator: Address, _endRound: BigInt): BigInt {
    let result = super.call("pendingStake", [
      EthereumValue.fromAddress(_delegator),
      EthereumValue.fromUnsignedBigInt(_endRound)
    ]);
    return result[0].toBigInt();
  }

  transcoderTotalStake(_transcoder: Address): BigInt {
    let result = super.call("transcoderTotalStake", [
      EthereumValue.fromAddress(_transcoder)
    ]);
    return result[0].toBigInt();
  }

  getDelegator(_delegator: Address): BondingManager__getDelegatorResult {
    let result = super.call("getDelegator", [
      EthereumValue.fromAddress(_delegator)
    ]);
    return new BondingManager__getDelegatorResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toBigInt(),
      result[5].toBigInt(),
      result[6].toBigInt()
    );
  }

  activeTranscoderTotalStake(_transcoder: Address, _round: BigInt): BigInt {
    let result = super.call("activeTranscoderTotalStake", [
      EthereumValue.fromAddress(_transcoder),
      EthereumValue.fromUnsignedBigInt(_round)
    ]);
    return result[0].toBigInt();
  }

  pendingFees(_delegator: Address, _endRound: BigInt): BigInt {
    let result = super.call("pendingFees", [
      EthereumValue.fromAddress(_delegator),
      EthereumValue.fromUnsignedBigInt(_endRound)
    ]);
    return result[0].toBigInt();
  }

  controller(): Address {
    let result = super.call("controller", []);
    return result[0].toAddress();
  }
}
