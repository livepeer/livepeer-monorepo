import { Root, Title } from "./styles";
import SearchBar from "../SearchBar";

export default ({ title }: any) => (
  <Root>
    <Title>{title}</Title>
    <SearchBar />
  </Root>
);
