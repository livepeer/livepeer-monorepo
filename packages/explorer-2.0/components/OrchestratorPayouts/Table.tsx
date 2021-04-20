import Box from "../Box";
import Flex from "../Flex";
import { useMemo } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import matchSorter from "match-sorter";
import AccountCell from "../AccountCell";
import moment from "moment";
import Link from "next/link";
import { forwardRef } from "react";
import { TableCellProps } from "../../@types";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@modulz/radix-icons";

const Table = ({ pageSize = 10, data: { currentRound, tickets } }) => {
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {
      keys: [
        (row) => {
          console.log(row);
          return row.values[id];
        },
      ],
    });
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <Flex
        css={{
          alignItems: "center",
          pl: "$4",
        }}
      >
        <Box
          as={MagnifyingGlassIcon}
          css={{ width: 16, height: 16, mr: "$2", color: "$muted" }}
        />
        <Box
          as="input"
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
          placeholder={`Filter`}
          type="text"
          css={{
            display: "block",
            outline: "none",
            width: "100%",
            appearance: "none",
            fontSize: "$3",
            lineHeight: "inherit",
            border: 0,
            color: "inherit",
            bg: "transparent",
          }}
        />
      </Flex>
    );
  }

  const columns: any = useMemo(
    () => [
      {
        Header: "Orchestrator",
        accessor: "recipient",
        filter: "fuzzyText",
        Filter: DefaultColumnFilter,
        sortType: (rowA, rowB, columnID) => {
          const a = getRowValueByColumnID(rowA, columnID);
          const b = getRowValueByColumnID(rowB, columnID);
          const aThreeBoxSpace = getRowValueByColumnID(rowA, "threeBoxSpace");
          const bThreeBoxSpace = getRowValueByColumnID(rowB, "threeBoxSpace");
          const rowAIdentity = aThreeBoxSpace?.name ? aThreeBoxSpace?.name : a;
          const rowBIdentity = bThreeBoxSpace?.name ? bThreeBoxSpace?.name : b;

          return compareBasic(rowAIdentity, rowBIdentity);
        },
      },
      {
        Header: "Activation Round",
        accessor: "activationRound",
      },
      {
        Header: "Deactivation Round",
        accessor: "deactivationRound",
      },
      {
        Header: "Amount",
        accessor: "faceValue",
      },
      {
        Header: "Value (USD)",
        accessor: "faceValueUSD",
      },
      {
        Header: "Transaction",
        accessor: "transaction",
      },
      {
        Header: "Broadcaster",
        accessor: "sender",
      },
      {
        Header: "Time",
        accessor: "timestamp",
      },
    ],
    []
  );

  function getRowValueByColumnID(row, columnID) {
    return row.values[columnID];
  }

  function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const tableOptions: any = {
    columns,
    data: tickets,
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      pageSize,
      sortBy: [{ id: "timestamp", desc: true }],
      hiddenColumns: [
        "transaction",
        "activationRound",
        "deactivationRound",
        "faceValueUSD",
      ],
    },
    defaultColumn,
    filterTypes,
  };

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
  }: any = useTable(tableOptions, useFilters, useSortBy, usePagination);

  const accountColumn: any = headerGroups[0].headers[1];

  return (
    <>
      <Flex
        css={{
          position: "relative",
          width: "100%",
          top: 0,
          zIndex: 10,
          flexDirection: "column",
          alignItems: "flex-start",
          pt: 0,
          pb: "$3",
          ml: 0,
          mr: 0,
          justifyContent: "space-between",
        }}
      >
        <Box>{accountColumn.render("Filter")}</Box>
      </Flex>
      <Box css={{ overflow: "scroll", WebkitOverflowScrolling: "touch" }}>
        <Box
          css={{
            display: "table",
            tableLayout: "fixed",
            width: "100%",
            borderSpacing: "0",
            borderCollapse: "collapse",
            position: "relative",
            minWidth: 800,
          }}
          {...getTableProps()}
        >
          <Box css={{ display: "table-header-group" }}>
            {headerGroups.map((headerGroup, index1) => (
              <Box
                css={{ display: "table-row" }}
                key={index1}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, index2) => (
                  <Box
                    css={{
                      display: "table-cell",
                      borderBottom: "1px solid",
                      fontWeight: 700,
                      borderColor: "rgba(255,255,255,.05)",
                      pb: "$2",
                      px: "$4",
                      textTransform: "uppercase",
                    }}
                    key={index2}
                  >
                    <Flex
                      css={{
                        justifyContent:
                          index2 === 0 || index2 === 1
                            ? "flex-start"
                            : "flex-end",
                      }}
                    >
                      <Box
                        as="span"
                        css={{
                          fontSize: 10,
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: "" })
                        )}
                      >
                        <Box as="span">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <Box as={ArrowDownIcon} css={{ ml: "-12px" }} />
                            ) : (
                              <Box as={ArrowUpIcon} css={{ ml: "-12px" }} />
                            )
                          ) : (
                            ""
                          )}
                        </Box>
                        {column.render("Header")}
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
          <Box css={{ display: "table-row-group" }} {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              const orchestratorIndex = rowIndex + pageIndex * pageSize;
              prepareRow(row);

              return (
                <Box
                  {...row.getRowProps()}
                  key={orchestratorIndex}
                  css={{
                    display: "table-row",
                    height: 64,
                  }}
                >
                  {row.cells.map((cell, i) => {
                    switch (cell.column.Header) {
                      case "Orchestrator":
                        const active =
                          cell.row.values.recipient.activationRound <=
                            currentRound.id &&
                          cell.row.values.recipient.deactivationRound >
                            currentRound.id;

                        return (
                          <TableCell cell={cell} key={i}>
                            <Link
                              href={`/accounts/${cell.value.id}/campaign`}
                              passHref
                            >
                              <Box
                                as="a"
                                css={{
                                  display: "inherit",
                                  color: "inherit",
                                  ":hover": {
                                    textDecoration: "underline",
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
                              </Box>
                            </Link>
                          </TableCell>
                        );
                      case "Amount":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{ fontSize: "12px" }}
                          >
                            <Flex css={{ alignItems: "center" }}>
                              <Box
                                css={{
                                  display: "inline-block",
                                  background: "rgba(255,255,255,.06)",
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  mr: "$2",
                                }}
                              >
                                <Box
                                  as="span"
                                  css={{ fontFamily: "$monospace" }}
                                >
                                  {parseFloat((+cell.value).toFixed(3))}
                                </Box>{" "}
                                <Box as="span">ETH</Box>
                              </Box>
                              (
                              <Box css={{ fontFamily: "$monospace" }}>
                                $
                                {parseFloat(
                                  (+cell.row.values.faceValueUSD).toFixed(2)
                                )}
                              </Box>
                              )
                            </Flex>
                          </TableCell>
                        );
                      case "Broadcaster":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{ textAlign: "right" }}
                          >
                            <Link
                              href={`/accounts/${cell.value.id}/history`}
                              passHref
                            >
                              <Box
                                as="a"
                                css={{
                                  color: "inherit",
                                  ":hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {cell.value.id.replace(
                                  cell.value.id.slice(5, 39),
                                  "…"
                                )}
                              </Box>
                            </Link>
                          </TableCell>
                        );
                      case "Time":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{ textAlign: "right" }}
                          >
                            <Box
                              as="a"
                              css={{
                                color: "inherit",
                                ":hover": {
                                  textDecoration: "underline",
                                },
                              }}
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`https://etherscan.io/tx/${cell.row.values.transaction.id}`}
                            >
                              {moment(cell.value * 1000).fromNow()}
                            </Box>
                          </TableCell>
                        );
                      default:
                        return null;
                    }
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Flex
        css={{
          py: "$5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          as={ArrowLeftIcon}
          css={{
            cursor: "pointer",
            color: canPreviousPage ? "$primary" : "text",
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage();
            }
          }}
        />
        <Box css={{ fontSize: "$2", mx: "$3" }}>
          Page{" "}
          <Box as="span" css={{ fontFamily: "$monospace" }}>
            {pageIndex + 1}
          </Box>{" "}
          of{" "}
          <Box as="span" css={{ fontFamily: "$monospace" }}>
            {pageCount}
          </Box>
        </Box>
        <Box
          as={ArrowRightIcon}
          css={{
            cursor: "pointer",
            color: canNextPage ? "$primary" : "$text",
            opacity: canNextPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canNextPage) {
              nextPage();
            }
          }}
        />
      </Flex>
    </>
  );
};

const TableCell = forwardRef(
  ({ children, href, target, cell, as, onClick, css }: TableCellProps, ref) => {
    return (
      <Box
        as={as}
        target={target}
        href={href}
        ref={ref}
        onClick={onClick}
        css={{
          color: "inherit",
          display: "table-cell",
          width: "auto",
          fontSize: "$2",
          px: "$4",
          verticalAlign: "middle",
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,.05)",
          ...css,
        }}
        {...cell.getCellProps()}
      >
        {children}
      </Box>
    );
  }
);

export default Table;
