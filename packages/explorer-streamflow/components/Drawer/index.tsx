/** @jsx jsx */
import React from "react";
import { Styled, jsx, Flex, Box } from "theme-ui";
import Orchestrators from "../../static/img/orchestrators.svg";
import Stake from "../../static/img/stake.svg";
import Network from "../../static/img/network.svg";
import Account from "../../static/img/account.svg";
import { StyledLink } from "./styles";

const items = [
  { name: "Orchestrators", icon: Orchestrators },
  { name: "Stake", icon: Stake },
  { name: "Network", icon: Network },
  { name: "Account", icon: Account }
];
export default () => {
  return (
    <Flex sx={{ width: 256, flexDirection: "column", height: "100vh" }}>
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: 256,
          borderRight: "1px solid",
          borderColor: "grey.8",
          paddingTop: 5
        }}
      >
        <Box>
          <Styled.img
            sx={{ pl: 3, width: 130, mb: 4 }}
            src="/static/img/logo.svg"
          />
          <Box>
            {items.map((item, i) => (
              <StyledLink key={i} i={i}>
                <item.icon sx={{ mr: 3 }} />
                {item.name}
              </StyledLink>
            ))}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};
