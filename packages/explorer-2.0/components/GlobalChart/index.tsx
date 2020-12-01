import { useState, useEffect, useRef } from 'react'
import { ResponsiveContainer } from 'recharts'
import TradingviewChart, { CHART_TYPES } from '../TradingviewChart'
import dayDataQuery from '../../queries/dayData.gql'
import { useQuery } from '@apollo/client'
import Spinner from '../Spinner'

const GlobalChart = ({ display }) => {
  const { data } = useQuery(dayDataQuery, {
    variables: {
      first: 1000,
      orderBy: 'date',
      orderDirection: 'desc',
    },
  })

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
            data={[...data.dayDatas].reverse()}
            base={data.dayDatas[0].participationRate}
            baseChange={0}
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
            data={[...data.dayDatas].slice(0, 100).reverse()}
            base={data.dayDatas[0].volumeUSD}
            baseChange={0}
            title="Volume"
            field="volumeUSD"
            width={width}
            type={CHART_TYPES.BAR}
          />
        </ResponsiveContainer>
      )}
    </>
  )
}

export default GlobalChart
