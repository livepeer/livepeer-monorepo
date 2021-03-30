import { getChartData } from "../../apollo/resolvers/Query";
import type { NextApiRequest, NextApiResponse } from "next";

const usageData = async (_req: NextApiRequest, res: NextApiResponse) => {
  const usage = await getChartData();
  res.json(usage);
};

export default usageData;
