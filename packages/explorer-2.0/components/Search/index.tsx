import Router from "next/router";
import { MdSearch } from "react-icons/md";

function handleSubmit(e) {
  e.preventDefault();
  const [_, input] = e.target.children;
  Router.push(`/accounts/[account]/[slug]`, `/accounts/${input.value}/staking`);
}

const Index = ({ pushSx }) => {
  return (
    <form
      onSubmit={handleSubmit}
      sx={{
        bg: "black",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
        boxShadow:
          "rgba(0, 0, 0, 0.04) 0px 24px 32px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 0px 1px",
        ...pushSx,
      }}>
      <button
        sx={{
          cursor: "pointer",
          position: "absolute",
          right: 2,
          mr: 1,
          display: "flex",
          alignItems: "center",
        }}
        type="submit">
        <MdSearch
          sx={{
            fontSize: 4,
            color: "muted",
          }}
        />
      </button>
      <input
        name="search"
        sx={{
          outlineColor: "#00EB88",
          py: 12,
          pl: 2,
          pr: 8,
          border: 0,
          boxShadow: "none",
          width: "100%",
          color: "text",
          fontSize: 2,
          bg: "transparent",
          "&:-internal-autofill-selected": {
            bg: "transparent !important",
          },
        }}
        placeholder="Search Orchestrators & Delegators"
        type="search"
      />
    </form>
  );
};
export default Index;
