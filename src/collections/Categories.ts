import type { CollectionConfig } from 'payload'

import { slugify } from '../utilities/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Generated from the name when you save; you can edit it if needed.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (typeof data.name === 'string' && data.name.length > 0) {
          const shouldRegenerate =
            operation === 'create' ||
            data.name !== (originalDoc && 'name' in originalDoc ? originalDoc.name : undefined)

          if (shouldRegenerate) {
            data.slug = slugify(data.name)
          }
        }
        return data
      },
    ],
  },
}
