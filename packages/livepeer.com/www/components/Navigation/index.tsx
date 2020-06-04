import { Flex } from "@theme-ui/components";
import Button from "../Button";
import Link from "next/link";
import Logo from "../../public/img/logo.svg";
import { useApi } from "../../hooks";
import { Fragment } from "react";

export default () => {
  const { token, user } = useApi();
  return (
    <Flex
      sx={{
        py: 3,
        px: [3, 4, 4, 5],
        justifyContent: "flex-end",
        alignItems: "center"
      }}
    >
      <Link href="/">
        <a
          sx={{
            marginRight: "auto",
            cursor: "pointer"
          }}
        >
          <Logo sx={{ width: 120, color: "primary" }} />
        </a>
      </Link>
      <Link href="/#contactSection">
        <a>
          <Button variant="text">Contact Us</Button>
        </a>
      </Link>
      <Link href="/docs">
        <a>
          <Button variant="text">Documentation</Button>
        </a>
      </Link>
      {!token && (
        <Fragment>
          <Link href="/login">
            <a>
              <Button variant="text">Log in</Button>
            </a>
          </Link>
          <Link href="/register">
            <a>
              <Button variant="outline">Sign up</Button>
            </a>
          </Link>
        </Fragment>
      )}
      {token && (
        <Fragment>
          <Link href="/app/user">
            <a>
              <Button variant="text">My account</Button>
            </a>
          </Link>
        </Fragment>
      )}
      {user && user.admin && (
        <Fragment>
          <Link href="/app/admin">
            <a>
              <Button variant="text">Admin</Button>
            </a>
          </Link>
        </Fragment>
      )}
    </Flex>
  );
};
