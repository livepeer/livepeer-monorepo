import { request } from "graphql-request";
import { print } from "graphql/language/printer";
import allCategories from "../../../queries/allCategories.gql";
import allPosts from "../../../queries/allPosts.gql";
import BlogIndex from "../index";

export async function getStaticPaths() {
  const { allCategory } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allCategories)
  );
  let paths = [];
  allCategory.map(c => paths.push({ params: { slug: c.slug.current } }));
  return {
    fallback: false,
    paths
  };
}

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
    { where: { category: { slug: { current: { eq: params.slug } } } } }
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
