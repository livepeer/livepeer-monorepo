import Router from "next/router";
import Box from "../Box";
import { MagnifyingGlassIcon } from "@modulz/radix-icons";
import Button from "../Button";

function handleSubmit(e) {
  e.preventDefault();
  const [, input] = e.target.children;
  Router.push(`/accounts/[account]/[slug]`, `/accounts/${input.value}/staking`);
}

const Index = ({ ...props }) => {
  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      css={{
        bg: "black",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
        boxShadow:
          "rgba(0, 0, 0, 0.04) 0px 24px 32px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 0px 1px",
        mb: "$4",
      }}
      {...props}
    >
      <Button
        css={{
          cursor: "pointer",
          position: "absolute",
          right: "$3",
          mr: "$1",
          display: "flex",
          alignItems: "center",
          bg: "transparent",
          p: 0,
        }}
        type="submit"
      >
        <Box
          as={MagnifyingGlassIcon}
          css={{
            width: 20,
            height: 20,
            color: "$muted",
            bg: "transparent",
          }}
        />
      </Button>
      <Box
        as="input"
        name="search"
        css={{
          outlineColor: "#00EB88",
          py: "$3",
          px: "$3",
          border: 0,
          boxShadow: "none",
          width: "100%",
          color: "$text",
          fontSize: "$3",
          outline: "none",
          bg: "transparent",
          "&:-internal-autofill-selected": {
            bg: "transparent !important",
          },
        }}
        placeholder="Search Orchestrators & Delegators"
        type="search"
      />
    </Box>
  );
};
export default Index;
