import { useState, useEffect, useRef } from "react";
import { ResponsiveContainer } from "recharts";
import TradingviewChart, { CHART_TYPES } from "../TradingviewChart";
import { gql, useQuery } from "@apollo/client";
import Spinner from "../Spinner";

const GlobalChart = ({ display, title, field, unit = "" }) => {
  const { data } = useQuery(
    gql`
      {
        chartData: getChartData
      }
    `
  );

  // update the width on a window resize
  const ref = useRef(null);
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, width]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <>
      {display === "area" && (
        <ResponsiveContainer aspect={60 / 28} ref={ref}>
          <TradingviewChart
            data={data.chartData.dayData}
            base={data.chartData.participationRate}
            baseChange={data.chartData.participationRateChange}
            title={title}
            unit={unit}
            field={field}
            width={width}
            type={CHART_TYPES.AREA}
          />
        </ResponsiveContainer>
      )}
      {display === "volume" && (
        <ResponsiveContainer aspect={60 / 28}>
          <TradingviewChart
            // Let's start showing volume around April 2020,
            // a few months after streamflow launch, since the first few months
            // don't tell much of a story
            data={data.chartData.weeklyData.filter(
              (obj) => obj.date > 1585699200
            )}
            base={
              unit === "minutes"
                ? data.chartData.oneWeekUsage
                : data.chartData.oneWeekVolume
            }
            baseChange={
              unit === "minutes"
                ? data.chartData.weeklyUsageChange
                : data.chartData.weeklyVolumeChange
            }
            title={title}
            unit={unit}
            field={field}
            width={width}
            type={CHART_TYPES.BAR}
            useWeekly={true}
          />
        </ResponsiveContainer>
      )}
    </>
  );
};

export default GlobalChart;
