import { jsx, Styled } from "theme-ui";
import { storiesOf } from "@storybook/react";
import List from "./index";
import ListItem from "../ListItem";

storiesOf("List", module).add("default", () => (
  <List
    onScroll={() => {}}
    sx={{ minWidth: 600 }}
    header={<Styled.h4>Pending Stake Transactions</Styled.h4>}>
    <ListItem>a</ListItem>
    <ListItem>a</ListItem>
  </List>
));
