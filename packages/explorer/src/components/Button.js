import styled from 'styled-components'

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  margin: 8px;
  background-image: none !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  outline: none;
  border: none;
  cursor: pointer;
  background: #fff;
  color: #000;
  box-shadow: inset 0 0 0 1px var(--grey);
  :disabled {
    cursor: not-allowed;
  }
  &.primary {
    background: var(--bg-dark);
    color: var(--white);
    box-shadow: none;
  }
  &.secondary {
    background: #fff;
    color: #000;
    box-shadow: inset 0 0 0 1px var(--grey);
  }
`

export default Button
