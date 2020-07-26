export default {
  type: 'object',
  name: 'teamSection',
  title: 'Team Section',
  fields: [
    {
      name: 'teamMembers',
      type: 'array',
      title: 'Team Members',
      of: [{ type: 'teamMember' }],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Team section',
      }
    },
  },
}
