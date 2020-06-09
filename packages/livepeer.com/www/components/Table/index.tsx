import { Box, Flex } from "@theme-ui/components";
import { SxStyleProp } from "theme-ui";
import { FunctionComponent } from "react";

type TableProps = {
  className?: string;
};

export const Table: FunctionComponent<TableProps> = ({
  className = null,
  children
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "space-around"
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

type TableCellProps = {
  selected: boolean;
  variant: string;
  sx?: SxStyleProp;
};

export const TableCell: FunctionComponent<TableCellProps> = props => {
  const { children, selected, variant } = props;
  let sx = {
    ...props.sx,
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
  if (variant === TableRowVariant.Header) {
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
  } else if (variant === TableRowVariant.Normal) {
    sx = {
      ...sx,
      borderBottomColor: "muted",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid"
    };
  } else if (variant === TableRowVariant.ComplexTop) {
    sx = {
      ...sx,
      paddingBottom: 0
    };
  } else if (variant === TableRowVariant.ComplexMiddle) {
    sx = {
      ...sx,
      paddingBottom: 0,
      paddingTop: 0
    };
  } else if (variant === TableRowVariant.ComplexBottom) {
    sx = {
      ...sx,
      paddingTop: 0,
      borderBottomColor: "muted",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid"
    };
  }
  return <Box sx={sx}>{children}</Box>;
};

export enum TableRowVariant {
  Header = "header",
  Normal = "normal",
  ComplexTop = "complexTop",
  ComplexMiddle = "complexMiddle",
  ComplexBottom = "complexBottom"
}

type TableRowProps = {
  variant?: TableRowVariant;
  selected?: boolean;
  selectable?: boolean;
  sx?: SxStyleProp;
  onClick?: Function;
};

export const TableRow: FunctionComponent<TableRowProps> = ({
  children,
  variant = TableRowVariant.Normal,
  selected = false,
  selectable = true,
  sx = null,
  onClick = () => {}
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "contents",
        cursor:
          variant === TableRowVariant.Header || !selectable
            ? "normal"
            : "pointer",
        userSelect: "none",
        "&:last-of-type": {
          ">div": {
            borderBottomStyle: "none"
          }
        }
      }}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <TableCell selected={selected} key={i} variant={variant}>
            {child}
          </TableCell>
        ))
      ) : (
        <TableCell selected={selected} variant={variant} sx={sx}>
          {children}
        </TableCell>
      )}
    </Box>
  );
};

// Could move to live elsewhere someday.
export const Checkbox = ({ value }: { value: boolean }) => {
  return (
    <Flex
      sx={{ height: "100%", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "12px",
          height: "12px",
          backgroundColor: value ? "primary" : "transparent",
          borderWidth: "1px",
          borderRadius: "3px",
          borderStyle: "solid",
          borderColor: "primary"
        }}
      ></Box>
    </Flex>
  );
};
