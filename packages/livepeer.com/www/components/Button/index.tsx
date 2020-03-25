import { Button } from "@theme-ui/components";
import Ink from "react-ink";

export default ({ children, ...props }) => {
  return (
    <Button {...props} sx={{ position: "relative" }}>
      <Ink />
      {children}
    </Button>
  );
};
