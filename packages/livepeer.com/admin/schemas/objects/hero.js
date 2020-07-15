export default {
  type: 'object',
  name: 'hero',
  title: 'Hero',
  fields: [
    {
      name: 'heading',
      type: 'string',
      title: 'Heading',
    },
    {
      name: 'tagline',
      type: 'string',
      title: 'Tagline',
    },
    {
      name: 'centered',
      type: 'boolean',
      title: 'Centered',
    },
    {
      name: 'skinny',
      type: 'boolean',
      title: 'Skinny',
    },
    {
      name: 'image',
      type: 'imageExtended',
      title: 'Image',
      options: {
        hotspot: true,
        metadata: ['location', 'palette'],
      },
    },
    {
      name: 'ctas',
      type: 'array',
      title: 'Calls to action',
      of: [
        {
          title: 'Call to action',
          type: 'cta',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: 'Hero section',
        media,
      }
    },
  },
}
