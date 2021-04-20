import Box from "../Box";
import Flex from "../Flex";
import { useMemo } from "react";
import { useTable } from "react-table";
import QRCode from "qrcode.react";
import Link from "next/link";
import Utils from "web3-utils";
import { abbreviateNumber } from "../../lib/utils";

const Index = ({ protocol, delegators, ...props }) => {
  const columns: any = useMemo(
    () => [
      {
        Header: "#",
        accessor: "rank",
      },
      {
        Header: "Account",
        accessor: "id",
      },
      {
        Header: "Stake",
        accessor: "pendingStake",
      },
      {
        Header: "Equity",
        accessor: "pendingStake",
      },
    ],
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: delegators,
  });

  return (
    <Box
      as="table"
      css={{
        display: "table",
        width: "100%",
        borderSpacing: "0",
        borderCollapse: "collapse",
      }}
      {...getTableProps()}
      {...props}>
      <thead>
        {headerGroups.map((headerGroup, index1) => (
          <tr key={index1}>
            {headerGroup.headers.map((column, index2) => (
              <Box
                as="th"
                css={{ pb: "$4", textTransform: "uppercase" }}
                align="left"
                {...column.getHeaderProps()}
                key={index2}>
                <Box as="span" css={{ fontSize: "$1" }}>
                  {column.render("Header")}
                </Box>
              </Box>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row, index1) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={index1}>
              {row.cells.map((cell, index2) => {
                return (
                  <Box
                    as="td"
                    css={{ fontSize: "$2", pb: "$4" }}
                    {...cell.getCellProps()}
                    key={index2}>
                    {renderSwitch(cell, protocol)}
                  </Box>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Box>
  );
};

export default Index;

function renderSwitch(cell, protocol) {
  switch (cell.column.Header) {
    case "#":
      return (
        <Flex css={{ alignItems: "center", fontFamily: "$monospace" }}>
          {cell.row.index + 1}{" "}
        </Flex>
      );
    case "Account":
      return (
        <Flex css={{ alignItems: "center" }}>
          <QRCode
            style={{
              borderRadius: 1000,
              width: 32,
              height: 32,
              marginRight: 16,
            }}
            fgColor={`#${cell.value.substr(2, 6)}`}
            value={cell.value}
          />
          <Link
            href="/accounts/[account]/[slug]"
            as={`/accounts/${cell.value}/staking`}
            passHref>
            <Box
              as="a"
              css={{
                color: "$text",
                cursor: "pointer",
                transition: "all .3s",
                borderBottom: "1px solid",
                borderColor: "transparent",
                "&:hover": {
                  color: "$primary",
                  borderBottom: "1px solid",
                  borderColor: "$primary",
                  transition: "all .3s",
                },
              }}>
              {cell.value.replace(cell.value.slice(7, 37), "…")}
            </Box>
          </Link>
        </Flex>
      );
    case "Stake":
      return (
        <Box as="span" css={{ fontFamily: "$monospace" }}>
          {abbreviateNumber(parseFloat(Utils.fromWei(cell.value)), 4)}
        </Box>
      );
    case "Equity":
      return (
        <Box as="span" css={{ fontFamily: "$monospace" }}>{`${(
          (+cell?.value / +protocol?.totalActiveStake) *
          100
        ).toFixed(3)}%`}</Box>
      );
    default:
      return null;
  }
}
