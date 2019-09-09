/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import { useWeb3Context } from 'web3-react'
import Header from './components/Header'
import Input from './components/Input'
import Tabs from './components/Tabs'
import ProjectionBox from './components/ProjectionBox'
import Footer from './components/Footer'

export default ({ transcoder, protocol }) => {
  let context = useWeb3Context()

  return (
    <Box
      sx={{
        width: '100%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 5,
        backgroundColor: '#1E2026',
      }}
    >
      <Header transcoder={transcoder} />
      <div sx={{ p: 2 }}>
        <Tabs />
        <Input protocol={protocol} />
        <ProjectionBox />
        <Footer context={context} />
      </div>
    </Box>
  )
}
