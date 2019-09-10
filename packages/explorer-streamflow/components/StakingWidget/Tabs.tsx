/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import {
  Tabs as ReachTabs,
  TabList as ReachTabList,
  Tab as ReachTab,
} from '@reach/tabs'

export const Tabs = props => <ReachTabs {...props} />

export const TabList = props => (
  <ReachTabList
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
      borderBottom: '1px solid',
      borderColor: 'border',
      mb: 2,
    }}
    {...props}
  />
)

export const Tab = props => (
  <ReachTab
    sx={{
      flex: 1,
      outline: 'none',
      textAlign: 'center',
      color: props.isSelected ? 'primary' : 'muted',
      pb: '10px',
      fontSize: 1,
      fontWeight: 500,
      borderBottom: '2px solid',
      borderColor: props.isSelected ? 'primary' : 'transparent',
    }}
    {...props}
  />
)
