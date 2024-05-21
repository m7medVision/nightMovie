import type { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'hasAccess',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'whitelist',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
