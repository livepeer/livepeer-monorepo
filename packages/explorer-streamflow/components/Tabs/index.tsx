/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'

export interface TabType {
  name: string
  href: string
  as: string
  isActive?: boolean
}

export default ({ tabs, variant = 'primary', ...props }) => {
  return (
    <div
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'border',
      }}
      {...props}
    >
      {tabs.map((tab: TabType, i: number) => {
        console.log(tab)
        return (
          <Link key={i} href={tab.href} as={tab.as} passHref>
            <a
              sx={{
                color: tab.isActive ? 'white' : 'muted',
                mr: 3,
                pb: '10px',
                fontSize: 1,
                fontWeight: 500,
                borderBottom: '2px solid',
                borderColor: tab.isActive ? 'primary' : 'transparent',
              }}
            >
              {tab.name}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
