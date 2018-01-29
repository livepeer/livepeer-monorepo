import styled from 'styled-components'

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: ${({ width }) => (typeof width === 'undefined' ? '100%' : width)};
  max-width: 100%;
  margin: 0 auto 120px auto;
  padding: 0 16px;
`

export default Content
