import Box from "../Box";
import Flex from "../Flex";
import Hamburger from "../Hamburger";
import React from "react";
import AccountMenu from "../AccountMenu";

interface Props {
  onDrawerOpen: Function;
  title?: JSX.Element | string;
}

const Index = ({ onDrawerOpen, title }: Props) => {
  return (
    <Flex
      css={{
        bg: "$background",
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        py: "$2",
        px: "$3",
        "@bp3": {
          py: "$3",
          display: "none",
        },
      }}
    >
      <Flex css={{ alignItems: "center" }}>
        <Hamburger onClick={onDrawerOpen} />
        {title && <Box css={{ fontWeight: 600 }}>{title}</Box>}
      </Flex>
      <AccountMenu isInHeader={true} />
    </Flex>
  );
};

export default Index;
