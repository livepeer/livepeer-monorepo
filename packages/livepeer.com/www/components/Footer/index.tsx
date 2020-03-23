import { Flex, Container, Box } from "@theme-ui/components";
import Logo from "../../public/img/logo.svg";
import Link from "next/link";

export default () => {
  return (
    <Box
      sx={{
        py: 4,
        bg: "primary",
        boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.08)"
      }}
    >
      <Container>
        <Flex
          sx={{
            flexDirection: ["column", "column", "row"],
            alignItems: "center",
            textAlign: ["center", "center", "left"],
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Logo sx={{ color: "white" }} />
          </Box>
          <Box
            sx={{ mb: 2, color: "white" }}
            itemScope
            itemType="http://schema.org/Organization"
          >
            <Flex
              itemProp="address"
              itemScope
              itemType="http://schema.org/PostalAddress"
            >
              <Box itemProp="streetAddress" sx={{ mr: 1 }}>
                16 Vestry St, Floor 4
              </Box>
              <Box itemProp="addressLocality" sx={{ mr: 1 }}>
                New York, NY
              </Box>
              <Box itemProp="postalCode">10013</Box>
            </Flex>
          </Box>
          <Link href="/[slug]" as="/privacy-policy" passHref>
            <a sx={{ color: "accent" }}>Privacy Policy</a>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};
