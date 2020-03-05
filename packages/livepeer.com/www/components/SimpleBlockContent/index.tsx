import BlockContent from "@sanity/block-content-to-react";
import Serializers from "../Serializers";

export default props => {
  const { blocks } = props;

  if (!blocks) {
    console.error("Missing blocks");
    return null;
  }

  return <BlockContent blocks={blocks} serializers={Serializers} />;
};
