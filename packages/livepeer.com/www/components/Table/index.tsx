import { Box } from "@theme-ui/components";

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

export const TableCell = ({ children, selected }) => {
  return (
    <Box
      sx={{
        backgroundColor: selected ? "rgba(0,0,0,0.2)" : "transparent",
        padding: [3, 3]
      }}
    >
      {children}
    </Box>
  );
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
        backgroundColor: selected ? "rgba(0,0,0,0.2)" : "transparent",
        cursor: "pointer",
        padding: [3, 3],
        userSelect: "none"
      }}
    >
      {children.map((child, i) => (
        <TableCell selected={selected} key={i}>
          {child}
        </TableCell>
      ))}
    </Box>
  );
};
