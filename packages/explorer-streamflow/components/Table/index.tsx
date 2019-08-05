import MaterialTable from "material-table";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useThemeUI } from "theme-ui";

export default ({ transcoders }: any) => {
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
      MuiTableCell: {
        root: {
          borderBottom: 0,
          padding: "14px 40px 14px 24px"
        }
      },
      MuiPaper: {
        elevation2: {
          boxShadow: "none"
        }
      }
    }
  });

  return (
    <div>
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
          title="Orchestrators"
          options={{ pageSize: 10, search: false }}
        />
      </MuiThemeProvider>
    </div>
  );
};
