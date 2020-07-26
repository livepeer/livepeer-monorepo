import Fade from "react-reveal/Fade";
import Layout from "../components/Layout";
import { GraphQLClient, request } from "graphql-request";
import { print } from "graphql/language/printer";
import allPages from "../queries/allPages.gql";
import { getComponent } from "../lib/utils";

const Page = ({ title, content, preview }) => {
  return (
    <Layout
      title={`${title} - Livepeer`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
      preview={preview}
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
      where: {},
    }
  );
  let paths = [];
  allPage.map((page) => paths.push({ params: { slug: page.slug.current } }));
  return {
    fallback: false,
    paths,
  };
}

export async function getStaticProps({ params, preview = false }) {
  const graphQLClient = new GraphQLClient(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    {
      headers: {
        authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
    }
  );

  let data: any = await graphQLClient.request(print(allPages), {
    where: {
      _: { is_draft: preview },
      slug: { current: { eq: params.slug } },
    },
  });

  // if in preview mode but no draft exists, then return published post
  if (preview && !data.allPage.length) {
    data = await graphQLClient.request(print(allPages), {
      where: {
        _: { is_draft: false },
        slug: { current: { eq: params.slug } },
      },
    });
  }

  return {
    props: {
      ...data.allPage[0],
      preview,
    },
    revalidate: true,
  };
}

export default Page;
