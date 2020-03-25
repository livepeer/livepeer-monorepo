export default {
  name: "imageExtended",
  title: "Image",
  type: "image",
  options: {
    hotspot: true
  },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      description: "Important for SEO and accessiblity.",
      validation: Rule =>
        Rule.error("You have to fill out the alternative text.").required(),
      options: {
        isHighlighted: true,
        metadata: ["dimensions", "location", "palette"]
      }
    }
  ],
  preview: {
    select: {
      title: "alt",
      imageUrl: "asset.url"
    }
  }
};
