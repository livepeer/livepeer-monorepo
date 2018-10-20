import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from 'rmwc/Icon'
import {
  Content,
  BasicNavbar,
  Footer,
  ScrollToTopOnMount,
} from '../../components'

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
      <Content
        style={{
          backgroundImage: 'url("/static/images/overview.jpg")',
          backgroundSize: 'cover',
          flex: '1 1 auto',
          minHeight: '93vh',
          width: '50%',
          margin: 0,
          display: 'inline-block',
        }}
      >
        <InfoBox
          className="main-content"
          style={{ margin: '100px', width: 400, color: '#FFF' }}
        >
          <h1 style={{ color: '#FFFFFF' }}>How to Use the Explorer</h1>
          <p>
            What is a reward cut? What is a fee share?<br />
            Watch this video to learn how to assess and<br />
            bond to transcoders using the explorer
          </p>
          <CTAButton
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
      <Content
        style={{
          flex: '1 1 auto',
          minHeight: '93vh',
          width: '50%',
          display: 'inline-block',
          margin: 0,
          padding: '100px',
        }}
        className="content"
      >
        <div
          style={{
            width: '50%',
            height: '50%',
            margin: 'auto auto',
            textAlign: 'center',
          }}
          className="rightStat"
        >
          <InfoBox className="secondary-content">
            <h2>Stats on the Livepeer Protocol</h2>
            <p>
              Supermas is a community-built analytics platform for smart
              contracts that pulls and visualizes economic data to drive
              actionable insights.
            </p>
            <CTAButton
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
          </InfoBox>
          <InfoBox className="secondary-content">
            <h2>Livepeer Token Distribution</h2>
            <p>
              The initial token distribution was executed using a merklemine
              mechanism to allocate 63% of all token to the community.
            </p>
            <CTAButton
              href="https://www.youtube.com/watch?v=2RUFH4qTU7o"
              style={{
                background: 'inherit',
                color: '#000',
                outline: 'solid 2px #000',
              }}
            >
              Read More
            </CTAButton>
          </InfoBox>
        </div>
      </Content>
    </Container>
  </React.Fragment>
)

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const LandingContent = styled(Content)`
  animation: ${fadeIn} 1s linear 1;
`

const Container = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: top;
  min-height: 92vh;
  background: #fff;
  @media (min-width: 1440px) {
    div.content {
      padding: 60px 0 !important;
    }
    > div > div {
      width: 50% !important;
    }
    .secondary-content {
      max-width: 100% !important;
      width: 100% !important;
      margin: auto !important;
    }
  }
  @media (max-width: 1439px) {
    div.content {
      padding: 60px !important;
    }
    div.rightStat {
      width: 50% !important;
      a {
        margin-bottom: 30px !important;
      }
    }
  }
  @media (max-width: 1239px) {
    div.content {
      padding: 40px 0 !important;
    }
    div.rightStat {
      width: 80% !important;
      a {
        margin-bottom: 30px !important;
      }
    }
  }
  @media (max-width: 1004px) {
    flex-flow: column !important;
    > div {
      width: 100% !important;
    }
  }
  @media (max-width: 995px) {
    div {
      padding: 5px 25px !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    > div > div {
      margin: 10px !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    div.rightStat {
      margin: auto !important;
      width: 50% !important;
      a {
        margin-bottom: 30px !important;
      }
    }
    div.main-content {
      margin: 100px 10px !important;
    }
  }
  @media (max-width: 768px) {
    > div > div {
      margin: 10px !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    div.rightStat {
      margin: auto !important;
      width: 70% !important;
      a {
        margin-bottom: 30px !important;
      }
    }
  }
  @media (max-width: 595px) {
    div.rightStat {
      margin: auto !important;
      width: 95% !important;
      a {
        margin-bottom: 30px !important;
      }
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
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  color: #00ea86;
  :visited {
    text-decoration: none;
  }
`

export default Landing
