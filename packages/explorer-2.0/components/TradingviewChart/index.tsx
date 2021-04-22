import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formattedNum } from "../../lib/utils";
import Box from "../Box";

dayjs.extend(utc);

export const CHART_TYPES = {
  BAR: "BAR",
  AREA: "AREA",
};

// constant height for charts
const HEIGHT = 300;

const TradingViewChart = ({
  type = CHART_TYPES.BAR,
  data,
  base,
  baseChange,
  field,
  title,
  width,
  useWeekly = false,
  mode = "Normal",
  unit,
}) => {
  // reference for DOM element to create with chart
  const ref: any = useRef();

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(null);

  // parese the data and format for tardingview consumption
  const formattedData = data?.map((entry) => {
    return {
      time: dayjs.unix(entry.date).utc().format("YYYY-MM-DD"),
      value:
        type === CHART_TYPES.AREA
          ? parseFloat(entry[field]) * 100
          : parseFloat(entry[field]),
    };
  });

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.3 : 0.2;

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    // get the title of the chart
    const setLastBarText = ({ toolTip, formattedPercentChange, color }) => {
      toolTip.innerHTML =
        `<div style="font-size: 16px; margin: 4px 0px; color: #fff;">${title} ${
          type === CHART_TYPES.BAR && !useWeekly ? "(24hr)" : ""
        }</div>` +
        `<div style="font-size: 22px; margin: 4px 0px; color: #fff">` +
        (type === CHART_TYPES.AREA
          ? `${(parseFloat(base) * 100).toFixed(2)}%`
          : formattedNum(base, unit)) +
        `<span style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</span>` +
        "</div>";
    };

    if (!chartCreated && formattedData) {
      const lightweightCharts = require("lightweight-charts");
      const { createChart } = lightweightCharts;
      const chart: any = createChart(ref.current, {
        width: width,
        height: HEIGHT,
        layout: {
          backgroundColor: "transparent",
          textColor: "#fff",
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0,
          },
          borderVisible: false,
          mode: lightweightCharts.PriceScaleMode[mode],
        },
        timeScale: {
          borderVisible: false,
        },
        grid: {
          horzLines: {
            color: "rgba(197, 203, 206, 0.5)",
            visible: false,
          },
          vertLines: {
            color: "rgba(197, 203, 206, 0.5)",
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: "rgba(32, 38, 46, 0.1)",
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (val) => {
            if (type === CHART_TYPES.AREA) {
              return `${val.toFixed(2)}%`;
            }
            if (unit === "minutes") {
              return Math.round(val)
                .toLocaleString("en-US")
                .replace(/\.00$/, "");
            }
            return formattedNum(val, unit).toString().replace(/\.00$/, "");
          },
        },
      });

      const series =
        type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
              color: "#00EB88",
              priceFormat: {
                type: "volume",
              },
              scaleMargins: {
                top: 0.32,
                bottom: 0,
              },
              lineColor: "#00EB88",
              lineWidth: 3,
            })
          : chart.addAreaSeries({
              topColor: "#00EB88",
              bottomColor: "rgba(0, 235, 136, .05)",
              lineColor: "#00EB88",
              lineWidth: 3,
            });

      series.setData(formattedData);

      const toolTip = document.createElement("div");
      toolTip.setAttribute("id", "tooltip-id" + type);
      toolTip.className = "three-line-legend";
      ref.current.appendChild(toolTip);
      toolTip.style.display = "block";
      toolTip.style.fontWeight = "500";
      toolTip.style.left = -4 + "px";
      toolTip.style.top = "-" + 8 + "px";
      toolTip.style.backgroundColor = "transparent";

      // format numbers
      const percentChange = baseChange?.toFixed(2);
      const formattedPercentChange =
        (percentChange > 0 ? "+" : "") + percentChange + "%";
      const color = percentChange >= 0 ? "#00EB88" : "#ff0022";

      setLastBarText({ toolTip, formattedPercentChange, color });

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText({ toolTip, formattedPercentChange, color });
        } else {
          const dateStr = useWeekly
            ? dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              )
                .startOf("week")
                .format("MMMM D, YYYY") +
              "-" +
              dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              )
                .endOf("week")
                .format("MMMM D, YYYY")
            : dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              ).format("MMMM D, YYYY");
          const val = param.seriesPrices.get(series);

          toolTip.innerHTML =
            `<div style="font-size: 16px; margin: 4px 0px; color: #fff;">${title}</div>` +
            `<div style="font-size: 22px; margin: 4px 0px; color: #fff;">` +
            (type === CHART_TYPES.AREA
              ? val.toFixed(2) + "%"
              : formattedNum(val, unit)) +
            "</div>" +
            "<div>" +
            dateStr +
            "</div>";
        }
      });

      chart.timeScale().fitContent();

      setChartCreated(chart);
    }
  }, [
    base,
    baseChange,
    chartCreated,
    data,
    formattedData,
    title,
    topScale,
    type,
    useWeekly,
    width,
    mode,
    unit,
  ]);

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT);
      chartCreated && chartCreated.timeScale().scrollToPosition(0);
    }
  }, [chartCreated, width]);

  return (
    <Box
      css={{
        ".three-line-legend": {
          width: "100%",
          height: 70,
          position: "absolute",
          padding: "8px",
          fontSize: "12px",
          color: "white",
          backgroundColor: "rgba(255, 255, 255, 0.23)",
          textAlign: "left",
          zIndex: "10",
          pointerEvents: "none",
        },
        position: "relative",
      }}
    >
      <Box ref={ref} id={"test-id" + type} />
      <Box
        css={{
          position: "absolute",
          right: "0",
          borderRadius: "3px",
          height: "16px",
          width: "16px",
          padding: "0px",
          bottom: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "$primary",
          ":hover": {
            cursor: "pointer",
            opacity: "0.7",
          },
        }}
      >
        <Box
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent();
          }}
        />
      </Box>
    </Box>
  );
};

export default TradingViewChart;
