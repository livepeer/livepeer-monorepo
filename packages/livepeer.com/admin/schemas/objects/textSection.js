export default {
  type: "object",
  name: "textSection",
  title: "Text section",
  fields: [
    {
      name: "text",
      type: "portableText",
      title: "Text"
    }
  ],
  preview: {
    select: {
      heading: "text"
    },
    prepare({ heading }) {
      return {
        title: `Text section`
      };
    }
  }
};
