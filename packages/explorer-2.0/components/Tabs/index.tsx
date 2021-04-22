import Link from "next/link";
import Box from "../Box";

export interface TabType {
  name: string;
  href: string;
  as: string;
  isActive?: boolean;
}

const Index = ({ tabs, ...props }) => {
  return (
    <Box
      css={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        position: "relative",
        borderBottom: "1px solid",
        borderColor: "$border",
      }}
      {...props}
    >
      {tabs.map((tab: TabType, i: number) => (
        <Link key={i} href={tab.href} as={tab.as} passHref>
          <Box
            as="a"
            css={{
              color: tab.isActive ? "$white" : "$muted",
              mr: "22px",
              pb: "10px",
              fontSize: "$2",
              fontWeight: 500,
              borderBottom: "2px solid",
              borderColor: tab.isActive ? "$primary" : "transparent",
            }}
          >
            {tab.name}
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default Index;
