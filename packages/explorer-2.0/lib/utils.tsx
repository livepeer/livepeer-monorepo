import { Delegator, Round, UnbondingLock } from "../@types";
import Utils from "web3-utils";
import url from "url";
import parseDomain from "parse-domain";
import { ethers } from "ethers";
import { gql } from "@apollo/client";
import Numeral from "numeral";

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export const abbreviateNumber = (value, precision = 3) => {
  let newValue = value;
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = parseFloat(Number.parseFloat(newValue).toPrecision(precision));

  newValue += suffixes[suffixNum];
  return newValue;
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getDelegationStatusColor = (status) => {
  if (status == "Bonded") {
    return "primary";
  } else if (status == "Unbonding") {
    return "yellow";
  } else if (status == "Pending") {
    return "blue";
  } else {
    return "muted";
  }
};

export const getDelegatorStatus = (
  delegator: Delegator,
  currentRound: Round
): string => {
  if (!+delegator?.bondedAmount) {
    return "Unbonded";
  } else if (
    delegator.unbondingLocks.filter(
      (lock: UnbondingLock) =>
        lock.withdrawRound && lock.withdrawRound > parseInt(currentRound.id, 10)
    ).length > 0
  ) {
    return "Unbonding";
  } else if (delegator.startRound > parseInt(currentRound.id, 10)) {
    return "Pending";
  } else if (
    delegator.startRound > 0 &&
    delegator.startRound <= parseInt(currentRound.id, 10)
  ) {
    return "Bonded";
  } else {
    return "Unbonded";
  }
};

export const MAXIUMUM_VALUE_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const removeURLParameter = (url, parameter) => {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split("?");
  if (urlparts.length >= 2) {
    var prefix = encodeURIComponent(parameter) + "=";
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0; ) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
  }
  return url;
};

export const nl2br = (str, is_xhtml = true) => {
  if (typeof str === "undefined" || str === null) {
    return "";
  }
  var breakTag =
    is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
  return (str + "").replace(
    /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
    "$1" + breakTag + "$2"
  );
};

