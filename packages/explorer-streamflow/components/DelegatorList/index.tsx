/** @jsx jsx */
import React from 'react'
import * as Utils from 'web3-utils'
import MaterialTable, { MTableToolbar, MTableCell } from 'material-table'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Flex, jsx, useThemeUI } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import QRCode from 'qrcode.react'
import { createMuiTheme } from '../../lib/materialTheme'
import Link from 'next/link'
import { abbreviateNumber } from '../../lib/utils'

export default ({ delegators }) => {
  const context = useThemeUI()

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
              href="/[account]/staking"
              as={`/${props.value}/staking`}
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
      case 'pendingStake':
        let num = props.value ? Utils.fromWei(props.value) : 0
        cellValue = (
          <span style={{ fontFamily: 'Akkurat-Mono' }}>
            {abbreviateNumber(num, 5)}
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
        style={{ marginTop: '-16px' }}
        columns={[
          {
            title: 'Tokenholder',
            field: 'id',
          },

          {
            title: 'Stake',
            field: 'pendingStake',
            defaultSort: 'desc',
            type: 'numeric',
          },
        ]}
        data={delegators}
        localization={{
          toolbar: {
            searchPlaceholder: 'Filter',
          },
        }}
        options={{
          paging: true,
          pageSize: 10,
          search: true,
          draggable: false,
          showTextRowsSelected: false,
          headerStyle: { position: 'sticky', top: 0 },
          toolbar: false,
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
          Cell: props => <Cell {...props} />,
        }}
      />
    </MuiThemeProvider>
  )
}
