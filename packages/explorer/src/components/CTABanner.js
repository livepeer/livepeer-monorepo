import * as React from 'react'
import styled from 'styled-components'
import Button from './Button'

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
  display: flex;
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: var(--bg-dark);
  transition: all 0.3s linear;
  &.hidden {
    transform: translateY(100%);
  }
  & .hide-section {
    display: inline-flex;
    align-items: center;
  }
  & button {
    color: var(--primary);
    background: var(--bg-dark);
    cursor: pointer;
    border: none;
    outline: none;
  }
  & button.hide {
    color: var(--bg-dark);
    background: none;
    margin-right: 16px;
    font-size: 24px;
  }
`

export default CTABanner
