import { Flex, Heading, Container } from "@theme-ui/components";
import Link from "next/link";

export default ({ jobs }) => {
  return (
    <Container sx={{ maxWidth: 960, margin: "0 auto" }}>
      {jobs.map((j, i) => (
        <Flex
          key={i}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -1px 0 0 #f7f7f7",
            padding: 35,
            transition: "all 200ms ease-in-out",
            ":hover": {
              boxShadow: "0 0 30px 0 rgba(0,0,0,0.12)",
              borderRadius: "8px"
            }
          }}
        >
          <Link href="/jobs/[slug]" as={`/jobs/${j.slug.current}`} passHref>
            <a
              sx={{
                textDecoration: "none",
                ":hover": { textDecoration: "underline" }
              }}
            >
              <Heading
                as="h2"
                sx={{ fontWeight: 600, fontSize: 3, color: "black" }}
              >
                {j.title}
              </Heading>
            </a>
          </Link>
          <Link href="/jobs/[slug]" as={`/jobs/${j.slug.current}`} passHref>
            <a
              sx={{
                textDecoration: "none",
                ":hover": { textDecoration: "underline" },
                color: "extremelyBlue"
              }}
            >
              Apply
            </a>
          </Link>
        </Flex>
      ))}
    </Container>
  );
};
