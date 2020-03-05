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
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Link href="/">
        <a>
          <Logo sx={{ width: 120, color: "primary" }} />
        </a>
      </Link>
      <Link href="/#contactSection">
        <a>
          <Button variant="outline">Contact Us</Button>
        </a>
      </Link>
    </Flex>
  );
};
