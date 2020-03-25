export default {
  type: "object",
  name: "contactSection",
  title: "Contact Section",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      type: "array",
      title: "Body",
      name: "body",
      of: [{ type: "block" }]
    }
  ],
  preview: {
    select: {
      title: "heading"
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Contact section"
      };
    }
  }
};
