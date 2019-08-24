import styled from '@emotion/styled'

export const CardRow = styled.div({
  color: 'inherit',
  display: 'block',
  marginBottom: 24,
  ':last-child': {
    marginBottom: 0
  }
})

export const AvatarGroup = styled.div({
  display: 'flex',
  alignItems: 'center'
})

export const OrchestratorName = styled.a({
  color: 'rgba(255, 255, 255, .87)',
  cursor: 'pointer',
  transition: 'all .3s',
  borderBottom: '1px solid transparent !important',
  '&:hover': {
    color: '#6BE691',
    borderBottom: '1px solid #6BE691 !important',
    transition: 'all .3s'
  }
})
