import * as React from 'react'
import { Icon } from 'rmwc/Icon'
import {
  Avatar,
  Banner,
  BasicNavbar,
  Button,
  Content,
  Footer,
  PageHeading,
  ScrollToTopOnMount,
  TabLink,
  Tabs,
} from '../../components'

const TokenView = ({ history, ...props }) => {
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar />
      <Banner>
        <PageHeading className="page-heading">
          <Icon
            stategy="url"
            use="/static/images/lpt-light.svg"
            style={{ width: 32 }}
          />&nbsp;Livepeer Token Distribution
        </PageHeading>
        <div
          style={{
            paddingBottom: 32,
            fontSize: 18,
            lineHeight: 3,
            fontFamily: 'monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '50%', paddingRight: 16, paddingTop: 32 }}>
              <p style={{ fontSize: 14 }}>
                {`Livepeer distributed 6.3 million Livepeer Token (LPT) to the community upon genesis. 2.5 million eligible accounts can each earn 2.4 LPT. There are two ways to get token:`}
              </p>
              <p>
                Slow Start: March 16 - July 26 2018
                <br />
                <span style={{ fontSize: 14 }}>
                  If you had greater than 0.1 ETH in a private key account on
                  March 16th, you can generate 2.44 LPT now.
                </span>
              </p>

              <p>
                Claim Period: July 26, 2018 until all accounts are mined
                <br />
                <span style={{ fontSize: 14 }}>
                  2.5 Million accounts each with 2.44 LPT will be unclaimed, and
                  anyone can claim token using this application (live July
                  26th).
                </span>
              </p>
              <Button
                onClick={() => {
                  //window.location.hash = '#/mine'

                  /***
                   * Push mine route onto history stack of the browser
                   * to go to mining page
                   */
                  history.push('/mine')
                }}
                style={{
                  background: 'var(--primary)',
                  color: '#000',
                  fontSize: 16,
                  fontWeight: 400,
                  padding: '16px 32px',
                }}
              >
                Get Token &rarr;
              </Button>
            </div>
            <div
              style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                width: '50%',
                maxHeight: 250, // makes it overlap slightly with Content section
                maxWidth: 640,
                paddingLeft: 16,
              }}
            >
              <Video
                src="/static/media/lpt.mp4"
                style={{
                  background: '#000',
                  border: '2px solid rgba(255,255,255,.1)',
                }}
              />
            </div>
          </div>
        </div>
      </Banner>
      <Content width="800px">
        <h2>Frequently Asked Questions</h2>
        <ul>
          {[
            {
              text: 'What are the key points I need to know?',
              id: 'key-points',
            },
            {
              text: 'Am I eligible?',
              id: 'am-i-eligible',
            },
            {
              text: 'How did Livepeer distribute token?',
              id: 'how-distribute',
            },
            {
              text: `I'm not eligible or I want to get more token`,
              id: 'i-want-more',
            },
            {
              text: 'I have a JSON keystore file, how do I get token?',
              id: 'how-keystore',
            },
            {
              text:
                'I have a hardware wallet eligible account. How do I get token?',
              id: 'how-hardware',
            },
          ].map(({ text, id }) => {
            return (
              <li key={id} style={{ marginBottom: 8 }}>
                <a
                  href={`#${id}`}
                  onClick={e => {
                    e.preventDefault()
                    document.getElementById(id).scrollIntoView()
                    window.scrollBy(0, -80)
                  }}
                >
                  {text}
                </a>
              </li>
            )
          })}
        </ul>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="key-points">
          What are the Key Points I need to Know?
        </h3>
        <p>
          Livepeer launched on Ethereum's Mainnet on April 30, 2018. Upon
          launch, the protocol included rules to generate 10,000,000 initial
          Livepeer token (LPT). Any ETH account holder with 0.1ETH on March
          16th, 2018 are eligible to generate 2.44 LPT as a part of this
          distribution.
        </p>
        <p>
          <b>Safety</b>: The Livepeer project will NOT be asking you for ETH,
          BTC, USD, or any money. Livepeer is not selling anything at this
          point. If someone claiming to represent Livepeer asks you to send them
          any currency, please report this as fraud to fraud@livepeer.org.
        </p>
        <p>
          <b>Amount</b>: 2.44 LPT into each eligible account Eligibility: Any
          Ethereum account private key holder with greater than 0.1 ETH in their
          account on March 16th (Ethereum block # 5,264,265) can generate 2.44
          LPT token using the application above until August 1st, after which
          the slow start period ends.
        </p>
        <p>
          <b>Timeframe</b>: During the slow start period which will last through
          ~August 1st 2018, users can only generate their own token in their own
          eligible ETH account. After this period, users can generate token in
          any eligible account, and the amount that they generate for themselves
          will grow as more time passes.
        </p>
        <p>
          <b>Alternate ways to get LPT</b>: Users who wish to participate but
          don’t meet the threshold can generate token following the 3 month slow
          start, or can participate in the community campaign to earn LPT.
        </p>
        <p>
          <b>Stake and grow</b>: Over time the majority of token will be earned
          through doing work on the network as a token holder that stakes token
          or as a transcoder. Once you generate your token, stake towards a
          transcoder to earn inflationary token every day.
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="am-i-eligible">
          Am I Eligible?
        </h3>
        <p>
          Any ETH account holder with 0.1ETH on March 16th, 2018 are eligible to
          generate 2.44 LPT as a part of this distribution. If you're not sure,
          paste your ETH account here and double check.
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="how-distribute">
          How did Livepeer Distribute Token?
        </h3>
        <p>
          The initial distribution prioritizes open access and wide distribution
          to users who wish to participate. The genesis state will specify the
          rules for generation of 10,000,000 initial LPT. This initial token
          will be generated and released to the crowd, team, early supporters,
          and community in a gradual rollout over the next 36 months. Ownership
          in the network will be decentralized and proportional from the get go,
          with open access to the Livepeer token for the community being baked
          in from day one.
        </p>
        <p>
          Core team and pre-sale participants will be vesting over time, such
          that no centralized parties ever control a majority of the distributed
          token used for staking within the Livepeer network. The token pool
          will be distributed as follows:
        </p>
        <ul>
          <li>
            <b>Founders and early team</b>: 12.35% — vesting over 36 months from
            network launch.
          </li>
          <li>
            <b>Pre-sale purchasers</b>: 19% — vesting over 18 months from
            network launch. Purchasers have facilitated 3 years of runway for
            Livepeer’s lean, engineering focused core team.
          </li>
          <li>
            <b>Crowd</b>: 63.437% — generated over 3–18 months using the
            MerkleMine algorithm.
          </li>
          <li>
            <b>Grant</b>: 0.213% — immediate issued to a couple early advisors
            and contributors who helped Livepeer get off the ground.
          </li>
          <li>
            <b>Long term project endowment</b>: 5% — to be used to ensure the
            longevity of the Livepeer project.
          </li>
        </ul>

        <p>
          The estimated token generation over the next 36 months looks as
          follows:
        </p>
        <p>
          <img
            src="https://livepeer-assets.s3.amazonaws.com/token-release.png"
            alt="distribution"
          />
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="i-want-more">
          I'm not Eligible or I want to get more Token
        </h3>
        <p>
          Not eligible for the slow start period? Join the Decentralized
          Livepeer Community Node Telegram group to earn LPT, as well as
          community calls, meetups, hackathons, grant programs and more. In
          August, the slow start period ends and anyone can generate token from
          the remaining ~6.3MM ETH Accounts with LPT that has not been claimed.
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="how-keystore">
          I have a JSON Keystore File, how do I get token?
        </h3>
        <p>
          If you do not want to use the DApp, and you have a JSON keystore file
          for your eligible account, you can use the MerkleMine command line
          script included in{' '}
          <a href="https://github.com/livepeer/merkle-mine">
            this github repository
          </a>
          to generate and submit your proof to the MerkleMine generate
          transaction. This may be useful if you’d like to automate MerkleMining
          across many accounts.
        </p>
        <p>
          Having Trouble? Check this walkthrough first
          (https://forum.livepeer.org/t/common-troubleshooting-questions-merklemine-client-scripts/206)
        </p>

        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="how-hardware">
          I have a hardware wallet eligible account. How do I get token?
        </h3>
        <p>
          See{' '}
          <a href="https://forum.livepeer.org/t/how-to-generate-livepeer-token-using-mycrypto-myetherwallet-ledger-trezor-support/209">
            this forum post
          </a>
          for instructions on how to generate token using a Ledger Wallet and
          MyCrypto.
        </p>
      </Content>
    </React.Fragment>
  )
}

export default TokenView

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
            ...this.props.style,
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
