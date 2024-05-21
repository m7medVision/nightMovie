import './globals.css'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-black">
        <main>{children}</main>
      </body>
    </html>
  )
}
