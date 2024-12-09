export default function SessionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="p-4">{children}</main>
}
