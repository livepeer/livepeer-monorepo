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
  background: none;
  color: #000;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: rgba(0, 0, 0, 0.2);
  }
  &.primary {
    background: var(--bg-dark);
    color: var(--white);
    box-shadow: none;
  }
  &.secondary {
    color: #000;
    background: none;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
  }
  &.outlined {
    color: var(--white);
    background: none;
    box-shadow: inset 0 0 0 1px var(--white);
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: rgba(0, 0, 0, 0.2);
  }
`

export const EditButton = styled(Button)`
  margin-top: 0px;
  width: 100%;
  text-align: center;
  justify-content: center;
  margin-left: 0;
`

export default Button
