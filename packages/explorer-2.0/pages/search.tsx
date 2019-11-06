/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import Page, { getLayout } from '../layouts/main'
import Search from '../static/img/search.svg'
import Router from 'next/router'
import { withApollo } from '../lib/apollo'

function handleSubmit(e) {
  e.preventDefault()
  const [_, input] = e.target.children
  Router.push(`/accounts/[account]/[slug]`, `/accounts/${input.value}/staking`)
}

const SearchPage: any = () => {
  return (
    <>
      <Flex
        sx={{
          mt: 5,
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Styled.h1 sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
          <Search
            sx={{
              width: 26,
              height: 26,
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
            <Search
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
    </>
  )
}

SearchPage.getLayout = getLayout

export default SearchPage
