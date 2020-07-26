import Layout from "../../components/Layout";
import { request } from "graphql-request";
import { print } from "graphql/language/printer";
import allCategories from "../../queries/allCategories.gql";
import allPosts from "../../queries/allPosts.gql";
import { Container, Flex, Box, Link as A } from "@theme-ui/components";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";
import readingTime from "reading-time";
import Link from "next/link";
import { useRouter } from "next/router";

const BlogIndex = ({ categories, posts }) => {
  const router = useRouter();
  const { slug } = router.query;
  const builder = imageUrlBuilder(client as any);

  return (
    <Layout
      title={`Blog - Liveper`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
    >
      <Container
        sx={{
          pb: 5,
          ul: { mb: 4 },
          p: { mb: 4 },
          margin: "0 auto"
        }}
      >
        <h1 sx={{ lineHeight: "72px", mt: 5, mb: 3, fontSize: 8 }}>Blog</h1>
        <p
          sx={{ maxWidth: 900, lineHeight: "32px", fontSize: 3, color: "grey" }}
        >
          Welcome to the Livepeer.com blog.
        </p>
        <Flex
          sx={{
            borderBottom: "1px solid rgba(55,54,77,.1)",
            alignItems: "center",
            mb: 4
          }}
        >
          {categories.map((c, i) => (
            <Link
              key={i}
              href={c.title === "All" ? "/blog" : `/blog/category/[slug]`}
              as={
                c.title === "All" ? "/blog" : `/blog/category/${c.slug.current}`
              }
              passHref
            >
              <A
                sx={{
                  display: "block",
                  color: "black",
                  textDecoration: "none"
                }}
              >
                <Box
                  key={i + 1}
                  sx={{
                    borderBottom: `2px solid  ${
                      slug === c.slug.current || (!slug && c.title === "All")
                        ? "black"
                        : "transparent"
                    }`,
                    pb: 3,
                    mr: 4
                  }}
                >
                  {c.title}
                </Box>
              </A>
            </Link>
          ))}
        </Flex>
        <Box>
          {posts.map((p, i) => {
            const stats = readingTime(p.body);
            return (
              <Link
                key={i}
                href="/blog/[slug]"
                as={`/blog/${p.slug.current}`}
                passHref
              >
                <A
                  sx={{
                    pb: 4,
                    mb: 4,
                    borderBottom: "1px solid rgba(55,54,77,.1)",
                    width: "100%",
                    display: "block",
                    textDecoration: "none",
                    color: "initial",
                    marginRight: "auto",
                    cursor: "pointer",
                    ":last-of-type": {
                      borderBottom: 0
                    }
                  }}
                >
                  <Flex sx={{ flexDirection: ["column", "column", "row"] }}>
                    {p.mainImage && (
                      <img
                        alt={p.mainImage.alt}
                        width={150}
                        height={200}
                        sx={{
                          mb: [3, 3, 0],
                          mt: [2, 0],
                          height: [260, 260, 180],
                          width: ["100%", "100%", 240],
                          objectFit: "cover",
                          mr: 4
                        }}
                        className="lazyload"
                        data-src={builder.image(p.mainImage).url()}
                      />
                    )}
                    <Box>
                      <Box sx={{ fontSize: 1, color: "grey", mb: 1 }}>
                        {new Date(p._createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </Box>
                      <h2 sx={{ fontSize: 5, mb: 3, transition: "color .3s" }}>
                        {p.title}
                      </h2>
                      <Box sx={{ mb: 3, color: "grey" }}>{p.excerpt}</Box>
                      <Flex sx={{ alignItems: "center" }}>
                        <img
                          alt={p.author.image.alt}
                          width={30}
                          height={30}
                          sx={{
                            mt: [2, 0],
                            height: 30,
                            width: 30,
                            borderRadius: 1000,
                            objectFit: "cover",
                            mr: 3
                          }}
                          className="lazyload"
                          data-src={builder.image(p.author.image).url()}
                        />
                        <Box>By {p.author.name}</Box>
                        <Box
                          sx={{ mx: 3, width: "1px", height: 16, bg: "grey" }}
                        />
                        <Box sx={{ color: "grey" }}>{p.category.title}</Box>
                        <Box
                          sx={{ mx: 3, width: "1px", height: 16, bg: "grey" }}
                        />
                        <Box sx={{ color: "grey" }}>{stats.text}</Box>
                      </Flex>
                    </Box>
                  </Flex>
                </A>
              </Link>
            );
          })}
        </Box>
      </Container>
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { allCategory: categories } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allCategories)
  );
  categories.push({ title: "All", slug: { current: "" } });
  const {
    allPost: posts
  } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allPosts),
    { where: {} }
  );

  return {
    props: {
      categories: categories.reverse(),
      posts
    },
    revalidate: true
  };
}

export default BlogIndex;
