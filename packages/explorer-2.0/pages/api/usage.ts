import { getChartData } from "../../apollo/resolvers/Query";
import type { NextApiRequest, NextApiResponse } from "next";

const usageData = async (_req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = _req.headers;

  if (authorization !== `Bearer ${process.env.API_TOKEN}`) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  const usage = await getChartData();
  res.json(usage);
};

export default usageData;
