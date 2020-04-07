export default {
  type: "object",
  name: "investorsSection",
  title: "Investors Section",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      name: "investors",
      type: "array",
      title: "Investors",
      of: [{ type: "imageExtended" }]
    }
  ],
  preview: {
    select: {
      title: "heading"
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Investors section"
      };
    }
  }
};
