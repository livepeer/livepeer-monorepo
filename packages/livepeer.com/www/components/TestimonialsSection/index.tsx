import { Styled } from "theme-ui";
import { Box, Grid, Container } from "@theme-ui/components";
import TestimonialCard from "../TestimonialCard";

export default ({ heading, testimonials }) => (
  <Box
    sx={{
      position: "relative",
      py: 88,
      overflow: "hidden",
      backgroundImage: "url(/img/triangle-bg.svg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom"
    }}
  >
    {heading && (
      <Styled.h2
        sx={{
          fontSize: [5, 5, 6],
          textAlign: "center",
          width: "100%",
          mb: 48
        }}
      >
        {heading}
      </Styled.h2>
    )}
    <Container>
      <Grid
        sx={{ justifyContent: "center", alignItems: "center" }}
        gap={[3, 3, 3, 4]}
        columns={[1, 1, 2]}
      >
        {testimonials.map((testimonial, i) => (
          <TestimonialCard
            key={i}
            quote={testimonial.quote}
            name={testimonial.name}
            role={testimonial.role}
            company={testimonial.company}
            image={testimonial.image}
          />
        ))}
      </Grid>
    </Container>
  </Box>
);
