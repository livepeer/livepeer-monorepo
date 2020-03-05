export default {
  type: "object",
  name: "valuesSection",
  title: "Values Section",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      name: "values",
      type: "array",
      title: "Values",
      of: [{ type: "value" }]
    },
    {
      name: "image",
      type: "imageExtended",
      title: "Image"
    }
  ],
  preview: {
    select: {
      title: "heading",
      media: "image"
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "Values section",
        media
      };
    }
  }
};
