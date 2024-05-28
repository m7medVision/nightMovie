
import type { Access, CollectionConfig  } from 'payload/types'
const canAccess: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  if (user.id === id) return true
  return false
}
export const PublicUsers: CollectionConfig = {
  slug: 'public-users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    read: canAccess,
    update: canAccess,
    delete: canAccess,
  },
  fields: [
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
