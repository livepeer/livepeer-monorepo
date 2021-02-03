import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";
import {
  get2DayPercentChange,
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
  let profile;
  let space;

  profile = await Box.getProfile(_args.id);
  space = await Box.getSpace(_args.id, "livepeer");

  if (space.defaultProfile === "3box") {
    useThreeBox = true;
  }

  let addressLinks = [];
  if (Object.entries(space).length) {
    const conf = await Box.getConfig(id);
    try {
      const links = await Promise.all(
        conf.links.map((link) => validateLink(link))
      );
      addressLinks = links.filter((link: any) => {
        return (
          link &&
          Utils.toChecksumAddress(link.address) != Utils.toChecksumAddress(id)
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
  const response = await fetch(
    "https://ethgasstation.info/json/ethgasAPI.json"
  );
  const ethGasStationResult = await response.json();
  return {
    number: blockNumber,
    time: ethGasStationResult.block_time,
  };
}

export async function getChartData(_obj, _args, _ctx, _info) {
  let data = {
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
  let weeklyData = [];
  let oneDayData = {
    totalVolumeUSD: 0,
    participationRate: 0,
  };
  let twoDayData = {
    totalVolumeUSD: 0,
    participationRate: 0,
  };

  const pricePerPixel = 0.000000000000006; // (6000 wei)
  // the # of pixels in a minute of 240p30fps, 360p30fps, 480p30fps, 720p30fps transcoded renditions.
  // (width * height * framerate * seconds in a minute)
  const pixelsPerMinute = 2995488000;

  try {
    // get timestamps for the days
    let utcCurrentTime = dayjs();
    let utcOneDayBack = utcCurrentTime.subtract(1, "day").unix();
    let utcTwoDaysBack = utcCurrentTime.subtract(2, "day").unix();
    let utcOneWeekBack = utcCurrentTime.subtract(1, "week").unix();
    let utcTwoWeeksBack = utcCurrentTime.subtract(2, "week").unix();

    // get the blocks needed for time travel queries
    let [
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

    let getDayData = async () => {
      let result = await client.query({
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

    let getProtocolData = async () => {
      let result = await client.query({
        query: protocolDataQuery,
        fetchPolicy: "network-only",
      });
      return result;
    };

    let getProtocolDataByBlock = async (block) => {
      let result = await client.query({
        query: protocolDataByBlockQuery,
        fetchPolicy: "network-only",
        variables: {
          block: { number: block },
        },
      });
      return result;
    };

    let dayDataResult = await getDayData();
    dayData = dayDataResult.data.days;

    let livepeerComDayData = await getLivepeerComUsageData();
    let livepeerComOneWeekData = await getLivepeerComUsageData({
      fromTime: +new Date(2020, 0),
      toTime: utcOneWeekBack * 1000, // Livepeer.com api uses milliseconds
    });
    let livepeerComTwoWeekData = await getLivepeerComUsageData({
      fromTime: +new Date(2020, 0),
      toTime: utcTwoWeeksBack * 1000, // Livepeer.com api uses milliseconds
    });

    // merge in Livepeer.com usage data
    dayData = dayData.map((item) => {
      let found = livepeerComDayData.find(
        (element) => item.date == element.date
      );

      let feeDerivedMinutes = getTotalFeeDerivedMinutes({
        pricePerPixel,
        totalVolumeETH: +item.volumeETH,
        totalVolumeUSD: +item.volumeUSD,
        pixelsPerMinute,
      });

      // combine Livepeer.com minutes with minutes calculated via fee volume
      let minutes =
        (found?.transcodedSegmentsDuration ?? 0) / 60 + feeDerivedMinutes;
      return { ...item, ...found, minutes };
    });

    // get total Livepeer.com aggregate usage
    let totalLivepeerComUsage = livepeerComDayData.reduce((x, y) => {
      return x + y.transcodedSegmentsDuration / 60;
    }, 0);

    let totalLivepeerComUsageOneWeekAgo = livepeerComOneWeekData.reduce(
      (x, y) => {
        return x + y.transcodedSegmentsDuration / 60;
      },
      0
    );

    let totalLivepeerComUsageTwoWeeksAgo = livepeerComTwoWeekData.reduce(
      (x, y) => {
        return x + y.transcodedSegmentsDuration / 60;
      },
      0
    );

    // fetch the historical data
    let protocolDataResult = await getProtocolData();
    data.totalVolumeUSD = +protocolDataResult.data.protocol.totalVolumeUSD;
    data.totalVolumeETH = +protocolDataResult.data.protocol.totalVolumeETH;
    data.participationRate = +protocolDataResult.data.protocol
      .participationRate;

    let oneDayResult = await getProtocolDataByBlock(oneDayBlock);
    oneDayData = oneDayResult.data.protocol;

    let twoDayResult = await getProtocolDataByBlock(twoDayBlock);
    twoDayData = twoDayResult.data.protocol;

    let oneWeekResult = await getProtocolDataByBlock(oneWeekBlock);
    let oneWeekData = oneWeekResult.data.protocol;

    let twoWeekResult = await getProtocolDataByBlock(twoWeekBlock);
    let twoWeekData = twoWeekResult.data.protocol;

    let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
      data.totalVolumeUSD,
      oneDayData.totalVolumeUSD ? oneDayData.totalVolumeUSD : 0,
      twoDayData.totalVolumeUSD ? twoDayData.totalVolumeUSD : 0
    );

    let [oneWeekVolumeUSD, weeklyVolumeChangeUSD] = get2DayPercentChange(
      data.totalVolumeUSD,
      oneWeekData.totalVolumeUSD,
      twoWeekData.totalVolumeUSD
    );

    let [oneWeekVolumeETH] = get2DayPercentChange(
      data.totalVolumeETH,
      oneWeekData.totalVolumeETH,
      twoWeekData.totalVolumeETH
    );

    let [oneWeekUsage, weeklyUsageChange] = get2DayPercentChange(
      totalLivepeerComUsage +
        getTotalFeeDerivedMinutes({
          totalVolumeETH: +data.totalVolumeETH,
          totalVolumeUSD: +data.totalVolumeUSD,
          pricePerPixel,
          pixelsPerMinute,
        }),
      totalLivepeerComUsageOneWeekAgo +
        getTotalFeeDerivedMinutes({
          totalVolumeETH: +oneWeekData.totalVolumeETH,
          totalVolumeUSD: +oneWeekData.totalVolumeUSD,
          pricePerPixel,
          pixelsPerMinute,
        }),
      totalLivepeerComUsageTwoWeeksAgo +
        getTotalFeeDerivedMinutes({
          totalVolumeETH: +twoWeekData.totalVolumeETH,
          totalVolumeUSD: +twoWeekData.totalVolumeUSD,
          pricePerPixel,
          pixelsPerMinute,
        })
    );

    // format the total participation change
    let participationRateChange = getPercentChange(
      data.participationRate,
      oneDayData.participationRate
    );

    // format weekly data for weekly sized chunks
    let weeklySizedChunks = [...dayData].sort((a, b) =>
      parseInt(a.date) > parseInt(b.date) ? 1 : -1
    );
    let startIndexWeekly = -1;
    let currentWeek = -1;

    for (const weeklySizedChunk of weeklySizedChunks) {
      let week = dayjs.utc(dayjs.unix(weeklySizedChunk.date)).week();
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