export const textTruncate = (str, length, ending) => {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

export const networksTypes = {
  1: "mainnet",
  2: "morden",
  3: "ropsten",
  42: "kovan",
  4: "rinkeby",
};

const networksIds = {
  main: 1,
  mainnet: 1,
  morden: 2,
  ropsten: 3,
  kovan: 42,
  rinkeby: 4,
};

export const detectNetwork = async (provider) => {
  let netId = null;

  if (provider instanceof Object) {
    // MetamaskInpageProvider
    if (
      provider.publicConfigStore &&
      provider.publicConfigStore._state &&
      provider.publicConfigStore._state.networkVersion
    ) {
      netId = provider.publicConfigStore._state.networkVersion;

      // Web3.providers.HttpProvider
    } else if (provider.host) {
      const parsed = url.parse(provider.host);
      const { subdomain, domain, tld } = parseDomain(parsed.host);

      if (domain === "infura" && tld === "io") {
        netId = networksIds[subdomain];
      }
    }
  } else if (typeof window !== "undefined" && window["web3"]) {
    if (window["web3"].version && window["web3"].version.getNetwork) {
      netId = await window["web3"].version.getNetwork();

      // web3.js v1.0+
    } else if (
      window["web3"].eth &&
      window["web3"].eth.net &&
      window["web3"].eth.net.getId
    ) {
      netId = await window["web3"].eth.net.getId();
    }
  }

  if (netId === undefined) {
    netId = null;
  }

  const type = networksTypes[netId] || "unknown";

  return {
    id: netId,
    type: type,
  };
};

export const checkAddressEquality = (address1, address2) => {
  if (!isAddress(address1) || !isAddress(address2)) {
    return false;
  }
  return (
    Utils.toChecksumAddress(address1) === Utils.toChecksumAddress(address2)
  );
};

export const txMessages = {
  approve: {
    pending: "Unlocking LPT",
    confirmed: "LPT Unlocked",
  },
  bond: {
    pending: "Staking LPT",
    confirmed: "LPT Staked",
  },
  unbond: {
    pending: "Unstaking LPT",
    confirmed: "LPT Unstaked",
  },
  rebond: {
    pending: "Restaking LPT",
    confirmed: "LPT Restaked",
  },
  rebondFromUnbonded: {
    pending: "Restaking LPT",
    confirmed: "LPT Restaked",
  },
  createPoll: {
    pending: "Creating Poll",
    confirmed: "Poll Created",
  },
  vote: {
    pending: "Casting Vote",
    confirmed: "Vote Casted",
  },
  withdrawFees: {
    pending: "Withdrawing Fees",
    confirmed: "Fees Withdrawn",
  },
  withdrawStake: {
    pending: "Withdrawing Stake",
    confirmed: "Stake Withdrawn",
  },
  batchClaimEarnings: {
    pending: "Claiming Earnings",
    confirmed: "Earnings Claimed",
  },
};

export const initTransaction = async (client, mutation) => {
  try {
    client.writeQuery({
      query: gql`
        query {
          txSummaryModal {
            __typename
            open
            error
          }
        }
      `,
      data: {
        txSummaryModal: {
          __typename: "TxSummaryModal",
          open: true,
          error: false,
        },
      },
    });

    await mutation();

    client.writeQuery({
      query: gql`
        query {
          txSummaryModal {
            __typename
            open
            error
          }
        }
      `,
      data: {
        txSummaryModal: {
          __typename: "TxSummaryModal",
          open: false,
          error: false,
        },
      },
    });
  } catch (e) {
    client.writeQuery({
      query: gql`
        query {
          txSummaryModal {
            __typename
            open
            error
          }
        }
      `,
      data: {
        txSummaryModal: {
          __typename: "TxSummaryModal",
          open: true,
          error: true,
        },
      },
    });

    return {
      error: e.message.replace("GraphQL error: ", ""),
    };
  }
};

export const getBlock = async () => {
  const blockDataResponse = await fetch(
    `https://${
      process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "api-rinkeby" : "api"
    }.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${
      process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }`
  );
  const { result } = await blockDataResponse.json();
  return Utils.hexToNumber(result);
};

export const getBlockByNumber = async (number) => {
  const blockDataResponse = await fetch(
    `https://${
      process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "api-rinkeby" : "api"
    }.etherscan.io/api?module=block&action=getblockreward&blockno=${number}&apikey=${
      process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }`
  );
  const { result } = await blockDataResponse.json();
  return result;
};

export const getEstimatedBlockCountdown = async (number) => {
  const countdownRaw = await fetch(
    `https://${
      process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "api-rinkeby" : "api"
    }.etherscan.io/api?module=block&action=getblockcountdown&blockno=${number}&apikey=${
      process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    }`
  );
  const { result } = await countdownRaw.json();
  return result;
};

export const expandedPriceLabels = {
  ["pixel"]: "pixel",
  ["1m pixels"]: "1 million pixels",
  ["1b pixels"]: "1 billion pixels",
  ["1t pixels"]: "1 trillion pixels",
};

export const mergeObjectsInUnique = (array, property) => {
  const newArray = new Map();

  array.forEach((item) => {
    const propertyValue = item[property];
    newArray.has(propertyValue)
      ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) })
      : newArray.set(propertyValue, item);
  });

  return Array.from(newArray.values());
};

export const getHint = (id, transcoders) => {
  let hint = {
    newPosPrev: EMPTY_ADDRESS,
    newPosNext: EMPTY_ADDRESS,
  };

  if (!transcoders.length || !id) {
    return hint;
  }

  const index = transcoders.findIndex(
    (t) => t.id.toLowerCase() === id.toLowerCase()
  );

  // if transcoder is not in active set return
  if (index < 0) {
    return hint;
  } else if (index === 0) {
    // if transcoder is the first in the active set, only set posNex
    hint.newPosNext = transcoders[index + 1].id;
  } else if (index === transcoders.length - 1) {
    // if transcoder is the last in the active set, only set posPrev
    hint.newPosPrev = transcoders[index - 1].id;
  } else {
    hint.newPosNext = transcoders[index + 1].id;
    hint.newPosPrev = transcoders[index - 1].id;
  }
  return hint;
};

export const simulateNewActiveSetOrder = ({
  action,
  transcoders,
  amount,
  newDelegate,
  oldDelegate = EMPTY_ADDRESS,
}) => {
  const index = transcoders.findIndex(
    (t) => t.id.toLowerCase() === newDelegate.toLowerCase()
  );

  if (index < 0) {
    return transcoders;
  }

  if (action === "stake") {
    transcoders[index].totalStake = +transcoders[index].totalStake + +amount;

    // if delegator is moving stake, subtract amount from old delegate
    if (
      oldDelegate &&
      oldDelegate.toLowerCase() != newDelegate.toLowerCase() &&
      oldDelegate.toLowerCase() != EMPTY_ADDRESS
    ) {
      const oldDelegateIndex = transcoders.findIndex(
        (t) => t.id.toLowerCase() === oldDelegate.toLowerCase()
      );
      if (oldDelegateIndex !== -1) {
        transcoders[oldDelegateIndex].totalStake =
          +transcoders[oldDelegateIndex].totalStake - +amount;
      }
    }
  } else {
    transcoders[index].totalStake = +transcoders[index].totalStake - +amount;
  }

  // reorder transcoders array
  return transcoders.sort((a, b) => +a.totalStake - +b.totalStake);
};

