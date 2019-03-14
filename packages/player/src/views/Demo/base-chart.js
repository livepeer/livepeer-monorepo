import React from 'react'
import { axisBottom, axisLeft, select, line } from 'd3'
import styled from 'styled-components'
import { timeFormat, DEFAULT_COLORS } from './shared-chart'

export default ({
  data,
  xScale,
  yScale,
  vWidth = 300,
  vHeight = 200,
  padding = 50,
  xTickFormat = timeFormat,
  yTickFormat = x => x,
  colors = DEFAULT_COLORS,
}) => {
  xScale.range([0, vWidth - padding * 2])
  yScale.range([0, vHeight - padding * 2])

  const xAxis = axisBottom(xScale)
    .ticks(4)
    .tickFormat(xTickFormat)

  const yAxis = axisLeft(yScale)
    .ticks(2)
    .tickFormat(yTickFormat)

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

  return (
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
              color={colors[i % colors.length]}
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
  )
}

const ChartSVG = styled.svg`
  user-select: none;
  margin-top: -80px;
  margin-bottom: -30px;
`

const LinePath = styled.path`
  stroke: ${props => props.color || '#005689'};
  stroke-width: 2px;
  fill: none;
`
