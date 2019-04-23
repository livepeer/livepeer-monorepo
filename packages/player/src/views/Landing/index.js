import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default ({ query, changeURL }) => {
  const [search, setSearch] = useState('')
  const [redirect, setRedirect] = useState(null)
  if (redirect) {
    return <Redirect to={redirect} />
  }
  return (
    <Container>
      <Navbar />
      <img src="/wordmark.svg" width="240" alt="Livepeer logo" />
      <h3 style={{ letterSpacing: 8 }}>Media Player</h3>
      <br />
      <br />
      <p>Enter the URL of a video stream</p>
      <SearchForm
        onSubmit={e => {
          e.preventDefault()
          if (!search) {
            return
          }
          setRedirect(`/play?url=${encodeURIComponent(search)}`)
        }}
      >
        <SearchBar
          type="search"
          placeholder="example: http://example.com/stream.m3u8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <br />
        <br />
        <div style={{ textAlign: 'right' }}>
          <SearchButton>search</SearchButton>
        </div>
      </SearchForm>
      <Footer />
    </Container>
  )
}

const SearchForm = styled.form`
  display: block;
  max-width: 100%;
  width: 480px;
`

const Container = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 32px;
  padding-bottom: 33.33vh;
  background: #000;
  color: #fff;
`

const SearchBar = styled.input`
  width: 100%;
  height: 48px;
  margin: 0;
  padding: 16px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  outline: 0;
`

const SearchButton = styled.button`
  display: inline-block;
  color: #fff;
  padding: 8px 24px;
  border-radius: 4px;
  background: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 0 0 1px inset;
  background: none;
  outline: 0;
  border: none;
  cursor: pointer;
`
