import { Flex, Box, Styled } from 'theme-ui'
import { useMemo } from 'react'
import { useTable, useFilters, useSortBy, usePagination } from 'react-table'
import Search from '../../public/img/search.svg'
import matchSorter from 'match-sorter'
import AccountCell from '../AccountCell'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import moment from 'moment'
import Link from 'next/link'
import { forwardRef } from 'react'
import { TableCellProps } from '../../@types'

const Table = ({ pageSize = 10, data: { currentRound, tickets } }) => {
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {
      keys: [
        (row) => {
          console.log(row)
          return row.values[id]
        },
      ],
    })
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val

  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          pl: 3,
        }}
      >
        <Search sx={{ width: 16, height: 16, mr: 1, color: 'muted' }} />
        <input
          value={filterValue || ''}
          onChange={(e) => {
            setFilter(e.target.value || undefined)
          }}
          placeholder={`Filter`}
          type="text"
          sx={{
            display: 'block',
            outline: 'none',
            width: '100%',
            appearance: 'none',
            fontSize: 2,
            lineHeight: 'inherit',
            border: 0,
            color: 'inherit',
            bg: 'transparent',
          }}
        />
      </Flex>
    )
  }

  const columns: any = useMemo(
    () => [
      {
        Header: 'Recipient',
        accessor: 'recipient',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
        sortType: (rowA, rowB, columnID) => {
          let a = getRowValueByColumnID(rowA, columnID)
          let b = getRowValueByColumnID(rowB, columnID)
          let aThreeBoxSpace = getRowValueByColumnID(rowA, 'threeBoxSpace')
          let bThreeBoxSpace = getRowValueByColumnID(rowB, 'threeBoxSpace')
          let rowAIdentity = aThreeBoxSpace?.name ? aThreeBoxSpace?.name : a
          let rowBIdentity = bThreeBoxSpace?.name ? bThreeBoxSpace?.name : b

          return compareBasic(rowAIdentity, rowBIdentity)
        },
      },
      {
        Header: 'Activation Round',
        accessor: 'activationRound',
      },
      {
        Header: 'Deactivation Round',
        accessor: 'deactivationRound',
      },
      {
        Header: 'Amount',
        accessor: 'faceValue',
      },
      {
        Header: 'Value (USD)',
        accessor: 'faceValueUSD',
      },
      {
        Header: 'Transaction',
        accessor: 'transaction',
      },
      {
        Header: 'Broadcaster',
        accessor: 'sender',
      },
      {
        Header: 'Time',
        accessor: 'timestamp',
      },
    ],
    [],
  )

  function getRowValueByColumnID(row, columnID) {
    return row.values[columnID]
  }

  function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1
  }

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const tableOptions: any = {
    columns,
    data: tickets,
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      pageSize,
      sortBy: [{ id: 'timestamp', desc: true }],
      hiddenColumns: [
        'transaction',
        'activationRound',
        'deactivationRound',
        'faceValueUSD',
      ],
    },
    defaultColumn,
    filterTypes,
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  }: any = useTable(tableOptions, useFilters, useSortBy, usePagination)

  const accountColumn: any = headerGroups[0].headers[1]

  return (
    <>
      <Flex
        sx={{
          position: 'relative',
          width: '100%',
          top: 0,
          zIndex: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          pt: 0,
          pb: 3,
          ml: 0,
          mr: 0,
          justifyContent: 'space-between',
        }}
      >
        <Box>{accountColumn.render('Filter')}</Box>
      </Flex>
      <Box sx={{ overflow: 'scroll', WebkitOverflowScrolling: 'touch' }}>
        <Box
          sx={{
            display: 'table',
            tableLayout: 'fixed',
            width: '100%',
            borderSpacing: '0',
            borderCollapse: 'collapse',
            position: 'relative',
            minWidth: 800,
          }}
          {...getTableProps()}
        >
          <Box sx={{ display: 'table-header-group' }}>
            {headerGroups.map((headerGroup, i) => (
              <Box
                sx={{ display: 'table-row' }}
                key={i}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, i) => (
                  <Box
                    sx={{
                      display: 'table-cell',
                      borderBottom: '1px solid',
                      fontWeight: 700,
                      borderColor: 'rgba(255,255,255,.05)',
                      pb: 1,
                      px: 3,
                      textTransform: 'uppercase',
                    }}
                    key={i}
                  >
                    <Flex
                      sx={{
                        justifyContent:
                          i === 0 || i === 1 ? 'flex-start' : 'flex-end',
                      }}
                    >
                      <span
                        sx={{
                          fontSize: 10,
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: '' }),
                        )}
                      >
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <MdKeyboardArrowDown sx={{ ml: '-12px' }} />
                            ) : (
                              <MdKeyboardArrowUp sx={{ ml: '-12px' }} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                        {column.render('Header')}
                      </span>
                    </Flex>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'table-row-group' }} {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              const orchestratorIndex = rowIndex + pageIndex * pageSize
              prepareRow(row)

              return (
                <Box
                  {...row.getRowProps()}
                  key={orchestratorIndex}
                  sx={{
                    display: 'table-row',
                    height: 64,
                  }}
                >
                  {row.cells.map((cell, i) => {
                    switch (cell.column.Header) {
                      case 'Recipient':
                        const active =
                          cell.row.values.recipient.activationRound <=
                            currentRound.id &&
                          cell.row.values.recipient.deactivationRound >
                            currentRound.id

                        return (
                          <TableCell cell={cell} key={i}>
                            <Link
                              href={`/accounts/${cell.value.id}/campaign`}
                              passHref
                            >
                              <a
                                sx={{
                                  display: 'inherit',
                                  color: 'inherit',
                                  ':hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                <AccountCell
                                  active={active}
                                  threeBoxSpace={
                                    cell.row.values.recipient.threeBoxSpace
                                  }
                                  address={cell.value.id}
                                />
                              </a>
                            </Link>
                          </TableCell>
                        )
                      case 'Amount':
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{ fontSize: '12px' }}
                          >
                            <Box
                              sx={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,.06)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                mr: 1,
                              }}
                            >
                              <span sx={{ fontFamily: 'monospace' }}>
                                {parseFloat((+cell.value).toFixed(3))}
                              </span>{' '}
                              <span>ETH</span>
                            </Box>
                            (
                            <span sx={{ fontFamily: 'monospace' }}>
                              $
                              {parseFloat(
                                (+cell.row.values.faceValueUSD).toFixed(2),
                              )}
                            </span>
                            )
                          </TableCell>
                        )
                      case 'Broadcaster':
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{ textAlign: 'right' }}
                          >
                            <Link
                              href={`/accounts/${cell.value.id}/history`}
                              passHref
                            >
                              <a
                                sx={{
                                  color: 'inherit',
                                  ':hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                {cell.value.id.replace(
                                  cell.value.id.slice(5, 39),
                                  '…',
                                )}
                              </a>
                            </Link>
                          </TableCell>
                        )
                      case 'Time':
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{ textAlign: 'right' }}
                          >
                            <a
                              sx={{
                                color: 'inherit',
                                ':hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`https://etherscan.io/tx/${cell.row.values.transaction.id}`}
                            >
                              {moment(cell.value * 1000).fromNow()}
                            </a>
                          </TableCell>
                        )
                      default:
                        return null
                    }
                  })}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Flex
        sx={{
          py: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RiArrowLeftLine
          sx={{
            cursor: 'pointer',
            color: canPreviousPage ? 'primary' : 'text',
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage()
            }
          }}
        />
        <Box sx={{ fontSize: 1, mx: 2 }}>
          Page <span sx={{ fontFamily: 'monospace' }}>{pageIndex + 1}</span> of{' '}
          <span sx={{ fontFamily: 'monospace' }}>{pageCount}</span>
        </Box>
        <RiArrowRightLine
          sx={{
            cursor: 'pointer',
            color: canNextPage ? 'primary' : 'text',
            opacity: canNextPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canNextPage) {
              nextPage()
            }
          }}
        />
      </Flex>
    </>
  )
}

const TableCell = forwardRef(
  (
    { children, href, target, cell, as, onClick, pushSx }: TableCellProps,
    ref,
  ) => {
    return (
      <Styled.div
        as={as}
        target={target}
        href={href}
        ref={ref}
        onClick={onClick}
        sx={{
          color: 'inherit',
          display: 'table-cell',
          width: 'auto',
          fontSize: 1,
          px: 3,
          verticalAlign: 'middle',
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,.05)',
          ...pushSx,
        }}
        {...cell.getCellProps()}
      >
        {children}
      </Styled.div>
    )
  },
)

export default Table
