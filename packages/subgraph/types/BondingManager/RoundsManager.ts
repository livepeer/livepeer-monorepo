import {
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  I128,
  U128,
  I256,
  U256,
  H256
} from "@graphprotocol/graph-ts";

export class NewRound extends EthereumEvent {
  get params(): NewRoundParams {
    return new NewRoundParams(this);
  }
}

export class NewRoundParams {
  _event: NewRound;

  constructor(event: NewRound) {
    this._event = event;
  }

  get round(): U256 {
    return this._event.parameters[0].value.toU256();
  }
}

export class RoundsManager extends SmartContract {
  static bind(address: Address): RoundsManager {
    return new RoundsManager("RoundsManager", address);
  }

  lastRoundLengthUpdateRound(): U256 {
    let result = super.call("lastRoundLengthUpdateRound", []);
    return result[0].toU256();
  }

  targetContractId(): Bytes {
    let result = super.call("targetContractId", []);
    return result[0].toBytes();
  }

  lastRoundLengthUpdateStartBlock(): U256 {
    let result = super.call("lastRoundLengthUpdateStartBlock", []);
    return result[0].toU256();
  }

  lastInitializedRound(): U256 {
    let result = super.call("lastInitializedRound", []);
    return result[0].toU256();
  }

  roundLength(): U256 {
    let result = super.call("roundLength", []);
    return result[0].toU256();
  }

  roundLockAmount(): U256 {
    let result = super.call("roundLockAmount", []);
    return result[0].toU256();
  }

  controller(): Address {
    let result = super.call("controller", []);
    return result[0].toAddress();
  }

  blockNum(): U256 {
    let result = super.call("blockNum", []);
    return result[0].toU256();
  }

  blockHash(_block: U256): Bytes {
    let result = super.call("blockHash", [EthereumValue.fromU256(_block)]);
    return result[0].toBytes();
  }

  currentRound(): U256 {
    let result = super.call("currentRound", []);
    return result[0].toU256();
  }

  currentRoundStartBlock(): U256 {
    let result = super.call("currentRoundStartBlock", []);
    return result[0].toU256();
  }

  currentRoundInitialized(): boolean {
    let result = super.call("currentRoundInitialized", []);
    return result[0].toBoolean();
  }

  currentRoundLocked(): boolean {
    let result = super.call("currentRoundLocked", []);
    return result[0].toBoolean();
  }
}
