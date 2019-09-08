/** @jsx jsx */
import React from 'react'
import * as Utils from 'web3-utils'
import MaterialTable, { MTableToolbar, MTableCell } from 'material-table'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Flex, jsx, useThemeUI } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import QRCode from 'qrcode.react'
import { AvatarGroup, OrchestratorName } from './styles'
import { useApolloClient } from '@apollo/react-hooks'
import Link from 'next/link'
import { abbreviateNumber } from '../../lib/utils'

export default ({ transcoders }) => {
  const client = useApolloClient()
  const context = useThemeUI()

  // Apply theme-ui settings to material-ui component
  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: context.theme.colors.background,
      },
      secondary: {
        main: context.theme.colors.text,
      },
      background: {
        default: context.theme.colors.background,
        paper: context.theme.colors.background,
      },
      text: {
        primary: context.theme.colors.text,
        secondary: context.theme.colors.text,
      },
      action: {
        active: context.theme.colors.primary,
      },
    },
    typography: {
      fontFamily: context.theme.fonts.body,
    },
    overrides: {
      MuiTypography: {
        h6: {
          fontWeight: 'bold',
          lineHeight: 'initial',
          fontSize: 32,
        },
      },
      MuiTableSortLabel: {
        root: {
          fontSize: 14,
        },
        icon: {
          fontSize: 14,
        },
      },
      MuiToolbar: {
        regular: {
          paddingRight: '0',
          paddingLeft: '0',
          minHeight: 'initial',
          width: '100%',
          ['@media (min-width: 600px)']: {
            minHeight: 'initial',
          },
          ['@media (min-width: 0px) and (orientation: landscape)']: {
            minHeight: 'initial',
          },
        },
      },
      MuiInput: {
        underline: {
          '&:before': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.42)',
          },
        },
      },
      MuiTableRow: {
        hover: {
          '&:hover': {
            cursor: 'initial !important',
            backgroundColor: `${context.theme.colors.surface} !important`,
            transition: 'background-color .2s, color .2s',
          },
          '&:hover a': {
            borderBottom: `1px solid`,
            borderColor: 'rgba(255, 255, 255, .4) !important',
          },
        },
        footer: {
          '&:hover': {
            backgroundColor: 'initial',
          },
        },
      },
      MuiTableCell: {
        head: {
          padding: 20,
        },
        root: {
          borderBottom: 0,
          padding: '14px 20px 14px 20px',
          fontSize: 14,
          '&:first-child': {
            paddingLeft: 32,
          },
          '&:last-child': {
            paddingRight: 32,
          },
        },
      },
      MuiPaper: {
        root: {
          width: '100%',
        },
        elevation2: {
          boxShadow: 'none',
        },
      },
    },
  })

  const Toolbar = (props: any) => (
    <Flex sx={{ mb: 4, alignItems: 'center' }}>
      <Orchestrators
        style={{
          color: context.theme.colors.primary,
          width: 36,
          height: 36,
          marginRight: 10,
        }}
      />
      <MTableToolbar {...props} />
    </Flex>
  )

  const Cell = (props: any) => {
    let cellValue: any
    switch (props.columnDef.field) {
      case 'id':
        cellValue = (
          <AvatarGroup>
            <QRCode
              style={{
                borderRadius: 1000,
                width: 32,
                height: 32,
                marginRight: 16,
              }}
              fgColor={`#${props.value.substr(2, 6)}`}
              value={props.value}
            />
            <Link href="/[account]" as={`/${props.value}`} passHref>
              <OrchestratorName>
                {props.value.substring(0, 10)}...
              </OrchestratorName>
            </Link>
          </AvatarGroup>
        )
        break
      case 'totalStake':
        let num = props.value
          ? Number(Utils.fromWei(props.value)).toFixed(2)
          : 0
        cellValue = (
          <span style={{ fontFamily: 'Akkurat-Mono' }}>
            {abbreviateNumber(num)}
          </span>
        )
        break

      case 'rewardCut':
        cellValue = (
          <span style={{ fontFamily: 'Akkurat-Mono' }}>
            {props.value / 10000}%
          </span>
        )
        break
      case 'feeShare':
        cellValue = (
          <span style={{ fontFamily: 'Akkurat-Mono' }}>
            {props.value / 10000}%
          </span>
        )
        break
      default:
        cellValue = props.value
    }
    return <MTableCell {...props} value={cellValue} />
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <MaterialTable
        columns={[
          {
            title: 'Name',
            field: 'id',
          },
          {
            title: 'Fee Cut',
            field: 'feeShare',
            type: 'numeric',
          },
          {
            title: 'Reward Cut',
            field: 'rewardCut',
            type: 'numeric',
          },
          {
            title: 'Stake',
            field: 'totalStake',
            defaultSort: 'desc',
            type: 'numeric',
          },
        ]}
        data={transcoders}
        title="Orchestrators"
        onRowClick={(_event, rowData) =>
          client.writeData({
            data: {
              selectedOrchestrator: rowData,
            },
          })
        }
        localization={{
          toolbar: {
            searchPlaceholder: 'Filter',
          },
        }}
        options={{
          paging: false,
          search: true,
          draggable: false,
          showTextRowsSelected: false,
          headerStyle: { position: 'sticky', top: 0 },
          rowStyle: rowData => {
            return {
              backgroundColor:
                rowData.id == '0xe9e284277648fcdb09b8efc1832c73c09b5ecf59'
                  ? '#1E2026'
                  : 'transparent',
            }
          },
        }}
        components={{
          Toolbar: props => <Toolbar {...props} />,
          Cell: props => <Cell {...props} />,
        }}
      />
    </MuiThemeProvider>
  )
}
