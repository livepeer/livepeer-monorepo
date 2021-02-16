import { Flex, Box, Styled } from "theme-ui";
import { useMemo, useState, useRef, forwardRef } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { abbreviateNumber, expandedPriceLabels } from "../../lib/utils";
import Search from "../../public/img/search.svg";
import Help from "../../public/img/help.svg";
import matchSorter from "match-sorter";
import AccountCell from "../AccountCell";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import {
  Menu,
  MenuItemRadioGroup,
  MenuItemRadio,
} from "@modulz/radix/dist/index.es";
import Price from "../Price";
import { TableCellProps } from "../../@types";

const StakingTable = ({
  pageSize = 10,
  data: { currentRound, transcoders },
}) => {
  const [isPriceSettingOpen, setIsPriceSettingOpen] = useState(false);
  const targetRef = useRef();
  const [priceSetting, setPriceSetting] = useState("pixel");

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
        sx={{
          alignItems: "center",
          pl: 3,
        }}>
        <Search sx={{ width: 16, height: 16, mr: 1, color: "muted" }} />
        <input
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined);
          }}
          placeholder={`Filter`}
          type="text"
          sx={{
            display: "block",
            outline: "none",
            width: "100%",
            appearance: "none",
            fontSize: 2,
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
        sortType: "basic",
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
        Header: "Price",
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

  const PriceSettingToggle = () => (
    <span
      ref={targetRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsPriceSettingOpen(true);
      }}
      sx={{
        fontSize: 10,
      }}>
      <span sx={{ mx: "4px" }}>/</span>
      <span
        title={`Price of transcoding per ${expandedPriceLabels[priceSetting]}`}
        sx={{
          color: "text",
          borderBottom: "1px dashed",
          borderColor: "text",
          transition: ".3s",
          ":hover": { color: "primary" },
          ":active": { color: "primary" },
        }}>
        {priceSetting}
      </span>
    </span>
  );
  return (
    <>
      <Menu
        style={{
          background: "#1E2026",
          padding: 0,
          borderRadius: 10,
          boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
        }}
        isOpen={isPriceSettingOpen}
        onClose={() => setIsPriceSettingOpen(false)}
        buttonRef={targetRef}>
        <MenuItemRadioGroup
          value={priceSetting}
          onChange={(value) => {
            setPriceSetting(value);
          }}>
          <MenuItemRadio value="pixel" label="1 pixel" />
          <MenuItemRadio value="1m pixels" label="1 million pixels" />
          <MenuItemRadio value="1b pixels" label="1 billion pixels" />
          <MenuItemRadio value="1t pixels" label="1 trillion pixels" />
        </MenuItemRadioGroup>
      </Menu>
      <Flex
        sx={{
          position: "relative",
          width: "100%",
          top: 0,
          zIndex: 10,
          flexDirection: "column",
          alignItems: "flex-start",
          pt: 0,
          pb: 3,
          mx: 0,
          justifyContent: "space-between",
        }}>
        <Box>{accountColumn.render("Filter")}</Box>
      </Flex>
      <Box sx={{ overflow: "scroll", WebkitOverflowScrolling: "touch" }}>
        <Box
          sx={{
            display: "table",
            tableLayout: "fixed",
            width: "100%",
            minWidth: 1060,
            borderSpacing: "0",
            borderCollapse: "collapse",
          }}
          {...getTableProps()}>
          <Box sx={{ display: "table-header-group" }}>
            {headerGroups.map((headerGroup, index1) => (
              <Box
                sx={{ display: "table-row" }}
                key={index1}
                {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index2) => (
                  <Box
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "rgba(255,255,255,.05)",
                      pb: 1,
                      pl: 3,
                      pr:
                        column.render("Header") === "Price" ||
                        column.render("Header") === "#"
                          ? 0
                          : 3,
                      width: index2 === 0 ? 30 : "auto",
                      fontWeight: 700,
                      display: "table-cell",
                      textTransform: "uppercase",
                    }}
                    key={index2}>
                    <Flex
                      sx={{
                        justifyContent:
                          index2 === 0 || index2 === 1
                            ? "flex-start"
                            : "flex-end",
                      }}>
                      <span
                        sx={{
                          fontSize: 10,
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: "" })
                        )}>
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <MdKeyboardArrowDown sx={{ ml: "-12px" }} />
                            ) : (
                              <MdKeyboardArrowUp sx={{ ml: "-12px" }} />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                        {column.render("Header")}
                      </span>
                      {column.render("Header") === "Price" && (
                        <PriceSettingToggle />
                      )}
                      {renderTooltip(column.render("Header"))}
                    </Flex>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "table-row-group" }} {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              const orchestratorIndex = rowIndex + pageIndex * pageSize;
              prepareRow(row);

              return (
                <Box
                  {...row.getRowProps()}
                  key={orchestratorIndex}
                  sx={{
                    display: "table-row",
                    height: 64,
                  }}>
                  {row.cells.map((cell, i) => {
                    switch (cell.column.Header) {
                      case "#":
                        return (
                          <TableCell cell={cell} key={i} pushSx={{ pr: 0 }}>
                            {parseInt(rowIndex) + 1 + pageIndex * pageSize}
                          </TableCell>
                        );
                      case "Orchestrator":
                        const active =
                          cell.row.values.activationRound <= currentRound.id &&
                          cell.row.values.deactivationRound > currentRound.id;
                        return (
                          <TableCell cell={cell} key={i} pushSx={{ pr: 0 }}>
                            <Link
                              href={`/accounts/${cell.value}/campaign`}
                              passHref>
                              <a
                                sx={{
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
                              </a>
                            </Link>
                          </TableCell>
                        );
                      case "Stake":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
                            }}>
                            {abbreviateNumber(cell.value ? cell.value : 0, 4)}
                          </TableCell>
                        );
                      case "Fees":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
                            }}>
                            {cell.value
                              ? +parseFloat(cell.value).toFixed(2)
                              : 0}{" "}
                            <span sx={{ fontSize: 12 }}>ETH</span>
                          </TableCell>
                        );
                      case "Reward Cut":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
                            }}>
                            {cell.value / 10000}%
                          </TableCell>
                        );
                      case "Fee Cut":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
                            }}>
                            {cell.value === "0" || !cell.value
                              ? "100%"
                              : `${(100 - cell.value / 10000)
                                  .toFixed(2)
                                  .replace(/[.,]00$/, "")}%`}
                          </TableCell>
                        );
                      case "Price":
                        return (
                          <TableCell
                            cell={cell}
                            key={i}
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
                              pr: 0,
                            }}>
                            <span data-html={true}>
                              {cell.value <= 0 ? (
                                "N/A"
                              ) : (
                                <Price value={cell.value} per={priceSetting} />
                              )}
                            </span>
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
                            pushSx={{
                              textAlign: "right",
                              fontFamily: "monospace",
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
        sx={{
          py: 4,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <RiArrowLeftLine
          sx={{
            cursor: "pointer",
            color: canPreviousPage ? "primary" : "text",
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage();
            }
          }}
        />
        <Box sx={{ fontSize: 1, mx: 2 }}>
          Page <span sx={{ fontFamily: "monospace" }}>{pageIndex + 1}</span> of{" "}
          <span sx={{ fontFamily: "monospace" }}>{pageCount}</span>
        </Box>
        <RiArrowRightLine
          sx={{
            cursor: "pointer",
            color: canNextPage ? "primary" : "text",
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
            <Help
              data-tip="Total LPT staked with an orchestrator, including its own stake."
              data-for="tooltip-stake"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
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
            <Help
              data-tip="Total ETH earned from transcoding."
              data-for="tooltip-fees"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
                top: "1px",
                width: 12,
                height: 12,
              }}
            />
          </>
        );
      case "Price":
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
            <Help
              data-tip={`Price of transcoding per ${expandedPriceLabels[priceSetting]}.`}
              data-for="tooltip-price"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
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
            <Help
              data-tip="The percent of the newly minted Livepeer token that the orchestrator will keep from the round’s inflation distribution. The remainder gets distributed amongst delegators."
              data-for="tooltip-reward-cut"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
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
            <Help
              data-tip="The percent of the earned fees (ETH) that the orchestrator will keep. The remainder gets distributed across all delegators by how much they have staked relative to others."
              data-for="tooltip-fee-cut"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
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
            <Help
              data-tip="The number of times an orchestrator claimed its newly minted rewards on behalf of its delegators over the last 30 rounds."
              data-for="tooltip-calls"
              sx={{
                cursor: "pointer",
                position: "relative",
                ml: 1,
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
    { children, href, target, cell, onClick, as, pushSx }: TableCellProps,
    ref
  ) => {
    return (
      <Styled.div
        as={as}
        target={target}
        href={href}
        ref={ref}
        onClick={onClick}
        sx={{
          justifyContent: "flex-end",
          color: "inherit",
          display: "table-cell",
          width: "auto",
          fontSize: 1,
          px: 3,
          verticalAlign: "middle",
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,.05)",
          ...pushSx,
        }}
        {...cell.getCellProps()}>
        {children}
      </Styled.div>
    );
  }
);

export default StakingTable;
