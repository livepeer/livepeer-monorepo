import styled from "@emotion/styled";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { colors } from "@material-ui/core";

let { grey, green, red, common } = colors;

export const Root = styled.article({
  background: common.white,
  boxShadow:
    "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)",
  borderRadius: "8px"
});

export const Header = styled.header({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px"
});

export const HeaderGroup = styled.div({
  display: "flex",
  alignItems: "center"
});

export const Status = styled.div<{ active?: boolean }>(props => ({
  backgroundColor: props.active ? green[900] : red[900],
  color: grey[900],
  borderRadius: 1000,
  fontSize: 12,
  fontWeight: 600,
  alignSelf: "center",
  padding: "2px 10px",
  lineHeight: "20px"
}));

export const Title = styled.h2({
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  fontSize: 16,
  color: grey[900],
  letterSpacing: "1px"
});

export const Table = styled.div({
  display: "table",
  width: "100%",
  borderCollapse: "collapse",
  borderSpacing: 0
});

export const TableHead = styled.div({
  display: "table-header-group",
  borderBottom: `1px solid ${grey[500]}`,
  fontWeight: 500
});

export const TableRow = styled.div({
  display: "table-row",
  height: 32,
  verticalAlign: "middle",
  outline: "none"
});

export const TableBody = styled.div({
  display: "table-row-group"
});

export const TableCell = styled.div({
  display: "table-cell",
  verticalAlign: "inherit",
  fontSize: 14,
  lineHeight: "22px",
  textAlign: "left",
  padding: "4px 56px 4px 24px",
  "&:last-child": {
    paddingRight: 24
  }
});

export const Footer = styled.footer({
  alignItems: "center",
  display: "flex",
  padding: "16px 24px",
  fontSize: 12
});

export const StyledDialogContentText = styled(DialogContentText)({});

export const StyledDialogTitle = styled(DialogTitle)({});
