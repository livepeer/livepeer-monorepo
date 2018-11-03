import {
  TypedMap,
  Entity,
  Value,
  Address,
  Bytes,
  BigInt
} from "@graphprotocol/graph-ts";

export class Transcoder extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get active(): boolean | null {
    let value = this.get("active");
    if (value === null) {
      return false;
    } else {
      return value.toBoolean() as boolean | null;
    }
  }

  set active(value: boolean | null) {
    if (value === null) {
      this.unset("active");
    } else {
      this.set("active", Value.fromBoolean(value as boolean));
    }
  }

  get ensName(): string | null {
    let value = this.get("ensName");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string | null;
    }
  }

  set ensName(value: string | null) {
    if (value === null) {
      this.unset("ensName");
    } else {
      this.set("ensName", Value.fromString(value as string));
    }
  }

  get status(): string | null {
    let value = this.get("status");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string | null;
    }
  }

  set status(value: string | null) {
    if (value === null) {
      this.unset("status");
    } else {
      this.set("status", Value.fromString(value as string));
    }
  }

  get lastRewardRound(): BigInt | null {
    let value = this.get("lastRewardRound");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set lastRewardRound(value: BigInt | null) {
    if (value === null) {
      this.unset("lastRewardRound");
    } else {
      this.set("lastRewardRound", Value.fromBigInt(value as BigInt));
    }
  }

  get rewardCut(): BigInt | null {
    let value = this.get("rewardCut");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set rewardCut(value: BigInt | null) {
    if (value === null) {
      this.unset("rewardCut");
    } else {
      this.set("rewardCut", Value.fromBigInt(value as BigInt));
    }
  }

  get feeShare(): BigInt | null {
    let value = this.get("feeShare");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set feeShare(value: BigInt | null) {
    if (value === null) {
      this.unset("feeShare");
    } else {
      this.set("feeShare", Value.fromBigInt(value as BigInt));
    }
  }

  get pricePerSegment(): BigInt | null {
    let value = this.get("pricePerSegment");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set pricePerSegment(value: BigInt | null) {
    if (value === null) {
      this.unset("pricePerSegment");
    } else {
      this.set("pricePerSegment", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingRewardCut(): BigInt | null {
    let value = this.get("pendingRewardCut");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set pendingRewardCut(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingRewardCut");
    } else {
      this.set("pendingRewardCut", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingFeeShare(): BigInt | null {
    let value = this.get("pendingFeeShare");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set pendingFeeShare(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingFeeShare");
    } else {
      this.set("pendingFeeShare", Value.fromBigInt(value as BigInt));
    }
  }

  get pendingPricePerSegment(): BigInt | null {
    let value = this.get("pendingPricePerSegment");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set pendingPricePerSegment(value: BigInt | null) {
    if (value === null) {
      this.unset("pendingPricePerSegment");
    } else {
      this.set("pendingPricePerSegment", Value.fromBigInt(value as BigInt));
    }
  }

  get totalStake(): BigInt | null {
    let value = this.get("totalStake");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set totalStake(value: BigInt | null) {
    if (value === null) {
      this.unset("totalStake");
    } else {
      this.set("totalStake", Value.fromBigInt(value as BigInt));
    }
  }

  get rewards(): Array<string> | null {
    let value = this.get("rewards");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray() as Array<string> | null;
    }
  }

  set rewards(value: Array<string> | null) {
    if (value === null) {
      this.unset("rewards");
    } else {
      this.set("rewards", Value.fromStringArray(value as Array<string>));
    }
  }
}

export class Reward extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get round(): string | null {
    let value = this.get("round");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string | null;
    }
  }

  set round(value: string | null) {
    if (value === null) {
      this.unset("round");
    } else {
      this.set("round", Value.fromString(value as string));
    }
  }

  get transcoder(): string | null {
    let value = this.get("transcoder");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string | null;
    }
  }

  set transcoder(value: string | null) {
    if (value === null) {
      this.unset("transcoder");
    } else {
      this.set("transcoder", Value.fromString(value as string));
    }
  }

  get rewardTokens(): BigInt | null {
    let value = this.get("rewardTokens");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set rewardTokens(value: BigInt | null) {
    if (value === null) {
      this.unset("rewardTokens");
    } else {
      this.set("rewardTokens", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Round extends Entity {
  get id(): string {
    let value = this.get("id");
    if (value === null) {
      return null;
    } else {
      return value.toString() as string;
    }
  }

  set id(value: string) {
    if (value === null) {
      this.unset("id");
    } else {
      this.set("id", Value.fromString(value as string));
    }
  }

  get initialized(): boolean | null {
    let value = this.get("initialized");
    if (value === null) {
      return false;
    } else {
      return value.toBoolean() as boolean | null;
    }
  }

  set initialized(value: boolean | null) {
    if (value === null) {
      this.unset("initialized");
    } else {
      this.set("initialized", Value.fromBoolean(value as boolean));
    }
  }

  get length(): BigInt | null {
    let value = this.get("length");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set length(value: BigInt | null) {
    if (value === null) {
      this.unset("length");
    } else {
      this.set("length", Value.fromBigInt(value as BigInt));
    }
  }

  get lastInitializedRound(): BigInt | null {
    let value = this.get("lastInitializedRound");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set lastInitializedRound(value: BigInt | null) {
    if (value === null) {
      this.unset("lastInitializedRound");
    } else {
      this.set("lastInitializedRound", Value.fromBigInt(value as BigInt));
    }
  }

  get startBlock(): BigInt | null {
    let value = this.get("startBlock");
    if (value === null) {
      return null;
    } else {
      return value.toBigInt() as BigInt | null;
    }
  }

  set startBlock(value: BigInt | null) {
    if (value === null) {
      this.unset("startBlock");
    } else {
      this.set("startBlock", Value.fromBigInt(value as BigInt));
    }
  }

  get rewards(): Array<string> | null {
    let value = this.get("rewards");
    if (value === null) {
      return null;
    } else {
      return value.toStringArray() as Array<string> | null;
    }
  }

  set rewards(value: Array<string> | null) {
    if (value === null) {
      this.unset("rewards");
    } else {
      this.set("rewards", Value.fromStringArray(value as Array<string>));
    }
  }
}
