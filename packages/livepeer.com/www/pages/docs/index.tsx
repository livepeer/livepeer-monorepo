// import doesn't work, but require does?? weird.
import Text from "../../docs/index.mdx";
import Layout from "../../components/Layout";
import Container from "../../components/Container";

export default () => {
  return (
    <Layout
      title={`Documentation - Liveper`}
      description={`Scalable, secure live transcoding at a fraction of the cost`}
      url={`https://livepeer.com`}
    >
      <Container>
        <Text />
      </Container>
    </Layout>
  );
};
