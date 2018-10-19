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
        <InfoBox style={{ margin: '100px', width: 400, color: '#FFF' }}>
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
      >
        <div
          style={{
            width: '50%',
            height: '50%',
            margin: 'auto auto',
            textAlign: 'center',
          }}
        >
          <InfoBox>
            <h2>Stats on the Livepeer Protocol</h2>
            <p>
              Supermas ix a community-built analytics platform for smart
              contracts that pulls and visualizes economic data to drive
              actionable insights
            </p>
            <CTAButton
              href="https://www.youtube.com/watch?v=2RUFH4qTU7o"
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
          <InfoBox>
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
  flex-flow: column;
  align-items: center;
  justify-content: top;
  min-height: 90vh;
  background: #fff;
  @media (max-width: 1004px) {
    flex-flow: column !important;
    > div {
      width: 100% !important;
    }
  }
`

const InfoBox = styled.div`
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
`
const CTAButton = styled.a`
  display: inline-block;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: none;
  outline: 0;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 10px;
  :visited {
    text-decoration: none;
  }
`

export default Landing
