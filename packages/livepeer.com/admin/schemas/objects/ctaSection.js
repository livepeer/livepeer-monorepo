export default {
  type: "object",
  name: "ctaSection",
  title: "CTA Section",
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading"
    },
    {
      name: "cta",
      type: "cta",
      title: "CTA"
    }
  ],
  preview: {
    select: {
      title: "heading"
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "CTA section"
      };
    }
  }
};
