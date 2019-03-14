import React, { useState, useEffect } from 'react'
import { scaleLinear } from 'd3'
import BaseChart from './base-chart'
import {
  kbpsFormat,
  mbpsFormat,
  ChartInfoBox,
  DEFAULT_COLORS,
} from './shared-chart'
import InfoTable from './info-table'

const CHART_WIDTH = 30000 // 30 seconds
export default ({ bitrates, currentTime }) => {
  const [maxRate, setMaxRate] = useState(0)
  const [data, setData] = useState([[0, 0]])
  const [offset, setOffset] = useState(0)
  const [, setMissingSegments] = useState(0)

  useEffect(
    () => {
      let totalDuration = 0
      let newMaxRate = 0
      const missingSegments = []
      const data = !bitrates[0]
        ? [[0, 0]]
        : bitrates[0].segments
            .map((segment, i) => {
              const myStart = totalDuration
              totalDuration += segment.duration * 1000
              newMaxRate = Math.max(newMaxRate, segment.rate)

              return [
                myStart,
                ...bitrates.map((bitrate, j) => {
                  if (!missingSegments[j]) {
                    missingSegments[j] = 0
                  }
                  if (bitrate.segments[i]) {
                    missingSegments[j] += bitrate.segments[i].gapSize
                    return bitrate.segments[i].rate
                  }
                  // If a segment is missing, return the segment to the left if we have one.
                  // if (bitrate.segments[i - 1]) {
                  //   return bitrate.segments[i - 1].rate
                  // }
                  if (bitrate.segments[i - 1] && bitrate.segments[i + 1]) {
                    return Math.round(
                      (bitrate.segments[i - 1].rate +
                        bitrate.segments[i + 1].rate) /
                        2,
                    )
                  }
                  return undefined
                }),
              ]
            })
            .filter(column => column.every(val => val !== undefined))
      setData(oldData => {
        setOffset(oldOffset => {
          const now = currentTime - oldOffset
          const oldMax = oldData[oldData.length - 1][0]
          if (oldMax > now) {
            return oldOffset
          }
          return currentTime - oldMax
        })

        return data
      })
      setMaxRate(newMaxRate)
      setMissingSegments(missingSegments)
    },
    [bitrates],
  )

  const now = currentTime - offset

  let maxDomain = Math.min(data[data.length - 1][0], now)
  const xScale = scaleLinear().domain([maxDomain - CHART_WIDTH, maxDomain])

  const maxRange = Math.max(2, maxRate)
  const yScale = scaleLinear().domain([maxRange, 0])
  const lastDatum = data[data.length - 1]
  return (
    <ChartInfoBox>
      <h2>Resolution Comparison</h2>
      <BaseChart
        xScale={xScale}
        yScale={yScale}
        data={data}
        yTickFormat={mbpsFormat}
      />
      <div>
        <InfoTable
          table={bitrates.map((bitrate, i) => {
            const { width, height } = bitrate.resolution
            return [
              DEFAULT_COLORS[i],
              `${width}x${height}`,
              `${kbpsFormat(lastDatum[i + 1])}`,
            ]
          })}
        />
      </div>
    </ChartInfoBox>
  )
}
