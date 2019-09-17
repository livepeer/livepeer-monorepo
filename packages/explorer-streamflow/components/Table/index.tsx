/** @jsx jsx */
import React from 'react'
import * as Utils from 'web3-utils'
import MaterialTable, { MTableToolbar, MTableCell } from 'material-table'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Flex, jsx, useThemeUI } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import QRCode from 'qrcode.react'
import { createMuiTheme } from './theme'
import { useApolloClient } from '@apollo/react-hooks'
import Link from 'next/link'
import { abbreviateNumber } from '../../lib/utils'

export default ({ transcoders }) => {
  const client = useApolloClient()
  const context = useThemeUI()

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
          <Flex sx={{ alignItems: 'center' }}>
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
            <Link
              href="/[account]/campaign"
              as={`/${props.value}/campaign`}
              passHref
            >
              <a
                sx={{
                  color: 'text',
                  cursor: 'pointer',
                  transition: 'all .3s',
                  borderBottom: '1px solid',
                  borderColor: 'transparent',
                  '&:hover': {
                    color: 'primary',
                    borderBottom: '1px solid',
                    borderColor: 'primary',
                    transition: 'all .3s',
                  },
                }}
              >
                {props.value.substring(0, 10)}...
              </a>
            </Link>
          </Flex>
        )
        break
      case 'totalStake':
        let num = props.value ? Utils.fromWei(props.value) : 0
        cellValue = (
          <span style={{ fontFamily: 'Akkurat-Mono' }}>
            {abbreviateNumber(num, 5)}
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
            {100 - props.value / 10000}%
          </span>
        )
        break
      default:
        cellValue = props.value
    }
    return <MTableCell {...props} value={cellValue} />
  }

  return (
    <MuiThemeProvider theme={createMuiTheme(context)}>
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
              selectedTranscoder: {
                __typename: 'Transcoder',
                id: rowData.id,
              },
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
