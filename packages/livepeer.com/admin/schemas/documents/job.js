export default {
  name: 'job',
  type: 'document',
  title: 'Job',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Job Title',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'body',
      type: 'markdown',
      title: 'Body',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
    },
    prepare({ title = 'No title' }) {
      return {
        title,
      }
    },
  },
}
