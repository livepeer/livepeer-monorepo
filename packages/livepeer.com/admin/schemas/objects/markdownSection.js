export default {
  type: "object",
  name: "markdownSection",
  title: "Markdown text",
  fields: [
    {
      name: "markdown",
      type: "markdown",
      title: "Markdown"
    }
  ],
  preview: {
    select: {
      heading: "markdownSection"
    },
    prepare({ heading }) {
      return {
        title: `Markdown section`
      };
    }
  }
};
