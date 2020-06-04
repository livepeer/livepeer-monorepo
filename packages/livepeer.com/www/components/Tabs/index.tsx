import Link from "next/link";

export interface TabType {
  name: string;
  href: string;
  as?: string;
  isActive?: boolean;
}

type TabsProps = {
  tabs: Array<TabType>;
};

export default ({ tabs }: TabsProps) => {
  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 958,
        mb: [3, 3],
        mx: "auto",
        position: "relative",
        borderBottom: "1px solid",
        borderColor: "muted"
      }}
    >
      {tabs.map((tab: TabType, i: number) => (
        <Link key={i} href={tab.href} as={tab.as} passHref>
          <a
            sx={{
              color: "black",
              mr: "22px",
              pb: "1px",
              fontSize: 1,
              fontWeight: tab.isActive ? "bolder" : 300,
              borderBottom: "2px solid",
              textDecoration: "none",
              borderColor: tab.isActive ? "primary" : "transparent"
            }}
          >
            {tab.name}
          </a>
        </Link>
      ))}
    </div>
  );
};
