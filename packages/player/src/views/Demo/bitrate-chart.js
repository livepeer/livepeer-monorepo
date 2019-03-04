import React, { useState, useEffect } from 'react'
import { axisBottom, axisLeft, scaleLinear, select, line, max } from 'd3'
import styled from 'styled-components'
import { timeFormat, kbpsFormat, mbpsFormat } from './shared-chart'

const VIEWBOX_DIMENSIONS = [300, 200]
const CHART_WIDTH = 30000 // 30 seconds

export default ({ bitrates, currentTime }) => {
  const [vWidth, vHeight] = VIEWBOX_DIMENSIONS
  // These should be props or something
  const [count, setCount] = useState(0)
  const padding = 50

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
  const xScale = scaleLinear()
    .domain([maxDomain - CHART_WIDTH, maxDomain])
    .range([0, vWidth - padding * 2])

  const maxRange = Math.max(2, maxSize)
  const yScale = scaleLinear()
    .domain([maxRange, 0])
    .range([0, vHeight - padding * 2])

  const xAxis = axisBottom(xScale)
    .ticks(4)
    .tickFormat(timeFormat)
  const yAxis = axisLeft(yScale)
    .ticks(2)
    .tickFormat(mbpsFormat)

  const lines = data[0].slice(1).map((_, i) =>
    line(data)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[i + 1])),
  )
  // const livepeerLine = line(data)
  // .x(d => xScale(d[0]))
  // .y(d => yScale(d[1]))

  const axisBottomRef = ref => {
    select(ref).call(xAxis)
  }
  const axisLeftRef = ref => {
    select(ref).call(yAxis)
  }
  // const livepeerLineRef = (ref, line) => {
  //   select(ref)
  //     .datum(data)
  //     .attr('d', livepeerLine)
  // }

  const clipPath = `polygon(0 0, 101% 0, 101% 100%, 0 100%)`
  const innerScale = (vWidth - padding * 2) / vWidth
  const lastDatum = data[data.length - 1]
  return (
    <div>
      <ChartSVG viewBox={`0 0 ${vWidth} ${vHeight}`}>
        <defs>
          <clipPath id="ChartClip">
            <rect
              x={0}
              y={0}
              width={vWidth - padding * 2}
              height={vHeight - padding * 2}
            />
          </clipPath>
        </defs>
        {/* "Padding" container */}
        {/* <rect width={vWidth} height={vHeight} /> */}
        <g transform={`translate(${padding}, ${padding})`}>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              <LinePath
                id={`ChartPath${i}`}
                clipPath="url(#ChartClip)"
                key={i}
                innerRef={ref =>
                  select(ref)
                    .datum(data)
                    .attr('d', line)
                }
              />
            </React.Fragment>
          ))}
          <g ref={axisLeftRef} />
          <g
            ref={axisBottomRef}
            transform={`translate(0, ${vHeight - padding * 2})`}
          />
        </g>
      </ChartSVG>
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

const ChartSVG = styled.svg`
  user-select: none;
`

const LinePath = styled.path`
  stroke: #005689;
  stroke-width: 2px;
  fill: none;
`
