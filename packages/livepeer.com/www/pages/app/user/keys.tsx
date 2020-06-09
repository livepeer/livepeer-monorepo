import useApi from "../../../hooks/use-api";
import Layout from "../../../components/Layout";
import useLoggedIn from "../../../hooks/use-logged-in";
import TabbedLayout from "../../../components/TabbedLayout";
import TokenTable from "../../../components/TokenTable";
import { getTabs } from "../user";

export default () => {
  useLoggedIn();
  const { user, logout } = useApi();
  if (!user || user.emailValid === false) {
    return <Layout />;
  }
  const tabs = getTabs(1);

  return (
    <TabbedLayout tabs={tabs} logout={logout}>
      <TokenTable id="API Token Table" userId={user.id} />
    </TabbedLayout>
  );
};
