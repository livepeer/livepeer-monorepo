import { Box } from "@theme-ui/components";
import { SxStyleProp } from "theme-ui";

export const Table = ({ className = null, children }) => {
  return (
    <Box
      sx={{
        display: "grid"
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

export const TableCell = ({ children, selected, variant }) => {
  let sx = {
    backgroundColor: "transparent",
    py: 3,
    px: 3,
    color: "listText"
  } as SxStyleProp;
  if (selected) {
    // @ts-ignore
    sx = {
      ...sx
      // backgroundColor: "muted"
    };
  }
  if (variant === "header") {
    sx = {
      ...sx,
      fontVariant: "all-small-caps",
      backgroundColor: "muted",
      borderBottom: "1px solid muted",
      borderTop: "1px solid muted",
      py: 2,
      "&:first-of-type": {
        borderLeft: "1px solid muted",
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6
      },
      "&:last-of-type": {
        borderRight: "1px solid muted",
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6
      }
    };
  } else {
    sx = {
      ...sx,
      borderBottomColor: "muted",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid"
    };
  }
  return <Box sx={sx}>{children}</Box>;
};

export const TableRow = ({
  children,
  variant = "normal",
  selected = false,
  onClick = () => {}
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "contents",
        cursor: variant === "header" ? "normal" : "pointer",
        userSelect: "none",
        "&:last-of-type": {
          ">div": {
            borderBottomStyle: "none"
          }
        }
      }}
    >
      {children.map((child, i) => (
        <TableCell selected={selected} key={i} variant={variant}>
          {child}
        </TableCell>
      ))}
    </Box>
  );
};

// Could move to live elsewhere someday.
export const Checkbox = ({ value }) => {
  return <div>{value ? "◻️" : "☑️"}</div>;
};
