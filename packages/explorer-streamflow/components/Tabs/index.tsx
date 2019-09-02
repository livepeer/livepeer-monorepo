/** @jsx jsx */
import { Styled, jsx } from 'theme-ui'
import Link from 'next/link'

export default ({ address, tabs, variant = 'primary', ...props }) => {
  return (
    <Styled.div
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'border'
      }}>
      {tabs.map((tab: any, i) => {
        return (
          <Link
            key={i}
            href={`/account/[address]${tab.slug && `/${tab.slug}`}`}
            as={`/account/${address}${tab.slug && `/${tab.slug}`}`}
            passHref>
            <Styled.div
              as="a"
              sx={{
                color: tab.isActive ? 'white' : 'muted',
                mr: 3,
                pb: '10px',
                fontSize: 1,
                fontWeight: 500,
                borderBottom: '1px solid',
                borderColor: tab.isActive ? 'primary' : 'transparent'
              }}>
              {tab.name}
            </Styled.div>
          </Link>
        )
      })}
    </Styled.div>
  )
}
