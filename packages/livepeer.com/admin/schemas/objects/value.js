export default {
  type: "object",
  name: "value",
  title: "Value",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      name: "description",
      type: "string",
      title: "Description"
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
        media
      };
    }
  }
};
