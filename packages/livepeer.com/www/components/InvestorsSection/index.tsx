import { Styled } from "theme-ui";
import { Box, Grid, Container } from "@theme-ui/components";
import Star from "../../public/img/star.svg";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";

export default ({ heading, investors }) => {
  const builder = imageUrlBuilder(client as any);
  return (
    <Box sx={{ position: "relative", py: [40, 40, 120], bg: "secondary" }}>
      <Container>
        {heading && (
          <Styled.h2
            sx={{
              fontSize: [5, 5, 6],
              mb: [5, 5, 0],
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: 0,
              position: ["relative", "relative", "absolute"],
              textAlign: "center",
              top: [0, 0, -4],
              width: "100%"
            }}
          >
            <Star sx={{ display: ["none", "block"] }} />
            <Box sx={{ mx: 4 }}>{heading}</Box>
            <Star sx={{ display: ["none", "block"] }} />
          </Styled.h2>
        )}
      </Container>
      <Container>
        <Grid
          sx={{ justifyContent: "center", alignItems: "center" }}
          gap={[4, 4, 5]}
          columns={[3, 3, 5]}
        >
          {investors.map((investor, i) => (
            <img
              key={i}
              width={investor.asset.metadata.dimensions.width}
              height={investor.asset.metadata.dimensions.height}
              alt={investor.alt}
              sx={{
                width: [90, 90, "auto"],
                mb: [3, 3, 0],
                justifySelf: "center"
              }}
              className="lazyload"
              data-src={builder.image(investor).url()}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
