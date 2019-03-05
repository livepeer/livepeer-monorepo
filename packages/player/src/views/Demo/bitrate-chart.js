import React from 'react'
import { scaleLinear } from 'd3'
import BaseChart from './base-chart'
import { kbpsFormat, mbpsFormat } from './shared-chart'

const CHART_WIDTH = 30000 // 30 seconds
export default ({ bitrates, currentTime }) => {
  let totalDuration = 0
  let maxSize = 0
  const data = !bitrates[0]
    ? [[0, 0]]
    : bitrates[0].segments
        .map((segment, i) => {
          const myStart = totalDuration
          totalDuration += segment.duration * 1000
          maxSize = Math.max(maxSize, segment.size)
          return [
            myStart,
            ...bitrates.map(
              bitrate => bitrate.segments[i] && bitrate.segments[i].size,
            ),
          ]
        })
        .filter(column => column.every(val => val !== undefined))

  let maxDomain = Math.max(30, data[data.length - 1][0])
  if (maxDomain > currentTime) {
    maxDomain = currentTime
  }
  const xScale = scaleLinear().domain([maxDomain - CHART_WIDTH, maxDomain])

  const maxRange = Math.max(2, maxSize)
  const yScale = scaleLinear().domain([maxRange, 0])
  const lastDatum = data[data.length - 1]
  return (
    <div>
      <BaseChart
        xScale={xScale}
        yScale={yScale}
        data={data}
        yTickFormat={mbpsFormat}
      />
      <div>
        {bitrates.map((bitrate, i) => {
          const { width, height } = bitrate.resolution
          return (
            <div key={i}>
              {width}x{height}: {kbpsFormat(lastDatum[i + 1])}
            </div>
          )
        })}
      </div>
    </div>
  )
}
