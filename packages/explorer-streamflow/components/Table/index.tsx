import React from "react";
import * as Utils from "web3-utils";
import { Flex } from "rebass";
import MaterialTable, { MTableToolbar, MTableCell } from "material-table";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { Styled, useThemeUI } from "theme-ui";
import Orchestrators from "../../static/img/orchestrators.svg";
import QRCode from "qrcode.react";
import { AvatarGroup } from "./styles";

export default ({ transcoders }) => {
  const context = useThemeUI();

  // Apply theme-ui settings to material-ui component
  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: context.theme.colors.background
      },
      secondary: {
        main: context.theme.colors.grey[3]
      },
      background: {
        default: context.theme.colors.background,
        paper: context.theme.colors.background
      },
      text: {
        primary: context.theme.colors.grey[3],
        secondary: context.theme.colors.grey[3]
      },
      action: {
        active: context.theme.colors.grey[3]
      }
    },
    typography: {
      fontFamily: context.theme.fonts.body
    },
    overrides: {
      MuiToolbar: {
        regular: {
          paddingRight: "0",
          paddingLeft: "0",
          minHeight: "initial",
          width: "100%",
          ["@media (min-width: 600px)"]: {
            minHeight: "initial"
          },
          ["@media (min-width: 0px) and (orientation: landscape)"]: {
            minHeight: "initial"
          }
        }
      },
      MuiInput: {
        underline: {
          "&:before": {
            borderBottom: "1px solid rgba(255, 255, 255, 0.42)"
          }
        }
      },
      MuiTableRow: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(107, 230, 145, .1)",
            transition: "background-color .2s, color .2s"
          }
        },
        footer: {
          "&:hover": {
            backgroundColor: "initial"
          }
        }
      },
      MuiTableCell: {
        root: {
          borderBottom: 0,
          padding: "14px 20px 14px 20px",
          "&:first-child": {
            paddingLeft: 32
          },
          "&:last-child": {
            paddingRight: 32
          }
        }
      },
      MuiPaper: {
        root: {
          width: "100%"
        },
        elevation2: {
          boxShadow: "none"
        }
      }
    }
  });

  const Toolbar = (props: any) => (
    <Flex px={4} alignItems="center">
      <Orchestrators
        style={{
          color: context.theme.colors.primary,
          width: 36,
          height: 36,
          marginRight: 18
        }}
      />
      <MTableToolbar {...props} />
    </Flex>
  );

  const Cell = (props: any) => {
    let cellValue: any;
    switch (props.columnDef.field) {
      case "id":
        cellValue = (
          <AvatarGroup>
            <QRCode
              style={{
                borderRadius: 1000,
                width: 32,
                height: 32,
                marginRight: 10
              }}
              fgColor={`#${props.value.substr(2, 6)}`}
              value={props.value}
            />
            {props.value.substring(0, 10)}...
          </AvatarGroup>
        );
        break;
      case "totalStake":
        cellValue = (+parseFloat(Utils.fromWei(props.value)).toFixed(
          2
        )).toLocaleString();
        break;
      case "rewardCut":
        cellValue = `${props.value / 10000}%`;
        break;
      case "feeShare":
        cellValue = `${props.value / 10000}%`;
        break;
      default:
        cellValue = props.value;
    }
    return <MTableCell {...props} value={cellValue} />;
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <MaterialTable
        columns={[
          {
            title: "Name",
            field: "id"
          },
          {
            title: "Fee Cut",
            field: "feeShare"
          },
          {
            title: "Reward Cut",
            field: "rewardCut"
          },
          {
            title: "Stake",
            field: "totalStake"
          }
        ]}
        data={transcoders}
        title="ORCHESTRATORS"
        options={{
          doubleHorizontalScroll: true,
          paging: false,
          search: true,
          draggable: false,
          showTextRowsSelected: false,
          headerStyle: { position: "sticky", top: 0 },
          maxBodyHeight: "calc(100vh - 126px)"
        }}
        components={{
          Toolbar: props => <Toolbar {...props} />,
          Cell: props => <Cell {...props} />
        }}
      />
    </MuiThemeProvider>
  );
};
