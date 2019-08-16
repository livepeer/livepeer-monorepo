/** @jsx jsx */
import React from "react";
import { useContext } from "react";
import MetaMaskContext from "../../lib/metamask";
import { jsx, Styled, Flex } from "theme-ui";
import Metamask from "../../static/img/metamask.svg";

const Auth = ({ status, accountId = "", ...props }) => {
  let statusColor: string;
  console.log(status);
  if (status === "Connected") {
    statusColor = "primary";
  } else if (status === "Locked") {
    statusColor = "yellow";
  } else if (status === "No wallet") {
    statusColor = "red";
  } else {
    statusColor = "muted";
  }

  return (
    <Flex
      {...props}
      sx={{
        justifyContent: "center"
      }}
    >
      <Metamask sx={{ mt: accountId ? 1 : 0, mr: 3, color: statusColor }} />
      <Styled.div sx={{ color: "muted", lineHeight: "initial" }}>
        <Styled.div sx={{ fontSize: 1, fontWeight: "500" }}>
          {status}
        </Styled.div>
        {accountId && (
          <Styled.div sx={{ mt: 1, fontSize: 0, fontFamily: "monospace" }}>
            {accountId}
          </Styled.div>
        )}
      </Styled.div>
    </Flex>
  );
};

export default () => {
  const { web3, accounts, error, awaiting, openMetaMask } = useContext(
    MetaMaskContext
  );
  if (error && error.message === "MetaMask not installed") {
    return <Auth status="No wallet" />;
  } else if (error && error.message === "User denied account authorization") {
    return <Auth onClick={openMetaMask} status="Locked" accountId="" />;
  } else if (error && error.message === "MetaMask is locked") {
    return <Auth onClick={openMetaMask} status="Locked" accountId="" />;
  } else if (error) {
    return <Auth onClick={openMetaMask} status="Locked" accountId="" />;
  } else if (!web3 || awaiting) {
    return <div>Loading Metamask</div>;
  } else if (!web3) {
    return <Auth onClick={openMetaMask} status="Locked" accountId="" />;
  } else if (accounts.length === 0) {
    return <Auth status="No wallet" />;
  } else {
    // `web3` and `account` loaded 🎉
    return (
      <div>
        <Auth
          status="Connected"
          accountId={`${accounts[0].substring(0, 10)}...`}
        />
      </div>
    );
  }
};
