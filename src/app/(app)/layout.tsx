import './globals.css'
import { Toaster } from "@/components/ui/toaster"
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
