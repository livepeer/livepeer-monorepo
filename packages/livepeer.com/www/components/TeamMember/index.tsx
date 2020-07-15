import { Box, Flex, Image, Heading, Link } from "@theme-ui/components";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";
import { FaTwitter, FaMedium, FaGithub, FaLinkedin } from "react-icons/fa";

export default ({
  fullname,
  image,
  role,
  twitter,
  github,
  linkedin,
  medium,
  ...props
}) => {
  const builder = imageUrlBuilder(client as any);

  return (
    <Box sx={{ textAlign: "center", mb: 6 }} {...props}>
      <Image
        sx={{
          borderRadius: 1000,
          width: 130,
          height: 130,
          objectFit: "cover",
          mb: 2
        }}
        width={130}
        height={130}
        className="lazyload"
        data-src={builder.image(image).url()}
      />
      <Box sx={{ mb: 2 }}>
        <Heading as="h3" sx={{ mb: 2, fontSize: 3, fontWeight: 600 }}>
          {fullname}
        </Heading>
        <Box sx={{ fontSize: 1, color: "rgba(0,0,0,.6)" }}>{role}</Box>
      </Box>
      <Flex
        sx={{
          maxWidth: 120,
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {twitter && (
          <Link
            sx={{ mx: 2, color: "black" }}
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </Link>
        )}
        {linkedin && (
          <Link
            sx={{ mx: 2, color: "black" }}
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </Link>
        )}
        {medium && (
          <Link
            sx={{ mx: 2, color: "black" }}
            href={medium}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaMedium />
          </Link>
        )}
        {github && (
          <Link
            sx={{ mx: 2, color: "black" }}
            href={github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </Link>
        )}
      </Flex>
    </Box>
  );
};
