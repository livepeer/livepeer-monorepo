/** @jsx jsx */
import React from "react";
import { Styled, jsx, Flex, Box } from "theme-ui";
import Metamask from "../Metamask";
import Orchestrators from "../../static/img/orchestrators.svg";
import Stake from "../../static/img/stake.svg";
import Network from "../../static/img/network.svg";
import Account from "../../static/img/account.svg";
import Search from "../../static/img/search.svg";
import { StyledLink } from "./styles";
import MetaMaskContext from "../../lib/metamask";

const items = [
  { name: "Orchestrators", icon: Orchestrators },
  { name: "Network", icon: Network },
  { name: "Search", icon: Search },
  { name: "Transactions", icon: Search },
  { name: "Account", icon: Account }
];
export default () => {
  return (
    <Flex
      sx={{
        width: 256,
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Flex
        sx={{
          position: "fixed",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: 256,
          borderRight: "1px solid",
          borderColor: "border",
          paddingTop: 4
        }}
      >
        <Box>
          <Styled.img
            sx={{ pl: 3, width: 140, mb: 4 }}
            src="/static/img/logo.svg"
          />
          <Box>
            {items.map((item, i) => (
              <StyledLink key={i} i={i}>
                <item.icon sx={{ width: 16, mr: 3 }} />
                {item.name}
              </StyledLink>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%"
          }}
        >
          <Box
            sx={{
              py: 4,
              borderTop: "1px solid",
              borderColor: "border",
              mx: 3
            }}
          >
            <MetaMaskContext.Provider immediate>
              <Metamask />
            </MetaMaskContext.Provider>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};
