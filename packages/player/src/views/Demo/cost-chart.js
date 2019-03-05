import React from 'react'
import { scaleLinear } from 'd3'
import { dollarFormat, getComparisons } from './shared-chart'
import BaseChart from './base-chart'

export default ({ currentTime, bitrates }) => {
  const comparisons = getComparisons(bitrates)
  let maxCost = 0
  const maxValues = comparisons.map(comp => {
    const cost = (currentTime / 1000 / 60) * comp.costPerMinute
    maxCost = Math.max(cost, maxCost)
    return cost
  })
  const data = [[0, ...maxValues.map(() => 0)], [currentTime, ...maxValues]]
  const maxDomain = Math.max(30000, data[data.length - 1][0])
  const xScale = scaleLinear().domain([0, maxDomain])

  const maxRange = Math.max(0.02, maxCost)
  const yScale = scaleLinear().domain([maxRange, 0])
  return (
    <div>
      <BaseChart
        xScale={xScale}
        yScale={yScale}
        data={data}
        yTickFormat={dollarFormat}
      />
      {comparisons.map(({ name }, i) => (
        <div key={i}>
          {name}: {dollarFormat(maxValues[i])}
        </div>
      ))}
    </div>
  )
}
