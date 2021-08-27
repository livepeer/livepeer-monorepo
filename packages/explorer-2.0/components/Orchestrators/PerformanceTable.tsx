import Box from "../Box";
import Flex from "../Flex";
import { forwardRef, useMemo } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import Help from "../../public/img/help.svg";
import matchSorter from "match-sorter";
import AccountCell from "../AccountCell";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import { TableCellProps } from "../../@types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@modulz/radix-icons";

const PerformanceTable = ({
  pageSize = 10,
  data: { currentRound, transcoders },
  region,
}) => {
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {
      keys: [(row) => row.values[id]],
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
        }}>
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
        Header: "#",
        accessor: "rank",
        disableSortBy: true,
      },
      {
        Header: "Orchestrator",
        accessor: "id",
        filter: "fuzzyText",
        Filter: DefaultColumnFilter,
        mobile: true,
        sortType: (rowA, rowB, columnID) => {
          const rowAIdentity =
            getRowValueByColumnID(rowA, "threeBoxSpace")?.name ||
            getRowValueByColumnID(rowA, columnID);
          const rowBIdentity =
            getRowValueByColumnID(rowB, "threeBoxSpace")?.name ||
            getRowValueByColumnID(rowB, columnID);
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
        Header: "ThreeBoxSpace",
        accessor: "threeBoxSpace",
        filter: "fuzzyText",
        Filter: DefaultColumnFilter,
      },
      {
        Header: "Delegator",
        accessor: "delegator",
      },
      {
        Header: "Total Score (0-10)",
        accessor: `scores.${region}`,
        mobile: true,
        sortDescFirst: true,
        defaultCanSort: true,
      },
      {
        Header: "Success Rate (%)",
        accessor: `successRates.${region}`,
        mobile: false,
      },
      {
        Header: "Latency Score (0-10)",
        accessor: `roundTripScores.${region}`,
        mobile: false,
      },
    ],
    [region]
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
    data: transcoders,
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      pageSize,
      sortBy: [
        {
          id: "scores.global",
          desc: true,
        },
        {
          id: "scores.mdw",
          desc: true,
        },
        {
          id: "scores.fra",
          desc: true,
        },
        {
          id: "scores.nyc",
          desc: true,
        },
        {
          id: "scores.lax",
          desc: true,
        },
        {
          id: "scores.lon",
          desc: true,
        },
        {
          id: "scores.prg",
          desc: true,
        },
      ],
      hiddenColumns: [
        "activationRound",
        "deactivationRound",
        "threeBoxSpace",
        "global",
        "delegator",
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

  const accountColumn = headerGroups[0].headers[1];

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
          pb: "$4",
          ml: 0,
          mr: 0,
          justifyContent: "space-between",
        }}>
        <Box>{accountColumn.render("Filter")}</Box>
      </Flex>
      <Box css={{ overflow: "scroll", WebkitOverflowScrolling: "touch" }}>
        <Box
          css={{
            display: "table",
            tableLayout: "fixed",
            width: "100%",
            minWidth: 780,
            borderSpacing: "0",
            borderCollapse: "collapse",
          }}
          {...getTableProps()}>
          <Box css={{ display: "table-header-group" }}>
            {headerGroups.map((headerGroup, index1) => (
              <Box
                css={{ display: "table-row" }}
                key={index1}
                {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index2) => (
                  <Box
                    css={{
                      borderBottom: "1px solid",
                      borderColor: "rgba(255,255,255,.05)",
                      pb: "$2",
                      pl: "$4",
                      pr: index2 === 0 ? 0 : "$3",
                      width: index2 === 0 ? 30 : "auto",
                      fontWeight: 700,
                      display: "table-cell",
                      textTransform: "uppercase",
                    }}
                    key={index2}>
                    <Flex
                      css={{
                        justifyContent:
                          index2 === 0 || index2 === 1
                            ? "flex-start"
                            : "flex-end",
                      }}>
                      <Flex
                        css={{
                          alignItems: "center",
                          fontSize: 10,
                          position: "relative",
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: "" })
                        )}>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Box
                              as={ChevronDownIcon}
                              css={{ height: 15, mr: "$2" }}
                            />
                          ) : (
                            <Box
                              as={ChevronUpIcon}
                              css={{ height: 15, mr: "$2" }}
                            />
                          )
                        ) : (
                          <Box css={{ height: 15 }} />
                        )}
                        {column.render("Header")}
                      </Flex>
                      {renderTooltip(column.render("Header"))}
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
                  }}>
                  {row.cells.map((cell, i) => {
                    switch (cell.column.Header) {
                      case "#":
                        return (
                          <TableCell cell={cell} key={i} css={{ pr: 0 }}>
                            {parseInt(rowIndex) + 1 + pageIndex * pageSize}
                          </TableCell>
                        );
                      case "Orchestrator":
                        const active =
                          cell.row.values.activationRound <= currentRound.id &&
                          cell.row.values.deactivationRound > currentRound.id;
                        return (
                          <TableCell cell={cell} key={i} css={{ pr: 0 }}>
                            <Link
                              href={`/accounts/${cell.value}/campaign`}
                              passHref>
                              <Box
                                as="a"
                                css={{
                                  display: "inherit",
                                  color: "inherit",
                                  ":hover": {
                                    textDecoration: "underline",
                                  },
                                }}>
                                <AccountCell
                                  active={active}
                                  threeBoxSpace={cell.row.values.threeBoxSpace}
                                  address={cell.value}
                                />
                              </Box>
                            </Link>
                          </TableCell>
                        );
                      case "Success Rate (%)":
                        if (
                          typeof cell.value === "undefined" ||
                          cell.value === null
                        ) {
                          return <TableCell cell={cell} key={i} />;
                        }
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              fontFamily: "$monospace",
                              textAlign: "right",
                            }}>
                            {cell.value.toFixed(2)}%
                          </TableCell>
                        );
                      case "Latency Score (0-10)":
                        if (
                          typeof cell.value === "undefined" ||
                          cell.value === null
                        ) {
                          return <TableCell cell={cell} key={i} />;
                        }

                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              fontFamily: "$monospace",
                              textAlign: "right",
                            }}>
                            {(cell.value / 1000).toFixed(2)}
                          </TableCell>
                        );
                      case "Total Score (0-10)":
                        if (
                          typeof cell.value === "undefined" ||
                          cell.value === null
                        ) {
                          return <TableCell cell={cell} key={i} />;
                        }

                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              fontFamily: "$monospace",
                              textAlign: "right",
                            }}>
                            {(cell.value / 1000).toFixed(2)}
                          </TableCell>
                        );
                      default:
                        return <TableCell cell={cell} key={i} />;
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
          py: "$4",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Box
          as={ArrowLeftIcon}
          css={{
            cursor: "pointer",
            color: canPreviousPage ? "$primary" : "$text",
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage();
            }
          }}
        />
        <Flex css={{ alignItems: "center", fontSize: "$2", mx: "$3" }}>
          <Box css={{ mr: "$1" }}>Page</Box>
          <Box as="span" css={{ fontFamily: "$monospace" }}>
            {pageIndex + 1}
          </Box>
          <Box css={{ mx: "$1" }}>of</Box>
          <Box css={{ fontFamily: "$monospace" }}>{pageCount}</Box>
        </Flex>
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
  function renderTooltip(title) {
    switch (title) {
      case "Success Rate (%)":
        return (
          <>
            <ReactTooltip
              html={true}
              id="tooltip-success-rate"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip='<span>The average percentage of video segments sent by a broadcaster that are successfully transcoded. See <a href="https://livepeer.org/docs/video-miners/reference/leaderboard" rel="noopener noreferrer" target="_blank">the FAQ</a> for more details on how this metric is calculated.</span>'
              data-for="tooltip-success-rate"
              css={{
                cursor: "pointer",
                position: "relative",
                ml: "$2",
                top: "1px",
                width: 12,
                height: 12,
              }}
            />
          </>
        );
      case "Latency Score (0-10)":
        return (
          <>
            <ReactTooltip
              html={true}
              id="tooltip-latency-score"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip='<span>The average utility of the overall transcoding latency for an orchestrator. See <a href="https://livepeer.org/docs/video-miners/reference/leaderboard" rel="noopener noreferrer" target="_blank">the FAQ</a> for more details on how this metric is calculated.</span>'
              data-for="tooltip-latency-score"
              css={{
                cursor: "pointer",
                position: "relative",
                ml: "$2",
                top: "1px",
                width: 12,
                height: 12,
              }}
            />
          </>
        );
      case "Total Score (0-10)":
        return (
          <>
            <ReactTooltip
              html={true}
              id="tooltip-score"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip='<span>The average utility of the overall quality and reliability of an orchestrator based on success rate and latency scores. See <a href="https://livepeer.org/docs/video-miners/reference/leaderboard" rel="noopener noreferrer" target="_blank">the FAQ</a> for more details on how this metric is calculated.</span>'
              data-for="tooltip-score"
              css={{
                cursor: "pointer",
                position: "relative",
                ml: "$2",
                top: "1px",
                width: 12,
                height: 12,
              }}
            />
          </>
        );

      default:
        return null;
    }
  }
};

const TableCell = forwardRef(
  (
    { children, href, target, cell, onClick, as = "div", css }: TableCellProps,
    ref
  ) => {
    return (
      <Box
        as={as}
        target={target}
        href={href}
        ref={ref}
        onClick={onClick}
        css={{
          justifyContent: "flex-end",
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
        {...cell.getCellProps()}>
        {children}
      </Box>
    );
  }
);

export default PerformanceTable;
