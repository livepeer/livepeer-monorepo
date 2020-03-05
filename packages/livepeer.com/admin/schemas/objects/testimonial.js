export default {
  type: "object",
  name: "testimonial",
  title: "Testimonial",
  fields: [
    {
      name: "quote",
      type: "text",
      title: "Quote",
      rows: 5
    },
    {
      name: "name",
      type: "string",
      title: "Name"
    },
    {
      name: "company",
      type: "string",
      title: "Company"
    },
    {
      name: "role",
      type: "string",
      title: "Role"
    },
    {
      name: "image",
      type: "imageExtended",
      title: "Image"
    }
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "image"
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        media,
        subtitle
      };
    }
  }
};
