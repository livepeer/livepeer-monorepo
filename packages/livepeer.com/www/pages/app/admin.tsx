import useApi from "../../hooks/use-api";
import Layout from "../../components/Layout";
import useLoggedIn from "../../hooks/use-logged-in";
import UserTable from "../../components/UserTable";
import TabbedLayout from "../../components/TabbedLayout";
import { TabType } from "../../components/Tabs";

export function getTabs(i: number): Array<TabType> {
  const tabs = [
    {
      name: "Users",
      href: "/app/admin",
      isActive: false
    },
    {
      name: "API Keys",
      href: "/app/admin/keys",
      isActive: false
    },
    {
      name: "Streams",
      href: "/app/admin/streams",
      isActive: false
    }
  ];
  return tabs.map((t, ti) => (ti === i ? { ...t, isActive: true } : t));
}

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user || user.emailValid === false || !user.admin) {
    return <Layout />;
  }
  const tabs = getTabs(0);

  return (
    <TabbedLayout tabs={tabs} logout={logout}>
      <UserTable id="User Table" userId={user.id} />
    </TabbedLayout>
  );
};
