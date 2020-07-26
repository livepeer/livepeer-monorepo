import { Box, Flex } from "@theme-ui/components";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";

const builder = imageUrlBuilder(client as any);

export default ({ quote, image, name, role, company, ...props }) => {
  return (
    <Box
      sx={{
        position: "relative",
        bg: "background",
        py: 50,
        px: 4,
        borderRadius: 8,
        width: "100%",
        border: "1px solid",
        borderColor: "muted",
        boxShadow:
          "0px 14px 40px rgba(224, 224, 224, 0.18), 0px 4px 7px rgba(0, 0, 0, 0.05)",
        ":before": {
          content: '"“"',
          position: "absolute",
          left: 20,
          fontWeight: "500",
          top: -10,
          fontSize: 150,
          color: "#E5FDF3",
          zIndex: 0
        }
      }}
      {...props}
    >
      <Box sx={{ position: "relative", pt: 3, pb: 3, px: 3 }}>
        <Box sx={{ fontWeight: 500, mb: 4, fontSize: 4 }}>{quote}</Box>
        <Flex
          sx={{
            fontWeight: 500,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ mr: 2 }}>
            <Box>{name}</Box>
            <Box>
              {role}, {company}
            </Box>
          </Box>
          <img
            alt={image.alt}
            className="lazyload"
            data-src={builder.image(image).url()}
            width={image.asset.metadata.dimensions.width}
            height={image.asset.metadata.dimensions.height}
            sx={{
              width: 118,
              height: 118,
              minWidth: 118,
              minHeight: 118,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 1000
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
};
