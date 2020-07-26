export default {
  type: 'object',
  name: 'jobsSection',
  title: 'Jobs Section',
  fields: [
    {
      name: 'jobs',
      title: 'Jobs',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'job' }],
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Jobs section',
      }
    },
  },
}
