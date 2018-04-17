import * as React from 'react'
import styled from 'styled-components'

const InlineHint = styled(
  class InlineHint extends React.Component {
    static defaultProps = {
      flag: 'help_default',
    }
    state = {
      hidden: !!localStorage.getItem(`help_${this.props.flag}`),
    }
    onHide = () => {
      localStorage.setItem(`help_${this.props.flag}`, 'true')
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
  position: relative;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  padding: 32px;
  background: #eaedec;
  box-shadow: 0 1px 0 1px #c0e8d7;
  margin-bottom: 24px;
  transition: all 0.3s linear;
  &.hidden {
    transform: rotateX(-90deg);
    height: 0;
    opacity: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  .hide-section {
    position: absolute;
    width: auto;
    top: 0;
    right: 0;
    .hide {
      color: var(--bg-dark);
      background: none;
      margin: 0;
      font-size: 32px;
      border: none;
      padding: 8px 16px;
      cursor: pointer;
      outline: none;
    }
  }
  > * {
    width: 100%;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 8px 0;
    font-weight: normal;
  }
  p {
    margin: 8px 0;
  }
`

export default InlineHint
