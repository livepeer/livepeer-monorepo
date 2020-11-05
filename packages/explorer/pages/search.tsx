import { Flex, Styled } from 'theme-ui'
import SearchIcon from '../public/img/search.svg'
import Router from 'next/router'
import { withApollo } from '../lib/apollo'
import { getLayout } from '../layouts/main'

function handleSubmit(e) {
  e.preventDefault()
  const [_, input] = e.target.children
  Router.push(`/accounts/[account]/[slug]`, `/accounts/${input.value}/staking`)
}

const Search = () => {
  return (
    <Flex
      sx={{
        mt: [3, 3, 3, 5],
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Styled.h1
        sx={{
          fontSize: [3, 3, 4, 5],
          display: 'flex',
          mb: 3,
          alignItems: 'center',
        }}
      >
        <SearchIcon
          sx={{
            width: [20, 20, 20, 26],
            height: [20, 20, 20, 26],
            color: 'primary',
            mr: 2,
          }}
        />
        Search
      </Styled.h1>
      <form
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          borderRadius: 5,
          border: '1px solid',
          borderColor: 'border',
        }}
      >
        <button sx={{ display: 'flex', alignItems: 'center' }} type="submit">
          <SearchIcon
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              right: 2,
              mr: 1,
              color: 'muted',
            }}
          />
        </button>
        <input
          required
          name="search"
          sx={{
            outlineColor: '#00EB88',
            py: 2,
            pl: 2,
            pr: 8,
            border: 0,
            boxShadow: 'none',
            width: '100%',
            color: 'text',
            fontSize: 2,
            bg: 'transparent',
          }}
          placeholder="Search Account"
          type="search"
        />
      </form>
    </Flex>
  )
}

Search.getLayout = getLayout

export default withApollo({
  ssr: false,
})(Search)
