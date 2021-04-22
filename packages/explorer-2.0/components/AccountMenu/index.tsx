import Box from "../Box";
import Flex from "../Flex";
import Button from "../Button";
import Link from "next/link";
import { gql, useApolloClient } from "@apollo/client";
import AccountIcon from "../../public/img/account.svg";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { useWeb3React } from "@web3-react/core";
import Router, { useRouter } from "next/router";
import WalletIcon from "../../public/img/wallet.svg";
import {
  ChevronDownIcon,
  ExitIcon,
  ResetIcon,
  PersonIcon,
} from "@modulz/radix-icons";

const AccountMenu = ({ isInHeader = false }) => {
  const router = useRouter();
  const { asPath } = router;
  const context = useWeb3React();
  const ref = useRef();
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const client = useApolloClient();

  useOnClickOutside(ref, () => setAccountMenuOpen(false));

  Router.events.on("routeChangeStart", () => {
    setAccountMenuOpen(false);
  });

  return context?.active ? (
    <Box ref={ref} css={{ position: "relative" }}>
      <Flex css={{ alignItems: "center" }}>
        <Link
          href="/accounts/[account]/[slug]"
          as={`/accounts/${context.account}/staking`}
          passHref>
          <Box
            as="a"
            css={{
              color:
                asPath.split("?")[0] === `/accounts/${context.account}/staking`
                  ? "$text"
                  : "$muted",
              lineHeight: "initial",
              display: "flex",
              fontSize: "$2",
              fontWeight: 500,
              cursor: "pointer",
              alignItems: "center",
              py: "10px",
              backgroundColor: "transparent",
              borderRadius: 5,
              transition: "color .3s",
              "&:hover": {
                color: "white",
                transition: "color .3s",
              },
            }}>
            <Flex
              css={{
                width: 18,
                height: 18,
                mr: "$3",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <AccountIcon />
            </Flex>
            <Box>
              {context.account.replace(context.account.slice(5, 39), "…")}
            </Box>
          </Box>
        </Link>
        <Flex
          css={{
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            ml: 14,
            cursor: "pointer",
            borderRadius: 1000,
            bg: "rgba(255,255,255,.08)",
            transition: ".2s",
            "&:hover": {
              transition: ".2s",
              bg: "rgba(255,255,255,.16)",
            },
          }}
          onClick={() => {
            isAccountMenuOpen
              ? setAccountMenuOpen(false)
              : setAccountMenuOpen(true);
          }}>
          <Box
            as={ChevronDownIcon}
            css={{
              transition: ".1s",
              transform: isAccountMenuOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        </Flex>
      </Flex>
      {isAccountMenuOpen && (
        <Box
          css={{
            top: 50,
            position: "absolute",
            bg: "$background",
            boxShadow:
              "0 12px 28px 0 rgba(0, 0, 0, 0.2),0 2px 4px 0 rgba(0, 0, 0, 0.1),inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            width: "100%",
            left: 0,
            p: "$3",
            zIndex: 1,
            fontSize: "$2",
          }}>
          <Link
            href="/accounts/[account]/[slug]"
            as={`/accounts/${context.account}/staking`}
            passHref>
            <Box
              as="a"
              css={{
                color: "$text",
                display: "flex",
                mb: "$3",
                alignItems: "center",
                cursor: "pointer",
                transition: ".2s",
                opacity: 0.7,
                "&:hover": {
                  transition: ".2s",
                  opacity: 1,
                },
              }}>
              <Box as={PersonIcon} css={{ mr: "$3" }} />
              View Profile
            </Box>
          </Link>
          <Flex
            css={{
              mb: "$3",
              alignItems: "center",
              cursor: "pointer",
              transition: ".2s",
              opacity: 0.7,
              "&:hover": {
                transition: ".2s",
                opacity: 1,
              },
            }}
            onClick={() => {
              client.writeQuery({
                query: gql`
                  query {
                    walletModalOpen
                  }
                `,
                data: {
                  walletModalOpen: true,
                },
              });
            }}>
            <Box as={ResetIcon} css={{ mr: "$3" }} />
            Switch wallet
          </Flex>
          <Flex
            css={{
              alignItems: "center",
              cursor: "pointer",
              transition: ".2s",
              opacity: 0.7,
              "&:hover": {
                transition: ".2s",
                opacity: 1,
              },
            }}
            onClick={() => {
              setAccountMenuOpen(false);
              context.deactivate();
            }}>
            <Box as={ExitIcon} css={{ mr: "$3" }} />
            Disconnect
          </Flex>
        </Box>
      )}
    </Box>
  ) : (
    <Box
      onClick={() => {
        client.writeQuery({
          query: gql`
            query {
              walletModalOpen
            }
          `,
          data: {
            walletModalOpen: true,
          },
        });
      }}>
      {isInHeader ? (
        <Button
          css={{
            mt: "3px",
            fontSize: 14,
            textTransform: "initial",
            borderRadius: 8,
            ml: "$3",
            fontWeight: 600,
            cursor: "pointer",
          }}
          color="primary"
          outline
          size="small">
          Connect Wallet
        </Button>
      ) : (
        <Box
          css={{
            color: "$muted",
            lineHeight: "initial",
            display: "flex",
            fontSize: "$2",
            fontWeight: 500,
            cursor: "pointer",
            alignItems: "center",
            py: "$2",
            backgroundColor: "transparent",
            borderRadius: 5,
            transition: "color .3s",
            "&:hover": {
              color: "$primary",
              transition: "color .3s",
            },
          }}>
          <Flex
            css={{
              width: 18,
              height: 18,
              mr: "$3",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <WalletIcon />
          </Flex>
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default AccountMenu;
