import styled from 'styled-components'

const Banner = styled.div`
  background: radial-gradient(at 50% 150%, rgba(23, 126, 137, 0.8), #000 75%);
  height: ${({ height }) => (typeof height === 'undefined' ? '240px' : height)};
  margin: 0 auto;
  padding: 32px;
  color: #fff;
  text-align: center;
`

export default Banner
