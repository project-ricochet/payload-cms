import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { lexicalHasText } from '../utilities/lexicalHasText'
import { slugify } from '../utilities/slugify'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Generated from the title when you save; you can edit it if needed.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      // Inherits `editor: lexicalEditor()` from `payload.config.ts`. Defining another
      // `lexicalEditor()` here can desync the admin import map and hide the field in production.
      // Not `required: true`: Lexical treats the default empty paragraph as invalid; we enforce
      // body text when status is published in `beforeChange` instead.
      required: false,
      admin: {
        description:
          'Drafts may be saved with an empty body. Published posts must include at least one character of body text.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the post went or goes live (optional for drafts).',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        if (typeof data.title === 'string' && data.title.length > 0) {
          const previousTitle =
            originalDoc && 'title' in originalDoc ? (originalDoc.title as string | undefined) : undefined
          const shouldRegenerate = operation === 'create' || data.title !== previousTitle

          if (shouldRegenerate) {
            data.slug = slugify(data.title)
          }
        }

        const nextStatus =
          data.status !== undefined && data.status !== null
            ? data.status
            : originalDoc && 'status' in originalDoc
              ? (originalDoc.status as string)
              : 'draft'

        const content =
          data.content !== undefined && data.content !== null
            ? data.content
            : originalDoc && 'content' in originalDoc
              ? originalDoc.content
              : undefined

        if (nextStatus === 'published' && !lexicalHasText(content)) {
          throw new APIError(
            'Add body text to the Content field before publishing, or save as Draft.',
            400,
          )
        }

        return data
      },
    ],
  },
}
