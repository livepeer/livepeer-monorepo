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

  get round(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class RoundsManager extends SmartContract {
  static bind(address: Address): RoundsManager {
    return new RoundsManager("RoundsManager", address);
  }

  lastRoundLengthUpdateRound(): BigInt {
    let result = super.call("lastRoundLengthUpdateRound", []);
    return result[0].toBigInt();
  }

  targetContractId(): Bytes {
    let result = super.call("targetContractId", []);
    return result[0].toBytes();
  }

  lastRoundLengthUpdateStartBlock(): BigInt {
    let result = super.call("lastRoundLengthUpdateStartBlock", []);
    return result[0].toBigInt();
  }

  lastInitializedRound(): BigInt {
    let result = super.call("lastInitializedRound", []);
    return result[0].toBigInt();
  }

  roundLength(): BigInt {
    let result = super.call("roundLength", []);
    return result[0].toBigInt();
  }

  roundLockAmount(): BigInt {
    let result = super.call("roundLockAmount", []);
    return result[0].toBigInt();
  }

  controller(): Address {
    let result = super.call("controller", []);
    return result[0].toAddress();
  }

  blockNum(): BigInt {
    let result = super.call("blockNum", []);
    return result[0].toBigInt();
  }

  blockHash(_block: BigInt): Bytes {
    let result = super.call("blockHash", [
      EthereumValue.fromUnsignedBigInt(_block)
    ]);
    return result[0].toBytes();
  }

  currentRound(): BigInt {
    let result = super.call("currentRound", []);
    return result[0].toBigInt();
  }

  currentRoundStartBlock(): BigInt {
    let result = super.call("currentRoundStartBlock", []);
    return result[0].toBigInt();
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
