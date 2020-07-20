import { Flex, Container, Link as A } from "@theme-ui/components";
import Button from "../Button";
import Link from "next/link";
import Logo from "../../public/img/logo.svg";
import { useApi } from "../../hooks";
import { Fragment } from "react";

export default () => {
  const { token, user } = useApi();
  return (
    <Container>
      <Flex
        sx={{
          py: 3,
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        <Link href="/" passHref>
          <A
            sx={{
              marginRight: "auto",
              cursor: "pointer"
            }}
          >
            <Logo sx={{ width: 120, color: "primary" }} />
          </A>
        </Link>
        <Link href="/#contactSection" passHref>
          <A variant="nav">Contact Us</A>
        </Link>
        <Link href="/docs" passHref>
          <A variant="nav">Documentation</A>
        </Link>
        {!token && (
          <Fragment>
            <Link href="/login" passHref>
              <A variant="nav">Log in</A>
            </Link>
            <Link href="/register" passHref>
              <Button as="a" variant="outline" sx={{ ml: 3 }}>
                Sign up
              </Button>
            </Link>
          </Fragment>
        )}
        {token && (
          <Fragment>
            <Link href="/app/user" passHref>
              <A variant="nav">My Account</A>
            </Link>
          </Fragment>
        )}
        {user && user.admin && (
          <Fragment>
            <Link href="/app/admin" passHref>
              <A variant="nav">Admin</A>
            </Link>
          </Fragment>
        )}
      </Flex>
    </Container>
  );
};
