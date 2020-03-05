export default {
  title: "Call to action",
  name: "cta",
  type: "object",
  validation: Rule =>
    Rule.custom(
      (fields = {}) =>
        [
          !!fields.internalLink,
          !!fields.externalLink,
          !!fields.anchorLink
        ].filter(link => link).length === 1 || "Only one link type is allowed"
    ),
  fieldsets: [
    {
      title: "Link",
      name: "link"
    }
  ],
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string"
    },
    {
      title: "Variant",
      name: "variant",
      type: "string",
      options: {
        list: ["primary", "secondary", "outline", "text"]
      }
    },
    {
      title: "Internal link",
      description: "Use this to link between pages on the website",
      name: "internalLink",
      type: "reference",
      to: [{ type: "page" }],
      fieldset: "link"
    },
    {
      title: "External link",
      name: "externalLink",
      type: "url",
      fieldset: "link"
    },
    {
      title: "Anchor link",
      name: "anchorLink",
      type: "string",
      fieldset: "link"
    }
  ],
  preview: {
    select: {
      title: "title"
    },
    prepare({ title }) {
      return {
        title: `${title}`
      };
    }
  }
};
