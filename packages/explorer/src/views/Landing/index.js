import React from 'react'
import styled from 'styled-components'
import { Content, BasicNavbar, ScrollToTopOnMount } from '../../components'

const Landing = ({ history, ...props }) => (
  <React.Fragment>
    <Container
      style={{
        margin: 0,
        flexFlow: 'row',
      }}
    >
      <ScrollToTopOnMount />
      <BasicNavbar history={history} />
      <Content id="left-content" className="content">
        <InfoBox
          className="main-content"
          style={{ margin: '100px', width: 400, color: '#FFF' }}
        >
          <h1 style={{ color: '#FFFFFF' }}>How to Use the Explorer</h1>
          <p
            style={{
              fontWeight: 'bold',
            }}
          >
            What is a reward cut? What is a fee share?
            <br />
            Watch this video to learn how to assess and
            <br />
            bond to transcoders using the explorer
          </p>
          <CTAButton
            target="_blank"
            href="https://www.youtube.com/watch?v=2RUFH4qTU7o"
            style={{
              background: '#00EA86',
              color: '#000',
            }}
          >
            Watch the video
          </CTAButton>
        </InfoBox>
      </Content>
      <Content id="right-content" className="content">
        <div
          style={{
            textAlign: 'center',
          }}
          className="rightStat"
        >
          <h2>Stats on the Livepeer Protocol</h2>
          <p>
            Supermax is a community-built analytics platform for smart
            contracts. Supermax pulls Livepeer data from the blockchain and
            visualizes it to drive actionable insights.
          </p>
          <CTAButton
            target="_blank"
            href="https://supermax.cool/livepeer"
            style={{
              background: 'inherit',
              color: '#000',
              outline: 'solid 2px #000',
              marginBottom: '80px',
            }}
          >
            Visit Supermax
          </CTAButton>
          <h2>Livepeer Token Distribution</h2>
          <p>
            The initial token distribution was executed using a merklemine
            mechanism to allocate 63% of all token to the community.
          </p>
          <CTAButton
            target="_blank"
            href="https://medium.com/livepeer-blog/the-end-of-the-initial-livepeer-token-distribution-6fa9894f0f16"
            style={{
              background: 'inherit',
              color: '#000',
              outline: 'solid 2px #000',
              margin: '0 0 20px',
            }}
          >
            Read More
          </CTAButton>
        </div>
      </Content>
    </Container>
  </React.Fragment>
)

const Container = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: top;
  min-height: 92vh;
  background: #fff;
  div#left-content {
    padding: 0;
    background-image: url('/static/images/overview.jpg');
    background-size: cover;
    flex: 1 1 auto;
    min-height: 100vh;
    width: 50%;
    margin: 0;
    display: inline-block;
  }
  div#right-content {
    flex: 1 1 auto;
    display: inline-block;
    margin: 0;
  }
  .content {
    width: 50%;
    h1,
    h2,
    button {
    }
    h1 {
      font-size: 50px;
      font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial,
        sans-serif;
      letter-spacing: 0.025em;
    }
    h2 {
      font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial,
        sans-serif;
      font-size: 22px;
    }
    p {
      font-size: 14px;
      letter-spacing: 0.09em;
    }
  }
  div.rightStat {
    width: 50%;
    margin: auto;
  }
  #content div {
    width: 50%;
  }
  @media (min-width: 1440px) {
    div.rightStat {
      width: 40%;
    }
  }
  @media (max-width: 1005px) {
    flex-flow: column !important;
    #left-content {
      width: 100% !important;
    }
    div.main-content {
      margin: 100px 40px !important;
    }
    div.content {
      width: 80% !important;
    }
    div.rightStat {
      margin: auto !important;
      width: 90% !important;
    }
  }
  @media (max-width: 595px) {
    div.rightStat {
      margin: auto !important;
      width: 95% !important;
    }
    div.main-content {
      margin: 80px 10px !important;
    }
    div.content {
      width: 100% !important;
    }
  }
`

const InfoBox = styled.div`
  width: 400px;
  h2 {
    align-items: center;
    text-align: center;
    display: inline-flex;
    letter-spacing: 0.4em;
    width: 100%;
    margin: 0;
  }
  h1 {
    letter-spacing: 0.4em;
  }
  p {
    margin: 20px auto;
  }
  @media (max-width: 525px) {
    margin: 50px auto !important;
    max-width: 100% !important;
    h1 {
      font-size: 22px !important;
    }
    h2 {
      font-size: 18px !important;
    }
    p {
      font-size: 14px !important;
    }
  }
`
const CTAButton = styled.a`
  display: inline-block;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: none;
  outline: 0;
  border: none;
  font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial, sans-serif;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  color: #00ea86;
  :visited {
    text-decoration: none;
  }
`

export default Landing
