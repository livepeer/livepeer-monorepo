import React from "react";
import * as Utils from "web3-utils";
import { Flex } from "rebass";
import MaterialTable, { MTableToolbar, MTableCell } from "material-table";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useThemeUI } from "theme-ui";
import Orchestrators from "../../static/img/orchestrators.svg";

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
        root: {
          paddingRight: "0 !important",
          paddingLeft: "0 !important",
          minHeight: "initial !important"
        }
      },
      MuiTableCell: {
        root: {
          borderBottom: 0,
          padding: "14px 40px 14px 40px",
          "&:first-child": {
            paddingLeft: 64
          },
          "&:last-child": {
            paddingRight: 64
          }
        }
      },
      MuiPaper: {
        elevation2: {
          boxShadow: "none"
        }
      }
    }
  });

  const Toolbar = (props: any) => (
    <Flex px={5} alignItems="center">
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
            title: "Fee Cut",
            field: "feeShare"
          },
          {
            title: "Reward Cut",
            field: "rewardCut"
          },
          {
            title: "Total Stake",
            field: "totalStake"
          }
        ]}
        data={transcoders}
        title="ORCHESTRATORS"
        options={{
          doubleHorizontalScroll: true,
          pageSize: 10,
          search: false
        }}
        components={{
          Toolbar: props => <Toolbar {...props} />,
          Cell: props => <Cell {...props} />
        }}
      />
    </MuiThemeProvider>
  );
};
