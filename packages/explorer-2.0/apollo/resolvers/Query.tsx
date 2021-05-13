import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";
import {
  getTwoPeriodPercentChange,
  getBlocksFromTimestamps,
  getLivepeerComUsageData,
  getPercentChange,
  getTotalFeeDerivedMinutes,
} from "../../lib/utils";
import dayDataQuery from "../../queries/days.gql";
import protocolDataByBlockQuery from "../../queries/protocolDataByBlock.gql";
import protocolDataQuery from "../../queries/protocolData.gql";
import { client } from "../";

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

export async function account(_obj, _args, _ctx, _info) {
  return {
    id: _args.id,
    tokenBalance: async () => {
      return await _ctx.livepeer.rpc.getTokenBalance(_args.id.toLowerCase());
    },
    ethBalance: async () => {
      return await _ctx.livepeer.rpc.getEthBalance(_args.id.toLowerCase());
    },
    allowance: async () => {
      return await _ctx.livepeer.rpc.getBondingManagerAllowance(
        _args.id.toLowerCase()
      );
    },
    pollCreatorAllowance: async () => {
      return await _ctx.livepeer.rpc.getPollCreatorAllowance(
        _args.id.toLowerCase()
      );
    },
  };
}

export async function getTxReceiptStatus(_obj, _args, _ctx, _info) {
  const Utils = require("web3-utils");
  const txReceipt = await _ctx.livepeer.utils.getTxReceipt(
    _args.txHash,
    _ctx.livepeer.config.eth
  );
  return {
    status: Utils.hexToNumber(txReceipt.status),
  };
}

export async function transaction(_obj, _args, _ctx, _info) {
  return await _ctx.library.getTransaction(_args.txHash);
}

export async function txPrediction(_obj, _args, _ctx, _info) {
  const response = await fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${_args.gasPrice}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
  );
  return await response.json();
}

