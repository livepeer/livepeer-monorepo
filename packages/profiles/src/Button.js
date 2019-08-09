import styled from 'styled-components'

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 16px 17px;
  margin: 0 8px;
  background-image: none !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: black;
  color: white;
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
  margin-top: 0;
  margin-left: 0;
  width: 100%;
  text-align: center;
  justify-content: center;
`

export default Button
