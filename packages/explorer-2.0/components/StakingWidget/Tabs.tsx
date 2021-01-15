import {
  Tabs as ReachTabs,
  TabList as ReachTabList,
  Tab as ReachTab,
} from "@reach/tabs";

export const Tabs = (props) => <ReachTabs {...props} />;

export const TabList = (props) => (
  <ReachTabList
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      position: "relative",
      borderRadius: 32,
      mb: 2,
    }}
    {...props}
  />
);

export const Tab = (props) => (
  <ReachTab
    sx={{
      flex: 1,
      outline: "none",
      cursor: "pointer",
      textAlign: "center",
      color: props.isSelected
        ? props.children == "Unstake"
          ? "red"
          : "primary"
        : "muted",
      py: 1,
      width: "50%",
      fontSize: 1,
      borderRadius: 32,
      fontWeight: 500,
      bg: props.isSelected
        ? props.children == "Unstake"
          ? "rgba(255,0,34,.08)"
          : "rgba(0,235,136,.08)"
        : "transparent",
    }}
    {...props}
  />
);
