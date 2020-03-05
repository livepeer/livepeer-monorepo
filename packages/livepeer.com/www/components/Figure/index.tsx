import React from "react";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../lib/client";

const builder = imageUrlBuilder(client as any);

export default ({ node }) => {
  const { alt, caption, asset } = node;
  if (!asset) {
    return undefined;
  }
  return (
    <figure>
      <img
        alt={alt}
        className="lazyload"
        data-src={builder
          .image(asset)
          .auto("format")
          .width(2000)
          .url()}
      />
      {caption && (
        <figcaption>
          <p>{caption}</p>
        </figcaption>
      )}
    </figure>
  );
};
