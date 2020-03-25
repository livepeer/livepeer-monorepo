import Fade from "react-reveal/Fade";
import Layout from "../components/Layout";
import { request } from "graphql-request";
import { print } from "graphql/language/printer";
import allPages from "../queries/allPages.gql";
import { getComponent } from "../lib/utils";

const Page = ({ content }) => {
  return (
    <Layout>
      {content.map((component, i) => (
        <Fade key={i}>{getComponent(component)}</Fade>
      ))}
    </Layout>
  );
};

export async function getStaticProps() {
  const variables = {
    where: {
      slug: { current: { eq: "home" } }
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
