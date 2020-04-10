import { Flex } from "@theme-ui/components";
import Button from "../Button";
import Link from "next/link";
import Logo from "../../public/img/logo.svg";

export default () => {
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
            marginRight: "auto"
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
    </Flex>
  );
};
