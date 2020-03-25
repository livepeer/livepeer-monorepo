export default {
  type: "object",
  name: "testimonialsSection",
  title: "Testimonials Section",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      name: "testimonials",
      type: "array",
      title: "Testimonials",
      of: [{ type: "testimonial" }]
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
        subtitle: "Testimonials section",
        media
      };
    }
  }
};
