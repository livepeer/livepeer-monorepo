import useApi from "../../../hooks/use-api";
import Layout from "../../../components/Layout";
import useLoggedIn from "../../../hooks/use-logged-in";
import TabbedLayout from "../../../components/TabbedLayout";
import AdminTokenTable from "../../../components/AdminTokenTable";
import { getTabs } from "../admin";

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user || user.emailValid === false) {
    return <Layout />;
  }
  const tabs = getTabs(1);

  return (
    <TabbedLayout tabs={tabs} logout={logout}>
      <AdminTokenTable id="Admin API Token Table" userId={user.id} />
    </TabbedLayout>
  );
};
