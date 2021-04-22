import {
  Tabs as ReachTabs,
  TabList as ReachTabList,
  Tab as ReachTab,
} from "@reach/tabs";
import Box from "../Box";

export const Tabs = (props) => <ReachTabs {...props} />;

export const TabList = (props) => (
  <Box
    as={ReachTabList}
    css={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "relative",
      borderRadius: 32,
      mb: "$3",
    }}
    {...props}
  />
);

export const Tab = (props) => (
  <Box
    as={ReachTab}
    css={{
      flex: 1,
      outline: "none",
      cursor: "pointer",
      textAlign: "center",
      border: 0,
      color: props.isSelected
        ? props.children === "Unstake"
          ? "$red"
          : "$primary"
        : "$muted",
      py: "10px",
      width: "50%",
      fontSize: "$2",
      borderRadius: 32,
      fontWeight: 500,
      bg: props.isSelected
        ? props.children === "Unstake"
          ? "rgba(255,0,34,.08)"
          : "rgba(0,235,136,.08)"
        : "transparent",
    }}
    {...props}
  />
);
