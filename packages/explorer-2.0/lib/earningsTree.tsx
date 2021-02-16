// https://github.com/livepeer/merkle-earnings-cli/blob/master/src/tree/index.ts

const { keccak256, bufferToHex } = require("ethereumjs-util");
import { utils } from "ethers";

export interface IMerkleTree {
  elements: Array<any>;
  layers: Array<any>;
}

export class MerkleTree implements IMerkleTree {
  constructor(elements) {
    // Filter empty strings and hash elements
    this.elements = elements.filter((el) => el).map((el) => keccak256(el));

    // Deduplicate elements
    this.elements = this.bufDedup(this.elements);
    // Sort elements
    this.elements.sort(Buffer.compare);

    // Create layers
    this.layers = this.getLayers(this.elements);
  }

  elements: any[];
  layers: any[];

  getLayers(elements) {
    if (elements.length === 0) {
      return [[""]];
    }

    const layers: Array<any> = [];
    layers.push(elements);

    // Get next layer until we reach the root
    while (layers[layers.length - 1].length > 1) {
      layers.push(this.getNextLayer(layers[layers.length - 1]));
    }

    return layers;
  }

  getNextLayer(elements) {
    return elements.reduce((layer, el, idx, arr) => {
      if (idx % 2 === 0) {
        // Hash the current element with its pair element
        layer.push(this.combinedHash(el, arr[idx + 1]));
      }

      return layer;
    }, []);
  }

  combinedHash(first, second) {
    if (!first) {
      return second;
    }
    if (!second) {
      return first;
    }

    return keccak256(this.sortAndConcat(first, second));
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0];
  }

  getHexRoot() {
    return bufferToHex(this.getRoot());
  }

  getProof(el) {
    let idx = this.bufIndexOf(el, this.elements);

    if (idx === -1) {
      throw new Error("Element does not exist in Merkle tree");
    }

    return this.layers.reduce((proof, layer) => {
      const pairElement = this.getPairElement(idx, layer);

      if (pairElement) {
        proof.push(pairElement);
      }

      idx = Math.floor(idx / 2);

      return proof;
    }, []);
  }

  getHexProof(el) {
    const proof = this.getProof(el);

    return this.bufArrToHexArr(proof);
  }

  getPairElement(idx, layer) {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;

    if (pairIdx < layer.length) {
      return layer[pairIdx];
    } else {
      return null;
    }
  }

  bufIndexOf(el, arr) {
    let hash;

    // Convert element to 32 byte hash if it is not one already
    if (el.length !== 32 || !Buffer.isBuffer(el)) {
      hash = keccak256(el);
    } else {
      hash = el;
    }

    for (let i = 0; i < arr.length; i++) {
      if (hash.equals(arr[i])) {
        return i;
      }
    }

    return -1;
  }

  bufDedup(elements) {
    return elements.filter((el, idx) => {
      return this.bufIndexOf(el, elements) === idx;
    });
  }

  bufArrToHexArr(arr) {
    if (arr.some((el) => !Buffer.isBuffer(el))) {
      throw new Error("Array is not an array of buffers");
    }

    return arr.map((el) => "0x" + el.toString("hex"));
  }

  sortAndConcat(...args) {
    return Buffer.concat([...args].sort(Buffer.compare));
  }
}

export interface IEarningsTree extends MerkleTree {
  leaves: Array<string>;
}

export class EarningsTree extends MerkleTree implements IEarningsTree {
  constructor(delegators) {
    const leaves = delegators.map((d) =>
      utils.defaultAbiCoder.encode(
        ["address", "uint256", "uint256"],
        [d.delegator, d.pendingStake, d.pendingFees]
      )
    );
    super(leaves);
    this.leaves = leaves;
  }

  leaves: string[];

  static fromJSON(json: string) {
    const leaves = JSON.parse(json);
    const thisClass = Object.create(this.prototype);
    // Filter empty strings and hash elements
    let elements = leaves.filter((el) => el).map((el) => keccak256(el));

    // Deduplicate elements
    elements = thisClass.bufDedup(elements);
    // Sort elements
    thisClass.elements = elements.sort(Buffer.compare);

    // Create layers
    thisClass.layers = thisClass.getLayers(elements);

    return thisClass;
  }

  toJSON() {
    return JSON.stringify(this.leaves);
  }
}
