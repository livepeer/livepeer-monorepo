/** @jsx jsx */
import { jsx } from 'theme-ui'
import Link from 'next/link'
import Card from '../Card'

export default ({ delegate = null }) => {
  return (
    <Link
      href={`/accounts/[account]/[slug]`}
      as={`/accounts/${delegate.id}/campaign`}
      passHref
    >
      <a>
        <Card
          sx={{
            mb: 2,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, .04)' },
          }}
          title="Staked Towards"
          subtitle={
            <div
              sx={{
                fontSize: 5,
                fontWeight: 'text',
                color: 'text',
                lineHeight: 'heading',
              }}
            >
              {process.env.THREEBOX_ENABLED && delegate.threeBoxSpace.name
                ? delegate.threeBoxSpace.name
                : delegate.id.replace(delegate.id.slice(7, 37), '…')}
            </div>
          }
        />
      </a>
    </Link>
  )
}
