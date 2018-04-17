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
  // box-shadow: 0 0 0 1px inset;
  // background: #fff;
  // border: 1px solid #ccc;
  background: var(--bg-dark);
  color: var(--white);
  outline: none;
  border: none;
  cursor: pointer;
  :disabled {
    cursor: not-allowed;
  }
`

export default Button
