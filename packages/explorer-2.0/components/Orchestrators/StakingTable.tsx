import Box from "../Box";
import Flex from "../Flex";
import { useMemo, useState, forwardRef } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { abbreviateNumber, expandedPriceLabels } from "../../lib/utils";
import Help from "../../public/img/help.svg";
import matchSorter from "match-sorter";
import AccountCell from "../AccountCell";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import Price from "../Price";
import { TableCellProps } from "../../@types";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@modulz/radix-icons";

const StakingTable = ({
  pageSize = 10,
  data: { currentRound, transcoders },
}) => {
  const [priceSetting] = useState("pixel");

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
        Header: "Stake",
        accessor: "totalStake",
        mobile: true,
      },
      {
        Header: "Fees",
        accessor: "totalVolumeETH",
      },
      {
        Header: "Reward Cut",
        accessor: "rewardCut",
      },
      {
        Header: "Fee Cut",
        accessor: "feeShare",
        sortInverted: true,
      },
      {
        Header: "Price / Pixel",
        accessor: "price",
      },
      {
        Header: "Calls",
        accessor: "pools",
        sortType: (rowA, rowB, columnID) => {
          const a = getRowValueByColumnID(rowA, columnID);
          const b = getRowValueByColumnID(rowB, columnID);

          const rowACallsMade = a.filter((r) => r.rewardTokens != null).length;
          const rowBCallsMade = b.filter((r) => r.rewardTokens != null).length;

          return compareBasic(rowACallsMade, rowBCallsMade);
        },
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
    data: transcoders,
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      pageSize,
      sortBy: [{ id: "totalStake", desc: true }],
      hiddenColumns: [
        "activationRound",
        "deactivationRound",
        "threeBoxSpace",
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
          pb: "$4",
          mx: 0,
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
            minWidth: 1060,
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
                      pr:
                        column.render("Header") === "Price / Pixel" ||
                        column.render("Header") === "#"
                          ? 0
                          : "$4",
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
                      case "Stake":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                            }}>
                            {abbreviateNumber(cell.value ? cell.value : 0, 4)}
                          </TableCell>
                        );
                      case "Fees":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                            }}>
                            {cell.value
                              ? +parseFloat(cell.value).toFixed(2)
                              : 0}{" "}
                            <Box as="span" css={{ fontSize: 12 }}>
                              ETH
                            </Box>
                          </TableCell>
                        );
                      case "Reward Cut":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                            }}>
                            {cell.value / 10000}%
                          </TableCell>
                        );
                      case "Fee Cut":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                            }}>
                            {cell.value === "0" || !cell.value
                              ? "100%"
                              : `${(100 - cell.value / 10000)
                                  .toFixed(2)
                                  .replace(/[.,]00$/, "")}%`}
                          </TableCell>
                        );
                      case "Price / Pixel":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                              pr: 0,
                            }}>
                            <Box as="span" data-html={true}>
                              {cell.value <= 0 ? (
                                "N/A"
                              ) : (
                                <Price
                                  value={cell.value}
                                  css={{ justifyContent: "flex-end" }}
                                />
                              )}
                            </Box>
                          </TableCell>
                        );
                      case "Calls":
                        const callsMade = cell.value.filter(
                          (r) => r.rewardTokens != null
                        ).length;
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            css={{
                              textAlign: "right",
                              fontFamily: "$monospace",
                            }}>
                            {`${callsMade}/${cell.value.length}`}
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
      case "Stake":
        return (
          <>
            <ReactTooltip
              id="tooltip-stake"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip="Total LPT staked with an orchestrator, including its own stake."
              data-for="tooltip-stake"
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
      case "Fees":
        return (
          <>
            <ReactTooltip
              id="tooltip-fees"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip="Total ETH earned from transcoding."
              data-for="tooltip-fees"
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
      case "Price / Pixel":
        return (
          <>
            <ReactTooltip
              id="tooltip-price"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip={`Price of transcoding per ${expandedPriceLabels[priceSetting]}.`}
              data-for="tooltip-price"
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
      case "Reward Cut":
        return (
          <>
            <ReactTooltip
              id="tooltip-reward-cut"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip="The percent of the newly minted Livepeer token that the orchestrator will keep from the round’s inflation distribution. The remainder gets distributed amongst delegators."
              data-for="tooltip-reward-cut"
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
      case "Fee Cut":
        return (
          <>
            <ReactTooltip
              id="tooltip-fee-cut"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip="The percent of the earned fees (ETH) that the orchestrator will keep. The remainder gets distributed across all delegators by how much they have staked relative to others."
              data-for="tooltip-fee-cut"
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
      case "Calls":
        return (
          <>
            <ReactTooltip
              id="tooltip-calls"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Box
              as={Help}
              data-tip="The number of times an orchestrator claimed its newly minted rewards on behalf of its delegators over the last 30 rounds."
              data-for="tooltip-calls"
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
  ({ children, href, target, cell, onClick, as, css }: TableCellProps, ref) => {
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

export default StakingTable;
