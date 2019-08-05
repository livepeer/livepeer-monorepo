import { Root } from "./styles";

const Chip = ({ children, ...other }: any) => (
  <Root {...other}>{children}</Root>
);

export default Chip;
