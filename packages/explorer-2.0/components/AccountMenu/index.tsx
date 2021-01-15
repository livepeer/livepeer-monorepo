import { Flex, Box } from "theme-ui";
import Link from "next/link";
import { gql, useApolloClient } from "@apollo/client";
import Account from "../../public/img/account.svg";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { MdSwapHoriz } from "react-icons/md";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks";
import { useWeb3React } from "@web3-react/core";
import Router, { useRouter } from "next/router";
import WalletIcon from "../../public/img/wallet.svg";

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
    <Box ref={ref} sx={{ position: "relative" }}>
      <Flex sx={{ alignItems: "center" }}>
        <Link
          href="/accounts/[account]/[slug]"
          as={`/accounts/${context.account}/staking`}
          passHref>
          <a
            sx={{
              color:
                asPath.split("?")[0] === `/accounts/${context.account}/staking`
                  ? "white"
                  : "muted",
              lineHeight: "initial",
              display: "flex",
              fontSize: 14,
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
            <Account sx={{ width: 20, height: 20, mr: "10px" }} />
            <Box>
              {context.account.replace(context.account.slice(5, 39), "…")}
            </Box>
          </a>
        </Link>
        <Flex
          sx={{
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
          <FiChevronDown
            sx={{
              transition: ".1s",
              transform: isAccountMenuOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        </Flex>
      </Flex>
      {isAccountMenuOpen && (
        <Box
          sx={{
            top: 50,
            position: "absolute",
            bg: "background",
            boxShadow:
              "0 12px 28px 0 rgba(0, 0, 0, 0.2),0 2px 4px 0 rgba(0, 0, 0, 0.1),inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            width: "100%",
            left: 0,
            p: 2,
            zIndex: 1,
            fontSize: 1,
          }}>
          <Link
            href="/accounts/[account]/[slug]"
            as={`/accounts/${context.account}/staking`}
            passHref>
            <a
              sx={{
                color: "white",
                display: "flex",
                mb: 2,
                alignItems: "center",
                cursor: "pointer",
                transition: ".2s",
                opacity: 0.7,
                "&:hover": {
                  transition: ".2s",
                  opacity: 1,
                },
              }}>
              <FiUser sx={{ mr: 1 }} />
              View Profile
            </a>
          </Link>
          <Flex
            sx={{
              mb: 2,
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
            <MdSwapHoriz sx={{ mr: 1 }} />
            Switch wallet
          </Flex>
          <Flex
            sx={{
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
            <FiLogOut sx={{ mr: 1 }} />
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
        <Box
          sx={{
            mt: "3px",
            fontSize: 14,
            textTransform: "initial",
            borderRadius: 8,
            ml: 2,
            fontWeight: 600,
            cursor: "pointer",
          }}
          variant="buttons.primaryOutlineSmall">
          Connect Wallet
        </Box>
      ) : (
        <Box
          sx={{
            color: "muted",
            lineHeight: "initial",
            display: "flex",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            alignItems: "center",
            py: 1,
            backgroundColor: "transparent",
            borderRadius: 5,
            transition: "color .3s",
            "&:hover": {
              color: "primary",
              transition: "color .3s",
            },
          }}>
          <WalletIcon sx={{ width: 20, height: 20, mr: 1 }} />
          Connect Wallet
        </Box>
      )}
    </Box>
  );
};

export default AccountMenu;
