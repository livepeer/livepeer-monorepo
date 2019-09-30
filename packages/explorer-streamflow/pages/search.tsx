/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, Flex, Box, Styled } from 'theme-ui'
import Page from '../layouts/main'
import Search from '../static/img/search.svg'
import Router from 'next/router'

function handleSubmit(e) {
  e.preventDefault()
  const [_, input] = e.target.children
  Router.push(`/account/[account]/[slug]`, `/account/${input.value}/staking`)
}
export default () => {
  return (
    <Page>
      <Flex
        sx={{
          mt: '20%',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Styled.h1 sx={{ fontSize: 7, alignSelf: 'center' }}>Search</Styled.h1>
        <p sx={{ mb: 4, color: 'muted', alignSelf: 'center' }}>
          Look up orchestrators and delegators by their Ethereum address
        </p>
        <form
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: 600,
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            borderRadius: 5,
            border: '1px solid',
            borderColor: 'border',
          }}
        >
          <Search
            sx={{ position: 'absolute', left: 2, mr: 1, color: 'muted' }}
          />
          <input
            name="search"
            sx={{
              py: 2,
              pl: 6,
              pr: 2,
              border: 0,
              boxShadow: 'none',
              width: '100%',
              color: 'text',
              fontSize: 2,
              bg: 'transparent',
            }}
            placeholder="Search by Address"
            type="search"
          />
        </form>
      </Flex>
    </Page>
  )
}
