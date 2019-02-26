import React from 'react'
import { axisBottom, axisLeft, scaleTime, select } from 'd3'

export default () => {
  // These should be props or something
  const width = 600
  const height = 400
  const xScale = scaleTime()
    .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
    .range([0, 960])
  const xAxis = axisBottom(xScale)
  const yAxis = axisLeft(xScale)
  console.log(xAxis)
  // var xScale = d3.time.scale().range([0, width])
  // var xAxis = d3
  //   .axis()
  //   .scale(xScale)
  //   .tickPadding(8)
  //   .orient('bottom')
  //   .ticks(6)
  //   .tickFormat((_, i) => {
  //     let secs = (i * 30) % 60
  //     if (secs < 10) {
  //       secs = `0${secs}`
  //     }
  //     let mins = Math.floor(i / 2)
  //     if (mins < 10) {
  //       mins = `0${mins}`
  //     }
  //     return `00:${mins}:${secs}`
  //   })
  const refCallback = ref => {
    console.log('got ref', ref)
  }
  const axisBottomRef = ref => {
    select(ref).call(xAxis)
  }
  const axisLeftRef = ref => {
    select(ref).call(yAxis)
  }
  return (
    <svg viewBox="0 0 600 400" ref={refCallback}>
      <g transform={`translate(20, 0)`} ref={axisLeftRef} />
      <g transform={`translate(0, ${height - 20})`} ref={axisBottomRef} />
    </svg>
  )
}
