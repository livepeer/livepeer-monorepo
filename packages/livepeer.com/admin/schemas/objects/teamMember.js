export default {
  type: 'object',
  name: 'teamMember',
  title: 'Team Member',
  fields: [
    {
      name: 'fullname',
      type: 'string',
      title: 'Full name',
    },
    {
      name: 'role',
      type: 'string',
      title: 'Role',
    },
    {
      name: 'image',
      type: 'imageExtended',
      title: 'Image',
    },
    {
      name: 'twitter',
      type: 'url',
      title: 'Twitter',
    },
    {
      name: 'linkedin',
      type: 'url',
      title: 'LinkedIn',
    },
    {
      name: 'github',
      type: 'url',
      title: 'Github',
    },
    {
      name: 'medium',
      type: 'url',
      title: 'Medium',
    },
  ],
  preview: {
    select: {
      title: 'fullname',
      subtitle: 'role',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        media,
        subtitle,
      }
    },
  },
}
