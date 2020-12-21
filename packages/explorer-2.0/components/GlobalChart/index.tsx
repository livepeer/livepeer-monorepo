import { useState, useEffect, useRef } from 'react'
import { ResponsiveContainer } from 'recharts'
import TradingviewChart, { CHART_TYPES } from '../TradingviewChart'
import { gql, useQuery } from '@apollo/client'
import Spinner from '../Spinner'

const GlobalChart = ({ display }) => {
  const { data } = useQuery(
    gql`
      {
        chartData: getChartData
      }
    `,
  )

  // update the width on a window resize
  const ref = useRef(null)
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)

  useEffect(() => {
    if (!isClient) {
      return
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, width])

  if (!data) {
    return <Spinner />
  }

  return (
    <>
      {display === 'participation' && (
        <ResponsiveContainer aspect={60 / 28} ref={ref}>
          <TradingviewChart
            data={data.chartData.dayData}
            base={data.chartData.participationRate}
            baseChange={data.chartData.participationRateChange}
            title="Participation"
            field="participationRate"
            width={width}
            type={CHART_TYPES.AREA}
          />
        </ResponsiveContainer>
      )}
      {display === 'volume' && (
        <ResponsiveContainer aspect={60 / 28}>
          <TradingviewChart
            // only show volume after this date (5.13.20) because we don't start
            // tracking volume in USD until Uniswap V2
            data={data.chartData.weeklyData.filter(
              (obj) => obj.date > 1589328000,
            )}
            base={data.chartData.oneWeekVolume}
            baseChange={data.chartData.weeklyVolumeChange}
            title="Fee Volume (7d)"
            field="weeklyVolumeUSD"
            width={width}
            type={CHART_TYPES.BAR}
            useWeekly={true}
          />
        </ResponsiveContainer>
      )}
    </>
  )
}

export default GlobalChart
