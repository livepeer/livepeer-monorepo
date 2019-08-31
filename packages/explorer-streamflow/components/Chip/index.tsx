/** @jsx jsx */
import { Styled, jsx } from "theme-ui";

export default ({ label, variant = "primary", ...props }) => (
  <Styled.div
    sx={{
      borderRadius: 1000,
      bg: "grey",
      px: 1,
      py: "4px",
      display: "inline-flex",
      fontSize: 0,
      fontWeight: 600,
      ...props.sx
    }}
  >
    {label}
  </Styled.div>
);