export async function threeBoxSpace(_obj, _args, _ctx, _info) {
  const Utils = require("web3-utils");
  const { validateLink } = require("3id-blockchain-utils");
  const Box = require("3box");
  const id = _args.id.toLowerCase();

  let useThreeBox = false;
  const profile = await Box.getProfile(_args.id);
  const space = await Box.getSpace(_args.id, "livepeer");

  if (space.defaultProfile === "3box") {
    useThreeBox = true;
  }

  let addressLinks = [];
  if (Object.entries(space).length) {
    try {
      const conf = await Box.getConfig(id);
      const links = await Promise.all(
        conf.links.map((link) => validateLink(link))
      );
      addressLinks = links.filter((link: any) => {
        return (
          link &&
          Utils.toChecksumAddress(link.address) !== Utils.toChecksumAddress(id)
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  const { did } = await Box.getVerifiedAccounts(profile);
  return {
    id,
    name: useThreeBox ? profile?.name : space?.name,
    website: useThreeBox ? profile?.website : space?.website,
    description: useThreeBox ? profile?.description : space?.description,
    image: useThreeBox
      ? profile?.image?.length
        ? profile?.image[0].contentUrl["/"]
        : ""
      : space?.image,
    defaultProfile: space?.defaultProfile,
    addressLinks,
    did,
  };
}

export async function block(_obj, _args, _ctx, _info) {
  const { number: blockNumber } = await _ctx.livepeer.rpc.getBlock("latest");
  return {
    number: blockNumber,
  };
}

export async function getChartData(_obj?, _args?, _ctx?, _info?) {
  const data = {
    dayData: [],
    weeklyData: [],
    totalVolumeUSD: 0,
    totalVolumeETH: 0,
    totalUsage: 0,
    participationRate: 0,
    oneDayVolumeUSD: 0,
    oneWeekVolumeUSD: 0,
    oneWeekVolumeETH: 0,
    oneWeekUsage: 0,
    weeklyVolumeChangeUSD: 0,
    weeklyUsageChange: 0,
    volumeChangeUSD: 0,
    participationRateChange: 0,
  };

  let dayData = [];
  const weeklyData = [];
  let oneDayData = {
    totalVolumeUSD: 0,
    participationRate: 0,
  };
  let twoDayData = {
    totalVolumeUSD: 0,
    participationRate: 0,
  };

  // Date to price mapping used to calculate estimated usage
  // based on the Livepeer.com broadcaster's max price
  const pricePerPixel = [
    {
      startDate: "1577836800",
      endDate: "1616457600",
      price: 0.000000000000006, // (6000 wei)
    },
    {
      startDate: "1616457600",
      endDate: "1620201600",
      price: 0.000000000000003, // (3000 wei)
    },
    { startDate: "1620201600", endDate: Infinity, price: 0.0000000000000006 }, // (600 wei)
  ];

  // the # of pixels in a minute of 240p30fps, 360p30fps, 480p30fps, 720p30fps transcoded renditions.
  // (width * height * framerate * seconds in a minute)
  const pixelsPerMinute = 2995488000;

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs();
    const utcOneDayBack = utcCurrentTime.subtract(1, "day").unix();
    const utcTwoDaysBack = utcCurrentTime.subtract(2, "day").unix();
    const utcOneWeekBack = utcCurrentTime.subtract(1, "week").unix();
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, "week").unix();

    // get the blocks needed for time travel queries
    const [
      oneDayBlock,
      twoDayBlock,
      oneWeekBlock,
      twoWeekBlock,
    ] = await getBlocksFromTimestamps([
      utcOneDayBack,
      utcTwoDaysBack,
      utcOneWeekBack,
      utcTwoWeeksBack,
    ]);

    const getDayData = async () => {
      const result = await client.query({
        query: dayDataQuery,
        fetchPolicy: "network-only",
        variables: {
          first: 1000,
          orderBy: "date",
          orderDirection: "desc",
        },
      });
      return result;
    };

    const getProtocolData = async () => {
      const result = await client.query({
        query: protocolDataQuery,
        fetchPolicy: "network-only",
      });
      return result;
    };

    const getProtocolDataByBlock = async (_block) => {
      const result = await client.query({
        query: protocolDataByBlockQuery,
        fetchPolicy: "network-only",
        variables: {
          block: { number: _block },
        },
      });
      return result;
    };

    const dayDataResult = await getDayData();
    dayData = dayDataResult.data.days;

    const livepeerComDayData = await getLivepeerComUsageData();
    const livepeerComOneWeekData = await getLivepeerComUsageData({
      fromTime: +new Date(2020, 0),
      toTime: utcOneWeekBack * 1000, // Livepeer.com api uses milliseconds
    });
    const livepeerComTwoWeekData = await getLivepeerComUsageData({
      fromTime: +new Date(2020, 0),
      toTime: utcTwoWeeksBack * 1000, // Livepeer.com api uses milliseconds
    });

    let totalFeeDerivedMinutes = 0;
    let totalFeeDerivedMinutesOneWeekAgo = 0;
    let totalFeeDerivedMinutesTwoWeeksAgo = 0;
    let pricePerPixelIndex = pricePerPixel.length - 1;

    // merge in Livepeer.com usage data
    dayData = dayData.map((item) => {
      const found = livepeerComDayData.find(
        (element) => item.date === element.date
      );

      // if Livepeer.com's broadcaster changed max price, use updated price
      if (
        pricePerPixelIndex &&
        item.date < pricePerPixel[pricePerPixelIndex].startDate
      ) {
        pricePerPixelIndex--;
      }

      const feeDerivedMinutes = getTotalFeeDerivedMinutes({
        pricePerPixel: pricePerPixel[pricePerPixelIndex].price,
        totalVolumeETH: +item.volumeETH,
        totalVolumeUSD: +item.volumeUSD,
        pixelsPerMinute,
      });

      totalFeeDerivedMinutes += feeDerivedMinutes;

      if (item.date < utcOneWeekBack) {
        totalFeeDerivedMinutesOneWeekAgo += feeDerivedMinutes;
      }
      if (item.date < utcTwoWeeksBack) {
        totalFeeDerivedMinutesTwoWeeksAgo += feeDerivedMinutes;
      }

      // combine Livepeer.com minutes with minutes calculated via fee volume
      const minutes =
        (found?.sourceSegmentsDuration ?? 0) / 60 + feeDerivedMinutes;
      return { ...item, ...found, minutes };
    });

    // get total Livepeer.com aggregate usage
    const totalLivepeerComUsage = livepeerComDayData.reduce((x, y) => {
      return x + y.sourceSegmentsDuration / 60;
    }, 0);

    const totalLivepeerComUsageOneWeekAgo = livepeerComOneWeekData.reduce(
      (x, y) => {
        return x + y.sourceSegmentsDuration / 60;
      },
      0
    );

    const totalLivepeerComUsageTwoWeeksAgo = livepeerComTwoWeekData.reduce(
      (x, y) => {
        return x + y.sourceSegmentsDuration / 60;
      },
      0
    );

    // fetch the historical data
    const protocolDataResult = await getProtocolData();
    data.totalVolumeUSD = +protocolDataResult.data.protocol.totalVolumeUSD;
    data.totalVolumeETH = +protocolDataResult.data.protocol.totalVolumeETH;
    data.participationRate = +protocolDataResult.data.protocol
      .participationRate;

    const oneDayResult = await getProtocolDataByBlock(oneDayBlock);
    oneDayData = oneDayResult.data.protocol;

    const twoDayResult = await getProtocolDataByBlock(twoDayBlock);
    twoDayData = twoDayResult.data.protocol;

    const oneWeekResult = await getProtocolDataByBlock(oneWeekBlock);
    const oneWeekData = oneWeekResult.data.protocol;

    const twoWeekResult = await getProtocolDataByBlock(twoWeekBlock);
    const twoWeekData = twoWeekResult.data.protocol;

    const [oneDayVolumeUSD, volumeChangeUSD] = getTwoPeriodPercentChange(
      +data.totalVolumeUSD,
      +oneDayData.totalVolumeUSD,
      +twoDayData.totalVolumeUSD
    );

    const [oneWeekVolumeUSD, weeklyVolumeChangeUSD] = getTwoPeriodPercentChange(
      +data.totalVolumeUSD,
      +oneWeekData.totalVolumeUSD,
      +twoWeekData.totalVolumeUSD
    );

    const [oneWeekVolumeETH] = getTwoPeriodPercentChange(
      +data.totalVolumeETH,
      +oneWeekData.totalVolumeETH,
      +twoWeekData.totalVolumeETH
    );

    const [oneWeekUsage, weeklyUsageChange] = getTwoPeriodPercentChange(
      totalLivepeerComUsage + totalFeeDerivedMinutes,
      totalLivepeerComUsageOneWeekAgo + totalFeeDerivedMinutesOneWeekAgo,
      totalLivepeerComUsageTwoWeeksAgo + totalFeeDerivedMinutesTwoWeeksAgo
    );

    // format the total participation change
    const participationRateChange = getPercentChange(
      data.participationRate,
      oneDayData.participationRate
    );

    // format weekly data for weekly sized chunks
    const weeklySizedChunks = [...dayData].sort((a, b) =>
      parseInt(a.date) > parseInt(b.date) ? 1 : -1
    );
    let startIndexWeekly = -1;
    let currentWeek = -1;

    for (const weeklySizedChunk of weeklySizedChunks) {
      const week = dayjs.utc(dayjs.unix(weeklySizedChunk.date)).week();
      if (week !== currentWeek) {
        currentWeek = week;
        startIndexWeekly++;
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {};
      weeklyData[startIndexWeekly].date = weeklySizedChunk.date;
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) +
        +weeklySizedChunk.volumeUSD;
      weeklyData[startIndexWeekly].weeklyUsageMinutes =
        (weeklyData[startIndexWeekly].weeklyUsageMinutes ?? 0) +
        weeklySizedChunk.minutes;
    }

    // add relevant fields with the calculated amounts
    data.dayData = [...dayData].reverse();
    data.weeklyData = weeklyData;
    data.oneDayVolumeUSD = oneDayVolumeUSD;
    data.oneWeekVolumeUSD = oneWeekVolumeUSD;
    data.oneWeekVolumeETH = oneWeekVolumeETH;
    data.totalUsage = totalFeeDerivedMinutes + totalLivepeerComUsage;
    data.oneWeekUsage = oneWeekUsage;
    data.weeklyUsageChange = weeklyUsageChange;
    data.weeklyVolumeChangeUSD = weeklyVolumeChangeUSD;
    data.volumeChangeUSD = volumeChangeUSD;
    data.participationRateChange = participationRateChange;
  } catch (e) {
    console.log(e);
  }

  return data;
}
