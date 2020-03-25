import Fade from "react-reveal/Fade";
import Layout from "../components/Layout";
import { request } from "graphql-request";
import { print } from "graphql/language/printer";
import allPages from "../queries/allPages.gql";
import { getComponent } from "../lib/utils";

const Page = ({ title, content }) => {
  return (
    <Layout
      title={`${title} - Liveper`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
    >
      {content.map((component, i) => (
        <Fade key={i}>{getComponent(component)}</Fade>
      ))}
    </Layout>
  );
};

export async function getStaticPaths() {
  const { allPage } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allPages),
    {
      where: {}
    }
  );
  let paths = [];
  allPage.map(page => paths.push({ params: { slug: page.slug.current } }));
  return {
    fallback: false,
    paths
  };
}

export async function getStaticProps({ params }) {
  const variables = {
    where: {
      slug: { current: { eq: params.slug } }
    }
  };
  const { allPage } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allPages),
    variables
  );

  return {
    props: {
      ...allPage[0]
    },
    revalidate: true
  };
}

export default Page;
