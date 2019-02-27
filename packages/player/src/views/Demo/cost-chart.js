import React from 'react'
import { axisBottom, axisLeft, scaleLinear, select, line } from 'd3'
import styled from 'styled-components'

export default () => {
  // These should be props or something
  const width = 600
  const height = 400
  const data = [...new Array(30)].map((_, i) => [i, i * 60])
  const xScale = scaleLinear()
    .domain([0, 30])
    .range([0, 600])
  const yScale = scaleLinear()
    .domain([30 * 60, 0])
    .range([0, 400])

  const xAxis = axisBottom(xScale)
  const yAxis = axisLeft(yScale)
  const livepeerLine = line(data)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))

  const axisBottomRef = ref => {
    select(ref).call(xAxis)
  }
  const axisLeftRef = ref => {
    select(ref).call(yAxis)
  }
  const livepeerLineRef = ref => {
    select(ref)
      .datum(data)
      .attr('d', livepeerLine)
  }

  return (
    <ChartSVG viewBox="0 0 600 400">
      {/* "Padding" container */}
      <g transform={`translate(50, 50), scale(0.8)`}>
        <g ref={axisLeftRef} />
        <g ref={axisBottomRef} transform={`translate(0, 400)`} />
        <LinePath innerRef={livepeerLineRef} />
      </g>
    </ChartSVG>
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
