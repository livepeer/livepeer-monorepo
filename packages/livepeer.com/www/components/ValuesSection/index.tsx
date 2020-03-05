import { Grid, Box } from "@theme-ui/components";
import { Styled } from "theme-ui";
import { Flex } from "@theme-ui/components";
import { Container } from "@theme-ui/components";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";

const builder = imageUrlBuilder(client as any);
const gridAreas = [
  "1 / 1 / 2 / 2",
  "1 / 2 / 2 / 3",
  "2 / 1 / 3 / 2",
  "2 / 2 / 3 / 3",
  "2 / 3 / 3 / 4"
];

export default ({ heading, image, values }) => (
  <Container
    sx={{
      pt: [50, 50, 100],
      pb: [50, 50, 150],
      position: "relative"
    }}
  >
    <img
      alt={image.alt}
      width={356}
      height={356}
      sx={{
        display: ["none", "none", "none", "block"],
        position: "absolute",
        top: 50,
        right: 0
      }}
      className="lazyload"
      data-src={builder.image(image).url()}
    />
    {heading && (
      <Styled.h2
        sx={{
          textAlign: ["center", "center", "left"],
          fontSize: [5, 5, 6],
          mb: [50, 50, 80]
        }}
      >
        {heading}
      </Styled.h2>
    )}
    <Grid gap={[3, 3, 3, 5]}>
      {values.map((value, i) => (
        <Flex
          key={i}
          sx={{
            alignItems: "flex-start",
            gridArea: ["auto", "auto", "auto", gridAreas[i]],
            mb: 4
          }}
        >
          <img
            alt={value.image.alt}
            width={70}
            height={70}
            sx={{
              height: "auto",
              mr: 4,
              width: [50, 50, 70],
              minWidth: [50, 50, 70]
            }}
            className="lazyload"
            data-src={builder.image(value.image).url()}
          />
          <Box>
            <Styled.h3
              sx={{
                mt: [1, 1, 2],
                fontSize: [4, 4, 5],
                mb: 3,
                fontWeight: 500
              }}
            >
              {value.heading}
            </Styled.h3>
            <Box>{value.description}</Box>
          </Box>
        </Flex>
      ))}
    </Grid>
  </Container>
);
