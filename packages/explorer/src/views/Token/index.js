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
        <h2 style={{ margin: 0 }}>
          A tradeoff between scarcity, inflation, and time
        </h2>
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
              <p style={{ margin: '2px auto' }}>
                Scarcity:&nbsp;<span style={{ fontSize: '14px' }}>
                  As of July 26th, 2018, the Livepeer protocol specifies that
                  2.44 LPT can be generated into 2 59M Ethereum accounts
                  totaling a release of 6.3M LPT. These tokens are available for
                  anyone to claim on a first-come first-serve basis. You can
                  claim them using the Livepeer Miner, or you can write a
                  programming script to claim more tokens.&nbsp;
                  <a href="https://forum.livepeer.org/t/the-economics-of-generating-livepeer-token-after-the-merklemine-slow-start-ends-and-claim-period-begins-on-7-26/317">
                    Learn more
                  </a>
                </span>
              </p>
              <p style={{ margin: '15px auto 0' }}>
                Inflation:&nbsp;<span style={{ fontSize: '14px' }}>
                  Livepeer token holders bond token towards a transcoder once
                  they get their LPT and earn additional Livepeer token every
                  day because Livepeer is an inflationary delegation protocol.
                  The longer you wait to claim LPT, the more days you forgo
                  inflationary rewards.
                </span>
              </p>
              <p style={{ margin: '15px auto' }}>
                Time:&nbsp;<span style={{ fontSize: '14px' }}>
                  Mining any of the 2.5M accounts generates 2.4 LPT for each
                  account. A portion of the 2.4 LPT will be allocated to you for
                  claiming the account. As time passes, the portion allocated to
                  the miner for each round of mining will increase.
                </span>
              </p>
              <Button
                onClick={() => {
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
                  borderRadius: '5px',
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
        <h2>Key Points to Claim LPT using the Livepeer Miner</h2>
        <ul>
          <li>
            Anyone can claim LPT for unclaimed eligible Ethereum accounts. You
            do not need to provide the eligible ethereum addresses. Livepeer
            provides and submits the eligible Ethereum addresses for you.
          </li>
          <li>
            Each round of Livepeer Mining can claim LPT for 20 unclaimed
            accounts. You can claim as many of the eligible unclaimed accounts
            as you want by mining LPT tokens multiple times or writing a script
            that claims more accounts.
          </li>
          <li>
            When you mine an unclaimed account, the 2.4 LPT is split between you
            and the account holder. The portion of LPT the miner receives grows
            proportionally with every block that passes between the start block
            of 6,034,099 on July 26th. However, given their scarcity of LPT,
            they will be available on a first come first serve basis.
          </li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <ul>
          {[
            {
              text: 'How does Livepeer work?',
              id: 'livepeer-works',
            },
            {
              text: 'How can Livepeer Token be used?',
              id: 'livepeer-usage',
            },
            {
              text: 'Is Livepeer up and running?',
              id: 'livepeer-running',
            },
            {
              text: `How did Livepeer distribute token?`,
              id: 'token-distribute',
            },
            {
              text: 'How do I submit a larger number of transactions?',
              id: 'large-transaction-submition',
            },
            {
              text: 'Am I eligible to claim LPT?',
              id: 'eligibility',
            },
            {
              text: 'How much LPT do you get per submission?',
              id: 'amount-lpt',
            },
            {
              text: 'How much does it cost to submit a proof? ',
              id: 'cost-proof',
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
        <h3 style={{ fontWeight: '400' }} id="livepeer-works">
          How does Livepeer work?
        </h3>
        <p>
          Livepeer is an open source project that is focused on decentralizing
          live video streaming over the internet. Content creators send video
          into the Livepeer network, and the network takes care of transcoding
          it into all the different formats necessary to reach the majority of
          the devices on the planet, and distributing it to as many users as
          want to consume it. &nbsp;
          <a href="https://medium.com/livepeer-blog/livepeer-for-beginners-3b49945c24a7">
            Read Livepeer For Beginners for more.
          </a>
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="livepeer-usage">
          How can Livepeer Token be used?
        </h3>
        <p>
          The main use of LPT is to bond it towards a transcoder. Token holders
          can either do transcoding work themselves, or bond their LPT towards a
          Transcoder node who does the work on their behalf. Bonding LPT means
          depositing some token into a smart contract, which is locked up for a
          period of time (currently one week) before it can be withdrawn. This
          serves as a security deposit which can be taken away if the user does
          not act honestly. Transcoders who do the work earn ETH fees from
          content creators who pay to use the network, as well as inflationary
          LPT. Transcoders share those fees and rewards with token holders who
          bond towards them. You can head to the Transcoders tab to see how much
          in fees and rewards each Transcoder is willing to share with its token
          holders. The work that users who bond have the right to do comes in
          two forms:
          <ol>
            <li>running transcoding nodes</li>
            <li>bond to a transcoder.</li>
          </ol>
          <a href="https://forum.livepeer.org/t/what-can-i-use-lpt-for/178">
            Read more on How to Use LPT
          </a>
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="livepeer-running">
          Is Livepeer up and running?
        </h3>
        <p>
          Yes, Livepeer launched to mainnet on April 30th and is in alpha.
          <a href="https://medium.com/livepeer-blog/launching-the-livepeer-network-50dc7be7840">
            You can read about the launch here.
          </a>
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="token-distribute">
          How did Livepeer distribute token?
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
        <h3 style={{ fontWeight: '400' }} id="large-transaction-submition">
          How do I submit a larger number of transactions?
        </h3>
        <p>
          The point and click tools above are for those looking to get a
          moderate amount of token to start staking in an easy, user friendly
          way. For those looking to submit a large number of transactions to
          generate many LPT, you may need to write some custom scripts to
          automate&nbsp;
          <a href="https://forum.livepeer.org/t/the-economics-of-generating-livepeer-token-after-the-merklemine-slow-start-ends-and-claim-period-begins-on-7-26/317">
            the process.
          </a>
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="eligibility">
          Am I eligible to claim LPT?
        </h3>

        <p>
          Anyone can claim LPT for unclaimed eligible Ethereum accounts during
          the Claim Period, from July 26th, 2018 until all accounts are claimed.
        </p>

        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="amount-lpt">
          How much LPT do you get per submission?
        </h3>
        <p>
          Each time you click get token you generate a transaction that contains
          20 proofs for 20 eligible Ethereum accounts. The LPT is split between
          you, the caller, and the original account owner whom you mine token
          for, in proportion to how far into the claim period we are. Early on
          the portion you, the caller, gets is very small, but it grows over
          time. As an example, 500,000 blocks into the claim period, the caller
          would get 500,000 / 2,500,000 * 2.44 LPT, or 1 5th of the 2.44 LPT ==
          0.49 LPT for one single proof. The original account owner would get
          the rest. The portion of LPT the caller receives grows proportionally
          with every block that passes between the start block of 6,034,099 on
          July 26th. However, given their scarcity of LPT, they will be
          available on a first come first serve basis.
        </p>
        <hr style={{ border: '1px solid #ccc', width: '100%' }} />
        <h3 style={{ fontWeight: '400' }} id="cost-proof">
          How much LPT do you get per submission?
        </h3>
        <p>
          Livepeer is not selling any LPT, as there is no crowd sale, ICO or
          investment opportunity. No one from Livepeer will ask you for money.
          However, in order to submit a transaction to generate LPT, you have to
          pay the gas cost required to get transactions confirmed on the
          blockchain, and this price varies quite a bit from hour to hour on the
          network in response to market conditions. To learn more about
          potential costs per proof,&nbsp;
          <a href="https://forum.livepeer.org/t/the-economics-of-generating-livepeer-token-after-the-merklemine-slow-start-ends-and-claim-period-begins-on-7-26/317">
            read more
          </a>
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
