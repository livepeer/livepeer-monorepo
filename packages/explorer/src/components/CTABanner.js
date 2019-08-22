import * as React from 'react'
import styled from 'styled-components'

const CTABanner = styled(
  class CTABanner extends React.Component {
    static defaultProps = {
      flag: 'cta_default',
    }
    state = {
      hidden: !!localStorage.getItem(`cta_${this.props.flag}`),
    }
    onHide = () => {
      localStorage.setItem(`cta_${this.props.flag}`, 'true')
      this.setState({ hidden: true })
    }
    render() {
      const { className, children } = this.props
      const { hidden } = this.state
      return (
        <div className={`${className}${hidden ? ' hidden' : ''}`}>
          <div className="hide-section">
            <button className="hide" onClick={this.onHide}>
              &times;
            </button>
          </div>
          {children}
        </div>
      )
    }
  },
)`
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: var(--bg-dark);
  transition: all 0.3s linear;
  &.hidden {
    transform: translateY(200%);
  }
  & .hide-section {
    display: inline-flex;
    align-items: center;
  }
  & button {
    color: var(--primary);
    background: var(--bg-dark);
    cursor: pointer;
    box-shadow: none;
    border: none;
  }
  & button.hide {
    color: var(--bg-dark);
    background: none;
    margin-right: 16px;
    font-size: 24px;
  }
  // message section
  & div:nth-child(2) {
    width: 100%;
    align-items: center;
    display: inline-flex;
  }
  // button section
  & div:nth-child(3) {
    min-width: 320px;
    text-align: right;
  }
  @media (max-width: 640px) {
    flex-flow: row wrap;
    & .hide-section {
      width: 100%;
      margin-bottom: 16px;
    }
    & div:nth-child(3) {
      margin-top: 16px;
      width: 100%;
    }
  }
`

export default CTABanner
