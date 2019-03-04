import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { VideoPlayer } from '@livepeer/chroma'
import LoadingOverlay from '../../components/LoadingOverlay'
import BasicNavbar from '../../components/BasicNavbar'
import CostChart from './cost-chart'
import BitrateChart from './bitrate-chart'
import { useInterval } from 'rooks'
import scrapeStream from './scrape-stream'

export default ({
  maxWidth = '100%',
  aspectRatio = '16:9',
  stream = 'http://192.168.1.225:8935/stream/current.m3u8',
}) => {
  const [live, setLive] = useState()
  const [currentTime, setCurrentTime] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [timeOffset, setTimeOffset] = useState(0)
  const [pauseTime, setPauseTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [bitrates, setBitrates] = useState([])

  const updateBitrates = () => {
    scrapeStream(stream).then(newBitrates => {
      setBitrates(oldBitrates => {
        if (oldBitrates.length !== newBitrates.length) {
          return newBitrates
        }
        // Yuck, this is O(n^2)
        return oldBitrates.map((oldBitrate, i) => {
          const newBitrate = newBitrates[i]
          const newSegmentInfo = newBitrate.segments.filter(
            newSeg =>
              !oldBitrate.segments.find(oldSeg => oldSeg.uri === newSeg.uri),
          )
          return {
            ...oldBitrate,
            segments: [...oldBitrate.segments, ...newSegmentInfo],
          }
        })
      })
    })
  }

  useEffect(() => {
    let next = () => {
      if (next === null) {
        return
      }
      setTimeOffset(Date.now())
      setTimeout(next, 300)
    }
    setTimeout(next, 300)
    return () => {
      // Do nothing on the next requestAnimationFrame
      next = null
    }
  }, [])

  useEffect(updateBitrates, [stream])
  useInterval(updateBitrates, 5000, true)

  const updateCurrentTime = newTime => {
    setCurrentTime(newTime)
    setLastUpdated(Date.now())
    setTimeOffset(Date.now())
  }

  let displayTime = playing ? currentTime - lastUpdated + timeOffset : pauseTime

  const updatePlaying = play => {
    setPlaying(play)
    if (play) {
      updateCurrentTime(pauseTime)
    } else {
      setPauseTime(displayTime)
    }
  }

  return (
    <div>
      <BasicNavbar />
      <DemoBox>
        <StatsPane>
          <CostChart currentTime={displayTime} bitrates={bitrates} />
          <BitrateChart currentTime={displayTime} bitrates={bitrates} />
        </StatsPane>
        <Media maxWidth={maxWidth}>
          <LoadingOverlay live={live} />
          <VideoPlayer
            autoPlay={true}
            onTimeUpdate={e => updateCurrentTime(e.target.currentTime * 1000)}
            hlsOptions={{ debug: false }}
            poster=""
            muted={true}
            src={stream}
            aspectRatio={aspectRatio}
            onLive={() => setLive(true)}
            onDead={() => setLive(false)}
            onPlaying={() => updatePlaying(true)}
            onPause={() => updatePlaying(false)}
          />
        </Media>
      </DemoBox>
    </div>
  )
}

const DemoBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  max-width: 1920px;
`

const StatsPane = styled.div`
  flex-basis: 0px;
  flex-grow: 1;
  color: white;
  padding: 20px;
`

const Media = styled.div`
  position: relative;
  flex-grow: 2;
  flex-basis: 0px;
  display: block;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '100%')};
  overflow: hidden;
`
