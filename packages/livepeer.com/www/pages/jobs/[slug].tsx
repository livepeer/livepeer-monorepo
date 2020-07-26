import Layout from "../../components/Layout";
import { GraphQLClient, request } from "graphql-request";
import { print } from "graphql/language/printer";
import allJobs from "../../queries/allJobs.gql";
import { Container } from "@theme-ui/components";
import ReactMarkdown from "react-markdown";

const Page = ({ title, body, preview }) => {
  return (
    <Layout
      title={`${title} - Liveper`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
      preview={preview}
    >
      <Container
        sx={{
          pb: 5,
          ul: { mb: 4 },
          p: { mb: 4 },
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        <h1 sx={{ lineHeight: "72px", my: 5 }}>{title}</h1>
        <ReactMarkdown>{body}</ReactMarkdown>
      </Container>
    </Layout>
  );
};

export async function getStaticPaths() {
  const { allJob } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allJobs),
    {
      where: {},
    }
  );
  let paths = [];
  allJob.map((page) => paths.push({ params: { slug: page.slug.current } }));
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

  let data: any = await graphQLClient.request(print(allJobs), {
    where: {
      _: { is_draft: preview },
      slug: { current: { eq: params.slug } },
    },
  });

  // if in preview mode but no draft exists, then return published post
  if (preview && !data.allJob.length) {
    data = await graphQLClient.request(print(allJobs), {
      where: {
        _: { is_draft: false },
        slug: { current: { eq: params.slug } },
      },
    });
  }

  return {
    props: {
      ...data.allJob[0],
      preview,
    },
    revalidate: true,
  };
}

export default Page;
