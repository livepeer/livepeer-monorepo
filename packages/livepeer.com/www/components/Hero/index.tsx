import { Styled } from "theme-ui";
import { Grid, Flex, Container, Box } from "@theme-ui/components";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";
import Button from "../Button";
import { Link as ScrollLink } from "react-scroll";
import ArrowRight from "../../public/img/arrow-right.svg";

export default ({
  heading,
  tagline,
  centered = false,
  image,
  ctas,
  ...props
}) => {
  const builder = imageUrlBuilder(client as any);
  return (
    <Box
      sx={{
        mt: [5, 5, 5, 0],
        overflow: "hidden",
        borderBottom: "1px solid",
        borderColor: "muted",
        pb: 5
      }}
      {...props}
    >
      <Container>
        <Grid
          columns={[1, 1, 1, centered ? 1 : 2]}
          sx={{ alignItems: "center", minHeight: ["auto", "auto", 400] }}
        >
          <Box
            sx={{
              mb: [4, 4, 4, 0],
              maxWidth: 525,
              mx: ["auto", "auto", "auto", centered ? "auto" : "initial"],
              textAlign: [
                "center",
                "center",
                "center",
                centered ? "center" : "left"
              ]
            }}
          >
            {heading && (
              <Styled.h1
                sx={{
                  fontSize: [30, 30, 7]
                }}
              >
                {heading}
              </Styled.h1>
            )}
            {tagline && (
              <Box
                sx={{
                  mt: 4,
                  fontSize: "18px"
                }}
              >
                {tagline}
              </Box>
            )}
            {ctas && (
              <Flex
                sx={{
                  mt: "44px",
                  flexDirection: ["column", "row"],
                  justifyContent: [
                    "center",
                    "center",
                    "center",
                    centered ? "center" : "flex-start"
                  ],
                  width: "100%",
                  alignItems: "center"
                }}
              >
                {ctas.map((cta, i) => (
                  <Box key={i}>{renderSwitch(cta)}</Box>
                ))}
              </Flex>
            )}
          </Box>
          {image && (
            <img
              alt={image.alt}
              width={525}
              height={846}
              sx={{
                mt: [2, 0],
                height: ["auto", "auto", 525],
                width: ["100%", "100%", "100%", centered ? "'100%'" : "auto"],
                mr: [0, 0, -260]
              }}
              className="lazyload"
              data-src={builder.image(image).url()}
            />
          )}
        </Grid>
      </Container>
    </Box>
  );
};

function renderSwitch(cta) {
  switch (true) {
    case !!cta.internalLink?.slug?.current:
      return <Button variant="primary">{cta.title}</Button>;
    case !!cta.externalLink:
      return (
        <Button
          variant={cta.variant}
          as="a"
          target="__blank"
          href={cta.externalLink}
        >
          {cta.title}
          <ArrowRight sx={{ ml: 2 }} />
        </Button>
      );
    default:
      return (
        <ScrollLink offset={-40} to={cta.anchorLink} spy smooth>
          <Button variant="primary">{cta.title}</Button>
        </ScrollLink>
      );
  }
}
