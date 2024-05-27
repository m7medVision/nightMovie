import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headers() })
  // If the user is not logged in or does not have access to the app, redirect to the homepage
  // Only if the user is user(Admin) then he/she can access the app otherwise redirect he/she must have access to the app
  if (!user || (!user.hasAccess && user.collection == 'public-users')) {
    redirect('/')
  }
  return <>{children}</>
}
