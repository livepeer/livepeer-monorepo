import Flex from "../../../components/Flex";
import { useRouter } from "next/router";
import { getLayout } from "../../../layouts/main";
import { useQuery } from "@apollo/client";
import Tabs, { TabType } from "../../../components/Tabs";
import Profile from "../../../components/Profile";
import StakingWidget from "../../../components/StakingWidget";
import TokenholdersView from "../../../components/TokenholdersView";
import CampaignView from "../../../components/CampaignView";
import StakingView from "../../../components/StakingView";
import Spinner from "../../../components/Spinner";
import { useWeb3React } from "@web3-react/core";
import { checkAddressEquality } from "../../../lib/utils";
import HistoryView from "../../../components/HistoryView";
import { withApollo } from "../../../apollo";
import BottomDrawer from "../../../components/BottomDrawer";
import useWindowSize from "react-use/lib/useWindowSize";
import FeesView from "../../../components/FeesView";
import { usePageVisibility } from "../../../hooks";
import { useEffect } from "react";
import accountViewQuery from "../../../queries/accountView.gql";
import accountQuery from "../../../queries/account.gql";
import { gql } from "@apollo/client";
import { NextPage } from "next";

const pollInterval = 20000;

const Account = () => {
  const context = useWeb3React();
  const { width } = useWindowSize();
  const isVisible = usePageVisibility();
  const router = useRouter();
  const { query, asPath } = router;
  const slug = query.slug;

  const {
    data,
    loading,
    refetch,
    startPolling: startPollingAccount,
    stopPolling: stopPollingAccount,
  } = useQuery(accountViewQuery, {
    variables: {
      account: query?.account?.toString().toLowerCase(),
      pollInterval,
    },
  });
  const {
    data: dataTranscoders,
    loading: loadingTranscoders,
    startPolling: startPollingOrchestrators,
    stopPolling: stopPollingOrchestrators,
  } = useQuery(
    gql`
      {
        transcoders(
          orderDirection: desc
          orderBy: totalStake
          where: { active: true }
        ) {
          id
          totalStake
        }
      }
    `,
    {
      pollInterval,
    }
  );

  const {
    data: dataMyAccount,
    startPolling: startPollingMyAccount,
    stopPolling: stopPollingMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval: 10000,
    skip: !context.active, // skip this query if wallet not connected
  });

  useEffect(() => {
    if (!isVisible) {
      stopPollingOrchestrators();
      stopPollingMyAccount();
      stopPollingAccount();
    } else {
      startPollingOrchestrators(pollInterval);
      startPollingMyAccount(pollInterval);
      startPollingAccount(pollInterval);
    }
  }, [
    isVisible,
    stopPollingOrchestrators,
    stopPollingMyAccount,
    stopPollingAccount,
    startPollingOrchestrators,
    startPollingMyAccount,
    startPollingAccount,
  ]);

  const SELECTED_STAKING_ACTION = gql`
    {
      selectedStakingAction @client
    }
  `;
  const { data: selectedStakingAction } = useQuery(SELECTED_STAKING_ACTION);

  if (loading || loadingTranscoders) {
    return (
      <Flex
        css={{
          height: "calc(100vh - 100px)",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          "@bp3": {
            height: "100vh",
          },
        }}>
        <Spinner />
      </Flex>
    );
  }

  const isMyAccount = checkAddressEquality(
    context?.account,
    query?.account?.toString()
  );
  const isOrchestrator = data?.transcoder;
  const isMyDelegate =
    query?.account?.toString() === dataMyAccount?.transcoder?.id;

  let role: string;

  if (isOrchestrator || isMyDelegate) {
    role = "Orchestrator";
  } else if (+data?.delegator?.bondedAmount > 0) {
    role = "Delegator";
  }

  const tabs: Array<TabType> = getTabs(
    role,
    query?.account?.toString(),
    asPath,
    isMyDelegate
  );

  return (
    <>
      <Flex
        css={{
          flexDirection: "column",
          mb: "$6",
          pr: 0,
          pt: "$2",
          width: "100%",
          "@bp3": {
            width: role === "Orchestrator" || isMyDelegate ? "72%" : "100%",
            pt: "$4",
            pr: "$5",
          },
        }}>
        <Profile
          account={query?.account.toString()}
          delegator={data.delegator}
          threeBoxSpace={data.threeBoxSpace}
          isMyDelegate={isMyDelegate}
          isMyAccount={isMyAccount}
          refetch={refetch}
          role={role}
          transcoder={data.transcoder}
        />
        <Tabs tabs={tabs} />
        {slug === "campaign" && (
          <CampaignView
            currentRound={data.protocol.currentRound}
            transcoder={data.transcoder}
          />
        )}
        {slug === "fees" && (
          <FeesView delegator={data.delegator} isMyAccount={isMyAccount} />
        )}
        {slug === "tokenholders" && <TokenholdersView />}
        {slug === "staking" && (
          <StakingView
            transcoders={dataTranscoders.transcoders}
            delegator={data.delegator}
            protocol={data.protocol}
            currentRound={data.protocol.currentRound}
          />
        )}
        {slug === "history" && <HistoryView />}
      </Flex>
      {(role === "Orchestrator" || isMyDelegate) &&
        (width > 1020 ? (
          <Flex
            css={{
              display: "none",
              position: "sticky",
              alignSelf: "flex-start",
              top: "$4",
              mt: "$4",
              width: "40%",
              "@bp3": {
                width: "28%",
                display: "flex",
              },
            }}>
            <StakingWidget
              currentRound={data.protocol.currentRound}
              transcoders={dataTranscoders.transcoders}
              delegator={dataMyAccount?.delegator}
              account={dataMyAccount?.account}
              transcoder={data.transcoder}
              protocol={data.protocol}
            />
          </Flex>
        ) : (
          <BottomDrawer>
            <StakingWidget
              transcoders={dataTranscoders.transcoders}
              selectedAction={selectedStakingAction?.selectedStakingAction}
              currentRound={data.protocol.currentRound}
              delegator={dataMyAccount?.delegator}
              account={dataMyAccount?.account}
              transcoder={data.transcoder}
              protocol={data.protocol}
            />
          </BottomDrawer>
        ))}
    </>
  );
};

Account.getLayout = getLayout;

export default withApollo({
  ssr: false,
})(Account as NextPage);

function getTabs(
  role: string,
  account: string,
  asPath: string,
  isMyDelegate: boolean
): Array<TabType> {
  const tabs: Array<TabType> = [
    {
      name: "Staking",
      href: "/accounts/[account]/[slug]",
      as: `/accounts/${account}/staking`,
      isActive: asPath === `/accounts/${account}/staking`,
    },
    {
      name: "Earned Fees",
      href: "/accounts/[account]/[slug]",
      as: `/accounts/${account}/fees`,
      isActive: asPath === `/accounts/${account}/fees`,
    },
    {
      name: "History",
      href: "/accounts/[account]/[slug]",
      as: `/accounts/${account}/history`,
      isActive: asPath === `/accounts/${account}/history`,
    },
  ];
  if (role === "Orchestrator" || isMyDelegate) {
    tabs.unshift({
      name: "Campaign",
      href: "/accounts/[account]/[slug]",
      as: `/accounts/${account}/campaign`,
      isActive: asPath === `/accounts/${account}/campaign`,
    });
  }

  return tabs;
}
