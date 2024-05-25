import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth( {headers: headers() })
  if (!user || user.hasAccess !== true) {
    redirect('/')
  }
  return <>{children}</>
}