export const isAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
};

export const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const toK = (num) => {
  return Numeral(num).format("0.[00]a");
};

export const formattedNum = (number, unit = "usd", acceptNegatives = false) => {
  if (isNaN(number) || number === "" || number === undefined) {
    return unit === "usd" ? "$0" : 0;
  }
  let num = parseFloat(number);

  if (num > 500000000) {
    return `${
      (unit === "usd" ? "$" : "") + toK(num.toFixed(0)) + unit === "minutes"
        ? unit
        : ""
    }`;
  }

  if (num === 0) {
    if (unit === "usd") {
      return "$0";
    }
    if (unit === "minutes") {
      return "0 minutes";
    }
    return 0;
  }

  if (num < 0.0001 && num > 0) {
    if (unit === "usd") {
      return "< $0.0001";
    }
    if (unit === "minutes") {
      return "< 0.0001 minutes";
    }
    return "< 0.0001";
  }

  if (num > 1000) {
    if (unit === "usd") {
      return "$" + Number(num.toFixed(0)).toLocaleString();
    }
    if (unit === "minutes") {
      return Number(num.toFixed(0)).toLocaleString() + " minutes";
    }
    return Number(num.toFixed(0)).toLocaleString();
  }

  if (unit === "usd") {
    if (num < 0.1) {
      return "$" + Number(num.toFixed(4));
    } else {
      let usdString = priceFormatter.format(num);
      return "$" + usdString.slice(1, usdString.length);
    }
  }
  if (unit === "minutes") {
    if (num < 0.1) {
      return Number(num.toFixed(4)) + " minutes";
    } else {
      return Number(num.toFixed(0)) + " minutes";
    }
  }
  return Number(num.toFixed(5));
};

/**
 * gets the amount difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} valueAsOfPeriodOne
 * @param {*} valueAsOfPeriodTwo
 */
export const getTwoPeriodPercentChange = (
  valueNow: number,
  valueAsOfPeriodOne: number,
  valueAsOfPeriodTwo: number
) => {
  // get volume info for both 24 hour periods
  let currentChange = valueNow - valueAsOfPeriodOne;
  let previousChange = valueAsOfPeriodOne - valueAsOfPeriodTwo;

  const adjustedPercentChange =
    ((currentChange - previousChange) / previousChange) * 100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export const getBlocksFromTimestamps = async (timestamps) => {
  if (timestamps?.length === 0) {
    return [];
  }
  let blocks = [];
  for (const timestamp of timestamps) {
    let blockResponse = await fetch(
      `https://api${
        process.env.NEXT_PUBLIC_NETWORK === "rinkeby" ? "-rinkeby" : ""
      }.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${
        process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
      }`
    );
    let json = await blockResponse.json();
    blocks.push(+json.result);
  }

  return blocks;
};

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (valueNow, value24HoursAgo) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) /
      parseFloat(value24HoursAgo)) *
    100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};

type LivepeerComUsageParams = {
  fromTime: number;
  toTime: number;
};

export const getLivepeerComUsageData = async (
  params?: LivepeerComUsageParams
) => {
  try {
    let endpoint = `https://livepeer.com/api/usage${
      params ? `?fromTime=${params.fromTime}&toTime=${params.toTime}` : ""
    }`;

    const livepeerComUsageDataReponse = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_COM_API_ADMIN_TOKEN}`,
      },
    });

    const livepeerComUsageData = await livepeerComUsageDataReponse.json();

    // convert date format from milliseconds to seconds before merging
    return livepeerComUsageData.map((day) => ({
      ...day,
      date: day.date / 1000,
    }));
  } catch (e) {
    console.log(e);
  }
};

export const getTotalFeeDerivedMinutes = ({
  totalVolumeETH,
  totalVolumeUSD,
  pricePerPixel,
  pixelsPerMinute,
}): number => {
  let ethDaiRate = totalVolumeETH / totalVolumeUSD;
  let usdAveragePricePerPixel = pricePerPixel / ethDaiRate;
  let feeDerivedMinutes =
    totalVolumeUSD / usdAveragePricePerPixel / pixelsPerMinute || 0;
  return feeDerivedMinutes;
};
