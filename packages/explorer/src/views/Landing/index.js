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
    <Container>
      <ScrollToTopOnMount />
      <BasicNavbar />
      <LandingContent width="800px">
        <img
          src={`${process.env.PUBLIC_URL}/wordmark.svg`}
          width="240"
          alt="The glorious Livepeer wordmark"
        />
        <h3 style={{ letterSpacing: 8 }}>Protocol Explorer</h3>
        <br />
        <br />
        <div style={{ display: 'flex' }}>
          <InfoBox>
            <h2>
              <Icon use="explore" />&nbsp;
              {`Explore Your Account`}
            </h2>
            <p>
              Check your balance of Livepeer Tokens (LPT),
              and learn what you can do with them.
            </p>
            <br />
            <form
              style={{ maxWidth: '100%', width: 480 }}
              onSubmit={e => {
                e.preventDefault()
                const data = new FormData(e.target)
                history.push(`/accounts/${data.get('address')}`)
              }}
            >
              <SearchBar
                required
                name="address"
                type="search"
                pattern="^0x[a-fA-F0-9]{40}$"
                placeholder="Enter your ETH account address"
                onKeyDown={e => {
                  if (e.keyCode !== 13 || !e.target.value) return
                  document.getElementById('account-search-button').click()
                }}
              />
              <br />
              <br />
              <div style={{ textAlign: 'right' }}>
                <CTAButton type="submit">View Account</CTAButton>
              </div>
            </form>
          </InfoBox>
          <InfoBox>
            <h2>
              <Icon use="how_to_vote" />&nbsp;
              {`BOND your LPT to a Node`}
            </h2>
            <p>
              Bond to a Transcoder Node in the network to support
              them, and also earn a share of their rewards and fees.
            </p>
            <br />
            <p style={{ textAlign: 'right', margin: 0 }}>
              <CTAButton
                big
                type="submit"
                onClick={() => {
                  history.push('/transcoders')
                }}
              >
                SEE OPTIONS
              </CTAButton>
            </p>
          </InfoBox>
        </div>
      </LandingContent>
      <Footer />
    </Container>
  </React.Fragment>
)

class Video extends React.Component {
  state = { paused: true }
  togglePlay = async e => {
    const { target } = e
    const attr = 'controls'
    if (!target.paused) {
      target.removeAttribute(attr)
      await target.pause()
      this.setState({ paused: true })
    } else {
      target.setAttribute(attr, attr)
      await target.play()
      this.setState({ paused: false })
    }
  }
  render() {
    return (
      <div
        style={{
          position: 'relative',
          // video is 1080 x 1728
          paddingBottom: '62.5%',
          height: 0,
          boxShadow: '0 1px 20px 0px rgba(0, 0, 0, 0.5)',
          cursor: 'pointer',
        }}
      >
        <video
          onClick={this.togglePlay}
          onTouchStart={this.togglePlay}
          src={this.props.src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <div
          style={{
            display: !this.state.paused ? 'none' : 'flex',
            color: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Icon use="play_circle_outline" style={{ fontSize: 48 }} />
        </div>
      </div>
    )
  }
}

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
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(#000, #1b1b1b 320px);
  color: #fff;
`

const InfoBox = styled.div`
  display: inline-block;
  width: 50%;
  :nth-child(1) {
    margin-right: 1.5rem;
  }
  :nth-child(2) {
    margin-left: 1.5rem;
  }
  h2 {
    align-items: center;
    display: inline-flex;
  }
`

const SearchBar = styled.input`
  width: 100%;
  height: 48px;
  margin: 0;
  padding: 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  outline: 0;
  -webkit-appearance: textfield;
`

const CTAButton = styled.button`
  display: inline-block;
  color: #fff;
  padding: ${({ big }) => (big ? '15px 24px' : '8px 24px')};
  font-size: ${({ big }) => (big ? '16px' : '12px')};
  border-radius: 4px;
  background: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 0 1px inset;
  background: none;
  outline: 0;
  border: none;
  cursor: pointer;
`

export default Landing
