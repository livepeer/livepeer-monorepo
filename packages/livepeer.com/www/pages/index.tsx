import Fade from "react-reveal/Fade";
import Layout from "../components/Layout";
import { GraphQLClient } from "graphql-request";
import { print } from "graphql/language/printer";
import allPages from "../queries/allPages.gql";
import { getComponent } from "../lib/utils";

const Page = ({ content, preview }) => {
  return (
    <Layout
      title={`Home - Livepeer`}
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

export async function getStaticProps({ preview = false }) {
  const graphQLClient = new GraphQLClient(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    {
      ...(preview && {
        headers: {
          authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
      }),
    }
  );

  let data: any = await graphQLClient.request(print(allPages), {
    where: {
      _: { is_draft: preview },
      slug: { current: { eq: "home" } },
    },
  });

  // if in preview mode but no draft exists, then return published post
  if (preview && !data.allPage.length) {
    data = await graphQLClient.request(print(allPages), {
      where: {
        _: { is_draft: false },
        slug: { current: { eq: "home" } },
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
