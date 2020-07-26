import Layout from "../../components/Layout";
import { request } from "graphql-request";
import { print } from "graphql/language/printer";
import allJobs from "../../queries/allJobs.gql";
import { Container } from "@theme-ui/components";
import Hero from "../../components/Hero";
import ReactMarkdown from "react-markdown";

const Page = ({ title, body }) => {
  return (
    <Layout
      title={`${title} - Liveper`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
    >
      <Container
        sx={{
          pb: 5,
          ul: { mb: 4 },
          p: { mb: 4 },
          maxWidth: 960,
          margin: "0 auto"
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
      where: {}
    }
  );
  let paths = [];
  allJob.map(page => paths.push({ params: { slug: page.slug.current } }));
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
  const { allJob } = await request(
    "https://dp4k3mpw.api.sanity.io/v1/graphql/production/default",
    print(allJobs),
    variables
  );

  return {
    props: {
      ...allJob[0]
    },
    revalidate: true
  };
}

export default Page;
